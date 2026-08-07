import type { ReactNode } from "react";

// Renders EVERY variant of a piece of content; the boot script's
// `html[data-exp-<key>="..."]` attribute (set before first paint) reveals the
// assigned one via CSS, so there is no hydration swap and no flicker. Safe in
// server AND client components because it has no hooks or browser APIs.
//
// Add one CSS block per experiment key in globals.css (see `.exp-variant`), then:
//
//   <a className="btn btn-primary">
//     <VariantSwap
//       experiment="hero_headline"
//       variants={{ control: t.ctaPrimary, punchy: "Beat the bookies" }}
//     />
//   </a>
//
// Best for ABOVE-the-fold copy tests. For below-the-fold single-label swaps the
// useExperiment hook is simpler (see docs/ab-testing.md).
export default function VariantSwap({
  experiment,
  variants,
}: {
  experiment: string;
  variants: Record<string, ReactNode>;
}) {
  return (
    <>
      {Object.entries(variants).map(([variant, node]) => (
        <span
          key={variant}
          className="exp-variant"
          data-exp-key={experiment}
          data-exp-variant={variant}
        >
          {node}
        </span>
      ))}
    </>
  );
}
