import type { Locale } from "@/lib/i18n";
import type { LegalDocs } from "./types";
import en from "./en";
import sv from "./sv";
import fi from "./fi";
import sr from "./sr";
import hr from "./hr";
import bg from "./bg";
import sl from "./sl";
import de from "./de";
import nl from "./nl";
import fr from "./fr";
import lt from "./lt";
import ro from "./ro";

// tse reuses Swedish, bs/cnr reuse Serbian, atier/bih/rhr reuse Croatian, and
// feu/ie (EN duplicates under a different Telegram link) reuse English.
const docs: Record<Locale, LegalDocs> = {
  en,
  sv,
  tse: sv,
  fi,
  sr,
  hr,
  bs: sr,
  cnr: sr,
  bg,
  sl,
  de,
  nl,
  fr,
  lt,
  rom: ro,
  atier: hr,
  bih: hr,
  rhr: hr,
  feu: en,
  ie: en,
};

export function getLegal(locale: Locale): LegalDocs {
  return docs[locale];
}

export type { LegalDoc, LegalDocs, LegalBlock, LegalSpan } from "./types";
