import { getDb } from "@/lib/db";

// Admin-user storage (D1 table admin_users, migration 0002). Password
// hashing/verification lives in lib/admin/auth.ts — this module never sees
// plaintext passwords.

export type Role = "admin" | "support";

export function isRole(v: unknown): v is Role {
  return v === "admin" || v === "support";
}

export type AdminUser = {
  id: number;
  username: string;
  role: Role;
  created_at: number;
};

export async function countUsers(): Promise<number> {
  const row = await getDb()
    .prepare("SELECT COUNT(*) AS n FROM admin_users")
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function countAdmins(): Promise<number> {
  const row = await getDb()
    .prepare("SELECT COUNT(*) AS n FROM admin_users WHERE role = 'admin'")
    .first<{ n: number }>();
  return row?.n ?? 0;
}

export async function getUserById(id: number): Promise<AdminUser | null> {
  return getDb()
    .prepare("SELECT id, username, role, created_at FROM admin_users WHERE id = ?1")
    .bind(id)
    .first<AdminUser>();
}

export async function getUserWithHash(
  username: string,
): Promise<(AdminUser & { password_hash: string }) | null> {
  return getDb()
    .prepare(
      "SELECT id, username, role, created_at, password_hash FROM admin_users WHERE username = ?1",
    )
    .bind(username)
    .first<AdminUser & { password_hash: string }>();
}

export async function listUsers(): Promise<AdminUser[]> {
  const { results } = await getDb()
    .prepare("SELECT id, username, role, created_at FROM admin_users ORDER BY id")
    .all<AdminUser>();
  return results;
}

/** Null when the username is already taken. */
export async function createUser(
  username: string,
  passwordHash: string,
  role: Role,
): Promise<AdminUser | null> {
  try {
    await getDb()
      .prepare(
        "INSERT INTO admin_users (username, password_hash, role) VALUES (?1, ?2, ?3)",
      )
      .bind(username, passwordHash, role)
      .run();
  } catch {
    return null; // UNIQUE violation
  }
  return getUserWithHash(username);
}

export async function updateUserRole(id: number, role: Role): Promise<void> {
  await getDb()
    .prepare("UPDATE admin_users SET role = ?2 WHERE id = ?1")
    .bind(id, role)
    .run();
}

export async function updateUserPassword(
  id: number,
  passwordHash: string,
): Promise<void> {
  await getDb()
    .prepare("UPDATE admin_users SET password_hash = ?2 WHERE id = ?1")
    .bind(id, passwordHash)
    .run();
}

export async function deleteUser(id: number): Promise<void> {
  await getDb().prepare("DELETE FROM admin_users WHERE id = ?1").bind(id).run();
}
