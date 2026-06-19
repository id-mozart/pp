"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, ReactNode } from "react";
import { toPng } from "html-to-image";

/* =====================================================================
   Instagram-carousel studio — generates 1080×1350 PNGs from the
   Сільпо × Pan&Partners handoff template (v4 «Ember»).
   Three slide types: cover · numbered content · closing.
   Named layouts are saved to localStorage; sections collapse.
   ===================================================================== */

const W = 1080;
const H = 1350;
const PREVIEW_SCALE = 0.42;
const THUMB_SCALE = 0.072;

/* Photo framing: base object-position (pos) + direct pan/zoom on top */
interface Frame {
  photo: string;
  pos: string;
  tx: number;
  ty: number;
  zoom: number;
}
interface CoverData extends Frame {
  eyebrow: string;
  title: string;
  sub: string;
  tag: string;
}
interface ContentData extends Frame {
  kicker: string;
  title: string;
  body: string;
  /* «Нотатки» template only */
  attop?: boolean;
  scrim?: "bottom" | "t" | "tstrong";
  nowrap?: boolean;
  h2px?: number;
}
interface ClosingData extends Frame {
  eyebrow: string;
  title: string;
  quote: string;
  ctaText: string;
  ctaLink: string;
  /* «Нотатки» template only */
  sign?: string;
}

type TemplateId = "ember" | "notes";

/* A full carousel project = everything needed to reproduce a layout. */
interface Project {
  template?: TemplateId;
  brand: string;
  meta: string;
  logo: string | null;
  cover: CoverData;
  slides: ContentData[];
  closing: ClosingData;
}
interface SavedProject {
  id: string;
  name: string;
  updatedAt: number;
  data: Project;
}

const PROJECTS_KEY = "pp-carousel-projects-v1";

function loadProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    const list = raw ? (JSON.parse(raw) as SavedProject[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
/** Returns false if the write failed (usually quota — big base64 photos). */
function persistProjects(list: SavedProject[]): boolean {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(36).slice(2, 7);

const imgTransform = (d: Frame) =>
  `translate(${d.tx}px, ${d.ty}px) scale(${d.zoom})`;

const DEFAULT_COVER: CoverData = {
  eyebrow: "Бізнес-тренінг",
  title: "Результативні переговори команди *Сільпо-Фуд*",
  sub: "Актуальні інструменти ведення переговорів з орендарями",
  tag: "Бізнес-тренерка **Тетяна Пан**",
  photo: "/brand/Tania5.jpg",
  pos: "74% 48%",
  tx: 0,
  ty: 0,
  zoom: 1,
};

const DEFAULT_SLIDES: ContentData[] = [
  {
    kicker: "Початок",
    title: "Альянс *з перших хвилин*",
    body: "Буквально з перших хвилин, коли учасники озвучували свої цілі й очікування, було відчуття, що ми не просто працюємо на тренінгу, а разом створюємо рішення.",
    photo: "/brand/Tania1-2.webp",
    pos: "center 24%",
    tx: 0,
    ty: 0,
    zoom: 1,
  },
  {
    kicker: "Єдність",
    title: "Команда, об'єднана *по-справжньому*",
    body: "У кожного свій рівень, свій підхід, свій стиль, але всі дуже чітко розуміють цілі, навіщо вони це роблять і чому хочуть робити це круто.",
    photo: "/brand/Tania1-3.webp",
    pos: "center 30%",
    tx: 0,
    ty: 0,
    zoom: 1,
  },
  {
    kicker: "Розвиток",
    title: "Розвиток команди видно *в дії*",
    body: "З кожною рольовою грою, з кожним кейсом було видно, як учасники швидко розуміють, що потрібно змінити, і одразу пробують нові підходи.",
    photo: "/brand/1M6A0522.webp",
    pos: "center 20%",
    tx: 0,
    ty: 0,
    zoom: 1,
  },
];

const DEFAULT_CLOSING: ClosingData = {
  eyebrow: "Дякуємо",
  title: "До нових *результатів*",
  quote:
    "Це наш **3-й** спільний проєкт з компанією Сільпо і **2-й** саме з цією командою та керівником. Дякуємо за довіру.",
  ctaText: "Хочете так само для своєї команди?",
  ctaLink: "напишіть у директ →",
  photo: "/brand/Tania3.webp",
  pos: "center top",
  tx: 0,
  ty: 0,
  zoom: 1.07,
};

/* ---- «Нотатки дружини · Рік у шлюбі» (full-bleed) defaults ---- */

const NOTES_COVER: CoverData = {
  eyebrow: "Нотатки дружини",
  title: "Чого мене навчив\nперший *рік* у шлюбі",
  sub: "",
  tag: "",
  photo: "/brand/notes/kiss.jpg",
  pos: "center 44%",
  tx: 0,
  ty: 0,
  zoom: 1,
};

const NOTES_SLIDES: ContentData[] = [
  {
    kicker: "Думка перша",
    title: "Усе складається, коли поруч — *твоя людина*.",
    body: "Не ідеально. Але по-справжньому —\nі саме це виявилось головним.",
    photo: "/brand/notes/registry.jpg",
    pos: "center 12%",
    attop: false,
    scrim: "bottom",
    tx: 0,
    ty: 0,
    zoom: 1,
  },
  {
    kicker: "Думка друга",
    title: "Ідеальних не існує — ні *чоловіків*, ні *дружин*.",
    body: "Головне, щоб збігалося головне: цінності, погляди, напрям. Решта — деталі.",
    photo: "/brand/notes/toast.jpg",
    pos: "center 50%",
    attop: true,
    scrim: "tstrong",
    tx: 0,
    ty: 0,
    zoom: 1,
  },
  {
    kicker: "Думка третя",
    title: "Є речі, де можна просто *промовчати*.",
    body: "Не все, що дратує, варте суперечки. Що для мене не критично — відпускаю.",
    photo: "/brand/notes/murmuradores.jpg",
    pos: "center 38%",
    attop: true,
    scrim: "t",
    nowrap: true,
    h2px: 60,
    tx: 0,
    ty: 0,
    zoom: 1,
  },
  {
    kicker: "Думка четверта",
    title: "А є речі, де треба *відстояти своє*.",
    body: "І найскладніше за весь рік — навчитися\nне плутати одне з іншим.",
    photo: "/brand/notes/holding.jpg",
    pos: "center 14%",
    attop: true,
    scrim: "t",
    tx: 0,
    ty: 0,
    zoom: 1,
  },
  {
    kicker: "Думка п'ята",
    title: "Можна бути щасливою з тим, хто *зовсім інший*.",
    body: "Інша культура, мова, звички, спосіб життя —\nі це справді працює.",
    photo: "/brand/notes/pool-hug.jpg",
    pos: "center 13%",
    attop: true,
    scrim: "t",
    tx: 0,
    ty: 0,
    zoom: 1.16,
  },
];

const NOTES_CLOSING: ClosingData = {
  eyebrow: "І наостанок",
  title: "А ще він мене щодня *дивує*.",
  quote:
    "Дуже серйозний — і водночас неможливо романтичний. Навіть пес уже звик до наших танців біля басейну.",
  ctaText: "",
  ctaLink: "",
  sign: "рік разом — і це лише початок",
  photo: "/brand/notes/bride-bed.jpg",
  pos: "center 22%",
  tx: 0,
  ty: 0,
  zoom: 1,
};

/* `*текст*` → <em>, `**текст**` → <b> (як у макеті) */
function rich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <b key={i}>{part.slice(2, -2)}</b>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return <span key={i}>{part}</span>;
  });
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/** Minimal font-embed CSS: only the @font-face rules whose family is actually
    used inside `node` (the site ships ~190 faces; a slide uses ~3 families).
    Lets html-to-image embed fonts in ~1–2s instead of ~25s. */
async function buildSlideFontCss(node: HTMLElement): Promise<string> {
  const used = new Set<string>();
  const collect = (el: Element) => {
    getComputedStyle(el)
      .fontFamily.split(",")
      .forEach((f) => used.add(f.trim().replace(/^["']|["']$/g, "").toLowerCase()));
  };
  collect(node);
  node.querySelectorAll("*").forEach(collect);

  const faces: CSSFontFaceRule[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const r of Array.from(rules)) {
      if (r.type === CSSRule.FONT_FACE_RULE) {
        const fam = (r as CSSFontFaceRule).style
          .getPropertyValue("font-family")
          .replace(/^["']|["']$/g, "")
          .trim()
          .toLowerCase();
        if (used.has(fam)) faces.push(r as CSSFontFaceRule);
      }
    }
  }

  const toDataUrl = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(new URL(url, location.href).href);
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const parts = await Promise.all(
    faces.map(async (rule) => {
      let css = rule.cssText;
      const urls = Array.from(
        rule.style.getPropertyValue("src").matchAll(/url\(["']?([^"')]+)["']?\)/g),
      ).map((m) => m[1]);
      for (const u of urls) {
        if (u.startsWith("data:")) continue;
        const data = await toDataUrl(u);
        if (data) css = css.split(u).join(data);
      }
      return css;
    }),
  );
  return parts.join("\n");
}

/* ------------------------------ slides ------------------------------ */

function Lockup({ brand, logo }: { brand: string; logo: string | null }) {
  return (
    <div className="ig-lockup">
      {logo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="ig-sip-logo" src={logo} alt={brand} />
      ) : (
        <span className="ig-sip">{brand}</span>
      )}
      <span className="ig-div" />
      <span className="ig-pp">
        Pan<span className="ig-amp">&amp;</span>Partners
      </span>
    </div>
  );
}

function CoverSlide({
  d,
  brand,
  logo,
  meta,
}: {
  d: CoverData;
  brand: string;
  logo: string | null;
  meta: string;
}) {
  return (
    <section className="ig-slide ig-cover">
      <div className="ig-cover-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos, transform: imgTransform(d) }} />
      </div>
      <div className="ig-cover-shade" />
      <div className="ig-cover-in">
        <div className="ig-top">
          <Lockup brand={brand} logo={logo} />
          <span className="ig-ctag ig-ktag">
            <b>{meta}</b>
          </span>
        </div>
        <div className="ig-eyebrow ig-cover-eb">{d.eyebrow}</div>
        <h1 className="ig-h1">{rich(d.title)}</h1>
        <div className="ig-cover-sub">
          <hr className="ig-gold-rule" />
          <p>{d.sub}</p>
        </div>
      </div>
      <div className="ig-cover-tags">
        <span className="ig-ctag">{rich(d.tag)}</span>
      </div>
    </section>
  );
}

function ContentSlide({
  d,
  n,
  brand,
  meta,
}: {
  d: ContentData;
  n: number;
  brand: string;
  meta: string;
}) {
  return (
    <section className="ig-slide">
      <div className="ig-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos, transform: imgTransform(d) }} />
      </div>
      <div className="ig-scrim-top" />
      <div className="ig-scrim-bot" />
      <div className="ig-runhead">
        <span className="ig-dot" />
        {brand} <span className="ig-x">✕</span> Pan &amp; Partners
        <span className="ig-right">{meta}</span>
      </div>
      <div className="ig-card">
        <div className="ig-ix">
          {String(n).padStart(2, "0")} — {d.kicker}
        </div>
        <h2 className="ig-h2">{rich(d.title)}</h2>
        <p>{d.body}</p>
      </div>
    </section>
  );
}

function ClosingSlide({
  d,
  brand,
  logo,
  meta,
}: {
  d: ClosingData;
  brand: string;
  logo: string | null;
  meta: string;
}) {
  return (
    <section className="ig-slide ig-closing">
      <div className="ig-photo ig-close-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos, transform: imgTransform(d) }} />
      </div>
      <div className="ig-scrim-bot ig-close-scrim" />
      <div className="ig-close-glow" />
      <div className="ig-close-in">
        <div className="ig-eyebrow">{d.eyebrow}</div>
        <h2 className="ig-close-h2">{rich(d.title)}</h2>
        <p className="ig-close-quote">{rich(d.quote)}</p>
        <div className="ig-top ig-close-foot2">
          <Lockup brand={brand} logo={logo} />
          <span className="ig-ctag ig-ktag">
            <b>{meta}</b>
          </span>
        </div>
        <div className="ig-cta">
          <span className="ig-cta-text">{d.ctaText}</span>
          <span className="ig-cta-link">{d.ctaLink}</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------- «Нотатки» (full-bleed) slides -------------------- */

function NotesCover({
  d,
}: {
  d: CoverData;
  brand: string;
  logo: string | null;
  meta: string;
}) {
  return (
    <section className="nt-slide nt-cover">
      <div className="ph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos, transform: imgTransform(d) }} />
      </div>
      <div className="scrim top" />
      <div className="edge" />
      <div className="ct">
        <div className="eyebrow">
          <span className="ln" />
          <span className="label">{d.eyebrow}</span>
          <span className="ln" />
        </div>
        <h1>{rich(d.title)}</h1>
      </div>
    </section>
  );
}

function NotesContent({
  d,
}: {
  d: ContentData;
  n: number;
  brand: string;
  meta: string;
}) {
  const scrimCls = d.attop
    ? d.scrim === "tstrong"
      ? "scrim tstrong"
      : "scrim t"
    : "scrim";
  const h2style: CSSProperties = {};
  if (d.h2px) h2style.fontSize = `${d.h2px}px`;
  if (d.nowrap) h2style.whiteSpace = "nowrap";
  return (
    <section className="nt-slide">
      <div className="ph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos, transform: imgTransform(d) }} />
      </div>
      <div className={scrimCls} />
      <div className="edge" />
      <div className={`tx${d.attop ? " attop" : ""}`}>
        <div className="row">
          <span className="label">{d.kicker}</span>
        </div>
        <h2 style={h2style}>{rich(d.title)}</h2>
        <p>{rich(d.body)}</p>
      </div>
    </section>
  );
}

function NotesFinal({
  d,
}: {
  d: ClosingData;
  brand: string;
  logo: string | null;
  meta: string;
}) {
  return (
    <section className="nt-slide nt-final">
      <div className="ph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos, transform: imgTransform(d) }} />
      </div>
      <div className="scrim" />
      <div className="edge" />
      <div className="corner-dark" />
      <div className="fin-top">
        <span className="label">{d.eyebrow}</span>
      </div>
      <div className="tx">
        <h2>{rich(d.title)}</h2>
        <p>{rich(d.quote)}</p>
        {d.sign ? <div className="sign">{d.sign}</div> : null}
      </div>
    </section>
  );
}

/* --------------------------- template registry --------------------------- */

interface TemplateDef {
  id: TemplateId;
  label: string;
  Cover: (p: {
    d: CoverData;
    brand: string;
    logo: string | null;
    meta: string;
  }) => JSX.Element;
  Content: (p: {
    d: ContentData;
    n: number;
    brand: string;
    meta: string;
  }) => JSX.Element;
  Closing: (p: {
    d: ClosingData;
    brand: string;
    logo: string | null;
    meta: string;
  }) => JSX.Element;
  defaults: Project;
  /* per-section editor extras shown only for this template */
  hasGeneral: boolean;
  newSlide: () => ContentData;
}

const TEMPLATES: Record<TemplateId, TemplateDef> = {
  ember: {
    id: "ember",
    label: "Ember · Сільпо",
    Cover: CoverSlide,
    Content: ContentSlide,
    Closing: ClosingSlide,
    hasGeneral: true,
    defaults: {
      template: "ember",
      brand: "Сільпо-Фуд",
      meta: "Київ · 2026",
      logo: null,
      cover: DEFAULT_COVER,
      slides: DEFAULT_SLIDES,
      closing: DEFAULT_CLOSING,
    },
    newSlide: () => ({
      kicker: "Новий слайд",
      title: "Заголовок з *акцентом*",
      body: "Текст слайда…",
      photo: "/brand/ph/p1.jpg",
      pos: "center 30%",
      tx: 0,
      ty: 0,
      zoom: 1,
    }),
  },
  notes: {
    id: "notes",
    label: "Нотатки · Рік у шлюбі",
    Cover: NotesCover,
    Content: NotesContent,
    Closing: NotesFinal,
    hasGeneral: false,
    defaults: {
      template: "notes",
      brand: "",
      meta: "",
      logo: null,
      cover: NOTES_COVER,
      slides: NOTES_SLIDES,
      closing: NOTES_CLOSING,
    },
    newSlide: () => ({
      kicker: "Думка наступна",
      title: "Короткий заголовок з *акцентом*.",
      body: "Текст думки у два рядки —\nкороткий і теплий.",
      photo: "/brand/notes/kiss.jpg",
      pos: "center 30%",
      attop: true,
      scrim: "t",
      tx: 0,
      ty: 0,
      zoom: 1,
    }),
  },
};

/* ------------------------------ editor ------------------------------ */

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-line/60 bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-gold/60";

function TextInput({
  value,
  onChange,
  rows,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  if (rows)
    return (
      <textarea
        className={inputCls}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  return (
    <input
      className={inputCls}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function PhotoInput({
  photo,
  zoom,
  onPhoto,
  onZoom,
  onReset,
}: {
  photo: string;
  zoom: number;
  onPhoto: (dataUrl: string) => void;
  onZoom: (v: number) => void;
  onReset: () => void;
}) {
  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPhoto(await readFileAsDataURL(f));
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-3">
        <div
          className="h-14 w-14 shrink-0 rounded-lg border border-line/60 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
        <div className="min-w-0 flex-1">
          <Field label="Фото · тягніть мишкою прямо у прев'ю">
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:text-gold"
            />
          </Field>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <Field label={`Масштаб · ${zoom.toFixed(2)}×`}>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => onZoom(parseFloat(e.target.value))}
              className="w-full accent-[#E2A638]"
            />
          </Field>
        </div>
        <button
          onClick={onReset}
          className="shrink-0 rounded-full border border-line/70 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          Скинути кадр
        </button>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line/50 bg-surface/60 p-4">
      <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-gold">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={`h-3 w-3 shrink-0 text-muted transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M2 4.5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Collapsible slide block: compact header (+ thumbnail when collapsed) ·
    full editor + draggable preview when open. The preview keeps the export
    ref whether collapsed or open, so "all PNGs" always works. */
function SlideRow({
  title,
  name,
  busy,
  collapsed,
  onToggle,
  onExport,
  onDelete,
  setRef,
  slide,
  onDrag,
  children,
}: {
  title: string;
  name: string;
  busy: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onExport: () => void;
  onDelete?: () => void;
  setRef: (el: HTMLDivElement | null) => void;
  slide: ReactNode;
  onDrag?: (dx: number, dy: number) => void;
  children: ReactNode;
}) {
  const drag = useRef<{ x: number; y: number } | null>(null);
  return (
    <div className="overflow-hidden rounded-2xl border border-line/50 bg-surface/40">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <button
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-2.5 py-1 text-left"
        >
          <Chevron open={!collapsed} />
          <span className="truncate font-mono text-xs uppercase tracking-[0.16em] text-gold">
            {title}
          </span>
          <code className="hidden font-mono text-[0.58rem] text-faint sm:inline">
            {name}
          </code>
        </button>

        {collapsed && (
          <div
            className="shrink-0 overflow-hidden rounded-md ring-1 ring-line/50"
            style={{ width: W * THUMB_SCALE, height: H * THUMB_SCALE }}
          >
            <div
              ref={setRef}
              style={{
                width: W,
                height: H,
                transform: `scale(${THUMB_SCALE})`,
                transformOrigin: "top left",
                pointerEvents: "none",
              }}
            >
              {slide}
            </div>
          </div>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            title="Видалити слайд"
            className="shrink-0 rounded-full border border-line/70 px-2 py-1 font-mono text-[0.6rem] text-faint transition-colors hover:border-ember/60 hover:text-ember"
          >
            ✕
          </button>
        )}
        <button
          onClick={onExport}
          disabled={busy}
          className="shrink-0 rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
        >
          PNG ↓
        </button>
      </div>

      {/* body */}
      {!collapsed && (
        <div className="grid items-start gap-5 border-t border-line/40 px-4 pb-4 pt-4 lg:grid-cols-[minmax(260px,380px)_auto]">
          <div className="flex flex-col gap-3">{children}</div>
          <figure className="flex flex-col gap-2">
            <div
              className="select-none overflow-hidden rounded-xl ring-1 ring-line/50"
              style={{
                width: W * PREVIEW_SCALE,
                height: H * PREVIEW_SCALE,
                cursor: onDrag ? "grab" : "default",
                touchAction: "none",
              }}
              onPointerDown={(e) => {
                if (!onDrag) return;
                drag.current = { x: e.clientX, y: e.clientY };
                e.currentTarget.setPointerCapture?.(e.pointerId);
                e.currentTarget.style.cursor = "grabbing";
              }}
              onPointerMove={(e) => {
                if (!onDrag || !drag.current) return;
                const dx = (e.clientX - drag.current.x) / PREVIEW_SCALE;
                const dy = (e.clientY - drag.current.y) / PREVIEW_SCALE;
                drag.current = { x: e.clientX, y: e.clientY };
                onDrag(dx, dy);
              }}
              onPointerUp={(e) => {
                drag.current = null;
                e.currentTarget.style.cursor = "grab";
              }}
              onPointerCancel={(e) => {
                drag.current = null;
                e.currentTarget.style.cursor = "grab";
              }}
            >
              <div
                ref={setRef}
                style={{
                  width: W,
                  height: H,
                  transform: `scale(${PREVIEW_SCALE})`,
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
              >
                {slide}
              </div>
            </div>
            {onDrag && (
              <figcaption
                className="font-mono text-[0.6rem] text-faint"
                style={{ width: W * PREVIEW_SCALE }}
              >
                ↔ тягніть фото у прев&apos;ю, щоб кадрувати
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ studio ------------------------------ */

export function CarouselStudio() {
  const [template, setTemplate] = useState<TemplateId>("ember");
  const [brand, setBrand] = useState("Сільпо-Фуд");
  const [meta, setMeta] = useState("Київ · 2026");
  const [logo, setLogo] = useState<string | null>(null);
  const [cover, setCover] = useState<CoverData>(DEFAULT_COVER);
  const [slides, setSlides] = useState<ContentData[]>(DEFAULT_SLIDES);
  const [closing, setClosing] = useState<ClosingData>(DEFAULT_CLOSING);
  const [busy, setBusy] = useState<string | null>(null);

  const T = TEMPLATES[template];
  const fontCssRef = useRef<string | null>(null); // cached minimal font-embed CSS

  /* Saved layouts (localStorage) + per-section collapse state */
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const isCol = (key: string, def: boolean) => collapsed[key] ?? def;
  const toggle = (key: string, def: boolean) =>
    setCollapsed((c) => ({ ...c, [key]: !(c[key] ?? def) }));
  const setAll = (v: boolean) =>
    setCollapsed(
      Object.fromEntries(
        ["cover", ...slides.map((_, i) => `s${i}`), "closing"].map((k) => [k, v]),
      ),
    );

  const currentProject = (): Project => ({
    template,
    brand,
    meta,
    logo,
    cover,
    slides,
    closing,
  });

  const applyProject = (d: Project) => {
    setTemplate(d.template ?? "ember");
    setBrand(d.brand);
    setMeta(d.meta);
    setLogo(d.logo);
    setCover(clone(d.cover));
    setSlides(clone(d.slides));
    setClosing(clone(d.closing));
  };

  const switchTemplate = (id: TemplateId) => {
    if (id === template) return;
    fontCssRef.current = null; // fonts differ per template — recompute on next export
    applyProject(TEMPLATES[id].defaults);
    setActiveId(null);
    setProjectName("");
    setCollapsed({});
    setSaveError(null);
  };

  const saveLayout = (asCopy: boolean) => {
    const name = projectName.trim() || `Макет ${projects.length + 1}`;
    const now = Date.now();
    const data = clone(currentProject());
    let next: SavedProject[];
    if (!asCopy && activeId) {
      next = projects.map((p) =>
        p.id === activeId ? { ...p, name, updatedAt: now, data } : p,
      );
    } else {
      const id = newId();
      next = [...projects, { id, name, updatedAt: now, data }];
      setActiveId(id);
      setProjectName(name);
    }
    setProjects(next);
    setSaveError(
      persistProjects(next)
        ? null
        : "Не вдалося зберегти: завеликі зображення. Зменшіть фото або кількість макетів.",
    );
  };

  const loadLayout = (p: SavedProject) => {
    applyProject(p.data);
    setActiveId(p.id);
    setProjectName(p.name);
    setSaveError(null);
  };

  const deleteLayout = (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    persistProjects(next);
    if (activeId === id) setActiveId(null);
  };

  const newLayout = () => {
    applyProject(TEMPLATES[template].defaults);
    setActiveId(null);
    setProjectName("");
    setCollapsed({});
    setSaveError(null);
  };

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const total = slides.length + 2;
  const names = [
    "01-cover.png",
    ...slides.map((_, i) => `${String(i + 2).padStart(2, "0")}-slide.png`),
    `${String(total).padStart(2, "0")}-closing.png`,
  ];

  const patchSlide = (i: number, patch: Partial<ContentData>) =>
    setSlides((s) => s.map((sl, k) => (k === i ? { ...sl, ...patch } : sl)));

  const addSlide = () => {
    const idx = slides.length;
    setSlides((s) => [...s, T.newSlide()]);
    setCollapsed((c) => ({ ...c, [`s${idx}`]: false })); // open the new slide
  };

  const removeSlide = (i: number) =>
    setSlides((s) => s.filter((_, k) => k !== i));

  // The site ships ~190 @font-face rules; html-to-image base64-embeds ALL of them
  // on every export (~25s). Instead we embed only the few families this slide
  // actually uses, then cache the result (cleared when the template changes).
  const ensureFontCss = useCallback(async (node: HTMLElement) => {
    if (fontCssRef.current === null) {
      try {
        fontCssRef.current = await buildSlideFontCss(node);
      } catch {
        fontCssRef.current = "";
      }
    }
    return fontCssRef.current;
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      const node = refs.current[0];
      if (node) void ensureFontCss(node);
    }, 700);
    return () => clearTimeout(id);
  }, [ensureFontCss, template]);

  const exportOne = useCallback(
    async (idx: number) => {
      const node = refs.current[idx];
      if (!node) return null;
      const fontEmbedCSS = await ensureFontCss(node);
      const dataUrl = await toPng(node, {
        width: W,
        height: H,
        pixelRatio: 1,
        style: { transform: "none" },
        fontEmbedCSS,
      });
      return dataUrl;
    },
    [ensureFontCss],
  );

  const download = (dataUrl: string, name: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = name;
    a.click();
  };

  const handleExport = async (idx: number) => {
    setBusy(names[idx]);
    try {
      const url = await exportOne(idx);
      if (url) download(url, names[idx]);
    } finally {
      setBusy(null);
    }
  };

  const handleExportAll = async () => {
    for (let i = 0; i < total; i++) {
      setBusy(names[i]);
      try {
        const url = await exportOne(i);
        if (url) download(url, names[i]);
        await new Promise((r) => setTimeout(r, 350));
      } catch {
        /* continue with the rest */
      }
    }
    setBusy(null);
  };

  // Test hook: returns the dataURL of a slide without downloading.
  if (typeof window !== "undefined") {
    (window as any).__ppExportSlide = exportOne;
    (window as any).__ppSetLogo = setLogo;
  }

  return (
    <section className="container-shell pb-24 pt-28">
      <style dangerouslySetInnerHTML={{ __html: SLIDE_CSS + NOTES_CSS }} />

      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Адмін · студія</span>
          <h1 className="mt-2 text-[clamp(1.5rem,2.8vw,2.1rem)] leading-tight text-ink">
            Генератор Instagram-каруселі
          </h1>
          <p className="mt-1.5 max-w-xl text-xs text-muted">
            1080×1350 · обкладинка · слайди · фінальний. Акценти:{" "}
            <code className="text-gold">*курсив*</code>{" "}
            <code className="text-gold">**жирний**</code>.
          </p>
        </div>
        <button
          onClick={handleExportAll}
          disabled={busy !== null}
          className="btn btn-primary disabled:opacity-60"
        >
          {busy ? `Генеруємо ${busy}…` : `Усі PNG (${total})`}
        </button>
      </header>

      {/* Template picker */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-xs uppercase tracking-[0.18em] text-gold">
          Шаблон
        </span>
        {Object.values(TEMPLATES).map((t) => (
          <button
            key={t.id}
            onClick={() => switchTemplate(t.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              template === t.id
                ? "border-gold/60 bg-gold/15 text-gold"
                : "border-line/70 text-muted hover:border-gold/40 hover:text-gold"
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="text-xs text-faint">
          · {total} слайдів · 1080×1350
        </span>
      </div>

      {/* Saved layouts */}
      <div className="mb-4 rounded-2xl border border-line/50 bg-surface/60 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs uppercase tracking-[0.18em] text-gold">
            Макети
          </span>
          {projects.length === 0 ? (
            <span className="text-xs text-faint">ще немає збережених</span>
          ) : (
            projects.map((p) => (
              <span
                key={p.id}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                  activeId === p.id
                    ? "border-gold/60 text-gold"
                    : "border-line/70 text-muted hover:border-gold/40 hover:text-gold"
                }`}
              >
                <button
                  onClick={() => loadLayout(p)}
                  className="max-w-[16ch] truncate"
                  title="Завантажити макет"
                >
                  {p.name}
                </button>
                <button
                  onClick={() => deleteLayout(p.id)}
                  title="Видалити макет"
                  className="text-faint hover:text-ember"
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Назва макета"
            className="w-44 rounded-lg border border-line/60 bg-surface px-3 py-1.5 text-sm text-ink outline-none transition-colors focus:border-gold/60"
          />
          <button
            onClick={() => saveLayout(false)}
            className="rounded-full bg-gold/15 px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-gold transition-colors hover:bg-gold/25"
          >
            {activeId ? "Оновити" : "Зберегти"}
          </button>
          {activeId && (
            <button
              onClick={() => saveLayout(true)}
              className="rounded-full border border-line/70 px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              Зберегти копію
            </button>
          )}
          <button
            onClick={newLayout}
            className="ml-auto rounded-full border border-line/70 px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-muted transition-colors hover:border-gold/50 hover:text-gold"
          >
            Новий
          </button>
        </div>
        {saveError && <p className="mt-2 text-xs text-ember">{saveError}</p>}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setAll(false)}
            className="font-mono text-[0.62rem] uppercase tracking-wider text-faint transition-colors hover:text-gold"
          >
            розгорнути все
          </button>
          <span className="text-faint">·</span>
          <button
            onClick={() => setAll(true)}
            className="font-mono text-[0.62rem] uppercase tracking-wider text-faint transition-colors hover:text-gold"
          >
            згорнути все
          </button>
        </div>

        {T.hasGeneral && (
        <Panel title="Загальне">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Бренд клієнта (зліва в лого та шапці)">
              <TextInput value={brand} onChange={setBrand} />
            </Field>
            <Field label="Мітка справа (місто · рік)">
              <TextInput value={meta} onChange={setMeta} />
            </Field>
          </div>
          <div className="flex items-end gap-3">
            <div
              className="grid h-12 w-28 shrink-0 place-items-center rounded-lg border border-line/60 bg-contain bg-center bg-no-repeat"
              style={logo ? { backgroundImage: `url(${logo})` } : undefined}
            >
              {!logo && (
                <span className="font-mono text-[0.55rem] uppercase text-faint">
                  текстом
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Field label="Лого клієнта картинкою — для обкладинки та фіналу (порожньо = текстом)">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setLogo(await readFileAsDataURL(f));
                  }}
                  className="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:text-gold"
                />
              </Field>
            </div>
            {logo && (
              <button
                onClick={() => setLogo(null)}
                className="shrink-0 rounded-full border border-line/70 px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-muted transition-colors hover:border-gold/50 hover:text-gold"
              >
                Прибрати
              </button>
            )}
          </div>
        </Panel>
        )}

        <SlideRow
          title="Обкладинка"
          name={names[0]}
          busy={busy !== null}
          collapsed={isCol("cover", false)}
          onToggle={() => toggle("cover", false)}
          onExport={() => handleExport(0)}
          setRef={(el) => {
            refs.current[0] = el;
          }}
          onDrag={(dx, dy) =>
            setCover((c) => ({ ...c, tx: c.tx + dx, ty: c.ty + dy }))
          }
          slide={<T.Cover d={cover} brand={brand} logo={logo} meta={meta} />}
        >
          <Field
            label={
              template === "notes"
                ? "Скрипт-підпис зверху (від руки)"
                : "Eyebrow"
            }
          >
            <TextInput
              value={cover.eyebrow}
              onChange={(v) => setCover({ ...cover, eyebrow: v })}
            />
          </Field>
          <Field
            label={
              template === "notes"
                ? "Заголовок · Enter = новий рядок, *слово* = акцент"
                : "Заголовок"
            }
          >
            <TextInput
              rows={2}
              value={cover.title}
              onChange={(v) => setCover({ ...cover, title: v })}
            />
          </Field>
          {template === "ember" && (
            <>
              <Field label="Підзаголовок">
                <TextInput
                  rows={2}
                  value={cover.sub}
                  onChange={(v) => setCover({ ...cover, sub: v })}
                />
              </Field>
              <Field label="Плашка внизу праворуч">
                <TextInput
                  value={cover.tag}
                  onChange={(v) => setCover({ ...cover, tag: v })}
                />
              </Field>
            </>
          )}
          <PhotoInput
            photo={cover.photo}
            zoom={cover.zoom}
            onPhoto={(p) => setCover((c) => ({ ...c, photo: p, tx: 0, ty: 0 }))}
            onZoom={(z) => setCover((c) => ({ ...c, zoom: z }))}
            onReset={() => setCover((c) => ({ ...c, tx: 0, ty: 0, zoom: 1 }))}
          />
        </SlideRow>

        {slides.map((s, i) => (
          <SlideRow
            key={i}
            title={`Слайд ${String(i + 1).padStart(2, "0")}`}
            name={names[i + 1]}
            busy={busy !== null}
            collapsed={isCol(`s${i}`, true)}
            onToggle={() => toggle(`s${i}`, true)}
            onDelete={() => removeSlide(i)}
            onExport={() => handleExport(i + 1)}
            setRef={(el) => {
              refs.current[i + 1] = el;
            }}
            onDrag={(dx, dy) =>
              setSlides((arr) =>
                arr.map((sl, k) =>
                  k === i ? { ...sl, tx: sl.tx + dx, ty: sl.ty + dy } : sl,
                ),
              )
            }
            slide={<T.Content d={s} n={i + 1} brand={brand} meta={meta} />}
          >
            <Field
              label={
                template === "notes"
                  ? "Скрипт-підпис (Думка перша…)"
                  : "Кікер (після номера)"
              }
            >
              <TextInput
                value={s.kicker}
                onChange={(v) => patchSlide(i, { kicker: v })}
              />
            </Field>
            <Field label="Заголовок · *слово* = акцент">
              <TextInput
                rows={2}
                value={s.title}
                onChange={(v) => patchSlide(i, { title: v })}
              />
            </Field>
            <Field
              label={
                template === "notes" ? "Текст · Enter = новий рядок" : "Текст"
              }
            >
              <TextInput
                rows={3}
                value={s.body}
                onChange={(v) => patchSlide(i, { body: v })}
              />
            </Field>
            {template === "notes" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Підпис">
                  <div className="flex rounded-lg border border-line/60 p-0.5 text-sm">
                    {([
                      ["низ", false],
                      ["верх", true],
                    ] as const).map(([lbl, v]) => (
                      <button
                        key={lbl}
                        onClick={() => patchSlide(i, { attop: v })}
                        className={`flex-1 rounded-md px-2 py-1.5 transition-colors ${
                          !!s.attop === v
                            ? "bg-gold/15 text-gold"
                            : "text-muted hover:text-gold"
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Затемнення">
                  <select
                    className={inputCls}
                    value={s.scrim ?? (s.attop ? "t" : "bottom")}
                    onChange={(e) =>
                      patchSlide(i, {
                        scrim: e.target.value as ContentData["scrim"],
                      })
                    }
                  >
                    <option value="bottom">знизу</option>
                    <option value="t">зверху</option>
                    <option value="tstrong">зверху сильне</option>
                  </select>
                </Field>
              </div>
            )}
            <PhotoInput
              photo={s.photo}
              zoom={s.zoom}
              onPhoto={(p) => patchSlide(i, { photo: p, tx: 0, ty: 0 })}
              onZoom={(z) => patchSlide(i, { zoom: z })}
              onReset={() => patchSlide(i, { tx: 0, ty: 0, zoom: 1 })}
            />
          </SlideRow>
        ))}

        <button
          onClick={addSlide}
          className="btn btn-ghost self-start !px-5 !py-2.5 text-sm"
        >
          + Додати слайд
        </button>

        <SlideRow
          title="Фінальний слайд"
          name={names[total - 1]}
          busy={busy !== null}
          collapsed={isCol("closing", true)}
          onToggle={() => toggle("closing", true)}
          onExport={() => handleExport(total - 1)}
          setRef={(el) => {
            refs.current[total - 1] = el;
          }}
          onDrag={(dx, dy) =>
            setClosing((c) => ({ ...c, tx: c.tx + dx, ty: c.ty + dy }))
          }
          slide={<T.Closing d={closing} brand={brand} logo={logo} meta={meta} />}
        >
          <Field
            label={
              template === "notes" ? "Скрипт зверху (І наостанок)" : "Eyebrow"
            }
          >
            <TextInput
              value={closing.eyebrow}
              onChange={(v) => setClosing({ ...closing, eyebrow: v })}
            />
          </Field>
          <Field label="Заголовок">
            <TextInput
              value={closing.title}
              onChange={(v) => setClosing({ ...closing, title: v })}
            />
          </Field>
          <Field label={template === "notes" ? "Текст" : "Цитата"}>
            <TextInput
              rows={3}
              value={closing.quote}
              onChange={(v) => setClosing({ ...closing, quote: v })}
            />
          </Field>
          {template === "ember" ? (
            <>
              <Field label="CTA — текст">
                <TextInput
                  value={closing.ctaText}
                  onChange={(v) => setClosing({ ...closing, ctaText: v })}
                />
              </Field>
              <Field label="CTA — лінк-фраза">
                <TextInput
                  value={closing.ctaLink}
                  onChange={(v) => setClosing({ ...closing, ctaLink: v })}
                />
              </Field>
            </>
          ) : (
            <Field label="Підпис від руки (унизу)">
              <TextInput
                value={closing.sign ?? ""}
                onChange={(v) => setClosing({ ...closing, sign: v })}
              />
            </Field>
          )}
          <PhotoInput
            photo={closing.photo}
            zoom={closing.zoom}
            onPhoto={(p) =>
              setClosing((c) => ({ ...c, photo: p, tx: 0, ty: 0 }))
            }
            onZoom={(z) => setClosing((c) => ({ ...c, zoom: z }))}
            onReset={() =>
              setClosing((c) => ({ ...c, tx: 0, ty: 0, zoom: 1.07 }))
            }
          />
        </SlideRow>
      </div>
    </section>
  );
}

/* ------------------- template CSS (from the handoff) ------------------- */

const SLIDE_CSS = `
.ig-slide{
  --igc:#17100B; --igline:#564430; --igink:#F4E6CC; --igmut:#B8A386;
  --iggold:#E2A638; --igsoft:#EFBE6A;
  --gg:linear-gradient(100deg,#F0C26E 0%,#E2A638 55%,#C5631F 100%);
  --gh:linear-gradient(96deg,#FFD888 0%,#F4A93E 40%,#E87A22 78%,#D85F18 100%);
  --ga:linear-gradient(95deg,#F7B658 0%,#EE8C2C 52%,#DC6716 100%);
  position:relative;width:1080px;height:1350px;overflow:hidden;
  background:var(--igc);color:var(--igink);
  font-family:var(--font-inter),sans-serif;-webkit-font-smoothing:antialiased;
  box-shadow:inset 0 0 0 1px rgba(216,162,74,.16);
}
.ig-slide *{margin:0;padding:0;box-sizing:border-box}
.ig-eyebrow{font-family:var(--font-jetbrains),monospace;font-weight:500;font-size:24px;
  letter-spacing:.32em;text-transform:uppercase;
  background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-gold-rule{height:2px;width:64px;background:var(--gg);border:0;border-radius:2px;}
.ig-photo{position:absolute;inset:0;}
.ig-photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 24%;}
.ig-scrim-top{position:absolute;left:0;right:0;top:0;height:300px;
  background:linear-gradient(180deg,rgba(13,9,5,.82) 0%,rgba(13,9,5,.30) 55%,transparent 100%);}
.ig-scrim-bot{position:absolute;left:0;right:0;bottom:0;height:560px;
  background:linear-gradient(0deg,rgba(11,7,4,.74) 0%,rgba(12,8,5,.22) 60%,transparent 100%);}
.ig-runhead{position:absolute;top:56px;left:60px;right:60px;z-index:4;display:flex;align-items:center;gap:14px;
  white-space:nowrap;font-family:var(--font-jetbrains),monospace;font-weight:500;font-size:21px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--igink);}
.ig-dot{width:9px;height:9px;border-radius:50%;background:var(--iggold);flex:0 0 auto;}
.ig-x{color:var(--iggold);}
.ig-right{margin-left:auto;color:var(--igsoft);}
.ig-card{position:absolute;left:56px;right:56px;bottom:60px;z-index:5;
  background:linear-gradient(160deg,rgba(33,21,10,.95),rgba(19,12,6,.96));
  border:1px solid var(--igline);border-top:2px solid transparent;
  border-radius:14px;padding:44px 48px 46px;
  box-shadow:0 24px 60px rgba(0,0,0,.5);}
.ig-card::before{content:"";position:absolute;left:48px;top:-2px;width:84px;height:3px;
  background:var(--gg);border-radius:2px;}
.ig-ix{font-family:var(--font-jetbrains),monospace;font-weight:600;font-size:24px;
  letter-spacing:.22em;text-transform:uppercase;margin-bottom:18px;
  background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-h2{font-family:var(--font-spectral),serif;font-weight:500;font-size:47px;line-height:1.08;
  letter-spacing:-.02em;color:var(--igink);}
.ig-h2 em{font-style:italic;background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-card p{margin-top:18px;font-family:var(--font-inter),sans-serif;font-size:29px;line-height:1.48;
  font-weight:400;color:var(--igink);max-width:900px;}
/* cover */
.ig-cover{background:
  radial-gradient(80% 60% at 88% 16%, rgba(216,162,74,.18) 0%, transparent 58%),
  radial-gradient(78% 64% at 6% 96%, rgba(197,101,49,.14) 0%, transparent 60%),
  var(--igc);}
.ig-cover-bg{position:absolute;inset:0;z-index:0;overflow:hidden;}
.ig-cover-bg img{width:100%;height:100%;object-fit:cover;object-position:74% 48%;filter:brightness(.74) saturate(1.03);}
.ig-cover-shade{position:absolute;inset:0;z-index:2;pointer-events:none;
  background:linear-gradient(94deg, rgba(10,7,4,.99) 4%, rgba(11,8,5,.90) 30%, rgba(12,9,6,.46) 56%, transparent 74%),
             linear-gradient(0deg, rgba(10,7,4,.95) 0%, rgba(11,8,5,.44) 32%, transparent 52%),
             radial-gradient(82% 62% at 10% 94%, rgba(9,6,3,.62) 0%, transparent 60%);}
.ig-cover-in{position:absolute;inset:0;z-index:6;padding:84px 76px;display:flex;flex-direction:column;}
.ig-top{display:flex;align-items:center;justify-content:space-between;gap:24px;}
.ig-lockup{display:flex;align-items:center;gap:20px;white-space:nowrap;color:var(--igink);}
.ig-sip{font-family:var(--font-spectral),serif;font-style:italic;font-weight:600;font-size:38px;
  background:var(--gg);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-sip-logo{height:73px;width:auto;display:block;}
.ig-div{width:2px;height:56px;background:var(--igline);}
.ig-pp{font-family:var(--font-spectral),serif;font-weight:500;font-size:44px;line-height:1;letter-spacing:-.01em;color:var(--igink);}
.ig-amp{font-style:italic;color:var(--igsoft);}
.ig-cover-eb{margin-top:auto;}
.ig-h1{margin-top:24px;font-family:var(--font-spectral),serif;font-weight:600;font-size:92px;
  line-height:1.0;letter-spacing:-.02em;
  background:var(--gh);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
  filter:drop-shadow(0 3px 22px rgba(0,0,0,.55));}
.ig-h1 em{font-style:italic;font-weight:500;background:linear-gradient(96deg,#FFE6B0,#F7BC58 75%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-cover-sub{margin-top:28px;display:flex;flex-direction:column;gap:16px;align-items:flex-start;max-width:430px;}
.ig-cover-sub p{font-family:var(--font-spectral),serif;font-weight:400;font-style:italic;font-size:36px;
  line-height:1.32;color:var(--igmut);max-width:430px;}
.ig-cover-tags{position:absolute;right:76px;bottom:92px;z-index:7;display:flex;flex-direction:column;gap:14px;align-items:flex-end;}
.ig-ctag{font-family:var(--font-jetbrains),monospace;font-weight:500;font-size:21px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;
  color:var(--igink);background:rgba(35,26,18,.84);border:1px solid var(--igline);border-left:3px solid var(--iggold);
  padding:14px 22px;border-radius:10px;}
.ig-ktag{background:none;border:none;padding:0;}
.ig-ctag b{font-weight:600;background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-ctag em{font-style:normal;font-weight:600;background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
/* closing */
.ig-close-photo{position:absolute;top:0;left:0;right:0;height:784px;overflow:hidden;}
.ig-close-photo img{height:100%;object-position:center top;transform:scale(1.07);}
.ig-close-photo::after{content:"";position:absolute;left:0;right:0;bottom:0;height:230px;background:linear-gradient(0deg,var(--igc) 0%,var(--igc) 58%,transparent 100%);z-index:2;}
.ig-close-scrim{height:1150px;background:linear-gradient(0deg,rgba(13,9,5,.97) 0%,rgba(14,10,6,.94) 32%,rgba(15,11,7,.66) 62%,rgba(16,11,7,.2) 84%,transparent 100%);}
.ig-close-glow{position:absolute;inset:0;z-index:3;pointer-events:none;
  background:radial-gradient(70% 50% at 86% 90%, rgba(216,162,74,.16) 0%, transparent 60%),
             radial-gradient(70% 50% at 8% 80%, rgba(197,101,49,.12) 0%, transparent 60%);}
.ig-close-in{position:absolute;left:60px;right:60px;bottom:74px;z-index:5;}
.ig-close-h2{font-family:var(--font-spectral),serif;font-weight:500;font-size:74px;line-height:1.0;
  letter-spacing:-.02em;color:var(--igink);margin-top:20px;}
.ig-close-h2 em{font-style:italic;background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-close-quote{margin-top:26px;font-family:var(--font-spectral),serif;font-weight:400;font-size:33px;
  line-height:1.4;letter-spacing:-.015em;color:var(--igink);max-width:980px;}
.ig-close-quote b{font-weight:500;font-style:normal;background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
.ig-close-foot2{margin-top:30px;padding-top:26px;border-top:1px solid var(--igline);}
.ig-cta{margin-top:24px;padding-top:22px;border-top:1px solid var(--igline);display:block;}
.ig-cta-text{font-family:var(--font-spectral),serif;font-style:italic;font-size:31px;color:var(--igmut);}
.ig-cta-link{margin-left:.45em;font-family:var(--font-spectral),serif;font-style:italic;font-weight:500;font-size:31px;background:var(--ga);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;}
`;

/* ------------- «Нотатки дружини · Рік у шлюбі» (full-bleed) ------------- */
/* Шрифти беремо з уже завантажених сайтом (cyrillic, same-origin → надійний
   експорт): cormorant ≈ Cormorant Garamond, spectral ≈ EB Garamond, caveat. */
const NOTES_CSS = `
.nt-slide{position:relative;width:1080px;height:1350px;overflow:hidden;background:#1a1612;
  color:#F5E9D7;font-family:var(--font-spectral),serif;-webkit-font-smoothing:antialiased;
  --cream:#F5E9D7;--gold:#E2A638;--gold-soft:#EFBE6A;--terra:#D2773A;}
.nt-slide *{margin:0;padding:0;box-sizing:border-box;}
.nt-slide .ph{position:absolute;inset:0;}
.nt-slide .ph img{width:100%;height:100%;object-fit:cover;display:block;}
.nt-slide .scrim{position:absolute;inset:0;
  background:linear-gradient(0deg, rgba(22,14,7,.9) 0%, rgba(22,14,7,.54) 26%, rgba(22,14,7,.06) 52%, transparent 70%);}
.nt-slide .scrim.t{background:linear-gradient(180deg, rgba(22,14,7,.92) 0%, rgba(22,14,7,.6) 24%, rgba(22,14,7,.12) 48%, transparent 70%);}
.nt-slide .scrim.tstrong{background:linear-gradient(180deg, rgba(22,14,7,.96) 0%, rgba(22,14,7,.88) 18%, rgba(22,14,7,.72) 30%, rgba(22,14,7,.4) 40%, transparent 53%);}
.nt-slide .edge{position:absolute;inset:34px;border:1px solid rgba(246,239,226,.4);z-index:3;pointer-events:none;}
.nt-slide .label{font-family:var(--font-caveat),cursive;font-weight:600;font-size:48px;letter-spacing:.01em;line-height:1;
  color:var(--gold-soft);display:inline-block;transform:rotate(-1.5deg);}
.nt-slide .tx{position:absolute;left:74px;right:74px;bottom:84px;z-index:4;}
.nt-slide .tx.attop{top:80px;bottom:auto;}
.nt-slide .tx .row{display:flex;align-items:center;gap:16px;margin-bottom:24px;white-space:nowrap;}
.nt-slide .tx h2{font-family:var(--font-cormorant),serif;font-weight:600;font-size:86px;line-height:1.0;letter-spacing:-.01em;
  color:#fff;text-shadow:0 2px 26px rgba(0,0,0,.55);text-wrap:balance;}
.nt-slide .tx h2 em{font-style:italic;color:var(--gold-soft);}
.nt-slide .tx p{margin-top:20px;font-family:var(--font-spectral),serif;font-size:40px;line-height:1.32;color:#F5E9D7;
  max-width:930px;text-shadow:0 1px 16px rgba(0,0,0,.6);white-space:pre-line;}
/* cover */
.nt-cover .scrim.top{background:linear-gradient(180deg, rgba(22,14,7,.56) 0%, rgba(22,14,7,.1) 16%, rgba(22,14,7,0) 38%, rgba(22,14,7,0) 52%, rgba(22,14,7,.4) 66%, rgba(22,14,7,.6) 82%, rgba(22,14,7,.92) 100%);}
.nt-cover .ct{position:absolute;left:0;right:0;top:76%;transform:translateY(-50%);z-index:4;text-align:center;padding:0 84px;}
.nt-cover .eyebrow{display:flex;align-items:center;justify-content:center;gap:18px;margin-bottom:22px;line-height:1;}
.nt-cover .eyebrow .label{font-size:50px;color:var(--gold-soft);white-space:nowrap;}
.nt-cover .eyebrow .ln{width:58px;height:1px;background:rgba(255,255,255,.82);}
.nt-cover h1{font-family:var(--font-cormorant),serif;font-weight:600;font-size:90px;line-height:1.04;color:#fff;
  text-shadow:0 3px 30px rgba(0,0,0,.6);white-space:pre-line;}
.nt-cover h1 em{font-style:italic;color:var(--gold-soft);}
/* final */
.nt-final .tx{bottom:80px;}
.nt-final .tx h2{font-size:76px;white-space:nowrap;}
.nt-final .corner-dark{position:absolute;top:0;left:0;width:64%;height:27%;z-index:2;pointer-events:none;
  background:linear-gradient(155deg, rgba(22,14,7,.68) 0%, rgba(22,14,7,.22) 50%, transparent 78%);}
.nt-final .fin-top{position:absolute;top:70px;left:74px;z-index:4;}
.nt-final .fin-top .label{color:#F8DEA8;white-space:nowrap;}
.nt-final .sign{margin-top:22px;font-family:var(--font-caveat),cursive;font-weight:600;font-size:48px;color:var(--gold-soft);}
`;
