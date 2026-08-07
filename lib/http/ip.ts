import type { NextRequest } from "next/server";

// Trusted client IP. On Cloudflare, `CF-Connecting-IP` is set by the edge and
// cannot be spoofed by the client, whereas `X-Forwarded-For` is a client-
// supplied header (CF appends the real IP but the first value is attacker-
// controlled). Always prefer CF-Connecting-IP; fall back to XFF's first hop
// only for non-Cloudflare/local contexts.
export function clientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return "";
}
