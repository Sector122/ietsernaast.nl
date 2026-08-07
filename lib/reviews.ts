import fs from "node:fs";
import path from "node:path";
import type { Locale } from "./i18n/config";

const REVIEWS_DIR = path.join(process.cwd(), "public", "reviews");
const COUNT = 5;
const EXTS = ["jpg", "jpeg", "png", "webp"];

// Returns 5 screenshot paths. For each slot, prefer the locale-specific image
// at /reviews/<locale>/rev<n>.<ext>; if missing, fall back to /reviews/rev<n>.<ext>.
export function getReviewShots(locale: Locale): string[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const n = i + 1;
    for (const ext of EXTS) {
      const localized = path.join(REVIEWS_DIR, locale, `rev${n}.${ext}`);
      if (fs.existsSync(localized)) return `/reviews/${locale}/rev${n}.${ext}`;
    }
    for (const ext of EXTS) {
      const fallback = path.join(REVIEWS_DIR, `rev${n}.${ext}`);
      if (fs.existsSync(fallback)) return `/reviews/rev${n}.${ext}`;
    }
    return `/reviews/rev${n}.jpg`;
  });
}
