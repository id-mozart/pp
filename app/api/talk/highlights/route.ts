import { NextResponse } from "next/server";
import { getContent, setContent } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Server-side settings for the Instagram highlights mockup (/talk/instagram).
 *
 * The mockup keeps its editing state in four localStorage keys; that made the
 * layout device-local (a picked photo or a reorder was invisible on any other
 * machine, and highlights whose photo is only a saved pick rendered empty).
 * This endpoint mirrors those keys into the shared `content` table so the
 * mockup looks the same everywhere.
 *
 * Public by design, like the talk-deck variants: the page is unlisted, and the
 * payload is inert data (numbers plus data-URL images) that the mockup only
 * ever assigns to background-image / dataset — never to innerHTML. Hardened by
 * a body-size cap, a per-instance rate limit on the real client IP, and a
 * strict key whitelist so nothing else can be parked in the row.
 */

const KEY = "ig-highlights";
const ALLOWED = ["hlOrder", "hlDeco", "hlPhotos", "hlAdjust"] as const;
const MAX_BODY = 12 * 1024 * 1024; // 12 MB — picked photos ride along as data URLs

/* Real client IP: behind Cloudflare/Railway, cf-connecting-ip is the true
   client and NOT client-spoofable (unlike the leftmost x-forwarded-for hop). */
function clientIp(req: Request) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anon"
  );
}

/* Per-instance rate limit: 60 writes / 10 min per client (the mockup saves on
   every slider nudge, debounced), with pruning so a flood of distinct keys
   can't grow the Map without bound. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const WINDOW = 10 * 60 * 1000;
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.length || now - v[v.length - 1] > WINDOW) hits.delete(k);
    }
    if (hits.size > 20000) hits.clear(); // hard OOM backstop
  }
  return arr.length > 60;
}

export async function GET() {
  const data = await getContent<Record<string, unknown>>(KEY);
  return NextResponse.json(
    { ok: true, data: data ?? null },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "bad_body" }, { status: 422 });
  }

  // Whitelist: store only the four known keys, drop everything else.
  const src = body as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  for (const k of ALLOWED) if (src[k] !== undefined) data[k] = src[k];
  if (!Object.keys(data).length) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 422 });
  }

  // Serialized size guard (content-length can be absent or lie).
  if (JSON.stringify(data).length > MAX_BODY) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  const saved = await setContent(KEY, data);
  if (!saved) {
    return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, saved: Object.keys(data) });
}
