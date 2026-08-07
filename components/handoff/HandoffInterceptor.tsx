"use client";

// Single global capture-phase listener that turns on-page CTAs (marked with
// data-handoff) into handoff-modal openers instead of direct Telegram links.
// Server-rendered CTAs stay server components — they only emit the attribute;
// this client listener does the interception, keeping SSR intact.

import { useEffect } from "react";
import { useHandoff } from "./HandoffProvider";
import { ctaLocationFromElement } from "@/lib/analytics/events";

export default function HandoffInterceptor() {
  const { open } = useHandoff();

  useEffect(() => {
    // TEMPORARY: on-page CTAs link directly to Telegram (no handoff popup).
    // Set DIRECT_TO_TELEGRAM to false to restore the modal flow.
    const DIRECT_TO_TELEGRAM = true;

    const onClick = (e: MouseEvent) => {
      if (DIRECT_TO_TELEGRAM) return;
      // Let modified clicks (new tab/window, middle-click) behave natively.
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      const target = e.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-handoff]");
      if (!trigger) return;

      e.preventDefault();
      const botUrl =
        trigger.getAttribute("data-href") ||
        trigger.getAttribute("href") ||
        "";
      open({ ctaLocation: ctaLocationFromElement(trigger), botUrl });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, [open]);

  return null;
}
