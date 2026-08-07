# AGENTS.md — Sector1 platform guide

How the whole site works: UI surfaces, technical architecture, data flow, the
locale/domain system, caching & timing behavior, and setup. This is a marketing
funnel that drives visitors into Telegram betting-tips groups.

Build is ground truth: `pnpm build` (kill `next dev` first — they share `.next`).
Fast typecheck without touching `.next`: `npx tsc --noEmit` (catches `Dict`/`Record<Locale>`
parity breaks). Scripts: `dev`, `build`, `start`, `lint` ([package.json](package.json)).

---

## 1. Stack

- **Next.js 15 app router**, React 19, TypeScript, pnpm. Deployed on **Cloudflare Workers**
  via the OpenNext adapter (see §10). Almost everything prerenders static (`○`/`●`), not SSR (`ƒ`).
- Runtime deps are deliberately tiny: `mixpanel-browser`. No CSS framework —
  styling is one hand-written [app/globals.css](app/globals.css).
- Path alias `@/*` → repo root.

---

## 2. Locales & domains

The site is one codebase serving **17 markets**, each treated as a "domain" keyed by locale.

- `LOCALES` in [lib/i18n/config.ts](lib/i18n/config.ts) — the source of truth. English is
  served at `/` ([app/page.tsx](app/page.tsx)); every other locale renders at `/[locale]`
  ([app/[locale]/page.tsx](app/%5Blocale%5D/page.tsx)). `ROUTE_LOCALES` auto-derives (all
  except `en`), feeding `generateStaticParams` + `dynamicParams=false`.
- **Dictionaries** — one file per language in [lib/i18n/dict](lib/i18n/dict), assembled in
  [lib/i18n/index.ts](lib/i18n/index.ts). Aliases: `tse` reuses `sv`; `bs`/`cnr` reuse the `sr`
  dict; `atier`/`bih` reuse `hr`. The `Dict` type in [lib/i18n/types.ts](lib/i18n/types.ts) enforces parity —
  every dict must match it or the build fails.
- **Per-locale wiring beyond copy:** `VSL_VIDEO_KEYS` (self-hosted R2 media)
  + `HTML_LANG` (config.ts), Telegram bot
  links `BOT_URLS` + optional `WHATSAPP_URLS` ([lib/cta.ts](lib/cta.ts)), Meta Pixel region
  `REGIONS_BY_LOCALE` ([lib/meta-pixel.ts](lib/meta-pixel.ts): `nordic` = sv/tse/fi, `balkan` =
  sr/hr/bg/sl/bs/cnr/atier/bih, `both` = en/de/nl/fr/lt), legal docs
  ([lib/legal](lib/legal)).
- **Add a locale** (additive, ~7 touch points): add to `LOCALES` + `VSL_VIDEO_KEYS` + `HTML_LANG`;
  create `lib/i18n/dict/<l>.ts` + register in `index.ts`; create `lib/legal/<l>.ts` + register
  in `index.ts`; add `BOT_URLS[<l>]`; add `REGIONS_BY_LOCALE[<l>]`. Routes/SSG pick it up free.
- **EN-only changes** stay parity-safe: add fields as OPTIONAL (`?:`) in the `Dict` type,
  fill them only in `en.ts`, render conditionally, and wire EN-only sections into
  `app/page.tsx` only.

---

## 3. UI — page structure

Both homepages share the same components. `<main>` order:

`Vsl → Hero → HowItWorks → Why → EmailCapture → Pricing`

Plus chrome: `Nav`, `Footer`, `StickyCta` (mobile, scroll-triggered),
`Orbs`/`GlassBalls` (decorative 3D balls — kept to ≤4 per page, never consecutive sections),
`RevealRoot` (scroll reveal), and the exit-intent + handoff modal providers.

Key UI behaviors:

- **Hero "blurred tip" teaser** ([components/Hero.tsx](components/Hero.tsx)) — the page never
  reveals a full tip. The "Live tips" card and the Telegram-notification mockup show the
  match + odds but blur the pick. `teaseSelection(pick, match, market)` returns
  `{ hidden, suffix }`: `hidden` is the blurred answer (home/away team via `teamFromMatch`
  splitting `"{home} vs {away}"`, or `Draw`/`Over`/`Under`), `suffix` is the visible bet type
  (`to win` / `goals` / `BTTS`). Rendered `<b className="odds-blur">{hidden}</b>` + visible
  `.odds-pick-suffix`; odds stay readable. Styles `.odds-pill`/`.odds-pick`/`.odds-blur` in
  globals.css.
- **Legal pages** — localized terms/privacy/responsible from [lib/legal](lib/legal), rendered
  by [components/LegalBody.tsx](components/LegalBody.tsx) / [components/LegalPage.tsx](components/LegalPage.tsx).
  English at `/terms` etc; localized at `/[locale]/terms|privacy|responsible`.

---

## 4. Per-domain configuration toggles

The single place you edit to change behavior per market. Each follows the same pattern:
a global default + an optional `Partial<Record<Locale, …>>` override map + a `…For(locale)`
resolver.

