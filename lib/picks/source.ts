import type { Pick } from "./types";

/**
 * Server-only data source for "today's picks".
 *
 * Uses the keyless ESPN public endpoints and maps the result into the BRD
 * `Pick` shape. No API key is required and no third-party credentials are ever
 * exposed to the client.
 */

const LEAGUES: { code: string; name: string }[] = [
  { code: "uefa.champions", name: "Champions League" },
  { code: "uefa.europa", name: "Europa League" },
  { code: "eng.1", name: "Premier League" },
  { code: "esp.1", name: "La Liga" },
  { code: "ita.1", name: "Serie A" },
  { code: "ger.1", name: "Bundesliga" },
  { code: "fra.1", name: "Ligue 1" },
  { code: "ned.1", name: "Eredivisie" },
  { code: "por.1", name: "Liga Portugal" },
  { code: "usa.1", name: "MLS" },
  { code: "bra.1", name: "Brasileirão" },
  { code: "arg.1", name: "Liga Profesional" },
  { code: "mex.1", name: "Liga MX" },
];

const UA = "Mozilla/5.0 (compatible; Sector1/1.0)";
const UPSTREAM_TIMEOUT_MS = 5000;

async function jget<T>(url: string): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    // Deliberately NOT cached per-fetch: with 12 leagues x up to 4 matches,
    // per-fetch caching created ~60 KV entries rewriting every 2-5 minutes,
    // which alone exhausts the free plan's 1,000 KV writes/day. The route's
    // revalidate caches the final response as a single entry instead.
    const r = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function americanToDecimal(am: number): number {
  if (!Number.isFinite(am) || am === 0) return 0;
  return am > 0 ? +(1 + am / 100).toFixed(2) : +(1 + 100 / Math.abs(am)).toFixed(2);
}

type ScoreboardEvent = {
  id: string;
  date: string;
  season?: { slug?: string };
  status?: { type?: { state?: string } };
  competitions?: Array<{
    competitors?: Array<{
      homeAway?: "home" | "away";
      team?: { shortDisplayName?: string; displayName?: string; abbreviation?: string };
    }>;
  }>;
};

type OddsItem = {
  overUnder?: number;
  overOdds?: number;
  homeTeamOdds?: { moneyLine?: number };
  awayTeamOdds?: { moneyLine?: number };
  provider?: { name?: string };
};

/** Formats a date as YYYYMMDD in UTC, for the ESPN `dates` query param. */
function ymdUTC(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

async function picksForLeague(
  lg: { code: string; name: string },
  dates: string,
  maxKickoffMs: number,
): Promise<Pick[]> {
  const board = await jget<{ events?: ScoreboardEvent[] }>(
    `https://site.api.espn.com/apis/site/v2/sports/soccer/${lg.code}/scoreboard?dates=${dates}`);
  if (!board?.events?.length) return [];

  const upcoming = board.events
    .filter((e) => {
      const state = e.status?.type?.state;
      if (state !== "pre" && state !== "in") return false;
      const t = new Date(e.date).getTime();
      return Number.isFinite(t) && t < maxKickoffMs;
    })
    .slice(0, 4);

  const out: Pick[] = [];

  for (const ev of upcoming) {
    const comp = ev.competitions?.[0];
    const home = comp?.competitors?.find((c) => c.homeAway === "home")?.team;
    const away = comp?.competitors?.find((c) => c.homeAway === "away")?.team;
    if (!home || !away) continue;
    const homeName = home.shortDisplayName ?? home.displayName ?? home.abbreviation ?? "Home";
    const awayName = away.shortDisplayName ?? away.displayName ?? away.abbreviation ?? "Away";
    const match = `${homeName} vs ${awayName}`;
    const odds = await jget<{ items?: (OddsItem | null)[] }>(
      `https://sports.core.api.espn.com/v2/sports/soccer/leagues/${lg.code}/events/${ev.id}/competitions/${ev.id}/odds`);
    const item = (odds?.items ?? []).find((candidate): candidate is OddsItem => !!candidate);
    const bookmaker = item?.provider?.name;

    // 1X2 — pick the betting favourite (lowest American moneyline).
    const hML = item?.homeTeamOdds?.moneyLine;
    const aML = item?.awayTeamOdds?.moneyLine;
    if (typeof hML === "number" && typeof aML === "number") {
      const isHomeFav = hML < aML;
      const dec = americanToDecimal(isHomeFav ? hML : aML);
      if (dec >= 1.4 && dec <= 8) {
        out.push({
          id: `${ev.id}-1x2`,
          match,
          league: lg.name,
          ...(ev.season?.slug ? { stage: ev.season.slug } : {}),
          market: "1X2",
          pick: isHomeFav ? "Home" : "Away",
          odds: dec,
          kickoff: ev.date,
          status: "pending",
          ...(bookmaker ? { bookmaker } : {}),
        });
      }
    }

    // Over total goals.
    if (typeof item?.overUnder === "number" && typeof item.overOdds === "number") {
      const dec = americanToDecimal(item.overOdds);
      if (dec >= 1.4 && dec <= 8) {
        out.push({
          id: `${ev.id}-ou`,
          match,
          league: lg.name,
          ...(ev.season?.slug ? { stage: ev.season.slug } : {}),
          market: `Over ${item.overUnder}`,
          pick: "Over",
          odds: dec,
          kickoff: ev.date,
          status: "pending",
          ...(bookmaker ? { bookmaker } : {}),
        });
      }
    }
  }

  return out;
}

/** Number of days ahead (inclusive of today) the picks feed looks for fixtures. */
const HORIZON_DAYS = 6;

/** Returns the next week's picks and fixtures ordered by soonest kick-off first. Never throws. */
export async function getTodayPicks(): Promise<Pick[]> {
  const now = new Date();
  const horizon = new Date(now.getTime() + HORIZON_DAYS * 24 * 60 * 60 * 1000);
  const dates = `${ymdUTC(now)}-${ymdUTC(horizon)}`;
  // Exclusive upper bound: midnight (UTC) HORIZON_DAYS after the start of today,
  // so the whole of the final day's fixtures are included.
  const startOfTodayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const maxKickoffMs = startOfTodayMs + (HORIZON_DAYS + 1) * 24 * 60 * 60 * 1000;

  const results = await Promise.allSettled(
    LEAGUES.map((lg) => picksForLeague(lg, dates, maxKickoffMs)),
  );
  return results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
    .slice(0, 18);
}
