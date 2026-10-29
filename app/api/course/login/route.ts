import { NextResponse } from "next/server";
import { COURSE_COOKIE, courseAuthEnabled, courseToken, normalizeCode, personalCodesEnabled, sharedCodeEnabled, userToken } from "@/lib/courseAuth";
import { getCourseUserByCode, touchCourseUser } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOGIN = "/courses/messages/learn/login";
const COURSE = "messages";

/** 303 з відносним Location — за проксі абсолютна адреса вела б на внутрішній origin. */
function seeOther(location: string) {
  return new NextResponse(null, { status: 303, headers: { Location: location } });
}

/* Проста затримка невдалих спроб: код короткий, тож перебір треба гальмувати. */
const fails = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const arr = (fails.get(ip) ?? []).filter((t) => now - t < 15 * 60 * 1000);
  fails.set(ip, arr);
  if (fails.size > 5000) fails.clear();
  return arr.length >= 10;
}

/**
 * Вхід: спершу персональний код учня з БД (course_users), потім — спільний код з env,
 * якщо він ще заданий. Персональна сесія — токен з id учня; відкликаний код не пускає.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const code = normalizeCode(String(form?.get("code") ?? ""));
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "anon";

  if (!courseAuthEnabled()) return seeOther(`${LOGIN}?e=off`);
  if (tooMany(ip)) return seeOther(`${LOGIN}?e=wait`);

  let token: string | null = null;
  if (code && personalCodesEnabled()) {
    const u = await getCourseUserByCode(COURSE, code);
    if (u?.revoked_at) return seeOther(`${LOGIN}?e=revoked`);
    if (u) {
      token = await userToken(u.id);
      await touchCourseUser(u.id);
    }
  }
  if (!token && code && sharedCodeEnabled() && code === normalizeCode(process.env.COURSE_ACCESS_CODE || "")) {
    token = await courseToken();
  }
  if (!token) {
    fails.set(ip, [...(fails.get(ip) ?? []), Date.now()]);
    return seeOther(`${LOGIN}?e=1`);
  }

  const res = seeOther("/courses/messages/learn");
  res.cookies.set(COURSE_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 100, // доступ до курсу — 3 місяці
  });
  return res;
}

export async function DELETE() {
  const res = seeOther(LOGIN);
  res.cookies.set(COURSE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
