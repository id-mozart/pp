import { NextResponse } from "next/server";
import { ADMIN_COOKIE, authEnabled, sessionToken } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeNext(n: string) {
  return n.startsWith("/admin") ? n : "/admin";
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const password = String(form?.get("password") ?? "");
  const next = safeNext(String(form?.get("next") ?? "/admin"));

  if (!authEnabled()) {
    return NextResponse.redirect(new URL(next, req.url), { status: 303 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("e", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  const res = NextResponse.redirect(new URL(next, req.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
