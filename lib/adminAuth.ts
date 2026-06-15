/**
 * Shared-password gate for /admin. Edge-safe (Web Crypto only, no node deps),
 * so it works both in middleware (edge) and route handlers (node).
 *
 * The session cookie holds an HMAC of a constant message keyed by
 * ADMIN_PASSWORD — verifiable statelessly by recomputing it. If ADMIN_PASSWORD
 * is unset, auth is OFF (open) so the panel is reachable during setup; set the
 * env var to lock it down.
 */

export const ADMIN_COOKIE = "pp_admin";
const MSG = "pp-admin-session-v1";

export function authEnabled() {
  return !!process.env.ADMIN_PASSWORD;
}

export async function sessionToken(
  password = process.env.ADMIN_PASSWORD || "",
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(MSG));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidToken(token?: string | null): Promise<boolean> {
  if (!authEnabled()) return true; // not configured yet → open
  if (!token) return false;
  const expected = await sessionToken();
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++)
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
