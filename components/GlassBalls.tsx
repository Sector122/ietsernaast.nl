type Kind = "basketball" | "football";
type Item = {
  left: string;
  top: string;
  size: number;
  kind: Kind;
  dur: number;
  delay: number;
  tilt?: number;
};

const PRESETS: Record<string, Item[]> = {
  hero: [
    {
      left: "92%",
      top: "0%",
      size: 130,
      kind: "football",
      dur: 18,
      delay: -3,
      tilt: 10,
    },
    {
      left: "-2%",
      top: "10%",
      size: 122,
      kind: "football",
      dur: 14,
      delay: -2,
      tilt: -6,
    },
  ],
  hiw: [
    {
      left: "94%",
      top: "6%",
      size: 110,
      kind: "basketball",
      dur: 15,
      delay: -4,
      tilt: 8,
    },
  ],
  analysts: [
    {
      left: "93%",
      top: "4%",
      size: 130,
      kind: "basketball",
      dur: 16,
      delay: -1,
      tilt: 10,
    },
    {
      left: "-2%",
      top: "72%",
      size: 100,
      kind: "football",
      dur: 14,
      delay: -3,
      tilt: -8,
    },
  ],
  pricing: [
    {
      left: "4%",
      top: "28%",
      size: 120,
      kind: "football",
      dur: 16,
      delay: 0,
      tilt: -6,
    },
    {
      left: "88%",
      top: "44%",
      size: 140,
      kind: "basketball",
      dur: 18,
      delay: -2,
      tilt: 8,
    },
  ],
};

const SRC: Record<Kind, string> = {
  basketball: "/balls/basketball.webp",
  football: "/balls/soccer.webp",
};

export default function GlassBalls({
  variant,
}: {
  variant: keyof typeof PRESETS;
}) {
  const items = PRESETS[variant];
  if (!items) return null;
  return (
    <div className="gballs" data-variant={variant} aria-hidden="true">
      {items.map((it, i) => (
        <div
          key={i}
          className="gball"
          style={{
            left: it.left,
            top: it.top,
            width: it.size,
            height: it.size,
            ["--gb-size" as string]: `${it.size}px`,
            ["--gb-dur" as string]: `${it.dur}s`,
            ["--gb-tilt" as string]: `${it.tilt ?? 0}deg`,
            animationDelay: `${it.delay}s`,
          }}
        >
          <div className="gball-cube">
            <span className="gface gface--front" />
            <span className="gface gface--back" />
            <span className="gface gface--left" />
            <span className="gface gface--right" />
            <span className="gface gface--top" />
            <span className="gface gface--bottom" />
          </div>
          <div
            className="gball-inner"
            style={{ animationDelay: `${it.delay}s` }}
          >
            {/* Decorative art rendered as a CSS background (not <img>) so it's
                never picked up as the page's Largest Contentful Paint element. */}
            <div
              className="gball-img"
              style={{ backgroundImage: `url(${SRC[it.kind]})` }}
            />
            <span className="gball-shade" aria-hidden="true" />
            <span className="gball-spec" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  );
}
