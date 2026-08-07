// Structured, localizable legal document content.
// Authored by us (static, compile-time constants) — rendered by components/LegalBody.tsx.

export type LegalSpan =
  | string
  | {
      /** Visible text of the span. */
      t: string;
      /** Optional link target. */
      href?: string;
      /** Open link in a new tab (adds rel="noopener"). */
      ext?: boolean;
      /** Render the span bold. */
      b?: boolean;
    };

export type LegalBlock =
  | { kind: "lede"; spans: LegalSpan[] }
  | { kind: "p"; spans: LegalSpan[] }
  | { kind: "foot"; spans: LegalSpan[] }
  | { kind: "h2"; text: string }
  | { kind: "ul"; items: LegalSpan[][] };

export type LegalDoc = {
  /** Page heading (also used to build the <title>). */
  title: string;
  /** Meta description. */
  desc: string;
  /** Localized "last updated" value, e.g. "May 2026". */
  updated: string;
  blocks: LegalBlock[];
};

export type LegalDocs = {
  terms: LegalDoc;
  privacy: LegalDoc;
  responsible: LegalDoc;
};
