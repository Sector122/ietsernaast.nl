"use client";
import { useState } from "react";
import { decodePayload } from "@/lib/analytics/tg-payload";

const TOKEN_RE = /^[0-9a-f]{16}$/;

// Paste the member's Telegram message (it carries the invisible zero-width
// token) — or a raw 16-hex token — and get back a signed /onboarding link.
// When no token can be recovered (forwarded/retyped message, or nothing
// pasted at all), we still mint a link with a FRESH random id: the member
// loses ad-click attribution but never loses the ability to onboard.

function randomToken(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function LinkTool() {
  const [input, setInput] = useState("");
  const [note, setNote] = useState("");
  const [warn, setWarn] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setUrl("");
    setNote("");
    setWarn("");
    setCopied(false);

    const text = input.trim().toLowerCase();
    let token = "";
    if (TOKEN_RE.test(text)) {
      token = text;
      setNote(`Using pasted ID: ${token}`);
    } else if (text) {
      const decoded = decodePayload(input);
      if (decoded) {
        token = decoded.token;
        if (!decoded.valid) {
          setWarn(
            `Checksum failed. Best-guess ID is ${token}, but it may be corrupted, so the link might not match the real visitor.`,
          );
        } else {
          setNote(`Hidden ID found: ${token}`);
        }
      } else {
        token = randomToken();
        setWarn(
          `No hidden ID found in that message (forwarding or retyping strips it), so a fresh ID ${token} was generated instead. The member can still onboard, but this link won't attribute back to their ad click.`,
        );
      }
    } else {
      token = randomToken();
      setNote(`Generated a fresh ID: ${token} (no message pasted, no ad attribution).`);
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        const { url: signed } = (await res.json()) as { url: string };
        setUrl(signed);
      } else {
        setWarn(
          res.status === 401
            ? "Your session expired. Log in again."
            : "Signing failed. Try again.",
        );
      }
    } catch {
      setWarn("Signing failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* user can still select the text manually */
    }
  }

  return (
    <form className="adm-tool" onSubmit={onGenerate}>
      <textarea
        className="ob-input"
        placeholder="Paste the member's Telegram message here (or a raw 16-character ID)…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <p className="adm-note">
        Copy the message from Telegram directly. The ID is invisible
        characters inside it. Leave this empty to mint a fresh link without
        ad attribution.
      </p>
      <div>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "…" : "Generate link"}
        </button>
      </div>
      {note && <p className="adm-ok">{note}</p>}
      {warn && <p className="ob-error">{warn}</p>}
      {url && (
        <div className="adm-result">
          <code>{url}</code>
          <button type="button" className="adm-btn-sm" onClick={onCopy}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      )}
    </form>
  );
}
