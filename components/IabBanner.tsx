"use client";

// Top banner nudging visitors inside a social in-app browser (Instagram /
// Facebook / TikTok webview) to reopen the page in their system browser, where
// the Telegram handoff and the rest of the funnel work properly.
//
// Gated by live IAB detection, so only actual in-app browsers see it.
// Self-renders null otherwise, so it is safe to mount unconditionally.

import { useEffect, useState } from "react";
import { detectIab, iabAction, type IabInfo } from "@/lib/detect-iab";
import { track } from "@/lib/analytics/mixpanel";
import { EVENTS } from "@/lib/analytics/events";
import type { Dict } from "@/lib/i18n";

// sessionStorage (not localStorage): a dismissal lasts the session and does not
// reappear on back-navigation, but the next session sees it again.
const DISMISS_KEY = "s1_iab_banner_dismissed";
const LEAVE_MS = 260;
// Hold the banner back until the visitor has spent at least this long on the
// page, so a fresh landing is never interrupted by an instant nudge.
const SHOW_DELAY_MS = 10_000;

export default function IabBanner({
  t,
  locale,
}: {
  t: Dict["iabBanner"];
  locale: string;
}) {
  const [info, setInfo] = useState<IabInfo | null>(null);
  // Assume dismissed until the client check runs, so nothing flashes pre-mount.
  const [dismissed, setDismissed] = useState(true);
  const [leaving, setLeaving] = useState(false);
  // Gates the banner behind SHOW_DELAY_MS: false until the on-page timer fires.
  const [ready, setReady] = useState(false);

  // Detect the in-app browser + read the session dismissal once after mount
  // (both rely on client-only APIs: navigator.userAgent, sessionStorage).
  useEffect(() => {
    setInfo(detectIab());
    let seen = false;
    try {
      seen = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* storage blocked — treat as not dismissed */
    }
    setDismissed(seen);
  }, []);

  // Delay the first appearance: only reveal the banner once the visitor has
  // been on the page for SHOW_DELAY_MS.
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  // Stays true through the slide-out (data-leaving) until the unmount timeout
  // sets `dismissed`, so the exit animation can play.
  const show = ready && info != null && !dismissed;

  // Fire "shown" once, when the banner actually becomes visible.
  useEffect(() => {
    if (!show || !info) return;
    track(EVENTS.IAB_BANNER_SHOWN, {
      platform: info.platform,
      os: info.os ?? "unknown",
      locale,
    });
    // Intentionally keyed on `show` only: show flips false→true exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show || !info) return null;

  const action = iabAction(info);
  const actionLabel =
    action === "safari"
      ? t.openInSafari
      : action === "chrome"
        ? t.openInChrome
        : t.openInBrowser;
  const [before, after] = t.message.split("{action}");

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    track(EVENTS.IAB_BANNER_DISMISSED, {
      platform: info.platform,
      os: info.os ?? "unknown",
      locale,
    });
    // Play the slide-out, then unmount.
    setLeaving(true);
    window.setTimeout(() => setDismissed(true), LEAVE_MS);
  };

  return (
    <div
      className="iab-banner"
      data-leaving={leaving ? "true" : undefined}
      role="region"
      aria-label={t.message.replace("{action}", actionLabel)}
    >
      <span className="iab-dot" aria-hidden="true" />
      <p className="iab-msg">
        {before}
        <strong>{actionLabel}</strong>
        {after}
      </p>
      <button
        className="iab-x"
        type="button"
        aria-label={t.dismiss}
        onClick={dismiss}
      >
        ×
      </button>
    </div>
  );
}
