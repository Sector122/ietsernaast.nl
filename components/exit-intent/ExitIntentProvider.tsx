"use client";

/**
 * ExitIntentProvider
 *
 * Detects exit intent with signals that actually fire before the page unmounts.
 * A 20s time-on-page gate applies to every trigger (mobile and desktop) so the
 * popup never appears in the first 20 seconds of a visit. The mobile triggers
 * follow the Exit Intent Mobile Trigger Specification and add a scroll-depth
 * gate on top of the shared time gate.
 *   - mobile primary  : 6s of scroll inactivity after time + scroll gates clear
 *   - mobile secondary: tab hidden (visibilitychange) after time + scroll gates clear
 *   - desktop         : pointer leaves the top edge, but only after the 20s
 *                       time gate has cleared
 *
 * Suppression (one impression per visit + ratcheting cross-session cooldowns)
 * lives in lib/exit-intent/suppression.ts.
 *
 * Why not `beforeunload`?
 *   Browsers do not allow custom DOM/React UI during beforeunload — only the
 *   native "Leave site?" dialog. React unmounts before any popup paints.
 *
 * Usage:
 *   <ExitIntentProvider>
 *     <App />
 *     <ExitIntentModal />   // any consumer using useExitIntent()
 *   </ExitIntentProvider>
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics/mixpanel";
import { EVENTS } from "@/lib/analytics/events";
import { isExitSuppressed, recordExitDismissed } from "@/lib/exit-intent/suppression";

type Ctx = {
  isOpen: boolean;
  open: (trigger?: string) => void;
  close: () => void;
  /** Has the modal been shown once this session? */
  alreadyShown: boolean;
};

const ExitIntentContext = createContext<Ctx | null>(null);

export function useExitIntent() {
  const ctx = useContext(ExitIntentContext);
  if (!ctx) throw new Error("useExitIntent must be used inside <ExitIntentProvider>");
  return ctx;
}

export type ExitIntentOptions = {
  /** sessionStorage key to remember it was shown (one impression per visit) */
  storageKey?: string;
  /** time-on-page hard gate, ms (applies to mobile + desktop; spec: 20s) */
  timeGateMs?: number;
  /** scroll-depth hard gate, percent of page (spec: 30%) */
  scrollGatePct?: number;
  /** scroll-inactivity window before the primary trigger fires, ms (spec: 6s) */
  inactivityMs?: number;
  /** disable on routes you don't want it on */
  disabled?: boolean;
};

