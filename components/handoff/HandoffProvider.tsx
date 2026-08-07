"use client";

/**
 * HandoffProvider
 *
 * Holds the state for the Telegram handoff interstitial: whether it's open,
 * the originating CTA location, and the resolved bot deep link. Mirrors
 * ExitIntentProvider's ESC-to-close + scroll-lock behaviour for consistency.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { track } from "@/lib/analytics/mixpanel";
import { EVENTS } from "@/lib/analytics/events";

type OpenContext = { ctaLocation: string; botUrl: string };

type Ctx = {
  isOpen: boolean;
  ctaLocation: string;
  botUrl: string;
  open: (ctx: OpenContext) => void;
  close: () => void;
};

const HandoffContext = createContext<Ctx | null>(null);

export function useHandoff() {
  const ctx = useContext(HandoffContext);
  if (!ctx)
    throw new Error("useHandoff must be used inside <HandoffProvider>");
  return ctx;
}

export function HandoffProvider({
  children,
  defaultBotUrl = "",
}: {
  children: React.ReactNode;
  defaultBotUrl?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [ctaLocation, setCtaLocation] = useState("other");
  const [botUrl, setBotUrl] = useState(defaultBotUrl);

  const open = useCallback((ctx: OpenContext) => {
    const location = ctx.ctaLocation || "other";
    setCtaLocation(location);
    if (ctx.botUrl) setBotUrl(ctx.botUrl);
    setIsOpen(true);
    track(EVENTS.HANDOFF_MODAL_SHOWN, { cta_location: location });
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // ESC to close + lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  const value = useMemo<Ctx>(
    () => ({ isOpen, ctaLocation, botUrl, open, close }),
    [isOpen, ctaLocation, botUrl, open, close],
  );

  return (
    <HandoffContext.Provider value={value}>{children}</HandoffContext.Provider>
  );
}
