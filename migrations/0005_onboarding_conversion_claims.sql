-- One conversion claim per attributed onboarding token. The unique token key
-- makes concurrent first submissions race safely: only one can report Purchase.
CREATE TABLE onboarding_conversion_claims (
  token TEXT PRIMARY KEY,
  claimed_at INTEGER NOT NULL DEFAULT (unixepoch())
);
