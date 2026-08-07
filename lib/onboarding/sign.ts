import crypto from "node:crypto";

// Signed onboarding links: /onboarding?id=<token>&sig=<signature>. The id is
// the 16-hex visitor token (first half of the click_id — exactly what the
// Telegram payload decoder outputs); the signature proves the link was issued
// by us, so forged ids never reach the form or the Purchase event.
//
// Spec, shared with the bot team (links do not expire):
//   sig = hex(HMAC-SHA256(ONBOARDING_LINK_SECRET, id)).slice(0, 32)

const TOKEN_RE = /^[0-9a-f]{16}$/;
const SIG_RE = /^[0-9a-f]{32}$/;

export function isToken(id: string): boolean {
  return TOKEN_RE.test(id);
}

/** "" when the id is malformed or ONBOARDING_LINK_SECRET is unset. */
export function signToken(id: string): string {
  const secret = process.env.ONBOARDING_LINK_SECRET ?? "";
  if (!secret || !isToken(id)) return "";
  return crypto
    .createHmac("sha256", secret)
    .update(id)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Fails closed: malformed id, malformed sig, or missing secret all reject.
 * Pure HMAC — validity never depends on whether the id "exists", so the
 * error path leaks nothing.
 */
export function verifyToken(id: string, sig: string): boolean {
  const expected = signToken(id);
  const given = sig.toLowerCase();
  if (!expected || !SIG_RE.test(given)) return false;
  return crypto.timingSafeEqual(
    Buffer.from(given, "hex"),
    Buffer.from(expected, "hex"),
  );
}
