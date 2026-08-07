export type Dict = {
  nav: {
    howItWorks: string;
    whyJoin: string;
    getTips: string;
    cta: string;
    ctaVip: string;
    geoLabel: string;
  };
  vsl: {
    kicker: string;
    headline1: string;
    headline2: string;
    headline3: string;
    sub: string;
    cta: string;
    /** Sub-text shown under the VSL CTA button. Optional, per-locale. */
    ctaSub?: string;
    /** Primary VIP conversion CTA (Talk to Jakob) under the video. Optional: EN for now. */
    ctaVip?: string;
    foot?: string;
    /** Unmute pill label on the muted-autoplay video. Falls back to English. */
    unmute?: string;
  };
  cta: {
    /** Shared sublabel rendered under every primary CTA button. */
    sub: string;
    /** Free-variant sublabel (CTA variant = "free"). Falls back to empty. */
    subFree?: string;
  };
  /**
   * CTA copy used ONLY when the dual-channel (Telegram + WhatsApp) button
   * variant is rendered, so that variant can differ from the single-button
   * copy. Each section mirrors the title/sub it would otherwise inherit.
   */
  channelCta: {
    hero: { title: string; sub: string };
    hiw: { title: string; sub: string };
    vsl: { title: string; sub: string };
  };
  hero: {
    eyebrow: string;
    h1Line1: string;
    h1Line2: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Primary VIP conversion CTA (Talk to Jakob). Optional: EN for now. */
    ctaVip?: string;
    /** Per-section CTA sublabel override. Falls back to cta.sub. */
    ctaSub?: string;
    whyNow: string;
    trust: [string, string, string, string];
    roiHead: string;
    roiMeta: string;
    /** ROI widget "verified" provenance chip. Optional: falls back to "Verified". */
    roiVerified?: string;
    /** ROI widget recency stamp, e.g. "synced". Optional: falls back to "synced". */
    roiUpdated?: string;
    /** ROI widget trailing-30d delta label, e.g. "30d". Optional: falls back to "30d". */
    roiDelta?: string;
    liveTips: string;
    cardFoot: string;
    tgTitle: string;
    tgMsg: string;
    tgTime: string;
  };
  /** Two-path choice block. Optional: only populated where translated (EN for now). */
  hiw: {
    kicker: string;
    h2: string;
    sub: string;
    steps: {
      title: string;
      body: string;
    }[];
    /** Heading above the in-section CTA banner under the steps. */
    ctaTitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /** Per-section CTA sublabel override. Falls back to cta.sub. */
    ctaSub?: string;
  };
  /** Closing "don't miss out" CTA section at the bottom of the page. */
  finalCta: {
    kicker: string;
    h2: string;
    sub: string;
    cta: string;
  };
  /** On-page email capture section. Optional: EN for now. */
  emailSignup?: {
    kicker: string;
    h2: string;
    sub: string;
    placeholder: string;
    cta: string;
    note: string;
    invalid: string;
    thanks: string;
  };
  ctaStrip: {
    h3: string;
    p: string;
    cta: string;
  };
  reviews: {
    kicker: string;
    h2: string;
    sub: string;
    prev: string;
    next: string;
    /** Use {n} as the index placeholder. */
    alt: string;
  };
  why: {
    kicker: string;
    h2: string;
    items: { title: string; body: string }[];
  };
  /**
   * "Why to join Sector1" recognition section (after the hero).
   * Optional: English only for now until locales are translated.
   */
  whyJoin?: {
    kicker: string;
    h2: string;
    sub: string;
    /**
     * Recognition cards: each pairs a pain the reader feels (`pain`) with the
     * reassuring relief Sector1 provides (`fix`).
     */
    items: { pain: string; fix: string }[];
    /** Closing empathy + opportunity line, shown as the featured card. */
    promise: string;
    /** Primary CTA label inside the promise card. */
    cta: string;
    /** Small reassurance line under the CTA. */
    ctaSub: string;
    /** Tap/click cue shown on a collapsed card, before the `fix` is revealed. */
    revealHint: string;
  };
  pricing: {
    ribbon: string;
    h2: string;
    sub: string;
    strikeLabel: string;
    period: string;
    feats: [string, string, string, string];
    cta: string;
    /** Per-section CTA sublabel override. Falls back to cta.sub. */
    ctaSub?: string;
    foot: string;
    responsible: string;
    /** Partner/referral disclosure line. Optional: EN for now. */
    disclosure?: string;
  };
  footer: {
    blurb: string;
    terms: string;
    privacy: string;
    responsible: string;
    rights: string;
    /** Partner/referral disclosure line. Optional: EN for now. */
    disclosure?: string;
  };
  legal: {
    back: string;
    lastUpdated: string;
  };
  sticky: {
    cta: string;
    sub: string;
    /** Free-variant sticky CTA label. Falls back to the localized free group CTA. */
    ctaFree?: string;
    /** Free-variant sticky sublabel. Falls back to empty. */
    subFree?: string;
  };
  exit: {
    badge: string;
    title: string;
    sub: string;
    cta: string;
    /** Dual-channel exit buttons: per-platform "Message on X" labels. */
    ctaTelegram: string;
    ctaWhatsapp: string;
    emailAside: string;
    emailPlaceholder: string;
    emailCta: string;
    emailNote: string;
    emailThanks: string;
    dividerOr: string;
    close: string;
  };
  handoff: {
    badge: string;
    title: string;
    sub: string;
    steps: [string, string, string];
    emailLabel: string;
    emailPlaceholder: string;
    emailSkipNote: string;
    emailCta: string;
    emailThanks: string;
    continueCta: string;
    qrLabel: string;
    qrToggle: string;
    webFallback: string;
    close: string;
  };
  iabBanner: {
    /** Use {action} as the placeholder for the bold "open in …" instruction. */
    message: string;
    openInSafari: string;
    openInChrome: string;
    openInBrowser: string;
    dismiss: string;
  };
};
