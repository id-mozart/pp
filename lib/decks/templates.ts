import type { DeckPage, DeckPageType } from "./types";
import { DIAGRAM_LABELS } from "@/components/deck/Diagrams";
import { newId } from "./types";

/**
 * Типові шаблони сторінок: набір готових композицій із прикладним вмістом.
 * У редакторі їх обирають візуально (мініатюри) — для нової сторінки або щоб
 * перекласти наявну сторінку в іншу композицію (convertPage зберігає тексти).
 */
export type PageTemplate = { id: string; label: string; group: string; hint?: string; make: () => DeckPage };

const T = "/deck/novapay/";
const P = "/deck/profinstal/";

const tpl = (id: string, group: string, label: string, hint: string, make: () => Omit<DeckPage, "id">): PageTemplate =>
  ({ id, group, label, hint, make: () => ({ ...(make() as DeckPage), id: newId() }) });

export const PAGE_TEMPLATES: PageTemplate[] = [
  // ── титул / розділи ─────────────────────────────────────────────
  tpl("cover", "Титул і розділи", "Титул", "Назва, підзаголовок, тренер, дата; ілюстрація праворуч",
    () => ({ type: "cover", eyebrow: "Тренінг", title: "Назва програми:", titleEm: "підзаголовок курсивом", sub: "", who: "Бізнес-тренерка Тетяна Пан", when: "Україна, 2026", image: T + "tania-flip-bw.jpg" })),
  tpl("section", "Титул і розділи", "Розділ", "Великий номер і назва розділу",
    () => ({ type: "section", num: "1", title: "Назва розділу", sub: "" })),
  tpl("section-right", "Титул і розділи", "Розділ + фото праворуч", "Номер, назва і повнокадрове фото праворуч",
    () => ({ type: "section", num: "2", title: "Назва розділу", sub: "Підзаголовок", image: P + "u-leadership.jpg" })),
  tpl("section-top", "Титул і розділи", "Розділ + фото зверху", "Широка фотосмуга зверху, номер і назва під нею",
    () => ({ type: "section", num: "3", title: "Назва розділу", sub: "", image: P + "u-mentor.jpg", fit: "top" })),
  // ── текст ────────────────────────────────────────────────────────
  tpl("text", "Текст", "Текст", "Заголовок, лід і абзаци",
    () => ({ type: "text", title: "Заголовок", titleEm: "акцент", lead: "Короткий лід під заголовком.", paras: ["Перший абзац тексту.", "Другий абзац тексту."], callout: "" })),
  tpl("text-img", "Текст", "Текст + фото", "Текст ліворуч, ілюстрація праворуч",
    () => ({ type: "text", title: "Заголовок", titleEm: "акцент", lead: "", paras: ["Абзац тексту поруч з ілюстрацією."], callout: "", image: P + "u-workshop.jpg" })),
  tpl("text-callout", "Текст", "Текст + виноска", "Абзаци і виділена думка внизу",
    () => ({ type: "text", title: "Заголовок", titleEm: "", lead: "", paras: ["Абзац тексту."], callout: "Головна думка сторінки — у виносці." })),
  tpl("quote", "Текст", "Цитата з фото", "Велика цитата і фото — без заголовка",
    () => ({ type: "text", title: "", titleEm: "", lead: "", paras: [], callout: "Цитата або питання для обговорення.", image: P + "u-expect.jpg" })),
  // ── списки ───────────────────────────────────────────────────────
  tpl("bullets", "Списки", "Список", "Маркований список",
    () => ({ type: "bullets", title: "Заголовок", titleEm: "акцент", lead: "", items: ["Перший пункт", "Другий пункт", "Третій пункт"], callout: "" })),
  tpl("bullets-img", "Списки", "Список + фото", "Список ліворуч, ілюстрація праворуч",
    () => ({ type: "bullets", title: "Заголовок", titleEm: "акцент", lead: "", items: ["Перший пункт", "Другий пункт", "Третій пункт"], callout: "", image: P + "u-summit.jpg" })),
  tpl("cards", "Списки", "Картки", "Пункти як пронумеровані картки",
    () => ({ type: "bullets", variant: "cards", title: "Заголовок", titleEm: "акцент", lead: "", items: ["Перша картка", "Друга картка", "Третя картка"], callout: "" })),
  tpl("bubbles", "Списки", "Репліки", "Пункти як репліки-«бульбашки»",
    () => ({ type: "bullets", variant: "bubbles", title: "Заголовок", titleEm: "", lead: "", items: ["«Перша репліка»", "«Друга репліка»", "«Третя репліка»"], callout: "" })),
  // ── структура ────────────────────────────────────────────────────
  tpl("twocol", "Структура", "Дві колонки", "Два блоки з заголовками і списками",
    () => ({ type: "twocol", title: "Заголовок", titleEm: "", lead: "", cols: [{ head: "Колонка 1", items: ["Пункт", "Пункт"] }, { head: "Колонка 2", items: ["Пункт", "Пункт"] }] })),
  tpl("threecol", "Структура", "Три колонки", "Три блоки з заголовками і списками",
    () => ({ type: "twocol", title: "Заголовок", titleEm: "", lead: "", cols: [{ head: "Колонка 1", items: ["Пункт", "Пункт"] }, { head: "Колонка 2", items: ["Пункт", "Пункт"] }, { head: "Колонка 3", items: ["Пункт", "Пункт"] }] })),
  tpl("steps", "Структура", "Кроки", "Послідовність кроків із поясненнями",
    () => ({ type: "steps", title: "Заголовок", titleEm: "", lead: "", steps: [{ head: "Крок 1", text: "Опис кроку" }, { head: "Крок 2", text: "Опис кроку" }, { head: "Крок 3", text: "Опис кроку" }] })),
  tpl("steps-img", "Структура", "Кроки + фото", "Кроки ліворуч, ілюстрація праворуч",
    () => ({ type: "steps", title: "Заголовок", titleEm: "", lead: "", steps: [{ head: "Крок 1", text: "Опис" }, { head: "Крок 2", text: "Опис" }, { head: "Крок 3", text: "Опис" }], image: P + "u-chess.jpg" })),
  tpl("table", "Структура", "Таблиця", "Таблиця для заповнення",
    () => ({ type: "table", title: "Заголовок", titleEm: "", lead: "", head: ["#", "Колонка", "Колонка", "Колонка"], rows: [["1", "", "", ""], ["2", "", "", ""], ["3", "", "", ""], ["4", "", "", ""], ["5", "", "", ""]], callout: "" })),
  // ── схеми ────────────────────────────────────────────────────────
  ...(["pyramid", "skills", "circle3", "blocks31", "cycle", "wedge"] as const).map((k) =>
    tpl("dg-" + k, "Схеми", DIAGRAM_LABELS[k].label, DIAGRAM_LABELS[k].hint, () => ({ type: "diagram", kind: k, title: "Заголовок", titleEm: "", lead: "", labels: [...DIAGRAM_LABELS[k].labels], lists: DIAGRAM_LABELS[k].lists?.map((l) => [...l]), callout: "" }))),
  // ── медіа ────────────────────────────────────────────────────────
  tpl("gallery-3", "Медіа", "Галерея · 3 фото", "Три фото з підписами",
    () => ({ type: "gallery", title: "Заголовок", titleEm: "", lead: "", images: [{ src: P + "u-gate.jpg", cap: "Підпис 1" }, { src: P + "u-clock.jpg", cap: "Підпис 2" }, { src: P + "u-hammock.jpg", cap: "Підпис 3" }] })),
  tpl("gallery-2", "Медіа", "Галерея · 2 фото", "Два фото з підписами",
    () => ({ type: "gallery", title: "Заголовок", titleEm: "", lead: "", images: [{ src: P + "u-teamgame.jpg", cap: "Підпис 1" }, { src: P + "u-boardgame.jpg", cap: "Підпис 2" }] })),
  // ── люди ─────────────────────────────────────────────────────────
  tpl("about", "Люди", "Про тренера", "Портрет, роль, цитата, цифри, спеціалізація",
    () => ({ type: "about", title: "Тетяна", titleEm: "Пан", role: "Бізнес-тренерка, фасилітаторка, коуч, менторка, засновниця компанії «Pan&Partners»", quote: "", stats: [{ n: "25+ років", t: "у продажах" }, { n: "20+ років", t: "управління командами" }, { n: "17+ років", t: "у навчанні та консалтингу" }], facts: ["Стратегічні сесії.", "Навчання керівників.", "Продажі та переговори."], note: "", image: T + "tania-profile.jpg", logos: T + "profile-strip.png" })),
  tpl("clients", "Люди", "Клієнти", "Заголовок і полотно логотипів",
    () => ({ type: "text", title: "Наші", titleEm: "клієнти", lead: "Понад 2 000 проєктів було завершено в сфері B2B та B2C:", paras: [], callout: "", image: T + "clients.png" })),
  tpl("closing", "Люди", "Контакти", "Фінальна сторінка: контакти, QR, фото",
    () => ({ type: "closing", title: "Наші", titleEm: "контакти", sub: "https://pan-partners.agency/", contacts: ["+38 067 007 0710", "+38 050 448 1411"], image: T + "tania-mic-2.jpg", qr: T + "qr-instagram.svg" })),
];

