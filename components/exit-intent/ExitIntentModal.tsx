"use client";
import { useEffect, useRef, useState } from "react";
import { useExitIntent } from "./ExitIntentProvider";
import { track, peopleSet } from "@/lib/analytics/mixpanel";
import { EVENTS, localeFromPath } from "@/lib/analytics/events";
import { getClickId } from "@/lib/analytics/click-id";
import { identifyAndTrackTikTok } from "@/lib/analytics/tiktok";
import { FREE_GROUP_URL } from "@/lib/cta";
import { recordExitCaptured } from "@/lib/exit-intent/suppression";
import ChannelCta from "@/components/ChannelCta";
import type { Dict } from "@/lib/i18n";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ExitIntentModal({
  t,
  botUrl,
  whatsappUrl,
}: {
  t: Dict["exit"];
  botUrl: string;
  whatsappUrl?: string;
}) {
  const { isOpen, close } = useExitIntent();

  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);

  // Reset the email path each time the modal reopens.
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setEmailDone(false);
    }
  }, [isOpen]);

  // Emit Exit Intent Dismissed on any close (button / overlay / ESC). The CTA
  // click does not close the modal, so an open→close transition is a dismissal.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      track(EVENTS.EXIT_INTENT_DISMISSED, { cta_location: "exit" });
    }
    wasOpen.current = isOpen;
  }, [isOpen]);

  // Email path for visitors who aren't ready for Telegram. Mirrors the handoff
  // modal: Mixpanel people + event, then a fire-and-forget /api/lead (Meta CAPI
  // + Brevo). Never blocks; the direct CTA above stays the primary route.
  const onEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) return;
    const clickId = getClickId();
    setEmailDone(true);
    peopleSet({ email: value });
    // Permanent suppression: a captured visitor never sees the popup again.
    recordExitCaptured();
    track(EVENTS.EXIT_INTENT_EMAIL_SUBMITTED, {
      cta_location: "exit",
      click_id: clickId,
    });
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          email: value,
          click_id: clickId,
          cta_location: "exit",
          source_url: window.location.href,
          locale: localeFromPath(window.location.pathname),
        }),
      })
        .then((response) => {
          if (!response.ok) return;
          void identifyAndTrackTikTok("Contact", { email: value }, {
            contents: [
              {
                content_id: "sector1_exit_email_lead",
                content_type: "product",
                content_name: "Sector1 exit email lead",
              },
            ],
          });
        })
        .catch(() => {});
    } catch {
      /* never block the exit */
    }
  };

  return (
    <div
      className="exit-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
      hidden={!isOpen}
      data-open={isOpen ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="exit-modal">
        <button className="exit-close" aria-label={t.close} onClick={close}>
          ×
        </button>
        <span className="exit-badge">{t.badge}</span>
        <h2 id="exit-title">{t.title}</h2>
        <p>{t.sub}</p>
        {whatsappUrl ? (
          <ChannelCta
            variant="halo"
            size="md"
            telegramLabel={t.ctaTelegram}
            whatsappLabel={t.ctaWhatsapp}
            telegramUrl={FREE_GROUP_URL}
            whatsappUrl={whatsappUrl}
          />
        ) : (
          <a
            className="btn btn-primary btn-xl btn-block"
            href={FREE_GROUP_URL}
            target="_blank"
            rel="noopener"
            data-handoff
            data-href={FREE_GROUP_URL}
          >
            {t.cta}
          </a>
        )}

        <div className="exit-or">
          <span>{t.dividerOr}</span>
        </div>

        {emailDone ? (
          <p className="handoff-email-done">{t.emailThanks}</p>
        ) : (
          <form className="exit-email" onSubmit={onEmailSubmit}>
            <label className="handoff-email-label" htmlFor="exit-email-input">
              {t.emailAside}
            </label>
            <div className="handoff-email-row">
              <input
                id="exit-email-input"
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
            <small className="handoff-skip">{t.emailNote}</small>
          </form>
        )}
      </div>
    </div>
  );
}
