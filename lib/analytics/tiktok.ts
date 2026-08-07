"use client";

type TikTokProperties = Record<string, unknown>;

type TikTokIdentity = {
  email?: string;
  phone_number?: string;
  external_id?: string;
};

type TikTokQueue = unknown[] & {
  identify?: (identity: TikTokIdentity) => void;
  page?: () => void;
  track?: (eventName: string, properties?: TikTokProperties) => void;
};

declare global {
  interface Window {
    ttq?: TikTokQueue;
  }
}

async function sha256(value: string | undefined): Promise<string | undefined> {
  const normalized = value?.trim();
  if (!normalized || !globalThis.crypto?.subtle) return undefined;

  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function trackTikTok(
  eventName: string,
  properties?: TikTokProperties,
): void {
  try {
    window.ttq?.track?.(eventName, properties);
  } catch {
    // Advertising analytics must never block the funnel.
  }
}

export async function identifyAndTrackTikTok(
  eventName: string,
  identity: {
    email?: string;
    phoneNumber?: string;
    externalId?: string;
  },
  properties?: TikTokProperties,
): Promise<void> {
  try {
    const [email, phoneNumber, externalId] = await Promise.all([
      sha256(identity.email?.trim().toLowerCase()),
      sha256(identity.phoneNumber),
      sha256(identity.externalId),
    ]);
    const hashedIdentity: TikTokIdentity = {
      ...(email && { email }),
      ...(phoneNumber && { phone_number: phoneNumber }),
      ...(externalId && { external_id: externalId }),
    };

    if (Object.keys(hashedIdentity).length > 0) {
      window.ttq?.identify?.(hashedIdentity);
    }
    window.ttq?.track?.(eventName, properties);
  } catch {
    // Never send unhashed identifiers or interrupt a successful conversion.
  }
}