export const TEMPLATE_GROUPS = Array.from(new Set(PAGE_TEMPLATES.map((t) => t.group)));

/** Спільні поля, які можна перенести між композиціями. */
type Common = { title: string; titleEm: string; lead: string; items: string[]; heads: string[]; image?: string; callout: string };

function extract(p: DeckPage): Common {
  const c: Common = { title: "", titleEm: "", lead: "", items: [], heads: [], image: undefined, callout: "" };
  const any = p as any;
  if (typeof any.title === "string") c.title = any.title;
  if (typeof any.titleEm === "string") c.titleEm = any.titleEm;
  if (typeof any.lead === "string") c.lead = any.lead;
  if (typeof any.sub === "string" && !c.lead) c.lead = any.sub;
  if (typeof any.callout === "string") c.callout = any.callout;
  if (typeof any.image === "string" && any.image) c.image = any.image;
  switch (p.type) {
    case "bullets": c.items = p.items; break;
    case "text": c.items = p.paras; break;
    case "steps": c.items = p.steps.map((s) => (s.text ? `${s.head} — ${s.text}` : s.head)); c.heads = p.steps.map((s) => s.head); break;
    case "twocol": c.items = p.cols.flatMap((col) => col.items); c.heads = p.cols.map((col) => col.head); break;
    case "gallery": c.items = p.images.map((g) => g.cap); break;
    case "closing": c.items = p.contacts; break;
    case "about": c.items = p.facts; break;
    case "table": c.items = p.rows.map((r) => r.filter(Boolean).join(" · ")).filter(Boolean); break;
    case "cover": c.lead = p.sub; break;
    case "diagram": c.items = [...p.labels, ...(p.lists ?? []).flat()]; break;
  }
  c.items = c.items.filter((s) => s && s.trim());
  return c;
}

