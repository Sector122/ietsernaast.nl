"use client";
import { useEffect, useRef } from "react";
import TelegramIcon from "@/components/TelegramIcon";

export default function StickyCta({
  cta,
  sub,
  botUrl,
  tgIcon = false,
}: {
  cta: string;
  sub: string;
  botUrl: string;
  tgIcon?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const pricing = document.getElementById("pricing");

    let passed = false;
    let pricingVisible = false;

    el.style.transition = "transform .25s ease";
    const apply = () => {
      el.style.transform =
        passed && !pricingVisible ? "translateY(0)" : "translateY(160%)";
    };

    // Reveal once the visitor has scrolled past the first ~1.5 folds.
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 1.5;
      if (next !== passed) {
        passed = next;
        apply();
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    let io: IntersectionObserver | null = null;
    if (pricing && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          pricingVisible = entry.isIntersecting;
          apply();
        },
        { threshold: 0.15 },
      );
      io.observe(pricing);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div className="sticky-cta" ref={ref} style={{ transform: "translateY(160%)" }}>
      <a
        className="sticky-cta-main btn"
        href={botUrl}
        target="_blank"
        rel="noopener"
        data-handoff
        data-href={botUrl}
      >
        {tgIcon ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <TelegramIcon size={16} />
            <span>{cta}</span>
          </div>
        ) : (
          <span>{cta}</span>
        )}
        {/* <small>{sub}</small> */}
      </a>
    </div>
  );
}
