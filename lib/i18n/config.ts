export const LOCALES = [
  "en",
  "sv",
  "tse",
  "fi",
  "sr",
  "hr",
  "bs",
  "cnr",
  "bg",
  "sl",
  "de",
  "nl",
  "fr",
  "lt",
  "rom",
  "atier",
  "bih",
  "rhr",
  "feu",
  "ie",
] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Locales that get their own /[locale] route (en is served at "/")
export const ROUTE_LOCALES = LOCALES.filter((l) => l !== "en") as Exclude<
  Locale,
  "en"
>[];

// Standalone landing routes that are not /[locale] pages but still belong to a
// locale for analytics and Telegram-draft purposes. Keyed by first path
// segment, so /tro is attributed to `rom` instead of falling back to `en`.
export const ROUTE_LOCALE_ALIASES: Record<string, Locale> = {
  tro: "rom",
  snl: "nl",
  // "" = the root path "/", now the Iets Ernaast (ietsernaast.nl) homepage.
  "": "nl",
};

/** Locale for a first path segment, following ROUTE_LOCALE_ALIASES. */
export function localeForSegment(segment: string): Locale | undefined {
  if (isLocale(segment)) return segment;
  return ROUTE_LOCALE_ALIASES[segment];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Self-hosted VSL videos, served from the R2 "videos" bucket behind
// https://files.sector1eu.com. Several locales share one video, so locales map
// to a *video key* (VSL_VIDEO_KEYS) and each key lists its media URLs
// (VSL_SOURCES). Paste the real R2 video link into `mp4` as each upload lands;
// an empty mp4 keeps the poster but renders no playable video yet.
export const VSL_MEDIA_BASE =
  process.env.NEXT_PUBLIC_VSL_MEDIA_BASE ?? "https://files.sector1eu.com";

type VslSource = { mp4: string; poster: string; posterSmall: string };

// ?v= busts Cloudflare's edge cache when a poster is re-uploaded — bump it
// whenever poster files change.
const POSTER_VERSION = 2;

const posterPair = (key: string) => ({
  poster: `${VSL_MEDIA_BASE}/vsl/${key}_poster.webp?v=${POSTER_VERSION}`,
  posterSmall: `${VSL_MEDIA_BASE}/vsl/${key}_poster-640.webp?v=${POSTER_VERSION}`,
});

export const VSL_SOURCES: Record<string, VslSource> = {
  en: { mp4: `${VSL_MEDIA_BASE}/en.mp4`, ...posterPair("en") },
  sv: { mp4: `${VSL_MEDIA_BASE}/sweden.mp4`, ...posterPair("sv") },
  fi: { mp4: `${VSL_MEDIA_BASE}/finland.mp4`, ...posterPair("fi") },
  balkan: { mp4: `${VSL_MEDIA_BASE}/balkan.mp4`, ...posterPair("balkan") },
  sl: { mp4: `${VSL_MEDIA_BASE}/slovenia.mp4`, ...posterPair("sl") },
  nl: { mp4: `${VSL_MEDIA_BASE}/nl.mp4`, ...posterPair("nl") },
  fr: { mp4: `${VSL_MEDIA_BASE}/france.mp4`, ...posterPair("fr") },
  lt: { mp4: `${VSL_MEDIA_BASE}/lt.mp4`, ...posterPair("lt") },

  ro: { mp4: `${VSL_MEDIA_BASE}/ro.mp4`, ...posterPair("ro") },
};

export const VSL_VIDEO_KEYS: Record<Locale, string> = {
  en: "en",
  sv: "sv",
  tse: "sv",
  fi: "fi",
  sr: "balkan",
  hr: "balkan",
  bs: "balkan",
  cnr: "balkan",
  bg: "balkan",
  sl: "sl",
  de: "",
  nl: "nl",
  fr: "fr",
  lt: "lt",
  rom: "ro",
  atier: "balkan",
  bih: "balkan",
  rhr: "balkan",
  feu: "en",
  ie: "en",
};

export type VslMedia = {
  /** Analytics id (Mixpanel video_id) — the video key. */
  videoId: string;
  mp4: string;
  poster: string;
  posterSmall: string;
  portrait: boolean;
};

// Locales whose VSL video is portrait (4:5) instead of the default 16:9
// landscape. Drives both the phone frame and the player aspect ratio.
export const VSL_PORTRAIT: Partial<Record<Locale, boolean>> = {};

/** True when a locale's VSL video is portrait (4:5) rather than 16:9. */
export function vslPortraitFor(locale: Locale): boolean {
  return VSL_PORTRAIT[locale] ?? false;
}

/**
 * Resolve the self-hosted VSL media for a locale, falling back to English when
 * a locale has no dedicated video. Returns null when nothing is configured.
 */
export function vslFor(locale: Locale): VslMedia | null {
  const key = VSL_VIDEO_KEYS[locale] || VSL_VIDEO_KEYS.en || "";
  const src = VSL_SOURCES[key];
  if (!src) return null;
  return {
    videoId: key,
    ...src,
    portrait: vslPortraitFor(locale),
  };
}

// HTML lang attribute per locale
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  sv: "sv",
  tse: "sv",
  fi: "fi",
  sr: "sr",
  hr: "hr",
  bs: "bs",
  cnr: "cnr",
  bg: "bg",
  sl: "sl",
  de: "de",
  nl: "nl",
  fr: "fr",
  lt: "lt",
  rom: "ro",
  atier: "hr",
  bih: "hr",
  rhr: "hr",
  feu: "en",
  ie: "en",
};
