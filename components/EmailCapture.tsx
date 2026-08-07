"use client";
import { useState } from "react";
import { track, peopleSet } from "@/lib/analytics/mixpanel";
import { EVENTS, localeFromPath } from "@/lib/analytics/events";
import { getClickId } from "@/lib/analytics/click-id";
import { identifyAndTrackTikTok } from "@/lib/analytics/tiktok";
import type { Dict } from "@/lib/i18n";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function EmailCapture({ t }: { t: NonNullable<Dict["emailSignup"]> }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  // Mirrors the exit/handoff email path: Mixpanel people + event, then a
  // fire-and-forget /api/lead (Meta CAPI + Brevo). Never blocks the user.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError(true);
      return;
    }
    setError(false);
    setDone(true);
    peopleSet({ email: value });
    track(EVENTS.EMAIL_SECTION_SUBMITTED, { cta_location: "email_section" });
    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          email: value,
          click_id: getClickId(),
          cta_location: "email_section",
          source_url: window.location.href,
          locale: localeFromPath(window.location.pathname),
        }),
      })
        .then((response) => {
          if (!response.ok) return;
          void identifyAndTrackTikTok("Contact", { email: value }, {
            contents: [
              {
                content_id: "sector1_email_lead",
                content_type: "product",
                content_name: "Sector1 email lead",
              },
            ],
          });
        })
        .catch(() => {});
    } catch {
      /* never block */
    }
  };

  return (
    <section className="email-capture" id="email">
      <div className="container">
        <div className="email-band">
          <div className="email-band-copy">
            <span className="kicker">{t.kicker}</span>
            <h2>{t.h2}</h2>
            <p>{t.sub}</p>
          </div>
          <div className="email-band-action">
            {done ? (
              <p className="email-done">{t.thanks}</p>
            ) : (
              <form className="email-form" onSubmit={onSubmit} noValidate>
                <div className="email-row">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={t.placeholder}
                    aria-label={t.placeholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                  />
                  <button type="submit" className="btn btn-primary">
                    {t.cta}
                  </button>
                </div>
                {error && <small className="email-error">{t.invalid}</small>}
                <small className="email-note">{t.note}</small>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
