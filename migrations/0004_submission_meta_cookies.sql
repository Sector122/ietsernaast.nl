-- Member's Meta browser cookies captured at submission time. Replayed on the
-- admin-verified Purchase event (fired without the member's request) — fbc
-- carries the fbclid, the strongest match signal Meta accepts.
ALTER TABLE onboarding_submissions ADD COLUMN fbp TEXT;
ALTER TABLE onboarding_submissions ADD COLUMN fbc TEXT;
