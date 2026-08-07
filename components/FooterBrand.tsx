"use client";
import BrandMark from "./BrandMark";

export default function FooterBrand() {
  return (
    <a
      className="brand"
      href="#"
      aria-label="Sector1 home"
      onClick={(e) => {
        e.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        if (history.replaceState) history.replaceState(null, "", window.location.pathname);
      }}
    >
      <span className="brand-mark"><BrandMark size={28} /></span>
      <span className="brand-name">SECTOR<span className="brand-num">1</span></span>
    </a>
  );
}
