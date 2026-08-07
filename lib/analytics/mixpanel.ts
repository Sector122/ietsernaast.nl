"use client";

// Guarded, lazy singleton wrapper around mixpanel-browser. The SDK (~120KB
// gzipped — the single biggest chunk in the app) is deliberately NOT in the
// critical bundle: it is dynamic-imported once the page has loaded and the
// main thread is idle, so it never competes with the LCP image for bandwidth
// or with hydration for CPU. Calls made before the SDK lands are queued in
// order and flushed after init, so no events are lost and register() still
// precedes the track() calls that rely on it.
//
// Every export is a silent no-op when there is no token, we are not in a
// browser, or the SDK throws, so analytics can never break the page or
// interfere with the Meta Pixel layer.
// NEXT_PUBLIC_MIXPANEL_TOKEN is write-only ingestion, not a secret.

export type AnalyticsProps = Record<string, unknown>;

type Mixpanel = (typeof import("mixpanel-browser"))["default"];

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const API_HOST =
  process.env.NEXT_PUBLIC_MIXPANEL_API_HOST ?? "https://api-eu.mixpanel.com";
const DEBUG =
  process.env.NEXT_PUBLIC_MIXPANEL_DEBUG === "1" ||
  process.env.NEXT_PUBLIC_MIXPANEL_DEBUG === "true";

// Session Replay sampling, 0–100. Defaults to 20 (record ~1 in 5 sessions) to
// keep replay's main-thread/network cost off most page loads. This is ONLY the
// replay sample rate — event tracking (track/identify/people/etc.) always runs
// at 100% regardless of this value. Runtime override:
// NEXT_PUBLIC_MIXPANEL_SESSION_REPLAY_PERCENT (0 disables replay, 100 records all).
function sessionReplayPercent(): number {
  const raw = process.env.NEXT_PUBLIC_MIXPANEL_SESSION_REPLAY_PERCENT;
  if (raw === undefined || raw === "") return 20;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

let started = false;
let enabled = false;
let mp: Mixpanel | null = null;

// FIFO of calls made before the SDK chunk loaded. Bounded so a pathological
// page (e.g. a timeupdate loop) can't grow it without limit.
type QueuedCall =
  | { m: "track"; event: string; props?: AnalyticsProps }
  | { m: "register" | "register_once" | "people_set" | "people_set_once"; props: AnalyticsProps };
const queue: QueuedCall[] = [];
const QUEUE_MAX = 200;

/**
 * True for any localhost / loopback host so analytics never records on local
 * dev or testing. Covers "localhost" (and subdomains like app.localhost),
 * 127.0.0.0/8, the IPv6 loopback ::1, and 0.0.0.0.
 */
function isLocalHost(): boolean {
  if (typeof window === "undefined") return false;
  // Strip any IPv6 brackets so "[::1]" compares as "::1".
  const host = window.location.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "::1" ||
    host === "0.0.0.0" ||
    /^127(?:\.\d{1,3}){3}$/.test(host)
  );
}

function apply(call: QueuedCall): void {
  if (!mp) return;
  try {
    if (call.m === "track") mp.track(call.event, call.props);
    else if (call.m === "register") mp.register(call.props);
    else if (call.m === "register_once") mp.register_once(call.props);
    else if (call.m === "people_set") mp.people.set(call.props);
    else mp.people.set_once(call.props);
  } catch {
    /* no-op */
  }
}

function enqueueOrApply(call: QueuedCall): void {
  if (!enabled) return;
  if (mp) apply(call);
  else if (queue.length < QUEUE_MAX) queue.push(call);
}

async function loadSdk(): Promise<void> {
  try {
    const sdk = (await import("mixpanel-browser")).default;
    sdk.init(TOKEN as string, {
      api_host: API_HOST,
      debug: DEBUG,
      persistence: "localStorage",
      // We fire Page Viewed manually (load + SPA nav), so disable the SDK's.
      track_pageview: false,
      // Curated manual taxonomy — autocapture stays off for now.
      autocapture: false,
      // Session Replay. Masking defaults are privacy-first: all text and user
      // input are masked unless explicitly unmasked, so no PII is recorded.
      record_sessions_percent: sessionReplayPercent(),
      record_mask_text_selector: "*",
      record_block_selector: "img,video",
    });
    mp = sdk;
    for (const call of queue.splice(0)) apply(call);
  } catch {
    // Chunk failed to load or init threw: analytics stays off, queue drains
    // nowhere. The page keeps working.
    enabled = false;
    queue.length = 0;
  }
}

/** Loads the SDK once the page has loaded AND the main thread is idle. */
function scheduleSdkLoad(): void {
  const idle = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => void loadSdk(), { timeout: 4000 });
    } else {
      window.setTimeout(() => void loadSdk(), 1500);
    }
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

/**
 * True once analytics is enabled for this page (token present, real browser,
 * not localhost). The SDK itself may still be loading — calls are queued and
 * flushed, so callers can treat "enabled" as "will be delivered".
 */
export function analyticsReady(): boolean {
  return enabled;
}

/**
 * Enable analytics exactly once and schedule the lazy SDK load. Safe to call
 * repeatedly and from StrictMode double-invocations. Returns whether analytics
 * is live (in the queued-delivery sense above).
 */
export function initAnalytics(): boolean {
  if (started) return enabled;
  started = true;

  if (typeof window === "undefined" || !TOKEN) return false;

  // Never track local dev/testing: skip init on any localhost/loopback host.
  if (isLocalHost()) return false;

  enabled = true;
  scheduleSdkLoad();
  return true;
}

export function track(event: string, props?: AnalyticsProps): void {
  enqueueOrApply({ m: "track", event, props });
}

/** Set super properties attached to every subsequent event. */
export function register(props: AnalyticsProps): void {
  enqueueOrApply({ m: "register", props });
}

/** Set super properties only if not already present (first-touch). */
export function registerOnce(props: AnalyticsProps): void {
  enqueueOrApply({ m: "register_once", props });
}

export function peopleSet(props: AnalyticsProps): void {
  enqueueOrApply({ m: "people_set", props });
}

/** Set people properties only if not already present (first-touch). */
export function peopleSetOnce(props: AnalyticsProps): void {
  enqueueOrApply({ m: "people_set_once", props });
}
