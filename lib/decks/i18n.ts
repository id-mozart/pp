/** Службові підписи на аркушах деки залежно від мови деки (Deck.lang). */
export type DeckLang = "uk" | "ru";
export const DECK_I18N: Record<DeckLang, { trainer: string; notes: string; trainerLab: string; spec: string; geo: string; section: string; step: string }> = {
  uk: { trainer: "Тетяна Пан", notes: "Нотатки", trainerLab: "Тренерка", spec: "Моя спеціалізація", geo: "Географія проєктів", section: "Розділ", step: "Крок" },
  ru: { trainer: "Татьяна Пан", notes: "Заметки", trainerLab: "Бизнес-тренер", spec: "Моя специализация", geo: "География проектов", section: "Раздел", step: "Шаг" },
};
export const deckT = (lang?: string) => DECK_I18N[lang === "ru" ? "ru" : "uk"];

/** Розмітка **жирного** в текстах деки: розбиття на шматки для рендера / експорту. */
export function splitBold(v: string): { t: string; b: boolean }[] {
  const out: { t: string; b: boolean }[] = [];
  const re = /\*\*([^*]+?)\*\*/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(v))) {
    if (m.index > last) out.push({ t: v.slice(last, m.index), b: false });
    out.push({ t: m[1], b: true });
    last = m.index + m[0].length;
  }
  if (last < v.length) out.push({ t: v.slice(last), b: false });
  return out.length ? out : [{ t: "", b: false }];
}
/** Текст без розмітки (для підписів, пошуку, оцінки довжини). */
export const plain = (v: string) => (v ?? "").replace(/\*\*/g, "");
