"use client";

// Boots Mixpanel, registers super properties, and fires Page Viewed on load
// and on SPA path changes. UTMs come from window.location.search to avoid
// useSearchParams' CSR bailout, so no <Suspense> boundary is required.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  analyticsReady,
  initAnalytics,
  register,
  registerOnce,
  peopleSetOnce,
  track,
} from "@/lib/analytics/mixpanel";
import { getClickId } from "@/lib/analytics/click-id";
import { tokenFromClickId } from "@/lib/analytics/tg-payload";
import { ctaVariantFor } from "@/lib/cta-variant";
import { detectIab } from "@/lib/detect-iab";
import { getAssignedExperiments } from "@/lib/experiment/assign";
import {
  EVENTS,
  deviceProps,
  getUtmParams,
  isRouteLocale,
  localeFromPath,
  navigationTimingProps,
  regionBucket,
  regionsForLocale,
} from "@/lib/analytics/events";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // Init + first-touch attribution (runs once).
  useEffect(() => {
    const ready = initAnalytics();
    if (!ready) return;

    // click_id is the cross-system join key: register it as a super property so
    // it rides on every event, and pin it to the profile for joinability.
    // external_id is its first 16 chars (the token) — the SAME value Meta gets
    // as external_id and that rides in the Telegram draft, so a user can be
    // matched 1:1 across Mixpanel / Meta / Telegram with no hashing or prefix.
    const clickId = getClickId();
    const token = tokenFromClickId(clickId);
    const ids = token
      ? { click_id: clickId, external_id: token }
      : { click_id: clickId };
    register(ids);
    peopleSetOnce(ids);

    // In-app-browser segmentation: tag every event with whether the visitor is
    // inside a social webview (Instagram/Facebook/TikTok).
    const iab = detectIab();
    register({ is_iab: iab != null });
    if (iab) {
      register({ iab_platform: iab.platform, iab_os: iab.os ?? "unknown" });
    }

    // A/B tests: tag every event with the visitor's variant assignment (read
    // from the boot script's localStorage map) and fire a one-time exposure
    // event per experiment so Mixpanel's Experiments report can pick it up.
    const experiments = getAssignedExperiments();
    const entries = Object.entries(experiments);
    if (entries.length) {
      register(
        Object.fromEntries(entries.map(([key, v]) => [`experiment_${key}`, v])),
      );
      for (const [key, v] of entries) {
        track(EVENTS.EXPERIMENT_STARTED, {
          "Experiment name": key,
          "Variant name": v,
        });
      }
    }

    const referrer =
      (typeof document !== "undefined" && document.referrer) || "";
    const utms = getUtmParams(
      typeof window !== "undefined" ? window.location.search : "",
    );

    registerOnce({ referrer, ...utms });
    peopleSetOnce({ first_referrer: referrer, ...utms });
  }, []);

  // Page Performance: navigation-timing metrics fired exactly once per load.
  // Deferred to the `load` event so loadEventEnd is populated and so the
  // track() call runs during idle time, never competing with first paint/LCP.
  useEffect(() => {
    if (!analyticsReady()) return;
    if (typeof window === "undefined") return;

    let sent = false;
    const sendPerf = () => {
      if (sent) return;
      sent = true;
      track(EVENTS.PAGE_PERFORMANCE, {
        path: window.location.pathname,
        ...navigationTimingProps(),
        ...deviceProps(),
      });
    };

    if (document.readyState === "complete") {
      sendPerf();
      return;
    }
    window.addEventListener("load", sendPerf, { once: true });
    return () => window.removeEventListener("load", sendPerf);
  }, []);

  // Page Viewed on load + every path change.
  useEffect(() => {
    if (!analyticsReady()) return;
    if (pathname == null) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const locale = localeFromPath(pathname);

    register({
      locale,
      cta_variant: ctaVariantFor(locale),
      regions: regionsForLocale(locale),
      region_bucket: regionBucket(locale),
      is_route_locale: isRouteLocale(pathname),
      ...deviceProps(),
    });

    track(EVENTS.PAGE_VIEWED, {
      path: pathname,
      locale,
      referrer:
        (typeof document !== "undefined" && document.referrer) || undefined,
    });
  }, [pathname]);

  return null;
}
