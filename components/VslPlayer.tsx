"use client";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics/mixpanel";
import { EVENTS, localeFromPath } from "@/lib/analytics/events";

type Props = {
  /** Analytics id (Mixpanel video_id). */
  videoId: string;
  mp4: string;
  /** Poster, 1280w — also the intended LCP element. */
  poster: string;
  /** Poster, 640w, for small viewports via srcset. */
  posterSmall: string;
  /** Localized unmute pill label. */
  unmuteText?: string;
};

const PROGRESS_MILESTONES = [25, 50, 75, 95] as const;
const MOBILE_QUERY = "(max-width: 768px)";

/** Runs cb once the page has loaded AND the main thread is idle. */
function onIdleAfterLoad(cb: () => void): () => void {
  let cancel: (() => void) | undefined;
  const schedule = () => {
    // requestIdleCallback is missing in Safari; fall back to a short timeout.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(cb, { timeout: 4000 });
      cancel = () => window.cancelIdleCallback(id);
    } else {
      const id = window.setTimeout(cb, 1500);
      cancel = () => clearTimeout(id);
    }
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    cancel?.();
  };
}

const ICONS = {
  play: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    </svg>
  ),
  rewind: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11.5 4.5 8 7.5l3.5 3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7.5h7a5.5 5.5 0 1 1-5.5 5.5" strokeLinecap="round" />
    </svg>
  ),
  soundOff: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="m16.2 9.8 5 5M21.2 9.8l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  soundOn: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),
  fullscreen: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
    </svg>
  ),
};

/**
 * Self-hosted VSL player (replaces the Vidalytics embed).
 *
 * - The poster is a real <img> in the initial HTML with fetchpriority="high",
 *   so it is discovered by the preload scanner and becomes the LCP element.
 * - The <video> element (and its src) only exists after requestIdleCallback
 *   post-load on desktop, or after a tap on mobile — the MP4 never competes
 *   with the critical path, and mobile pages never fetch it at all unless the
 *   visitor asks to play.
 * - Desktop mirrors the old Vidalytics behavior: muted autoplay once loaded,
 *   a compact "click to unmute" pill (deliberately small — it must not hide
 *   the video), and VSL-style controls: play/pause, rewind 10s, mute,
 *   fullscreen. No seek bar, so viewers can't skip ahead.
 * - Emits the same Mixpanel funnel events as the old embed (started, unmuted,
 *   progress milestones, completed) with provider: "r2".
 */