- **CTA copy framing** — [lib/cta-variant.config.ts](lib/cta-variant.config.ts)
  (`DEFAULT_CTA_VARIANT`, `CTA_VARIANT_BY_LOCALE`; resolver `ctaVariantFor` in
  [lib/cta-variant.ts](lib/cta-variant.ts)). `"free"` vs `"vip"` primary CTA wording.
- **Pricing ("Free for life") section visibility** — [lib/pricing.config.ts](lib/pricing.config.ts)
  (`DEFAULT_PRICING_ACTIVE`, `PRICING_ACTIVE_BY_LOCALE`; resolver `pricingActiveFor`).
  **Default INACTIVE** — the bottom-of-page pricing block is hidden on every domain unless a
  locale is explicitly set to `true`. Gated in both page files as `{showPricing && <Pricing … />}`.
- **Telegram bot link per locale** — `BOT_URLS` in [lib/cta.ts](lib/cta.ts) (`getBotUrl`).
- **WhatsApp dual-CTA** — adding a locale to `WHATSAPP_URLS` ([lib/cta.ts](lib/cta.ts)) gives
  that market a second WhatsApp button; absent locales keep the single Telegram button.

---

## 5. Live picks — data flow

The tips/odds shown across the hero, ticker, and `/api` come from a shared pipeline.

- **Server source** [lib/picks/source.ts](lib/picks/source.ts): calls keyless ESPN endpoints
  (scoreboard + core odds), maps to a `Pick` shape ([lib/picks/types.ts](lib/picks/types.ts)),
  filters to today/tomorrow (UTC), sorts soonest-first, never throws. During the 2026 World Cup
  window domestic leagues are paused — only `fifa.world` has fixtures (and exposes odds).
- **Route** [app/api/picks/today/route.ts](app/api/picks/today/route.ts): always returns 200
  (catches errors → `[]`), `Cache-Control: s-maxage=600, stale-while-revalidate=60`,
  `revalidate = 600`.
- **Client store** [lib/picks/usePicks.ts](lib/picks/usePicks.ts): module-level state +
  shared in-flight promise so every component on the page makes exactly ONE fetch. Revalidates
  every 10 min + on focus/online. Hero falls back to `sampleTips` ([lib/tips.ts](lib/tips.ts))
  when there are zero live picks, so it never looks empty.
- Other routes: [app/api/tips/route.ts](app/api/tips/route.ts) (legacy, used by `Odds.tsx`),
  [app/api/lead/route.ts](app/api/lead/route.ts) (lead capture), [app/api/meta/track/route.ts](app/api/meta/track/route.ts) (CAPI).

---

## 6. Conversion funnel & integrations

- **CTAs → Telegram.** On-page CTAs are `<a class="btn" href="#" data-handoff
  data-href={botUrl}>` triggers. A handoff modal exists
  ([components/handoff](components/handoff)) but is currently DORMANT — `HandoffInterceptor`
  has `DIRECT_TO_TELEGRAM = true`, so clicks go straight to the per-locale `t.me` link
  (stamped with `?start=src_<click_id>`).
- **Exit-intent** ([components/exit-intent](components/exit-intent)) — email-capture modal on
  exit, with suppression in [lib/exit-intent/suppression.ts](lib/exit-intent/suppression.ts).
- **Email capture** → `POST /api/lead` → Meta Conversions API (hashed-email Lead via
  [lib/meta/capi.ts](lib/meta/capi.ts)) + Brevo contact upsert ([lib/brevo.ts](lib/brevo.ts)).
- **Analytics (Mixpanel)** — wrapper [lib/analytics/mixpanel.ts](lib/analytics/mixpanel.ts)
  (no-op without a token), event names in [lib/analytics/events.ts](lib/analytics/events.ts),
  persistent `click_id` super-prop ([lib/analytics/click-id.ts](lib/analytics/click-id.ts)).
  One global capture-phase click listener
  ([components/analytics/InteractionTracker.tsx](components/analytics/InteractionTracker.tsx))
  fires CTA/Lead/Handoff on `.btn`/`.sticky-cta`; one IntersectionObserver fires Section Viewed
  (dynamically-mounted sections like the ticker fire their own one-time view event).
  All `mixpanel.*` calls live only in the wrapper — never call the SDK directly.
- **Meta Pixel** ([components/analytics/MetaPixel.tsx](components/analytics/MetaPixel.tsx)) —
  build-time server component, reads pixel IDs from env, fires the region pixel(s) per
  `regionsForLocale`. Rendered in `app/[locale]/layout.tsx` + each EN route (NOT root layout,
  to avoid double-firing).
- **TikTok Pixel** ([components/analytics/TikTokPixel.tsx](components/analytics/TikTokPixel.tsx)) —
  fixed pixel `D9CVAG3C77U2EG6DM3A0`, mounted once in the root layout.
  `TikTokPageTracker` fires `ViewContent` on landing/onboarding pages; messaging and email leads
  fire `Contact`; first accepted signed onboarding submissions fire `Purchase` with deposit
  value/currency. The unsigned generic form never reports a purchase.
  PII is normalized and SHA-256 hashed in [lib/analytics/tiktok.ts](lib/analytics/tiktok.ts)
  before `ttq.identify`; never call `ttq` directly elsewhere.
