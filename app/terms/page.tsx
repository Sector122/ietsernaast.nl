import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegal } from "@/lib/legal";
import MetaPixel from "@/components/analytics/MetaPixel";

const doc = getLegal("en").terms;

export const metadata: Metadata = {
  title: `${doc.title} | Sector1`,
  description: doc.desc,
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <MetaPixel locale="en" />
      <LegalPage locale="en" doc={doc} />
    </>
  );
}
