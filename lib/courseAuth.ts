/**
 * Доступ до закритого розділу курсу (/courses/messages/learn).
 * Той самий підхід, що й у /admin (lib/adminAuth): cookie зберігає HMAC
 * сталого повідомлення, підписаний кодом доступу з COURSE_ACCESS_CODE.
 * Edge-safe (лише Web Crypto) — працює і в middleware, і в route handlers.
 * Якщо COURSE_ACCESS_CODE не задано — розділ закритий (не відкритий, як адмінка):
 * матеріали платні, тож помилка конфігурації не має їх оголювати.
 */

export const COURSE_COOKIE = "pp_course";
const MSG = "pp-course-messages-v1";

export function courseAuthEnabled() {
  return !!process.env.COURSE_ACCESS_CODE;
}

/** Код порівнюється без урахування регістру та пробілів — учні вводять його з телефону. */
export function normalizeCode(v: string) {
  return v.replace(/\s+/g, "").toLowerCase();
}

/** HMAC-SHA256 (hex) довільного повідомлення, ключ — код доступу. Спільний для cookie входу і прогресу. */
export async function hmacHex(msg: string, code = process.env.COURSE_ACCESS_CODE || ""): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(normalizeCode(code) || "-"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function courseToken(code = process.env.COURSE_ACCESS_CODE || ""): Promise<string> {
  return hmacHex(MSG, code);
}

export async function isValidCourseToken(token?: string | null): Promise<boolean> {
  if (!courseAuthEnabled() || !token) return false;
  const expected = await courseToken();
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
