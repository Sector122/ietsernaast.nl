# A/B testing

Host-agnostic A/B testing for the Sector1 site. It does **not** use any
server-side split testing (the kind that serves two separately built deploys and
causes chunk-hash skew plus a CDN/compute blowup). Instead there is **one static
build**, and variants are assigned **in the browser** before first paint.

---

## How it works

```
Visitor hits CDN-cached static HTML (always contains the CONTROL)
        │
        ▼
Inline <head> boot script (lib/experiment/boot-script.ts)
  • ensures a click_id (same one analytics uses)
  • deterministically buckets each ACTIVE experiment from hash(click_id + key)
  • writes <html data-exp-<key>="<variant>"> + localStorage "s1_exp"
        │
        ▼
React reads the assignment:
  • useExperiment(key)  → for conditional rendering (below-the-fold)
  • CSS html[data-exp-<key>="..."] → for zero-flicker swaps (above-the-fold)
        │
        ▼
AnalyticsProvider registers experiment_<key> super-props + fires
$experiment_started, so every Mixpanel event carries the variant.
```

Assignment is **deterministic** from the visitor's `click_id`, so it is sticky
across visits and reproducible. The build stays 100% static (`○`/`●`); no
serverless function, no `Vary` on the variant, no `no-store`. Because assignment
is client-side, this works identically on Cloudflare, Vercel, or plain static
hosting.

### Files

| File | Role |
| --- | --- |
| [lib/experiment/config.ts](../lib/experiment/config.ts) | **The only file you edit** to add / launch / stop a test. |
| [lib/experiment/boot-script.ts](../lib/experiment/boot-script.ts) | Generates the inline assigner script (the single source of bucketing). |
| [lib/experiment/assign.ts](../lib/experiment/assign.ts) | Client read helpers (`getAssignment`, `getAssignedExperiments`). |
| [lib/experiment/useExperiment.ts](../lib/experiment/useExperiment.ts) | React hook to read a variant. |
| [app/layout.tsx](../app/layout.tsx) | Renders the boot script (covers every route). |
| [components/analytics/AnalyticsProvider.tsx](../components/analytics/AnalyticsProvider.tsx) | Tags events + fires the exposure event. |

---

## Add a new experiment

Add one entry to `EXPERIMENTS` in [lib/experiment/config.ts](../lib/experiment/config.ts):

```ts
{
  key: "hero_headline",          // [a-z0-9_]; never rename a live key
  description: "Hero H1 wording test",
  active: true,                  // false = everyone gets control
  variants: ["control", "punchy"], // variants[0] is the control baked into HTML
  weights: [0.5, 0.5],           // optional; omit for an even split
  locales: ["en", "de"],         // optional; omit to target all markets
  seed: "",                      // optional; bump to re-randomise everyone
}
```

That is the whole launch step. The boot script picks it up automatically and
analytics starts tagging `experiment_hero_headline` on every event.

To **stop** a test, set `active: false` (or delete the entry). Everyone reverts
to the control with no other code change.

---

## Consume a variant in a component

### Option A: React hook (best for below-the-fold)

The hook returns the **control** during SSR and the first client render (so
hydration is clean), then resolves to the assignment after mount. The post-mount
swap is invisible for content the user has not scrolled to yet.

```tsx
"use client";
import { useExperiment } from "@/lib/experiment/useExperiment";

const variant = useExperiment("hero_headline");
return <h1>{variant === "punchy" ? "Beat the bookies" : t.h1}</h1>;
```

### Option B: CSS data attribute (zero flicker, best for above-the-fold)

The boot script sets `html[data-exp-<key>="..."]` **before paint**, so render
both versions and let CSS pick. No hydration concern, no flash.

### Option B: render both + CSS (zero flicker, best for above-the-fold)

The boot script sets `html[data-exp-<key>="..."]` **before paint**, so render
every variant with [components/experiment/VariantSwap.tsx](../components/experiment/VariantSwap.tsx)
and let CSS reveal the assigned one. No hydration swap, no flash. Works in server
**and** client components (it has no hooks).

```tsx
<a className="btn btn-primary">
  <VariantSwap
    experiment="hero_headline"
    variants={{ control: t.h1, punchy: "Beat the bookies" }}
  />
</a>
```

Add one CSS block per experiment in [app/globals.css](../app/globals.css) (the
control shows by default; the attribute reveals the rest):

