export type ConceptId =
  | "ember"
  | "champagne"
  | "bronze"
  | "solaris"
  | "edition"
  | "brut"
  | "noir"
  | "kinetik"
  | "dossier"
  | "aurora";

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
  {
    id: "solaris",
    numeral: "IV",
    name: "Solaris",
    tagline: "Тепле сяйво · couture",
    swatch: { canvas: "#1A120B", gold: "#E0A43B", ink: "#F5EBDE" },
  },
  {
    id: "edition",
    numeral: "V",
    name: "Édition",
    tagline: "Обкладинка · fashion",
    swatch: { canvas: "#EFE2D4", gold: "#C8521B", ink: "#241712" },
  },
  {
    id: "brut",
    numeral: "VI",
    name: "Brut",
    tagline: "Ґрід · електрик",
    swatch: { canvas: "#E9E3D6", gold: "#E2780A", ink: "#16140F" },
  },
  {
    id: "noir",
    numeral: "VII",
    name: "Noir",
    tagline: "Обсидіан · золота фольга",
    swatch: { canvas: "#090908", gold: "#CBA45A", ink: "#EDE8DF" },
  },
  {
    id: "kinetik",
    numeral: "VIII",
    name: "Kinetik",
    tagline: "Кінетика · електрик",
    swatch: { canvas: "#0C0C0B", gold: "#FF7A00", ink: "#F0F0EC" },
  },
  {
    id: "dossier",
    numeral: "IX",
    name: "Dossier",
    tagline: "Звіт · дані",
    swatch: { canvas: "#EDECE6", gold: "#96782C", ink: "#1A1A16" },
  },
  {
    id: "aurora",
    numeral: "X",
    name: "Aurora",
    tagline: "М'яке світло · повітря",
    swatch: { canvas: "#F6EFE6", gold: "#C67834", ink: "#281E18" },
  },
];

export const DEFAULT_CONCEPT: ConceptId = "ember";
export const CONCEPT_IDS = CONCEPTS.map((c) => c.id) as ConceptId[];
export const STORAGE_KEY = "pp-concept";

export function isConceptId(v: unknown): v is ConceptId {
  return typeof v === "string" && (CONCEPT_IDS as string[]).includes(v);
}
