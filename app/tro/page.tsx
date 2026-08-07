import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import MetaPixel from "@/components/analytics/MetaPixel";
import { TG_PREVIEW_CHANNELS } from "@/lib/tg-preview";

// /tro — Romania. To add another locale, copy this file to app/<slug>/page.tsx
// and point CHANNEL at its entry in TG_PREVIEW_CHANNELS.
const SLUG = "s1romania";
const CHANNEL = TG_PREVIEW_CHANNELS[SLUG];

// t.me renders in Roboto, not the site's Inter. Self-hosted by next/font so
// the replica doesn't depend on a Google Fonts request.
const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Telegram: View @${SLUG}`,
  description: CHANNEL.description[0],
  // Ad traffic only — keep it out of the index.
  robots: { index: false, follow: false },
};

// Every value below is lifted from the live page: telegram.org/css/telegram.css
// (dark theme) and the t.me/<channel> markup. Class names are kept so the two
// can be diffed side by side.
const CSS = `
.tgme_page_wrap{--text-color:#fff;--second-text-color:#7d7f81;--accent-btn-color:#1c93e3;
  --accent-color-hover:#1a8ad5;--accent-link-color:#3ca1eb;--body-bg:#000;--box-bg:#1e1e1e;
  --box-bg-blured:rgba(34,34,34,.84);
  font-family:var(--font-roboto),'Roboto',sans-serif;color:var(--text-color);
  min-height:100dvh}
/* No background here on purpose: an in-flow background would paint over the
   z-index:-1 wallpaper layer below. The fixed .tgme_background_wrap owns it. */

/* Dark theme paints the 4-colour wallpaper gradient through the doodle SVG as
   a mask at 30% — that is why the doodles read as faint olive on black. */
/* The live page uses z-index:-1 here; that relies on t.me having no styles on
   the ancestors. Under our root layout a negative layer gets painted over, so
   the wallpaper sits at z-index 0 and the content is lifted above it instead. */
.tgme_background_wrap{position:fixed;left:0;top:0;width:100%;height:100%;
  pointer-events:none;z-index:0;background:var(--body-bg)}
