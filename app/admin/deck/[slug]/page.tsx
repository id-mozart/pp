import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentStrict, hasDb, setContentVersioned } from "@/lib/db";
import type { Deck } from "@/lib/decks/types";
import { DeckEditor } from "@/components/admin/DeckEditor";
import { DECK_COPY_FROM, DECK_DEFAULTS, sanitizeDeck } from "@/lib/decks/sanitize";

export const metadata: Metadata = {
  title: "Презентація A4 — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function DeckPage({ params, searchParams }: { params: { slug: string }; searchParams?: { only?: string; bare?: string; caps?: string } }) {
  const base = DECK_DEFAULTS[params.slug];
  if (!base) notFound();
  const key = `deck:${params.slug}`;
  const res = await getContentStrict<Deck>(key);
  // База налаштована, але не відповіла: НІКОЛИ не показуємо дефолт замість збережених правок.
  if (!res.ok) return <Unavailable slug={params.slug} />;
  let saved = res.data;
  let updatedAt = res.updatedAt;
  // Перше відкриття копії: лише коли рядка справді немає (не при помилці читання).
  if (!saved && DECK_COPY_FROM[params.slug] && hasDb()) {
    const srcRes = await getContentStrict<Deck>(`deck:${DECK_COPY_FROM[params.slug]}`);
    if (!srcRes.ok) return <Unavailable slug={params.slug} />;
    const src = srcRes.data;
    if (src && Array.isArray(src.pages) && src.pages.length) {
      const copy = { ...src, slug: params.slug, name: base.name, notes: base.notes };
      const w = await setContentVersioned(key, copy, null); // null = рядка ще не повинно бути
      if (w.ok) { saved = copy; updatedAt = w.updatedAt; }
      else if (w.conflict) { const again = await getContentStrict<Deck>(key); if (!again.ok) return <Unavailable slug={params.slug} />; saved = again.data; updatedAt = again.updatedAt; } // хтось уже скопіював — беремо його
      else return <Unavailable slug={params.slug} />;
    }
  }
  let deck: Deck = base;
  let fromDb = false;
  if (saved) {
    // Збережена дека НІКОЛИ не підміняється дефолтом: якщо після санітайзу сторінок не лишилось — це пошкоджені дані.
    const clean = sanitizeDeck(saved, params.slug, { fallbackToDefault: false });
    if (!clean.pages.length || (Array.isArray(saved.pages) && clean.pages.length !== saved.pages.length)) return <Corrupt slug={params.slug} />;
    deck = clean; fromDb = true;
  }
  const only = searchParams?.only ? Number(searchParams.only) : undefined;
  // ?caps= лише для службового рендера (bare), щоб не потрапити у збережену деку
  const bare = searchParams?.bare === "1";
  let initial = deck;
  if (bare) { // службові параметри для рендерів: не потрапляють у збереження, бо bare без редагування
    if (searchParams?.caps) initial = { ...initial, caps: searchParams.caps === "1" };
    if ((searchParams as any)?.tight) initial = { ...initial, tight: (searchParams as any).tight === "1" };
    if ((searchParams as any)?.fs) { const n = Number((searchParams as any).fs); if (Number.isFinite(n)) initial = { ...initial, fs: n }; }
  }
  return <DeckEditor initial={initial} dbReady={hasDb()} only={only} bare={searchParams?.bare === "1"} loadedAt={updatedAt} fromDb={fromDb} />;
}

function Corrupt({ slug }: { slug: string }) {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif", color: "#2A2018" }}>
      <div style={{ maxWidth: 520, background: "#FCF8F1", borderRadius: 14, padding: "28px 32px", boxShadow: "0 10px 30px rgba(60,40,15,.12)" }}>
        <h1 style={{ fontSize: 22, margin: "0 0 12px" }}>Збережені дані деки «{slug}» не читаються</h1>
        <p style={{ lineHeight: 1.5, margin: 0 }}>Сторінка навмисно не показує стандартну версію замість них і нічого не перезаписує. Попередні версії є в історії збережень — зверніться до розробника для відновлення.</p>
      </div>
    </div>
  );
}

function Unavailable({ slug }: { slug: string }) {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif", color: "#2A2018" }}>
      <div style={{ maxWidth: 520, background: "#FCF8F1", borderRadius: 14, padding: "28px 32px", boxShadow: "0 10px 30px rgba(60,40,15,.12)" }}>
        <h1 style={{ fontSize: 22, margin: "0 0 12px" }}>База даних тимчасово недоступна</h1>
        <p style={{ lineHeight: 1.5, margin: 0 }}>Презентацію «{slug}» не вдалося прочитати з бази. Ваші збережені правки в безпеці — сторінка навмисно не показує стандартну версію замість них. Оновіть сторінку через хвилину.</p>
        <p style={{ marginTop: 16 }}><a href={`/admin/deck/${slug}`} style={{ color: "#C4621F" }}>Спробувати ще раз</a></p>
      </div>
    </div>
  );
}
