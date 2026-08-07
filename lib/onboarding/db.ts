import { getDb } from "@/lib/db";

// D1 access for onboarding submissions. Server-only; all SQL lives here.

export type Submission = {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string;
  depositAmount: number;
  depositCurrency: string;
  sourceUrl: string | null;
  ip: string | null;
  userAgent: string | null;
  fbp: string | null;
  fbc: string | null;
};

/** Inserts a submission and returns its new row id (the AUTOINCREMENT `id`). */
export async function insertSubmission(s: Submission): Promise<number> {
  // Status is 'handled' (not the 'pending' default): the form is filled AFTER
  // the user has deposited, so every submission is already a verified deposit.
  const result = await getDb()
    .prepare(
      `INSERT INTO onboarding_submissions
         (token, first_name, last_name, email, phone, country,
          deposit_amount, deposit_currency, source_url, ip, user_agent, fbp, fbc,
          status)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, 'handled')`,
    )
    .bind(
      s.token,
      s.firstName,
      s.lastName,
      s.email,
      s.phone,
      s.country,
      s.depositAmount,
      s.depositCurrency,
      s.sourceUrl,
      s.ip,
      s.userAgent,
      s.fbp,
      s.fbc,
    )
    .run();
  return Number(result.meta?.last_row_id ?? 0);
}

export type TokenStats = {
  count: number;
  /** Epoch ms of the latest submission, null when there is none. */
  lastAt: number | null;
};

export type SubmissionStatus = "pending" | "handled" | "canceled";

export function isSubmissionStatus(v: unknown): v is SubmissionStatus {
  return v === "pending" || v === "handled" || v === "canceled";
}

export type SubmissionRow = {
  id: number;
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  deposit_amount: number;
  deposit_currency: string;
  source_url: string | null;
  ip: string | null;
  user_agent: string | null;
  fbp: string | null;
  fbc: string | null;
  status: SubmissionStatus;
  created_at: number;
};

const SEARCH_SQL = `(?1 IS NULL
  OR first_name || ' ' || last_name LIKE ?1
  OR email LIKE ?1
  OR token LIKE ?1
  OR country LIKE ?1)`;

function searchPattern(q?: string): string | null {
  return q ? `%${q}%` : null;
}

export type SubmissionFilter = {
  q?: string;
  status?: SubmissionStatus;
  since?: number;
};

const FILTER_SQL = `${SEARCH_SQL}
  AND (?2 IS NULL OR status = ?2)
  AND (?3 IS NULL OR created_at >= ?3)`;

function filterBinds(
  filter: SubmissionFilter,
): [string | null, string | null, number | null] {
  return [searchPattern(filter.q), filter.status ?? null, filter.since ?? null];
}

export async function listSubmissions(
  options: SubmissionFilter & { limit?: number; offset?: number } = {},
): Promise<SubmissionRow[]> {
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 5000);
  const offset = Math.max(options.offset ?? 0, 0);
  const { results } = await getDb()
    .prepare(
      `SELECT * FROM onboarding_submissions
       WHERE ${FILTER_SQL}
       ORDER BY id DESC
       LIMIT ?4 OFFSET ?5`,
    )
    .bind(...filterBinds(options), limit, offset)
    .all<SubmissionRow>();
  return results;
}

export async function countMatchingSubmissions(
  filter: SubmissionFilter = {},
): Promise<number> {
  const row = await getDb()
    .prepare(
      `SELECT COUNT(*) AS n FROM onboarding_submissions
       WHERE ${FILTER_SQL}`,
    )
    .bind(...filterBinds(filter))
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function getSubmissionById(
  id: number,
): Promise<SubmissionRow | null> {
  return getDb()
    .prepare("SELECT * FROM onboarding_submissions WHERE id = ?1")
    .bind(id)
    .first<SubmissionRow>();
}

export type EditableSubmission = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  deposit_amount: number;
  deposit_currency: string;
  status: SubmissionStatus;
};

export async function updateSubmission(
  id: number,
  fields: EditableSubmission,
): Promise<void> {
  await getDb()
    .prepare(
      `UPDATE onboarding_submissions
       SET first_name = ?2, last_name = ?3, email = ?4, phone = ?5,
           country = ?6, deposit_amount = ?7, deposit_currency = ?8, status = ?9
       WHERE id = ?1`,
    )
    .bind(
      id,
      fields.first_name,
      fields.last_name,
      fields.email,
      fields.phone,
      fields.country,
      fields.deposit_amount,
      fields.deposit_currency,
      fields.status,
    )
    .run();
}

export async function claimConversion(token: string): Promise<boolean> {
  const result = await getDb()
    .prepare(
      "INSERT OR IGNORE INTO onboarding_conversion_claims (token) VALUES (?1)",
    )
    .bind(token)
    .run();
  return result.meta?.changes === 1;
}

export async function tokenStats(token: string): Promise<TokenStats> {
  const row = await getDb()
    .prepare(
      "SELECT COUNT(*) AS n, MAX(created_at) AS last FROM onboarding_submissions WHERE token = ?1",
    )
    .bind(token)
    .first<{ n: number; last: number | null }>();
  return { count: row?.n ?? 0, lastAt: row?.last != null ? row.last * 1000 : null };
}
