import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// ISR pages, route-handler revalidation (/api/picks/today, 2m), and Next's
// fetch() data cache all WRITE to the incremental cache. The static-assets
// implementation is read-only, so every revalidation logged
// "StaticAssetsIncrementalCache: Failed to set to read-only cache" and nothing
// was ever cached. KV (NEXT_INC_CACHE_KV binding, already provisioned in
// wrangler.toml for prod and staging) accepts the writes.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
