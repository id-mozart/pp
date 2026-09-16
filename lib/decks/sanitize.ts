import type { Deck, DeckPage } from "./types";
import { NOVAPAY_DECK } from "./novapay";
import { PROFINSTAL_DECK } from "./profinstal";

export const DECK_DEFAULTS: Record<string, Deck> = {
  novapay: { ...NOVAPAY_DECK, notes: false }, // екранна версія — без полів «Нотатки»
  // Друга копія деки: власний запис у базі (deck:novapay2). При першому відкритті
  // копіюється збережена версія novapay (див. DECK_COPY_FROM), далі редагується незалежно.
  novapay2: { ...NOVAPAY_DECK, slug: "novapay2", name: "NovaPay · Активні продажі · копія 2", notes: true },
  // Тестові копії поточних дек: створюються з їх збереженого стану при першому відкритті, живуть окремо.
  "novapay-test": { ...NOVAPAY_DECK, slug: "novapay-test", name: "NovaPay · тестова копія", notes: false },
  "novapay2-test": { ...NOVAPAY_DECK, slug: "novapay2-test", name: "NovaPay · копія 2 · тестова копія", notes: true },
  profinstal: PROFINSTAL_DECK,
};
/** Slug деки: латиниця, цифри, дефіс; 2…60 символів. Деки без шаблону живуть лише в базі (створені з розділу «Презентації»). */
export const isDeckSlug = (v: unknown): v is string => typeof v === "string" && /^[a-z0-9][a-z0-9-]{1,59}$/.test(v);
const TR: Record<string, string> = { а:"a",б:"b",в:"v",г:"h",ґ:"g",д:"d",е:"e",є:"ie",ж:"zh",з:"z",и:"y",і:"i",ї:"i",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ю:"iu",я:"ia",ь:"",ъ:"",ы:"y",э:"e",ё:"e" };
/** Назва → slug: транслітерація, лише [a-z0-9-]. Порожній результат — "deck". */
export function slugify(name: string): string {
  const out = String(name ?? "").toLowerCase().split("").map((ch) => (ch in TR ? TR[ch] : ch)).join("")
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/g, "");
  return out.length >= 2 ? out : "deck";
}
/** Порожня дека для «Нова презентація»: титул + фінал, налаштування як у екранної версії. */
export function blankDeck(slug: string, name: string): Deck {
  return { slug, name, runhead: name, caps: false, fs: 1.1, notes: false, tight: true, logo: "", pages: [
    { id: "c" + Math.random().toString(36).slice(2, 8), type: "cover", eyebrow: "Тренінг", title: name, titleEm: "", sub: "", who: "Бізнес-тренерка Тетяна Пан", when: "Україна, 2026" },
    { id: "z" + Math.random().toString(36).slice(2, 8), type: "closing", title: "Наші", titleEm: "контакти", sub: "", contacts: ["+38 067 007 0710", "+38 050 448 1411", "pan-partners.agency/uk"], image: "/deck/novapay/tania-mic-2.jpg", qr: "/deck/novapay/qr-instagram.svg" },
  ] };
}
/** Звідки взяти вміст при першому відкритті, якщо власного збереження ще немає. */
export const DECK_COPY_FROM: Record<string, string> = { novapay2: "novapay", "novapay-test": "novapay", "novapay2-test": "novapay2" };

