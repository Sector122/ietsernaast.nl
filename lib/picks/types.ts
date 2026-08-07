export type PickStatus = "pending" | "won" | "lost" | "void";

export type Pick = {
  /** Stable unique id, used as the React key. */
  id: string;
  /** "{home} vs {away}", e.g. "Arsenal vs Chelsea". */
  match: string;
  /** Competition name only, e.g. "Premier League". */
  league: string;
  /** Optional competition stage slug, e.g. "quarterfinals" or "final". */
  stage?: string;
  /** True when this record represents a scheduled fixture with no available pick or odds. */
  fixtureOnly?: boolean;
  /** Market label, e.g. "1X2", "Over 2.5". */
  market: string;
  /** Selection, e.g. "Home", "Away", "Over". */
  pick: string;
  /** Decimal odds rounded to 2dp, or null when no odds are available. */
  odds: number | null;
  /** Kick-off time as an ISO 8601 UTC string. */
  kickoff: string;
  status: PickStatus;
  /** Optional sportsbook name. */
  bookmaker?: string;
};
