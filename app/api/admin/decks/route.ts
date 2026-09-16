import { NextResponse } from "next/server";
import { deleteContentArchived, getContentStrict, hasDb, setContentVersioned } from "@/lib/db";
import type { Deck } from "@/lib/decks/types";
import { DECK_DEFAULTS, blankDeck, isDeckSlug, sanitizeDeck, slugify } from "@/lib/decks/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Керування деками: create (порожня або з шаблону), copy (зі збереженої/стандартної деки),
 * rename, delete (з архівом у content_history). Усі записи — версійовані; нові slug'и
 * створюються лише коли рядка ще немає (expected = null), тож нічого не затирається.
 */
const s = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** Читає деку зі збереження або з шаблону. undefined — немає такої; null — база не відповіла. */
async function loadDeck(slug: string): Promise<Deck | undefined | null> {
  const r = await getContentStrict<Deck>(`deck:${slug}`);
  if (!r.ok) return null;
  if (r.data && Array.isArray(r.data.pages) && r.data.pages.length) {
    const clean = sanitizeDeck(r.data, slug, { fallbackToDefault: false });
    return clean.pages.length === r.data.pages.length ? clean : undefined; // пошкоджені дані не копіюємо
  }
  return DECK_DEFAULTS[slug];
}

/** Вільний slug: базовий, або з суфіксом -2, -3… Перевірка й запис серіалізовані блокуванням у setContentVersioned. */
async function freeSlug(base: string): Promise<string | null> {
  for (let i = 0; i < 50; i++) {
    const cand = i === 0 ? base : `${base.slice(0, 55)}-${i + 1}`;
    if (DECK_DEFAULTS[cand]) continue; // стандартні slug'и не перевикористовуємо
    const r = await getContentStrict(`deck:${cand}`);
    if (!r.ok) return null;
    if (!r.data) return cand;
  }
  return null;
}

async function writeNew(preferred: string, deck: Deck) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = await freeSlug(preferred);
    if (!slug) return bad("db", 503);
    const data = { ...deck, slug };
    const w = await setContentVersioned(`deck:${slug}`, data, null);
    if (w.ok) return NextResponse.json({ ok: true, slug, updatedAt: w.updatedAt });
    if (!w.conflict) return bad("db", 503);
    // хтось паралельно зайняв slug — пробуємо наступний
  }
  return bad("busy", 409);
}

export async function POST(req: Request) {
  if (!hasDb()) return bad("no_db", 503);
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return bad("invalid");
  const action = s(body.action, 20);

  if (action === "create") {
    const name = s(body.name) || "Нова презентація";
    const from = s(body.from, 60);
    let deck: Deck;
    if (from) {
      if (!isDeckSlug(from)) return bad("invalid");
      const src = await loadDeck(from);
      if (src === null) return bad("db", 503);
      if (!src) return bad("not_found", 404);
      deck = { ...src, name, runhead: name };
    } else {
      deck = blankDeck("deck", name);
    }
    const preferred = isDeckSlug(body.slug) ? body.slug : slugify(name);
    return writeNew(preferred, deck);
  }

  if (action === "copy") {
    const from = s(body.from, 60);
    if (!isDeckSlug(from)) return bad("invalid");
    const src = await loadDeck(from);
    if (src === null) return bad("db", 503);
    if (!src) return bad("not_found", 404);
    const name = s(body.name) || `${src.name} · копія`;
    const preferred = isDeckSlug(body.slug) ? body.slug : `${from}-copy`;
    return writeNew(preferred, { ...src, name });
  }

  if (action === "rename") {
    const slug = s(body.slug, 60);
    const name = s(body.name);
    if (!isDeckSlug(slug) || !name) return bad("invalid");
    // Перейменування — окремий версійований запис поверх поточної версії (з історією).
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await getContentStrict<Deck>(`deck:${slug}`);
      if (!r.ok) return bad("db", 503);
      if (!r.data) {
        // стандартна дека, яку ще не зберігали: створюємо рядок із шаблону з новою назвою
        const base = DECK_DEFAULTS[slug];
        if (!base) return bad("not_found", 404);
        const w = await setContentVersioned(`deck:${slug}`, { ...base, name }, null);
        if (w.ok) return NextResponse.json({ ok: true, slug, updatedAt: w.updatedAt });
        if (!w.conflict) return bad("db", 503);
        continue;
      }
      const w = await setContentVersioned(`deck:${slug}`, { ...r.data, name }, r.updatedAt);
      if (w.ok) return NextResponse.json({ ok: true, slug, updatedAt: w.updatedAt });
      if (!w.conflict) return bad("db", 503);
    }
    return bad("busy", 409);
  }

  if (action === "delete") {
    const slug = s(body.slug, 60);
    if (!isDeckSlug(slug)) return bad("invalid");
    // Стандартні деки (з шаблоном у коді) не видаляємо: після видалення вони б відкрились як дефолт — це втрата правок.
    if (DECK_DEFAULTS[slug]) return bad("protected", 403);
    if (s(body.confirm, 60) !== slug) return bad("confirm");
    const r = await deleteContentArchived(`deck:${slug}`);
    if (!r.ok) return bad("db", 503);
    return NextResponse.json({ ok: true, slug, existed: r.existed });
  }

  return bad("invalid");
}
