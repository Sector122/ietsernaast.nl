-- Support workflow state for the admin table: every submission starts
-- pending; admins mark it handled (approved into the VIP group) or canceled.
ALTER TABLE onboarding_submissions
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'handled', 'canceled'));
