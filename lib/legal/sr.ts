import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Uslovi korišćenja",
    desc: "Uslovi koji regulišu pristup i korišćenje Sector1 usluge.",
    updated: "Maj 2026.",
    blocks: [
      { kind: "h2", text: "1. Ko smo mi" },
      {
        kind: "p",
        spans: [
          "Sector1 je zajednica za istraživanje sportskog klađenja koja posluje pod trgovačkim imenom Sector1. Pristupanjem sajtu, pridruživanjem našim Telegram kanalima ili započinjanjem probnog perioda prihvatate ove uslove.",
        ],
      },
      { kind: "h2", text: "2. Podobnost" },
      {
        kind: "p",
        spans: [
          "Morate imati 18 godina ili više (21+ gde to zahteva lokalni zakon) i biti rezident u jurisdikciji u kojoj je klađenje na sportske događaje legalno. Vi ste odgovorni za proveru legalnosti klađenja u vašoj zemlji.",
        ],
      },
      { kind: "h2", text: "3. Usluga" },
      {
        kind: "p",
        spans: [
          "Sector1 pruža istraživanje, analize i predloge na odabranim fudbalskim tržištima, isporučene putem privatnih Telegram kanala. Ne primamo uloge, ne upravljamo kladionicom niti držimo sredstva korisnika. Sve oklade postavljate vi kod nezavisnih operatera trećih strana.",
        ],
      },
      { kind: "h2", text: "4. Članstvo i besplatan pristup" },
      {
        kind: "p",
        spans: [
          "Pridruživanje Sector1 i našim Telegram kanalima je besplatno. Jedini uslov članstva je da se registrujete i postavljate svoje oklade kod naše preporučene kladionice putem našeg partnerskog linka. Uvek ostajete slobodni da izaberete gde i koliko se kladite, ali besplatan pristup se nudi na osnovu korišćenja naše preporučene kladionice.",
        ],
      },
      { kind: "h2", text: "5. Bez garancija" },
      {
        kind: "p",
        spans: [
          "Sportski ishodi su po svojoj prirodi neizvesni. Prethodni učinak, ROI ili bilo koja istorija koju objavi Sector1 ne garantuje buduće rezultate. Predlozi su mišljenja zasnovana na istraživanju i treba ih tako tretirati.",
        ],
      },
      /*
      { kind: "h2", text: "6. Proba i pretplata" },
      {
        kind: "p",
        spans: [
          "Novi članovi dobijaju 30 dana besplatne probe. Ako nastavite nakon 30. dana, pretplata iznosi 100 €/mesec. Možete otkazati u bilo kom trenutku u Telegramu uklanjanjem sebe sa kanala, bez otkaznog roka.",
        ],
      },
      */
      { kind: "h2", text: "6. Prihvatljivo korišćenje" },
      {
        kind: "p",
        spans: [
          "Saglasni ste da nećete redistribuirati, praviti snimke ekrana radi preprodaje niti javno deliti sadržaj sa naših privatnih kanala. Pristup je ličan i neprenosiv. Kršenja dovode do trenutnog prekida bez povraćaja novca.",
        ],
      },
      { kind: "h2", text: "7. Odgovornost" },
      {
        kind: "p",
        spans: [
          "U najvećoj meri dozvoljenoj zakonom, Sector1 nije odgovoran za bilo kakve gubitke, direktne ili indirektne, koji proističu iz korišćenja našeg sadržaja, uključujući ali ne ograničavajući se na gubitke od klađenja. Kladite se na sopstveni rizik.",
        ],
      },
      { kind: "h2", text: "8. Izmene" },
      {
        kind: "p",
        spans: [
          "Možemo s vremena na vreme ažurirati ove uslove. Nastavak korišćenja usluge nakon ažuriranja predstavlja prihvatanje izmenjenih uslova.",
        ],
      },
      { kind: "h2", text: "9. Kontakt" },
      {
        kind: "p",
        spans: [
          "Pitanja o ovim uslovima: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Politika privatnosti",
    desc: "Kako Sector1 prikuplja, koristi i štiti vaše lične podatke.",
    updated: "Jul 2026.",
    blocks: [
      { kind: "h2", text: "1. Sažetak" },
      {
        kind: "p",
        spans: [
          "Prikupljamo minimum podataka potrebnih za pružanje usluge i merenje učinka sajta i kampanja. Ne prodajemo lične podatke. Ograničene podatke o korišćenju i heširane identifikatore delimo sa pružaocima analitike i oglašavanja, uključujući Metu i TikTok, radi merenja i atribucije.",
        ],
      },
      { kind: "h2", text: "2. Šta prikupljamo" },
      {
        kind: "ul",
        items: [
          ["Podaci za uključivanje: ime i prezime, imejl adresa, opcioni broj telefona, država i iznos i valuta depozita koje korisnik sam navede."],
          ["Podaci o korišćenju i kampanjama: pregledane stranice, vreme na stranici, izvor poseta, IP adresa, podaci o pregledaču ili uređaju, identifikatori klika ili kolačića i identifikatori heširani pre merenja oglasa."],
        ],
      },
      { kind: "h2", text: "3. Pravni osnov (GDPR)" },
      {
        kind: "p",
        spans: [
          "Podatke obrađujemo na osnovu (a) izvršenja ugovora: pružanja usluge za koju ste se prijavili; (b) legitimnog interesa: analitika i bezbednost sajta; i (c) saglasnosti: gde je potrebna za kolačiće koji nisu neophodni.",
        ],
      },
      { kind: "h2", text: "4. Čuvanje podataka" },
      {
        kind: "p",
        spans: [
          "Podatke o nalogu čuvamo dok ste član i do 24 meseca nakon otkazivanja, nakon čega se brišu ili anonimizuju. Pružaoci analitike i oglašavanja čuvaju podatke o događajima ili pseudonimizovane podatke prema svojim pravilima čuvanja.",
        ],
      },
      { kind: "h2", text: "5. Vaša prava" },
      {
        kind: "p",
        spans: [
          "U bilo kom trenutku možete zatražiti pristup, ispravku, izvoz ili brisanje vaših ličnih podataka. Pišite na ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " i odgovorićemo u roku od 30 dana.",
        ],
      },
      { kind: "h2", text: "6. Kolačići" },
      {
        kind: "p",
        spans: [
          "Koristimo kolačiće prve strane za osnovne funkcije (sesija, podešavanja), analitiku i tehnologije za merenje oglašavanja kompanija Meta i TikTok radi merenja učinka kampanja i konverzija. Ovi pružaoci mogu postavljati ili čitati kolačiće trećih strana i slične identifikatore.",
        ],
      },
      { kind: "h2", text: "7. Bezbednost" },
      {
        kind: "p",
        spans: [
          "Podaci se čuvaju na serverima koje vode ugledni provajderi iz EU/SAD uz standardne bezbednosne kontrole (TLS pri prenosu, enkripcija u mirovanju gde je primenljivo). Nijedan sistem nije savršeno bezbedan, koristite jedinstvenu lozinku.",
        ],
      },
      { kind: "h2", text: "8. Izmene" },
      {
        kind: "p",
        spans: [
          "Bitne izmene ove politike biće saopštene putem imejla ili banera pre nego što stupe na snagu.",
        ],
      },
    ],
  },
  responsible: {
    title: "Odgovorno klađenje",
    desc: "Alati, granice i linije za pomoć koji klađenje drže zabavnim, bezbednim i pod kontrolom.",
    updated: "Maj 2026.",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Klađenje treba da bude zabava, nikada način da zaradite novac koji ne možete priuštiti da izgubite, nikada beg od stresa i nikada nešto što krijete od bliskih ljudi. Sector1 prodaje istraživanje i strukturu, ne sigurnost. Ako klađenje prestane da bude zabavno, prestanite.",
        ],
      },
      { kind: "h2", text: "Prvo postavite svoje granice" },
      {
        kind: "ul",
        items: [
          ["Odredite mesečni budžet pre nego što postavite ijednu opkladu. Tretirajte ga kao budžet za hobi."],
          ["Koristite plan fiksnog uloga (1–2% budžeta po predlogu). Nikada ne jurite gubitke duplim ulozima."],
          ["Držite poseban nalog ili e-novčanik za sredstva za klađenje. Ne mešajte ih sa štednjom."],
          ["Pravite redovne pauze. Slobodan vikend brže vraća perspektivu nego ijedna nova opklada."],
        ],
      },
      { kind: "h2", text: "Znakovi upozorenja" },
      {
        kind: "ul",
        items: [
          ["Klađenje na više nego što možete udobno priuštiti da izgubite."],
          ["Pozajmljivanje novca za klađenje ili prodaja stvari radi finansiranja oklada."],
          ["Laganje porodici ili prijateljima o tome koliko se kladite."],
          ["Osećaj nemira, razdražljivosti ili potištenosti kada pokušate da smanjite."],
          ["Korišćenje klađenja za beg od problema ili otupljivanje osećanja."],
        ],
      },
      { kind: "h2", text: "Alati koje nudi vaša kladionica" },
      {
        kind: "p",
        spans: [
          "Svaki regulisani operater u EU dužan je da obezbedi limite depozita, limite gubitaka, podsetnike o sesiji, pauze i samoisključenje. Koristite ih. Postavljanje limita traje 30 sekundi i štedi godine kajanja.",
        ],
      },
      { kind: "h2", text: "Besplatna, poverljiva pomoć" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (UK i međunarodno): ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", sastanci širom sveta, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Švedska): 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Danska): ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "Ako morate da prestanete" },
      {
        kind: "p",
        spans: [
          "Otkažite svoj Sector1 pristup u Telegramu jednim dodirom, a zatim se samoisključite kod svoje kladionice (ili kladionica). Ako želite da izbrišemo vaše podatke, pišite na ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". Ne kontaktiramo članove koji su se samoisključili.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Kladite se odgovorno · Nikada ne ulažite više nego što možete da priuštite da izgubite.",
        ],
      },
    ],
  },
};

export default legal;
