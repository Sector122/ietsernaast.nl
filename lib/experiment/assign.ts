"use client";

// Client-side READ helpers for experiment assignments. The inline boot script
// (lib/experiment/boot-script.ts) is the single assigner; everything here just
// reads the "s1_exp" localStorage map it writes, validated against the registry.

import { controlVariant, getExperiment } from "./config";

const STORE_KEY = "s1_exp";

function readStore(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/**
 * The variant assigned for `key`, or the control when the visitor was not
 * bucketed (inactive test, locale not targeted, SSR, or a corrupt value).
 */
export function getAssignment(key: string): string {
  const exp = getExperiment(key);
  const v = readStore()[key];
  if (exp && typeof v === "string" && exp.variants.includes(v)) return v;
  return controlVariant(key);
}

/**
 * Every experiment the visitor is currently bucketed into (active assignments
 * plus any `?exp_` QA overrides), as `{ key: variant }`. Used by the analytics
 * layer to register super-properties and fire exposure events.
 */
export function getAssignedExperiments(): Record<string, string> {
  const store = readStore();
  const out: Record<string, string> = {};
  for (const key of Object.keys(store)) {
    const exp = getExperiment(key);
    const v = store[key];
    if (exp && typeof v === "string" && exp.variants.includes(v)) out[key] = v;
  }
  return out;
}
