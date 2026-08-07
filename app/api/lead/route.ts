import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { isLocale } from "@/lib/i18n";
import { sendCapiEvent } from "@/lib/meta/capi";
import { upsertBrevoContact } from "@/lib/brevo";
import { clientIp } from "@/lib/http/ip";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Body = {
  email?: string;
  locale?: string;
  click_id?: string;
  cta_location?: string;
  source_url?: string;
};

function resolveLocale(body: Body, req: NextRequest): string {
  if (body.locale && isLocale(body.locale)) return body.locale;
  try {
    const path = new URL(body.source_url ?? req.url).pathname;
    const first = path.split("/").filter(Boolean)[0] ?? "";
    return isLocale(first) ? first : "en";
  } catch {
    return "en";
  }
}

export async function POST(req: NextRequest) {
  const limiter = getCloudflareContext().env.PUBLIC_RATE_LIMITER;
  if (!(await rateLimit(limiter, `lead:${clientIp(req) || "unknown"}`))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const locale = resolveLocale(body, req);

  // Fire-and-forget both sinks; never block or error the user's handoff.
  await Promise.allSettled([
    sendCapiEvent(req, {
      eventName: "Lead",
      eventID: randomUUID(),
      sourceUrl: body.source_url,
      locale,
      email,
      clickId: body.click_id,
      customData: {
        content_name: "handoff_email",
        cta_location: body.cta_location,
      },
    }),
    upsertBrevoContact({
      email,
      locale,
      clickId: body.click_id,
      ctaLocation: body.cta_location,
      sourceUrl: body.source_url,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
