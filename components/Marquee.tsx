const ITEMS = [
  "Bet smarter, not harder",
  "Easy-to-follow sports betting tips focused on long-term results.",
  "Watch the video below, press the button and CLAIM your first month for FREE",
];

const block = [...ITEMS, ...ITEMS];

function Group({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="marquee-group" aria-hidden={ariaHidden ? "true" : undefined}>
      {block.map((t, i) => (
        <span className="marquee-item" key={i}>
          <span>{t}</span>
          <span className="marquee-sep" aria-hidden="true">◆</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" role="marquee" aria-label="Sector1 announcements">
      <div className="marquee-track">
        <Group />
        <Group ariaHidden />
      </div>
    </div>
  );
}
