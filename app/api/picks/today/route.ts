import { NextResponse } from "next/server";
import { getTodayPicks } from "@/lib/picks/source";

export const revalidate = 600;

const CACHE_CONTROL = "public, s-maxage=600, stale-while-revalidate=60";

/**
 * GET /api/picks/today
 *
 * Always responds 200 with a JSON `Pick[]`. On any upstream failure it returns
 * an empty array rather than an error status, so client components can treat an
 * empty payload as "no data" and hide themselves.
 */
export async function GET() {
  try {
    const picks = await getTodayPicks();
    return NextResponse.json(picks, { headers: { "Cache-Control": CACHE_CONTROL } });
  } catch {
    return NextResponse.json([], { headers: { "Cache-Control": CACHE_CONTROL } });
  }
}
