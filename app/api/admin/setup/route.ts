import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_TTL_S,
  createSessionValue,
  hashPassword,
} from "@/lib/admin/auth";
import { countUsers, createUser } from "@/lib/admin/users";
import { USERNAME_RE, MIN_PASSWORD_LENGTH } from "@/lib/admin/validation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { clientIp } from "@/lib/http/ip";
import { rateLimit } from "@/lib/rate-limit";

// First-run bootstrap: creates the initial admin account, but ONLY while the
// admin_users table is empty. Once any user exists this endpoint is dead, so
// there's no seed script and no shared bootstrap secret to manage.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Per-IP rate limit so the bootstrap window can't be hammered.
  const limiter = getCloudflareContext().env.LOGIN_RATE_LIMITER;
  if (!(await rateLimit(limiter, `setup:${clientIp(req) || "unknown"}`))) {
    return NextResponse.json(
      { error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  if ((await countUsers()) > 0) {
    return NextResponse.json({ error: "already_set_up" }, { status: 403 });
  }

  // Verify the session secret is configured BEFORE creating the admin row.
  // Otherwise createUser would commit an admin that can never be logged into
  // (createSessionValue returns "" without the secret) yet permanently closes
  // the bootstrap window — locking out the real owner.
  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  let username = "";
  let password = "";
  try {
    const body = (await req.json()) as { username?: string; password?: string };
    if (typeof body.username === "string") username = body.username.trim();
    if (typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!USERNAME_RE.test(username)) {
    return NextResponse.json({ error: "invalid_username" }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }

  const user = await createUser(username, hashPassword(password), "admin");
  if (!user) {
    return NextResponse.json({ error: "username_taken" }, { status: 409 });
  }

  const value = createSessionValue(user.id);
  if (!value) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_S,
  });
  return res;
}
