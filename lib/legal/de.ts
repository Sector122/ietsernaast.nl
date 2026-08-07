import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Nutzungsbedingungen",
    desc: "Bedingungen für den Zugang zu und die Nutzung des Sector1-Dienstes.",
    updated: "Mai 2026",
    blocks: [
      { kind: "h2", text: "1. Wer wir sind" },
      {
        kind: "p",
        spans: [
          "Sector1 ist eine Sportwetten-Research-Community, die unter dem Handelsnamen Sector1 betrieben wird. Mit dem Zugriff auf die Website, dem Beitritt zu unseren Telegram-Kanälen oder dem Start einer Testphase stimmst du diesen Bedingungen zu.",
        ],
      },
      { kind: "h2", text: "2. Voraussetzungen" },
      {
        kind: "p",
        spans: [
          "Du musst mindestens 18 Jahre alt sein (21+, sofern nach lokalem Recht erforderlich) und in einem Land ansässig sein, in dem Wetten auf Sportereignisse legal sind. Du bist dafür verantwortlich, die Legalität von Wetten in deinem Land zu prüfen.",
        ],
      },
      { kind: "h2", text: "3. Der Dienst" },
      {
        kind: "p",
        spans: [
          "Sector1 bietet Research, Analysen und Tipps für ausgewählte Fußballmärkte, die über private Telegram-Kanäle bereitgestellt werden. Wir nehmen keine Einsätze an, betreiben keinen Buchmacher und verwahren keine Kundengelder. Alle Wetten werden von dir bei unabhängigen Drittanbietern platziert.",
        ],
      },
      { kind: "h2", text: "4. Mitgliedschaft und kostenloser Zugang" },
      {
        kind: "p",
        spans: [
          "Der Beitritt zu Sector1 und unseren Telegram-Kanälen ist kostenlos. Die einzige Bedingung für die Mitgliedschaft ist, dass du dich bei unserem empfohlenen Buchmacher über unseren Partnerlink anmeldest und dort deine Wetten platzierst. Es bleibt dir jederzeit frei, wo und wie viel du wettest, aber der kostenlose Zugang wird auf der Grundlage der Nutzung unseres empfohlenen Buchmachers angeboten.",
        ],
      },
      { kind: "h2", text: "5. Keine Garantien" },
      {
        kind: "p",
        spans: [
          "Sportergebnisse sind naturgemäß ungewiss. Vergangene Leistungen, ROI oder jegliche von Sector1 veröffentlichte Erfolgsbilanz garantieren keine zukünftigen Ergebnisse. Tipps sind auf Research basierende Meinungen und sollten als solche behandelt werden.",
        ],
      },
      /*
      { kind: "h2", text: "6. Testphase & Abonnement" },
      {
        kind: "p",
        spans: [
          "Neue Mitglieder erhalten eine 30-tägige kostenlose Testphase. Wenn du über Tag 30 hinaus fortfährst, beträgt das Abonnement 100 €/Monat. Du kannst jederzeit in Telegram kündigen, indem du dich aus den Kanälen entfernst, ohne Kündigungsfrist.",
        ],
      },
      */
      { kind: "h2", text: "6. Zulässige Nutzung" },
      {
        kind: "p",
        spans: [
          "Du verpflichtest dich, Inhalte aus unseren privaten Kanälen nicht weiterzugeben, zum Wiederverkauf zu screenshotten oder öffentlich zu teilen. Der Zugang ist persönlich und nicht übertragbar. Verstöße führen zur sofortigen Kündigung ohne Rückerstattung.",
        ],
      },
      { kind: "h2", text: "7. Haftung" },
      {
        kind: "p",
        spans: [
          "Soweit gesetzlich zulässig, haftet Sector1 nicht für direkte oder indirekte Verluste, die aus der Nutzung unserer Inhalte entstehen, einschließlich, aber nicht beschränkt auf Wettverluste. Du wettest auf eigenes Risiko.",
        ],
      },
      { kind: "h2", text: "8. Änderungen" },
      {
        kind: "p",
        spans: [
          "Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Die fortgesetzte Nutzung des Dienstes nach einer Aktualisierung gilt als Annahme der überarbeiteten Bedingungen.",
        ],
      },
      { kind: "h2", text: "9. Kontakt" },
      {
        kind: "p",
        spans: [
          "Fragen zu diesen Bedingungen: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Datenschutzerklärung",
    desc: "Wie Sector1 deine personenbezogenen Daten erhebt, verwendet und schützt.",
    updated: "Juli 2026",
    blocks: [
      { kind: "h2", text: "1. Zusammenfassung" },
      {
        kind: "p",
        spans: [
          "Wir erheben nur die Daten, die zur Bereitstellung des Dienstes und zur Messung der Website- und Kampagnenleistung erforderlich sind. Wir verkaufen keine personenbezogenen Daten. Begrenzte Nutzungsdaten und gehashte Kennungen teilen wir zur Messung und Zuordnung mit Analyse- und Werbeanbietern, darunter Meta und TikTok.",
        ],
      },
      { kind: "h2", text: "2. Was wir erheben" },
      {
        kind: "ul",
        items: [
          ["Onboarding-Daten: Vor- und Nachname, E-Mail-Adresse, optionale Telefonnummer, Land sowie selbst angegebener Einzahlungsbetrag und Währung."],
          ["Nutzungs- und Kampagnendaten: aufgerufene Seiten, Verweildauer, Referrer, IP-Adresse, Browser- oder Geräteinformationen, Klick- oder Cookie-Kennungen sowie vor der Werbemessung gehashte Kennungen."],
        ],
      },
      { kind: "h2", text: "3. Rechtsgrundlage (DSGVO)" },
      {
        kind: "p",
        spans: [
          "Wir verarbeiten Daten auf Grundlage von (a) Vertragserfüllung: Bereitstellung des von dir abonnierten Dienstes; (b) berechtigtem Interesse: Website-Analyse und Sicherheit; und (c) Einwilligung: sofern für nicht wesentliche Cookies erforderlich.",
        ],
      },
      { kind: "h2", text: "4. Speicherdauer" },
      {
        kind: "p",
        spans: [
          "Wir bewahren Kontodaten so lange auf, wie du Mitglied bist, und bis zu 24 Monate nach der Kündigung; danach werden sie gelöscht oder anonymisiert. Analyse- und Werbeanbieter speichern Ereignisdaten oder pseudonyme Daten gemäß ihren eigenen Aufbewahrungsrichtlinien.",
        ],
      },
      { kind: "h2", text: "5. Deine Rechte" },
      {
        kind: "p",
        spans: [
          "Du kannst jederzeit Auskunft, Berichtigung, Export oder Löschung deiner personenbezogenen Daten verlangen. Schreibe an ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " und wir antworten innerhalb von 30 Tagen.",
        ],
      },
      { kind: "h2", text: "6. Cookies" },
      {
        kind: "p",
        spans: [
          "Wir verwenden First-Party-Cookies für wesentliche Funktionen (Sitzung, Einstellungen), Analysen sowie Werbemessungstechnologien von Meta und TikTok, um Kampagnenleistung und Conversions zu messen. Diese Anbieter können Drittanbieter-Cookies und ähnliche Kennungen setzen oder lesen.",
        ],
      },
      { kind: "h2", text: "7. Sicherheit" },
      {
        kind: "p",
        spans: [
          "Daten werden auf Servern seriöser EU/US-Anbieter unter üblichen Sicherheitsmaßnahmen gespeichert (TLS bei der Übertragung, Verschlüsselung im Ruhezustand, sofern zutreffend). Kein System ist vollkommen sicher, bitte verwende ein einzigartiges Passwort.",
        ],
      },
      { kind: "h2", text: "8. Änderungen" },
      {
        kind: "p",
        spans: [
          "Wesentliche Änderungen dieser Richtlinie werden vor ihrem Inkrafttreten per E-Mail oder Banner-Hinweis mitgeteilt.",
        ],
      },
    ],
  },
  responsible: {
    title: "Verantwortungsvolles Spielen",
    desc: "Tools, Limits und Hilfetelefone, damit Wetten unterhaltsam, sicher und unter Kontrolle bleibt.",
    updated: "Mai 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Wetten sollte Unterhaltung sein, niemals ein Weg, um Geld zu verdienen, dessen Verlust du dir nicht leisten kannst, niemals eine Flucht vor Stress und niemals etwas, das du vor nahestehenden Menschen verbirgst. Sector1 verkauft Research und Struktur, keine Gewissheit. Wenn Wetten keinen Spaß mehr macht, hör auf.",
        ],
      },
      { kind: "h2", text: "Setze zuerst deine Limits" },
      {
        kind: "ul",
        items: [
          ["Lege ein monatliches Budget fest, bevor du eine einzige Wette platzierst. Behandle es wie ein Hobby-Budget."],
          ["Verwende einen festen Einsatzplan (1–2 % des Budgets pro Tipp). Versuche nie, Verluste durch Verdoppeln aufzuholen."],
          ["Führe ein separates Konto oder E-Wallet für Wettgelder. Vermische es nicht mit Ersparnissen."],
          ["Mache regelmäßig Pausen. Ein freies Wochenende stellt die Perspektive schneller wieder her als jede weitere Wette."],
        ],
      },
      { kind: "h2", text: "Warnsignale" },
      {
        kind: "ul",
        items: [
          ["Mehr wetten, als du dir bequem leisten kannst zu verlieren."],
          ["Geld leihen, um zu wetten, oder Dinge verkaufen, um Wetten zu finanzieren."],
          ["Familie oder Freunde anlügen, wie viel du wettest."],
          ["Unruhig, gereizt oder niedergeschlagen sein, wenn du versuchst, weniger zu wetten."],
          ["Wetten nutzen, um Problemen zu entfliehen oder Gefühle zu betäuben."],
        ],
      },
      { kind: "h2", text: "Tools, die dein Buchmacher bietet" },
      {
        kind: "p",
        spans: [
          "Jeder regulierte Anbieter in der EU ist verpflichtet, Einzahlungslimits, Verlustlimits, Sitzungserinnerungen, Auszeiten und Selbstausschluss anzubieten. Nutze sie. Ein Limit zu setzen dauert 30 Sekunden und erspart dir jahrelange Reue.",
        ],
      },
      { kind: "h2", text: "Kostenlose, vertrauliche Hilfe" },
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
            ", Treffen weltweit, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Schweden): 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Dänemark): ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "Wenn du aufhören musst" },
      {
        kind: "p",
        spans: [
          "Kündige deinen Sector1-Zugang in Telegram mit einem Tippen und schließe dich anschließend bei deinem/deinen Buchmacher(n) selbst aus. Wenn wir deine Daten löschen sollen, schreibe an ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". Wir kontaktieren keine Mitglieder, die sich selbst ausgeschlossen haben.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Wette verantwortungsvoll · Wette nie mehr, als du dir leisten kannst zu verlieren.",
        ],
      },
    ],
  },
};

export default legal;
