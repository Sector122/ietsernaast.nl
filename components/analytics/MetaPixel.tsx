import { regionsForLocale } from "@/lib/meta-pixel";

// App-rendered Meta Pixel. Pixel IDs are read at build time (per-region) and
// inlined into the static HTML; the fbq snippet runs during HTML parse for the
// earliest possible PageView.
function pixelIdsFor(locale: string): string[] {
  const balkan = process.env.META_PIXEL_BALKAN_ID ?? "";
  const nordic = process.env.META_PIXEL_NORDIC_ID ?? "";
  const ids: string[] = [];
  for (const r of regionsForLocale(locale)) {
    if (r === "balkan" && balkan) ids.push(balkan);
    if (r === "nordic" && nordic) ids.push(nordic);
  }
  return ids;
}

export default function MetaPixel({ locale }: { locale: string }) {
  const ids = pixelIdsFor(locale);
  if (ids.length === 0) return null;

  const inits = ids.map((id) => `fbq('init','${id}');`).join("");
  // The fbq stub queues every call (init, PageView, later Lead/Purchase), but
  // fbevents.js itself (~280 KB with per-pixel configs) is NOT injected during
  // parse: it loads after window load + idle so Facebook's scripts never
  // compete with the LCP image or hydration. Queued events flush on load, so
  // nothing is lost — PageView is just stamped a couple of seconds later.
  const snippet = `!function(f,b){if(f.fbq)return;var n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window,document);\n${inits}fbq('track','PageView');\n!function(){var l=function(){var s=document.createElement('script');s.async=!0;s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(s)};var i=function(){'requestIdleCallback' in window?requestIdleCallback(l,{timeout:4000}):setTimeout(l,1500)};'complete'===document.readyState?i():addEventListener('load',i,{once:!0})}();`;

  return (
    <>
      {/* Inline stub queues events during parse; the heavy SDK loads on idle. */}
      <script dangerouslySetInnerHTML={{ __html: snippet }} />
      <noscript>
        {ids.map((id) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={id}
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
            alt=""
          />
        ))}
      </noscript>
    </>
  );
}
