import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // Relative Location: behind the proxy `req.url` is the internal origin
  // (localhost:8080), so an absolute redirect would leave the site.
  const res = new NextResponse(null, {
    status: 303,
    headers: { Location: "/admin/login" },
  });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
