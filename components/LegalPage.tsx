import Nav from "./Nav";
import Footer from "./Footer";
import LegalBody from "./LegalBody";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getBotUrl } from "@/lib/cta";
import { ctaVariantFor } from "@/lib/cta-variant";
import type { LegalDoc } from "@/lib/legal/types";

export default function LegalPage({
  locale,
  doc,
}: {
  locale: Locale;
  doc: LegalDoc;
}) {
  const d = getDict(locale);
  const home = locale === "en" ? "/" : `/${locale}`;
  return (
    <>
      <Nav t={d.nav} homeHref={home} botUrl={getBotUrl(locale)} vip={ctaVariantFor(locale) === "vip"} />
      <main className="legal">
        <div className="container legal-container">
          <a className="legal-back" href={home}>
            ← {d.legal.back}
          </a>
          <h1>{doc.title}</h1>
          <p className="legal-meta">
            {d.legal.lastUpdated}: {doc.updated}
          </p>
          <div className="legal-body">
            <LegalBody blocks={doc.blocks} />
          </div>
        </div>
      </main>
      <Footer t={d.footer} locale={locale} />
    </>
  );
}
