"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackTikTok } from "@/lib/analytics/tiktok";
import { ROUTE_LOCALES } from "@/lib/i18n/config";

const HOME_PATHS = new Set(["/", ...ROUTE_LOCALES.map((locale) => `/${locale}`)]);

export default function TikTokPageTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;

    if (!HOME_PATHS.has(pathname)) return;

    const locale = pathname === "/" ? "en" : pathname.slice(1);
    trackTikTok("ViewContent", {
      contents: [
        {
          content_id: `sector1_home_${locale}`,
          content_type: "product",
          content_name: `Sector1 betting tips (${locale})`,
        },
      ],
    });
  }, [pathname]);

  return null;
}
