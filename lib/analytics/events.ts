"use client";

// Event-name constants + pure helpers for the Mixpanel layer.
// No SDK calls here — these just compute props so the tracker components and
// the wrapper stay thin and testable. Nothing here throws.

import {
  isLocale,
  localeForSegment,
  DEFAULT_LOCALE,
  type Locale,
} from "@/lib/i18n";
import { regionsForLocale, type Region } from "@/lib/meta-pixel";
import { encodePayload, tokenFromClickId } from "./tg-payload";
import type { AnalyticsProps } from "./mixpanel";

export { regionsForLocale };

export const EVENTS = {
  PAGE_VIEWED: "Page Viewed",
  PAGE_PERFORMANCE: "Page Performance",
  SECTION_VIEWED: "Section Viewed",
  SCROLL_DEPTH: "Scroll Depth",
  VIDEO_STARTED: "Video Started",
  VIDEO_UNMUTED: "Video Unmuted",
  VIDEO_PROGRESS: "Video Progress",
  VIDEO_COMPLETED: "Video Completed",
  CTA_CLICKED: "CTA Clicked",
  LEAD: "Lead",
  TELEGRAM_HANDOFF: "Telegram Handoff",
  REVIEWS_INTERACT: "Reviews Interact",
  WHY_JOIN_CARD_OPENED: "Why Join Card Opened",
  HANDOFF_MODAL_SHOWN: "Handoff Modal Shown",
  HANDOFF_EMAIL_SUBMITTED: "Handoff Email Submitted",
  HANDOFF_WEB_FALLBACK_CLICKED: "Handoff Web Fallback Clicked",
  HANDOFF_DISMISSED: "Handoff Dismissed",
  EXIT_INTENT_SHOWN: "Exit Intent Shown",
  EXIT_INTENT_EMAIL_SUBMITTED: "Exit Intent Email Submitted",
  EXIT_INTENT_DISMISSED: "Exit Intent Dismissed",
  EMAIL_SECTION_SUBMITTED: "Email Section Submitted",
  IAB_BANNER_SHOWN: "IAB Banner Shown",
  IAB_BANNER_DISMISSED: "IAB Banner Dismissed",
  NAV_LINK_CLICKED: "Nav Link Clicked",
  OUTBOUND_LINK_CLICKED: "Outbound Link Clicked",
  EXPERIMENT_STARTED: "$experiment_started",
} as const;

export type LinkKind = "telegram" | "anchor" | "internal" | "outbound";

// Matches TrackLead.tsx exactly so the Mixpanel `Lead` funnel lines up 1:1
// with the existing Meta `Lead`. Do not loosen without updating TrackLead.
const TELEGRAM_HREF = /^https?:\/\/(?:t\.me|telegram\.me)\//i;

export function isTelegramHref(href: string): boolean {
  return TELEGRAM_HREF.test(href);
}

/**
 * Stamps visitor attribution onto an outbound Telegram username link by setting
 * the `text` param to the localized draft plus an invisible token payload (the
 * first 16 hex chars of the click_id, encoded as zero-width chars — see
 * lib/analytics/tg-payload.ts). The visitor sees only the draft; the sent
 * message still carries the token so the recipient can decode it.
 *
 * Only Telegram username links get a prefilled draft: business DM (/m/…) and
 * invite (/+…) links ignore every query param per the Telegram deep-link
 * spec, so they pass through untouched. No-op for non-Telegram hrefs or empty
 * click_id, and idempotent across repeat clicks (the param is replaced).
 */
export function withTelegramTracking(
  href: string,
  clickId: string,
  draft: string,
): string {
  if (!clickId || !isTelegramHref(href)) return href;
  try {
    const url = new URL(href);
    const segments = url.pathname.split("/").filter(Boolean);
    const isUsername =
      segments.length === 1 && !!segments[0] && !segments[0].startsWith("+");
    if (!isUsername) return href;

    const payload = encodePayload(tokenFromClickId(clickId));
    if (draft || payload) url.searchParams.set("text", `${draft}${payload}`);
    return url.toString();
  } catch {
    return href;
  }
}

export type TelegramChannel = "group" | "jakob";

/**
 * Which Telegram destination a CTA points at: the free group invite
 * (t.me/+<hash>, used by the pricing card + exit modal) vs Jakob's bot DM
 * (t.me/m/<code> and the other per-locale bot links). Undefined for
 * non-Telegram hrefs.
 */
export function telegramChannelFromHref(
  href: string,
): TelegramChannel | undefined {
  if (!isTelegramHref(href)) return undefined;
  try {
    return new URL(href).pathname.startsWith("/+") ? "group" : "jakob";
  } catch {
    return undefined;
  }
}

