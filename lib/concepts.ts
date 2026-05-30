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
  | "aurora"
  | "vapor"
  | "terminal"
  | "riso"
  | "bauhaus"
  | "maximal"
  | "gazette"
  | "construct";

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
  {
    id: "vapor",
    numeral: "XI",
    name: "Vapor",
    tagline: "Неон-скло · градієнт",
    swatch: { canvas: "#16100E", gold: "#F2A33C", ink: "#F4E7DB" },
  },
  {
    id: "terminal",
    numeral: "XII",
    name: "Terminal",
    tagline: "CLI · бурштин на чорному",
    swatch: { canvas: "#0A0A08", gold: "#FFB000", ink: "#E8D2A8" },
  },
  {
    id: "riso",
    numeral: "XIII",
    name: "Risograph",
    tagline: "Друк · зерно · оверпринт",
    swatch: { canvas: "#F0E8D8", gold: "#E8730F", ink: "#1C1A14" },
  },
  {
    id: "bauhaus",
    numeral: "XIV",
    name: "Bauhaus",
    tagline: "Геометрія · конструктив",
    swatch: { canvas: "#ECE5D5", gold: "#E0A21C", ink: "#16150F" },
  },
  {
    id: "maximal",
    numeral: "XV",
    name: "Maximal",
    tagline: "Колаж · максимум",
    swatch: { canvas: "#1E1410", gold: "#E8893A", ink: "#F3E7D8" },
  },
  {
    id: "gazette",
    numeral: "XVI",
    name: "Gazette",
    tagline: "Газета · колонки",
    swatch: { canvas: "#EAE5D8", gold: "#9A6B1E", ink: "#1A1814" },
  },
  {
    id: "construct",
    numeral: "XVII",
    name: "Constructivist",
    tagline: "Агіт · діагональ",
    swatch: { canvas: "#ECE4D2", gold: "#D23B16", ink: "#14110D" },
  },
];

export const DEFAULT_CONCEPT: ConceptId = "ember";
export const CONCEPT_IDS = CONCEPTS.map((c) => c.id) as ConceptId[];
export const STORAGE_KEY = "pp-concept";

export function isConceptId(v: unknown): v is ConceptId {
  return typeof v === "string" && (CONCEPT_IDS as string[]).includes(v);
}