```css
.exp-variant[data-exp-key="hero_headline"][data-exp-variant="control"]{display:inline}
html[data-exp-hero_headline="punchy"] .exp-variant[data-exp-key="hero_headline"][data-exp-variant="control"]{display:none}
html[data-exp-hero_headline="punchy"] .exp-variant[data-exp-key="hero_headline"][data-exp-variant="punchy"]{display:inline}
```

Click tracking stays clean: `labelFromElement` reads `innerText`, so the hidden
variant copy is not recorded.

---

## Past test: `iab_banner` (banner won)

The test compared showing nothing (`control`, A, 70%) with a top banner
(`banner`, B, 30%) telling visitors inside a social **in-app browser**
(Instagram / Facebook / TikTok webview) to reopen the page in their system
browser, where the Telegram handoff and the rest of the funnel work.

**Result: the `banner` variant won.** It is now permanent behavior and the
experiment has been removed from the registry. The banner
([components/IabBanner.tsx](../components/IabBanner.tsx)) renders for every
visitor detected inside an IAB ([lib/detect-iab.ts](../lib/detect-iab.ts)),
while preserving its appearance delay and session dismissal behavior.

Analytics continues to set `is_iab`, `iab_platform`, and `iab_os`, and tracks
`IAB Banner Shown` plus `IAB Banner Dismissed`. New events are no longer tagged
with `experiment_iab_banner`.

> Test on **real devices** — emulators do not reproduce IAB UA strings reliably.

---

## Past test: `cta_copy` (concluded, `free` won)

The first live test compared the **primary CTA wording**: the free framing
("Get today's free tips") vs the vip framing ("Talk to Jakob"), with the button
structure held constant so the test isolated the copy. It ran 50/50 across the
hero, VSL, sticky, How-it-works, and final CTAs.

**Result: the `free` framing won.** It is now the permanent default baked into
the UI, and the experiment has been removed from the registry (the variant swaps
were collapsed back to the winning copy).

No experiment is currently running. `EXPERIMENTS` in
[lib/experiment/config.ts](../lib/experiment/config.ts) is empty and ready for
the next test (follow "Add a new experiment" above).

---

## Analytics

When a visitor is bucketed into any active experiment,
[components/analytics/AnalyticsProvider.tsx](../components/analytics/AnalyticsProvider.tsx):

1. **Registers super-properties** `experiment_<key>: <variant>` so every Mixpanel
   event (Page Viewed, CTA Clicked, Lead, Telegram Handoff, ...) carries the
   assignment. Segment any funnel by these.
2. **Fires `$experiment_started`** once per page load with `Experiment name` and
   `Variant name`, which powers Mixpanel's native Experiments report.

Conversion is measured by your existing events (`CTA Clicked`, `Lead`,
`Telegram Handoff`) split by the super-property. The framework provides
assignment + exposure; **statistical significance is not computed here** (use
Mixpanel Insights + a significance calculator, or adopt GrowthBook/PostHog if you
want built-in stats).

---

## QA / preview

Force any variant (even of an **inactive** test) with a query param:

```
https://sector1.eu/?exp_cta_copy=vip
https://sector1.eu/de?exp_cta_copy=free
```

The override persists for that browser (written to `s1_exp`) until you load a
different value or clear storage. Overridden experiments also report to Mixpanel,
so you can confirm tracking end to end. Do not share `?exp_` links with real
traffic.

---

## Things to know (and verify per test)

- **Client-side = control is what crawlers see.** The served HTML, "view source",
  and Googlebot always get the control. Correct for A/B tests (do not index
  variants); but do **not** use this to test server-rendered `<title>`/metadata.
- **Flicker.** Above-the-fold tests need the CSS approach (Option B) or they flash
  control before swapping. Below-the-fold is safe with the hook.
- **Stickiness.** Assignment follows `click_id` in localStorage. Cleared storage,
  a different browser, or incognito re-buckets. There is no cross-device identity
  (no login), which is fine for top-of-funnel marketing tests.
- **Locale targeting** matches the first path segment (`/` and `/terms` -> `en`;
  `/de` -> `de`). It is evaluated on full page loads; cross-locale client-side
  navigation does not re-run the boot script (rare here, there is no language
  switcher).
- **Do not rename a live `key`.** It breaks stickiness and splits the analytics.
  Use `seed` to re-randomise instead.
- **Config is public.** The active registry is inlined into HTML. No secrets in
  keys or variant ids (descriptions stay server-side).
- **Do not re-add** a `no-store` cache header or a `Vary` on the variant for
  this. The whole point is that assignment is client-side, so the single static
  HTML stays edge-cached for everyone.
