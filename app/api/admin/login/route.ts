import { NextResponse } from "next/server";
import { ADMIN_COOKIE, authEnabled, sessionToken } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeNext(n: string) {
  return n.startsWith("/admin") ? n : "/admin";
}

/**
 * 303 with a RELATIVE Location. Behind the CF-worker/Railway proxy `req.url`
 * is the internal origin (localhost:8080), so absolute redirects built from it
 * would send the browser off-site. Relative Location resolves against the
 * address the visitor actually used.
 */
function seeOther(location: string) {
  return new NextResponse(null, { status: 303, headers: { Location: location } });
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const password = String(form?.get("password") ?? "");
  const next = safeNext(String(form?.get("next") ?? "/admin"));

  if (!authEnabled()) {
    return seeOther(next);
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    const q = new URLSearchParams({ e: "1", next });
    return seeOther(`/admin/login?${q}`);
  }

  const res = seeOther(next);
  res.cookies.set(ADMIN_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
