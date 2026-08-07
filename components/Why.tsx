import type { Dict } from "@/lib/i18n";

const ICONS = ["✓", "📊", "📈", "💬"];

export default function Why({ t }: { t: Dict["why"] }) {
  return (
    <section className="why" id="why">
      <div className="container">
        <div className="section-head">
          <span className="kicker">{t.kicker}</span>
          <h2>{t.h2}</h2>
        </div>
        <div className="why-grid">
          {t.items.map((it, i) => (
            <article className="why-card" key={it.title}>
              <div className="why-ico">{ICONS[i] ?? "✓"}</div>
              <h3>{it.title}</h3>
              <p>{it.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
