"use client";

import { useEffect, useState } from "react";
import { controlVariant } from "./config";
import { getAssignment } from "./assign";

/**
 * Returns the visitor's assigned variant for `key`.
 *
 * SSR and the first client render return the CONTROL (variants[0]) so the
 * server markup matches and hydration stays clean; after mount it resolves to
 * the boot-script assignment. That post-mount swap is invisible for
 * below-the-fold content (e.g. the sticky CTA, which only appears after
 * scrolling). For ABOVE-the-fold tests, prefer the zero-flicker CSS approach
 * keyed on the `html[data-exp-<key>="..."]` attribute the boot script sets
 * before paint (see docs/ab-testing.md).
 */
export function useExperiment(key: string): string {
  const [variant, setVariant] = useState<string>(() => controlVariant(key));

  useEffect(() => {
    if (!key) return;
    setVariant(getAssignment(key));
  }, [key]);

  return variant;
}
