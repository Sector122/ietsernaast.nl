import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Terms of Service",
    desc: "Terms governing access to and use of the Sector1 service.",
    updated: "May 2026",
    blocks: [
      { kind: "h2", text: "1. Who we are" },
      {
        kind: "p",
        spans: [
          "Sector1 is a sports-betting research community operated under the trading name Sector1. By accessing the website, joining our Telegram channels, or starting a trial, you agree to these terms.",
        ],
      },
      { kind: "h2", text: "2. Eligibility" },
      {
        kind: "p",
        spans: [
          "You must be 18 years or older (21+ where required by local law) and resident in a jurisdiction where placing wagers on sporting events is legal. You are responsible for confirming the legality of betting in your country.",
        ],
      },
      { kind: "h2", text: "3. The service" },
      {
        kind: "p",
        spans: [
          "Sector1 provides research, analysis, and selections across selected football markets, delivered through private Telegram channels. We do not accept stakes, operate a sportsbook, or hold customer funds. All wagers are placed by you with independent third-party operators.",
        ],
      },
      { kind: "h2", text: "4. Membership and free access" },
      {
        kind: "p",
        spans: [
          "Joining Sector1 and our Telegram channels is free. The only condition of membership is that you sign up for and place your bets with our recommended bookmaker through our partner link. You always remain free to choose where and how much you bet, but free access is offered on the basis of using our recommended bookmaker.",
        ],
      },
      { kind: "h2", text: "5. No guarantees" },
      {
        kind: "p",
        spans: [
          "Sports outcomes are uncertain by nature. Past performance, ROI, or any historical record published by Sector1 does not guarantee future results. Selections are opinions based on research and should be treated as such.",
        ],
      },
      /*
      { kind: "h2", text: "6. Trial & subscription" },
      {
        kind: "p",
        spans: [
          "New members receive a 30-day free trial. If you continue beyond day 30, the subscription is €100/month. You can cancel at any time inside Telegram by removing yourself from the channels, no notice required.",
        ],
      },
      */
      { kind: "h2", text: "6. Acceptable use" },
      {
        kind: "p",
        spans: [
          "You agree not to redistribute, screenshot for resale, or publicly share content from our private channels. Access is personal and non-transferable. Violations result in immediate termination without refund.",
        ],
      },
      { kind: "h2", text: "7. Liability" },
      {
        kind: "p",
        spans: [
          "To the maximum extent permitted by law, Sector1 is not liable for any losses, direct or indirect, arising from the use of our content, including but not limited to betting losses. You bet at your own risk.",
        ],
      },
      { kind: "h2", text: "8. Changes" },
      {
        kind: "p",
        spans: [
          "We may update these terms from time to time. Continued use of the service after an update constitutes acceptance of the revised terms.",
        ],
      },
      { kind: "h2", text: "9. Contact" },
      {
        kind: "p",
        spans: [
          "Questions about these terms: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    desc: "How Sector1 collects, uses, and protects your personal data.",
    updated: "July 2026",
    blocks: [
      { kind: "h2", text: "1. Summary" },
      {
        kind: "p",
        spans: [
          "We collect the minimum data needed to deliver the service and measure how the site and campaigns perform. We do not sell personal data. We share limited usage data and hashed identifiers with analytics and advertising providers, including Meta and TikTok, for measurement and attribution.",
        ],
      },
      { kind: "h2", text: "2. What we collect" },
      {
        kind: "ul",
        items: [
          ["Onboarding details: first and last name, email address, optional phone number, country, and self-reported deposit amount and currency."],
          ["Usage and campaign data: pages viewed, time on page, referrer, IP address, browser or device information, click or cookie identifiers, and identifiers hashed before advertising measurement."],
        ],
      },
      { kind: "h2", text: "3. Legal basis (GDPR)" },
      {
        kind: "p",
        spans: [
          "We process data on the basis of (a) performance of contract: providing the service you signed up for; (b) legitimate interest: site analytics and security; and (c) consent: where required for non-essential cookies.",
        ],
      },
      { kind: "h2", text: "4. Data retention" },
      {
        kind: "p",
        spans: [
          "We keep account data for as long as you remain a member and for up to 24 months after cancellation, after which it is deleted or anonymized. Analytics and advertising providers retain event-level or pseudonymous data according to their own retention policies.",
        ],
      },
      { kind: "h2", text: "5. Your rights" },
      {
        kind: "p",
        spans: [
          "You may request access, correction, export, or deletion of your personal data at any time. Email ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " and we will respond within 30 days.",
        ],
      },
      { kind: "h2", text: "6. Cookies" },
      {
        kind: "p",
        spans: [
          "We use first-party cookies for essential functions (session, preferences), analytics, and advertising measurement technologies from Meta and TikTok to measure campaign performance and conversions. These providers may set or read third-party cookies and similar identifiers.",
        ],
      },
      { kind: "h2", text: "7. Security" },
      {
        kind: "p",
        spans: [
          "Data is stored on servers operated by reputable EU/US providers under standard security controls (TLS in transit, encryption at rest where applicable). No system is perfectly secure, so please use a unique password.",
        ],
      },
      { kind: "h2", text: "8. Changes" },
      {
        kind: "p",
        spans: [
          "Material changes to this policy will be communicated by email or banner notice before they take effect.",
        ],
      },
    ],
  },
  responsible: {
    title: "Responsible Gambling",
    desc: "Tools, limits, and helplines to keep betting fun, safe, and under control.",
    updated: "May 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Betting should be entertainment, never a way to make money you cannot afford to lose, never an escape from stress, and never something you hide from people close to you. Sector1 sells research and structure, not certainty. If betting stops being fun, stop.",
        ],
      },
      { kind: "h2", text: "Set your limits first" },
      {
        kind: "ul",
        items: [
          ["Decide a monthly bankroll before you place a single bet. Treat it like a hobby budget."],
          ["Use a flat-stake plan (1–2% of bankroll per pick). Never chase losses by doubling up."],
          ["Keep a separate account or e-wallet for betting funds. Don't mix with savings."],
          ["Take regular breaks. A weekend off resets perspective faster than another bet ever will."],
        ],
      },
      { kind: "h2", text: "Warning signs" },
      {
        kind: "ul",
        items: [
          ["Betting more than you can comfortably afford to lose."],
          ["Borrowing money to bet, or selling things to fund bets."],
          ["Lying to family or friends about how much you bet."],
          ["Feeling restless, irritable, or low when you try to cut down."],
          ["Using betting to escape problems or numb feelings."],
        ],
      },
      { kind: "h2", text: "Tools your sportsbook offers" },
      {
        kind: "p",
        spans: [
          "Every regulated operator in the EU is required to provide deposit limits, loss limits, session reminders, time-outs, and self-exclusion. Use them. Setting a limit takes 30 seconds and saves years of regret.",
        ],
      },
      { kind: "h2", text: "Free, confidential help" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (UK & international): ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", meetings worldwide, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Sweden): 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Denmark): ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "If you need to stop" },
      {
        kind: "p",
        spans: [
          "Cancel your Sector1 access inside Telegram with one tap, then self-exclude on your sportsbook(s). If you want us to delete your data, email ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". We do not contact members who have self-excluded.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Bet responsibly · Never bet more than you can afford to lose.",
        ],
      },
    ],
  },
};

export default legal;
