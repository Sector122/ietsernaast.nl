import { type Locale } from "@/lib/i18n/config";

// ────────────────────────────────────────────────────────────────────────────
//  PRICING SECTION VISIBILITY — the only file you edit to choose which
//  domains/locales show the "Free for life" pricing block at the bottom of the
//  homepage.
//
//  Default is INACTIVE: the section is hidden on every domain unless that
//  locale is explicitly switched on below.
// ────────────────────────────────────────────────────────────────────────────

/** Site-wide default. Section is hidden everywhere unless overridden below. */
export const DEFAULT_PRICING_ACTIVE = false;

/**
 * Per-locale (per-domain) overrides. Any locale NOT listed here uses
 * DEFAULT_PRICING_ACTIVE. Set a locale to `true` to show the pricing section on
 * that domain, or `false` to force it hidden, e.g.:
 *   export const PRICING_ACTIVE_BY_LOCALE = { de: true, sr: true };
 */
export const PRICING_ACTIVE_BY_LOCALE: Partial<Record<Locale, boolean>> = {
  // de: true,
};

/**
 * Whether the "Free for life" pricing section should render for a given locale.
 * Resolution order: explicit per-locale override → global default (inactive).
 */
export function pricingActiveFor(locale: Locale): boolean {
  return PRICING_ACTIVE_BY_LOCALE[locale] ?? DEFAULT_PRICING_ACTIVE;
}
