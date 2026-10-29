import { NextResponse } from "next/server";
import { COURSE_COOKIE, courseAuthEnabled, courseToken, normalizeCode } from "@/lib/courseAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOGIN = "/courses/messages/learn/login";

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

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const code = normalizeCode(String(form?.get("code") ?? ""));
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "anon";

  if (!courseAuthEnabled()) return seeOther(`${LOGIN}?e=off`);
  if (tooMany(ip)) return seeOther(`${LOGIN}?e=wait`);
  if (!code || code !== normalizeCode(process.env.COURSE_ACCESS_CODE || "")) {
    fails.set(ip, [...(fails.get(ip) ?? []), Date.now()]);
    return seeOther(`${LOGIN}?e=1`);
  }

  const res = seeOther("/courses/messages/learn");
  res.cookies.set(COURSE_COOKIE, await courseToken(), {
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
