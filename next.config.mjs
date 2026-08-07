// Security response headers. Applied here (not just public/_headers) because
// public/_headers only decorates responses served directly by Cloudflare's
// static-asset system; HTML documents are served through the OpenNext Worker,
// so those headers must be set in-app to reach them.
//
// The CSP is limited to structural directives that cannot block a script,
// beacon, or third-party form post: base-uri / object-src / frame-ancestors.
// A full script/connect allowlist CSP is intentionally NOT used — the site's
// third-party trackers (Meta Pixel, Mixpanel's rotating *.run.app endpoints,
// self-hosted R2 media) would make an enforced allowlist
// high-maintenance and fragile for no real gain on a mostly-static funnel.
const enforcedCsp = [
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy", value: enforcedCsp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
export default nextConfig;

// Enable Cloudflare bindings (KV, R2, secrets) during `next dev`.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
