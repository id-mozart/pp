import { NextResponse } from "next/server";
import {
  listTalkVariants,
  saveTalkVariant,
  deleteTalkVariant,
  type TalkEdit,
} from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Talk-deck text variants (e.g. the standalone /talk/sf2026 keynote).
 * Public by design — anyone with the (secret) deck link can save/load named
 * snapshots of text overrides. Hardened by input caps + a per-instance rate
 * limit; the deck applies edits through a safe inline-only HTML sanitizer, so
 * stored markup can never execute script.
 */

const DECK_RE = /^[a-z0-9-]{1,40}$/;
const MAX_EDITS = 600;
const MAX_HTML = 20_000; // per text node
const MAX_NAME = 120;

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/* Naive per-instance rate limit: 30 writes / 10 min per IP. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 30;
}

function normEdits(raw: unknown): TalkEdit[] | null {
  if (!Array.isArray(raw)) return null;
  if (raw.length > MAX_EDITS) return null;
  const out: TalkEdit[] = [];
  for (const e of raw) {
    if (!e || typeof e !== "object") return null;
    const eid = clip((e as Record<string, unknown>).eid, 80);
    const html = clip((e as Record<string, unknown>).html, MAX_HTML);
    const orig = clip((e as Record<string, unknown>).orig, 400);
    if (!eid) return null;
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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const deck = clip(body.deck, 40);
  const name = clip(body.name, MAX_NAME);
  const id = body.id ? clip(body.id, 40) : undefined;
  const edits = normEdits(body.edits);

  if (!DECK_RE.test(deck)) {
    return NextResponse.json({ ok: false, error: "bad_deck" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ ok: false, error: "name_required" }, { status: 422 });
  }
  if (!edits) {
    return NextResponse.json({ ok: false, error: "bad_edits" }, { status: 422 });
  }

  const savedId = await saveTalkVariant({ id, deck, name, edits });
  if (!savedId) {
    return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, id: savedId });
}

export async function DELETE(req: Request) {
  const sp = new URL(req.url).searchParams;
  const deck = clip(sp.get("deck"), 40);
  const id = clip(sp.get("id"), 40);
  if (!DECK_RE.test(deck) || !id) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  await deleteTalkVariant(id, deck);
  return NextResponse.json({ ok: true });
}
