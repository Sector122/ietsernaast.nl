// In-app-browser (IAB) detection from the User-Agent string.
//
// Social apps (Instagram, Facebook/Messenger, TikTok) open external links in an
// embedded webview instead of the system browser. Those webviews break parts of
// the funnel — Telegram deep links, "open app" handoffs, some cookies/storage —
// so we detect them and nudge the visitor to reopen the page in a real browser.
//
// CAVEAT: UA strings are NOT contractual; Meta/TikTok update them periodically.
// Test against REAL devices, not emulated UAs.

export type IabPlatform = "instagram" | "facebook" | "tiktok";
export type IabOs = "ios" | "android";

export interface IabInfo {
  platform: IabPlatform;
  /** null when the OS could not be determined from the UA. */
  os: IabOs | null;
}

// Meta family: Instagram tags its webview "Instagram"; Facebook & Messenger use
// FBAN / FBAV / FB_IAB.
const INSTAGRAM_IAB = /Instagram/i;
const FACEBOOK_IAB = /FBAN|FBAV|FB_IAB/i;
// TikTok: "musical_ly" (legacy) and "TikTok"; some builds expose a Bytedance
// webview tag instead.
const TIKTOK_IAB = /musical_ly|TikTok|BytedanceWebview|trill/i;

function osFromUa(ua: string): IabOs | null {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return null;
}

/**
 * Returns the in-app browser the visitor is inside, or null for a normal system
 * browser. Pass a UA string for tests; defaults to `navigator.userAgent` and
 * returns null during SSR (no navigator).
 */
export function detectIab(ua?: string): IabInfo | null {
  const s = ua ?? (typeof navigator !== "undefined" ? navigator.userAgent : "");
  if (!s) return null;

  // Instagram first: its UA can also carry FBAV on some builds, but we want to
  // attribute the visit to Instagram.
  let platform: IabPlatform | null = null;
  if (INSTAGRAM_IAB.test(s)) platform = "instagram";
  else if (FACEBOOK_IAB.test(s)) platform = "facebook";
  else if (TIKTOK_IAB.test(s)) platform = "tiktok";
  if (!platform) return null;

  return { platform, os: osFromUa(s) };
}

export type IabAction = "safari" | "chrome" | "browser";

/**
 * Which "open in …" instruction fits a platform/OS combo, mirroring each app's
 * native overflow menu:
 *   • iOS Instagram / Facebook → Safari
 *   • Android Instagram        → Chrome
 *   • TikTok (either OS) + any unknown OS → generic "browser"
 */
export function iabAction(info: IabInfo): IabAction {
  const { platform, os } = info;
  if (os === "ios") return platform === "tiktok" ? "browser" : "safari";
  if (os === "android") return platform === "instagram" ? "chrome" : "browser";
  return "browser";
}
