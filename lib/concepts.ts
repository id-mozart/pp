export type ConceptId = "ember" | "champagne" | "bronze";

export interface Concept {
  id: ConceptId;
  /** Roman numeral shown in the discreet switcher */
  numeral: string;
  name: string;
  tagline: string;
  /** Tiny swatch used by the switcher */
  swatch: { canvas: string; gold: string; ink: string };
}

export const CONCEPTS: Concept[] = [
  {
    id: "ember",
    numeral: "I",
    name: "Ember Atelier",
    tagline: "Темна · золото як метал",
    swatch: { canvas: "#0E0B09", gold: "#C9962E", ink: "#F2E9DC" },
  },
  {
    id: "champagne",
    numeral: "II",
    name: "Champagne Study",
    tagline: "Світла · редакторська",
    swatch: { canvas: "#F4EDE1", gold: "#9A7322", ink: "#1C1714" },
  },
  {
    id: "bronze",
    numeral: "III",
    name: "Bronze Editorial",
    tagline: "Графіт · сучасний Swiss",
    swatch: { canvas: "#1E2229", gold: "#C9A86A", ink: "#ECE6DB" },
  },
];

export const DEFAULT_CONCEPT: ConceptId = "ember";
export const CONCEPT_IDS = CONCEPTS.map((c) => c.id) as ConceptId[];
export const STORAGE_KEY = "pp-concept";

export function isConceptId(v: unknown): v is ConceptId {
  return typeof v === "string" && (CONCEPT_IDS as string[]).includes(v);
}
