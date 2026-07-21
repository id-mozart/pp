import { NextResponse } from "next/server";
import {
  listTalkVariants,
  saveTalkVariant,
  deleteTalkVariant,
  countTalkVariants,
  type TalkEdit,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Talk-deck text variants (e.g. the standalone /talk/sf2026 keynote).
 * Public by design — anyone with the (secret) deck link can save/load named
 * snapshots of text overrides. Hardened by input caps, a per-instance rate
 * limit keyed on the real client IP, a per-deck variant cap, and a body-size
 * guard; the deck applies edits through a safe inline-only HTML sanitizer, so
 * stored markup can never execute script.
 */

const DECK_RE = /^[a-z0-9-]{1,40}$/;
const EID_RE = /^[0-9]{1,3}\/[0-9]{1,4}$/; // slide/index, exactly how the deck assigns
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_EDITS = 300;
const MAX_HTML = 8_000; // per text node
const MAX_NAME = 120;
const MAX_VARIANTS = 60; // per deck
const MAX_BODY = 512 * 1024; // 512 KB

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

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

/* Per-instance rate limit: 30 writes / 10 min per client, with pruning so a
   flood of distinct keys can't grow the Map without bound. */
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
  return arr.length > 30;
}

function normEdits(raw: unknown): TalkEdit[] | null {
  if (!Array.isArray(raw)) return null;
  if (raw.length > MAX_EDITS) return null;
  const out: TalkEdit[] = [];
  for (const e of raw) {
    if (!e || typeof e !== "object") return null;
    const eid = clip((e as Record<string, unknown>).eid, 12);
    const html = clip((e as Record<string, unknown>).html, MAX_HTML);
    const orig = clip((e as Record<string, unknown>).orig, 400);
    if (!EID_RE.test(eid)) return null;
    out.push(orig ? { eid, html, orig } : { eid, html });
  }
  return out;
}

export async function GET(req: Request) {
  const deck = clip(new URL(req.url).searchParams.get("deck"), 40);
  if (!DECK_RE.test(deck)) {
    return NextResponse.json({ ok: false, error: "bad_deck" }, { status: 400 });
  }
  const variants = await listTalkVariants(deck);
  return NextResponse.json({ ok: true, variants });
}

export async function POST(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const deck = clip(body.deck, 40);
  const name = clip(body.name, MAX_NAME);
  const rawId = body.id ? clip(body.id, 40) : undefined;
  const edits = normEdits(body.edits);

  if (!DECK_RE.test(deck)) {
    return NextResponse.json({ ok: false, error: "bad_deck" }, { status: 400 });
  }
  if (rawId && !UUID_RE.test(rawId)) {
    return NextResponse.json({ ok: false, error: "bad_id" }, { status: 422 });
  }
  if (!name) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 422 });
  }
  if (!edits) {
    return NextResponse.json({ ok: false, error: "bad_edits" }, { status: 422 });
  }

  // Cap the number of NEW variants per deck (updates by id are exempt).
  if (!rawId && (await countTalkVariants(deck)) >= MAX_VARIANTS) {
    return NextResponse.json({ ok: false, error: "too_many" }, { status: 409 });
  }

  const savedId = await saveTalkVariant({ id: rawId, deck, name, edits });
  if (!savedId) {
    return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, id: savedId });
}

export async function DELETE(req: Request) {
  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  const sp = new URL(req.url).searchParams;
  const deck = clip(sp.get("deck"), 40);
  const id = clip(sp.get("id"), 40);
  if (!DECK_RE.test(deck) || !UUID_RE.test(id)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  await deleteTalkVariant(id, deck);
  return NextResponse.json({ ok: true });
}