export function ExitIntentProvider({
  children,
  storageKey = "sector1_exit_seen_v1",
  timeGateMs = 20000,
  scrollGatePct = 30,
  inactivityMs = 6000,
  disabled = false,
}: { children: React.ReactNode } & ExitIntentOptions) {
  const [isOpen, setOpen] = useState(false);
  const shownRef = useRef(false);

  // Live trigger context, read at show time to stamp the Mixpanel event.
  const sessionStartRef = useRef(0);
  const maxScrollPctRef = useRef(0);

  // Hydrate "already shown" from sessionStorage on mount
  const [alreadyShown, setAlreadyShown] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setAlreadyShown(sessionStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const open = useCallback((trigger: string = "unknown") => {
    if (disabled) return;
    if (shownRef.current) return;
    if (typeof window !== "undefined") {
      // One impression per visit, plus cross-session ratcheting suppression.
      if (sessionStorage.getItem(storageKey) === "1") return;
      if (isExitSuppressed()) return;
    }
    shownRef.current = true;
    try { sessionStorage.setItem(storageKey, "1"); } catch {}
    setAlreadyShown(true);
    setOpen(true);
    const timeOnPageS = sessionStartRef.current
      ? Math.round((Date.now() - sessionStartRef.current) / 1000)
      : undefined;
    track(EVENTS.EXIT_INTENT_SHOWN, {
      cta_location: "exit",
      trigger,
      time_on_page_s: timeOnPageS,
      scroll_depth_pct: maxScrollPctRef.current,
    });
  }, [disabled, storageKey]);

  // Any open→close transition is a dismissal: the CTA click and email submit do
  // not close the modal, so reaching here means the visitor opted out.
  const close = useCallback(() => {
    setOpen((wasOpen) => {
      if (wasOpen) recordExitDismissed();
      return false;
    });
  }, []);

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;

    sessionStartRef.current = Date.now();

    // ---- Hard gates: both must clear before any mobile trigger may fire.
    let timeGatePassed = false;
    let scrollGatePassed = false;

    const docEl = document.documentElement;
    const scrollPct = () => {
      const max = docEl.scrollHeight - window.innerHeight;
      if (max <= 0) return 100; // short pages count as fully scrolled
      return Math.min(100, Math.round((window.scrollY / max) * 100));
    };

    // ---- Mobile primary: 6s of scroll inactivity once both gates are clear.
    // The timeout is re-armed on every scroll ("reset the timer on any scroll")
    // and its callback re-checks the gates, so arming early is a safe no-op.
    let inactivityTimer: number | null = null;
    const clearInactivity = () => {
      if (inactivityTimer != null) {
        window.clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
    };
    const armInactivity = () => {
      clearInactivity();
      inactivityTimer = window.setTimeout(() => {
        if (timeGatePassed && scrollGatePassed) open("inactivity");
      }, inactivityMs);
    };

    // Time gate. Cheap 1s poll, matching the spec's "every second" loop.
    const timeTimer = window.setInterval(() => {
      if (Date.now() - sessionStartRef.current >= timeGateMs) {
        timeGatePassed = true;
        window.clearInterval(timeTimer);
        // Visitor may already be idle past the scroll gate — start counting now.
        if (scrollGatePassed) armInactivity();
      }
    }, 1000);

    const onScroll = () => {
      const pct = scrollPct();
      if (pct > maxScrollPctRef.current) maxScrollPctRef.current = pct;
      if (pct >= scrollGatePct) scrollGatePassed = true;
      armInactivity(); // active scrolling resets the "done reading" countdown
    };

    // ---- Mobile secondary: tab hidden = imminent exit. Still gated.
    const onVisibility = () => {
      if (document.visibilityState !== "hidden") return;
      if (timeGatePassed && scrollGatePassed) open("visibility");
    };

    // ---- Desktop: pointer leaves the top edge, but only after the time gate
    // clears so the popup never fires within the first 20s of the visit.
    // Touch devices synthesize pointerleave/mouseout with clientY <= 0 while
    // scrolling, which previously fired this on mobile within seconds, so the
    // listeners are only registered on real mouse (hover + fine pointer)
    // devices and the pointer handler additionally guards on pointerType.
    const hasMousePointer =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointerLeave = (e: PointerEvent) => {
      if (!timeGatePassed) return;
      if (e.pointerType && e.pointerType !== "mouse") return;
      if (e.clientY <= 0) open("pointer");
    };
    // Fallback for older browsers without pointer events
    const onMouseOut = (e: MouseEvent) => {
      if (!timeGatePassed) return;
      if (e.clientY <= 0 && !e.relatedTarget) open("pointer");
    };

    // Prime scroll state (and start the countdown) in case the visitor is
    // already deep in the page when this mounts.
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (hasMousePointer) {
      docEl.addEventListener("pointerleave", onPointerLeave);
      document.addEventListener("mouseout", onMouseOut);
    }

    return () => {
      window.clearInterval(timeTimer);
      clearInactivity();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (hasMousePointer) {
        docEl.removeEventListener("pointerleave", onPointerLeave);
        document.removeEventListener("mouseout", onMouseOut);
      }
    };
  }, [open, disabled, timeGateMs, scrollGatePct, inactivityMs]);

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Lock scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const value = useMemo<Ctx>(() => ({ isOpen, open, close, alreadyShown }), [isOpen, open, close, alreadyShown]);

  return <ExitIntentContext.Provider value={value}>{children}</ExitIntentContext.Provider>;
}
