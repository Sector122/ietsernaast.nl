import { NextRequest, NextResponse } from "next/server";
import { apiUser } from "@/lib/admin/auth";
import {
  getSubmissionById,
  isSubmissionStatus,
  listSubmissions,
  updateSubmission,
  type EditableSubmission,
  type SubmissionFilter,
  type SubmissionRow,
} from "@/lib/onboarding/db";
import { COUNTRY_CODES, CURRENCY_CODES } from "@/lib/onboarding/countries";
import { isGenericToken } from "@/lib/onboarding/generic";
import { sendCapiEvent } from "@/lib/meta/capi";

// Admin-only submission operations: PATCH edits any subset of the row's
// editable fields (incl. status), GET exports the (filtered) table as CSV.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_RE = /^\+[1-9]\d{5,17}$/;

// Meta rejects events older than 7 days; clamp with half a day of margin.
const CAPI_MAX_AGE_S = Math.floor(6.5 * 24 * 3600);

// The verified conversion: fired on the transition INTO handled, backdated to
// the submission moment, replaying the member's own browser signals stored
// with the row (ip/ua/fbp/fbc — NOT the admin's). The deterministic event_id
// keeps an accidental handle → pending → handle toggle from double counting.
function sendVerifiedPurchase(row: SubmissionRow, edited: EditableSubmission) {
  // Generic (shared-token) rows can't dedupe on the token — many people share
  // it — so key the Purchase on the unique submission id, and send no
  // external_id (there's no real ad click behind a generic submission).
  const generic = isGenericToken(row.token);
  return sendCapiEvent(null, {
    eventName: "Purchase",
    eventID: generic
      ? `onb-purchase-generic-${row.id}`
      : `onb-purchase-${row.token}`,
    sourceUrl: row.source_url ?? undefined,
    locale: "en",
    email: edited.email,
    phone: edited.phone ?? undefined,
    clickId: generic ? undefined : row.token,
    eventTime: Math.max(
      row.created_at,
      Math.floor(Date.now() / 1000) - CAPI_MAX_AGE_S,
    ),
    ip: row.ip ?? undefined,
    userAgent: row.user_agent ?? undefined,
    fbp: row.fbp ?? undefined,
    fbc: row.fbc ?? undefined,
    customData: {
      value: edited.deposit_amount,
      currency: edited.deposit_currency,
      content_name: "onboarding_form",
      country: edited.country,
    },
  });
}

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

type PatchBody = {
  id?: number;
  status?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  country?: string;
  deposit_amount?: number;
  deposit_currency?: string;
};

/**
 * Merges the provided fields over the stored row, validating each. Returns an
 * error code string instead of the merge when something is invalid.
 */
function mergeEdits(row: SubmissionRow, body: PatchBody): EditableSubmission | string {
  const out: EditableSubmission = {
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    phone: row.phone,
    country: row.country,
    deposit_amount: row.deposit_amount,
    deposit_currency: row.deposit_currency,
    status: row.status,
  };

  if (body.first_name !== undefined) {
    const v = String(body.first_name).trim();
    if (!v || v.length > 100) return "invalid_first_name";
    out.first_name = v;
  }
  if (body.last_name !== undefined) {
    const v = String(body.last_name).trim();
    if (!v || v.length > 100) return "invalid_last_name";
    out.last_name = v;
  }
  if (body.email !== undefined) {
    const v = String(body.email).trim().toLowerCase();
    if (!EMAIL_RE.test(v)) return "invalid_email";
    out.email = v;
  }
  if (body.phone !== undefined) {
    const v = String(body.phone).replace(/[\s().-]/g, "");
    if (v && !PHONE_RE.test(v)) return "invalid_phone";
    out.phone = v || null;
  }
  if (body.country !== undefined) {
    const v = String(body.country).toUpperCase();
    if (!COUNTRY_CODES.has(v)) return "invalid_country";
    out.country = v;
  }
  if (body.deposit_amount !== undefined) {
    const v = typeof body.deposit_amount === "number" ? Math.round(body.deposit_amount * 100) / 100 : NaN;
    if (!Number.isFinite(v) || v <= 0 || v > 1_000_000) return "invalid_amount";
    out.deposit_amount = v;
  }
  if (body.deposit_currency !== undefined) {
    const v = String(body.deposit_currency).toUpperCase();
    if (!CURRENCY_CODES.has(v)) return "invalid_currency";
    out.deposit_currency = v;
  }
  if (body.status !== undefined) {
    if (!isSubmissionStatus(body.status)) return "invalid_status";
    out.status = body.status;
  }
  return out;
}

async function requireAdminApi(req: NextRequest) {
  const user = await apiUser(req);
  return user?.role === "admin" ? user : null;
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdminApi(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: PatchBody;
  try {
    body = (await req.json()) as PatchBody;
  } catch {
    return bad("invalid_json");
  }
  if (typeof body.id !== "number" || !Number.isSafeInteger(body.id)) {
    return bad("invalid_id");
  }

  const row = await getSubmissionById(body.id);
  if (!row) return bad("not_found", 404);

  const merged = mergeEdits(row, body);
  if (typeof merged === "string") return bad(merged);

  await updateSubmission(body.id, merged);

  if (merged.status === "handled" && row.status !== "handled") {
    // Fire-and-forget: the edit must never fail because Meta did.
    await Promise.allSettled([sendVerifiedPurchase(row, merged)]);
  }

  return NextResponse.json({ ok: true });
}

// Excel treats leading =+-@ as formulas — neutralize, then quote.
function csvCell(v: string | number | null): string {
  if (v === null) return "";
  let s = String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdminApi(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const p = req.nextUrl.searchParams;
  const filter: SubmissionFilter = {};
  const q = p.get("q")?.trim();
  if (q) filter.q = q;
  const status = p.get("status");
  if (isSubmissionStatus(status)) filter.status = status;
  const since = Number(p.get("since"));
  if (Number.isSafeInteger(since) && since > 0) filter.since = since;

  const rows = await listSubmissions({ ...filter, limit: 5000 });

  const header = "id,token,first_name,last_name,email,phone,country,deposit_amount,deposit_currency,status,created_at";
  const lines = rows.map((r) =>
    [
      r.id,
      r.token,
      csvCell(r.first_name),
      csvCell(r.last_name),
      csvCell(r.email),
      csvCell(r.phone),
      r.country,
      r.deposit_amount,
      r.deposit_currency,
      r.status,
      new Date(r.created_at * 1000).toISOString(),
    ].join(","),
  );

  return new NextResponse([header, ...lines].join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="submissions.csv"',
    },
  });
}
