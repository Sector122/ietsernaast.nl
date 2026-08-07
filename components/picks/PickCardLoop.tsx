"use client";

import { useEffect, useMemo, useState } from "react";
import { usePicks } from "@/lib/picks/usePicks";

const HOLD_MS = 4500;
const MAX_CARDS = 3;

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

function kickoffTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Shows one pick at a time (max 3, soonest kick-off first) and auto-cycles with
 * a crossfade. Self-contained: hides itself entirely while loading, on error,
 * or when there are no picks. Pauses on hover; switches instantly for
 * reduced-motion users.
 */
export default function PickCardLoop() {
  const { picks, isLoading, error } = usePicks();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const cards = useMemo(
    () => picks.filter((p) => p.status !== "void" && !p.fixtureOnly).slice(0, MAX_CARDS),
    [picks],
  );

  useEffect(() => {
    if (index >= cards.length && cards.length > 0) setIndex(0);
  }, [cards.length, index]);

  useEffect(() => {
    if (cards.length <= 1 || paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % cards.length),
      HOLD_MS,
    );
    return () => window.clearInterval(id);
  }, [cards.length, paused]);

  if (isLoading || error || cards.length === 0) return null;

  const active = Math.min(index, cards.length - 1);

  return (
    <div
      className="pick-loop"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pick-loop-stage" aria-live="polite">
        {cards.map((p, i) => {
          const oddsStr = p.odds != null ? p.odds.toFixed(2) : "n/a";
          return (
            <article
              key={p.id}
              className={[
                "pick-card",
                i === active ? "is-active" : "",
                reduce ? "no-fade" : "",
              ]
                .join(" ")
                .trim()}
              aria-hidden={i !== active}
            >
              <header className="pick-card-top">
                <span className="pick-league">{p.league}</span>
                <span className="pick-sep" aria-hidden="true">·</span>
                <span className="pick-kick">{kickoffTime(p.kickoff)}</span>
                <span className="pick-sep" aria-hidden="true">·</span>
                <span className="pick-market">{p.market}</span>
                {p.status === "won" && (
                  <span className="pick-badge pick-badge--won">
                    Won<span className="sr-only">, pick won</span>
                  </span>
                )}
                {p.status === "lost" && (
                  <span className="pick-badge pick-badge--lost">
                    Lost<span className="sr-only">, pick lost</span>
                  </span>
                )}
              </header>
              <h3 className="pick-match" title={p.match}>
                {p.match}
              </h3>
              <div className="pick-row">
                <span className="pick-dir">{p.pick}</span>
                <span className={`pick-odds${oddsStr.length > 4 ? " pick-odds--sm" : ""}`}>
                  {oddsStr}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      {cards.length > 1 && (
        <div className="pick-dots" aria-hidden="true">
          {cards.map((p, i) => (
            <span key={p.id} className={`pick-dot${i === active ? " is-active" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}
