import type { Dict } from "@/lib/i18n";
import { FREE_GROUP_URL } from "@/lib/cta";
export default function Pricing({ t, botUrl, ctaSub }: { t: Dict["pricing"]; botUrl: string; ctaSub: string }) {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="pricing-card">
          <span className="ribbon">{t.ribbon}</span>
          <h2>{t.h2}</h2>
          <p>{t.sub}</p>

          {/* <div className="price-line">
            <span className="price-strike" aria-label={t.strikeLabel}>
              <span className="price-strike-num">€100</span>
            </span>
            <span className="price-zero">€0</span>
            <span className="price-period">{t.period}</span>
          </div> */}

          <ul className="price-feats">
            {t.feats.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>

          <a
            className="btn btn-primary btn-xl btn-block"
            href={FREE_GROUP_URL}
            target="_blank"
            rel="noopener"
            data-handoff
            data-href={FREE_GROUP_URL}
          >
            {t.cta}
          </a>
          {/* <small className="cta-sub">{ctaSub}</small> */}
          {/* <small className="price-foot">{t.foot}</small> */}

          <div className="responsible" role="note">
            <span className="responsible-ico" aria-hidden="true">
              18+
            </span>
            <p>{t.responsible}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
