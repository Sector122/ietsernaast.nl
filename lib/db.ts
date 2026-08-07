import { getCloudflareContext } from "@opennextjs/cloudflare";

// Single accessor for the D1 binding. Server-only. Local dev uses the sqlite
// mirror in .wrangler/state (seeded via `wrangler d1 migrations apply --local`).
export function getDb(): D1Database {
  return getCloudflareContext().env.DB;
}
