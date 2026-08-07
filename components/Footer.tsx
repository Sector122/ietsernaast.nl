import FooterBrand from "./FooterBrand";
import type { Dict, Locale } from "@/lib/i18n";

const socials = [
  {
    href: "https://www.instagram.com/sector1_sport/",
    label: "Instagram",
    path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-2 .3-.5.2-.8.4-1.2.7-.3.4-.5.7-.7 1.2-.1.4-.3 1-.3 2C3 8.5 3 8.9 3 12s0 3.5.1 4.7c0 1 .2 1.6.3 2 .2.5.4.8.7 1.2.4.3.7.5 1.2.7.4.1 1 .3 2 .3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 2-.3.5-.2.8-.4 1.2-.7.3-.4.5-.7.7-1.2.1-.4.3-1 .3-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.3-2-.2-.5-.4-.8-.7-1.2-.4-.3-.7-.5-1.2-.7-.4-.1-1-.3-2-.3C15.5 4 15.1 4 12 4zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-2.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z",
  },
  {
    href: "https://t.me/sector1bets",
    label: "Telegram",
    path: "M21.9 4.3 2.7 11.8c-1 .4-1 1 0 1.3l4.7 1.5 1.8 5.7c.2.7.4.9 1 .9.5 0 .7-.2 1-.5l2.6-2.5 5.3 4c1 .5 1.7.2 1.9-.9l3.4-15.9c.3-1.3-.5-1.9-1.5-1.4zm-4.2 4.5L9.6 15.7l-.3 3.4-1.6-4.8 9.2-5.7c.5-.3.8 0 .8.2z",
  },
  {
    href: "https://www.youtube.com/@sector1sport",
    label: "YouTube",
    path: "M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.8 4.2 12 4.2 12 4.2s-6.8 0-8.5.5a2.8 2.8 0 0 0-2 2C1 8.4 1 12 1 12s0 3.6.5 5.3a2.8 2.8 0 0 0 2 2c1.7.5 8.5.5 8.5.5s6.8 0 8.5-.5a2.8 2.8 0 0 0 2-2C23 15.6 23 12 23 12zM9.8 15.5v-7l5.8 3.5-5.8 3.5z",
  },
  {
    href: "https://www.tiktok.com/@sector1sports",
    label: "TikTok",
    path: "M21 8.5a8.6 8.6 0 0 1-5-1.6v7.7a6.4 6.4 0 1 1-6.4-6.4c.3 0 .7 0 1 .1v3.2c-.3-.1-.6-.2-1-.2A3.3 3.3 0 1 0 13 14.6V2h3.1A5.5 5.5 0 0 0 21 6.5v2z",
  },
];

export default function Footer({
  t,
  locale = "en",
}: {
  t: Dict["footer"];
  locale?: Locale;
}) {
  const base = locale === "en" ? "" : `/${locale}`;
  return (
    <footer className="foot">
      <div className="container foot-grid">
        <div>
          <FooterBrand />
          <p className="foot-blurb">{t.blurb}</p>
        </div>
        <div className="foot-social" aria-label="Social links">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener"
            >
              <svg
                viewBox="0 0 24 24"
                width={22}
                height={22}
                fill="currentColor"
              >
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
        <div className="foot-legal">
          <a href={`${base}/terms`}>{t.terms}</a> ·{" "}
          <a href={`${base}/privacy`}>{t.privacy}</a> ·{" "}
          <a href={`${base}/responsible`}>{t.responsible}</a>
          <p>© {new Date().getFullYear()} Sector1. {t.rights}</p>
        </div>
      </div>
      {t.disclosure && (
        <div className="container">
          <p className="foot-disclosure">{t.disclosure}</p>
        </div>
      )}
      {locale === "sv" && (
        <div className="container">
          <div className="foot-responsible-se">
            <p className="foot-responsible-se-text">
              Sportsbetting innebär alltid en risk och det finns ingen garanti
              för vinst. Tidigare resultat är ingen garanti för framtida
              resultat. Allt spelande sker på egen risk och eget ansvar.
              Sector1 tillhandahåller analyser och speltips i
              informationssyfte och ansvarar inte för eventuella ekonomiska
              förluster eller andra konsekvenser som kan uppstå till följd av
              användning av vårt innehåll. Spela alltid ansvarsfullt och
              endast med pengar du har råd att förlora.
            </p>
            <div className="foot-responsible-se-badges">
              <a
                className="foot-responsible-se-badge"
                href="https://stodlinjen.se/"
                target="_blank"
                rel="noopener"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/responsible/se/stodlinjen.png"
                  alt="Stödlinjen – för spelare och anhöriga"
                  height={22}
                />
              </a>
              <a
                className="foot-responsible-se-badge"
                href="https://www.spelpaus.se/"
                target="_blank"
                rel="noopener"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/responsible/se/spelpaus.png"
                  alt="Spelpaus"
                  height={22}
                />
              </a>
              <a
                className="foot-responsible-se-badge"
                href="https://www.spelinspektionen.se/spelare/spelansvar/"
                target="_blank"
                rel="noopener"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/responsible/se/spela-ansvarsfullt.png"
                  alt="18+ Spela ansvarsfullt"
                  height={22}
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