.tgme_background{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.3;
  background-color:#6ba587;
  background-image:
    radial-gradient(at 22% 18%,#dbddbb 0,rgba(219,221,187,0) 62%),
    radial-gradient(at 80% 22%,#6ba587 0,rgba(107,165,135,0) 62%),
    radial-gradient(at 18% 80%,#d5d88d 0,rgba(213,216,141,0) 62%),
    radial-gradient(at 82% 84%,#88b884 0,rgba(136,184,132,0) 62%);
  /* Longhands only — the mask shorthand clobbers mask-image in Chrome when
     both the prefixed and unprefixed forms are declared. */
  -webkit-mask-image:url('/tg/pattern.svg');-webkit-mask-size:420px auto;
  -webkit-mask-repeat:repeat;-webkit-mask-position:center;
  mask-image:url('/tg/pattern.svg');mask-size:420px auto;
  mask-repeat:repeat;mask-position:center}

.tgme_head_wrap{position:fixed;left:0;right:0;top:0;height:54px;padding:10px 16px;
  box-shadow:0 2px 4px rgba(0,0,0,.1);background:var(--box-bg-blured);
  -webkit-backdrop-filter:blur(25px);backdrop-filter:blur(25px);z-index:1}
.tgme_head{display:flex;justify-content:space-between}
.tgme_head_brand{display:inline-block;vertical-align:top}
.tgme_logo{display:block}
a.tgme_head_right_btn{display:inline-block;font-size:14px;line-height:17px;font-weight:bold;
  -webkit-font-smoothing:antialiased;text-transform:uppercase;color:#fff;
  background:var(--accent-btn-color);padding:9px 16px;height:34px;border-radius:17px;
  text-align:center;text-decoration:none;transition:all .15s ease .15s;box-shadow:none}
a.tgme_head_right_btn:hover{background:var(--accent-color-hover);color:#fff;transform:none}

.tgme_body_wrap{padding:70px 16px 40px;position:relative;z-index:1}
.tgme_page{position:relative;margin:16px auto;padding:32px 0;max-width:400px;
  background:var(--box-bg);box-shadow:0 2px 4px rgba(0,0,0,.1);border-radius:16px}
.tgme_page_photo{text-align:center;padding-bottom:16px}
.tgme_page_photo_image{width:122px;height:122px;border-radius:61px;display:inline-block}
.tgme_page_title{font-size:26px;line-height:32px;font-weight:bold;text-align:center;
  max-width:340px;padding:0 10px;margin:0 auto;color:var(--text-color);
  overflow:hidden;text-overflow:ellipsis}
.tgme_page_extra{font-size:15px;line-height:18px;text-align:center;padding:6px 16px 0;
  color:var(--second-text-color)}
/* t.me clamps this to 5 rendered lines (-webkit-line-clamp:5 / max-height:125px),
   which truncates mid-sentence — fine for a channel description, wrong here
   where the copy carries the call to action. Clamp deliberately dropped so all
   paragraphs stay visible; restore those two declarations for pixel fidelity. */
.tgme_page_description{font-size:16px;line-height:25px;text-align:center;margin:10px 16px 0;
  padding:0;word-break:break-word}
.tgme_page_description a{color:var(--accent-link-color);text-decoration:none}
.tgme_page_action{text-align:center;margin-top:24px;line-height:0}
a.tgme_action_button_new{font-size:14px;line-height:17px;font-weight:bold;
  -webkit-font-smoothing:antialiased;color:#fff;border-radius:22px;overflow:hidden;
  display:inline-block;padding:13px 24px;height:42px;text-transform:uppercase;
  vertical-align:top;text-decoration:none;box-shadow:none;
  background-color:var(--accent-btn-color)}
a.tgme_action_button_new:hover{background-color:var(--accent-color-hover);color:#fff;
  transform:none}
a.tgme_action_button_new::after{content:none;animation:none}
/* The live button sweeps a highlight across itself every 5s. */
a.tgme_action_button_new.shine{background-image:linear-gradient(270deg,
  rgba(100,181,239,0) 48.44%,#64b5ef 75.52%,rgba(100,181,239,0) 100%);
  background-repeat:no-repeat;animation:tgme-bg-move linear 5s infinite}
@keyframes tgme-bg-move{0%{background-position:-100% 0}60%,100%{background-position:200% 0}}
@media (prefers-reduced-motion:reduce){
  a.tgme_action_button_new.shine{animation:none}
}
.tgme_page_context_link_wrap{font-size:14px;line-height:16px;text-align:center;
  padding:0 16px;margin:20px 0 0;color:var(--second-text-color)}
.tgme_page_context_link_wrap a.tgme_page_context_link{color:#7d7f81;cursor:pointer;
  text-decoration:none;box-shadow:none}
.tgme_page_context_link_wrap a.tgme_page_context_link:hover{text-decoration:underline;
  transform:none}
`;

// Telegram wordmark, copied verbatim from the live page's inline SVG.
const LOGO_MARK =
  "m7.06510669 16.9258959c5.22739451-2.1065178 8.71314291-3.4952633 10.45724521-4.1662364 4.9797665-1.9157646 6.0145193-2.2485535 6.6889567-2.2595423.1483363-.0024169.480005.0315855.6948461.192827.1814076.1361492.23132.3200675.2552048.4491519.0238847.1290844.0536269.4231419.0299841.65291-.2698553 2.6225356-1.4375148 8.986738-2.0315537 11.9240228-.2513602 1.2428753-.7499132 1.5088847-1.2290685 1.5496672-1.0413153.0886298-1.8284257-.4857912-2.8369905-1.0972863-1.5782048-.9568691-2.5327083-1.3984317-4.0646293-2.3321592-1.7703998-1.0790837-.212559-1.583655.7963867-2.5529189.2640459-.2536609 4.7753906-4.3097041 4.755976-4.431706-.0070494-.0442984-.1409018-.481649-.2457499-.5678447-.104848-.0861957-.2595946-.0567202-.3712641-.033278-.1582881.0332286-2.6794907 1.5745492-7.5636077 4.6239616-.715635.4545193-1.3638349.6759763-1.9445998.6643712-.64024672-.0127938-1.87182452-.334829-2.78737602-.6100966-1.12296117-.3376271-1.53748501-.4966332-1.45976769-1.0700283.04048-.2986597.32581586-.610598.8560076-.935815z";
const LOGO_WORD =
  "m49.4 24v-12.562h-4.224v-2.266h11.198v2.266h-4.268v12.562zm16.094-4.598h-7.172c.066 1.936 1.562 2.772 3.3 2.772 1.254 0 2.134-.198 2.97-.484l.396 1.848c-.924.396-2.2.682-3.74.682-3.476 0-5.522-2.134-5.522-5.412 0-2.97 1.804-5.764 5.236-5.764 3.476 0 4.62 2.86 4.62 5.214 0 .506-.044.902-.088 1.144zm-7.172-1.892h4.708c.022-.99-.418-2.618-2.222-2.618-1.672 0-2.376 1.518-2.486 2.618zm9.538 6.49v-15.62h2.706v15.62zm14.84-4.598h-7.172c.066 1.936 1.562 2.772 3.3 2.772 1.254 0 2.134-.198 2.97-.484l.396 1.848c-.924.396-2.2.682-3.74.682-3.476 0-5.522-2.134-5.522-5.412 0-2.97 1.804-5.764 5.236-5.764 3.476 0 4.62 2.86 4.62 5.214 0 .506-.044.902-.088 1.144zm-7.172-1.892h4.708c.022-.99-.418-2.618-2.222-2.618-1.672 0-2.376 1.518-2.486 2.618zm19.24-1.144v6.072c0 2.244-.462 3.85-1.584 4.862-1.1.99-2.662 1.298-4.136 1.298-1.364 0-2.816-.308-3.74-.858l.594-2.046c.682.396 1.826.814 3.124.814 1.76 0 3.08-.924 3.08-3.234v-.924h-.044c-.616.946-1.694 1.584-3.124 1.584-2.662 0-4.554-2.2-4.554-5.236 0-3.52 2.288-5.654 4.862-5.654 1.65 0 2.596.792 3.102 1.672h.044l.11-1.43h2.354c-.044.726-.088 1.606-.088 3.08zm-2.706 2.948v-1.738c0-.264-.022-.506-.088-.726-.286-.99-1.056-1.738-2.2-1.738-1.518 0-2.64 1.32-2.64 3.498 0 1.826.924 3.3 2.618 3.3 1.012 0 1.892-.66 2.2-1.65.088-.264.11-.638.11-.946zm5.622 4.686v-7.26c0-1.452-.022-2.508-.088-3.454h2.332l.11 2.024h.066c.528-1.496 1.782-2.266 2.948-2.266.264 0 .418.022.638.066v2.53c-.242-.044-.484-.066-.814-.066-1.276 0-2.178.814-2.42 2.046-.044.242-.066.528-.066.814v5.566zm16.05-6.424v3.85c0 .968.044 1.914.176 2.574h-2.442l-.198-1.188h-.066c-.638.836-1.76 1.43-3.168 1.43-2.156 0-3.366-1.562-3.366-3.19 0-2.684 2.398-4.07 6.358-4.048v-.176c0-.704-.286-1.87-2.178-1.87-1.056 0-2.156.33-2.882.792l-.528-1.76c.792-.484 2.178-.946 3.872-.946 3.432 0 4.422 2.178 4.422 4.532zm-2.64 2.662v-1.474c-1.914-.022-3.74.374-3.74 2.002 0 1.056.682 1.54 1.54 1.54 1.1 0 1.87-.704 2.134-1.474.066-.198.066-.396.066-.594zm5.6 3.762v-7.524c0-1.232-.044-2.266-.088-3.19h2.31l.132 1.584h.066c.506-.836 1.474-1.826 3.3-1.826 1.408 0 2.508.792 2.97 1.98h.044c.374-.594.814-1.034 1.298-1.342.616-.418 1.298-.638 2.2-.638 1.76 0 3.564 1.21 3.564 4.642v6.314h-2.64v-5.918c0-1.782-.616-2.838-1.914-2.838-.924 0-1.606.66-1.892 1.43-.088.242-.132.594-.132.902v6.424h-2.64v-6.204c0-1.496-.594-2.552-1.848-2.552-1.012 0-1.694.792-1.958 1.518-.088.286-.132.594-.132.902v6.336z";

// Telegram linkifies @usernames inside the channel description.
function linkifyMentions(line: string) {
  return line.split(/(@[A-Za-z0-9_]{3,})/g).map((part, i) =>
    part.startsWith("@") ? (
      <a key={i} href={`https://t.me/${part.slice(1)}`} rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export default function TgPreviewPage() {
  const ch = CHANNEL;
  const ctaAfterDescriptionLine =
    ch.ctaAfterDescriptionLine ?? ch.description.length - 1;
  const descriptionBeforeCta = ch.description.slice(0, ctaAfterDescriptionLine + 1);
  // const descriptionAfterCta = ch.description.slice(ctaAfterDescriptionLine + 1);

  return (
    <>
      <MetaPixel locale={ch.locale} />
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className={`tgme_page_wrap ${roboto.variable}`}>
        <div className="tgme_background_wrap">
          <div className="tgme_background" />
        </div>

        <div className="tgme_head_wrap">
          <div className="tgme_head">
            <span className="tgme_head_brand">
              <svg
                className="tgme_logo"
                height="34"
                viewBox="0 0 133 34"
                width="133"
                aria-label="Telegram"
              >
                <g fill="none" fillRule="evenodd">
                  <circle cx="17" cy="17" fill="var(--accent-btn-color)" r="17" />
                  <path d={LOGO_MARK} fill="#fff" />
                  <path d={LOGO_WORD} fill="var(--text-color)" />
                </g>
              </svg>
            </span>
            {/* Same destination as the CTA — a click here is the same intent. */}
            <a
              className="btn tgme_head_right_btn"
              href={ch.url}
              rel="noopener noreferrer"
            >
              {ch.download}
            </a>
          </div>
        </div>

        <div className="tgme_body_wrap">
          <div className="tgme_page">
            <div className="tgme_page_photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="tgme_page_photo_image"
                src={ch.avatar}
                alt={ch.title}
                width={122}
                height={122}
              />
            </div>
            <div className="tgme_page_title" dir="auto">
              <span dir="auto">{ch.title}</span>
            </div>
            <div className="tgme_page_extra">{ch.members}</div>
            <div className="tgme_page_description" dir="auto">
              {descriptionBeforeCta.map((line, i) => (
                <span key={line}>
                  {i > 0 ? (
                    <>
                      <br />
                      <br />
                    </>
                  ) : null}
                  {linkifyMentions(line)}
                </span>
              ))}
            </div>
            <div className="tgme_page_action">
              {/* class "btn" is what TrackLead listens for — it fires the Meta
                  Lead + CAPI mirror + TikTok Contact (components/TrackLead.tsx). */}
              <a
                className="btn tgme_action_button_new shine"
                href={ch.url}
                rel="noopener noreferrer"
              >
                {ch.cta}
              </a>
            </div>
            {/* {descriptionAfterCta.length > 0 ? (
              <div className="tgme_page_description" dir="auto">
                {descriptionAfterCta.map((line, i) => (
                  <span key={line}>
                    {i > 0 ? (
                      <>
                        <br />
                        <br />
                      </>
                    ) : null}
                    {linkifyMentions(line)}
                  </span>
                ))}
              </div>
            ) : null} */}
            {/* <div className="tgme_page_context_link_wrap">
              <a
                className="btn tgme_page_context_link"
                href={ch.url}
                rel="noopener noreferrer"
              >
                {ch.subLink}
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
