import { NextResponse } from "next/server";
import { getContentStrict, setContentVersioned } from "@/lib/db";
import type { Deck } from "@/lib/decks/types";
import { DECK_DEFAULTS, sanitizeDeck } from "@/lib/decks/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const s = (v: unknown, max = 4000) => String(v ?? "").slice(0, max);

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") || "novapay";
  const r = await getContentStrict<Deck>(`deck:${slug}`);
  if (!r.ok) return NextResponse.json({ ok: false, error: "db" }, { status: 503 });
  return NextResponse.json({ ok: true, deck: r.data ?? DECK_DEFAULTS[slug] ?? null, fromDefault: !r.data, updatedAt: r.updatedAt });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const slug = s(body?.slug, 60);
  if (!body || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  // Запобіжник: порожній або не-масив pages ніколи не зберігаємо — санітайзер підставив би дефолт поверх правок.
  if (!Array.isArray(body.pages) || body.pages.length < 1) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  if (body.pages.length > 200) return NextResponse.json({ ok: false, error: "too_many_pages" }, { status: 400 });
  const clean = sanitizeDeck(body, slug, { fallbackToDefault: false });
  if (clean.pages.length < 1 || clean.pages.length !== body.pages.length) return NextResponse.json({ ok: false, error: "pages_mismatch" }, { status: 400 });
  // Версія, з якої редагували, обовʼязкова: без неї старий бандл або сторонній скрипт міг би затерти свіжіші правки.
  if (!(typeof body.baseUpdatedAt === "string" || body.baseUpdatedAt === null)) return NextResponse.json({ ok: false, error: "no_base" }, { status: 400 });
  const expected: string | null = body.baseUpdatedAt;
  const r = await setContentVersioned(`deck:${slug}`, clean, expected);
  if (!r.ok) {
    if (r.conflict) return NextResponse.json({ ok: false, error: "conflict", currentUpdatedAt: r.currentUpdatedAt }, { status: 409 });
    return NextResponse.json({ ok: false, error: r.error === "no_db" ? "no_db" : "db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, updatedAt: r.updatedAt });
}

// Скидання до дефолту вимкнено: воно знищувало правки й фото клієнта. Відкат — лише через content_history.
export async function DELETE() {
  return NextResponse.json({ ok: false, error: "disabled" }, { status: 405 });
}
