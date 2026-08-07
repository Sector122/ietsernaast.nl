import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendCapiEvent } from "@/lib/meta/capi";
import { isLocale } from "@/lib/i18n";
import { clientIp } from "@/lib/http/ip";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Standard Meta events accepted from the browser. Anything else is rejected so
// this endpoint can't be used as a generic relay to fire arbitrary event names
// (or Purchase, which is server-only) into the pixels.
const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "Lead",
  "InitiateCheckout",
  "AddToCart",
  "AddPaymentInfo",
  "CompleteRegistration",
  "Contact",
  "Subscribe",
  "Search",
]);

type Body = {
  eventName: string;
  eventID: string;
  sourceUrl?: string;
  locale?: string;
  customData?: Record<string, unknown>;
  // Optional PII — hashed before sending.
  email?: string;
  phone?: string;
  // Visitor click_id → hashed external_id (see lib/meta/capi.ts).
  clickId?: string;
};

function localeFromPath(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  return isLocale(first) ? first : "en";
}

export async function POST(req: NextRequest) {
  const limiter = getCloudflareContext().env.PUBLIC_RATE_LIMITER;
  if (!(await rateLimit(limiter, `track:${clientIp(req) || "unknown"}`))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body?.eventName || !body?.eventID) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!ALLOWED_EVENTS.has(body.eventName)) {
    return NextResponse.json({ error: "invalid_event" }, { status: 400 });
  }

  const locale =
    body.locale && isLocale(body.locale)
      ? body.locale
      : localeFromPath(new URL(body.sourceUrl ?? req.url).pathname);

  // Fire-and-forget. Do NOT echo Meta's response back to the caller — it would
  // leak pixel IDs / API status as a success oracle for abuse probing.
  await sendCapiEvent(req, {
    eventName: body.eventName,
    eventID: body.eventID,
    sourceUrl: body.sourceUrl,
    locale,
    customData: body.customData,
    email: body.email,
    phone: body.phone,
    clickId: body.clickId,
  });

  return NextResponse.json({ ok: true });
}
