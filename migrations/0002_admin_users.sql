-- Admin-area users. Passwords are PBKDF2-SHA256 hashes (lib/admin/auth.ts).
-- Roles: 'admin' manages users + sees submissions + generates links;
-- 'support' only generates onboarding links.
CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'support')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())  -- epoch seconds
);
