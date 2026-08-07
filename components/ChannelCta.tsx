import type { ReactNode } from "react";

// Dual-platform CTA: offers Telegram and WhatsApp side by side.
//
// Two visual variants (see design exploration):
//   - "glow" (A1): solid platform-coloured buttons, each with its own
//      coloured glow. Boldest "two channels" signal.
//   - "halo" (A2): brand-gold halo kept; buttons outlined in their platform
//      colour. Calmer, ties back to the orange/gold brand.
//
// Degrades gracefully: with no whatsappUrl it renders a single Telegram
// button, so non-WhatsApp locales are unaffected. Title sits above the
// buttons, sub-label below — both are optional slots.

type ChannelCtaVariant = "glow" | "halo";
type ChannelCtaSize = "md" | "lg" | "xl";

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M21.9 4.3 2.7 11.8c-1 .4-1 1 0 1.3l4.7 1.5 1.8 5.7c.2.7.4.9 1 .9.5 0 .7-.2 1-.5l2.6-2.5 5.3 4c1 .5 1.7.2 1.9-.9l3.4-15.9c.3-1.3-.5-1.9-1.5-1.4z" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24zm-3.77 4.6c-.18 0-.47.07-.71.34-.24.27-.94.92-.94 2.24s.96 2.6 1.1 2.78c.13.18 1.88 2.87 4.56 4.02.64.27 1.13.43 1.52.55.64.2 1.22.17 1.68.1.51-.07 1.58-.64 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.24-.18-.51-.31-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.13-.6.14-.18.27-.69.86-.84 1.04-.16.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.6-1.49-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.46.09-.18.04-.34-.02-.47-.07-.14-.6-1.46-.84-2-.22-.52-.44-.45-.6-.46-.16-.01-.34-.01-.51-.01z" />
    </svg>
  );
}

export default function ChannelCta({
  telegramUrl,
  whatsappUrl,
  title,
  sub,
  variant = "halo",
  size = "lg",
  telegramLabel = "Telegram",
  whatsappLabel = "WhatsApp",
  className = "",
}: {
  telegramUrl: string;
  whatsappUrl?: string;
  title?: ReactNode;
  sub?: ReactNode;
  variant?: ChannelCtaVariant;
  size?: ChannelCtaSize;
  telegramLabel?: string;
  whatsappLabel?: string;
  className?: string;
}) {
  const solo = !whatsappUrl;
  const cls = [
    "chan-cta",
    `chan-cta--${variant}`,
    `chan-cta--${size}`,
    solo ? "chan-cta--solo" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls}>
      {title && <p className="chan-cta-title">{title}</p>}
      <div className="chan-cta-rowwrap">
        <span className="chan-halo" aria-hidden="true" />
        <div className="chan-cta-row">
          <a
            className="chan-btn chan-btn--tg"
            href={telegramUrl}
            target="_blank"
            rel="noopener"
            data-handoff
            data-href={telegramUrl}
          >
            <TelegramIcon />
            {telegramLabel}
          </a>
          {whatsappUrl && (
            <a
              className="chan-btn chan-btn--wa"
              href={whatsappUrl}
              target="_blank"
              rel="noopener"
            >
              <WhatsappIcon />
              {whatsappLabel}
            </a>
          )}
        </div>
      </div>
      {sub && <small className="chan-cta-sub">{sub}</small>}
    </div>
  );
}
