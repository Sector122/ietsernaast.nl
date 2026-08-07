import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Vsl from "@/components/Vsl";
import WhyJoin from "@/components/WhyJoin";
import HowItWorks from "@/components/HowItWorks";
import CtaStrip from "@/components/CtaStrip";
import Reviews from "@/components/Reviews";
import Why from "@/components/Why";
import EmailCapture from "@/components/EmailCapture";
import Pricing from "@/components/Pricing";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import Orbs from "@/components/Orbs";
import IabBanner from "@/components/IabBanner";
import RevealRoot from "@/components/RevealRoot";
import { ExitIntentProvider, ExitIntentModal } from "@/components/exit-intent";
import {
  HandoffProvider,
  HandoffModal,
  HandoffInterceptor,
} from "@/components/handoff";
import { getDict } from "@/lib/i18n";
import { getBotUrl, getWhatsappUrl } from "@/lib/cta";
import { getReviewShots } from "@/lib/reviews";
import { ctaVariantFor, resolveStickyCta } from "@/lib/cta-variant";
import { pricingActiveFor } from "@/lib/pricing.config";
import MetaPixel from "@/components/analytics/MetaPixel";

export default function HomePage() {
  const d = getDict("en");
  const botUrl = getBotUrl("en");
  const whatsappUrl = getWhatsappUrl("en");
  const shots = getReviewShots("en");
  const ctaVariant = ctaVariantFor("en");
  const sticky = resolveStickyCta(ctaVariant, d);
  const showPricing = pricingActiveFor("en");

  return (
    <ExitIntentProvider disabled>
      <HandoffProvider defaultBotUrl={botUrl}>
        <MetaPixel locale="en" />
        <IabBanner t={d.iabBanner} locale="en" />
        <Orbs />
        <Nav t={d.nav} botUrl={botUrl} vip={ctaVariant === "vip"} />
        <main id="top">
          <Vsl locale="en" />
          {/* <Reviews t={d.reviews} shots={shots} /> */}
          <Hero t={d.hero} botUrl={botUrl} channelCta={d.channelCta.hero} whatsappUrl={whatsappUrl} variant={ctaVariant} tgIcon />
          {/* {d.whyJoin && <WhyJoin t={d.whyJoin} botUrl={botUrl} />} */}
          {/* <HowItWorks t={d.hiw} botUrl={botUrl} ctaSub={d.hiw.ctaSub ?? d.cta.sub} channelCta={d.channelCta.hiw} whatsappUrl={whatsappUrl} ctaSubFree={d.cta.subFree} /> */}
          {/* <CtaStrip t={d.ctaStrip} botUrl={botUrl} ctaSub={d.cta.sub} /> */}
          {/* <Why t={d.why} /> */}
          {/* email capture hidden: {d.emailSignup && <EmailCapture t={d.emailSignup} />} */}
          {showPricing && (
            <Pricing t={d.pricing} botUrl={botUrl} ctaSub={d.pricing.ctaSub ?? d.cta.sub} />
          )}
          <FinalCta t={d.finalCta} botUrl={botUrl} ctaSub={d.cta.sub} ctaSubFree={d.cta.subFree} />
        </main>
        <Footer t={d.footer} />
        <StickyCta cta={sticky.cta} sub={sticky.sub} botUrl={botUrl} tgIcon />
        {/* exit-intent email popup hidden: <ExitIntentModal t={d.exit} botUrl={botUrl} whatsappUrl={whatsappUrl} /> */}
        <HandoffModal t={d.handoff} />
        <HandoffInterceptor />
        <RevealRoot />
      </HandoffProvider>
    </ExitIntentProvider>
  );
}
