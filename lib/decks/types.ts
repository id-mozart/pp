/**
 * Редагована A4-презентація («дека»). Кожна сторінка — один із простих
 * шаблонів; вміст зберігається як JSON у таблиці content під ключем deck:<slug>.
 * Поле `image` (необов'язкове) у текстових шаблонах — ілюстрація у правій колонці.
 */

export type DeckPage =
  | { id: string; type: "cover"; eyebrow: string; title: string; titleEm: string; sub: string; who: string; when: string }
  | { id: string; type: "about"; title: string; titleEm: string; facts: string[]; note: string; image: string; logos: string }
  | { id: string; type: "section"; num: string; title: string; sub: string; image?: string }
  | { id: string; type: "text"; title: string; titleEm: string; lead: string; paras: string[]; callout: string; image?: string }
  | { id: string; type: "bullets"; title: string; titleEm: string; lead: string; items: string[]; callout: string; image?: string }
  | { id: string; type: "twocol"; title: string; titleEm: string; lead: string; cols: { head: string; items: string[] }[]; image?: string }
  | { id: string; type: "steps"; title: string; titleEm: string; lead: string; steps: { head: string; text: string }[]; image?: string }
  | { id: string; type: "table"; title: string; titleEm: string; lead: string; head: string[]; rows: string[][]; callout: string }
  | { id: string; type: "gallery"; title: string; titleEm: string; lead: string; images: { src: string; cap: string }[] }
  | { id: string; type: "closing"; title: string; titleEm: string; sub: string; contacts: string[]; image: string; qr?: string };

export type DeckPageType = DeckPage["type"];

export type Deck = {
  slug: string;
  name: string;
  runhead: string; // напис у колонтитулі, напр. «NovaPay · Активні продажі · 2026»
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
      return { id, type, title: "Тетяна", titleEm: "Пан", facts: ["Факт 1", "Факт 2", "Факт 3"], note: "", image: "/deck/novapay/tania.jpg", logos: "/deck/novapay/clients.png" };
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
  }
}
