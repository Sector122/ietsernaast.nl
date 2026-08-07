import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import BrandMark from "@/components/BrandMark";
import Orbs from "@/components/Orbs";
import MetaPixel from "@/components/analytics/MetaPixel";

// /snl — Sector1 Calvin, standalone NL bio-link landing page.
const TELEGRAM_URL = "https://t.me/m/SNOBa04MYTg0";
const AVATAR_SRC = "/snl/calvin.jpg";
// Falls back to a letter avatar until the real photo is dropped into
// public/snl/calvin.jpg — no code change needed once it lands.
const hasAvatar = existsSync(path.join(process.cwd(), "public", "snl", "calvin.jpg"));

export const metadata: Metadata = {
  title: "Sector1 Calvin",
  description: "Doe mee met Calvin's gratis sportcommunity op Telegram.",
  robots: { index: true, follow: true },
};

const CSS = `
.snl-page{min-height:100dvh;position:relative;display:flex;flex-direction:column;overflow:hidden}
.snl-header{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px}
.snl-brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.06em;font-size:15px}
.snl-brand-num{color:var(--orange)}
.snl-header .btn-primary{padding:9px 16px;font-size:13.5px}
.snl-main{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:32px 24px 72px;text-align:center}
.snl-avatar-ring{width:132px;height:132px;border-radius:50%;padding:4px;background:linear-gradient(180deg,var(--orange-2),var(--orange));box-shadow:var(--shadow-orange)}
.snl-avatar{width:100%;height:100%;border-radius:50%;overflow:hidden;background:var(--bg-3);display:flex;align-items:center;justify-content:center;border:3px solid var(--bg)}
.snl-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.snl-avatar-fallback{font-size:42px;font-weight:800;color:var(--orange)}
.snl-title{margin:0;font-size:clamp(26px,6vw,34px);font-weight:800;letter-spacing:-.01em}
.snl-title .snl-num{color:var(--orange)}
`;

export default function SectorSnlCalvinPage() {
  return (
    <>
      <MetaPixel locale="nl" />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="snl-page">
        <Orbs />

        <header className="snl-header">
          <span className="snl-brand">
            <BrandMark size={30} />
            <span>
              SECTOR<span className="snl-brand-num">1</span>
            </span>
          </span>
          <a
            className="btn btn-primary"
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Word hier lid
          </a>
        </header>

        <main className="snl-main">
          <div className="snl-avatar-ring">
            <div className="snl-avatar">
              {hasAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={AVATAR_SRC} alt="Calvin" width={124} height={124} />
              ) : (
                <span className="snl-avatar-fallback">C</span>
              )}
            </div>
          </div>

          <h1 className="snl-title">
            Sector<span className="snl-num">1</span> Calvin
          </h1>

          <a
            className="btn btn-primary"
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join mijn sport community
          </a>
        </main>
      </div>
    </>
  );
}
