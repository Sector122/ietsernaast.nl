"use client";

// Exit-intent suppression state, persisted in localStorage under the s1_exit_*
// prefix (plus the shared s1_converted flag). The popup gets one impression per
// visit and must respect hard, ratcheting cooldowns so a dismisser is never
// nagged. Every read/write is wrapped so a blocked localStorage (private mode)
// degrades gracefully instead of throwing.

const DAY_MS = 86_400_000;

// localStorage keys (spec §3).
const K_DISMISSED = "s1_exit_dismissed"; // timestamp (ms) of last dismissal
const K_DISMISS_COUNT = "s1_exit_dismissed_count"; // integer dismissal count
const K_CAPTURED = "s1_exit_captured"; // "1" once an email is submitted
const K_CONVERTED = "s1_converted"; // "1" once any Telegram CTA is clicked

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode / blocked — suppression simply won't persist */
  }
}

/** Cooldown window (ms) for the Nth dismissal: 1 → 7d, 2 → 14d, ≥3 → 30d. */
function cooldownForCount(count: number): number {
  if (count >= 3) return 30 * DAY_MS;
  if (count === 2) return 14 * DAY_MS;
  return 7 * DAY_MS;
}

/**
 * True when the exit-intent popup must not be shown: a permanent email capture
 * or Telegram conversion, or a dismissal still inside its ratcheted cooldown.
 * SSR-safe (returns true so nothing renders before hydration).
 */
export function isExitSuppressed(): boolean {
  if (typeof window === "undefined") return true;
  if (read(K_CAPTURED) === "1") return true;
  if (read(K_CONVERTED) === "1") return true;

  const ts = Number(read(K_DISMISSED));
  if (!ts || !Number.isFinite(ts)) return false;
  const count = Math.max(1, Number(read(K_DISMISS_COUNT)) || 1);
  return Date.now() - ts < cooldownForCount(count);
}

/** Record a dismissal: bump the ratchet counter and stamp the timestamp. */
export function recordExitDismissed(): void {
  if (typeof window === "undefined") return;
  const count = (Number(read(K_DISMISS_COUNT)) || 0) + 1;
  write(K_DISMISS_COUNT, String(count));
  write(K_DISMISSED, String(Date.now()));
}

/** Permanent suppression after an email capture via the popup. */
export function recordExitCaptured(): void {
  if (typeof window === "undefined") return;
  write(K_CAPTURED, "1");
}

/** Permanent suppression once the visitor clicks any Telegram CTA. */
export function recordExitConverted(): void {
  if (typeof window === "undefined") return;
  write(K_CONVERTED, "1");
}
