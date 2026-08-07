import GlassBalls from "./GlassBalls";

type Analyst = {
  name: string;
  region: string;
  markets: string[];
  philosophy: string;
  handle: string;
  initials: string;
};

const analysts: Analyst[] = [
  {
    name: "Douglas",
    region: "Nordics · Lead",
    markets: ["Allsvenskan", "Eliteserien", "Veikkausliiga"],
    philosophy: "Northern leagues are mispriced because the market models them like the big five. They don't behave like the big five.",
    handle: "@douglas_s1",
    initials: "DS",
  },
  {
    name: "Rafa",
    region: "Balkan Markets",
    markets: ["HNL", "Prva Liga", "SuperLiga"],
    philosophy: "Croatia, Bosnia and the Balkan angle are where public emotion creates price inefficiencies.",
    handle: "@rafa_s1",
    initials: "RB",
  },
  {
    name: "Marco",
    region: "Italy · South Europe",
    markets: ["Serie A", "Serie B", "Coppa"],
    philosophy: "Italian football rewards patience on under markets and live re-pricing. We model both.",
    handle: "@marco_s1",
    initials: "MC",
  },
  {
    name: "Liam",
    region: "UK & Ireland",
    markets: ["Premier League", "Championship", "FA Cup"],
    philosophy: "Public bias on big-six clubs creates value on the other side almost every weekend.",
    handle: "@liam_s1",
    initials: "LK",
  },
  {
    name: "Andre",
    region: "Iberia · LATAM",
    markets: ["La Liga", "Liga Portugal", "Brasileirão"],
    philosophy: "Latin leagues run on form cycles. Catch the turn early, exit before the market does.",
    handle: "@andre_s1",
    initials: "AR",
  },
  {
    name: "Tom",
    region: "DACH · Bundesliga",
    markets: ["Bundesliga", "2. Bundesliga", "Austria"],
    philosophy: "German pricing is sharpest in Europe. Edge comes from xG-adjusted live moves, not pre-match hunches.",
    handle: "@tom_s1",
    initials: "TB",
  },
];

export default function Analysts() {
  return (
    <section className="analysts" id="analysts">
      <GlassBalls variant="analysts" />
      <div className="container">
        <div className="section-head">
          <span className="kicker">The desk</span>
          <h2>Real analysts. Real regions. Real edges.</h2>
          <p>Six dedicated leads across nine private Telegram channels. Every market, covered by someone who lives it.</p>
        </div>
        <div className="analyst-grid">
          {analysts.map((a) => (
            <article className="analyst-card" key={a.handle}>
              <div className="analyst-head">
                <div className="analyst-avatar" aria-hidden="true">{a.initials}</div>
                <div>
                  <h3>{a.name}</h3>
                  <span className="analyst-region">{a.region}</span>
                </div>
              </div>
              <p className="analyst-quote">&ldquo;{a.philosophy}&rdquo;</p>
              <div className="analyst-markets">
                {a.markets.map((m) => (
                  <span className="market-tag" key={m}>{m}</span>
                ))}
              </div>
              <div className="analyst-foot">
                <span className="analyst-handle">{a.handle}</span>
                <span className="analyst-live"><span className="live-dot" /> Posting today</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
