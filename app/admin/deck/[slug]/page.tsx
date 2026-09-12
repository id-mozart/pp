import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent, hasDb } from "@/lib/db";
import type { Deck } from "@/lib/decks/types";
import { NOVAPAY_DECK } from "@/lib/decks/novapay";
import { DeckEditor } from "@/components/admin/DeckEditor";

export const metadata: Metadata = {
  title: "Презентація A4 — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, Deck> = { novapay: NOVAPAY_DECK };

export default async function DeckPage({ params, searchParams }: { params: { slug: string }; searchParams?: { only?: string; bare?: string; caps?: string } }) {
  const base = DEFAULTS[params.slug];
  if (!base) notFound();
  const saved = await getContent<Deck>(`deck:${params.slug}`);
  const deck: Deck = saved && Array.isArray(saved.pages) && saved.pages.length ? saved : base;
  const only = searchParams?.only ? Number(searchParams.only) : undefined;
  const initial = searchParams?.caps ? { ...deck, caps: searchParams.caps === "1" } : deck;
  return <DeckEditor initial={initial} dbReady={hasDb()} only={only} bare={searchParams?.bare === "1"} />;
}
