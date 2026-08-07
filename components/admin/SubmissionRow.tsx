"use client";
import { useState } from "react";

export function CopyId({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const short = `${token.slice(0, 6)}…${token.slice(-4)}`;
  return (
    <button
      type="button"
      className="adm-id"
      title={copied ? "Copied" : `Copy ${token}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(token);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* selection fallback isn't worth the code here */
        }
      }}
    >
      <span className="adm-id-hash">#</span> {short}
      {copied ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="m5.5 12.5 4 4 9-10" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
      )}
    </button>
  );
}
