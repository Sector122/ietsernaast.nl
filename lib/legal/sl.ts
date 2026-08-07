import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Pogoji uporabe",
    desc: "Pogoji, ki urejajo dostop do storitve Sector1 in njeno uporabo.",
    updated: "Maj 2026",
    blocks: [
      { kind: "h2", text: "1. Kdo smo" },
      {
        kind: "p",
        spans: [
          "Sector1 je skupnost za raziskovanje športnih stav, ki posluje pod tržnim imenom Sector1. Z dostopom do spletnega mesta, pridružitvijo našim kanalom Telegram ali začetkom preizkusnega obdobja se strinjate s temi pogoji.",
        ],
      },
      { kind: "h2", text: "2. Pogoji za sodelovanje" },
      {
        kind: "p",
        spans: [
          "Stari morate biti vsaj 18 let (21+, kjer to zahteva lokalna zakonodaja) in prebivati v jurisdikciji, kjer je stavljenje na športne dogodke zakonito. Sami ste odgovorni za preverjanje zakonitosti stavljenja v svoji državi.",
        ],
      },
      { kind: "h2", text: "3. Storitev" },
      {
        kind: "p",
        spans: [
          "Sector1 ponuja raziskave, analize in izbore na izbranih nogometnih trgih, ki se posredujejo prek zasebnih kanalov Telegram. Ne sprejemamo vplačil, ne upravljamo stavnice in ne hranimo sredstev strank. Vse stave oddate sami pri neodvisnih tretjih ponudnikih.",
        ],
      },
      { kind: "h2", text: "4. Članstvo in brezplačen dostop" },
      {
        kind: "p",
        spans: [
          "Pridružitev Sector1 in našim kanalom Telegram je brezplačna. Edini pogoj za članstvo je, da se registrirate pri naši priporočeni stavnici in tam oddajate stave prek naše partnerske povezave. Vedno lahko svobodno izberete, kje in koliko stavite, vendar je brezplačen dostop ponujen na podlagi uporabe naše priporočene stavnice.",
        ],
      },
      { kind: "h2", text: "5. Brez jamstev" },
      {
        kind: "p",
        spans: [
          "Športni izidi so po naravi negotovi. Pretekla uspešnost, ROI ali katera koli zgodovina, ki jo objavi Sector1, ne jamči prihodnjih rezultatov. Izbori so mnenja, ki temeljijo na raziskavah, in jih je treba obravnavati kot taka.",
        ],
      },
      /*
      { kind: "h2", text: "6. Preizkus in naročnina" },
      {
        kind: "p",
        spans: [
          "Novi člani prejmejo 30-dnevni brezplačni preizkus. Če nadaljujete po 30. dnevu, naročnina znaša 100 €/mesec. Kadar koli lahko prekličete v Telegramu, tako da se odstranite s kanalov, brez odpovednega roka.",
        ],
      },
      */
      { kind: "h2", text: "6. Sprejemljiva uporaba" },
      {
        kind: "p",
        spans: [
          "Strinjate se, da vsebine z naših zasebnih kanalov ne boste razširjali, zajemali zaslonskih slik za nadaljnjo prodajo ali javno delili. Dostop je oseben in neprenosljiv. Kršitve povzročijo takojšnjo prekinitev brez povračila.",
        ],
      },
      { kind: "h2", text: "7. Odgovornost" },
      {
        kind: "p",
        spans: [
          "V največjem obsegu, ki ga dopušča zakon, Sector1 ne odgovarja za kakršne koli izgube, neposredne ali posredne, ki izhajajo iz uporabe naše vsebine, vključno z izgubami pri stavah, a ne omejeno nanje. Stavite na lastno odgovornost.",
        ],
      },
      { kind: "h2", text: "8. Spremembe" },
      {
        kind: "p",
        spans: [
          "Te pogoje lahko občasno posodobimo. Nadaljnja uporaba storitve po posodobitvi pomeni sprejetje spremenjenih pogojev.",
        ],
      },
      { kind: "h2", text: "9. Stik" },
      {
        kind: "p",
        spans: [
          "Vprašanja o teh pogojih: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Politika zasebnosti",
    desc: "Kako Sector1 zbira, uporablja in varuje vaše osebne podatke.",
    updated: "Julij 2026",
    blocks: [
      { kind: "h2", text: "1. Povzetek" },
      {
        kind: "p",
        spans: [
          "Zbiramo najmanjšo količino podatkov, potrebnih za zagotavljanje storitve ter merjenje uspešnosti spletnega mesta in kampanj. Osebnih podatkov ne prodajamo. Omejene podatke o uporabi in zgoščene identifikatorje delimo s ponudniki analitike in oglaševanja, vključno z družbama Meta in TikTok, za merjenje in atribucijo.",
        ],
      },
      { kind: "h2", text: "2. Kaj zbiramo" },
      {
        kind: "ul",
        items: [
          ["Podatki za vključitev: ime in priimek, e-poštni naslov, neobvezna telefonska številka, država ter znesek in valuta pologa, ki ju navede uporabnik."],
          ["Podatki o uporabi in kampanjah: ogledane strani, čas na strani, vir napotitve, naslov IP, podatki o brskalniku ali napravi, identifikatorji klika ali piškotkov ter identifikatorji, zgoščeni pred merjenjem oglaševanja."],
        ],
      },
      { kind: "h2", text: "3. Pravna podlaga (GDPR)" },
      {
        kind: "p",
        spans: [
          "Podatke obdelujemo na podlagi (a) izvajanja pogodbe: zagotavljanja storitve, na katero ste se naročili; (b) zakonitega interesa: analitika in varnost spletnega mesta; in (c) privolitve: kjer je to potrebno za nenujne piškotke.",
        ],
      },
      { kind: "h2", text: "4. Hramba podatkov" },
      {
        kind: "p",
        spans: [
          "Podatke o računu hranimo, dokler ste član, in do 24 mesecev po preklicu, nato pa jih izbrišemo ali anonimiziramo. Ponudniki analitike in oglaševanja hranijo podatke o dogodkih ali psevdonimizirane podatke v skladu s svojimi pravili hrambe.",
        ],
      },
      { kind: "h2", text: "5. Vaše pravice" },
      {
        kind: "p",
        spans: [
          "Kadar koli lahko zahtevate dostop, popravek, izvoz ali izbris svojih osebnih podatkov. Pišite na ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          " in odgovorili bomo v 30 dneh.",
        ],
      },
      { kind: "h2", text: "6. Piškotki" },
      {
        kind: "p",
        spans: [
          "Uporabljamo lastne piškotke za nujne funkcije (seja, nastavitve), analitiko ter tehnologije za merjenje oglaševanja družb Meta in TikTok, da merimo uspešnost kampanj in konverzije. Ti ponudniki lahko nastavijo ali berejo piškotke tretjih oseb in podobne identifikatorje.",
        ],
      },
      { kind: "h2", text: "7. Varnost" },
      {
        kind: "p",
        spans: [
          "Podatki so shranjeni na strežnikih uglednih ponudnikov iz EU/ZDA pod standardnimi varnostnimi kontrolami (TLS med prenosom, šifriranje v mirovanju, kjer je primerno). Noben sistem ni popolnoma varen, uporabite edinstveno geslo.",
        ],
      },
      { kind: "h2", text: "8. Spremembe" },
      {
        kind: "p",
        spans: [
          "O bistvenih spremembah te politike vas bomo pred začetkom veljavnosti obvestili po e-pošti ali z obvestilom v pasici.",
        ],
      },
    ],
  },
  responsible: {
    title: "Odgovorno igranje",
    desc: "Orodja, omejitve in linije za pomoč, da stavljenje ostane zabavno, varno in pod nadzorom.",
    updated: "Maj 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Stavljenje naj bo zabava, nikoli način za zaslužek denarja, ki si ga ne morete privoščiti izgubiti, nikoli pobeg pred stresom in nikoli nekaj, kar skrivate pred bližnjimi. Sector1 prodaja raziskave in strukturo, ne gotovosti. Če stavljenje ni več zabavno, prenehajte.",
        ],
      },
      { kind: "h2", text: "Najprej določite svoje omejitve" },
      {
        kind: "ul",
        items: [
          ["Določite mesečni proračun, preden oddate eno samo stavo. Obravnavajte ga kot proračun za hobi."],
          ["Uporabite načrt fiksnega vložka (1–2 % proračuna na izbor). Izgub nikoli ne lovite s podvajanjem."],
          ["Za sredstva za stave imejte ločen račun ali e-denarnico. Ne mešajte jih s prihranki."],
          ["Redno si vzemite premor. Prost konec tedna hitreje povrne perspektivo kot katera koli nova stava."],
        ],
      },
      { kind: "h2", text: "Opozorilni znaki" },
      {
        kind: "ul",
        items: [
          ["Stavljenje več, kot si lahko udobno privoščite izgubiti."],
          ["Izposojanje denarja za stave ali prodaja stvari za financiranje stav."],
          ["Laganje družini ali prijateljem o tem, koliko stavite."],
          ["Občutek nemira, razdražljivosti ali potrtosti, ko poskušate zmanjšati."],
          ["Uporaba stav za pobeg pred težavami ali otopitev čustev."],
        ],
      },
      { kind: "h2", text: "Orodja, ki jih ponuja vaša stavnica" },
      {
        kind: "p",
        spans: [
          "Vsak reguliran operater v EU mora zagotoviti omejitve pologov, omejitve izgub, opomnike o seji, premore in samoizključitev. Uporabite jih. Nastavitev omejitve traja 30 sekund in vam prihrani leta obžalovanja.",
        ],
      },
      { kind: "h2", text: "Brezplačna, zaupna pomoč" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (Združeno kraljestvo in mednarodno): ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", srečanja po vsem svetu, ",
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
      { kind: "h2", text: "Če morate prenehati" },
      {
        kind: "p",
        spans: [
          "Prekličite svoj dostop do Sector1 v Telegramu z enim dotikom, nato pa se samoizključite pri svoji stavnici (ali stavnicah). Če želite, da izbrišemo vaše podatke, pišite na ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". Članov, ki so se samoizključili, ne kontaktiramo.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Stavite odgovorno · Nikoli ne stavite več, kot si lahko privoščite izgubiti.",
        ],
      },
    ],
  },
};

export default legal;
