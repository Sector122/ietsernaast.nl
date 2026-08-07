"use client";

// Single global capture-phase click listener (mirrors TrackLead.tsx) plus
// scroll-depth and section-view observers. Emits:
//   - CTA Clicked   — any .btn / .sticky-cta
//   - Lead          — CTA clicks to t.me/* (1:1 with the Meta Lead gate)
//   - Nav Link Clicked      — in-page anchors inside the nav
//   - Outbound Link Clicked — external links (footer socials, etc.)
//   - Section Viewed, Scroll Depth

import { useEffect } from "react";
import { track, peopleSet } from "@/lib/analytics/mixpanel";
import { getClickId } from "@/lib/analytics/click-id";
import { recordExitConverted } from "@/lib/exit-intent/suppression";
import {
  EVENTS,
  channelPlatformFromElement,
  ctaLocationFromElement,
  deviceProps,
  isTelegramHref,
  labelFromElement,
  linkKindFromHref,
  localeFromPath,
  telegramChannelFromHref,
  withTelegramTracking,
} from "@/lib/analytics/events";
import { tgDraftFor } from "@/lib/tg-draft";

function socialNetwork(href: string): string | undefined {
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host.includes("instagram")) return "instagram";
    if (host === "t.me" || host.includes("telegram")) return "telegram";
    if (host.includes("youtube") || host.includes("youtu.be")) return "youtube";
    if (host.includes("tiktok")) return "tiktok";
    return host;
  } catch {
    return undefined;
  }
}

const SECTIONS: ReadonlyArray<{ name: string; selector: string }> = [
  { name: "hero", selector: ".hero" },
  { name: "vsl", selector: ".vsl" },
  { name: "reviews", selector: ".reviews" },
  { name: "how", selector: ".hiw" },
  { name: "why_join", selector: ".whyjoin" },
  { name: "why", selector: ".why" },
  { name: "email", selector: ".email-capture" },
  { name: "pricing", selector: ".pricing" },
  { name: "final_cta", selector: ".final-cta" },
  { name: "odds", selector: ".odds" },
  { name: "analysts", selector: ".analysts" },
];

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

