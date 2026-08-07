import VslPlayer from "./VslPlayer";
import ChannelCta from "./ChannelCta";
import TelegramIcon from "./TelegramIcon";
import TelegramStoreBadges from "./TelegramStoreBadges";
import { getBotUrl, getWhatsappUrl } from "@/lib/cta";
import { ctaVariantFor } from "@/lib/cta-variant";
import { getDict, vslFor, VSL_MEDIA_BASE, type Locale } from "@/lib/i18n";

export default function Vsl({ locale = "en" }: { locale?: Locale }) {
  const dict = getDict(locale);
  const t = dict.vsl;
  const media = vslFor(locale);
  const botUrl = getBotUrl(locale);
  const whatsappUrl = getWhatsappUrl(locale);
  const vip = ctaVariantFor(locale) === "vip";
  const vslCta = vip ? t.ctaVip ?? t.cta : t.cta;

  return (
    <section className="vsl" id="vsl">
      {/* React hoists this into <head>: warm up the media origin so the
          poster (the LCP image) skips DNS/TLS setup. */}
      {VSL_MEDIA_BASE.startsWith("https://") && (
        <link rel="preconnect" href={VSL_MEDIA_BASE} />
      )}
      <div className="container">
        <div className="section-head">
          <a href={botUrl} target="_blank" rel="noopener" data-handoff data-href={botUrl}>
            <span className="kicker">{t.kicker}</span>
            <h2 className="vsl-h2">
              {t.headline1}
              <span className="vsl-h2-grad">{t.headline2}</span>
              {t.headline3}
            </h2>
            <p>{t.sub}</p>
          </a>
        </div>
        <div className="vsl-frame">
          <div className={`phone-mockup${media?.portrait ? " phone-mockup--portrait" : ""}`}>
            <div className="phone-notch" aria-hidden="true" />
            <div className="phone-screen">
              {media && (
                <VslPlayer
                  videoId={media.videoId}
                  mp4={media.mp4}
                  poster={media.poster}
                  posterSmall={media.posterSmall}
                  unmuteText={t.unmute}
                />
              )}
            </div>
          </div>
          <div className="vsl-action-stack">
            {whatsappUrl ? (
              <ChannelCta
                variant="halo"
                size="xl"
                title={dict.channelCta.vsl.title}
                sub={dict.channelCta.vsl.sub}
                telegramUrl={botUrl}
                whatsappUrl={whatsappUrl}
              />
            ) : (
              <div className="vsl-cta-wrap">
                <a
                  className="btn btn-primary btn-xl btn--tg-icon vsl-cta"
                  href={botUrl}
                  target="_blank"
                  rel="noopener"
                  data-handoff
                  data-href={botUrl}
                >
                  <TelegramIcon size={20} />
                  {vslCta}
                </a>
              </div>
            )}
            <TelegramStoreBadges />
          </div>
        </div>
      </div>
    </section>
  );
}
