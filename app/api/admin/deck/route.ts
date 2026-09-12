import { NextResponse } from "next/server";
import { getContent, setContent } from "@/lib/db";
import type { Deck } from "@/lib/decks/types";
import { DECK_DEFAULTS, sanitizeDeck } from "@/lib/decks/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const s = (v: unknown, max = 4000) => String(v ?? "").slice(0, max);

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") || "novapay";
  const saved = await getContent<Deck>(`deck:${slug}`);
  return NextResponse.json({ ok: true, deck: saved ?? DECK_DEFAULTS[slug] ?? null });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const slug = s(body?.slug, 60);
  if (!body || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const clean = sanitizeDeck(body, slug);
  const saved = await setContent(`deck:${slug}`, clean);
  if (!saved) {
    return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  // Скинути до дефолту: зберігаємо дефолтну деку поверх збереженої.
  const slug = new URL(req.url).searchParams.get("slug") || "novapay";
  const base = DECK_DEFAULTS[slug];
  if (!base) return NextResponse.json({ ok: false, error: "unknown" }, { status: 404 });
  const saved = await setContent(`deck:${slug}`, base);
  return NextResponse.json({ ok: saved });
}
