import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getUserById, type AdminUser } from "@/lib/admin/users";

// Admin auth: username/password against admin_users (D1), then a stateless
// signed-session cookie:
//   s1_admin = "<expiry epoch ms>.<user id>.<hmac>"
//   hmac = hex(HMAC-SHA256(ADMIN_SESSION_SECRET, "admin:<uid>:<expiry>")).slice(0, 32)
// The cookie only proves "this uid logged in"; the user row is re-fetched on
// every request, so deleting a user or changing their role applies instantly.
// Rotating ADMIN_SESSION_SECRET logs everyone out at once.
//
// Layouts are NOT a security boundary in the app router — every admin page
// calls requireUser() and every admin API route calls apiUser().

export const ADMIN_COOKIE = "s1_admin";
export const SESSION_TTL_S = 7 * 24 * 60 * 60;

// PBKDF2-HMAC-SHA256 work factor. Cloudflare Workers HARD-CAP PBKDF2 at 100000
// iterations — anything higher throws "iteration counts above 100000 are not
// supported" at hash time. So this is the ceiling on Workers, not a tuning
// choice; do not raise it. verifyPassword reads the count from the stored hash.
const PBKDF2_ITERATIONS = 100_000;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, "sha256");
  return `pbkdf2:${PBKDF2_ITERATIONS}:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, iterStr, saltHex, hashHex] = stored.split(":");
  if (scheme !== "pbkdf2" || !iterStr || !saltHex || !hashHex) return false;
  const iterations = Number(iterStr);
  if (!Number.isSafeInteger(iterations) || iterations < 1) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.pbkdf2Sync(
    password,
    Buffer.from(saltHex, "hex"),
    iterations,
    expected.length,
    "sha256",
  );
  return crypto.timingSafeEqual(actual, expected);
}

function sessionHmac(uid: number, exp: number, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`admin:${uid}:${exp}`)
    .digest("hex")
    .slice(0, 32);
}

/** "" when ADMIN_SESSION_SECRET is unset (fail closed). */
export function createSessionValue(userId: number): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!secret) return "";
  const exp = Date.now() + SESSION_TTL_S * 1000;
  return `${exp}.${userId}.${sessionHmac(userId, exp, secret)}`;
}

/** User id from a valid, unexpired cookie value; null otherwise. */
function parseSessionValue(value: string | undefined): number | null {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!secret || !value) return null;
  const [expStr, uidStr, sig] = value.split(".");
  const exp = Number(expStr);
  const uid = Number(uidStr);
  if (!Number.isSafeInteger(exp) || exp < Date.now()) return null;
  if (!Number.isSafeInteger(uid) || uid < 1) return null;
  if (!sig || !/^[0-9a-f]{32}$/.test(sig)) return null;
  const ok = crypto.timingSafeEqual(
    Buffer.from(sig, "hex"),
    Buffer.from(sessionHmac(uid, exp, secret), "hex"),
  );
  return ok ? uid : null;
}

/** Session user for server components; null when logged out. */
export async function sessionUser(): Promise<AdminUser | null> {
  const jar = await cookies();
  const uid = parseSessionValue(jar.get(ADMIN_COOKIE)?.value);
  if (uid === null) return null;
  try {
    return await getUserById(uid);
  } catch {
    return null;
  }
}

/**
 * Page guard — call first in every admin server component. Logged out →
 * login page; role too low → the link generator (the one page every role has).
 */
export async function requireUser(role?: "admin"): Promise<AdminUser> {
  const user = await sessionUser();
  if (!user) redirect("/admin/login");
  if (role === "admin" && user.role !== "admin") redirect("/admin/link");
  return user;
}

/** Route-handler guard; null when the request carries no valid session. */
export async function apiUser(req: NextRequest): Promise<AdminUser | null> {
  const uid = parseSessionValue(req.cookies.get(ADMIN_COOKIE)?.value);
  if (uid === null) return null;
  try {
    return await getUserById(uid);
  } catch {
    return null;
  }
}
