"use client";
import { useRef, useState } from "react";
import type { Dict } from "@/lib/i18n";
import { track } from "@/lib/analytics/mixpanel";
import { EVENTS } from "@/lib/analytics/events";
import TelegramIcon from "./TelegramIcon";

type WhyJoinDict = NonNullable<Dict["whyJoin"]>;

// One icon per recognition statement, in the same order as the dict items.
// Inline SVGs keep the section self-contained and on-brand with the hero,
// drawn from betting iconography rather than generic finance/time glyphs.
const ICONS = [
  // 1 — guidance / second opinion / discipline: a researched betting slip
  <svg key="slip" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="14" rx="2.2" />
    <path d="M9 5v14" strokeDasharray="1.6 2.2" />
    <path d="M13 10.5l2 2 3-3.5" />
  </svg>,
  // 2 — depositing every weekend, nothing left by Monday: a draining wallet
  <svg key="walletdrain" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7.5a2.5 2.5 0 0 1 2.5-2.5H16a2 2 0 0 1 2 2v1.2" />
    <path d="M3 7.5V16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.8" />
    <path d="M18.5 8.7h-2.8a1.8 1.8 0 0 0 0 3.6h2.8z" />
    <path d="M8.5 18v3.9M8.5 21.9l-1.7-1.8M8.5 21.9l1.7-1.8" />
  </svg>,
  // 3 — realistic extra income: a coin climbing steadily, not spiking
  <svg key="coingrowth" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9.5" cy="13" r="6.2" />
    <path d="M12 10.2a3.4 3.4 0 0 0-2.7-1.5c-2 0-3.4 1.7-3.4 4.3s1.4 4.3 3.4 4.3a3.4 3.4 0 0 0 2.7-1.5" />
    <path d="M5.8 11.8h4.6M5.8 14.2h3.9" />
    <path d="M15 4.5l4.5.8-1 4.4" />
    <path d="M19.3 5.6c-2.4 3.4-5 5.6-8.6 7.2" />
  </svg>,
  // 4 — no time to analyse matches: a ball under the analysts' magnifier
  <svg key="matchscan" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="6.2" />
    <path d="M10 3.8v12.4" />
    <path d="M4.3 7.6c3.6 1.7 7.8 1.7 11.4 0" />
    <path d="M4.3 12.4c3.6-1.7 7.8-1.7 11.4 0" />
    <path d="M14.6 14.6L20 20" />
  </svg>,
];

export default function WhyJoin({
  t,
  botUrl,
}: {
  t: WhyJoinDict;
  botUrl: string;
}) {
  // Track which cards have been opened. Each "fix" stays hidden until the user
  // taps the card — a small reveal interaction that rewards engagement and
  // keeps the section scannable on mobile.
  const [open, setOpen] = useState<Record<number, boolean>>({});
  // Once any card is opened, drop the attention-pulse on the remaining cues —
  // the user has learned the interaction, so the hint has done its job.
  const [primed, setPrimed] = useState(false);
  // Fire the reveal event only the first time each card is opened, so the
  // Mixpanel count reflects unique cards engaged, not open/close toggling.
  const tracked = useRef<Set<number>>(new Set());

  const toggle = (i: number, pain: string) => {
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
    setPrimed(true);
    // A card starts closed, so its first toggle is always an open. Fire the
    // reveal event once per card so the Mixpanel count reflects unique cards
    // engaged, not open/close toggling.
    if (!tracked.current.has(i)) {
      tracked.current.add(i);
      track(EVENTS.WHY_JOIN_CARD_OPENED, { card_index: i, pain });
    }
  };

  return (
    <section className={`whyjoin${primed ? " is-primed" : ""}`} id="why-join">
      <div className="container">
        <div className="section-head">
          <span className="kicker">{t.kicker}</span>
          <h2>{t.h2}</h2>
          <p>{t.sub}</p>
        </div>

        <ul className="wj-grid">
          {t.items.map((item, i) => {
            const isOpen = !!open[i];
            return (
              <li className={`wj-card${isOpen ? " is-open" : ""}`} key={item.pain}>
                <button
                  type="button"
                  className="wj-trigger"
                  aria-expanded={isOpen}
                  aria-controls={`wj-fix-${i}`}
                  onClick={() => toggle(i, item.pain)}
                >
                  <span className="wj-ico" aria-hidden="true">
                    {ICONS[i] ?? ICONS[0]}
                  </span>
                  <span className="wj-body">
                    <span className="wj-pain">{item.pain}</span>
                    <span className="wj-cue">
                      <span className="wj-cue-text">{t.revealHint}</span>
                      <svg className="wj-cue-ico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </span>
                </button>
                <div className="wj-reveal" id={`wj-fix-${i}`} role="region">
                  <div className="wj-reveal-inner">
                    <p className="wj-fix">
                      <svg className="wj-fix-check" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item.fix}</span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="wj-promise">
          <span className="wj-promise-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="12" cy="12" r="0.6" fill="currentColor" />
            </svg>
          </span>
          <div className="wj-promise-body">
            <p className="wj-promise-text">{t.promise}</p>
            <div className="wj-promise-cta">
              <a
                className="btn btn-primary btn-lg btn--tg-icon"
                href={botUrl}
                target="_blank"
                rel="noopener"
                data-handoff
                data-href={botUrl}
              >
                <TelegramIcon />
                {t.cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
