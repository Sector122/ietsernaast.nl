"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubmissionStatus } from "@/lib/onboarding/db";

export type RangeKey = "all" | "today" | "7d" | "30d";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "all", label: "All Time" },
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
];

const STATUSES: { key: SubmissionStatus | ""; label: string; icon: React.ReactNode }[] = [
  {
    key: "",
    label: "All",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    key: "pending",
    label: "Pending",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </svg>
    ),
  },
  {
    key: "handled",
    label: "Handled",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8.5 12.5 2.4 2.4 4.6-5.3" />
      </svg>
    ),
  },
  {
    key: "canceled",
    label: "Canceled",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="8.5" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </svg>
    ),
  },
];

function buildHref(q: string, range: RangeKey, status: string): string {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (range !== "all") p.set("range", range);
  if (status) p.set("status", status);
  const s = p.toString();
  return s ? `/admin?${s}` : "/admin";
}

export default function SubmissionsToolbar({
  q,
  range,
  status,
  exportHref,
}: {
  q: string;
  range: RangeKey;
  status: SubmissionStatus | "";
  exportHref: string;
}) {
  const router = useRouter();
  return (
    <div className="adm-card adm-toolbar">
      <form className="adm-search" method="GET" action="/admin" role="search">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          className="ob-input"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search name, email, phone, ID or country…"
          aria-label="Search submissions"
          onInput={(e) => {
            // The native ✕ of type="search" clears the text without
            // submitting the form — when a filter is active and the field
            // empties, drop the filter immediately.
            if (q && e.currentTarget.value === "") {
              router.push(buildHref("", range, status));
            }
          }}
        />
        {range !== "all" && <input type="hidden" name="range" value={range} />}
        {status && <input type="hidden" name="status" value={status} />}
      </form>

      <select
        className="ob-input adm-range"
        aria-label="Date range"
        value={range}
        onChange={(e) => {
          router.push(buildHref(q, e.target.value as RangeKey, status));
        }}
      >
        {RANGES.map((r) => (
          <option key={r.key} value={r.key}>
            {r.label}
          </option>
        ))}
      </select>

      <div className="adm-filters" role="group" aria-label="Status filter">
        {STATUSES.map((s) => (
          <Link
            key={s.key || "all"}
            className={`adm-filter${status === s.key ? " is-active" : ""}`}
            href={buildHref(q, range, s.key)}
          >
            {s.icon}
            {s.label}
          </Link>
        ))}
      </div>

      <a className="adm-export" href={exportHref} download>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 4v10m0 0 3.5-3.5M12 14l-3.5-3.5" />
          <path d="M4.5 16.5v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2" />
        </svg>
        Export CSV
      </a>
    </div>
  );
}