- **Admin operations** — `/admin` provides authenticated submission review,
  user management, CSV export, and signed onboarding-link generation. The
  Telegram bot uses the same `ONBOARDING_LINK_SECRET`; operators can use
  `pnpm onboarding:link <16-hex-token>` as a local fallback.

---

## 7. Caching & timing (the "setup delays")

Because pages are prerendered and CDN-cached, content changes are not always instant:

- **Static pages** are built once and served from Cloudflare's edge cache. A new deploy
  publishes a new Worker version that takes over serving. Cache static asset headers via
  `public/_headers` (security + immutable cache); keep ISR via the KV cache binding.
- **Live picks** revalidate on a 600s ISR window + `stale-while-revalidate`, and the client
  refetches every 10 min / on focus. So a just-finished match can linger briefly.
- **Meta Pixel IDs are read at BUILD time** and inlined into static HTML. The
  `META_PIXEL_BALKAN_ID` / `META_PIXEL_NORDIC_ID` env vars MUST be set in the Workers **Builds**
  env, or the HTML inlines empty and no pixel fires. (CAPI tokens stay runtime/secret-scoped.)
- **`.next` corruption gotcha:** running two `next dev` servers, or mixing `next build` +
  `next dev` on the same `.next`, yields `__webpack_modules__[…] is not a function` + chunk
  404s. Fix: kill everything, `rm -rf .next`, start one clean dev server.
- **New component during `next dev`** → "Module not found" can persist through Fast Refresh;
  restart the dev server.

---

## 8. Environment variables

- `NEXT_PUBLIC_MIXPANEL_TOKEN` — analytics (only one set in local `.env.local`).
- `META_PIXEL_BALKAN_ID`, `META_PIXEL_NORDIC_ID` — browser pixel IDs (Builds-scoped on Cloudflare).
- `META_PIXEL_*_TOKEN` — Conversions API tokens (runtime/Functions-scoped).
- `BREVO_API_KEY`, `BREVO_LIST_ID` — contact upsert (no-op if unset).
- `ONBOARDING_LINK_SECRET` — HMAC secret shared by the admin link tool, bot,
  onboarding verifier, and local link CLI (runtime secret).

On Cloudflare these become: public/non-secret vars in `wrangler.toml [vars]`, secrets via
`wrangler secret put <NAME>`, and `.dev.vars` for local `next dev` / `wrangler dev` (gitignored).

---

## 9. Conventions & gotchas

- **No em-dashes in visible copy** (user finds them "too AI-ish"). Use commas/colons/periods.
- Keep new dict fields in parity with `Dict`, or EN-only as OPTIONAL.
- Inner CTA links must keep the `.btn` (or `.sticky-cta`) class or the analytics/lead click
  listeners won't fire.
- `read_file` shows the unsaved editor buffer; `next dev`/git see the DISK. If a change "looks
  done" but the app shows old behavior, verify the file is saved before assuming a cache issue.
- Pre-existing harmless build warning: `metadataBase … not set`.

---

## 10. Cloudflare Workers deployment (OpenNext)

Production deploy target via `@opennextjs/cloudflare`. Files:
[wrangler.toml](wrangler.toml), [open-next.config.ts](open-next.config.ts),
[public/_headers](public/_headers); `next.config.mjs` calls `initOpenNextCloudflareForDev()`
for local bindings.

- **Scripts** (package.json): `cf:build` (`opennextjs-cloudflare build`),
  `cf:preview` (build + `wrangler dev`), `cf:deploy` (build + `wrangler deploy`).
  `pnpm build`/`dev`/`start` are local-dev ground truth.
- **wrangler.toml**: `nodejs_compat`, assets binding, `NEXT_INC_CACHE_KV` for ISR cache
  (paste a real id from `wrangler kv namespace create`), R2 placeholder for assets >25 MiB.
  Top-level config IS production (`name = sector1eu`, deploy `wrangler deploy`); `[env.staging]`
  (`sector1-staging`) redefines its own KV+assets since wrangler envs don't inherit bindings.
- **Workers Builds dashboard**: build cmd `npx @opennextjs/cloudflare build`, deploy cmd
  `npx wrangler deploy`, production branch `main`, Worker name must equal `sector1eu`. PR previews
  via "non-production branch builds"; `[skip ci]` in a commit skips a build.
- **Headers**: `public/_headers` carries security + immutable-cache headers; bundled
  into `.open-next/assets/_headers`.
- **next/image**: `images.unoptimized: true` (Workers has no Vercel image optimizer).
- **Bundle**: ~108 kB first-load, under the 3 MiB free limit; i18n + Mixpanel give headroom for
  the $5 plan if needed. `.open-next/` + `.wrangler/` are gitignored.
- Keep `dynamicParams=false` static SSG model. Node pinned via `.nvmrc` (20).
