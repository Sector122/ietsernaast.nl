import { type Locale } from "./i18n/config";

// Default / English (INTERNATIONAL) CTA link, and the fallback for any
// unmapped locale.
export const BOT_URL = "https://telegram.me/m/rV_RZOwuOGI8";

// Free VIP group invite link. Used ONLY by the pricing card and exit-intent
// modal CTAs (all locales). Every other CTA keeps its per-locale bot link.
export const FREE_GROUP_URL = "https://t.me/+0gRSMmTvKSFjNjdk";

// Per-locale Telegram CTA links used by buttons (not the footer social icon).
// These are Telegram /m/ message-link slugs. Telegram ignores query params on
// /m/ links, so the click stampers no longer prefill a localized draft or
// attach the invisible attribution token — the Telegram-draft attribution is
// disabled with this scheme (Meta/Mixpanel Lead events on the click still fire).
export const BOT_URLS: Record<Locale, string> = {
  en: BOT_URL, // INTERNATIONAL
  sv: "https://telegram.me/m/Y9Gh0H9mMjRk", // SWEDEN
  tse: "https://t.me/m/nbkOPZRXYmU0", // SWEDEN TSE
  fi: "https://t.me/m/dflzgyo9OWJk", // FINLAND
  sr: "https://t.me/+0xpAtEkLzFUxZTFk", // SERBIA
  hr: "https://telegram.me/m/nPl5VqqANTVk", // CROATIA
  bs: "https://t.me/+BAUHR-bAoAphZjA0", // BOSNIA
  cnr: "https://t.me/+iApKca9Jw8cwM2Nk", // MONTENEGRO
  bg: BOT_URL, // no dedicated link provided → INTERNATIONAL
  sl: "https://telegram.me/m/PaBe5BLqZjRk", // SLOVENIA
  de: BOT_URL, // no dedicated link provided → INTERNATIONAL
  nl: "https://telegram.me/m/JyIjLtczMmE8", // NETHERLANDS
  fr: BOT_URL, // no dedicated link provided → INTERNATIONAL
  lt: "https://telegram.me/m/6hZTFDY8ZTZk", // LITHUANIA
  rom: "https://telegram.me/m/36Iz1KssZGU0", // ROMANIA
  atier: "https://telegram.me/m/yg4oJJ1MMGU0", // ATIER
  bih: "https://t.me/+BAUHR-bAoAphZjA0", // BOSNIA (same link as bs)
  rhr: "https://t.me/m/FK2r_38rY2U0", // CROATIA (rhr — duplicate of hr, new bot link)
  feu: "https://t.me/m/16bEQLimNmVk", // FEU (duplicate of en, new bot link)
  ie: "https://t.me/m/Z0cACm4LZjI8", // IE (duplicate of en, new bot link)
};

export function getBotUrl(locale: Locale): string {
  return BOT_URLS[locale] ?? BOT_URL;
}

// Per-locale WhatsApp CTA links. Only locales present here get the dual
// Telegram + WhatsApp CTA variant; every other locale keeps the single
// Telegram button. Use wa.me links, e.g. "https://wa.me/15551234567" or a
// pre-filled click-to-chat "https://wa.me/15551234567?text=Hi".
export const WHATSAPP_URLS: Partial<Record<Locale, string>> = {
  fi: "https://wa.me/358468037568",
  // de: "https://wa.me/000000000000",
  // fr: "https://wa.me/000000000000",
};

export function getWhatsappUrl(locale: Locale): string | undefined {
  return WHATSAPP_URLS[locale];
}
