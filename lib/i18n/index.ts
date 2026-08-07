import type { Dict } from "./types";
import type { Locale } from "./config";
import en from "./dict/en";
import sv from "./dict/sv";
import fi from "./dict/fi";
import sr from "./dict/sr";
import hr from "./dict/hr";
import bs from "./dict/bs";
import bih from "./dict/bih";
import bg from "./dict/bg";
import sl from "./dict/sl";
import de from "./dict/de";
import nl from "./dict/nl";
import fr from "./dict/fr";
import lt from "./dict/lt";
import ro from "./dict/ro";

const cnr: Dict = {
  ...bs,
  vsl: { ...bs.vsl, ctaVip: "Pridruži se mojoj besplatnoj grupi" },
  hero: { ...bs.hero, ctaVip: "Pridruži se mojoj besplatnoj grupi" },
  finalCta: { ...bs.finalCta, cta: "Pridruži se mojoj besplatnoj grupi" },
};

const dicts: Record<Locale, Dict> = { en, sv, tse: sv, fi, sr, hr, bs, cnr, bg, sl, de, nl, fr, lt, rom: ro, atier: hr, bih, rhr: hr, feu: en, ie: en };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

export type { Dict } from "./types";
export type { Locale } from "./config";
export { LOCALES, DEFAULT_LOCALE, ROUTE_LOCALES, VSL_MEDIA_BASE, vslFor, vslPortraitFor, HTML_LANG, isLocale, localeForSegment } from "./config";
export type { VslMedia } from "./config";
