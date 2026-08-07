import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Termeni și condiții",
    desc: "Termenii care guvernează accesul la și utilizarea serviciului Sector1.",
    updated: "Mai 2026",
    blocks: [
      { kind: "h2", text: "1. Cine suntem" },
      {
        kind: "p",
        spans: [
          "Sector1 este o comunitate de cercetare pentru pariuri sportive, operată sub denumirea comercială Sector1. Prin accesarea site-ului, alăturarea la canalele noastre de Telegram sau începerea unei perioade de probă, ești de acord cu acești termeni.",
        ],
      },
      { kind: "h2", text: "2. Eligibilitate" },
      {
        kind: "p",
        spans: [
          "Trebuie să ai cel puțin 18 ani (21+ acolo unde legislația locală o cere) și să fii rezident într-o jurisdicție în care pariurile pe evenimente sportive sunt legale. Ești responsabil pentru confirmarea legalității pariurilor în țara ta.",
        ],
      },
      { kind: "h2", text: "3. Serviciul" },
      {
        kind: "p",
        spans: [
          "Sector1 oferă cercetare, analiză și selecții pe piețe de fotbal alese, livrate prin canale private de Telegram. Nu acceptăm mize, nu operăm o casă de pariuri și nu deținem fondurile clienților. Toate pariurile sunt plasate de tine la operatori terți independenți.",
        ],
      },
      { kind: "h2", text: "4. Membru și acces gratuit" },
      {
        kind: "p",
        spans: [
          "Alăturarea la Sector1 și la canalele noastre de Telegram este gratuită. Singura condiție de a fi membru este să te înregistrezi și să îți plasezi pariurile la casa de pariuri recomandată de noi, prin linkul partenerului nostru. Rămâi mereu liber să alegi unde și cât pariezi, dar accesul gratuit este oferit pe baza utilizării casei de pariuri recomandate de noi.",
        ],
      },
      { kind: "h2", text: "5. Fără garanții" },
      {
        kind: "p",
        spans: [
          "Rezultatele sportive sunt incerte prin natura lor. Performanța trecută, ROI-ul sau orice istoric publicat de Sector1 nu garantează rezultate viitoare. Selecțiile sunt opinii bazate pe cercetare și trebuie tratate ca atare.",
        ],
      },
      /*
      { kind: "h2", text: "6. Perioadă de probă și abonament" },
      {
        kind: "p",
        spans: [
          "Membrii noi primesc o perioadă de probă gratuită de 30 de zile. Dacă continui după ziua 30, abonamentul este de 100 €/lună. Poți anula oricând în Telegram, eliminându-te din canale, fără preaviz.",
        ],
      },
      */
      { kind: "h2", text: "6. Utilizare acceptabilă" },
      {
        kind: "p",
        spans: [
          "Ești de acord să nu redistribui, să nu faci capturi pentru revânzare și să nu partajezi public conținutul din canalele noastre private. Accesul este personal și netransferabil. Încălcările duc la încetarea imediată, fără rambursare.",
        ],
      },
      { kind: "h2", text: "7. Răspundere" },
      {
        kind: "p",
        spans: [
          "În limita maximă permisă de lege, Sector1 nu răspunde pentru nicio pierdere, directă sau indirectă, rezultată din utilizarea conținutului nostru, inclusiv, dar fără a se limita la, pierderi din pariuri. Pariezi pe propriul risc.",
        ],
      },
      { kind: "h2", text: "8. Modificări" },
      {
        kind: "p",
        spans: [
          "Putem actualiza acești termeni din când în când. Utilizarea în continuare a serviciului după o actualizare constituie acceptarea termenilor revizuiți.",
        ],
      },
      { kind: "h2", text: "9. Contact" },
      {
        kind: "p",
        spans: [
          "Întrebări despre acești termeni: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Politica de confidențialitate",
    desc: "Cum colectează, utilizează și protejează Sector1 datele tale personale.",
    updated: "Iulie 2026",
    blocks: [
      { kind: "h2", text: "1. Rezumat" },
      {
        kind: "p",
        spans: [
          "Colectăm datele minime necesare pentru a furniza serviciul și a măsura performanța site-ului și a campaniilor. Nu vindem date personale. Partajăm date limitate de utilizare și identificatori criptați cu furnizori de analiză și publicitate, inclusiv Meta și TikTok, pentru măsurare și atribuire.",
        ],
      },
      { kind: "h2", text: "2. Ce colectăm" },
      {
        kind: "ul",
        items: [
          ["Date de onboarding: nume și prenume, adresă de email, număr de telefon opțional, țară, precum și suma și moneda depunerii declarate de utilizator."],
          ["Date de utilizare și campanie: pagini vizualizate, timp pe pagină, sursa de trafic, adresa IP, informații despre browser sau dispozitiv, identificatori de clic sau cookie și identificatori criptați înainte de măsurarea publicității."],
        ],
      },
      { kind: "h2", text: "3. Temei legal (GDPR)" },
      {
        kind: "p",
        spans: [
          "Prelucrăm datele pe baza (a) executării contractului: furnizarea serviciului pentru care te-ai înscris; (b) interesului legitim: analize și securitatea site-ului; și (c) consimțământului: acolo unde este necesar pentru cookie-uri neesențiale.",
        ],
      },
      { kind: "h2", text: "4. Păstrarea datelor" },
      {
        kind: "p",
        spans: [
          "Păstrăm datele de cont atât timp cât rămâi membru și până la 24 de luni după anulare, după care sunt șterse sau anonimizate. Furnizorii de analiză și publicitate păstrează date despre evenimente sau date pseudonimizate conform propriilor politici de păstrare.",
        ],
      },
      { kind: "h2", text: "5. Drepturile tale" },
      {
        kind: "p",
        spans: [
          "Poți solicita accesul, corectarea, exportul sau ștergerea datelor tale personale oricând. Scrie la ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " și vom răspunde în 30 de zile.",
        ],
      },
      { kind: "h2", text: "6. Cookie-uri" },
      {
        kind: "p",
        spans: [
          "Folosim cookie-uri proprii pentru funcții esențiale (sesiune, preferințe), analize și tehnologii de măsurare a publicității de la Meta și TikTok pentru a măsura performanța campaniilor și conversiile. Acești furnizori pot seta sau citi cookie-uri terțe și identificatori similari.",
        ],
      },
      { kind: "h2", text: "7. Securitate" },
      {
        kind: "p",
        spans: [
          "Datele sunt stocate pe servere operate de furnizori reputați din UE/SUA, cu controale de securitate standard (TLS în tranzit, criptare în repaus acolo unde este cazul). Niciun sistem nu este perfect sigur, așa că te rugăm să folosești o parolă unică.",
        ],
      },
      { kind: "h2", text: "8. Modificări" },
      {
        kind: "p",
        spans: [
          "Modificările importante ale acestei politici vor fi comunicate prin email sau printr-o notificare pe site înainte de a intra în vigoare.",
        ],
      },
    ],
  },
  responsible: {
    title: "Joc responsabil",
    desc: "Instrumente, limite și linii de ajutor pentru ca pariurile să rămână distractive, sigure și sub control.",
    updated: "Mai 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Pariurile ar trebui să fie o formă de divertisment, niciodată o modalitate de a face bani pe care nu îți permiți să îi pierzi, niciodată o evadare din stres și niciodată ceva ce ascunzi de cei apropiați. Sector1 vinde cercetare și structură, nu certitudine. Dacă pariurile nu mai sunt distractive, oprește-te.",
        ],
      },
      { kind: "h2", text: "Stabilește-ți mai întâi limitele" },
      {
        kind: "ul",
        items: [
          ["Decide un buget lunar înainte de a plasa un singur pariu. Tratează-l ca pe un buget de hobby."],
          ["Folosește un plan cu miză fixă (1–2% din buget per pont). Nu recupera niciodată pierderile dublând miza."],
          ["Ține un cont sau un portofel electronic separat pentru fondurile de pariere. Nu le amesteca cu economiile."],
          ["Ia pauze regulate. Un weekend liber îți resetează perspectiva mai repede decât o va face vreodată un alt pariu."],
        ],
      },
      { kind: "h2", text: "Semne de avertizare" },
      {
        kind: "ul",
        items: [
          ["Pariezi mai mult decât îți permiți confortabil să pierzi."],
          ["Împrumuți bani pentru a paria sau vinzi lucruri pentru a finanța pariuri."],
          ["Minți familia sau prietenii despre cât pariezi."],
          ["Te simți neliniștit, iritabil sau abătut când încerci să reduci."],
          ["Folosești pariurile ca să evadezi din probleme sau să amorțești emoțiile."],
        ],
      },
      { kind: "h2", text: "Instrumente oferite de casa ta de pariuri" },
      {
        kind: "p",
        spans: [
          "Fiecare operator reglementat din UE este obligat să ofere limite de depunere, limite de pierdere, memento-uri de sesiune, pauze și autoexcludere. Folosește-le. Setarea unei limite durează 30 de secunde și îți poate scuti ani de regrete.",
        ],
      },
      { kind: "h2", text: "Ajutor gratuit și confidențial" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (Regatul Unit și internațional): ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", întâlniri în întreaga lume, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Suedia): 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Danemarca): ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "Dacă trebuie să te oprești" },
      {
        kind: "p",
        spans: [
          "Anulează-ți accesul Sector1 în Telegram cu o singură apăsare, apoi autoexclude-te de la casa sau casele tale de pariuri. Dacă vrei să îți ștergem datele, scrie la ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". Nu contactăm membrii care s-au autoexclus.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Pariază responsabil · Nu paria niciodată mai mult decât îți permiți să pierzi.",
        ],
      },
    ],
  },
};

export default legal;