/**
 * Перекладає сторінку в композицію шаблону: id лишається, тексти переносяться в
 * однойменні поля (заголовок, лід, пункти → пункти/абзаци/кроки/колонки), ілюстрація — де вона є.
 */
export function convertPage(p: DeckPage, t: PageTemplate): DeckPage {
  const c = extract(p);
  const n: any = t.make();
  n.id = p.id;
  if (p.fs) n.fs = p.fs;
  const isQuote = t.id === "quote";
  if ("title" in n && !isQuote) n.title = c.title || n.title;
  if ("titleEm" in n && !isQuote) n.titleEm = c.titleEm;
  if ("lead" in n && !isQuote) n.lead = c.lead;
  if ("sub" in n && n.type !== "closing") n.sub = c.lead;
  if ("callout" in n) n.callout = isQuote ? (c.callout || c.title || n.callout) : c.callout;
  if ("image" in n && c.image) n.image = c.image;
  const items = c.items;
  switch (n.type) {
    case "bullets": if (items.length) n.items = items; break;
    case "text": if (!isQuote && items.length) n.paras = items; break;
    case "steps": if (items.length) n.steps = items.map((s, i) => { const m = s.split(" — "); return m.length > 1 ? { head: m[0], text: m.slice(1).join(" — ") } : { head: c.heads[i] || `Крок ${i + 1}`, text: s }; }); break;
    case "twocol": if (items.length) { const k = n.cols.length; const per = Math.ceil(items.length / k); n.cols = n.cols.map((col: any, i: number) => ({ head: c.heads[i] || col.head, items: items.slice(i * per, (i + 1) * per).length ? items.slice(i * per, (i + 1) * per) : col.items })); } break;
    case "gallery": if (items.length) n.images = n.images.map((g: any, i: number) => ({ ...g, cap: items[i] ?? g.cap })); break;
    case "closing": if (items.length) n.contacts = items; break;
    case "about": if (items.length) n.facts = items; break;
    case "cover": if (items.length && !c.lead) n.sub = items[0]; break;
    case "diagram": if (p.type !== "diagram" && items.length) n.labels = n.labels.map((l: string, i: number) => items[i] ?? l); break;
    case "section": break;
    case "table": break;
  }
  return n as DeckPage;
}

export const TEMPLATE_BY_TYPE: Record<DeckPageType, string> = { cover: "cover", about: "about", section: "section", text: "text", bullets: "bullets", twocol: "twocol", steps: "steps", table: "table", gallery: "gallery-3", closing: "closing", diagram: "dg-cycle" };
