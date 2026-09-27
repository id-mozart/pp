/**
 * Редагована A4-презентація («дека»). Кожна сторінка — один із простих
 * шаблонів; вміст зберігається як JSON у таблиці content під ключем deck:<slug>.
 * Поле `image` (необов'язкове) у текстових шаблонах — ілюстрація у правій колонці.
 * `variant` у списках: list (звичайний), cards (картки-плитки), bubbles (репліки).
 * У розділах `fit`: right (повнокадрова панель праворуч, типово) або top (широка смуга зверху);
 * `panel` — обʼєкт із прозорим фоном на фіолетовій панелі NovaPay.
 */
export type BulletsVariant = "list" | "cards" | "bubbles";
/** Схеми (див. components/deck/Diagrams.tsx): піраміда, навички за рівнями, коло з 3 секторів, блоки 3+1, цикл, клин 70/20/10. */
export type DiagramKind = "pyramid" | "skills" | "circle3" | "blocks31" | "cycle" | "wedge" | "catman" | "pita" | "tiers" | "est";
export const DIAGRAM_KINDS: DiagramKind[] = ["pyramid", "skills", "circle3", "blocks31", "cycle", "wedge", "catman", "pita", "tiers", "est"];

export type DeckPage = (
  | { id: string; type: "cover"; eyebrow: string; title: string; titleEm: string; sub: string; who: string; when: string; image?: string; variant?: "amp" | "photo" | "full" | "band"; avatar?: string; who2?: string; avatar2?: string } // who2/avatar2 — другий тренер на титулі
  | { id: string; type: "about"; title: string; titleEm: string; role?: string; quote?: string; stats?: { n: string; t: string }[]; facts: string[]; note: string; image: string; logos: string }
  | { id: string; type: "section"; num: string; title: string; sub: string; image?: string; fit?: "right" | "top"; panel?: boolean }
  | { id: string; type: "text"; title: string; titleEm: string; lead: string; paras: string[]; callout: string; image?: string }
  | { id: string; type: "bullets"; title: string; titleEm: string; lead: string; items: string[]; callout: string; image?: string; variant?: BulletsVariant }
  | { id: string; type: "twocol"; title: string; titleEm: string; lead: string; cols: { head: string; items: string[] }[]; image?: string; callout?: string }
  | { id: string; type: "steps"; title: string; titleEm: string; lead: string; steps: { head: string; text: string }[]; image?: string }
  | { id: string; type: "table"; title: string; titleEm: string; lead: string; head: string[]; rows: string[][]; callout: string }
  | { id: string; type: "gallery"; title: string; titleEm: string; lead: string; images: { src: string; cap: string }[] }
  | { id: string; type: "closing"; title: string; titleEm: string; sub: string; contacts: string[]; image: string; qr?: string }
  | { id: string; type: "diagram"; kind: DiagramKind; title: string; titleEm: string; lead: string; labels: string[]; lists?: string[][]; callout: string; hi?: number }
) & { fs?: number }; // fs — ручний множник кегля сторінки (0.6…1.6), поверх автопідбору

export type DeckPageType = DeckPage["type"];

/** Анімації режиму показу (налаштовуються для кожної деки). */
export const DECK_TRANSITIONS = ["none", "fade", "push", "cover", "zoom", "wipe", "rise"] as const;
export const DECK_ITEM_ANIMS = ["none", "rise", "fade", "zoom", "side"] as const;
export const DECK_SPEEDS = ["fast", "normal", "slow"] as const;
export type DeckTransition = (typeof DECK_TRANSITIONS)[number];
export type DeckItemAnim = (typeof DECK_ITEM_ANIMS)[number];
export type DeckSpeed = (typeof DECK_SPEEDS)[number];
export type DeckAnim = {
  tr: DeckTransition; // перехід між слайдами
  speed: DeckSpeed; // тривалість переходу
  items: DeckItemAnim; // поява елементів на слайді
  seq: boolean; // елементи зʼявляються по черзі (інакше — разом)
  pptx: boolean; // записати перехід у PowerPoint-файл
};
export const DECK_ANIM_DEFAULT: DeckAnim = { tr: "none", speed: "normal", items: "rise", seq: true, pptx: true };
export const DECK_SPEED_MS: Record<DeckSpeed, number> = { fast: 350, normal: 600, slow: 950 };

