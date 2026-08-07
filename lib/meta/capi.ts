import type { NextRequest } from "next/server";
import crypto from "node:crypto";
import { regionsForLocale, type Region } from "@/lib/meta-pixel";
import { tokenFromClickId } from "@/lib/analytics/tg-payload";
import { clientIp } from "@/lib/http/ip";

// Shared Meta Conversions API sender, used by both /api/meta/track and
// /api/lead so the per-region fan-out, hashing, and payload shape live in one
// place. Server-only (reads cookies/headers and uses node:crypto).

const API_VERSION = "v19.0";

function pixelConfigFor(region: Region): { id: string; token: string } | null {
  if (region === "balkan") {
    const id = process.env.META_PIXEL_BALKAN_ID ?? "";
    const token = process.env.META_PIXEL_BALKAN_TOKEN ?? "";
    return id && token ? { id, token } : null;
  }
  const id = process.env.META_PIXEL_NORDIC_ID ?? "";
  const token = process.env.META_PIXEL_NORDIC_TOKEN ?? "";
  return id && token ? { id, token } : null;
}

function sha256Lower(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

export type CapiEvent = {
  eventName: string;
  eventID: string;
  sourceUrl?: string;
  locale: string;
  customData?: Record<string, unknown>;
  // Optional PII — hashed before sending.
  email?: string;
  phone?: string;
  // Persistent visitor click_id (lib/analytics/click-id.ts). Its first 16 hex
  // chars (the token) are hashed into external_id so a later Purchase event —
  // fired by the bot, which only knows the token from the Telegram draft —
  // joins back to this click in Meta.
  clickId?: string;
  // Epoch SECONDS. Defaults to now; Meta accepts up to 7 days in the past.
  eventTime?: number;
  // Optional browser signals for events without an originating request.
  ip?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
};

export type CapiResult = {
  region: Region;
  ok: boolean;
  status?: number;
  response?: unknown;
  error?: string;
};

/**
 * Sends a single event to every Meta pixel that the locale maps to. Never
 * throws — failures are returned per region so callers can fire-and-forget.
 * Pass `req: null` for events with no originating member request. In that
 * case, cookies/headers are skipped and the event's own fields are used.
 */
export async function sendCapiEvent(
  req: NextRequest | null,
  event: CapiEvent,
): Promise<CapiResult[]> {
  const regions = regionsForLocale(event.locale);

  const fbp = req?.cookies.get("_fbp")?.value ?? event.fbp;
  const fbc = req?.cookies.get("_fbc")?.value ?? event.fbc;
  const ua = (req ? req.headers.get("user-agent") : event.userAgent) ?? "";
  const ip = req ? clientIp(req) : (event.ip ?? "");

  const userData: Record<string, unknown> = {
    client_ip_address: ip || undefined,
    client_user_agent: ua || undefined,
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  };
  if (event.email) userData.em = [sha256Lower(event.email)];
  if (event.phone) userData.ph = [sha256Lower(event.phone.replace(/\D/g, ""))];
  // external_id is the 16-hex TOKEN (first half of the click_id), not the full
  // click_id: the token is the only value that reaches Telegram (the invisible
  // draft payload), so a later Purchase event fired by the bot can send the
  // same value and let Meta join the two events. Sent PLAINTEXT — Meta allows
  // it for external_id (unlike em/ph), and the token is an opaque random id,
  // not PII. The bot's Purchase must send this exact token, unhashed, to match.
  const token = event.clickId ? tokenFromClickId(event.clickId) : "";
  if (token) userData.external_id = [token];

  const eventPayload = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventID,
        action_source: "website",
        event_source_url:
          event.sourceUrl ?? req?.headers.get("referer") ?? "",
        user_data: userData,
        custom_data: event.customData ?? {},
      },
    ],
  };

  return Promise.all(
    regions.map(async (region): Promise<CapiResult> => {
      const cfg = pixelConfigFor(region);
      if (!cfg) {
        // No pixel id/token for this region — the event is dropped. Log it so a
        // missing var/secret doesn't fail conversions silently.
        console.error(
          `[capi] ${event.eventName} dropped: missing env for ${region} pixel`,
        );
        return { region, ok: false, error: "missing_env" };
      }

      const url = `https://graph.facebook.com/${API_VERSION}/${cfg.id}/events?access_token=${encodeURIComponent(
        cfg.token,
      )}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
        const json = (await res.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        // Meta returns 200 with { events_received } on success, or an { error }
        // object (often still HTTP 200-ish) on a bad token / wrong pixel. Log
        // both outcomes — the token/pixel is the one thing not visible from
        // outside, and callers fire-and-forget this result.
        if (!res.ok || (json as { error?: unknown }).error) {
          console.error(
            `[capi] ${event.eventName} rejected by ${region} pixel ${cfg.id} (HTTP ${res.status}): ${JSON.stringify(json)}`,
          );
        } else {
          console.log(
            `[capi] ${event.eventName} accepted by ${region} pixel ${cfg.id}: ${JSON.stringify(json)}`,
          );
        }
        return { region, ok: res.ok, status: res.status, response: json };
      } catch (err) {
        console.error(
          `[capi] ${event.eventName} fetch failed for ${region} pixel ${cfg.id}:`,
          err,
        );
        return {
          region,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }),
  );
}
