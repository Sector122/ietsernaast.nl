// Region → Meta Pixel routing. Single source of truth shared by edge fn,
// browser pixel bootstrap, and Conversions API route.
//
// Region assignment by locale:
//   - "nordic"  → sv, tse, fi
//   - "balkan"  → sr, hr, bg, sl
//   - "both"    → en, de, nl   (fires both pixels)

export type Region = "balkan" | "nordic";

export const REGIONS_BY_LOCALE: Record<string, Region[]> = {
  en: ["balkan", "nordic"],
  sv: ["nordic"],
  tse: ["nordic"],
  fi: ["nordic"],
  sr: ["balkan"],
  hr: ["balkan"],
  bs: ["balkan"],
  cnr: ["balkan"],
  bg: ["balkan"],
  sl: ["balkan"],
  de: ["balkan", "nordic"],
  nl: ["balkan", "nordic"],
  fr: ["balkan", "nordic"],
  lt: ["balkan", "nordic"],
  rom: ["balkan"],
  atier: ["balkan"],
  bih: ["balkan"],
  rhr: ["balkan"],
  feu: ["balkan", "nordic"],
  ie: ["balkan", "nordic"],
};

export function regionsForLocale(locale: string): Region[] {
  return REGIONS_BY_LOCALE[locale] ?? REGIONS_BY_LOCALE.en;
}