export default function VslPlayer({
  videoId,
  mp4,
  poster,
  posterSmall,
  unmuteText = "Click to unmute",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // "poster" → poster only; "muted" → muted autoplay (desktop idle-load);
  // "sound" → audio unlocked (after tap/unmute).
  const [phase, setPhase] = useState<"poster" | "muted" | "sound">("poster");
  const [playing, setPlaying] = useState(false);
  // Mirrors video.muted once audio is unlocked, so the control-bar mute
  // button can toggle without restarting playback.
  const [ctlMuted, setCtlMuted] = useState(false);
  const analyticsRef = useRef({
    started: false,
    unmuted: false,
    completed: false,
    fired: new Set<number>(),
  });

  const baseProps = () => ({
    locale: localeFromPath(window.location.pathname),
    video_id: videoId,
    provider: "r2",
  });

  // Desktop: attach the video once the page is loaded and idle. Mobile keeps
  // the poster until tapped. No-op while the video hasn't been uploaded yet.
  useEffect(() => {
    if (!mp4 || window.matchMedia(MOBILE_QUERY).matches) return;
    return onIdleAfterLoad(() =>
      setPhase((p) => (p === "poster" ? "muted" : p)),
    );
  }, [mp4]);

  // Drive playback when the phase changes. The video element mounts together
  // with the phase flip, so play from this effect rather than the click.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || phase === "poster") return;
    video.muted = phase === "muted";
    setCtlMuted(video.muted);
    video.play().catch(() => {
      // Autoplay refused (e.g. data-saver): fall back to the poster + tap.
      if (phase === "muted") setPhase("poster");
    });
  }, [phase]);

  const startWithSound = () => {
    if (!mp4) return;
    const a = analyticsRef.current;
    const video = videoRef.current;
    if (video && phase === "muted") {
      // Old embed's unmute behavior (doReplay): restart from 0 with audio.
      video.currentTime = 0;
    }
    if (!a.unmuted) {
      a.unmuted = true;
      track(EVENTS.VIDEO_UNMUTED, baseProps());
    }
    setPhase("sound");
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  };

  const rewind10 = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (phase === "muted") {
      // First unmute goes through the doReplay path, same as the pill.
      startWithSound();
      return;
    }
    video.muted = !video.muted;
    setCtlMuted(video.muted);
  };

  const goFullscreen = () => {
    const wrap = wrapRef.current;
    const video = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (wrap?.requestFullscreen) {
      void wrap.requestFullscreen().catch(() => {});
    } else if (video?.webkitEnterFullscreen) {
      // iPhone Safari: no element fullscreen — use the native video player.
      video.webkitEnterFullscreen();
    }
  };

  const onPlay = () => {
    setPlaying(true);
    const a = analyticsRef.current;
    if (a.started) return;
    a.started = true;
    track(EVENTS.VIDEO_STARTED, baseProps());
  };

  const onEnded = () => {
    const a = analyticsRef.current;
    if (a.completed) return;
    a.completed = true;
    track(EVENTS.VIDEO_COMPLETED, baseProps());
  };

  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !(video.duration > 0)) return;
    const pct = (video.currentTime / video.duration) * 100;
    for (const m of PROGRESS_MILESTONES) {
      if (pct >= m && !analyticsRef.current.fired.has(m)) {
        analyticsRef.current.fired.add(m);
        track(EVENTS.VIDEO_PROGRESS, { ...baseProps(), percent: m });
      }
    }
  };

  return (
    <div className="vsl-player" ref={wrapRef}>
      {phase !== "poster" && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          src={mp4}
          poster={poster}
          playsInline
          preload="auto"
          onPlay={onPlay}
          onPause={() => setPlaying(false)}
          onEnded={onEnded}
          onTimeUpdate={onTimeUpdate}
          onClick={phase === "sound" ? togglePlay : undefined}
        />
      )}
      {phase !== "sound" && (
        <button
          type="button"
          className="vsl-player-cover"
          onClick={startWithSound}
          aria-label={phase === "muted" ? unmuteText : "Play video"}
        >
          {phase === "poster" && (
            <img
              src={posterSmall}
              srcSet={`${posterSmall} 640w, ${poster} 960w`}
              sizes="(max-width: 968px) 100vw, 920px"
              alt=""
              fetchPriority="high"
              decoding="async"
            />
          )}
          {phase === "poster" ? (
            <span className="vsl-player-hint">{ICONS.play}</span>
          ) : (
            <span className="vsl-player-hint vsl-player-hint--unmute">
              {ICONS.soundOff}
              {unmuteText}
            </span>
          )}
        </button>
      )}
      {phase !== "poster" && (
        <div className="vsl-ctl">
          <div className="vsl-ctl-group">
            <button
              type="button"
              className="vsl-ctl-btn"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? ICONS.pause : ICONS.play}
            </button>
            <button
              type="button"
              className="vsl-ctl-btn"
              onClick={rewind10}
              aria-label="Back 10 seconds"
            >
              {ICONS.rewind}
            </button>
            <button
              type="button"
              className="vsl-ctl-btn"
              onClick={toggleMute}
              aria-label={phase === "muted" || ctlMuted ? "Unmute" : "Mute"}
            >
              {phase === "muted" || ctlMuted ? ICONS.soundOff : ICONS.soundOn}
            </button>
          </div>
          <button
            type="button"
            className="vsl-ctl-btn"
            onClick={goFullscreen}
            aria-label="Fullscreen"
          >
            {ICONS.fullscreen}
          </button>
        </div>
      )}
    </div>
  );
}
