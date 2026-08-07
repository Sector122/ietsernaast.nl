export type Tip = {
  match: string;
  league: string;
  market: string;
  pick: string;
  odds: string;
  conf: number;
};

// Static sample data for the Hero preview. If a live feed is ever wired up,
// fetch it from a server route that holds the key in env — never expose a key
// client-side.
export const sampleTips: Tip[] = [
  { match: "Arsenal vs Chelsea", league: "Premier League · 21:00", market: "1X2", pick: "Home", odds: "1.92", conf: 78 },
  { match: "Real Madrid vs Sevilla", league: "La Liga · 22:00", market: "BTTS", pick: "Yes", odds: "1.74", conf: 71 },
  { match: "Inter vs Juventus", league: "Serie A · 20:45", market: "Over 2.5", pick: "Over", odds: "2.05", conf: 66 },
  { match: "Bayern vs Dortmund", league: "Bundesliga · 18:30", market: "Asian Handicap", pick: "Bayern -1", odds: "1.88", conf: 73 },
  { match: "PSG vs Marseille", league: "Ligue 1 · 20:00", market: "Corners 9.5", pick: "Over", odds: "1.95", conf: 68 },
  { match: "Atlético vs Barcelona", league: "La Liga · 21:00", market: "Cards 4.5", pick: "Over", odds: "1.85", conf: 70 },
  { match: "Liverpool vs Man City", league: "Premier League · 17:30", market: "1X2", pick: "Draw", odds: "3.40", conf: 64 },
  { match: "Napoli vs Roma", league: "Serie A · 20:45", market: "1H Goals 1.5", pick: "Over", odds: "2.10", conf: 67 },
];
