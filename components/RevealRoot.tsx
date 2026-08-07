"use client";
import { useEffect } from "react";

type Group = {
  sel: string;
  mode?: "self" | "children";
  step?: number;
};

const GROUPS: Group[] = [
  { sel: ".section-head", mode: "children", step: 90 },
  { sel: ".hero-copy", mode: "children", step: 90 },
  { sel: ".hiw-card", step: 90 },
  { sel: ".analyst-card", step: 80 },
  { sel: ".why-card", step: 80 },
  { sel: ".pricing-card" },
  { sel: ".float-card", step: 120 },
  { sel: ".vsl-bullet", step: 80 },
  { sel: ".cta-strip-inner", mode: "children", step: 100 },
  { sel: ".odds-row", step: 60 },
  { sel: ".shots-wrap" },
];

export default function RevealRoot() {
  useEffect(() => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const tag = (el: HTMLElement, delay: number) => {
      if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
      if (delay > 0) el.style.setProperty("--reveal-delay", `${delay}ms`);
    };

    GROUPS.forEach(({ sel, mode = "self", step = 0 }) => {
      document.querySelectorAll<HTMLElement>(sel).forEach((root, rootIdx) => {
        if (mode === "children") {
          Array.from(root.children).forEach((child, i) =>
            tag(child as HTMLElement, i * step),
          );
        } else {
          tag(root, step > 0 ? (rootIdx % 6) * step : 0);
        }
      });
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    document
      .querySelectorAll<HTMLElement>("[data-reveal]:not(.in-view)")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
