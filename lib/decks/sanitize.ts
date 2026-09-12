import type { Deck, DeckPage } from "./types";
import { NOVAPAY_DECK } from "./novapay";

export const DECK_DEFAULTS: Record<string, Deck> = { novapay: NOVAPAY_DECK };

const s = (v: unknown, max = 4000) => String(v ?? "").slice(0, max);
// старий логотип P&P більше не використовуємо — викидаємо з будь-яких збережених даних
const img = (v: unknown) => { const u = s(v, 500); return u && !/pp-logo\.png$/.test(u) ? u : ""; };
const arr = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max) : []);
const strs = (v: unknown, max = 40) => arr(v, max).map((x) => s(x, 2000));

function sanitizePage(p: any): DeckPage | null {
  if (!p || typeof p !== "object") return null;
  const id = s(p.id, 32) || Math.random().toString(36).slice(2, 10);
  switch (p.type) {
    case "cover":
      return { id, type: "cover", eyebrow: s(p.eyebrow, 200), title: s(p.title, 300), titleEm: s(p.titleEm, 300), sub: s(p.sub, 500), who: s(p.who, 300), when: s(p.when, 200) };
    case "about":
      return { id, type: "about", title: s(p.title, 200), titleEm: s(p.titleEm, 200), role: s(p.role, 500) || undefined, quote: s(p.quote, 800) || undefined, stats: arr(p.stats, 6).map((c: any) => ({ n: s(c?.n, 40), t: s(c?.t, 300) })), facts: strs(p.facts, 8), note: s(p.note, 800), image: img(p.image), logos: img(p.logos) };
    case "section":
      return { id, type: "section", num: s(p.num, 10), title: s(p.title, 300), sub: s(p.sub, 500), image: img(p.image) || undefined };
    case "text":
      return { id, type: "text", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), paras: strs(p.paras, 12), callout: s(p.callout, 1000), image: img(p.image) || undefined };
    case "bullets":
      return { id, type: "bullets", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), items: strs(p.items, 20), callout: s(p.callout, 1000), image: img(p.image) || undefined };
    case "twocol":
      return { id, type: "twocol", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), cols: arr(p.cols, 6).map((c: any) => ({ head: s(c?.head, 300), items: strs(c?.items, 20) })), image: img(p.image) || undefined };
    case "steps":
      return { id, type: "steps", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), steps: arr(p.steps, 12).map((c: any) => ({ head: s(c?.head, 300), text: s(c?.text, 1500) })), image: img(p.image) || undefined };
    case "table":
      return { id, type: "table", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), head: strs(p.head, 8), rows: arr(p.rows, 30).map((r: any) => strs(r, 8)), callout: s(p.callout, 1000) };
    case "gallery":
      return { id, type: "gallery", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), images: arr(p.images, 6).map((c: any) => ({ src: img(c?.src), cap: s(c?.cap, 300) })) };
    case "closing":
      return { id, type: "closing", title: s(p.title, 300), titleEm: s(p.titleEm, 300), sub: s(p.sub, 500), contacts: strs(p.contacts, 8), image: img(p.image), qr: img(p.qr) || undefined };
    default:
      return null;
  }
}

export function sanitizeDeck(input: any, slug: string): Deck {
  const base = DECK_DEFAULTS[slug];
  const pages = arr(input?.pages, 80).map(sanitizePage).filter(Boolean) as DeckPage[];
  return {
    slug,
    name: s(input?.name, 200) || base?.name || slug,
    runhead: s(input?.runhead, 200) || base?.runhead || "",
    caps: !!input?.caps,
    pages: pages.length ? pages : base?.pages ?? [],
  };
}

