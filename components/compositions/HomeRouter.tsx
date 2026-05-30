"use client";

import { useConcept } from "@/components/providers/ConceptProvider";
import { StandardHome } from "@/components/compositions/StandardHome";
import { BentoHome } from "@/components/compositions/BentoHome";
import { DeckHome } from "@/components/compositions/DeckHome";
import { StoryHome } from "@/components/compositions/StoryHome";
import type { ConceptId } from "@/lib/concepts";

/**
 * Concepts whose IDENTITY is the page architecture itself (not just the skin).
 * Everything else falls back to the standard stacked composition.
 */
const COMPOSITIONS: Partial<Record<ConceptId, () => JSX.Element>> = {
  bento: BentoHome,
  deck: DeckHome,
  story: StoryHome,
};

export function HomeRouter() {
  const { concept } = useConcept();
  const Composition = COMPOSITIONS[concept] ?? StandardHome;
  return <Composition />;
}
