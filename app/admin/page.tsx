import Link from "next/link";
import { requireUser } from "@/lib/admin/auth";
import {
  countMatchingSubmissions,
  isSubmissionStatus,
  listSubmissions,
  type SubmissionFilter,
  type SubmissionStatus,
} from "@/lib/onboarding/db";
import { flagEmoji } from "@/lib/onboarding/countries";
import SubmissionsToolbar, { type RangeKey } from "@/components/admin/SubmissionsToolbar";
import { CopyId } from "@/components/admin/SubmissionRow";
import EditSubmission from "@/components/admin/EditSubmission";

const PAGE_SIZE = 20;

const RANGE_SECONDS: Record<Exclude<RangeKey, "all" | "today">, number> = {
  "7d": 7 * 24 * 3600,
  "30d": 30 * 24 * 3600,
};

function fmtDate(epochS: number): string {
  const d = new Date(epochS * 1000);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.toISOString().slice(0, 10)} at ${hh}:${mm}`;
}

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "Pending",
  handled: "Handled",
  canceled: "Canceled",
};

/** 1 … around-current … last, capped at ~7 entries. */
function pageList(current: number, count: number): (number | "…")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const wanted = [1, current - 1, current, current + 1, count]
    .filter((p) => p >= 1 && p <= count)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of [...new Set(wanted)]) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser("admin");
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : "";
  const range: RangeKey =
    params.range === "today" || params.range === "7d" || params.range === "30d"
      ? params.range
      : "all";
  const status = isSubmissionStatus(params.status) ? params.status : "";
  const pageRaw = typeof params.page === "string" ? Number(params.page) : 1;

  const filter: SubmissionFilter = {};
  if (q) filter.q = q;
  if (status) filter.status = status;
  if (range === "today") {
    // Calendar day, not a rolling 24h window — UTC to match the dates the
    // table displays (fmtDate).
    filter.since = Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000);
  } else if (range !== "all") {
    filter.since = Math.floor(Date.now() / 1000) - RANGE_SECONDS[range];
  }

  const total = await countMatchingSubmissions(filter);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(
    Math.max(Number.isSafeInteger(pageRaw) ? pageRaw : 1, 1),
    pageCount,
  );
  const offset = (page - 1) * PAGE_SIZE;
  const rows = await listSubmissions({ ...filter, limit: PAGE_SIZE, offset });

  const pageHref = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (range !== "all") sp.set("range", range);
    if (status) sp.set("status", status);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `/admin?${s}` : "/admin";
  };

  const exportParams = new URLSearchParams();
  if (q) exportParams.set("q", q);
  if (status) exportParams.set("status", status);
  if (filter.since) exportParams.set("since", String(filter.since));

  return (
    <section>
      <header className="adm-head">
        <h1 className="adm-title">Onboarding submissions</h1>
        <p className="adm-sub">Every completed onboarding form, newest first.</p>
      </header>

      <SubmissionsToolbar
        q={q}
        range={range}
        status={status}
        exportHref={`/api/admin/submissions?${exportParams}`}
      />

      <div className="adm-card adm-table-wrap">
        {rows.length === 0 ? (
          <p className="adm-empty">
            {q || status || range !== "all"
              ? "Nothing matches these filters."
              : "No submissions yet."}
          </p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="adm-th-num">Amount</th>
                <th>Currency</th>
                <th>Country</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <CopyId token={r.token} />
                  </td>
                  <td className="adm-member-name">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="adm-dim">{r.email}</td>
                  <td className="adm-dim">
                    {r.phone ? (
                      <>
                        <span className="adm-flag" aria-hidden="true">{flagEmoji(r.country)}</span>{" "}
                        {r.phone}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="adm-num">
                    <span className="chip chip-green">
                      {r.deposit_amount.toLocaleString("en-US")}
                    </span>
                  </td>
                  <td>
                    <span className="chip chip-blue">{r.deposit_currency}</span>
                  </td>
                  <td>
                    <span className="chip chip-sage">
                      {flagEmoji(r.country)} {r.country}
                    </span>
                  </td>
                  <td>
                    <span className={`st-pill st-${r.status}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="adm-dim adm-date">{fmtDate(r.created_at)}</td>
                  <td>
                    <EditSubmission
                      row={{
                        id: r.id,
                        token: r.token,
                        first_name: r.first_name,
                        last_name: r.last_name,
                        email: r.email,
                        phone: r.phone,
                        country: r.country,
                        deposit_amount: r.deposit_amount,
                        deposit_currency: r.deposit_currency,
                        status: r.status,
                        source_url: r.source_url,
                        ip: r.ip,
                        user_agent: r.user_agent,
                        fbp: r.fbp,
                        fbc: r.fbc,
                        created_at: r.created_at,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="adm-pager">
        <span>
          {total === 0
            ? "0 submissions"
            : `Showing ${offset + 1}–${offset + rows.length} of ${total}`}
        </span>
        {pageCount > 1 && (
          <nav className="adm-pages" aria-label="Pages">
            {page > 1 ? (
              <Link className="adm-page" href={pageHref(page - 1)} aria-label="Previous page">
                ‹
              </Link>
            ) : (
              <span className="adm-page is-disabled">‹</span>
            )}
            {pageList(page, pageCount).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="adm-page-gap">
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  className={`adm-page${p === page ? " is-current" : ""}`}
                  href={pageHref(p)}
                  aria-current={p === page ? "page" : undefined}
                >
                  {p}
                </Link>
              ),
            )}
            {page < pageCount ? (
              <Link className="adm-page" href={pageHref(page + 1)} aria-label="Next page">
                ›
              </Link>
            ) : (
              <span className="adm-page is-disabled">›</span>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
