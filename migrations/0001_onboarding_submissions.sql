-- Onboarding form submissions (/onboarding → /api/onboarding). Append-only:
-- no UNIQUE on token, so corrected resubmissions are kept for the admin audit
-- trail; Purchase-event dedup happens in code (first submission per token).
CREATE TABLE onboarding_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL,             -- 16-hex visitor token from the signed link
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,                      -- "+<dial><digits>", NULL when omitted
  country TEXT NOT NULL,           -- ISO 3166-1 alpha-2
  deposit_amount REAL NOT NULL,
  deposit_currency TEXT NOT NULL,  -- ISO 4217
  source_url TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())  -- epoch seconds
);

CREATE INDEX idx_onboarding_submissions_token ON onboarding_submissions (token);
CREATE INDEX idx_onboarding_submissions_created ON onboarding_submissions (created_at DESC);
