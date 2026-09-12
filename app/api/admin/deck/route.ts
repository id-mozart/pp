import { NextResponse } from "next/server";
import { getContent, setContent } from "@/lib/db";
import type { Deck, DeckPage } from "@/lib/decks/types";
import { NOVAPAY_DECK } from "@/lib/decks/novapay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULTS: Record<string, Deck> = { novapay: NOVAPAY_DECK };

const s = (v: unknown, max = 4000) => String(v ?? "").slice(0, max);
const arr = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max) : []);
const strs = (v: unknown, max = 40) => arr(v, max).map((x) => s(x, 2000));

function sanitizePage(p: any): DeckPage | null {
  if (!p || typeof p !== "object") return null;
  const id = s(p.id, 32) || Math.random().toString(36).slice(2, 10);
  switch (p.type) {
    case "cover":
      return { id, type: "cover", eyebrow: s(p.eyebrow, 200), title: s(p.title, 300), titleEm: s(p.titleEm, 300), sub: s(p.sub, 500), who: s(p.who, 300), when: s(p.when, 200) };
    case "about":
      return { id, type: "about", title: s(p.title, 200), titleEm: s(p.titleEm, 200), facts: strs(p.facts, 8), note: s(p.note, 500), image: s(p.image, 500), logos: s(p.logos, 500) };
    case "section":
      return { id, type: "section", num: s(p.num, 10), title: s(p.title, 300), sub: s(p.sub, 500), image: s(p.image, 500) || undefined };
    case "text":
      return { id, type: "text", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), paras: strs(p.paras, 12), callout: s(p.callout, 1000), image: s(p.image, 500) || undefined };
    case "bullets":
      return { id, type: "bullets", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), items: strs(p.items, 20), callout: s(p.callout, 1000), image: s(p.image, 500) || undefined };
    case "twocol":
      return { id, type: "twocol", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), cols: arr(p.cols, 6).map((c: any) => ({ head: s(c?.head, 300), items: strs(c?.items, 20) })), image: s(p.image, 500) || undefined };
    case "steps":
      return { id, type: "steps", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), steps: arr(p.steps, 12).map((c: any) => ({ head: s(c?.head, 300), text: s(c?.text, 1500) })), image: s(p.image, 500) || undefined };
    case "table":
      return { id, type: "table", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), head: strs(p.head, 8), rows: arr(p.rows, 30).map((r: any) => strs(r, 8)), callout: s(p.callout, 1000) };
    case "gallery":
      return { id, type: "gallery", title: s(p.title, 300), titleEm: s(p.titleEm, 300), lead: s(p.lead, 1500), images: arr(p.images, 6).map((c: any) => ({ src: s(c?.src, 500), cap: s(c?.cap, 300) })) };
    case "closing":
      return { id, type: "closing", title: s(p.title, 300), titleEm: s(p.titleEm, 300), sub: s(p.sub, 500), contacts: strs(p.contacts, 8), image: s(p.image, 500), qr: s(p.qr, 500) || undefined };
    default:
      return null;
  }
}

function sanitize(input: any, slug: string): Deck {
  const base = DEFAULTS[slug];
  const pages = arr(input?.pages, 80).map(sanitizePage).filter(Boolean) as DeckPage[];
  return {
    slug,
    name: s(input?.name, 200) || base?.name || slug,
    runhead: s(input?.runhead, 200) || base?.runhead || "",
    caps: !!input?.caps,
    pages: pages.length ? pages : base?.pages ?? [],
  };
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug") || "novapay";
  const saved = await getContent<Deck>(`deck:${slug}`);
  return NextResponse.json({ ok: true, deck: saved ?? DEFAULTS[slug] ?? null });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const slug = s(body?.slug, 60);
  if (!body || !slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  const clean = sanitize(body, slug);
  const saved = await setContent(`deck:${slug}`, clean);
  if (!saved) {
    return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  // Скинути до дефолту: зберігаємо дефолтну деку поверх збереженої.
  const slug = new URL(req.url).searchParams.get("slug") || "novapay";
  const base = DEFAULTS[slug];
  if (!base) return NextResponse.json({ ok: false, error: "unknown" }, { status: 404 });
  const saved = await setContent(`deck:${slug}`, base);
  return NextResponse.json({ ok: saved });
}
