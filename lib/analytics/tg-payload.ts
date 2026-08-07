// Invisible Telegram attribution payload.
//
// Telegram honours `?text=` (a prefilled draft) only on t.me/<username> links.
// We append this payload — the first 16 hex chars of the visitor click_id plus
// a 16-bit checksum, encoded as zero-width characters — to the localized draft
// text. The visitor sees only the visible message; when they send it, the
// received message still carries the invisible token, so an operator can paste
// the message into docs/tg-decode.html and join the Telegram user back to the
// on-site click (Mixpanel: click_id starts with the token).
//
// Encoding: base-4 over four zero-width code points, big-endian, 2 bits per
// character. 16 hex chars (64 bits) = 32 chars + 8 checksum chars = 40 total.
// docs/tg-decode.html reimplements decoding in plain JS — keep them in sync.

export const TOKEN_HEX_LENGTH = 16;

// Four Default_Ignorable code points that render as nothing in every major
// Telegram client and survive copy-paste. Deliberately NONE of them join or
// combine (no ZWJ/ZWNJ): a joiner landing next to an emoji in the visible
// draft can be normalized away by the client and corrupt the payload. Order
// defines the base-4 digit values.
const ALPHABET = ["\u200B", "\u2060", "\u2062", "\u2063"] as const;
// ZWSP, WORD JOINER, INVISIBLE TIMES, INVISIBLE SEPARATOR

const TOKEN_CHARS = TOKEN_HEX_LENGTH * 2; // 2 zero-width chars per hex nibble
const CHECKSUM_CHARS = 8; // 16 bits
export const PAYLOAD_CHARS = TOKEN_CHARS + CHECKSUM_CHARS;

const TOKEN_RE = /^[0-9a-f]{16}$/;

/**
 * First half of the 32-hex click_id. 64 bits stays collision-free at our
 * scale and keeps the invisible payload short. Returns "" when the click_id
 * is malformed (SSR, corrupted storage) so callers can skip stamping.
 */
export function tokenFromClickId(clickId: string): string {
  const token = clickId.slice(0, TOKEN_HEX_LENGTH).toLowerCase();
  return TOKEN_RE.test(token) ? token : "";
}

/**
 * FNV-1a 32-bit folded to 16 bits. A corruption check for the decode tool
 * (detects clients stripping characters or users editing mid-payload), not
 * cryptographic integrity.
 */
export function checksum16(token: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  hash >>>= 0;
  return (hash >>> 16) ^ (hash & 0xffff);
}

/** Encodes `bits` (≤ 30 bits) as `count` base-4 zero-width chars, big-endian. */
function bitsToZeroWidth(bits: number, count: number): string {
  let out = "";
  for (let i = count - 1; i >= 0; i--) {
    out += ALPHABET[(bits >>> (i * 2)) & 3];
  }
  return out;
}

/** Token (16 hex chars) → 40 invisible characters. "" for invalid tokens. */
export function encodePayload(token: string): string {
  if (!TOKEN_RE.test(token)) return "";
  let out = "";
  for (const ch of token) {
    out += bitsToZeroWidth(parseInt(ch, 16), 2);
  }
  return out + bitsToZeroWidth(checksum16(token), CHECKSUM_CHARS);
}

export type DecodedPayload = {
  token: string;
  /** False when the checksum fails — payload found but corrupted. */
  valid: boolean;
};

/**
 * Scans arbitrary text (a received Telegram message) for an embedded payload.
 * Returns the first checksum-valid token; failing that, the first
 * full-length-but-corrupted candidate; null when no payload-sized run exists.
 */
export function decodePayload(text: string): DecodedPayload | null {
  const digits = new Map<string, number>(ALPHABET.map((c, i) => [c, i]));

  const runs: number[][] = [];
  let run: number[] = [];
  for (const ch of text) {
    const digit = digits.get(ch);
    if (digit !== undefined) {
      run.push(digit);
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  }
  if (run.length) runs.push(run);

  let corrupted: DecodedPayload | null = null;
  for (const r of runs) {
    // Sliding window: tolerates stray zero-width chars abutting the payload.
    for (let start = 0; start + PAYLOAD_CHARS <= r.length; start++) {
      let token = "";
      for (let i = 0; i < TOKEN_CHARS; i += 2) {
        token += ((r[start + i]! << 2) | r[start + i + 1]!).toString(16);
      }
      let sum = 0;
      for (let i = 0; i < CHECKSUM_CHARS; i++) {
        sum = (sum << 2) | r[start + TOKEN_CHARS + i]!;
      }
      if (sum === checksum16(token)) return { token, valid: true };
      corrupted ??= { token, valid: false };
    }
  }
  return corrupted;
}
