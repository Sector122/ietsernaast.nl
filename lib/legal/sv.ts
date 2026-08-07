import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Användarvillkor",
    desc: "Villkor som styr åtkomsten till och användningen av Sector1-tjänsten.",
    updated: "Maj 2026",
    blocks: [
      { kind: "h2", text: "1. Vilka vi är" },
      {
        kind: "p",
        spans: [
          "Sector1 är en analysgemenskap för sportspel som drivs under handelsnamnet Sector1. Genom att besöka webbplatsen, gå med i våra Telegram-kanaler eller starta en provperiod godkänner du dessa villkor.",
        ],
      },
      { kind: "h2", text: "2. Behörighet" },
      {
        kind: "p",
        spans: [
          "Du måste vara 18 år eller äldre (21+ där lokal lag kräver det) och bosatt i en jurisdiktion där det är lagligt att spela på sportevenemang. Du ansvarar själv för att kontrollera att spel är lagligt i ditt land.",
        ],
      },
      { kind: "h2", text: "3. Tjänsten" },
      {
        kind: "p",
        spans: [
          "Sector1 tillhandahåller analys, research och spelförslag på utvalda fotbollsmarknader, levererade via privata Telegram-kanaler. Vi tar inte emot insatser, driver inget spelbolag och förvarar inga kundmedel. Alla spel placeras av dig hos oberoende tredjepartsoperatörer.",
        ],
      },
      { kind: "h2", text: "4. Medlemskap och kostnadsfri åtkomst" },
      {
        kind: "p",
        spans: [
          "Att gå med i Sector1 och våra Telegram-kanaler är kostnadsfritt. Det enda villkoret för medlemskap är att du registrerar dig hos och placerar dina spel hos vårt rekommenderade spelbolag via vår partnerlänk. Du är alltid fri att välja var och hur mycket du spelar, men kostnadsfri åtkomst erbjuds på grundval av att du använder vårt rekommenderade spelbolag.",
        ],
      },
      { kind: "h2", text: "5. Inga garantier" },
      {
        kind: "p",
        spans: [
          "Sportresultat är till sin natur osäkra. Tidigare resultat, ROI eller någon historik som publicerats av Sector1 garanterar inte framtida resultat. Spelförslag är åsikter baserade på research och bör behandlas som sådana.",
        ],
      },
      /*
      { kind: "h2", text: "6. Provperiod & prenumeration" },
      {
        kind: "p",
        spans: [
          "Nya medlemmar får en kostnadsfri provperiod på 30 dagar. Om du fortsätter efter dag 30 kostar prenumerationen 100 €/månad. Du kan avsluta när som helst i Telegram genom att ta bort dig själv från kanalerna, ingen uppsägningstid krävs.",
        ],
      },
      */
      { kind: "h2", text: "6. Tillåten användning" },
      {
        kind: "p",
        spans: [
          "Du samtycker till att inte vidaredistribuera, skärmdumpa för återförsäljning eller offentligt dela innehåll från våra privata kanaler. Åtkomsten är personlig och får inte överlåtas. Överträdelser leder till omedelbar avstängning utan återbetalning.",
        ],
      },
      { kind: "h2", text: "7. Ansvar" },
      {
        kind: "p",
        spans: [
          "I den utsträckning lagen tillåter ansvarar Sector1 inte för några förluster, direkta eller indirekta, som uppstår genom användning av vårt innehåll, inklusive men inte begränsat till spelförluster. Du spelar på egen risk.",
        ],
      },
      { kind: "h2", text: "8. Ändringar" },
      {
        kind: "p",
        spans: [
          "Vi kan uppdatera dessa villkor då och då. Fortsatt användning av tjänsten efter en uppdatering innebär att du godkänner de reviderade villkoren.",
        ],
      },
      { kind: "h2", text: "9. Kontakt" },
      {
        kind: "p",
        spans: [
          "Frågor om dessa villkor: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Integritetspolicy",
    desc: "Hur Sector1 samlar in, använder och skyddar dina personuppgifter.",
    updated: "Juli 2026",
    blocks: [
      { kind: "h2", text: "1. Sammanfattning" },
      {
        kind: "p",
        spans: [
          "Vi samlar in de minsta uppgifter som behövs för att leverera tjänsten och mäta webbplatsens och kampanjernas resultat. Vi säljer inte personuppgifter. Vi delar begränsade användningsdata och hashade identifierare med analys- och annonsleverantörer, inklusive Meta och TikTok, för mätning och attribuering.",
        ],
      },
      { kind: "h2", text: "2. Vad vi samlar in" },
      {
        kind: "ul",
        items: [
          ["Onboardinguppgifter: för- och efternamn, e-postadress, valfritt telefonnummer, land samt självrapporterat insättningsbelopp och valuta."],
          ["Användnings- och kampanjdata: visade sidor, tid på sidan, hänvisande källa, IP-adress, webbläsar- eller enhetsinformation, klick- eller cookieidentifierare och identifierare som hashas före annonsmätning."],
        ],
      },
      { kind: "h2", text: "3. Rättslig grund (GDPR)" },
      {
        kind: "p",
        spans: [
          "Vi behandlar uppgifter på grundval av (a) fullgörande av avtal: att tillhandahålla den tjänst du registrerat dig för; (b) berättigat intresse: webbstatistik och säkerhet; och (c) samtycke: där det krävs för icke-nödvändiga cookies.",
        ],
      },
      { kind: "h2", text: "4. Lagringstid" },
      {
        kind: "p",
        spans: [
          "Vi behåller kontouppgifter så länge du är medlem och i upp till 24 månader efter avslut, varefter de raderas eller anonymiseras. Analys- och annonsleverantörer behåller händelsedata eller pseudonyma data enligt sina egna lagringspolicyer.",
        ],
      },
      { kind: "h2", text: "5. Dina rättigheter" },
      {
        kind: "p",
        spans: [
          "Du kan när som helst begära åtkomst, rättelse, export eller radering av dina personuppgifter. Mejla ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " så svarar vi inom 30 dagar.",
        ],
      },
      { kind: "h2", text: "6. Cookies" },
      {
        kind: "p",
        spans: [
          "Vi använder förstapartscookies för nödvändiga funktioner (session, inställningar), analys samt annonseringsmätningsteknik från Meta och TikTok för att mäta kampanjresultat och konverteringar. Dessa leverantörer kan placera eller läsa tredjepartscookies och liknande identifierare.",
        ],
      },
      { kind: "h2", text: "7. Säkerhet" },
      {
        kind: "p",
        spans: [
          "Uppgifter lagras på servrar som drivs av välrenommerade leverantörer i EU/USA under standardmässiga säkerhetskontroller (TLS under överföring, kryptering i vila där så är tillämpligt). Inget system är helt säkert, använd ett unikt lösenord.",
        ],
      },
      { kind: "h2", text: "8. Ändringar" },
      {
        kind: "p",
        spans: [
          "Väsentliga ändringar i denna policy meddelas via e-post eller bannermeddelande innan de träder i kraft.",
        ],
      },
    ],
  },
  responsible: {
    title: "Ansvarsfullt spelande",
    desc: "Verktyg, gränser och stödlinjer som håller spelandet roligt, säkert och under kontroll.",
    updated: "Maj 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Spel ska vara underhållning, aldrig ett sätt att tjäna pengar du inte har råd att förlora, aldrig en flykt från stress och aldrig något du döljer för dina närmaste. Sector1 säljer research och struktur, inte säkerhet. Om spelandet slutar vara roligt, sluta.",
        ],
      },
      { kind: "h2", text: "Sätt dina gränser först" },
      {
        kind: "ul",
        items: [
          ["Bestäm en månadsbudget innan du lägger ett enda spel. Behandla den som en hobbybudget."],
          ["Använd en fast insatsplan (1–2 % av budgeten per spelförslag). Jaga aldrig förluster genom att dubbla."],
          ["Ha ett separat konto eller e-plånbok för spelpengar. Blanda inte med sparpengar."],
          ["Ta regelbundna pauser. En helg ledigt återställer perspektivet snabbare än något ytterligare spel."],
        ],
      },
      { kind: "h2", text: "Varningssignaler" },
      {
        kind: "ul",
        items: [
          ["Spela för mer än du bekvämt har råd att förlora."],
          ["Låna pengar för att spela, eller sälja saker för att finansiera spel."],
          ["Ljuga för familj eller vänner om hur mycket du spelar."],
          ["Känna dig rastlös, irriterad eller nedstämd när du försöker dra ner."],
          ["Använda spel för att fly från problem eller bedöva känslor."],
        ],
      },
      { kind: "h2", text: "Verktyg som ditt spelbolag erbjuder" },
      {
        kind: "p",
        spans: [
          "Varje reglerad operatör i EU är skyldig att erbjuda insättningsgränser, förlustgränser, sessionspåminnelser, pauser och självavstängning. Använd dem. Att sätta en gräns tar 30 sekunder och besparar dig år av ånger.",
        ],
      },
      { kind: "h2", text: "Gratis, konfidentiell hjälp" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (Storbritannien & internationellt): ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", möten världen över, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Sverige): 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Danmark): ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "Om du behöver sluta" },
      {
        kind: "p",
        spans: [
          "Avsluta din Sector1-åtkomst i Telegram med en tryckning och stäng sedan av dig själv hos ditt/dina spelbolag. Om du vill att vi raderar dina uppgifter, mejla ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". Vi kontaktar inte medlemmar som har självavstängt sig.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Spela ansvarsfullt · Spela aldrig för mer än du har råd att förlora.",
        ],
      },
    ],
  },
};

export default legal;
