import type { Metadata } from "next";
import MetaPixel from "@/components/analytics/MetaPixel";
import BrandMark from "@/components/BrandMark";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { verifyToken } from "@/lib/onboarding/sign";
import { GENERIC_TOKEN } from "@/lib/onboarding/generic";

// Reached via signed links sent in Telegram (/onboarding?id=…&sig=…), or the
// permanent generic link (bare /onboarding) for leads with no ad click behind
// them. Never indexed either way.
export const metadata: Metadata = {
  title: "Complete your access | Sector1",
  robots: { index: false, follow: false },
};

function first(v: string | string[] | undefined): string {
  return typeof v === "string" ? v : "";
}

// Reading searchParams opts the route into SSR, which is required here: the
// signature must be checked on every request, never baked into static HTML.
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawId = first(params.id).toLowerCase();
  // No id → bare /onboarding, the permanent generic link (no signature, no
  // attribution). An id present means a signed Telegram link, which is verified.
  const generic = !rawId;
  const id = generic ? GENERIC_TOKEN : rawId;
  const sig = generic ? "" : first(params.sig);

  if (!generic && !verifyToken(id, sig)) {
    return (
      <main className="ob-page">
        <h1 className="ob-wordmark">Sector1</h1>
        <div className="ob-card ob-center">
          <div className="ob-logo">
            <BrandMark size={48} />
          </div>
          <h2 className="ob-invalid-title">This link is invalid or expired</h2>
          <p className="ob-invalid-text">
            Ask support in your Telegram chat to send you a fresh link.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="ob-page">
      <MetaPixel locale="en" />
      <h1 className="ob-wordmark">Sector1</h1>
      <p className="ob-sub">
        Please enter your correct details below to access the VIP group. We use
        them to manage your access and send service-related onboarding messages.
      </p>
      <OnboardingForm id={id} sig={sig} />
      <div className="ob-links">
        <a href="/privacy">Privacy Policy</a>
        <span aria-hidden="true">·</span>
        <a href="/terms">Terms of Service</a>
      </div>
    </main>
  );
}
