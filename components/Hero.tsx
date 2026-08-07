"use client";
import { sampleTips } from "@/lib/tips";
import GlassBalls from "./GlassBalls";
import ChannelCta from "./ChannelCta";
import RoiTracker from "./RoiTracker";
import TelegramIcon from "./TelegramIcon";
import { type CtaVariant, DEFAULT_CTA_VARIANT } from "@/lib/cta-variant";
import PickCardLoop from "./picks/PickCardLoop";
import { usePicks } from "@/lib/picks/usePicks";
import type { Dict } from "@/lib/i18n";

function kickoffTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Pull a single team name out of a "{home} vs {away}" match label so we can
// blur it as the selection (e.g. "Real Madrid") while the bet type stays
// readable next to it.
function teamFromMatch(match: string, side: "home" | "away"): string {
  const parts = match.split(/\s+vs\.?\s+/i);
  if (parts.length === 2) {
    return (side === "home" ? parts[0] : parts[1]).trim();
  }
  return side === "home" ? "Home" : "Away";
}

// Build a teaser where only the answer is blurred but the bet type stays
// readable, e.g. "Real Madrid" (blurred) + "to win". This proves a real tip
// exists without revealing which selection to back.
function teaseSelection(
  pick: string,
  match: string,
  market: string,
): { hidden: string; suffix: string } {
  const m = market.toLowerCase();
  const p = pick.toLowerCase();
  const isWinner =
    m.includes("1x2") ||
    m.includes("winner") ||
    m.includes("match result") ||
    m.includes("moneyline") ||
    m.includes("double chance");
  if (isWinner) {
    if (p === "home") return { hidden: teamFromMatch(match, "home"), suffix: "to win" };
    if (p === "away") return { hidden: teamFromMatch(match, "away"), suffix: "to win" };
    if (p === "draw") return { hidden: "Draw", suffix: "" };
    return { hidden: pick, suffix: "to win" };
  }
  if (
    m.includes("over") ||
    m.includes("under") ||
    m.includes("goals") ||
    m.includes("total")
  ) {
    return { hidden: pick, suffix: "goals" };
  }
  if (m.includes("btts") || m.includes("both teams")) {
    return { hidden: pick, suffix: "BTTS" };
  }
  return { hidden: pick, suffix: "" };
}

// The meta line must tease the market type without giving away the actual tip,
// so we strip lines/numbers and collapse to a generic category. Winners and
// over/under selections stay hidden behind the blurred pick.
function marketCategory(market: string): string {
  const m = market.toLowerCase();
  if (
    m.includes("1x2") ||
    m.includes("winner") ||
    m.includes("match result") ||
    m.includes("moneyline") ||
    m.includes("double chance")
  ) {
    return "Winner";
  }
  if (
    m.includes("over") ||
    m.includes("under") ||
    m.includes("goals") ||
    m.includes("total")
  ) {
    return "Over/Under";
  }
  // Other markets: drop any numeric line so the selection stays hidden.
  return market.replace(/[\d.]+/g, "").replace(/\s+/g, " ").trim() || market;
}

