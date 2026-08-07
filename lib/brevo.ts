// Server-only Brevo (formerly Sendinblue) contact upsert. Handoff email
// sign-ups are added as contacts and subscribed to a list so Brevo can run the
// access-link / welcome follow-up sequence. No-op when BREVO_API_KEY is unset,
// so it stays inert until configured.

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

export type BrevoContact = {
  email: string;
  locale: string;
  clickId?: string;
  ctaLocation?: string;
  sourceUrl?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type BrevoResult = {
  ok: boolean;
  status?: number;
  skipped?: boolean;
  error?: string;
};

function listIds(): number[] {
  return (process.env.BREVO_LIST_ID ?? "")
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

async function postContact(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<Response> {
  return fetch(BREVO_CONTACTS_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
}

/**
 * Creates or updates a Brevo contact and subscribes it to the configured
 * list(s). `updateEnabled` makes re-submits idempotent. Custom attributes are
 * sent when present, but if the account hasn't defined them (Brevo replies
 * 400), we retry once with just the email + list so the subscribe still lands.
 */
export async function upsertBrevoContact(
  contact: BrevoContact,
): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { ok: false, skipped: true };

  const ids = listIds();
  const base: Record<string, unknown> = { email: contact.email, updateEnabled: true };
  if (ids.length) base.listIds = ids;

  const attributes: Record<string, string> = {};
  if (contact.locale) attributes.LOCALE = contact.locale;
  if (contact.clickId) attributes.CLICK_ID = contact.clickId;
  if (contact.ctaLocation) attributes.CTA_LOCATION = contact.ctaLocation;
  if (contact.sourceUrl) attributes.SOURCE_URL = contact.sourceUrl;
  if (contact.firstName) attributes.FIRSTNAME = contact.firstName;
  if (contact.lastName) attributes.LASTNAME = contact.lastName;
  if (contact.phone) attributes.SMS = contact.phone;

  try {
    const withAttrs =
      Object.keys(attributes).length > 0 ? { ...base, attributes } : base;
    let res = await postContact(apiKey, withAttrs);

    // Undefined custom attributes make Brevo reject the whole request — retry
    // without them so the contact is still created and subscribed.
    if (res.status === 400 && withAttrs !== base) {
      res = await postContact(apiKey, base);
    }

    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
