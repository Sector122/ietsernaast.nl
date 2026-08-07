"use client";
import { useEffect } from "react";
import { getClickId } from "@/lib/analytics/click-id";
import { trackTikTok } from "@/lib/analytics/tiktok";
import { ROUTE_LOCALE_ALIASES } from "@/lib/i18n/config";

declare global {
  interface Window {
    fbq?: (
      cmd: string,
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string },
    ) => void;
  }
}

function localeFromPath(pathname: string): string {
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  // Alias-aware so standalone routes (e.g. /tro) report their real locale.
  const aliased = ROUTE_LOCALE_ALIASES[first];
  if (aliased) return aliased;
  return /^[a-z]{2,8}$/.test(first) ? first : "en";
}

// Fires Meta Pixel `Lead` event (browser) + Conversions API mirror (server)
// with a shared eventID for dedup. Trigger: any Telegram CTA.
export default function TrackLead() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;

      const isCta =
        a.classList.contains("btn") ||
        a.classList.contains("sticky-cta") ||
        a.classList.contains("chan-btn");
      if (!isCta) return;

      const href = a.getAttribute("href") ?? "";
      // Telegram CTAs and the dual-channel WhatsApp button (.chan-btn--wa,
      // wa.me) both represent a Lead — count either as the Meta Lead so the
      // dual-channel locales (e.g. fi) are tracked like the single-button ones.
      if (!/^https?:\/\/(t\.me|telegram\.me|wa\.me)\//i.test(href)) return;

      const eventID =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const sourceUrl = window.location.href;
      const customData = {
        content_name: "telegram_cta",
        source_url: sourceUrl,
      };

      const fbq = window.fbq;
      if (typeof fbq === "function") {
        fbq("track", "Lead", customData, { eventID });
      }

      // CAPI mirror — fire and forget; keepalive lets it survive navigation.
      try {
        fetch("/api/meta/track", {
          method: "POST",
          headers: { "content-type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            eventName: "Lead",
            eventID,
            sourceUrl,
            locale: localeFromPath(window.location.pathname),
            customData,
            clickId: getClickId(),
          }),
        }).catch(() => {});
      } catch {
        // ignore
      }

      trackTikTok("Contact", {
        contents: [
          {
            content_id: href.includes("wa.me")
              ? "sector1_whatsapp"
              : "sector1_telegram",
            content_type: "product",
            content_name: "Sector1 messaging contact",
          },
        ],
      });
    };

    document.addEventListener("click", handler, { capture: true });
    return () =>
      document.removeEventListener("click", handler, { capture: true });
  }, []);

  return null;
}
