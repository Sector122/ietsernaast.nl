"use client";

// Safety net for post-deploy chunk skew. When the browser holds HTML from one
// build but requests a hashed `/_next/static` chunk that only exists in another
// build, the chunk 404s and Next.js throws a ChunkLoadError,
// leaving a blank/broken page. We catch that signal and do a one-time reload so
// the session re-fetches a self-consistent HTML + chunk pair. A short
// sessionStorage guard prevents reload loops if the failure is persistent.

import { useEffect } from "react";

const RELOAD_FLAG = "chunk_reload_ts";
const RELOAD_WINDOW_MS = 10_000;

function isChunkLoadError(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const name = (value as { name?: string }).name ?? "";
  const message = (value as { message?: string }).message ?? "";
  return (
    name === "ChunkLoadError" ||
    /Loading chunk [\w-]+ failed/i.test(message) ||
    /Loading CSS chunk/i.test(message)
  );
}

function isNextStaticUrl(url: string): boolean {
  return /\/_next\/static\//.test(url);
}

export default function ChunkErrorReload() {
  useEffect(() => {
    const recoverOnce = () => {
      let last = 0;
      try {
        last = Number(sessionStorage.getItem(RELOAD_FLAG) ?? "0");
      } catch {
        /* sessionStorage unavailable — fall through and reload once */
      }
      const now = Date.now();
      // Already reloaded very recently: don't loop on a persistent failure.
      if (last && now - last < RELOAD_WINDOW_MS) return;
      try {
        sessionStorage.setItem(RELOAD_FLAG, String(now));
      } catch {
        /* ignore */
      }
      window.location.reload();
    };

    // Capture phase so we also catch resource-load errors on <script>/<link>,
    // which do not bubble.
    const onError = (e: ErrorEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target !== (window as unknown as HTMLElement)) {
        const tag = target.tagName;
        if (tag === "SCRIPT" || tag === "LINK") {
          const url =
            (target as HTMLScriptElement).src ||
            (target as HTMLLinkElement).href ||
            "";
          if (isNextStaticUrl(url)) {
            recoverOnce();
            return;
          }
        }
      }
      if (isChunkLoadError(e.error) || /Loading chunk/i.test(e.message ?? "")) {
        recoverOnce();
      }
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      if (isChunkLoadError(e.reason)) recoverOnce();
    };

    // bfcache (mobile back/forward) can restore a page from a previous deploy
    // whose chunks were since purged. Clear the reload guard on restore so a
    // chunk error on the restored page can recover with a fresh load instead of
    // being suppressed by a stale guard from the earlier view.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        try {
          sessionStorage.removeItem(RELOAD_FLAG);
        } catch {
          /* ignore */
        }
      }
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
