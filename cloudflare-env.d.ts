// Minimal Cloudflare binding types for the bindings this app touches
// directly. Deliberately NOT the `wrangler types` output: that ships
// workerd's full runtime lib, which clobbers DOM globals (fetch/Response)
// and breaks typing in unrelated components. OpenNext's own CloudflareEnv
// (declared in @opennextjs/cloudflare) merges with this one.

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[] }>;
  run(): Promise<{
    success: boolean;
    meta?: { changes?: number; last_row_id?: number };
  }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

// Cloudflare Workers native rate-limiting binding (GA). Per-location counters,
// keyed by client IP. Configured in wrangler.toml under [[ratelimits]].
interface RateLimitBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface CloudflareEnv {
  DB: D1Database;
  // Stricter limiter for admin login + first-run setup.
  LOGIN_RATE_LIMITER?: RateLimitBinding;
  // Looser limiter for the public tracking endpoints.
  PUBLIC_RATE_LIMITER?: RateLimitBinding;
}
