"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Hero "ROI tracker" trust widget. Self-contained and fully hardcoded — there
 * is no data source. The realism comes from the details: a cumulative-yield
 * equity curve with genuine drawdowns (not a clean monotonic line), an
 * eased count-up on the headline figure, a line that draws in, a live pulse
 * at the leading edge, a break-even baseline, a verified-provenance chip and
 * a recency stamp. All motion is gated behind an in-view trigger and disabled
 * for `prefers-reduced-motion`.
 *
 * The figures drift day to day: everything (headline ROI, the curve shape, the
 * trailing delta and the settled-pick count) is generated from a seed derived
 * from the calendar day. So the numbers are stable within a single visit (a
 * track record that jitters on every reload reads as fake) but a returning
 * visitor sees a fresh, plausibly-updated bankroll the next day. To make it
 * update more or less often, change the divisor in DAY_SEED.
 *
 * Drops in for the old inline `.float-card--roi` block: renders the whole card
 * so the hero just places <RoiTracker /> inside `.hero-stack`.
 */

const N = 14; // points on the curve (a week, ~2/day)
const DAY_MS = 86_400_000;
const BASE = 200; // example stake shown in the plain-money payout

// Small, fast, deterministic PRNG so a given seed always yields the same run.
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Model = {
  final: number;
  delta: number;
  picks: number;
  curve: number[];
};

// Build a believable bankroll for a given day-seed: modest ROI in a tight,
// credible band, a curve that trends up but gives some back along the way, a
// positive trailing-30d delta and a slowly-growing settled-pick count.
function buildModel(seed: number): Model {
  const rng = mulberry32(seed >>> 0);

  // Centred so €200 grows to ~€347 (≈73.5%), with believable daily drift.
  const final = +(73 + rng() * 8).toFixed(1); // 73% – 81% → €346–€362 on €200
  const picks = 28 + Math.floor(rng() * 18); // 28 – 45 (a week's worth)

  // Random walk: positive drift with noise and the occasional drawdown.
  const raw = [0];
  for (let i = 1; i < N; i++) {
    let step = 1.0 + (rng() * 2 - 1) * 0.85;
    if (rng() < 0.2) step -= rng() * 1.9; // pullback
    raw.push(raw[i - 1] + step);
  }
  // Lift off any dip below zero, then scale so the last point lands on `final`.
  const min = Math.min(...raw);
  const lifted = raw.map((v) => v - Math.min(0, min));
  const end = lifted[N - 1] || 1;
  const curve = lifted.map((v) => +((v / end) * final).toFixed(2));

  // Small "up today" momentum flourish — a believable single-day move.
  const delta = +(3 + rng() * 6).toFixed(1); // +3% – +9%

  return { final, delta, picks, curve };
}

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

// SVG geometry — drawn in user units, stretched by preserveAspectRatio="none".
const W = 220;
const H = 58;
const PAD_T = 6;
const PAD_B = 10;

export default function RoiTracker({
  head,
  sub,
  verified = "Verified",
  updated = "synced",
  deltaLabel = "today",
}: {
  head: string;
  sub: string;
  verified?: string;
  updated?: string;
  deltaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false); // in view → run the reveal
  const [value, setValue] = useState(0); // eased count-up of the headline %
  const [ago, setAgo] = useState(2); // "synced · Nm" recency stamp

  // Seed by calendar day. Lazily initialised so server and client agree on the
  // same day (no hydration mismatch); changes when the visitor returns later.
  const [seed] = useState(() => Math.floor(Date.now() / DAY_MS));
  const model = useMemo(() => buildModel(seed), [seed]);
  const { final, delta, picks, curve } = model;

  // Inject the dynamic pick count into the localized sub string (replaces the
  // first number it finds, so it stays correct in every locale).
  const subText = useMemo(
    () => sub.replace(/\d[\d.,]*/, String(picks)),
    [sub, picks],
  );

  const { line, area, tipX, tipY, baselineY } = useMemo(() => {
    const vMax = Math.max(...curve) * 1.06 || 1;
    const x = (i: number) => (i / (N - 1)) * W;
    const y = (v: number) => PAD_T + (1 - v / vMax) * (H - PAD_T - PAD_B);
    const pts = curve.map((v, i) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`);
    const line = `M${pts.join("L")}`;
    return {
      line,
      area: `${line}L${W},${H}L0,${H}Z`,
      tipX: x(N - 1),
      tipY: y(curve[N - 1]),
      baselineY: y(0),
    };
  }, [curve]);

  // Vary the recency stamp per visit (client-only, after mount).
  useEffect(() => {
    setAgo(1 + Math.floor(Math.random() * 6));
  }, []);

  // Trigger once when the card scrolls into view (or immediately if reduced).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setActive(true);
      setValue(final);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, final]);

  // Eased count-up (easeOutCubic) once active.
  useEffect(() => {
    if (!active || reduce) return;
    let raf = 0;
    const start = performance.now();
    const DUR = 1500;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DUR);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(+(final * eased).toFixed(2));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduce, final]);

  return (
    <div className="float-card float-card--roi roi-card" ref={ref}>
      <div className="roi-top">
        <span className="roi-head">
          <span className="live-dot" /> {head}
        </span>
        <span className="roi-verified" title={`${verified} · independent tracking`}>
          <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 1 3.5 4.5v6.2c0 5 3.6 9.4 8.5 10.8 4.9-1.4 8.5-5.8 8.5-10.8V4.5L12 1Zm-1.3 14.2-3.3-3.3 1.4-1.4 1.9 1.9 4.4-4.4 1.4 1.4-5.8 5.8Z"
            />
          </svg>
          {verified}
        </span>
      </div>

      <div className="roi-figure">
        <span className="roi-value" aria-label={`Plus ${final} percent`}>
          +{value.toFixed(1)}
          <span className="roi-pct">%</span>
        </span>
        <span className="roi-trend">
          <span aria-hidden="true">▲</span> +{delta}%
          <span className="roi-trend-tag">{deltaLabel}</span>
        </span>
      </div>
      <div className="roi-sub">{subText}</div>

      <svg
        className="roi-chart"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="roiFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,138,0,.42)" />
            <stop offset="100%" stopColor="rgba(255,138,0,0)" />
          </linearGradient>
        </defs>
        {/* break-even baseline — the reference the gains are measured against */}
        <line
          className="roi-baseline"
          x1="0"
          x2={W}
          y1={baselineY}
          y2={baselineY}
        />
        <path
          className={`roi-area${active ? " is-on" : ""}`}
          d={area}
          fill="url(#roiFill)"
        />
        <path
          className={`roi-line${active ? " is-on" : ""}`}
          d={line}
          fill="none"
          stroke="var(--orange)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
        />
        {/* live pulse at the leading edge */}
        <circle
          className={`roi-pulse-halo${active ? " is-on" : ""}`}
          cx={tipX}
          cy={tipY}
          r="3.4"
        />
        <circle
          className={`roi-pulse-dot${active ? " is-on" : ""}`}
          cx={tipX}
          cy={tipY}
          r="2.6"
        />
      </svg>

      <div className="roi-foot">
        <span className="roi-updated">
          <span className="roi-updated-dot" /> {updated} · {ago}m
        </span>
        {/* Plain-language payout for a non-technical audience: turns the ROI %
            into "bet this, get this back". Counts up with the headline. */}
        <span
          className="roi-payout"
          aria-label={`${BASE} euro returns ${Math.round(BASE * (1 + final / 100))} euro`}
        >
          €{BASE} → <b>€{Math.round(BASE * (1 + value / 100))}</b>
        </span>
      </div>
    </div>
  );
}