export default function InteractionTracker() {
  useEffect(() => {
    // ---- Clicks (capture phase, like TrackLead) -----------------------------
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;

      let href = a.getAttribute("href") ?? "";
      const location = ctaLocationFromElement(a);
      const kind = linkKindFromHref(href);
      const label = labelFromElement(a);
      const isCta =
        a.classList.contains("btn") || a.classList.contains("sticky-cta");

      // Stamp visitor attribution onto outbound t.me/<username> links: the
      // `start` param (bots) plus a prefilled draft whose invisible payload
      // carries the click_id token (people/business accounts). Mutated
      // synchronously before the browser follows the link, and idempotent
      // across repeat clicks.
      if (isTelegramHref(href)) {
        const draft = tgDraftFor(localeFromPath(window.location.pathname));
        const stamped = withTelegramTracking(href, getClickId(), draft);
        if (stamped !== href) {
          a.setAttribute("href", stamped);
          href = stamped;
        }
      }

      // group (t.me/+ invite) vs jakob (bot DM) — only set for Telegram links.
      const channel = telegramChannelFromHref(href);

      // Messaging platform (telegram | whatsapp): set for the dual-channel
      // .chan-btn buttons and for any Telegram CTA, so telegram vs whatsapp
      // presses can be counted independently across every CTA.
      const channelPlatform = channelPlatformFromElement(a);
      const platform =
        channelPlatform ?? (isTelegramHref(href) ? "telegram" : undefined);

      // Dual-channel CTA buttons (.chan-btn--tg / .chan-btn--wa). Not a .btn,
      // so they skip the block below; tracked here as a CTA + Lead carrying an
      // explicit `platform` and the on-page `cta_location`. Every press counts
      // as a Lead (Telegram and WhatsApp alike).
      if (channelPlatform) {
        track(EVENTS.CTA_CLICKED, {
          cta_location: location,
          cta_label: label,
          link_kind: kind,
          destination_url: href,
          platform,
          ...(channel && { channel }),
        });
        // A channel press is a conversion: suppress the exit popup for good.
        recordExitConverted();
        track(EVENTS.LEAD, {
          cta_location: location,
          destination_url: href,
          platform,
          ...(channel && { channel }),
        });
        // Telegram presses also cross the on-site → bot bridge; carry click_id
        // so the bot/billing funnel can be joined back to this visitor.
        if (isTelegramHref(href)) {
          track(EVENTS.TELEGRAM_HANDOFF, {
            click_id: getClickId(),
            cta_location: location,
            destination_url: href,
            platform,
            channel,
            ...deviceProps(),
          });
        }
        peopleSet({
          last_cta_location: location,
          last_cta_platform: platform,
          ...(channel && { last_cta_channel: channel }),
        });
        return;
      }

      if (isCta) {
        // The handoff modal's Continue button is itself a .btn t.me link, but
        // the on-page trigger already fired CTA Clicked — so only let it emit
        // the truthful Lead + Telegram Handoff, not a duplicate CTA Clicked.
        if (!a.hasAttribute("data-handoff-continue")) {
          track(EVENTS.CTA_CLICKED, {
            cta_location: location,
            cta_label: label,
            link_kind: kind,
            destination_url: href,
            ...(platform && { platform }),
            ...(channel && { channel }),
          });
        }
        // Lead parity with Meta: only .btn/.sticky-cta links to t.me/*.
        if (isTelegramHref(href)) {
          // Permanent exit-intent suppression: a visitor who has engaged with
          // Telegram must never be shown the exit popup again.
          recordExitConverted();
          track(EVENTS.LEAD, {
            cta_location: location,
            destination_url: href,
            ...(platform && { platform }),
            channel,
          });
          // Telegram Handoff: the bridge into the off-site funnel and the last
          // on-site touchpoint. Distinct from CTA Clicked; carries click_id so
          // the bot/billing funnel can be joined back to this visitor.
          track(EVENTS.TELEGRAM_HANDOFF, {
            click_id: getClickId(),
            cta_location: location,
            destination_url: href,
            ...(platform && { platform }),
            channel,
            ...deviceProps(),
          });
          peopleSet({ last_cta_location: location, last_cta_channel: channel });
        }
        return;
      }

      // In-page nav anchors (e.g. #how / #reviews / #pricing).
      if (kind === "anchor" && a.closest(".nav")) {
        track(EVENTS.NAV_LINK_CLICKED, {
          target: href,
          cta_label: label,
        });
        return;
      }

      // External links: footer socials (incl. the t.me social icon) etc.
      if (kind === "outbound" || kind === "telegram") {
        track(EVENTS.OUTBOUND_LINK_CLICKED, {
          destination_url: href,
          link_kind: kind,
          network: socialNetwork(href),
          cta_location: location,
          cta_label: label,
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });

    // ---- Scroll depth -------------------------------------------------------
    const firedDepths = new Set<number>();
    let ticking = false;
    const measureScroll = () => {
      ticking = false;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
      for (const t of SCROLL_THRESHOLDS) {
        if (pct >= t && !firedDepths.has(t)) {
          firedDepths.add(t);
          track(EVENTS.SCROLL_DEPTH, { percent: t });
        }
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measureScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---- Section views (once each) -----------------------------------------
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries, observer) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            const name = el.dataset.s1Section;
            if (name) track(EVENTS.SECTION_VIEWED, { section: name });
            observer.unobserve(el);
          }
        },
        { threshold: 0, rootMargin: "0px 0px -40% 0px" },
      );
      for (const { name, selector } of SECTIONS) {
        const el = document.querySelector<HTMLElement>(selector);
        if (el) {
          el.dataset.s1Section = name;
          io.observe(el);
        }
      }
    }

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return null;
}
