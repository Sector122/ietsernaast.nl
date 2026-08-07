"use client";

import { useEffect, useState } from "react";

type StorePlatform = "android" | "ios" | "desktop";

const APP_STORE_URL = "https://apps.apple.com/app/telegram-messenger/id686449807";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=org.telegram.messenger";

function detectStorePlatform(): StorePlatform {
  const userAgent = navigator.userAgent;

  if (/android/i.test(userAgent)) return "android";
  if (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  ) {
    return "ios";
  }

  return "desktop";
}

export default function TelegramStoreBadges() {
  const [platform, setPlatform] = useState<StorePlatform | null>(null);

  useEffect(() => {
    setPlatform(detectStorePlatform());
  }, []);

  const showAppStore = platform === "ios" || platform === "desktop";
  const showPlayStore = platform === "android" || platform === "desktop";

  return (
    <div
      className="telegram-store-download"
      data-ready={platform ? "true" : "false"}
    >
      <p className="telegram-store-label">Download Telegram</p>
      <div className="telegram-store-badges" aria-label="Download Telegram">
        {showPlayStore && (
          <a
            className="telegram-store-badge telegram-store-badge--play"
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener"
            aria-label="Download Telegram from Google Play"
          >
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              width="646"
              height="250"
              loading="lazy"
            />
          </a>
        )}
        {showAppStore && (
          <a
            className="telegram-store-badge telegram-store-badge--apple"
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener"
            aria-label="Download Telegram from the App Store"
          >
            <img
              src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
              alt="Download on the App Store"
              width="250"
              height="83"
              loading="lazy"
            />
          </a>
        )}
      </div>
    </div>
  );
}