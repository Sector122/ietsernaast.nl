import { Fragment } from "react";
import type { LegalBlock, LegalSpan } from "@/lib/legal/types";

function Spans({ spans }: { spans: LegalSpan[] }) {
  return (
    <>
      {spans.map((s, i) => {
        if (typeof s === "string") return <Fragment key={i}>{s}</Fragment>;
        const content = s.b ? <strong>{s.t}</strong> : s.t;
        if (s.href) {
          const ext = s.ext ? { target: "_blank", rel: "noopener" } : {};
          return (
            <a key={i} href={s.href} {...ext}>
              {content}
            </a>
          );
        }
        return <Fragment key={i}>{content}</Fragment>;
      })}
    </>
  );
}

export default function LegalBody({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "lede":
            return (
              <p key={i} className="legal-lede">
                <Spans spans={b.spans} />
              </p>
            );
          case "foot":
            return (
              <p key={i} className="legal-foot">
                <Spans spans={b.spans} />
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((item, j) => (
                  <li key={j}>
                    <Spans spans={item} />
                  </li>
                ))}
              </ul>
            );
          case "p":
          default:
            return (
              <p key={i}>
                <Spans spans={b.spans} />
              </p>
            );
        }
      })}
    </>
  );
}
