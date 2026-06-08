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
  | "construct"
  | "bento"
  | "deck"
  | "story"
  | "console"
  | "dialogue"
  | "diagnostic"
  | "canvas"
  | "desktop"
  | "cinematic"
  | "method"
  | "funnel"
  | "calc"
  | "nego"
  | "lookbook"
  | "wall"
  | "journal"
  | "vhs"
  | "feed"
  | "typewriter"
  | "maison"
  | "movement"
  | "maisonnoir";

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
  {
    id: "bento",
    numeral: "XVIII",
    name: "Bento",
    tagline: "Інша КОМПОЗИЦІЯ · сітка плиток",
    swatch: { canvas: "#12130F", gold: "#D8A23F", ink: "#EFEBE2" },
  },
  {
    id: "deck",
    numeral: "XIX",
    name: "Deck",
    tagline: "Інша КОМПОЗИЦІЯ · слайди",
    swatch: { canvas: "#0E0E0C", gold: "#E8A33A", ink: "#F2EEE6" },
  },
  {
    id: "story",
    numeral: "XX",
    name: "Story",
    tagline: "Інша КОМПОЗИЦІЯ · лонгрід",
    swatch: { canvas: "#F4EDE1", gold: "#9A7322", ink: "#1C1714" },
  },
  {
    id: "console",
    numeral: "XXI",
    name: "Console",
    tagline: "Інтерактив · термінал-REPL",
    swatch: { canvas: "#080806", gold: "#FFB000", ink: "#E8D2A8" },
  },
  {
    id: "dialogue",
    numeral: "XXII",
    name: "Dialogue",
    tagline: "Інтерактив · чат із Тетяною",
    swatch: { canvas: "#EBE5DB", gold: "#B07A1E", ink: "#1E1A14" },
  },
  {
    id: "diagnostic",
    numeral: "XXIII",
    name: "Diagnostic",
    tagline: "Інтерактив · діагностика-квіз",
    swatch: { canvas: "#14120F", gold: "#DDA23C", ink: "#F0E9DD" },
  },
  {
    id: "canvas",
    numeral: "XXIV",
    name: "Canvas",
    tagline: "Простір · перетягуване полотно",
    swatch: { canvas: "#E9E4D9", gold: "#9A7020", ink: "#1C1813" },
  },
  {
    id: "desktop",
    numeral: "XXV",
    name: "Desktop",
    tagline: "Простір · вікна та док",
    swatch: { canvas: "#E0D2C0", gold: "#96681C", ink: "#1C1610" },
  },
  {
    id: "cinematic",
    numeral: "XXVI",
    name: "Cinematic",
    tagline: "Скрол-кіно · сцена морфиться",
    swatch: { canvas: "#0C0A08", gold: "#D69E46", ink: "#F4EADE" },
  },
  {
    id: "method",
    numeral: "XXVII",
    name: "Метод",
    tagline: "НОВА ІДЕЯ · система-методологія",
    swatch: { canvas: "#100F0C", gold: "#CBA24E", ink: "#F0E9DD" },
  },
  {
    id: "funnel",
    numeral: "XXVIII",
    name: "Воронка",
    tagline: "Форма = зміст · сторінка-воронка",
    swatch: { canvas: "#100F0C", gold: "#CEA24E", ink: "#F0E9DD" },
  },
  {
    id: "calc",
    numeral: "XXIX",
    name: "Калькулятор",
    tagline: "Провокація · рахує ваші втрати",
    swatch: { canvas: "#12110D", gold: "#D6A850", ink: "#F0E9DD" },
  },
  {
    id: "nego",
    numeral: "XXX",
    name: "Переговори",
    tagline: "Гра · відстій ціну",
    swatch: { canvas: "#11100E", gold: "#D2A856", ink: "#F0EAE0" },
  },
  {
    id: "lookbook",
    numeral: "XXXI",
    name: "Lookbook",
    tagline: "Фото-first · фешн-едиторіал",
    swatch: { canvas: "#0A0A09", gold: "#D6A856", ink: "#F4F0E8" },
  },
  {
    id: "wall",
    numeral: "XXXII",
    name: "Стіна відмов",
    tagline: "Концепт · пробий стіну «НІ»",
    swatch: { canvas: "#0E0D0C", gold: "#DCAA54", ink: "#EEE8DE" },
  },
  {
    id: "journal",
    numeral: "XXXIII",
    name: "Щоденник",
    tagline: "Скрапбук · полароїди + рукопис",
    swatch: { canvas: "#ECE6DA", gold: "#967020", ink: "#261E16" },
  },
  {
    id: "vhs",
    numeral: "XXXIV",
    name: "Ефір / VHS",
    tagline: "Ретро-ефір · сканлайни, REC",
    swatch: { canvas: "#080808", gold: "#DEAC54", ink: "#E8DECA" },
  },
  {
    id: "feed",
    numeral: "XXXV",
    name: "Стрічка",
    tagline: "Соцлента · сторіс + grid",
    swatch: { canvas: "#F0EDE6", gold: "#9E7420", ink: "#1E1A14" },
  },
  {
    id: "typewriter",
    numeral: "XXXVI",
    name: "Друкарка",
    tagline: "Маніфест друкується сам",
    swatch: { canvas: "#EEE9DE", gold: "#966E1E", ink: "#241E16" },
  },
  {
    id: "maison",
    numeral: "XXXVII",
    name: "Maison",
    tagline: "За мотивами Dior · couture-мезон",
    swatch: { canvas: "#F7F4EE", gold: "#B08A3E", ink: "#15130F" },
  },
  {
    id: "movement",
    numeral: "XXXVIII",
    name: "Movement",
    tagline: "За мотивами BossBabe · рух",
    swatch: { canvas: "#F3EBE0", gold: "#C2601E", ink: "#171310" },
  },
  {
    id: "maisonnoir",
    numeral: "XXXIX",
    name: "Maison Noir",
    tagline: "Мікс · Ember × Maison",
    swatch: { canvas: "#0E0B09", gold: "#C9962E", ink: "#F2E9DC" },
  },
];

export const DEFAULT_CONCEPT: ConceptId = "ember";
export const CONCEPT_IDS = CONCEPTS.map((c) => c.id) as ConceptId[];
export const STORAGE_KEY = "pp-concept";

export function isConceptId(v: unknown): v is ConceptId {
  return typeof v === "string" && (CONCEPT_IDS as string[]).includes(v);
}