const s = (v: unknown, max = 4000) => String(v ?? "").slice(0, max);
const fsOf = (v: unknown, lo = 0.5, hi = 2.4) => { const n = Number(v); return Number.isFinite(n) && n > 0 && Math.abs(n - 1) > 0.001 ? Math.min(hi, Math.max(lo, Math.round(n * 100) / 100)) : undefined; };
// старий логотип P&P більше не використовуємо — викидаємо з будь-яких збережених даних.
// Дозволені лише відносні шляхи сайту (/deck/…, /brand/…, /api/media/…) або https-адреси.
// Зображення: зберігаємо як є, відкидаємо лише небезпечні схеми (javascript:, data:, vbscript:), protocol-relative «//» і старий логотип.
// Жодних «розумних» підмін: невалідний URL краще показати зламаною картинкою, ніж мовчки замінити дефолтом.
const img = (v: unknown) => { const u = s(v, 2000).trim(); if (!u || /pp-logo\.png$/.test(u) || /^\s*(javascript|data|vbscript):/i.test(u) || u.startsWith("//") || /[\s"'<>]/.test(u)) return ""; return u; };
const arr = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max) : []);
const strs = (v: unknown, max = 40) => arr(v, max).map((x) => s(x, 2000));

function sanitizePage(p: any): DeckPage | null {
  const page = sanitizePageInner(p);
  if (!page) return null;
  const fs = fsOf(p?.fs);
  return fs ? { ...page, fs } : page;
}

function sanitizePageInner(p: any): DeckPage | null {
  if (!p || typeof p !== "object") return null;
  const id = s(p.id, 32) || Math.random().toString(36).slice(2, 10);
  switch (p.type) {
    case "cover":
      return { id, type: "cover", eyebrow: s(p.eyebrow, 200), title: s(p.title, 300), titleEm: s(p.titleEm, 300), sub: s(p.sub, 500), who: s(p.who, 300), when: s(p.when, 200), image: img(p.image) || undefined };
    case "about":
      return { id, type: "about", title: s(p.title, 200), titleEm: s(p.titleEm, 200), role: s(p.role, 500) || undefined, quote: s(p.quote, 800) || undefined, stats: arr(p.stats, 6).map((c: any) => ({ n: s(c?.n, 40), t: s(c?.t, 300) })), facts: strs(p.facts, 8), note: s(p.note, 800), image: img(p.image) || "/deck/novapay/tania-profile.jpg", logos: img(p.logos) };
    case "section":
      return { id, type: "section", num: s(p.num, 10), title: s(p.title, 300), sub: s(p.sub, 500), image: img(p.image) || undefined, fit: p.fit === "top" ? "top" : undefined, panel: p.panel ? true : undefined };
    case "text":
      return { id, type: "text", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), paras: strs(p.paras, 12), callout: s(p.callout, 1000), image: img(p.image) || undefined };
    case "bullets":
      return { id, type: "bullets", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), items: strs(p.items, 20), callout: s(p.callout, 1000), image: img(p.image) || undefined, variant: p.variant === "cards" || p.variant === "bubbles" || p.variant === "list" ? p.variant : undefined };
    case "twocol":
      return { id, type: "twocol", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), cols: arr(p.cols, 6).map((c: any) => ({ head: s(c?.head, 300), items: strs(c?.items, 20) })), image: img(p.image) || undefined };
    case "steps":
      return { id, type: "steps", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), steps: arr(p.steps, 12).map((c: any) => ({ head: s(c?.head, 300), text: s(c?.text, 1500) })), image: img(p.image) || undefined };
    case "table":
      return { id, type: "table", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), head: strs(p.head, 8), rows: arr(p.rows, 30).map((r: any) => strs(r, 8)), callout: s(p.callout, 1000) };
    case "gallery":
      return { id, type: "gallery", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), images: arr(p.images, 6).map((c: any) => ({ src: img(c?.src), cap: s(c?.cap, 300) })) };
    case "closing":
      return { id, type: "closing", title: s(p.title, 300), titleEm: s(p.titleEm, 300), sub: s(p.sub, 500), contacts: strs(p.contacts, 8), image: img(p.image) || "/deck/novapay/tania.jpg", qr: img(p.qr) || undefined };
    default:
      return null;
  }
}

/**
 * Підтягує лише структурні дизайн-оновлення з дефолтної деки у збережену версію (за id сторінки):
 * зміну типу сторінки та варіант списку. ЗОБРАЖЕННЯ НЕ ЧІПАЄМО — їх обирає користувач у редакторі.
 */
function upgradePage(saved: DeckPage, def: DeckPage | undefined): DeckPage {
  if (!def) return saved;
  const out: any = { ...saved };
  if (saved.type !== def.type) {
    if (saved.type === "text" && def.type === "bullets") return { ...def, title: saved.title, titleEm: saved.titleEm, lead: saved.lead, items: saved.paras.length ? saved.paras : def.items, callout: saved.callout, image: saved.image, fs: saved.fs };
    if (saved.type === "text" && def.type === "closing") return { ...def, title: saved.title, titleEm: saved.titleEm, contacts: saved.paras.length ? saved.paras : def.contacts, image: saved.image ?? def.image, fs: saved.fs };
    return saved;
  }
  // варіант списку: дефолт лише коли поле ще не заповнювалось; явне "list" — вибір користувача
  if (def.type === "bullets" && saved.type === "bullets") { if (saved.variant === undefined && def.variant) out.variant = def.variant; }
  return out as DeckPage;
}

/**
 * fallbackToDefault: лише для дек, яких у базі ще немає. Для збереженої деки порожній результат
 * санітайзу — це помилка даних, а не привід підставити дефолт (сторінка тоді показує попередження).
 */
export function sanitizeDeck(input: any, slug: string, opts: { fallbackToDefault?: boolean } = {}): Deck {
  const base = DECK_DEFAULTS[slug];
  const byId = new Map<string, DeckPage>((base?.pages ?? []).map((p) => [p.id, p]));
  const pages = (arr(input?.pages, 200).map(sanitizePage).filter(Boolean) as DeckPage[]).map((p) => upgradePage(p, byId.get(p.id)));
  const fallback = opts.fallbackToDefault !== false;
  return {
    slug,
    name: input?.name === undefined ? (base?.name || slug) : s(input.name, 200),
    runhead: input?.runhead === undefined ? (base?.runhead || "") : s(input.runhead, 200),
    caps: !!input?.caps,
    // нотатки: явне значення зі збереженої деки; якщо поля ще немає — з дефолту цього slug
    notes: typeof input?.notes === "boolean" ? input.notes : base?.notes !== false,
    tight: typeof input?.tight === "boolean" ? input.tight : !!base?.tight,
    // логотип на титулі: явний рядок (навіть порожній) зберігаємо; відсутній — з шаблону (для NovaPay — їх логотип)
    logo: typeof input?.logo === "string" ? img(input.logo) : base?.logo,
    // множник кегля деки: явне число (навіть 1) зберігаємо; відсутнє — беремо з дефолтної деки
    fs: (() => { const n = Number(input?.fs); return Number.isFinite(n) && n > 0 ? Math.min(1.8, Math.max(0.6, Math.round(n * 100) / 100)) : base?.fs; })(),
    pages: pages.length ? pages : fallback ? base?.pages ?? [] : [],
  };
}

