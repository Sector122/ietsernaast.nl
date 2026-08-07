"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, CURRENCIES, flagEmoji } from "@/lib/onboarding/countries";
import type { SubmissionStatus } from "@/lib/onboarding/db";

export type EditableRow = {
  id: number;
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  deposit_amount: number;
  deposit_currency: string;
  status: SubmissionStatus;
  // Read-only attribution/context data, shown in the modal's details block.
  source_url: string | null;
  ip: string | null;
  user_agent: string | null;
  fbp: string | null;
  fbc: string | null;
  created_at: number;
};

const ERROR_TEXT: Record<string, string> = {
  invalid_first_name: "First name: 1–100 characters.",
  invalid_last_name: "Last name: 1–100 characters.",
  invalid_email: "That email doesn't look valid.",
  invalid_phone: "Phone must be +<countrycode><digits> (or empty).",
  invalid_country: "Unknown country.",
  invalid_amount: "Amount must be a positive number.",
  invalid_currency: "Unknown currency.",
  unauthorized: "Your session expired. Log in again.",
};

export default function EditSubmission({ row }: { row: EditableRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    first_name: row.first_name,
    last_name: row.last_name,
    email: row.email,
    phone: row.phone ?? "",
    country: row.country,
    deposit_amount: String(row.deposit_amount),
    deposit_currency: row.deposit_currency,
    status: row.status,
  }));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function openModal() {
    setForm({
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone ?? "",
      country: row.country,
      deposit_amount: String(row.deposit_amount),
      deposit_currency: row.deposit_currency,
      status: row.status,
    });
    setError("");
    setOpen(true);
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(form.deposit_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError(ERROR_TEXT.invalid_amount!);
      return;
    }
    const becomesHandled = form.status === "handled" && row.status !== "handled";
    if (
      becomesHandled &&
      !window.confirm(
        "Saving will mark this submission HANDLED and report the verified deposit to Meta. Continue?",
      )
    ) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          deposit_amount: amount,
          deposit_currency: form.deposit_currency,
          status: form.status,
        }),
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
        return;
      }
      const { error: code } = (await res.json()) as { error?: string };
      setError(ERROR_TEXT[code ?? ""] ?? "Saving failed. Try again.");
    } catch {
      setError("Saving failed. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="adm-btn-sm" title="Edit" onClick={openModal}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 5 19 9.5 8.5 20H4v-4.5L14.5 5Z" />
          <path d="m12.5 7 4.5 4.5" />
        </svg>
      </button>
      {open && (
        <div className="adm-modal-backdrop" onClick={() => setOpen(false)}>
          <form
            className="adm-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={onSave}
          >
            <h2>
              Edit submission <span className="adm-id-hash">#</span>
              {row.id}
            </h2>
            <div className="adm-modal-grid">
              <label className="adm-field">
                <span>First name</span>
                <input className="ob-input" value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
              </label>
              <label className="adm-field">
                <span>Last name</span>
                <input className="ob-input" value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
              </label>
              <label className="adm-field adm-field-full">
                <span>Email</span>
                <input className="ob-input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="adm-field">
                <span>Phone (+countrycode…)</span>
                <input className="ob-input" type="tel" placeholder="empty = none" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label className="adm-field">
                <span>Country</span>
                <select className="ob-input" value={form.country} onChange={(e) => set("country", e.target.value)}>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {flagEmoji(c.code)} {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="adm-field">
                <span>Deposit amount</span>
                <input className="ob-input" type="number" min="0" step="0.01" value={form.deposit_amount} onChange={(e) => set("deposit_amount", e.target.value)} />
              </label>
              <label className="adm-field">
                <span>Currency</span>
                <select className="ob-input" value={form.deposit_currency} onChange={(e) => set("deposit_currency", e.target.value)}>
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}: {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="adm-field adm-field-full">
                <span>Status</span>
                <select className="ob-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="handled">Handled</option>
                  <option value="canceled">Canceled</option>
                </select>
              </label>
            </div>
            <dl className="adm-details">
              <div className="adm-detail">
                <dt>External ID (token)</dt>
                <dd className="adm-detail-mono">{row.token}</dd>
              </div>
              <div className="adm-detail">
                <dt>Meta fbc (ad click)</dt>
                <dd className="adm-detail-mono">{row.fbc ?? "Not captured"}</dd>
              </div>
              <div className="adm-detail">
                <dt>Meta fbp (browser)</dt>
                <dd className="adm-detail-mono">{row.fbp ?? "Not captured"}</dd>
              </div>
              <div className="adm-detail">
                <dt>IP</dt>
                <dd className="adm-detail-mono">{row.ip ?? "N/A"}</dd>
              </div>
              <div className="adm-detail">
                <dt>User agent</dt>
                <dd>{row.user_agent ?? "N/A"}</dd>
              </div>
              <div className="adm-detail">
                <dt>Source URL</dt>
                <dd className="adm-detail-mono">{row.source_url ?? "N/A"}</dd>
              </div>
              <div className="adm-detail">
                <dt>Submitted (UTC)</dt>
                <dd>{new Date(row.created_at * 1000).toISOString().replace("T", " ").slice(0, 19)}</dd>
              </div>
            </dl>
            {error && <p className="ob-error">{error}</p>}
            <div className="adm-modal-foot">
              <button type="button" className="adm-btn-sm" onClick={() => setOpen(false)} disabled={busy}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
