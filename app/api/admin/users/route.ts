import { NextRequest, NextResponse } from "next/server";
import { apiUser, hashPassword } from "@/lib/admin/auth";
import {
  countAdmins,
  createUser,
  deleteUser,
  getUserById,
  isRole,
  updateUserPassword,
  updateUserRole,
} from "@/lib/admin/users";
import { USERNAME_RE, MIN_PASSWORD_LENGTH } from "@/lib/admin/validation";

// User management — admin role only. The one invariant: never leave the table
// without an admin (a support-only user set can't manage users, and the
// bootstrap endpoint only reopens when the table is completely empty).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bad(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

async function requireAdminApi(req: NextRequest) {
  const user = await apiUser(req);
  return user?.role === "admin" ? user : null;
}

export async function POST(req: NextRequest) {
  const actor = await requireAdminApi(req);
  if (!actor) return bad("unauthorized", 401);

  let body: { username?: string; password?: string; role?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return bad("invalid_json");
  }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!USERNAME_RE.test(username)) return bad("invalid_username");
  if (password.length < MIN_PASSWORD_LENGTH) return bad("weak_password");
  if (!isRole(body.role)) return bad("invalid_role");

  const user = await createUser(username, hashPassword(password), body.role);
  if (!user) return bad("username_taken", 409);
  return NextResponse.json({ ok: true, id: user.id });
}

export async function PATCH(req: NextRequest) {
  const actor = await requireAdminApi(req);
  if (!actor) return bad("unauthorized", 401);

  let body: { id?: number; role?: string; password?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return bad("invalid_json");
  }
  const id = body.id;
  if (typeof id !== "number" || !Number.isSafeInteger(id)) return bad("invalid_id");
  const target = await getUserById(id);
  if (!target) return bad("not_found", 404);

  if (body.role !== undefined) {
    if (!isRole(body.role)) return bad("invalid_role");
    if (
      target.role === "admin" &&
      body.role !== "admin" &&
      (await countAdmins()) <= 1
    ) {
      return bad("last_admin");
    }
    await updateUserRole(id, body.role);
  }

  if (body.password !== undefined) {
    if (typeof body.password !== "string" || body.password.length < MIN_PASSWORD_LENGTH) {
      return bad("weak_password");
    }
    await updateUserPassword(id, hashPassword(body.password));
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const actor = await requireAdminApi(req);
  if (!actor) return bad("unauthorized", 401);

  let body: { id?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return bad("invalid_json");
  }
  const id = body.id;
  if (typeof id !== "number" || !Number.isSafeInteger(id)) return bad("invalid_id");
  const target = await getUserById(id);
  if (!target) return bad("not_found", 404);

  if (target.role === "admin" && (await countAdmins()) <= 1) {
    return bad("last_admin");
  }

  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
