import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_TTL_S,
  createSessionValue,
  verifyPassword,
} from "@/lib/admin/auth";
import { getUserWithHash } from "@/lib/admin/users";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { clientIp } from "@/lib/http/ip";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export async function POST(req: NextRequest) {
  // Per-IP rate limit (5/min, wrangler.toml LOGIN_RATE_LIMITER). Blocks
  // password guessing without any server-side state to store or clean up.
  const limiter = getCloudflareContext().env.LOGIN_RATE_LIMITER;
  if (!(await rateLimit(limiter, `login:${clientIp(req) || "unknown"}`))) {
    return NextResponse.json(
      { error: "too_many_attempts" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
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

  const user = username && password ? await getUserWithHash(username) : null;
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "invalid_login" }, { status: 401 });
  }

  const value = createSessionValue(user.id);
  if (!value) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(ADMIN_COOKIE, value, { ...COOKIE_OPTS, maxAge: SESSION_TTL_S });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}
