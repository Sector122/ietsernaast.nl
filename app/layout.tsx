import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TrackLead from "@/components/TrackLead";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import InteractionTracker from "@/components/analytics/InteractionTracker";
import TikTokPixel from "@/components/analytics/TikTokPixel";
import ChunkErrorReload from "@/components/ChunkErrorReload";
import { EXPERIMENTS } from "@/lib/experiment/config";
import { experimentBootScript } from "@/lib/experiment/boot-script";
import { ROUTE_LOCALES } from "@/lib/i18n/config";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ietsernaast.nl",
  ),
  title: "Iets Ernaast — Kijk gratis mee met Calvin",
  description:
    "Calvin laat gratis zien wat hij zelf doet. Bekijk de video en kijk mee in de gratis Telegram-groep.",
  openGraph: {
    title: "Iets Ernaast — Kijk gratis mee met Calvin",
    description:
      "Calvin laat gratis zien wat hij zelf doet. Bekijk de video en kijk mee in de gratis Telegram-groep.",
    type: "website",
    siteName: "Iets Ernaast",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iets Ernaast — Kijk gratis mee met Calvin",
    description: "Calvin laat gratis zien wat hij zelf doet.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: the experiment boot script stamps
    // data-exp-<key> onto <html> before hydration, so the attribute set differs
    // from the static SSR markup by design (see lib/experiment/boot-script.ts).
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {/* A/B test assignment — runs before paint so CSS variant swaps and the
            <html data-exp-*> attributes are set before the page content renders.
            Covers every route (this root layout wraps /[locale] too). */}
        <script
          dangerouslySetInnerHTML={{
            __html: experimentBootScript(EXPERIMENTS, ROUTE_LOCALES),
          }}
        />
        {/* Contentsquare tracking — temporarily disabled
        <Script
          src="https://t.contentsquare.net/uxa/f838a760de202.js"
          strategy="afterInteractive"
        />
        */}
        <TikTokPixel />
        <ChunkErrorReload />
        <TrackLead />
        <AnalyticsProvider />
        <InteractionTracker />
        {children}
      </body>
    </html>
  );
}
