import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/onboarding/sign";
import { isGenericToken } from "@/lib/onboarding/generic";
import {
  COUNTRY_CODES,
  CURRENCY_CODES,
  DIAL_CODES,
} from "@/lib/onboarding/countries";
import {
  claimConversion,
  insertSubmission,
  tokenStats,
  type TokenStats,
} from "@/lib/onboarding/db";
import { sendCapiEvent } from "@/lib/meta/capi";
import { upsertBrevoContact } from "@/lib/brevo";
import { clientIp } from "@/lib/http/ip";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// One submission per token per hour, five per token lifetime — a valid link
// holder can correct a typo later without spamming stored submissions.
const RESUBMIT_COOLDOWN_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

type Body = {
  id?: string;
  sig?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_dial?: string;
  phone_number?: string;
  country?: string;
  deposit_amount?: number;
  deposit_currency?: string;
  source_url?: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return bad("invalid_json");
  }

  // The generic link is a permanent, shareable URL with no signature (anyone
  // can open it), so it's gated by a per-IP rate limit instead. Every other id
  // still requires a valid signature — same response for malformed id and wrong
  // sig, no oracle.
  const token = str(body.id).toLowerCase();
  if (isGenericToken(token)) {
    const limiter = getCloudflareContext().env.PUBLIC_RATE_LIMITER;
    if (!(await rateLimit(limiter, `onboarding:${clientIp(req) || "unknown"}`))) {
      return bad("too_many_attempts", 429);
    }
  } else if (!verifyToken(token, str(body.sig))) {
    return bad("invalid_link", 403);
  }

  const firstName = str(body.first_name);
  const lastName = str(body.last_name);
  if (!firstName || firstName.length > 100) return bad("invalid_first_name");
  if (!lastName || lastName.length > 100) return bad("invalid_last_name");

  const email = str(body.email).toLowerCase();
  if (!EMAIL_RE.test(email)) return bad("invalid_email");

  // Phone is optional; when present it needs a known dial code.
  const dial = str(body.phone_dial);
  const phoneDigits = str(body.phone_number).replace(/[\s().-]/g, "");
  let phone: string | null = null;
  if (phoneDigits) {
    if (!/^\d{4,14}$/.test(phoneDigits) || !DIAL_CODES.has(dial)) {
      return bad("invalid_phone");
    }
    phone = `+${dial}${phoneDigits}`;
  }

  const country = str(body.country).toUpperCase();
  if (!COUNTRY_CODES.has(country)) return bad("invalid_country");

  const rawAmount = body.deposit_amount;
  if (typeof rawAmount !== "number" || !Number.isFinite(rawAmount)) {
    return bad("invalid_amount");
  }
  const amount = Math.round(rawAmount * 100) / 100;
  if (amount <= 0 || amount > 1_000_000) return bad("invalid_amount");

  const currency = str(body.deposit_currency).toUpperCase();
  if (!CURRENCY_CODES.has(currency)) return bad("invalid_currency");

  // Strip the query from the reported URL so the signature never leaves us
  // (Meta would otherwise receive a working signed link in event_source_url).
  let sourceUrl: string | null = null;
  try {
    const u = new URL(body.source_url ?? req.url);
    sourceUrl = `${u.origin}/onboarding`;
  } catch {
    /* keep null */
  }

  // The generic link is shared and unsigned, so it has no per-token resubmit
  // throttle and never exposes whether an email has submitted before. It still
  // reports a Purchase (keyed per submission row) — see the conversion gate below.
  const generic = isGenericToken(token);
  let canClaimConversion = false;
  if (!generic) {
    // Fail CLOSED: if the per-token counters can't be read, reject rather than
    // silently degrade to "first submission" — which would bypass the resubmit
    // caps and fire an unverified Purchase on every retry.
    // (Residual: the count check and the insert below are not one atomic
    // transaction, so tightly concurrent submits on a single link can slip a few
    // extra rows past the cap; the deterministic CAPI event_id still dedupes the
    // conversion, so the impact is limited to extra stored rows.)
    let stats: TokenStats;
    try {
      stats = await tokenStats(token);
    } catch (err) {
      console.error("onboarding: tokenStats failed", err);
      return bad("unavailable", 503);
    }
    if (stats.count >= MAX_SUBMISSIONS) return bad("too_many_submissions", 429);
    if (stats.lastAt !== null && Date.now() - stats.lastAt < RESUBMIT_COOLDOWN_MS) {
      return bad("too_soon", 429);
    }
    canClaimConversion = stats.count === 0;
  }

  let rowId: number;
  try {
    rowId = await insertSubmission({
      token,
      firstName,
      lastName,
      email,
      phone,
      country,
      depositAmount: amount,
      depositCurrency: currency,
      sourceUrl,
      ip: clientIp(req) || null,
      userAgent: req.headers.get("user-agent") || null,
      // Retained with the submission for attribution and audit purposes.
      fbp: req.cookies.get("_fbp")?.value || null,
      fbc: req.cookies.get("_fbc")?.value || null,
    });
  } catch (err) {
    console.error("onboarding: insertSubmission failed", err);
    return bad("unavailable", 503);
  }

  // Decide whether this submission reports a Purchase, and under which event_id.
  //   - Signed link: one Purchase per token (the first submission), joined to
  //     the ad click via external_id and deduped through the claims table.
  //   - Generic link: the token is shared by everyone, so it can't gate per
  //     person. Every submission row is its own conversion, keyed by row id to
  //     match the admin re-fire (app/api/admin/submissions/route.ts) so Meta
  //     dedups if an admin later re-verifies the row. No external_id is sent —
  //     there is no attributable ad click behind a generic submission.
  let conversion = false;
  let purchaseEventId = "";
  if (generic) {
    conversion = true;
    purchaseEventId = `onb-purchase-generic-${rowId}`;
  } else if (canClaimConversion) {
    try {
      conversion = await claimConversion(token);
    } catch (err) {
      // The submission is safely stored. Fail closed for conversion reporting
      // rather than risk a duplicate Purchase if the claim result is unknown.
      console.error("onboarding: conversion claim failed", err);
    }
    purchaseEventId = `onb-purchase-${token}`;
  }

  // Purchase reported per the gate above: the form is filled after the user has
  // deposited, so the submission itself is the verified conversion. Brevo upsert
  // is idempotent, so it runs every time and resubmits refresh contact data. The
  // user's success screen never waits on third parties.
  await Promise.allSettled([
    ...(conversion
      ? [
          sendCapiEvent(req, {
            eventName: "Purchase",
            eventID: purchaseEventId,
            sourceUrl: sourceUrl ?? undefined,
            locale: "en",
            email,
            phone: phone ?? undefined,
            // The 16-hex token passes through tokenFromClickId() unchanged and
            // lands in external_id, joining this Purchase to earlier Lead events.
            // Omitted for the generic link (the shared token is not a real
            // click, so it must not become a shared external_id).
            clickId: generic ? undefined : token,
            customData: {
              value: amount,
              currency,
              content_name: "onboarding_form",
              country,
            },
          }),
        ]
      : []),
    upsertBrevoContact({
      email,
      locale: "en",
      clickId: generic ? undefined : token,
      ctaLocation: "onboarding_form",
      sourceUrl: sourceUrl ?? undefined,
      firstName,
      lastName,
      phone: phone ?? undefined,
    }),
  ]);

  return NextResponse.json({ ok: true, conversion });
}
