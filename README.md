# Sector1 Landing — Next.js

Next.js 15 (App Router) + TypeScript port of the Sector1 betting tips landing page

## Setup

```bash
cd sector1-next
npm install
npm run dev
```

## Structure

```
app/
  layout.tsx        root layout, loads Inter via next/font
  page.tsx          composes the landing page
  globals.css       all styles (no Tailwind, no CSS-in-JS)
components/
  Nav.tsx           sticky top nav (client — geo detect)
  Hero.tsx          headline + live tips tease (client — scroll-to-pricing)
  Vsl.tsx           Wistia VSL inside phone mockup
  CtaStrip.tsx
  Reviews.tsx       5 testimonials + placeholder
  Why.tsx           4 feature cards
  Odds.tsx          live odds table tease
  Pricing.tsx       final CTA / pricing card
  Footer.tsx        socials + legal
  StickyCta.tsx     mobile sticky CTA (client — hides over #pricing)
  ExitIntent.tsx    exit popup, 40-day offer, 5-min countdown (client)
  BrandMark.tsx     orange S logo SVG
lib/
  tips.ts           sample tips — swap for bet365 fetch in a /api route
```

## Going to prod

- **Bet365 odds**: add a server route `app/api/tips/route.ts` that hits bet365 with a key from `process.env.BET365_API_KEY`. Hero + Odds fetch from `/api/tips`. Never expose the key client-side.
- **Geo detect**: replace `ipapi.co` in `Nav.tsx` with your own edge route, or use `geolocation` headers from Vercel (`request.geo.country`) in a server component.
- **Testimonials**: drop real screenshots into `public/reviews/` and replace `<figure>` blocks.
- **Wistia video**: swap the `eezkbd5i3chs4vj` ID for the final recording.
- **Pricing link**: `webynize.com/pricing` — verify before launch.
- **Analytics**: drop in `@vercel/analytics` or PostHog at `layout.tsx`.

## Analytics (Mixpanel)

Client-side product analytics run as an independent layer alongside the Meta
Pixel / `TrackLead` system. If `NEXT_PUBLIC_MIXPANEL_TOKEN` is unset (or the SDK
fails to load), every analytics call is a silent no-op — the page and all CTAs
work unchanged.

### Setup

Add to `.env.local` (and the same vars to Cloudflare Workers env for prod/preview):

```bash
NEXT_PUBLIC_MIXPANEL_TOKEN=your_project_token
# Optional:
NEXT_PUBLIC_MIXPANEL_API_HOST=https://api-eu.mixpanel.com   # EU residency (default)
NEXT_PUBLIC_MIXPANEL_DEBUG=1                                 # verbose logging in dev
NEXT_PUBLIC_MIXPANEL_SESSION_REPLAY_PERCENT=100             # 0 disables Session Replay
```

> A Mixpanel project token is write-only ingestion, not a secret — `NEXT_PUBLIC_`
> exposure is expected, same as the Meta Pixel ID injected at the edge.

### Layout

```
lib/analytics/
  mixpanel.ts     guarded singleton wrapper (init/track/register/people…)
  events.ts       event-name constants + pure prop helpers
components/analytics/
  AnalyticsProvider.tsx   inits Mixpanel, super props, Page Viewed
  InteractionTracker.tsx  global click listener + scroll/section observers
```

Both providers are mounted in `app/layout.tsx` next to `<TrackLead/>`. Video
events come from `VslPlayer.tsx`; exit-intent events from the
`components/exit-intent/*` provider/modal.

The TikTok Pixel is also mounted in the root layout. Its wrapper lives in
`lib/analytics/tiktok.ts`: landing/onboarding views emit `ViewContent`, messaging
and email leads emit `Contact`, and first accepted signed onboarding submissions
emit `Purchase`. The unsigned generic form never reports a purchase.
Email, phone, and attribution identifiers are SHA-256 hashed before
`ttq.identify`; ecommerce events without matching site actions are not emitted.

### Events

`Page Viewed`, `Section Viewed`, `Scroll Depth`, `Video Started/Unmuted/Progress/
Completed`, `CTA Clicked`, `Lead` (t.me CTAs, 1:1 with Meta), `Exit Intent
Shown/Dismissed`, `Nav Link Clicked`, `Outbound Link Clicked`. Super properties
(`locale`, `region_bucket`, `is_route_locale`, `utm_*`, `referrer`, `device_type`,
`viewport`) are attached to every event.

### Notes

- **Data residency**: defaults to the EU host (`api-eu.mixpanel.com`).
- **Session Replay** is on by default; text/inputs are masked. Set
  `NEXT_PUBLIC_MIXPANEL_SESSION_REPLAY_PERCENT=0` to disable without a code change.

## Onboarding links

The shared unattributed form is available at `/onboarding`. For an attributed
Telegram visitor, generate a signed link from their 16-character token:

```bash
pnpm onboarding:link 0123456789abcdef
```

The command reads `ONBOARDING_LINK_SECRET` from the shell or `.env.local` and
prints an absolute `/onboarding?id=...&sig=...` URL. The Telegram bot must use the same HMAC
secret and signing algorithm. Authenticated operators can also generate links
at `/admin/link`. The secret must never be exposed to browser code.
- **No consent gating** today — Mixpanel, Meta, and TikTok load on page view.
  Gate non-essential analytics and advertising pixels behind consent when a
  cookie banner or CMP is added.
- **ContentSquare** is currently disabled (the loader `<Script>` in
  `app/layout.tsx` is commented out).
