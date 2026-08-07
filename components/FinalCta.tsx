import type { Dict } from "@/lib/i18n";

export default function FinalCta({
  t,
  botUrl,
  ctaSub,
  ctaSubFree,
}: {
  t: Dict["finalCta"];
  botUrl: string;
  ctaSub: string;
  /** Sublabel shown under the primary CTA. */
  ctaSubFree?: string;
}) {
  return (
    <section className="final-cta" id="join">
      <div className="container">
        <div className="final-cta-card">
          <span className="kicker">{t.kicker}</span>
          <h2>{t.h2}</h2>
          <p>{t.sub}</p>
          <a
            className="btn btn-primary btn-xl"
            href={botUrl}
            target="_blank"
            rel="noopener"
            data-handoff
            data-href={botUrl}
          >
            {t.cta}
          </a>
          <small className="cta-sub">{ctaSubFree ?? ctaSub}</small>
        </div>
      </div>
    </section>
  );
}
