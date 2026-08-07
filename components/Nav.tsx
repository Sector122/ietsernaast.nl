"use client";
import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";
import type { Dict } from "@/lib/i18n";

export default function Nav({ t, homeHref = "/", botUrl, vip = false }: { t: Dict["nav"]; homeHref?: string; botUrl: string; vip?: boolean }) {
  const [country, setCountry] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("https://ipapi.co/json/")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d?.country_name) setCountry(d.country_name);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <header className="nav" id="topnav">
      <a
        className="brand"
        href={homeHref}
        aria-label="Sector1 home"
        onClick={(e) => {
          if (homeHref === window.location.pathname) {
            e.preventDefault();
            const reduce = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
            if (history.replaceState)
              history.replaceState(null, "", window.location.pathname);
          }
        }}
      >
        <span className="brand-mark">
          <BrandMark />
        </span>
        <span className="brand-name">
          SECTOR<span className="brand-num">1</span>
        </span>
      </a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#how-it-works">{t.howItWorks}</a>
        <a href="#join">{t.getTips}</a>
      </nav>
      <div className="nav-cta">
        <span className="geo" aria-label={t.geoLabel}>
          <span className="geo-dot" />
          {country.length > 0 && <span>{country}</span>}
        </span>
        <a className="btn btn-primary" href={botUrl} target="_blank" rel="noopener" data-handoff data-href={botUrl}>
          {vip ? t.ctaVip : t.cta}
        </a>
      </div>
    </header>
  );
}