export default function Hero({
  t,
  botUrl,
  channelCta,
  whatsappUrl,
  variant = DEFAULT_CTA_VARIANT,
  showPickCard = false,
  tgIcon = false,
}: {
  t: Dict["hero"];
  botUrl: string;
  channelCta: Dict["channelCta"]["hero"];
  whatsappUrl?: string;
  variant?: CtaVariant;
  showPickCard?: boolean;
  tgIcon?: boolean;
}) {
  const { picks } = usePicks();
  const actionablePicks = picks.filter((pick) => !pick.fixtureOnly);
  const vip = variant === "vip";

  // "Live tips" card: show up to 3 live picks, falling back to sample tips so
  // the hero never looks empty while data is loading or unavailable.
  const liveRows = actionablePicks.slice(0, 3).map((p) => {
    const tease = teaseSelection(p.pick, p.match, p.market);
    return {
      key: p.id,
      match: p.match,
      meta: [p.league, kickoffTime(p.kickoff), marketCategory(p.market)].filter(Boolean).join(" · "),
      hidden: tease.hidden,
      suffix: tease.suffix,
      odds: p.odds != null ? p.odds.toFixed(2) : "N/A",
    };
  });
  const rows =
    liveRows.length > 0
      ? liveRows
      : sampleTips.slice(0, 3).map((tip, i) => {
          const tease = teaseSelection(tip.pick, tip.match, tip.market);
          return {
            key: `${tip.match}-${tip.market}-${i}`,
            match: tip.match,
            meta: `${tip.league} · ${marketCategory(tip.market)}`,
            hidden: tease.hidden,
            suffix: tease.suffix,
            odds: tip.odds,
          };
        });

  // Telegram notification: surface a live pick when available, else dict copy.
  // The selection is blurred (like the live-tips card) so the actual pick stays
  // hidden while the match and odds prove a real tip dropped.
  const featured = actionablePicks[0];
  const tgTease = featured
    ? teaseSelection(featured.pick, featured.match, featured.market)
    : null;

  return (
    <section className="hero" id="how-it-works">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-glow hero-glow--gold" />
        <span className="hero-glow hero-glow--violet" />
        <span className="hero-beam hero-beam--a" />
        <span className="hero-beam hero-beam--b" />
        <span className="hero-particles" />
      </div>
      <GlassBalls variant="hero" />

      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="pulse" /> {t.eyebrow}
          </span>
          <h1>
            {t.h1Line1}
            <br />
            <span className="accent">{t.h1Line2}</span>
          </h1>
          <p className="lede">{t.lede}</p>

          <ol className="join-steps">
            {t.trust.map((line, i) => {
              const isGoal = i === t.trust.length - 1;
              return (
                <li
                  key={line}
                  className={`join-step${isGoal ? " join-step--goal" : ""}`}
                >
                  <span className="join-step__node">
                    {isGoal ? (
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="join-step__num">{i + 1}</span>
                    )}
                  </span>
                  <span className="join-step__card">
                    <span className="join-step__text">{line}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          {t.whyNow && <p className="cta-why">{t.whyNow}</p>}

          {whatsappUrl ? (
            <>
              <ChannelCta
                variant="glow"
                size="lg"
                className="hero-channel-cta"
                title={channelCta.title}
                sub={channelCta.sub}
                telegramUrl={botUrl}
                whatsappUrl={whatsappUrl}
              />
              <a className="hero-watch" href="#vsl">
                {t.ctaSecondary}
              </a>
            </>
          ) : (
            <>
              <div className="hero-cta">
                {vip && t.ctaVip ? (
                  <a
                    className={`btn btn-primary btn-lg${tgIcon ? " btn--tg-icon" : ""}`}
                    href={botUrl}
                    target="_blank"
                    rel="noopener"
                    data-handoff
                    data-href={botUrl}
                  >
                    {tgIcon && <TelegramIcon />}
                    {t.ctaVip}
                  </a>
                ) : (
                  <>
                    <a
                      className={`btn btn-primary btn-lg${tgIcon ? " btn--tg-icon" : ""}`}
                      href={botUrl}
                      target="_blank"
                      rel="noopener"
                      data-handoff
                      data-href={botUrl}
                    >
                      {tgIcon && <TelegramIcon />}
                      {t.ctaPrimary}
                    </a>
                    <a className="btn btn-ghost btn-lg" href="#vsl">
                      {t.ctaSecondary}
                    </a>
                  </>
                )}
              </div>

              {vip && t.ctaVip && (
                <a className="hero-watch" href="#vsl">
                  {t.ctaSecondary}
                </a>
              )}
            </>
          )}
        </div>

        <div className="hero-stack" aria-hidden="false">
          {showPickCard && (
            <div className="hero-pick">
              <PickCardLoop />
            </div>
          )}
          <RoiTracker
            head={t.roiHead}
            sub={t.roiMeta}
            verified={t.roiVerified}
            updated={t.roiUpdated}
            deltaLabel={t.roiDelta}
          />

          <div className="float-card float-card--main">
            <div className="card-head">
              <span className="live-dot" /> {t.liveTips}
            </div>
            <div className="odds-list" aria-live="polite">
              {rows.map((row) => (
                <div className="odds-pill" key={row.key}>
                  <div>
                    <div className="odds-match">{row.match}</div>
                    <div className="odds-meta">{row.meta}</div>
                  </div>
                  <div className="odds-pick">
                    <b className="odds-blur">{row.hidden}</b>
                    {row.suffix && (
                      <span className="odds-pick-suffix">{row.suffix}</span>
                    )}
                  </div>
                  <div className="odds-val">{row.odds}</div>
                </div>
              ))}
            </div>
            <p className="card-foot">{t.cardFoot}</p>
          </div>

          <div className="float-card float-card--tg">
            <div className="tg-row">
              <span className="tg-ico" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M21.9 4.3 2.7 11.8c-1 .4-1 1 0 1.3l4.7 1.5 1.8 5.7c.2.7.4.9 1 .9.5 0 .7-.2 1-.5l2.6-2.5 5.3 4c1 .5 1.7.2 1.9-.9l3.4-15.9c.3-1.3-.5-1.9-1.5-1.4z" />
                </svg>
              </span>
              <div>
                <div className="tg-title">{t.tgTitle}</div>
                <div className="tg-msg">
                  {featured && tgTease ? (
                    <>
                      New pick · {featured.match} ·{" "}
                      <b className="odds-blur">{tgTease.hidden}</b>
                      {tgTease.suffix ? ` ${tgTease.suffix}` : ""}
                      {featured.odds != null ? ` @ ${featured.odds.toFixed(2)}` : ""}
                    </>
                  ) : (
                    t.tgMsg
                  )}
                </div>
              </div>
              <span className="tg-time">{t.tgTime}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
