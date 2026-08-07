import type { LegalDocs } from "./types";

const legal: LegalDocs = {
  terms: {
    title: "Käyttöehdot",
    desc: "Ehdot, jotka koskevat Sector1-palvelun käyttöä ja siihen pääsyä.",
    updated: "Toukokuu 2026",
    blocks: [
      { kind: "h2", text: "1. Keitä olemme" },
      {
        kind: "p",
        spans: [
          "Sector1 on urheiluvedonlyönnin tutkimusyhteisö, joka toimii toiminimellä Sector1. Käyttämällä verkkosivustoa, liittymällä Telegram-kanaviimme tai aloittamalla kokeilujakson hyväksyt nämä ehdot.",
        ],
      },
      { kind: "h2", text: "2. Kelpoisuus" },
      {
        kind: "p",
        spans: [
          "Sinun on oltava vähintään 18-vuotias (21+ silloin, kun paikallinen laki sitä edellyttää) ja asuttava lainkäyttöalueella, jossa urheilutapahtumiin vetäminen on laillista. Olet itse vastuussa vedonlyönnin laillisuuden varmistamisesta omassa maassasi.",
        ],
      },
      { kind: "h2", text: "3. Palvelu" },
      {
        kind: "p",
        spans: [
          "Sector1 tarjoaa tutkimusta, analyysejä ja vihjeitä valituille jalkapallomarkkinoille yksityisten Telegram-kanavien kautta. Emme ota vastaan panoksia, ylläpidä vedonlyöntiyhtiötä emmekä säilytä asiakkaiden varoja. Kaikki vedot lyöt itse riippumattomilla kolmannen osapuolen toimijoilla.",
        ],
      },
      { kind: "h2", text: "4. Jäsenyys ja ilmainen käyttö" },
      {
        kind: "p",
        spans: [
          "Liittyminen Sector1:een ja Telegram-kanaviimme on ilmaista. Ainoa jäsenyyden ehto on, että rekisteröidyt suosittelemallemme vedonlyöntiyhtiölle ja lyöt vetosi siellä kumppanilinkkimme kautta. Saat aina vapaasti valita, missä ja kuinka paljon lyöt vetoa, mutta ilmainen käyttö tarjotaan suosittelemamme vedonlyöntiyhtiön käytön perusteella.",
        ],
      },
      { kind: "h2", text: "5. Ei takuita" },
      {
        kind: "p",
        spans: [
          "Urheilutulokset ovat luonteeltaan epävarmoja. Aiempi menestys, ROI tai mikä tahansa Sector1:n julkaisema historia ei takaa tulevia tuloksia. Vihjeet ovat tutkimukseen perustuvia mielipiteitä, ja niitä on käsiteltävä sellaisina.",
        ],
      },
      /*
      { kind: "h2", text: "6. Kokeilu & tilaus" },
      {
        kind: "p",
        spans: [
          "Uudet jäsenet saavat 30 päivän ilmaisen kokeilujakson. Jos jatkat 30. päivän jälkeen, tilaus maksaa 100 €/kk. Voit peruuttaa milloin tahansa Telegramissa poistamalla itsesi kanavilta, ilman irtisanomisaikaa.",
        ],
      },
      */
      { kind: "h2", text: "6. Hyväksyttävä käyttö" },
      {
        kind: "p",
        spans: [
          "Sitoudut olemaan jakamatta uudelleen, ottamatta kuvakaappauksia jälleenmyyntiä varten tai jakamatta julkisesti yksityisten kanaviemme sisältöä. Pääsy on henkilökohtainen eikä sitä voi siirtää. Rikkomukset johtavat välittömään käytön päättymiseen ilman hyvitystä.",
        ],
      },
      { kind: "h2", text: "7. Vastuu" },
      {
        kind: "p",
        spans: [
          "Lain sallimassa enimmäismäärässä Sector1 ei ole vastuussa mistään suorista tai epäsuorista tappioista, jotka aiheutuvat sisältömme käytöstä, mukaan lukien mutta ei rajoittuen vedonlyöntitappioihin. Lyöt vetoa omalla vastuullasi.",
        ],
      },
      { kind: "h2", text: "8. Muutokset" },
      {
        kind: "p",
        spans: [
          "Voimme päivittää näitä ehtoja ajoittain. Palvelun käytön jatkaminen päivityksen jälkeen merkitsee tarkistettujen ehtojen hyväksymistä.",
        ],
      },
      { kind: "h2", text: "9. Yhteystiedot" },
      {
        kind: "p",
        spans: [
          "Näitä ehtoja koskevat kysymykset: ",
          { t: "hello@sector1.bet", href: "mailto:hello@sector1.bet" },
          ".",
        ],
      },
    ],
  },
  privacy: {
    title: "Tietosuojakäytäntö",
    desc: "Kuinka Sector1 kerää, käyttää ja suojaa henkilötietojasi.",
    updated: "Heinäkuu 2026",
    blocks: [
      { kind: "h2", text: "1. Yhteenveto" },
      {
        kind: "p",
        spans: [
          "Keräämme vain palvelun toimittamiseen sekä sivuston ja kampanjoiden toimivuuden mittaamiseen tarvittavat vähimmäistiedot. Emme myy henkilötietoja. Jaamme rajattuja käyttötietoja ja hajautettuja tunnisteita mittausta ja kohdentamista varten analytiikka- ja mainospalveluille, kuten Metalle ja TikTokille.",
        ],
      },
      { kind: "h2", text: "2. Mitä keräämme" },
      {
        kind: "ul",
        items: [
          ["Perehdytyksen tiedot: etu- ja sukunimi, sähköpostiosoite, valinnainen puhelinnumero, maa sekä itse ilmoitettu talletussumma ja valuutta."],
          ["Käyttö- ja kampanjatiedot: katsotut sivut, sivulla vietetty aika, viittaaja, IP-osoite, selain- tai laitetiedot, klikkaus- tai evästetunnisteet sekä ennen mainonnan mittausta hajautetut tunnisteet."],
        ],
      },
      { kind: "h2", text: "3. Oikeusperuste (GDPR)" },
      {
        kind: "p",
        spans: [
          "Käsittelemme tietoja seuraavin perustein: (a) sopimuksen täyttäminen: tilaamasi palvelun tarjoaminen; (b) oikeutettu etu: sivustotilastot ja tietoturva; ja (c) suostumus: kun sitä vaaditaan ei-välttämättömiin evästeisiin.",
        ],
      },
      { kind: "h2", text: "4. Tietojen säilytys" },
      {
        kind: "p",
        spans: [
          "Säilytämme tilitietoja niin kauan kuin pysyt jäsenenä ja enintään 24 kuukautta peruutuksen jälkeen, minkä jälkeen ne poistetaan tai anonymisoidaan. Analytiikka- ja mainospalvelut säilyttävät tapahtuma- tai pseudonyymejä tietoja omien säilytyskäytäntöjensä mukaisesti.",
        ],
      },
      { kind: "h2", text: "5. Oikeutesi" },
      {
        kind: "p",
        spans: [
          "Voit milloin tahansa pyytää pääsyä henkilötietoihisi sekä niiden oikaisua, siirtoa tai poistamista. Lähetä sähköpostia osoitteeseen ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ", niin vastaamme 30 päivän kuluessa.",
        ],
      },
      { kind: "h2", text: "6. Evästeet" },
      {
        kind: "p",
        spans: [
          "Käytämme ensimmäisen osapuolen evästeitä välttämättömiin toimintoihin (istunto, asetukset), analytiikkaan sekä Metan ja TikTokin mainonnan mittausteknologioita kampanjoiden tehokkuuden ja konversioiden mittaamiseen. Nämä palveluntarjoajat voivat asettaa tai lukea kolmannen osapuolen evästeitä ja vastaavia tunnisteita.",
        ],
      },
      { kind: "h2", text: "7. Tietoturva" },
      {
        kind: "p",
        spans: [
          "Tiedot tallennetaan luotettavien EU:n/Yhdysvaltojen palveluntarjoajien palvelimille tavanomaisin tietoturvatoimin (TLS siirron aikana, salaus levossa tarvittaessa). Mikään järjestelmä ei ole täysin turvallinen, käytä yksilöllistä salasanaa.",
        ],
      },
      { kind: "h2", text: "8. Muutokset" },
      {
        kind: "p",
        spans: [
          "Olennaisista muutoksista tähän käytäntöön ilmoitetaan sähköpostitse tai banneri-ilmoituksella ennen niiden voimaantuloa.",
        ],
      },
    ],
  },
  responsible: {
    title: "Vastuullinen pelaaminen",
    desc: "Työkaluja, rajoja ja tukipuhelimia, jotta vedonlyönti pysyy hauskana, turvallisena ja hallinnassa.",
    updated: "Toukokuu 2026",
    blocks: [
      {
        kind: "lede",
        spans: [
          "Vedonlyönnin tulee olla viihdettä, ei koskaan tapa ansaita rahaa, jonka menettämiseen sinulla ei ole varaa, ei pakokeino stressistä eikä koskaan jotain, jonka salaat läheisiltäsi. Sector1 myy tutkimusta ja rakennetta, ei varmuutta. Jos vedonlyönti lakkaa olemasta hauskaa, lopeta.",
        ],
      },
      { kind: "h2", text: "Aseta ensin rajasi" },
      {
        kind: "ul",
        items: [
          ["Päätä kuukausibudjetti ennen kuin lyöt yhtäkään vetoa. Käsittele sitä kuin harrastusbudjettia."],
          ["Käytä kiinteää panossuunnitelmaa (1–2 % budjetista vihjettä kohti). Älä koskaan jahtaa tappioita tuplaamalla."],
          ["Pidä vedonlyöntivaroille erillinen tili tai sähköinen lompakko. Älä sekoita niitä säästöihin."],
          ["Pidä säännöllisesti taukoja. Viikonloppu vapaata palauttaa perspektiivin nopeammin kuin yksikään uusi veto."],
        ],
      },
      { kind: "h2", text: "Varoitusmerkit" },
      {
        kind: "ul",
        items: [
          ["Lyöt vetoa enemmän kuin sinulla on mukavasti varaa menettää."],
          ["Lainaat rahaa vedonlyöntiin tai myyt tavaroita rahoittaaksesi vetoja."],
          ["Valehtelet perheelle tai ystäville siitä, kuinka paljon lyöt vetoa."],
          ["Tunnet levottomuutta, ärtymystä tai alakuloa, kun yrität vähentää."],
          ["Käytät vedonlyöntiä paetaksesi ongelmia tai turruttaaksesi tunteita."],
        ],
      },
      { kind: "h2", text: "Vedonlyöntiyhtiösi tarjoamat työkalut" },
      {
        kind: "p",
        spans: [
          "Jokaisen EU:n säännellyn toimijan on tarjottava talletusrajoja, tappiorajoja, istuntomuistutuksia, taukoja ja itsesulkua. Käytä niitä. Rajan asettaminen kestää 30 sekuntia ja säästää vuosien katumukselta.",
        ],
      },
      { kind: "h2", text: "Ilmaista, luottamuksellista apua" },
      {
        kind: "ul",
        items: [
          [
            { t: "BeGambleAware", b: true },
            " (Iso-Britannia & kansainvälinen): ",
            { t: "begambleaware.org", href: "https://www.begambleaware.org", ext: true },
          ],
          [
            { t: "Gamblers Anonymous", b: true },
            ", tapaamisia maailmanlaajuisesti, ",
            { t: "gamblersanonymous.org", href: "https://www.gamblersanonymous.org", ext: true },
          ],
          [
            { t: "Stödlinjen", b: true },
            " (Ruotsi): 020-81 91 00, ",
            { t: "stodlinjen.se", href: "https://www.stodlinjen.se", ext: true },
          ],
          [
            { t: "Spillemyndigheden", b: true },
            " (Tanska): ",
            { t: "spillemyndigheden.dk", href: "https://www.spillemyndigheden.dk", ext: true },
          ],
        ],
      },
      { kind: "h2", text: "Jos sinun on lopetettava" },
      {
        kind: "p",
        spans: [
          "Peruuta Sector1-käyttöoikeutesi Telegramissa yhdellä napautuksella ja aseta sitten itsesulku vedonlyöntiyhtiö(i)ssäsi. Jos haluat meidän poistavan tietosi, lähetä sähköpostia osoitteeseen ",
          { t: "privacy@sector1.bet", href: "mailto:privacy@sector1.bet" },
          ". Emme ota yhteyttä jäseniin, jotka ovat asettaneet itselleen itsesulun.",
        ],
      },
      {
        kind: "foot",
        spans: [
          "18+ · Pelaa vastuullisesti · Älä koskaan lyö vetoa enempää kuin sinulla on varaa menettää.",
        ],
      },
    ],
  },
};

export default legal;
