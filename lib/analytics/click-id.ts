"use client";

// Persistent per-visitor click_id. This is the join key that ties an on-site
// visitor to the Telegram user they become (via the deep-link `start` param)
// and the customer they eventually pay as. Stored in localStorage so it is
// stable across sessions, and stamped onto every Mixpanel event as a super
// property + onto outbound Telegram links.

const STORAGE_KEY = "s1_click_id";

let cached: string | null = null;

// UUID v4 with hyphens stripped → 32 lowercase hex chars. This keeps the value
// within Telegram's `start` param charset (alphanumeric + underscore, ≤64) so
// it can be passed through unmodified as `start=src_<click_id>`.
function generate(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID().replace(/-/g, "");
    }
  } catch {
    /* fall through */
  }
  return (
    Date.now().toString(16) + Math.random().toString(16).slice(2)
  )
    .replace(/[^a-f0-9]/gi, "")
    .slice(0, 32)
    .padEnd(32, "0");
}

/**
 * Returns the visitor's stable click_id, creating + persisting one on first
 * call. Safe to call from any client code; returns "" during SSR.
 */
export function getClickId(): string {
  if (cached) return cached;
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      cached = existing;
      return existing;
    }
    const fresh = generate();
    window.localStorage.setItem(STORAGE_KEY, fresh);
    cached = fresh;
    return fresh;
  } catch {
    // localStorage unavailable (private mode / blocked): fall back to an
    // in-memory id so the session is still internally joinable.
    if (!cached) cached = generate();
    return cached;
  }
}
