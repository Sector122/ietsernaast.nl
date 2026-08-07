import { NextRequest, NextResponse } from "next/server";
import { apiUser } from "@/lib/admin/auth";
import { isToken, signToken } from "@/lib/onboarding/sign";

// Signs an onboarding link for a decoded visitor token. Any admin-area role
// may call this — it's support's whole job.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await apiUser(req))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let token = "";
  try {
    const body = (await req.json()) as { token?: string };
    if (typeof body.token === "string") token = body.token.trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!isToken(token)) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  const sig = signToken(token);
  if (!sig) {
    return NextResponse.json({ error: "not_configured" }, { status: 500 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
  return NextResponse.json({ url: `${base}/onboarding?id=${token}&sig=${sig}` });
}
