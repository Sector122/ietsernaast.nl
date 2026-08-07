import { type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/types";
import {
  type CtaVariant,
  DEFAULT_CTA_VARIANT,
  CTA_VARIANT_BY_LOCALE,
} from "./cta-variant.config";

export { type CtaVariant, DEFAULT_CTA_VARIANT, CTA_VARIANT_BY_LOCALE };

/**
 * Which CTA copy framing a given locale should render.
 *
 *   "free" → lead with "Get today's free tips / Join the free group"
 *            (the higher-converting framing live during Jun 8-19).
 *   "vip"  → lead with "Talk to Jakob / Join VIP" (the Jun 22+ framing).
 *
 * Resolution order: explicit per-locale override → global default.
 * To switch the whole site, change DEFAULT_CTA_VARIANT in cta-variant.config.ts.
 * To split by locale, add entries to CTA_VARIANT_BY_LOCALE there.
 */
export function ctaVariantFor(locale: Locale): CtaVariant {
  return CTA_VARIANT_BY_LOCALE[locale] ?? DEFAULT_CTA_VARIANT;
}

/**
 * Resolved sticky-bar CTA copy for the variant. The "vip" strings are the
 * required `sticky.cta`/`sticky.sub`; the "free" strings prefer the optional
 * `sticky.ctaFree`/`subFree`, falling back to copy already translated in every
 * dict (`hiw.ctaPrimary` = the localized "Join the free group") so a locale
 * flipped to "free" stays localized even before its free strings are authored.
 */
export function resolveStickyCta(
  variant: CtaVariant,
  d: Dict,
): { cta: string; sub: string } {
  if (variant === "vip") return { cta: d.sticky.cta, sub: d.sticky.sub };
  return {
    cta: d.sticky.ctaFree ?? d.hiw.ctaPrimary,
    sub: d.sticky.subFree ?? "",
  };
}

/** Shared sublabel under primary CTAs, per variant. Empty when none authored. */
export function resolveCtaSub(variant: CtaVariant, d: Dict): string {
  return variant === "vip" ? d.cta.sub : d.cta.subFree ?? "";
}
