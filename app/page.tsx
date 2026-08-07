import type { Metadata, Viewport } from "next";
import MetaPixel from "@/components/analytics/MetaPixel";
import VslPlayer from "@/components/VslPlayer";
import { vslFor, VSL_MEDIA_BASE } from "@/lib/i18n";
import "./ietsernaast.css";

// TODO: replace with the real Telegram invite link (t.me/+... or t.me/<name>)
// before launch. Every .btn link to t.me/* automatically fires Meta Pixel +
// CAPI Lead, Mixpanel Lead/Telegram Handoff, and the TikTok Contact event
// (see components/TrackLead.tsx + components/analytics/InteractionTracker.tsx).
const TELEGRAM_URL = "https://t.me/+REPLACE_WITH_INVITE_LINK";

// Same self-hosted VSL as sector1eu.com/nl (lib/i18n/config.ts VSL_SOURCES.nl).
const vsl = vslFor("nl");

export const metadata: Metadata = {
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
  themeColor: "#f6f4ee",
};

export default function HomePage() {
  return (
    <div className="ie-page">
      {/* Root layout keeps <html lang="en"> static for CDN caching (see
          app/[locale]/layout.tsx for the same pattern); stamp the real
          language after hydration instead of forcing a per-request render. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="nl"`,
        }}
      />
      {/* Same Meta Pixel setup as sector1eu.com/nl: "nl" fans out to both the
          balkan and nordic pixel IDs (lib/meta-pixel.ts REGIONS_BY_LOCALE). */}
      <MetaPixel locale="nl" />

      <div className="ie-announcement">Meer dan 1.300 mensen kijken al gratis mee met Calvin</div>

      <main>
        <section className="ie-hero">
          <div className="ie-container">
            <div className="ie-brand-lockup"><span className="ie-brand-mark">+</span> Iets Ernaast</div>
            <p className="ie-eyebrow">Een simpele aanpak naast je huidige baan</p>
            <h1>Dit zou jij óók kunnen.</h1>
            <p className="ie-hero-lead">Bekijk hoe Calvin iets voor zichzelf opbouwde zonder opnieuw een ingewikkelde online business te hoeven leren.</p>

            {VSL_MEDIA_BASE.startsWith("https://") && (
              <link rel="preconnect" href={VSL_MEDIA_BASE} />
            )}
            <div className="ie-video-shell">
              <div className="ie-video">
                {vsl && (
                  <VslPlayer
                    videoId={vsl.videoId}
                    mp4={vsl.mp4}
                    poster={vsl.poster}
                    posterSmall={vsl.posterSmall}
                    unmuteText="Klik voor geluid"
                  />
                )}
              </div>
            </div>

            <p className="ie-video-note">Calvin legt in de video uit wat hij zelf doet en waarom het naast een normale werkdag kan passen.</p>

            <div className="ie-hero-action">
              <a className="ie-cta btn" data-cta-location="hero" href="#telegram">Kijk gratis mee met Calvin</a>
              <p className="ie-trust-note">Geen betaalgegevens nodig • Bekijk eerst wat Calvin deelt</p>
            </div>

            <div className="ie-proof-rail" aria-label="Belangrijkste voordelen">
              <div className="ie-proof-stat"><strong>1.300+ members</strong><span>Kijken al gratis mee</span></div>
              <div className="ie-proof-stat"><strong>Minder dan 30 minuten</strong><span>Past naast een normale werkdag</span></div>
              <div className="ie-proof-stat"><strong>Eerst gratis bekijken</strong><span>Geen betaling nodig voor toegang</span></div>
            </div>
          </div>
        </section>

        <section className="ie-white-section">
          <div className="ie-container ie-value-layout">
            <div>
              <p className="ie-eyebrow">Dit krijg je in de groep</p>
              <h2>Geen lege updates. Je ziet wat Calvin zelf doet.</h2>
              <p style={{ color: "var(--ink-soft)", fontSize: 18 }}>Geen urenlange lessen of honderd dingen om eerst uit te zoeken. Open de groep wanneer het jou uitkomt en bekijk de informatie die die dag relevant is.</p>

              <div className="ie-value-points">
                <div className="ie-value-point"><span className="ie-value-icon">↗</span><div><h3>Praktische tips en keuzes</h3><p>Korte informatie waar je direct iets mee kunt.</p></div></div>
                <div className="ie-value-point"><span className="ie-value-icon">▶</span><div><h3>Persoonlijke uitleg</h3><p>Selfie-video&rsquo;s en voice notes in normale mensentaal.</p></div></div>
                <div className="ie-value-point"><span className="ie-value-icon">✓</span><div><h3>Echte memberervaringen</h3><p>Bekijk wat andere gewone mensen met de uitleg doen.</p></div></div>
              </div>

              <div className="ie-inline-action"><a className="ie-cta btn" data-cta-location="value_section" href="#telegram">Kijk gratis mee met Calvin</a></div>
            </div>

            <div className="ie-phone-wrap" aria-label="Voorbeeld van de Telegram-groep">
              <div className="ie-phone">
                <div className="ie-phone-screen">
                  <div className="ie-phone-top">Gratis groep van Calvin <small>1.300+ members</small></div>
                  <div className="ie-chat">
                    <div className="ie-bubble"><b>Praktische tip van Calvin</b>Plaats hier een echt voorbeeld van de informatie die Calvin deelt.</div>
                    <div className="ie-bubble"><b>Korte selfie-video of voice note</b><span className="ie-voice"><i>▶</i><span className="ie-voice-line"></span><small>0:42</small></span></div>
                    <div className="ie-bubble"><b>Uitleg bij Calvin&rsquo;s keuze</b>Plaats hier een echte, korte uitleg uit de groep.</div>
                    <div className="ie-bubble"><b>Resultaat van een member</b>Plaats hier een echte, goedgekeurde screenshot uit de community.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="ie-container">
            <div className="ie-section-head ie-center">
              <p className="ie-eyebrow">Calvin doet het voorwerk</p>
              <h2>Zo simpel werkt meekijken.</h2>
              <p>Geen lange route. Drie duidelijke stappen die je direct begrijpt.</p>
            </div>

            <div className="ie-flow">
              <article className="ie-flow-card"><span className="ie-step-number">1</span><h3>Open de groep</h3><p>Kijk wanneer het jou uitkomt wat Calvin heeft gedeeld.</p></article>
              <article className="ie-flow-card"><span className="ie-step-number">2</span><h3>Bekijk zijn uitleg</h3><p>Zie waar hij naar kijkt, welke keuze hij maakt en waarom.</p></article>
              <article className="ie-flow-card"><span className="ie-step-number">3</span><h3>Bepaal wat bij je past</h3><p>Begrijp de stappen en beslis zelf wat je ermee wilt doen.</p></article>
            </div>

            <div className="ie-cta-panel">
              <div><strong>Je hoeft niet maandenlang alles zelf uit te zoeken.</strong><p>Eerst kijken. Dan pas bepalen of het bij je past.</p></div>
              <a className="ie-cta btn" data-cta-location="flow" href="#telegram">Kijk gratis mee met Calvin</a>
            </div>
          </div>
        </section>

        <section className="ie-white-section">
          <div className="ie-container ie-time-grid">
            <div className="ie-clock-card" aria-label="Minder dan 30 minuten per dag">
              <div className="ie-clock"><span className="ie-clock-center"></span></div>
              <span className="ie-time-badge">Minder dan 30 minuten per dag</span>
            </div>
            <div>
              <p className="ie-eyebrow">Past naast je normale dag</p>
              <h2>Niet nóg een extra baan.</h2>
              <p style={{ color: "var(--ink-soft)", fontSize: 18 }}>Je werkt al hard genoeg. Daarom hoef je hier geen avonden voor vrij te houden of je huidige werk voor om te gooien. Meestal heb je aan 10 tot 30 minuten genoeg.</p>
              <div className="ie-moments"><span className="ie-moment">Tijdens je pauze</span><span className="ie-moment">Na het eten</span><span className="ie-moment">Voor het slapen</span></div>
              <p><strong>Iets ernaast moet naast je leven passen. Het moet je leven niet overnemen.</strong></p>
              <a className="ie-cta btn" data-cta-location="time_section" href="#telegram">Kijk gratis mee met Calvin</a>
            </div>
          </div>
        </section>

        <section>
          <div className="ie-container">
            <div className="ie-section-head ie-center">
              <p className="ie-eyebrow">Maak het concreet</p>
              <h2>Wat zou jij doen met iets extra&rsquo;s?</h2>
              <p>Geen verhaal over bedragen waar je niets bij voelt. Gewoon voorbeelden die deze maand al verschil kunnen maken.</p>
            </div>
            <div className="ie-amount-grid">
              <article className="ie-amount-card"><span className="ie-amount">€200</span><h3>Meer ademruimte</h3><p>Een avond uit eten, nieuwe kleding of iets minder nadenken aan het einde van de maand.</p></article>
              <article className="ie-amount-card"><span className="ie-amount">€300</span><h3>Iets leuks doen</h3><p>Een festival met vrienden, een date of alvast geld opzij voor een vakantie.</p></article>
              <article className="ie-amount-card"><span className="ie-amount">€500</span><h3>Echt iets merken</h3><p>Een PlayStation, een weekend weg of eindelijk wat extra buffer op je rekening.</p></article>
            </div>
            <p className="ie-amount-note">Dit zijn visualisaties, geen belofte of garantie. Wat iemand bereikt verschilt en hangt af van eigen keuzes.</p>
          </div>
        </section>

        <section className="ie-white-section">
          <div className="ie-container">
            <div className="ie-section-head">
              <p className="ie-eyebrow">Resultaten uit de community</p>
              <h2>Gewone mensen. Herkenbare resultaten.</h2>
              <p>Laat hier vooral echte screenshots spreken. Eerst kleine en herkenbare resultaten; grotere uitschieters pas later.</p>
            </div>
            <div className="ie-proof-grid">
              <article className="ie-proof-card"><div className="ie-proof-shot"><span className="ie-proof-placeholder">Echte screenshot<br />sceptische starter</span></div><div className="ie-proof-copy"><strong>&ldquo;Eerst even aangekeken. Daarna zelf de stappen gevolgd.&rdquo;</strong><span>Vervang door goedgekeurd bewijs</span></div></article>
              <article className="ie-proof-card"><div className="ie-proof-shot"><span className="ie-proof-placeholder">Echt resultaat<br />€200–€500 + periode</span></div><div className="ie-proof-copy"><strong>Een bedrag waar je deze maand daadwerkelijk iets van merkt.</strong><span>Vervang door goedgekeurd bewijs</span></div></article>
              <article className="ie-proof-card"><div className="ie-proof-shot"><span className="ie-proof-placeholder">Echte reactie<br />simpele uitleg</span></div><div className="ie-proof-copy"><strong>&ldquo;Eindelijk iemand die het gewoon makkelijk uitlegt.&rdquo;</strong><span>Vervang door goedgekeurd bewijs</span></div></article>
              <article className="ie-proof-card"><div className="ie-proof-shot"><span className="ie-proof-placeholder">Echt klein resultaat<br />weinig tijd</span></div><div className="ie-proof-copy"><strong>Ook een eerste klein resultaat is een begin.</strong><span>Vervang door goedgekeurd bewijs</span></div></article>
            </div>
            <div className="ie-cta-panel">
              <div><strong>Meer dan 1.300 mensen kijken al mee.</strong><p>Bekijk de informatie en ervaringen zelf in Telegram.</p></div>
              <a className="ie-cta btn" data-cta-location="proof" href="#telegram">Kijk gratis mee met Calvin</a>
            </div>
          </div>
        </section>

        <section>
          <div className="ie-container">
            <article className="ie-story-card">
              <div className="ie-story-photo">
                <div className="ie-story-photo-copy"><span>Plaats hier een echte foto van Calvin</span><strong>&ldquo;Ik stond ook gewoon om zes uur op om naar mijn werk te gaan.&rdquo;</strong></div>
              </div>
              <div className="ie-story-copy">
                <p className="ie-eyebrow">Waarom Calvin dit deelt</p>
                <h2>Geen goeroe. Gewoon iemand die ooit op hetzelfde punt stond.</h2>
                <p>Voordat ik dit deed, werkte ik onder andere in een steenfabriek en in de industriële schoonmaak. Vroeg op, lange dagen en &rsquo;s avonds weinig tijd of energie voor mezelf.</p>
                <p>Ik wist dat ik iets anders wilde, maar bijna alles wat ik online zag voelde onnodig ingewikkeld. Tot iemand mij simpel liet meekijken met wat hij zelf deed.</p>
                <p>Dat maakte voor mij het verschil. Daarom laat ik jou nu op dezelfde manier meekijken — zonder er een groot of onrealistisch verhaal van te maken.</p>
                <p className="ie-signature">Kijk eerst rustig rond. Dan merk je vanzelf of het bij je past.<br />— Calvin</p>
                <a className="ie-cta btn" data-cta-location="story" href="#telegram">Kijk gratis mee met Calvin</a>
              </div>
            </article>
          </div>
        </section>

        <section className="ie-white-section">
          <div className="ie-container">
            <div className="ie-free-card">
              <div>
                <p className="ie-eyebrow">Waar zit het addertje?</p>
                <h2>Ja, de groep is echt gratis.</h2>
                <p>Je hoeft geen betaalgegevens achter te laten om binnen te kijken. Open de groep, bekijk wat Calvin deelt en beslis daarna zelf of je er iets mee wilt doen.</p>
                <a className="ie-cta btn" data-cta-location="free_card" href="#telegram">Kijk gratis mee met Calvin</a>
              </div>
              <div className="ie-trust-stack">
                <div className="ie-trust-row"><span className="ie-check">✓</span><div><strong>Geen betaalgegevens</strong><span>Nodig om de Telegram-groep te openen</span></div></div>
                <div className="ie-trust-row"><span className="ie-check">✓</span><div><strong>Eerst zelf beoordelen</strong><span>Kijk voordat je een vervolgstap kiest</span></div></div>
                <div className="ie-trust-row"><span className="ie-check">✓</span><div><strong>Vrijwillige vervolgstappen</strong><span>Jij bepaalt altijd zelf wat je doet</span></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="telegram">
          <div className="ie-container">
            <div className="ie-section-head ie-center">
              <p className="ie-eyebrow">Binnen ongeveer één minuut</p>
              <h2>Zo kom je in de groep.</h2>
              <p>Ook dit hoeft niet moeilijker te zijn dan nodig.</p>
            </div>
            <div className="ie-telegram-steps">
              <article className="ie-telegram-step"><h3>Download Telegram</h3><p>Een gratis berichtenapp voor je telefoon. Heb je hem al, dan sla je deze stap over.</p></article>
              <article className="ie-telegram-step"><h3>Maak je account aan</h3><p>Volg de korte stappen in de app. Er zijn geen betaalgegevens nodig.</p></article>
              <article className="ie-telegram-step"><h3>Open de gratis groep</h3><p>Klik op de knop en Telegram opent direct de groep van Calvin voor je.</p></article>
            </div>
            <div className="ie-cta-panel">
              <div><strong>Klaar om eerst zelf te kijken?</strong><p>Je gaat direct naar de gratis Telegram-groep.</p></div>
              <a className="ie-cta btn" data-cta-location="telegram_steps" href={TELEGRAM_URL}>Kijk gratis mee met Calvin</a>
            </div>
          </div>
        </section>

        <section className="ie-white-section">
          <div className="ie-container">
            <div className="ie-section-head ie-center">
              <p className="ie-eyebrow">Alleen wat nog niet is uitgelegd</p>
              <h2>Nog vier korte vragen.</h2>
            </div>
            <div className="ie-faq">
              <details><summary>Wat is het precieze model?</summary><p>Calvin laat dit direct binnen de groep zien, samen met de korte uitleg die je nodig hebt om het te begrijpen. Het gaat om een markt die veel mensen al kennen, maar waar de meesten nog niet op deze praktische manier naar hebben gekeken.</p></details>
              <details><summary>Heb ik ervaring nodig?</summary><p>Nee. De groep is juist gemaakt voor mensen die niet eerst een compleet nieuw vak willen leren. Calvin laat zien waar hij zelf naar kijkt en legt zijn keuzes simpel uit.</p></details>
              <details><summary>Hoe snel kan ik resultaat verwachten?</summary><p>Dat verschilt per persoon en hangt af van eigen keuzes en actie. Sommige members delen snel een eerste resultaat, maar er is geen vaste uitkomst of garantie. Bekijk daarom vooral de echte voorbeelden in de groep.</p></details>
              <details><summary>Waarom kan Calvin dit gratis delen?</summary><p>Iets Ernaast werkt samen met externe partners. Wanneer iemand later vrijwillig een partnerlink gebruikt, kan Iets Ernaast daarvoor een vergoeding ontvangen. Je gratis toegang hangt daar niet van af.</p></details>
            </div>
          </div>
        </section>

        <section className="ie-final">
          <div className="ie-container">
            <p className="ie-eyebrow">De groep is nu nog open</p>
            <h2>Je kunt opnieuw denken: &ldquo;Ik kijk er later wel naar.&rdquo;</h2>
            <p>Of je opent de groep nu even, kijkt rustig rond en bepaalt daarna zelf of dit eindelijk iets is wat bij jou past.</p>
            <a className="ie-cta btn" data-cta-location="final_cta" href="#telegram">Kijk gratis mee met Calvin</a>
            <span className="ie-final-note">Nu gratis toegankelijk • Geen betaalgegevens nodig</span>
          </div>
        </section>
      </main>

      <footer>
        <div className="ie-container ie-footer-inner">
          <div>
            <div className="ie-footer-brand">Iets Ernaast</div>
            <p className="ie-disclosure">Iets Ernaast werkt samen met externe partners. Wanneer je vrijwillig via een partnerlink een account opent, kunnen wij daarvoor een vergoeding ontvangen. Dit verandert niets aan je gratis toegang tot de community.</p>
          </div>
          <nav className="ie-footer-links" aria-label="Footer">
            <a href="#">Privacy</a>
            <a href="#">Voorwaarden</a>
            <a href="#">Contact</a>
            <a href="#">Verantwoord spelen</a>
          </nav>
        </div>
      </footer>

      <aside className="ie-sticky-cta" data-cta-location="sticky" aria-label="Gratis groep openen">
        <div className="ie-sticky-copy"><strong>1.300+ mensen kijken al mee</strong><span>Gratis toegang • Geen betaalgegevens</span></div>
        <a className="ie-cta btn" href="#telegram">Kijk gratis mee met Calvin</a>
      </aside>
    </div>
  );
}
