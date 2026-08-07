// Config for the fake-Telegram landing pages (e.g. /tro).
//
// Each entry renders a replica of the t.me channel preview page — the screen
// you get when you open https://t.me/<slug> in a desktop browser. Structure,
// class names, CSS values and copy are lifted from the real page so the only
// functional difference is the tracked CTA: Meta/TikTok fire a Lead before the
// visitor leaves for Telegram.
//
// `locale` only picks which Meta Pixel(s) load (see lib/meta-pixel.ts).

import type { Locale } from "./i18n/config";

export type TgPreviewChannel = {
  /** t.me destination the button points at. */
  url: string;
  /** Channel display name, incl. any emoji Telegram shows inline. */
  title: string;
  /** Line under the title, e.g. "663 subscribers". */
  members: string;
  /**
   * Description paragraphs. Telegram joins these with a blank line (<br><br>)
   * and clamps the block to 5 rendered lines, so the blank lines count toward
   * the clamp and the third paragraph ends up visibly truncated — same as the
   * real page. Keep the full text here and let the clamp do the cutting.
   */
  description: string[];
  /** Zero-based description line after which the main button is rendered. */
  ctaAfterDescriptionLine?: number;
  /** Main button label. */
  cta: string;
  /** Muted link under the button. */
  subLink: string;
  /** Telegram's own header button label. */
  download: string;
  /** Avatar in /public — the channel's real photo. */
  avatar: string;
  /** Drives Meta Pixel region selection. */
  locale: Locale;
};

export const TG_PREVIEW_CHANNELS: Record<string, TgPreviewChannel> = {
  s1romania: {
    url: "https://t.me/Sector1RomaniaBOT?start=start",
    title: "Sector1 Romania 🇷🇴",
    members: "663 de abonați",
    description: [
      "Bun venit la Sector1 👋",
      "Comunitatea ta de top din Europa pentru analiză sportivă 🌐",
      "Apasă butonul de mai jos ca să te alături 👇🏻",
      "Rezultate reale de la membrii: @s1recenzii",
      "Obține acces VIP pe viață aici 👉 @s1rocky",
    ],
    ctaAfterDescriptionLine: 2,
    cta: "Alătură-te grupului",
    subLink: "Previzualizare canal",
    download: "Descarcă",
    avatar: "/tg/s1romania.jpg",
    locale: "rom",
  },
};

export function getTgPreviewChannel(slug: string): TgPreviewChannel | undefined {
  return TG_PREVIEW_CHANNELS[slug];
}
