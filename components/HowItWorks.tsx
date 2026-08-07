import GlassBalls from "./GlassBalls";
import ChannelCta from "./ChannelCta";
import type { Dict } from "@/lib/i18n";

const icons = [
  (
    <svg
      key="1"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M19 8v6M22 11h-6" />
    </svg>
  ),
  (
    <svg
      key="2"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
      <path d="M14 8h5v5" />
    </svg>
  ),
  (
    <svg
      key="3"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
    </svg>
  ),
  (
    <svg
      key="4"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
];

export default function HowItWorks({
  t,
  botUrl,
  ctaSub,
  channelCta,
  whatsappUrl,
  ctaSubFree,
}: {
  t: Dict["hiw"];
  botUrl: string;
  ctaSub: string;
  channelCta: Dict["channelCta"]["hiw"];
  whatsappUrl?: string;
  /** Sublabel shown under the primary CTA. */
  ctaSubFree?: string;
}) {
  const steps = t.steps.map((s, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: s.title,
    body: s.body,
    ico: icons[i],
  }));

  return (
    <section className="hiw" id="how">
      <GlassBalls variant="hiw" />
      <div className="container">
        <div className="section-head">
          <span className="kicker">{t.kicker}</span>
          <h2>{t.h2}</h2>
          <p>{t.sub}</p>
        </div>
        <div className="hiw-grid">
          {steps.map((s, i) => (
            <article
              className="hiw-card"
              key={s.n}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="hiw-head">
                <div className="hiw-ico" aria-hidden="true">
                  {s.ico}
                </div>
                <span className="hiw-num">{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {i < steps.length - 1 && (
                <span className="hiw-link" aria-hidden="true" />
              )}
            </article>
          ))}
        </div>
        {whatsappUrl ? (
          <ChannelCta
            variant="glow"
            size="lg"
            className="hiw-channel-cta"
            title={channelCta.title}
            sub={channelCta.sub}
            telegramUrl={botUrl}
            whatsappUrl={whatsappUrl}
          />
        ) : (
          <div className="hiw-cta">
            <h3 className="hiw-cta-title">{t.ctaTitle}</h3>
            <div className="hiw-cta-actions">
              <a
                className="btn btn-primary btn-lg"
                href={botUrl}
                target="_blank"
                rel="noopener"
                data-handoff
                data-href={botUrl}
              >
                {t.ctaPrimary}
              </a>
              <a className="btn btn-ghost btn-lg" href="#vsl">
                {t.ctaSecondary}
              </a>
            </div>
            <small className="cta-sub">{ctaSubFree ?? ctaSub}</small>
          </div>
        )}
      </div>
    </section>
  );
}