export type ChannelPlatform = "telegram" | "whatsapp";

/**
 * Messaging platform behind a dual-channel CTA button (`.chan-btn--tg` vs
 * `.chan-btn--wa`). Undefined when the element is not a channel button, so
 * callers can fall back to an href-based check for the single-button CTAs.
 */
export function channelPlatformFromElement(
  el: Element,
): ChannelPlatform | undefined {
  const btn = el.closest<HTMLElement>(".chan-btn");
  if (!btn) return undefined;
  if (btn.classList.contains("chan-btn--wa")) return "whatsapp";
  if (btn.classList.contains("chan-btn--tg")) return "telegram";
  return undefined;
}

export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  return localeForSegment(first) ?? DEFAULT_LOCALE;
}

/** True when the path carries a non-default locale prefix (e.g. /sv). */
export function isRouteLocale(pathname: string): boolean {
  const first = pathname.split("/").filter(Boolean)[0] ?? "";
  return isLocale(first) && first !== DEFAULT_LOCALE;
}

/** Single-string bucket for easy Mixpanel filtering: balkan | nordic | both. */
export function regionBucket(locale: string): Region | "both" {
  const regions = regionsForLocale(locale);
  return regions.length >= 2 ? "both" : regions[0];
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function getUtmParams(search: string): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(search);
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) out[key] = value;
    }
  } catch {
    /* no-op */
  }
  return out;
}

/** Maps a clicked element to a funnel location by its nearest known section. */
export function ctaLocationFromElement(el: Element): string {
  // An explicit data-cta-location wins — used by the handoff modal's Continue
  // button to carry the originating CTA location rather than "other".
  const explicit = el
    .closest<HTMLElement>("[data-cta-location]")
    ?.dataset.ctaLocation?.trim();
  if (explicit) return explicit;

  if (el.closest(".sticky-cta")) return "sticky";
  if (el.closest(".exit-overlay, .exit-modal")) return "exit";
  if (el.closest(".nav")) return "nav";
  if (el.closest(".hero")) return "hero";
  if (el.closest(".vsl")) return "vsl";
  if (el.closest(".hiw")) return "hiw";
  if (el.closest(".cta-strip")) return "cta_strip";
  if (el.closest(".whyjoin")) return "why_join";
  if (el.closest(".why")) return "why";
  if (el.closest(".email-capture")) return "email_section";
  if (el.closest(".pricing")) return "pricing";
  if (el.closest(".final-cta")) return "final_cta";
  if (el.closest(".foot")) return "footer";
  return "other";
}

export function linkKindFromHref(href: string): LinkKind {
  if (isTelegramHref(href)) return "telegram";
  if (href.startsWith("#")) return "anchor";
  if (/^https?:\/\//i.test(href)) {
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : undefined;
      if (origin && new URL(href).origin === origin) return "internal";
    } catch {
      /* fall through */
    }
    return "outbound";
  }
  // relative paths, mailto:, tel:, etc. treated as internal navigation
  return "internal";
}

/** Trimmed, length-capped visible label for a CTA/link. */
export function labelFromElement(el: HTMLElement): string {
  // innerText (not textContent) so A/B variant labels hidden with display:none
  // (see VariantSwap) are excluded and only the visible copy is recorded.
  const text = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  if (text) return text.slice(0, 100);
  return el.getAttribute("aria-label")?.trim() ?? "";
}

export function deviceProps(): AnalyticsProps {
  if (typeof window === "undefined") return {};
  const w = window.innerWidth;
  const device_type = w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  return {
    device_type,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };
}

/**
 * Navigation-timing metrics (ms, rounded) read from the Performance API. Must
 * be called after the `load` event, otherwise `loadEventEnd` is still 0. Reads
 * data the browser already collected, so there is no extra network/work cost.
 * Returns {} when timing is unavailable (e.g. SSR or unsupported browser).
 */
export function navigationTimingProps(): AnalyticsProps {
  if (typeof performance === "undefined" || !performance.getEntriesByType) {
    return {};
  }
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (!nav) return {};
  // Drop non-positive values so partial/unsupported metrics stay out of the
  // event rather than skewing averages with zeros.
  const ms = (n: number): number | undefined =>
    Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
  return {
    ttfb_ms: ms(nav.responseStart),
    dom_interactive_ms: ms(nav.domInteractive),
    dom_content_loaded_ms: ms(nav.domContentLoadedEventEnd),
    load_event_ms: ms(nav.loadEventEnd),
    response_ms: ms(nav.responseEnd - nav.requestStart),
    transfer_size_kb: nav.transferSize
      ? Math.round(nav.transferSize / 1024)
      : undefined,
    nav_type: nav.type, // navigate | reload | back_forward | prerender
  };
}