export type Deck = {
  slug: string;
  name: string;
  runhead: string; // напис у колонтитулі, напр. «NovaPay · Активні продажі · 2026»
  caps?: boolean; // заголовки капсом
  fs?: number; // множник кегля для всієї деки (0.7…1.3)
  notes?: boolean; // поле «Нотатки» на розріджених сторінках (false — екранна версія без нотаток)
  tight?: boolean; // щільна верстка: менші відступи в таблицях/картках, більший мінімальний кегль
  logoLight?: string; // світла версія логотипа клієнта — для титулу з фото на весь аркуш (інакше logo, висвітлений фільтром)
  logo?: string; // логотип клієнта на титулі (шлях до картинки); "" — без логотипа
  big?: boolean; // «великий друк»: крупніші шапки таблиць і службові підписи (для друку)
  lang?: "uk" | "ru"; // мова службових підписів на аркушах (Нотатки, Розділ, підпис у колонтитулі); типово uk
  footRunhead?: boolean; // колонтитул із назвою деки знизу (замість підпису «Тетяна Пан · …»), номер сторінки лаконічний; зверху — лише логотип
  anim?: DeckAnim; // анімації показу: перехід між слайдами, поява елементів, переходи в PPTX
  pages: DeckPage[];
};

export const PAGE_TYPE_LABELS: Record<DeckPageType, string> = {
  cover: "Титул",
  about: "Про тренера",
  section: "Розділ",
  text: "Текст",
  bullets: "Список",
  twocol: "Колонки",
  steps: "Кроки",
  table: "Таблиця",
  gallery: "Картинки",
  closing: "Фінал",
  diagram: "Схема",
};

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function blankPage(type: DeckPageType): DeckPage {
  const id = newId();
  switch (type) {
    case "cover":
      return { id, type, eyebrow: "Тренінг", title: "Назва", titleEm: "тренінгу", sub: "Підзаголовок", who: "Бізнес-тренерка Тетяна Пан", when: "Україна, 2026" };
    case "about":
      return { id, type, title: "Тетяна", titleEm: "Пан", role: "", quote: "", stats: [], facts: ["Факт 1", "Факт 2", "Факт 3"], note: "", image: "/brand/profile-portrait.jpg", logos: "" };
    case "section":
      return { id, type, num: "01", title: "Назва розділу", sub: "" };
    case "text":
      return { id, type, title: "Заголовок", titleEm: "", lead: "", paras: ["Абзац тексту."], callout: "" };
    case "bullets":
      return { id, type, title: "Заголовок", titleEm: "", lead: "", items: ["Пункт 1", "Пункт 2", "Пункт 3"], callout: "" };
    case "twocol":
      return { id, type, title: "Заголовок", titleEm: "", lead: "", cols: [{ head: "Колонка 1", items: ["Пункт"] }, { head: "Колонка 2", items: ["Пункт"] }] };
    case "steps":
      return { id, type, title: "Заголовок", titleEm: "", lead: "", steps: [{ head: "Крок 1", text: "Опис" }, { head: "Крок 2", text: "Опис" }] };
    case "table":
      return { id, type, title: "Заголовок", titleEm: "", lead: "", head: ["#", "Колонка", "Колонка"], rows: [["1", "", ""], ["2", "", ""]], callout: "" };
    case "gallery":
      return { id, type, title: "Заголовок", titleEm: "", lead: "", images: [{ src: "/deck/novapay/target.jpg", cap: "Підпис" }] };
    case "closing":
      return { id, type, title: "Дякую", titleEm: "за активність", sub: "", contacts: ["+38 067 007 0710", "pan-partners.agency"], image: "/deck/novapay/tania.jpg" };
    case "diagram":
      return { id, type, kind: "cycle", title: "Заголовок", titleEm: "", lead: "", labels: [], callout: "" };
  }
}
