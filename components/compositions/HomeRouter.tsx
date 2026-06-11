"use client";

import { useConcept } from "@/components/providers/ConceptProvider";
import { StandardHome } from "@/components/compositions/StandardHome";
import { MainHome } from "@/components/compositions/MainHome";
import { Main2Home } from "@/components/compositions/Main2Home";
import { Main3Home, Main4Home } from "@/components/compositions/Main3Home";
import { ConceptHome } from "@/components/compositions/ConceptHome";
import { BentoHome } from "@/components/compositions/BentoHome";
import { DeckHome } from "@/components/compositions/DeckHome";
import { StoryHome } from "@/components/compositions/StoryHome";
import { ConsoleHome } from "@/components/compositions/ConsoleHome";
import { DialogueHome } from "@/components/compositions/DialogueHome";
import { DiagnosticHome } from "@/components/compositions/DiagnosticHome";
import { CanvasHome } from "@/components/compositions/CanvasHome";
import { DesktopHome } from "@/components/compositions/DesktopHome";
import { CinematicHome } from "@/components/compositions/CinematicHome";
import { MethodHome } from "@/components/compositions/MethodHome";
import { FunnelHome } from "@/components/compositions/FunnelHome";
import { CalculatorHome } from "@/components/compositions/CalculatorHome";
import { NegotiationHome } from "@/components/compositions/NegotiationHome";
import { LookbookHome } from "@/components/compositions/LookbookHome";
import { WallHome } from "@/components/compositions/WallHome";
import { JournalHome } from "@/components/compositions/JournalHome";
import { VhsHome } from "@/components/compositions/VhsHome";
import { FeedHome } from "@/components/compositions/FeedHome";
import { TypewriterHome } from "@/components/compositions/TypewriterHome";
import { MaisonHome } from "@/components/compositions/MaisonHome";
import { MovementHome } from "@/components/compositions/MovementHome";
import { MaisonNoirHome } from "@/components/compositions/MaisonNoirHome";
import type { ConceptId } from "@/lib/concepts";

/**
 * Concepts whose IDENTITY is the page architecture itself (not just the skin).
 * Everything else falls back to the standard stacked composition.
 */
const COMPOSITIONS: Partial<Record<ConceptId, () => JSX.Element>> = {
  main3: Main3Home,
  main4: Main4Home,
  main2: Main2Home,
  main: MainHome,
  concept: ConceptHome,
  bento: BentoHome,
  deck: DeckHome,
  story: StoryHome,
  console: ConsoleHome,
  dialogue: DialogueHome,
  diagnostic: DiagnosticHome,
  canvas: CanvasHome,
  desktop: DesktopHome,
  cinematic: CinematicHome,
  method: MethodHome,
  funnel: FunnelHome,
  calc: CalculatorHome,
  nego: NegotiationHome,
  lookbook: LookbookHome,
  wall: WallHome,
  journal: JournalHome,
  vhs: VhsHome,
  feed: FeedHome,
  typewriter: TypewriterHome,
  maison: MaisonHome,
  movement: MovementHome,
  maisonnoir: MaisonNoirHome,
};

export function HomeRouter() {
  const { concept } = useConcept();
  const Composition = COMPOSITIONS[concept] ?? StandardHome;
  return <Composition />;
}
