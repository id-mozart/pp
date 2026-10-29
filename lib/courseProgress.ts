import { hmacHex } from "@/lib/courseAuth";

/**
 * Прогрес учня в курсі: які опитувальники складено і з яким балом.
 * Зберігається в підписаній cookie (підпис — HMAC кодом доступу, як і сам вхід),
 * бо в курсі один спільний код, а не особисті акаунти. Прогрес — на пристрій;
 * на іншому пристрої учень проходить тести знову (вони короткі). Повна історія
 * спроб з іменем і телефоном додатково пишеться в Postgres для адмінки.
 *
 * Формат: "1:6,2:7.<hmac>" — пари «номер тесту : найкращий бал».
 */

export const PROGRESS_COOKIE = "pp_course_progress";
export const STUDENT_COOKIE = "pp_course_student";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 100; // як і доступ до курсу

export type Progress = Record<number, number>; // quiz n → найкращий бал
export type Student = { name: string; phone: string };

function body(p: Progress) {
  return Object.keys(p)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => `${n}:${p[n]}`)
    .join(",");
}

export async function serializeProgress(p: Progress): Promise<string> {
  const b = body(p);
  return `${b}.${await hmacHex("progress:" + b)}`;
}

export async function parseProgress(cookie?: string | null): Promise<Progress> {
  if (!cookie) return {};
  const i = cookie.lastIndexOf(".");
  if (i < 0) return {};
  const b = cookie.slice(0, i);
  const sig = cookie.slice(i + 1);
  const expected = await hmacHex("progress:" + b);
  if (sig.length !== expected.length) return {};
  let diff = 0;
  for (let k = 0; k < sig.length; k++) diff |= sig.charCodeAt(k) ^ expected.charCodeAt(k);
  if (diff !== 0) return {};
  const out: Progress = {};
  if (!b) return out;
  for (const pair of b.split(",")) {
    const [n, s] = pair.split(":").map(Number);
    if (Number.isInteger(n) && Number.isInteger(s)) out[n] = s;
  }
  return out;
}

export function parseStudent(cookie?: string | null): Student | null {
  if (!cookie) return null;
  try {
    const v = JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"));
    if (v && typeof v.name === "string" && typeof v.phone === "string") return { name: v.name, phone: v.phone };
  } catch {
    /* зіпсована cookie — просто попросимо дані ще раз */
  }
  return null;
}

export function serializeStudent(s: Student): string {
  return Buffer.from(JSON.stringify(s), "utf8").toString("base64url");
}

/** Телефон: лишаємо «+» і цифри. */
export function normalizePhone(v: string) {
  const digits = v.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? "+" + digits.slice(1).replace(/\+/g, "") : digits;
}
