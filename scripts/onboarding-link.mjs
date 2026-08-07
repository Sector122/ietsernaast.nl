import crypto from "node:crypto";

const TOKEN_RE = /^[0-9a-f]{16}$/;
const token = (process.argv[2] ?? "").trim().toLowerCase();

if (!TOKEN_RE.test(token)) {
  console.error("Usage: pnpm onboarding:link <16-hex-token>");
  process.exitCode = 1;
} else {
  try {
    process.loadEnvFile?.(".env.local");
  } catch {
    // The secret may already be present in the shell environment.
  }

  const secret = process.env.ONBOARDING_LINK_SECRET ?? "";
  if (!secret) {
    console.error("ONBOARDING_LINK_SECRET is not configured.");
    process.exitCode = 1;
  } else {
    const signature = crypto
      .createHmac("sha256", secret)
      .update(token)
      .digest("hex")
      .slice(0, 32);
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sector1eu.com")
      .replace(/\/$/, "");
    console.log(`${siteUrl}/onboarding?id=${token}&sig=${signature}`);
  }
}