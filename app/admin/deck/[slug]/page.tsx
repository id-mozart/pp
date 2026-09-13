import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, hasDb, setContent } from "@/lib/db";
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
  let saved = await getContent<Deck>(`deck:${params.slug}`);
  // Перше відкриття копії: переносимо збережену версію джерела як є (з усіма правками), без санітайзу.
  if (!saved && DECK_COPY_FROM[params.slug]) {
    const src = await getContent<Deck>(`deck:${DECK_COPY_FROM[params.slug]}`);
    if (src && Array.isArray(src.pages) && src.pages.length) {
      const copy = { ...src, slug: params.slug, name: base.name };
      await setContent(`deck:${params.slug}`, copy);
      saved = copy;
    }
  }
  const deck: Deck = saved && Array.isArray(saved.pages) && saved.pages.length ? sanitizeDeck(saved, params.slug) : base;
  const only = searchParams?.only ? Number(searchParams.only) : undefined;
  const initial = searchParams?.caps ? { ...deck, caps: searchParams.caps === "1" } : deck;
  return <DeckEditor initial={initial} dbReady={hasDb()} only={only} bare={searchParams?.bare === "1"} />;
}
