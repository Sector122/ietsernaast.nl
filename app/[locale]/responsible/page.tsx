import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPage from "@/components/LegalPage";
import { getLegal } from "@/lib/legal";
import { isLocale, ROUTE_LOCALES } from "@/lib/i18n";

export function generateStaticParams() {
  return ROUTE_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const doc = getLegal(locale).responsible;
  return {
    title: `${doc.title} | Sector1`,
    description: doc.desc,
    robots: { index: true, follow: true },
  };
}

export default async function LocaleResponsiblePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return <LegalPage locale={locale} doc={getLegal(locale).responsible} />;
}
