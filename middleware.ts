import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, authEnabled, isValidToken } from "@/lib/adminAuth";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  isLocale,
  matchLocale,
  stripLocale,
} from "@/lib/i18n/config";

export const config = {
  // Run on everything except Next internals and static files (anything with a dot).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

const YEAR = 60 * 60 * 24 * 365;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ---- Admin panel + admin API: auth only, never localized. ----
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname.startsWith("/api/admin")
  ) {
    return adminGuard(req);
  }

  // ---- Other API routes: pass through, no locale handling. ----
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ---- Секретні розділи /talk/<slug>: статичний дек, без локалізації. ----
  // Файли з крапкою (deck-stage.js, assets/*.svg) matcher і так пропускає;
  // тут лише переписуємо «гарний» URL на index.html.
  if (pathname === "/talk" || pathname.startsWith("/talk/")) {
    const slug = pathname.replace(/^\/talk\/?/, "").replace(/\/$/, "");
    if (!slug) return NextResponse.next(); // /talk без слага — 404 роутера
    const url = req.nextUrl.clone();
    url.pathname = `/talk/${slug}/index.html`;
    const res = NextResponse.rewrite(url);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // ---- Public site: locale routing. ----
  const seg = pathname.split("/")[1];

  if (isLocale(seg)) {
    // Already prefixed (/ru/b2b): rewrite to the un-prefixed page, pass locale on.
    const url = req.nextUrl.clone();
    url.pathname = stripLocale(pathname);
    const headers = new Headers(req.headers);
    headers.set(LOCALE_HEADER, seg);
    const res = NextResponse.rewrite(url, { request: { headers } });
    res.cookies.set(LOCALE_COOKIE, seg, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  // No locale prefix → redirect to the visitor's language (cookie → browser → default).
  const cookieLoc = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLoc)
    ? cookieLoc
    : matchLocale(req.headers.get("accept-language")) || DEFAULT_LOCALE;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

/** Admin auth gate (unchanged behaviour from the previous middleware). */
async function adminGuard(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }
  if (!authEnabled()) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (await isValidToken(token)) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
