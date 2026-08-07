import type { Locale } from "@/lib/i18n";

// Visible prefilled Telegram message per locale (the `?text=` draft on
// t.me/<username> CTA links). Deliberately outside the i18n dicts: the click
// stampers (InteractionTracker, HandoffModal) are client components and this
// map is the only copy they need — importing the full dicts there would drag
// every page string into the client bundle.
//
// The invisible attribution payload (lib/analytics/tg-payload.ts) is appended
// to this text at click time, so keep drafts to a single line and end them
// with the gift emoji, not punctuation a user is tempted to edit around.
const TG_DRAFTS: Record<Locale, string> = {
  en: "Hey Jakob, i want to join FREE VIP! ⚽️",
  sv: "Hej! Jag vill hämta min gratismånad 🎁",
  tse: "Hej! Jag vill hämta min gratismånad 🎁",
  fi: "Hei! Haluan lunastaa ilmaisen kuukauteni 🎁",
  sr: "Zdravo! Želim da iskoristim svoj besplatan mesec 🎁",
  hr: "Bok! Želim iskoristiti svoj besplatni mjesec 🎁",
  bs: "Zdravo! Želim iskoristiti svoj besplatni mjesec 🎁",
  cnr: "Zdravo! Želim da iskoristim svoj besplatni mjesec 🎁",
  bg: "Здравей! Искам да използвам безплатния си месец 🎁",
  sl: "Živjo! Želim izkoristiti svoj brezplačni mesec 🎁",
  de: "Hallo! Ich möchte meinen Gratismonat einlösen 🎁",
  nl: "Hoi! Ik wil mijn gratis maand claimen 🎁",
  fr: "Salut ! Je veux profiter de mon mois gratuit 🎁",
  lt: "Sveiki! Noriu pasinaudoti savo nemokamu mėnesiu 🎁",
  rom: "Salut! Vreau să îmi folosesc luna gratuită 🎁",
  atier: "Bok! Želim iskoristiti svoj besplatni mjesec 🎁",
  bih: "Bok! Želim iskoristiti svoj besplatni mjesec 🎁",
  rhr: "Bok! Želim iskoristiti svoj besplatni mjesec 🎁",
  feu: "Hey Jakob, i want to join FREE VIP! ⚽️",
  ie: "Hey Jakob, i want to join FREE VIP! ⚽️",
};

export function tgDraftFor(locale: Locale): string {
  return TG_DRAFTS[locale] ?? TG_DRAFTS.en;
}
