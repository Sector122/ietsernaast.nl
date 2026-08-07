"use client";

import { useEffect, useState } from "react";
import type { Pick } from "./types";

export type PicksState = {
  picks: Pick[];
  isLoading: boolean;
  error: boolean;
};

/**
 * Shared picks store.
 *
 * Every component that calls `usePicks()` subscribes to a single module-level
 * store, so the page makes exactly ONE request to /api/picks/today regardless
 * of how many tickers/cards are mounted. The data is revalidated every 10
 * minutes and on window focus / reconnect.
 */

const REVALIDATE_MS = 600_000; // 10 minutes

let state: PicksState = { picks: [], isLoading: true, error: false };
const listeners = new Set<() => void>();
let started = false;
let lastFetched = 0;
let inflight: Promise<void> | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function setState(next: Partial<PicksState>) {
  state = { ...state, ...next };
  emit();
}

function fetchPicks(): Promise<void> {
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const res = await fetch("/api/picks/today", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: unknown = await res.json();
      const picks = Array.isArray(data) ? (data as Pick[]) : [];
      lastFetched = Date.now();
      setState({ picks, isLoading: false, error: false });
    } catch {
      // Keep any previously loaded picks; only flag an error when we have nothing.
      setState({ isLoading: false, error: state.picks.length === 0 });
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

function maybeRevalidate() {
  if (Date.now() - lastFetched >= REVALIDATE_MS) fetchPicks();
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  fetchPicks();
  window.addEventListener("focus", maybeRevalidate);
  window.addEventListener("online", () => fetchPicks());
  window.setInterval(maybeRevalidate, REVALIDATE_MS);
}

export function usePicks(): PicksState {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1);
    listeners.add(listener);
    start();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
}
