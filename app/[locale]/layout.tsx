import MetaPixel from "@/components/analytics/MetaPixel";
import { HTML_LANG, isLocale } from "@/lib/i18n";

// Layout for all localized (/[locale]/*) routes. Renders the Meta Pixel and
// sets <html lang> per locale. The root layout stays static (lang="en") so
// pages prerender as static files (served from the CDN, no per-request
// serverless function).
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lang = isLocale(locale) ? HTML_LANG[locale] : "en";

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(lang)}`,
        }}
      />
      <MetaPixel locale={locale} />
      {children}
    </>
  );
}
