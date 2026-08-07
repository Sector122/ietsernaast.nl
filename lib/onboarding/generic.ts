// A reserved token used internally by the bare, unsigned /onboarding form for
// people with no attributable ad click (offline/manual leads, etc.).
//
// It is a valid 16-hex token, so it signs and verifies exactly like any other
// link. What differs is how the onboarding route treats it:
//   - no external_id sent to Meta (there is no click to join to),
//   - no per-token resubmit throttle (the token is shared, not per-person),
//   - the Purchase is keyed per submission row (not per token), since the
//     shared token can't gate one conversion per person.
//
// Client-safe (no node:crypto) so the form and server route can both import it.
export const GENERIC_TOKEN = "0000000000000000";

export function isGenericToken(token: string): boolean {
  return token === GENERIC_TOKEN;
}
