import { isTelegramHref } from "@/lib/analytics/events";

// Best-effort conversion of a Telegram deep link to a web.telegram.org URL for
// users without the app installed. Username links (t.me/<name>) map to the web
// client; private message links (t.me/m/<hash>) have no web-client form, so we
// fall back to the original t.me URL, which is still browser-openable.
export function webTelegramUrl(href: string): string {
  if (!isTelegramHref(href)) return href;
  try {
    const url = new URL(href);
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length === 1 && segments[0] !== "m") {
      // The web.telegram.org/k client ignores query params, so converting a
      // link that carries a `text` draft (which holds the attribution token)
      // would silently drop it. Keep the t.me link in that case — it still
      // opens in-browser and preserves the token.
      if (url.searchParams.has("text")) return href;
      return `https://web.telegram.org/k/#@${segments[0]}`;
    }
    return href;
  } catch {
    return href;
  }
}
