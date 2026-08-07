import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Servicevoorwaarden",
    desc: "Voorwaarden voor de toegang tot en het gebruik van de Sector1-service.",
    updated: "Mei 2026",
    blocks: [
      { kind: "h2", text: "1. Wie we zijn" },
      {
        kind: "p",
        spans: [
          "Sector1 is een onderzoekscommunity voor sportweddenschappen die opereert onder de handelsnaam Sector1. Door de website te bezoeken, lid te worden van onze Telegram-kanalen of een proefperiode te starten, ga je akkoord met deze voorwaarden.",
        ],
      },
      { kind: "h2", text: "2. Geschiktheid" },
      {
        kind: "p",
        spans: [
          "Je moet 18 jaar of ouder zijn (21+ waar de lokale wet dit vereist) en woonachtig zijn in een rechtsgebied waar wedden op sportevenementen legaal is. Je bent zelf verantwoordelijk voor het controleren van de legaliteit van wedden in jouw land.",
        ],
      },
      { kind: "h2", text: "3. De service" },
      {
        kind: "p",
        spans: [
          "Sector1 levert onderzoek, analyses en selecties voor geselecteerde voetbalmarkten, geleverd via privé-Telegram-kanalen. Wij accepteren geen inzetten, exploiteren geen bookmaker en houden geen klantgelden aan. Alle weddenschappen worden door jou geplaatst bij onafhankelijke externe operators.",
        ],
      },
      { kind: "h2", text: "4. Lidmaatschap en gratis toegang" },
      {
        kind: "p",
        spans: [
          "Lid worden van Sector1 en onze Telegram-kanalen is gratis. De enige voorwaarde voor het lidmaatschap is dat je je aanmeldt bij en je weddenschappen plaatst bij onze aanbevolen bookmaker via onze partnerlink. Het staat je altijd vrij om te kiezen waar en hoeveel je wedt, maar gratis toegang wordt aangeboden op basis van het gebruik van onze aanbevolen bookmaker.",
        ],
      },
      { kind: "h2", text: "5. Geen garanties" },
      {
        kind: "p",
        spans: [
          "Sportuitslagen zijn van nature onzeker. Resultaten uit het verleden, ROI of enige door Sector1 gepubliceerde historische staat van dienst bieden geen garantie voor toekomstige resultaten. Selecties zijn op onderzoek gebaseerde meningen en moeten als zodanig worden behandeld.",
        ],
      },
      /*
      { kind: "h2", text: "6. Proefperiode & abonnement" },
      {
        kind: "p",
        spans: [
          "Nieuwe leden krijgen een gratis proefperiode van 30 dagen. Als je na dag 30 doorgaat, bedraagt het abonnement € 100/maand. Je kunt op elk moment opzeggen in Telegram door jezelf uit de kanalen te verwijderen, zonder opzegtermijn.",
        ],
      },
      */
      { kind: "h2", text: "6. Aanvaardbaar gebruik" },
      {
        kind: "p",
        spans: [
          "Je stemt ermee in om content uit onze privékanalen niet te herverspreiden, voor wederverkoop te screenshotten of openbaar te delen. Toegang is persoonlijk en niet overdraagbaar. Overtredingen leiden tot onmiddellijke beëindiging zonder terugbetaling.",
        ],
      },
      { kind: "h2", text: "7. Aansprakelijkheid" },
      {
        kind: "p",
        spans: [
          "Voor zover wettelijk toegestaan is Sector1 niet aansprakelijk voor enige directe of indirecte verliezen die voortvloeien uit het gebruik van onze content, met inbegrip van maar niet beperkt tot weddenschapsverliezen. Je wedt op eigen risico.",
        ],
      },
      { kind: "h2", text: "8. Wijzigingen" },
      {
        kind: "p",
        spans: [
          "We kunnen deze voorwaarden van tijd tot tijd bijwerken. Voortgezet gebruik van de service na een update geldt als aanvaarding van de herziene voorwaarden.",
        ],
      },
      { kind: "h2", text: "9. Contact" },
      {
        kind: "p",
        spans: [
          "Vragen over deze voorwaarden: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Privacybeleid",
    desc: "Hoe Sector1 je persoonsgegevens verzamelt, gebruikt en beschermt.",
    updated: "Juli 2026",
    blocks: [
      { kind: "h2", text: "1. Samenvatting" },
      {
        kind: "p",
        spans: [
          "We verzamelen de minimale gegevens die nodig zijn om de service te leveren en de prestaties van de site en campagnes te meten. We verkopen geen persoonsgegevens. We delen beperkte gebruiksgegevens en gehashte identificatiegegevens met analyse- en advertentieaanbieders, waaronder Meta en TikTok, voor meting en attributie.",
        ],
      },
      { kind: "h2", text: "2. Wat we verzamelen" },
      {
        kind: "ul",
        items: [
          ["Onboardinggegevens: voor- en achternaam, e-mailadres, optioneel telefoonnummer, land en het zelf opgegeven stortingsbedrag en de valuta."],
          ["Gebruiks- en campagnegegevens: bekeken pagina's, tijd op pagina, verwijzer, IP-adres, browser- of apparaatgegevens, klik- of cookie-identificatiegegevens en identificatiegegevens die vóór advertentiemeting worden gehasht."],
        ],
      },
      { kind: "h2", text: "3. Rechtsgrondslag (AVG)" },
      {
        kind: "p",
        spans: [
          "We verwerken gegevens op basis van (a) uitvoering van de overeenkomst: het leveren van de service waarvoor je je hebt aangemeld; (b) gerechtvaardigd belang: sitestatistieken en beveiliging; en (c) toestemming: waar vereist voor niet-essentiële cookies.",
        ],
      },
      { kind: "h2", text: "4. Bewaartermijn" },
      {
        kind: "p",
        spans: [
          "We bewaren accountgegevens zolang je lid blijft en tot 24 maanden na opzegging, waarna ze worden verwijderd of geanonimiseerd. Analyse- en advertentieaanbieders bewaren gebeurtenisgegevens of pseudonieme gegevens volgens hun eigen bewaarbeleid.",
        ],
      },
      { kind: "h2", text: "5. Jouw rechten" },
      {
        kind: "p",
        spans: [
          "Je kunt op elk moment verzoeken om inzage, correctie, export of verwijdering van je persoonsgegevens. Mail naar ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " en we reageren binnen 30 dagen.",
        ],
      },
      { kind: "h2", text: "6. Cookies" },
      {
        kind: "p",
        spans: [
          "We gebruiken first-party cookies voor essentiële functies (sessie, voorkeuren), analyses en advertentiemeettechnologieën van Meta en TikTok om campagneprestaties en conversies te meten. Deze aanbieders kunnen cookies van derden en vergelijkbare identificatiegegevens plaatsen of lezen.",
        ],
      },
      { kind: "h2", text: "7. Beveiliging" },
      {
        kind: "p",
        spans: [
          "Gegevens worden opgeslagen op servers van gerenommeerde EU/VS-aanbieders onder standaard beveiligingsmaatregelen (TLS tijdens verzending, versleuteling in rust waar van toepassing). Geen enkel systeem is volledig veilig, gebruik alsjeblieft een uniek wachtwoord.",
        ],
      },
      { kind: "h2", text: "8. Wijzigingen" },
      {
        kind: "p",
        spans: [
          "Belangrijke wijzigingen in dit beleid worden vóór de inwerkingtreding per e-mail of bannermelding gecommuniceerd.",
        ],
      },
    ],
  },
  responsible: {
    title: "Verantwoord spelen",
    desc: "Tools, limieten en hulplijnen om wedden leuk, veilig en onder controle te houden.",
    updated: "Mei 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Wedden hoort vermaak te zijn, nooit een manier om geld te verdienen dat je je niet kunt veroorloven te verliezen, nooit een ontsnapping aan stress, en nooit iets dat je verbergt voor mensen die je na staan. Sector1 verkoopt onderzoek en structuur, geen zekerheid. Als wedden niet langer leuk is, stop dan.",
        ],
      },
      { kind: "h2", text: "Stel eerst je limieten in" },
      {
        kind: "ul",
        items: [
          ["Bepaal een maandelijks budget voordat je ook maar één weddenschap plaatst. Behandel het als een hobbybudget."],
          ["Gebruik een vast-inzetplan (1–2% van het budget per selectie). Probeer verliezen nooit goed te maken door te verdubbelen."],
          ["Houd een aparte rekening of e-wallet aan voor wedgeld. Meng het niet met je spaargeld."],
          ["Neem regelmatig pauzes. Een weekend vrij herstelt je perspectief sneller dan welke weddenschap dan ook."],
        ],
      },
      { kind: "h2", text: "Waarschuwingssignalen" },
      {
        kind: "ul",
        items: [
          ["Meer wedden dan je je comfortabel kunt veroorloven te verliezen."],
          ["Geld lenen om te wedden, of spullen verkopen om weddenschappen te financieren."],
          ["Tegen familie of vrienden liegen over hoeveel je wedt."],
          ["Je rusteloos, prikkelbaar of somber voelen wanneer je probeert te minderen."],
          ["Wedden gebruiken om aan problemen te ontsnappen of gevoelens te verdoven."],
        ],
      },
      { kind: "h2", text: "Tools die je bookmaker biedt" },
      {
        kind: "p",
        spans: [
          "Elke gereguleerde operator in de EU is verplicht om stortingslimieten, verlieslimieten, sessieherinneringen, time-outs en zelfuitsluiting aan te bieden. Gebruik ze. Een limiet instellen kost 30 seconden en bespaart je jaren van spijt.",
        ],
      },
      { kind: "h2", text: "Gratis, vertrouwelijke hulp" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (VK & internationaal): ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", bijeenkomsten wereldwijd, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Zweden): 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Denemarken): ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "Als je moet stoppen" },
      {
        kind: "p",
        spans: [
          "Annuleer je Sector1-toegang in Telegram met één tik en sluit jezelf vervolgens uit bij je bookmaker(s). Als je wilt dat we je gegevens verwijderen, mail dan naar ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". We benaderen geen leden die zichzelf hebben uitgesloten.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Wed verantwoord · Wed nooit meer dan je je kunt veroorloven te verliezen.",
        ],
      },
    ],
  },
};

export default legal;
