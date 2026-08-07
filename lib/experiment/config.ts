import { type Locale } from "@/lib/i18n/config";

// ────────────────────────────────────────────────────────────────────────────
//  A/B TEST REGISTRY — the only file you edit to add / launch / stop a test.
//
//  How it works (host-agnostic, no server-side split testing):
//    • One static build is served from the CDN to everyone. The HTML always
//      contains the CONTROL (variants[0]).
//    • A tiny inline <head> script (lib/experiment/boot-script.ts) assigns each
//      ACTIVE experiment a variant in the browser BEFORE first paint, stamps it
//      on <html data-exp-<key>="..."> and caches it in localStorage ("s1_exp").
//    • Components read the assignment with useExperiment(key) (React) or via the
//      data attribute in CSS. Analytics tags every Mixpanel event with it.
//
//  Assignment is DETERMINISTIC from the visitor's click_id, so it is sticky
//  across visits and reproducible. Nothing here is secret — this config is
//  inlined into public HTML, so do NOT put sensitive data in keys/descriptions.
// ────────────────────────────────────────────────────────────────────────────

export interface ExperimentDef {
  /**
   * Stable identifier. Used as the localStorage field, the `data-exp-<key>`
   * attribute suffix, and the `experiment_<key>` Mixpanel super-property.
   * Keep it lowercase `[a-z0-9_]` and NEVER rename a live key (it breaks
   * stickiness and analytics continuity).
   */
  key: string;

  /** Free-text note for analysis. NOT shipped to the browser. */
  description?: string;

  /**
   * `false` → everyone gets the control, no bucketing, no analytics tagging.
   * Flip to `true` to launch. (QA can still preview an inactive test with
   * `?exp_<key>=<variant>`.)
   */
  active: boolean;

  /**
   * Variant ids. `variants[0]` is the CONTROL: the version baked into the
   * static HTML and shown during SSR / before the boot script runs. Keep ids
   * lowercase `[a-z0-9_]`.
   */
  variants: readonly string[];

  /**
   * Optional traffic split, parallel to `variants` (any positive numbers, they
   * are normalised). Omit for an even split. Example: `[0.9, 0.1]` for a 90/10.
   */
  weights?: readonly number[];

  /**
   * Optional locale allow-list. When set, only these markets are bucketed;
   * every other locale stays on the control. Matches the first path segment
   * (`/` and `/terms` → `en`; `/de` and `/de/terms` → `de`).
   */
  locales?: readonly Locale[];

  /**
   * Optional re-bucket salt. Changing this re-randomises every visitor's
   * assignment without renaming the key (use when restarting a test fresh).
   */
  seed?: string;
}

/**
 * All experiments, active or not. Add an entry to launch a new test; set
 * `active: false` (or delete it) to stop one.
 *
 * No experiments are currently active. The concluded `iab_banner` test was
 * removed after the banner variant won and became permanent behavior.
 */
export const EXPERIMENTS: readonly ExperimentDef[] = [];

/** Look up a single experiment definition by key. */
export function getExperiment(key: string): ExperimentDef | undefined {
  return EXPERIMENTS.find((e) => e.key === key);
}

/** The control variant (variants[0]) for a key, or "control" if unknown. */
export function controlVariant(key: string): string {
  return getExperiment(key)?.variants[0] ?? "control";
}
