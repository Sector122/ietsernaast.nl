"use client";
import { useRef } from "react";
import Image from "next/image";
import type { Dict } from "@/lib/i18n";
import { track } from "@/lib/analytics/mixpanel";
import { EVENTS } from "@/lib/analytics/events";
import { getClickId } from "@/lib/analytics/click-id";

export default function Reviews({ t, shots }: { t: Dict["reviews"]; shots: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const lastIndex = useRef(-1);
  const suppressUntil = useRef(0);
  const scrollTimer = useRef<number | null>(null);

  const stepWidth = (el: HTMLElement): number => {
    const card = el.querySelector<HTMLElement>(".shot");
    return card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
  };

  const cardIndex = (el: HTMLElement): number =>
    Math.max(0, Math.round(el.scrollLeft / stepWidth(el)));

  const emit = (interaction_type: string, card_index: number) => {
    track(EVENTS.REVIEWS_INTERACT, {
      click_id: getClickId(),
      card_index,
      interaction_type,
    });
  };

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const step = stepWidth(el);
    // Ignore the programmatic smooth-scroll this triggers so it isn't also
    // counted as a swipe.
    suppressUntil.current = Date.now() + 700;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    const target = Math.max(0, cardIndex(el) + dir);
    lastIndex.current = target;
    emit("arrow_nav", target);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    if (Date.now() < suppressUntil.current) return;
    if (scrollTimer.current) window.clearTimeout(scrollTimer.current);
    scrollTimer.current = window.setTimeout(() => {
      const idx = cardIndex(el);
      if (idx === lastIndex.current) return;
      lastIndex.current = idx;
      emit("swipe", idx);
    }, 150);
  };

  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-head">
          <span className="kicker">{t.kicker}</span>
          <h2>{t.h2}</h2>
          <p>{t.sub}</p>
        </div>

        <div className="shots-wrap">
          <button
            type="button"
            className="shots-nav shots-nav--prev"
            aria-label={t.prev}
            onClick={() => scrollBy(-1)}
          >
            ‹
          </button>
          <div
            className="shots-track"
            ref={trackRef}
            tabIndex={0}
            aria-label={t.h2}
            onScroll={onScroll}
          >
            {shots.map((src, i) => (
              <figure className="shot" key={src}>
                <Image
                  src={src}
                  alt={t.alt.replace("{n}", String(i + 1))}
                  width={591}
                  height={1280}
                  sizes="(max-width: 600px) 78vw, 320px"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
          <button
            type="button"
            className="shots-nav shots-nav--next"
            aria-label={t.next}
            onClick={() => scrollBy(1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
