import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Uvjeti korištenja",
    desc: "Uvjeti koji uređuju pristup i korištenje usluge Sector1.",
    updated: "Svibanj 2026.",
    blocks: [
      { kind: "h2", text: "1. Tko smo mi" },
      {
        kind: "p",
        spans: [
          "Sector1 je zajednica za istraživanje sportskog klađenja koja posluje pod trgovačkim imenom Sector1. Pristupanjem web-stranici, pridruživanjem našim Telegram kanalima ili započinjanjem probnog razdoblja prihvaćate ove uvjete.",
        ],
      },
      { kind: "h2", text: "2. Prihvatljivost" },
      {
        kind: "p",
        spans: [
          "Morate imati 18 godina ili više (21+ gdje to zahtijeva lokalni zakon) i biti rezident u jurisdikciji u kojoj je klađenje na sportske događaje zakonito. Vi ste odgovorni za provjeru zakonitosti klađenja u svojoj zemlji.",
        ],
      },
      { kind: "h2", text: "3. Usluga" },
      {
        kind: "p",
        spans: [
          "Sector1 pruža istraživanje, analize i prijedloge na odabranim nogometnim tržištima, isporučene putem privatnih Telegram kanala. Ne primamo uloge, ne upravljamo kladionicom niti držimo sredstva korisnika. Sve oklade postavljate vi kod neovisnih operatera trećih strana.",
        ],
      },
      { kind: "h2", text: "4. Članstvo i besplatan pristup" },
      {
        kind: "p",
        spans: [
          "Pridruživanje Sector1 i našim Telegram kanalima je besplatno. Jedini uvjet članstva je da se registrirate i postavljate svoje oklade kod naše preporučene kladionice putem naše partnerske poveznice. Uvijek ostajete slobodni odabrati gdje i koliko se kladite, ali besplatan pristup nudi se na temelju korištenja naše preporučene kladionice.",
        ],
      },
      { kind: "h2", text: "5. Bez jamstava" },
      {
        kind: "p",
        spans: [
          "Sportski ishodi su po svojoj prirodi neizvjesni. Prethodni učinak, ROI ili bilo koja povijest koju objavi Sector1 ne jamči buduće rezultate. Prijedlozi su mišljenja temeljena na istraživanju i treba ih tako tretirati.",
        ],
      },
      /*
      { kind: "h2", text: "6. Proba i pretplata" },
      {
        kind: "p",
        spans: [
          "Novi članovi dobivaju 30 dana besplatne probe. Ako nastavite nakon 30. dana, pretplata iznosi 100 €/mjesec. Možete otkazati u bilo kojem trenutku u Telegramu uklanjanjem sebe s kanala, bez otkaznog roka.",
        ],
      },
      */
      { kind: "h2", text: "6. Prihvatljivo korištenje" },
      {
        kind: "p",
        spans: [
          "Suglasni ste da nećete redistribuirati, raditi snimke zaslona radi preprodaje niti javno dijeliti sadržaj s naših privatnih kanala. Pristup je osoban i neprenosiv. Kršenja dovode do trenutnog prekida bez povrata novca.",
        ],
      },
      { kind: "h2", text: "7. Odgovornost" },
      {
        kind: "p",
        spans: [
          "U najvećoj mjeri dopuštenoj zakonom, Sector1 nije odgovoran za bilo kakve gubitke, izravne ili neizravne, koji proizlaze iz korištenja našeg sadržaja, uključujući ali ne ograničavajući se na gubitke od klađenja. Kladite se na vlastiti rizik.",
        ],
      },
      { kind: "h2", text: "8. Izmjene" },
      {
        kind: "p",
        spans: [
          "Možemo s vremena na vrijeme ažurirati ove uvjete. Nastavak korištenja usluge nakon ažuriranja predstavlja prihvaćanje izmijenjenih uvjeta.",
        ],
      },
      { kind: "h2", text: "9. Kontakt" },
      {
        kind: "p",
        spans: [
          "Pitanja o ovim uvjetima: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Pravila privatnosti",
    desc: "Kako Sector1 prikuplja, koristi i štiti vaše osobne podatke.",
    updated: "Srpanj 2026.",
    blocks: [
      { kind: "h2", text: "1. Sažetak" },
      {
        kind: "p",
        spans: [
          "Prikupljamo minimum podataka potrebnih za pružanje usluge i mjerenje uspješnosti stranice i kampanja. Ne prodajemo osobne podatke. Ograničene podatke o korištenju i sažete identifikatore dijelimo s pružateljima analitike i oglašavanja, uključujući Metu i TikTok, radi mjerenja i atribucije.",
        ],
      },
      { kind: "h2", text: "2. Što prikupljamo" },
      {
        kind: "ul",
        items: [
          ["Podaci za uključivanje: ime i prezime, e-mail adresa, neobavezni broj telefona, država te iznos i valuta pologa koje je korisnik naveo."],
          ["Podaci o korištenju i kampanjama: pregledane stranice, vrijeme na stranici, izvor posjeta, IP adresa, podaci o pregledniku ili uređaju, identifikatori klika ili kolačića te identifikatori sažeti prije mjerenja oglasa."],
        ],
      },
      { kind: "h2", text: "3. Pravna osnova (GDPR)" },
      {
        kind: "p",
        spans: [
          "Podatke obrađujemo na temelju (a) izvršenja ugovora: pružanja usluge za koju ste se prijavili; (b) legitimnog interesa: analitika i sigurnost stranice; i (c) privole: gdje je potrebna za kolačiće koji nisu nužni.",
        ],
      },
      { kind: "h2", text: "4. Čuvanje podataka" },
      {
        kind: "p",
        spans: [
          "Podatke o računu čuvamo dok ste član i do 24 mjeseca nakon otkazivanja, nakon čega se brišu ili anonimiziraju. Pružatelji analitike i oglašavanja čuvaju podatke o događajima ili pseudonimizirane podatke prema vlastitim pravilima čuvanja.",
        ],
      },
      { kind: "h2", text: "5. Vaša prava" },
      {
        kind: "p",
        spans: [
          "U bilo kojem trenutku možete zatražiti pristup, ispravak, izvoz ili brisanje svojih osobnih podataka. Pišite na ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " i odgovorit ćemo u roku od 30 dana.",
        ],
      },
      { kind: "h2", text: "6. Kolačići" },
      {
        kind: "p",
        spans: [
          "Koristimo kolačiće prve strane za nužne funkcije (sesija, postavke), analitiku te tehnologije za mjerenje oglašavanja tvrtki Meta i TikTok radi mjerenja uspješnosti kampanja i konverzija. Ti pružatelji mogu postavljati ili čitati kolačiće trećih strana i slične identifikatore.",
        ],
      },
      { kind: "h2", text: "7. Sigurnost" },
      {
        kind: "p",
        spans: [
          "Podaci se pohranjuju na poslužiteljima koje vode ugledni pružatelji iz EU-a/SAD-a uz standardne sigurnosne kontrole (TLS pri prijenosu, enkripcija u mirovanju gdje je primjenjivo). Nijedan sustav nije savršeno siguran, koristite jedinstvenu lozinku.",
        ],
      },
      { kind: "h2", text: "8. Izmjene" },
      {
        kind: "p",
        spans: [
          "Bitne izmjene ovih pravila bit će priopćene putem e-pošte ili banera prije nego što stupe na snagu.",
        ],
      },
    ],
  },
  responsible: {
    title: "Odgovorno klađenje",
    desc: "Alati, ograničenja i linije za pomoć koji klađenje drže zabavnim, sigurnim i pod kontrolom.",
    updated: "Svibanj 2026.",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Klađenje treba biti zabava, nikada način da zaradite novac koji si ne možete priuštiti izgubiti, nikada bijeg od stresa i nikada nešto što skrivate od bliskih ljudi. Sector1 prodaje istraživanje i strukturu, ne sigurnost. Ako klađenje prestane biti zabavno, prestanite.",
        ],
      },
      { kind: "h2", text: "Prvo postavite svoja ograničenja" },
      {
        kind: "ul",
        items: [
          ["Odredite mjesečni budžet prije nego što postavite ijednu okladu. Tretirajte ga kao budžet za hobi."],
          ["Koristite plan fiksnog uloga (1–2% budžeta po prijedlogu). Nikada ne jurite gubitke udvostručavanjem."],
          ["Držite zaseban račun ili e-novčanik za sredstva za klađenje. Ne miješajte ih sa štednjom."],
          ["Radite redovite pauze. Slobodan vikend brže vraća perspektivu nego ijedna nova oklada."],
        ],
      },
      { kind: "h2", text: "Znakovi upozorenja" },
      {
        kind: "ul",
        items: [
          ["Klađenje na više nego što si možete ugodno priuštiti izgubiti."],
          ["Posuđivanje novca za klađenje ili prodaja stvari radi financiranja oklada."],
          ["Laganje obitelji ili prijateljima o tome koliko se kladite."],
          ["Osjećaj nemira, razdražljivosti ili potištenosti kada pokušate smanjiti."],
          ["Korištenje klađenja za bijeg od problema ili otupljivanje osjećaja."],
        ],
      },
      { kind: "h2", text: "Alati koje nudi vaša kladionica" },
      {
        kind: "p",
        spans: [
          "Svaki regulirani operater u EU-u dužan je osigurati limite depozita, limite gubitaka, podsjetnike o sesiji, pauze i samoisključenje. Koristite ih. Postavljanje limita traje 30 sekundi i štedi godine kajanja.",
        ],
      },
      { kind: "h2", text: "Besplatna, povjerljiva pomoć" },
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
            ", sastanci diljem svijeta, ",
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
      { kind: "h2", text: "Ako morate prestati" },
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
          "18+ · Kladite se odgovorno · Nikada ne ulažite više nego što si možete priuštiti izgubiti.",
        ],
      },
    ],
  },
};

export default legal;
