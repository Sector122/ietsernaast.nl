"use client";

// The Telegram handoff interstitial. Reuses the exit-modal shell (.exit-overlay
// / .exit-modal) for visual consistency, and adds three zones:
//   1. expectation-setter (badge + title + numbered steps)
//   2. optional, non-blocking email capture
//   3. handoff actions (real t.me deep link + QR + web.telegram.org fallback)
//
// The Continue button is the only real t.me link, so TrackLead (Meta Lead) and
// InteractionTracker (Mixpanel Lead + Telegram Handoff) fire there — i.e. when
// the visitor actually proceeds, which is the truthful handoff moment.

import { useEffect, useRef, useState } from "react";
import { useHandoff } from "./HandoffProvider";
import { track, peopleSet } from "@/lib/analytics/mixpanel";
import {
  EVENTS,
  withTelegramTracking,
  localeFromPath,
} from "@/lib/analytics/events";
import { getClickId } from "@/lib/analytics/click-id";
import { identifyAndTrackTikTok } from "@/lib/analytics/tiktok";
import { tgDraftFor } from "@/lib/tg-draft";
import { webTelegramUrl } from "@/lib/handoff/telegram";
import type { Dict } from "@/lib/i18n";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function HandoffModal({ t }: { t: Dict["handoff"] }) {
  const { isOpen, close, botUrl, ctaLocation } = useHandoff();

  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  // Per-visitor deep link (carries click_id via `start` + the invisible draft
  // payload on t.me/<username> targets).
  // Held in state and resolved client-side on open so SSR and hydration agree.
  const [link, setLink] = useState("");
  const [webLink, setWebLink] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  // True once the visitor actually proceeds to Telegram this open, so closing
  // afterwards isn't miscounted as a dismissal.
  const proceeded = useRef(false);

  // Resolve the stamped deep link whenever the modal opens (client-only).
  useEffect(() => {
    if (!isOpen) return;
    const draft = tgDraftFor(localeFromPath(window.location.pathname));
    const stamped = botUrl
      ? withTelegramTracking(botUrl, getClickId(), draft)
      : "";
    setLink(stamped);
    setWebLink(stamped ? webTelegramUrl(stamped) : "");
  }, [isOpen, botUrl]);

  // Reset transient state each time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setEmailDone(false);
    proceeded.current = false;
    dialogRef.current?.focus();
  }, [isOpen]);

  // Any open→close transition that isn't a proceed-to-Telegram is a dismissal
  // (mirrors ExitIntentModal's dismissal semantics).
  useEffect(() => {
    if (wasOpen.current && !isOpen && !proceeded.current) {
      track(EVENTS.HANDOFF_DISMISSED, { cta_location: ctaLocation });
    }
    wasOpen.current = isOpen;
  }, [isOpen, ctaLocation]);

  // Lightweight focus trap for keyboard users.
  useEffect(() => {
    if (!isOpen) return;
    const el = dialogRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])',
        ),
      ).filter((n) => n.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const onEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) return;
    setEmailDone(true);
    peopleSet({ email: value });
    track(EVENTS.HANDOFF_EMAIL_SUBMITTED, { cta_location: ctaLocation });
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          email: value,
          click_id: getClickId(),
          cta_location: ctaLocation,
          source_url: window.location.href,
          locale: localeFromPath(window.location.pathname),
        }),
      })
        .then((response) => {
          if (!response.ok) return;
          void identifyAndTrackTikTok("Contact", { email: value }, {
            contents: [
              {
                content_id: "sector1_handoff_email_lead",
                content_type: "product",
                content_name: "Sector1 handoff email lead",
              },
            ],
          });
        })
        .catch(() => {});
    } catch {
      /* never block the handoff */
    }
  };

  return (
    <div
      className="exit-overlay handoff-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handoff-title"
      hidden={!isOpen}
      data-open={isOpen ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="exit-modal handoff-modal" ref={dialogRef} tabIndex={-1}>
        <button className="exit-close" aria-label={t.close} onClick={close}>
          ×
        </button>

        <span className="exit-badge">{t.badge}</span>
        <h2 id="handoff-title">{t.title}</h2>
        <p>{t.sub}</p>

        <ol className="handoff-steps">
          {t.steps.map((step, i) => (
            <li key={step}>
              <span className="handoff-step-n">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        {emailDone ? (
          <p className="handoff-email-done">{t.emailThanks}</p>
        ) : (
          <form className="handoff-email" onSubmit={onEmailSubmit}>
            <label className="handoff-email-label" htmlFor="handoff-email-input">
              {t.emailLabel}
            </label>
            <div className="handoff-email-row">
              <input
                id="handoff-email-input"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="handoff-email-btn">
                {t.emailCta}
              </button>
            </div>
            <small className="handoff-skip">{t.emailSkipNote}</small>
          </form>
        )}

        <a
          className="btn btn-primary btn-xl btn-block"
          href={link || "#"}
          target="_blank"
          rel="noopener"
          data-handoff-continue
          data-cta-location={ctaLocation}
          onClick={() => {
            proceeded.current = true;
          }}
        >
          {t.continueCta}
        </a>

        <a
          className="handoff-web"
          href={webLink || link || "#"}
          target="_blank"
          rel="noopener"
          onClick={() => {
            proceeded.current = true;
            track(EVENTS.HANDOFF_WEB_FALLBACK_CLICKED, {
              cta_location: ctaLocation,
            });
          }}
        >
          {t.webFallback}
        </a>
      </div>
    </div>
  );
}
