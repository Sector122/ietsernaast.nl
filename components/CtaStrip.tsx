import type { Dict } from "@/lib/i18n";

export default function CtaStrip({ t, botUrl, ctaSub }: { t: Dict["ctaStrip"]; botUrl: string; ctaSub: string }) {
  return (
    <section className="cta-strip">
      <div className="container cta-strip-inner">
        <div>
          <h3>{t.h3}</h3>
          <p>{t.p}</p>
        </div>
        <div className="cta-strip-cta">
          <a
            className="btn btn-primary btn-lg"
            href={botUrl}
            target="_blank"
            rel="noopener"
            data-handoff
            data-href={botUrl}
          >
            {t.cta}
          </a>
          <small className="cta-sub">{ctaSub}</small>
        </div>
      </div>
    </section>
  );
}
