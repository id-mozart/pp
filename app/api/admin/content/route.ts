import { NextResponse } from "next/server";
import { getContent, setContent } from "@/lib/db";
import {
  mergeMainContent,
  type MainContent,
  type MainContentOverride,
} from "@/lib/mainContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const s = (v: unknown, max = 4000) => String(v ?? "").slice(0, max);

function sanitize(input: any): MainContent {
  // Merge incoming over defaults, then re-read the merged object so every
  // field is present and string-clipped — junk keys are dropped.
  const m = mergeMainContent(input as MainContentOverride);
  return {
    hero: {
      eyebrow: s(m.hero.eyebrow, 200),
      titleTop: s(m.hero.titleTop, 300),
      titleEm: s(m.hero.titleEm, 300),
      lead: s(m.hero.lead, 1000),
      ctaPrimary: s(m.hero.ctaPrimary, 120),
      ctaSecondary: s(m.hero.ctaSecondary, 120),
    },
    company: {
      eyebrow: s(m.company.eyebrow, 200),
      headTop: s(m.company.headTop, 200),
      headEm: s(m.company.headEm, 200),
      headTail: s(m.company.headTail, 200),
      para1: s(m.company.para1, 2000),
      para2: s(m.company.para2, 2000),
      cta: s(m.company.cta, 120),
    },
    architect: {
      eyebrow: s(m.architect.eyebrow, 200),
      nameTop: s(m.architect.nameTop, 120),
      nameEm: s(m.architect.nameEm, 120),
      para1: s(m.architect.para1, 2000),
      para2: s(m.architect.para2, 2000),
      quote: s(m.architect.quote, 1000),
      quoteAuthor: s(m.architect.quoteAuthor, 200),
      image: s(m.architect.image, 500),
    },
    mentoring: {
      eyebrow: s(m.mentoring.eyebrow, 200),
      headTop: s(m.mentoring.headTop, 120),
      headEm: s(m.mentoring.headEm, 120),
      lead: s(m.mentoring.lead, 2000),
      ctaPrimary: s(m.mentoring.ctaPrimary, 120),
      ctaSecondary: s(m.mentoring.ctaSecondary, 120),
      image: s(m.mentoring.image, 500),
    },
    faq: m.faq.slice(0, 12).map((f) => ({ q: s(f.q, 300), a: s(f.a, 2000) })),
  };
}

export async function GET() {
  const override = await getContent<MainContentOverride>("main");
  return NextResponse.json({ ok: true, content: mergeMainContent(override) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const clean = sanitize(body);
  const saved = await setContent("main", clean);
  if (!saved) {
    return NextResponse.json(
      { ok: false, error: "no_db" },
      { status: 503 },
    );
  }
  return NextResponse.json({ ok: true });
}
