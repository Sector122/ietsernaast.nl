import { type Locale } from "@/lib/i18n/config";

// ────────────────────────────────────────────────────────────────────────────
//  CTA COPY VARIANT — the only file you edit to switch CTA framing.
//
//  "free" → primary CTAs read "Get today's free tips / Join the free group"
//           (the higher-converting framing that was live Jun 8-19).
//  "vip"  → primary CTAs read "Talk to Jakob / Join VIP / Get VIP access"
//           (the framing introduced Jun 22 — the copy we have now).
//
//  Both copies stay in the dictionaries; this only chooses which one renders.
// ────────────────────────────────────────────────────────────────────────────

export type CtaVariant = "free" | "vip";

/** Site-wide default. Flip this single value to switch every locale at once. */
export const DEFAULT_CTA_VARIANT: CtaVariant = "vip";

/**
 * Per-locale overrides. Any locale NOT listed here uses DEFAULT_CTA_VARIANT.
 * Use this to split the test across markets, e.g.:
 *   export const CTA_VARIANT_BY_LOCALE = { en: "free", de: "vip", sr: "vip" };
 */
export const CTA_VARIANT_BY_LOCALE: Partial<Record<Locale, CtaVariant>> = {
  // en: "vip",
};
