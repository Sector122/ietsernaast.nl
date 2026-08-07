// Per-IP rate limiting via the Cloudflare Workers native binding (per-location
// counters, no external store, sub-millisecond, no code state to manage).
// Used to throttle unauthenticated public endpoints by client IP.
//
// Fails OPEN: if the binding is absent (local dev) or errors, the request is
// allowed. Every gated endpoint validates its payload, so a limiter blip must
// never take it fully offline.
export async function rateLimit(
  limiter: RateLimitBinding | undefined,
  key: string,
): Promise<boolean> {
  if (!limiter) return true;
  try {
    const { success } = await limiter.limit({ key });
    return success;
  } catch {
    return true;
  }
}
