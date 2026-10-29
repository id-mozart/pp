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

/**
 * Ключ підпису cookie: код доступу (щоб наявні сесії лишились чинними), інакше
 * COURSE_SECRET, інакше пароль адмінки. Без жодного — розділ закритий.
 */
export function courseSecret() {
  return process.env.COURSE_ACCESS_CODE || process.env.COURSE_SECRET || process.env.ADMIN_PASSWORD || "";
}

/** Спільний код (env) — застарілий режим; персональні коди живуть у БД. */
export function sharedCodeEnabled() {
  return !!process.env.COURSE_ACCESS_CODE;
}

/** Персональні коди потребують БД. Edge-safe: лише перевірка env. */
export function personalCodesEnabled() {
  return !!process.env.DATABASE_URL && !!courseSecret();
}

export function courseAuthEnabled() {
  return sharedCodeEnabled() || personalCodesEnabled();
}

export type CourseSession = { kind: "shared" } | { kind: "user"; id: string };

/** Код порівнюється без урахування регістру та пробілів — учні вводять його з телефону. */
export function normalizeCode(v: string) {
  return v.replace(/\s+/g, "").toLowerCase();
}

/** HMAC-SHA256 (hex) довільного повідомлення, ключ — код доступу. Спільний для cookie входу і прогресу. */
export async function hmacHex(msg: string, code = courseSecret()): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(normalizeCode(code) || "-"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function courseToken(code = process.env.COURSE_ACCESS_CODE || ""): Promise<string> {
  return hmacHex(MSG, code);
}

function same(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Токен персонального учня: "u.<id>.<hmac>" — перевіряється без БД (middleware). Відкликання перевіряє сторінка. */
export async function userToken(id: string): Promise<string> {
  return `u.${id}.${await hmacHex("user:" + id)}`;
}

export async function courseSession(token?: string | null): Promise<CourseSession | null> {
  if (!courseAuthEnabled() || !token) return null;
  if (token.startsWith("u.")) {
    if (!personalCodesEnabled()) return null;
    const [, id, sig] = token.split(".");
    if (!id || !sig || !/^[0-9a-f-]{36}$/.test(id)) return null;
    return same(sig, await hmacHex("user:" + id)) ? { kind: "user", id } : null;
  }
  if (!sharedCodeEnabled()) return null;
  return same(token, await courseToken()) ? { kind: "shared" } : null;
}

export async function isValidCourseToken(token?: string | null): Promise<boolean> {
  return (await courseSession(token)) !== null;
}
