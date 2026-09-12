"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Deck, DeckPage } from "@/lib/decks/types";

/**
 * Рендер A4-сторінок деки у «кремовому» стилі Pan&Partners (той самий, що
 * в профайлах). Кожне текстове поле — contentEditable, зміни віддаються
 * через onChange(pageIndex, patch). У друці (@media print) — чисті сторінки.
 */

export const DECK_CSS = `
  #deck-a4{ --sheet:#FCF8F1; --band:#F4ECDC; --ink:#2A2018; --muted:#5E4C36; --faint:#9C8B73;
    --line:rgba(140,116,82,.36); --acc:#C4621F; --amber:#D2701C; --gold:#C98A2B; --np:#5E2AC4;
    display:flex; flex-direction:column; align-items:center; gap:22px;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
    font-family:var(--font-inter),system-ui,sans-serif; color:var(--ink); }
  #deck-a4 *{ box-sizing:border-box; margin:0; padding:0; }
  #deck-a4 .sheet{ position:relative; width:297mm; height:210mm; overflow:hidden; background:var(--sheet);
    padding:11mm 16mm 9mm; display:flex; flex-direction:column; box-shadow:0 24px 70px rgba(60,40,15,.22); }
  #deck-a4 .serif{ font-family:var(--font-spectral),Georgia,serif; }
  #deck-a4 .mono{ font-family:var(--font-jetbrains),ui-monospace,monospace; }
  #deck-a4 [contenteditable]{ outline:none; border-radius:2px; transition:box-shadow .15s; min-width:2em; }
  #deck-a4 [contenteditable]:hover{ box-shadow:0 0 0 1px rgba(201,138,43,.45); }
  #deck-a4 [contenteditable]:focus{ box-shadow:0 0 0 2px rgba(201,138,43,.7); background:rgba(244,236,220,.6); }
  #deck-a4 [contenteditable]:empty::before{ content:attr(data-ph); color:var(--faint); font-style:italic; }

  /* runhead + foot */
  #deck-a4 .rh{ display:flex; align-items:center; gap:5.5mm; }
  #deck-a4 .rh .wm{ font-family:var(--font-playfair),Georgia,serif; font-size:13.5pt; font-weight:500; white-space:nowrap; }
  #deck-a4 .rh .wm em{ color:var(--amber); font-style:normal; }
  #deck-a4 .rh .fill{ flex:1; height:1px; background:var(--line); }
  #deck-a4 .rh .tag{ font-family:var(--font-jetbrains),monospace; font-size:7.1pt; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #deck-a4 .foot{ display:flex; align-items:flex-end; justify-content:space-between; border-top:1px solid var(--line); padding-top:3mm; margin-top:auto; }
  #deck-a4 .foot .pg{ font-family:var(--font-jetbrains),monospace; font-size:7.1pt; letter-spacing:.22em; color:var(--faint); }
  #deck-a4 .foot .tl{ font-family:var(--font-spectral),serif; font-style:italic; font-size:9.5pt; color:var(--muted); }
  #deck-a4 .foot .tl b{ color:var(--acc); font-weight:500; }

  /* типографіка */
  #deck-a4 h1{ font-family:var(--font-spectral),Georgia,serif; font-size:calc(30pt * var(--kh,1)); font-weight:500; line-height:1.06; letter-spacing:-.005em; margin-top:7mm; }
  #deck-a4 h1 em, #deck-a4 h2 em{ color:var(--amber); font-style:italic; }
  #deck-a4 .lead{ font-family:var(--font-spectral),serif; font-size:calc(13.5pt * var(--k,1)); line-height:1.48; color:var(--ink); margin-top:4mm; max-width:220mm; }
  #deck-a4 .lead:empty{ display:none; }
  #deck-a4 h1:has(> [contenteditable]:empty + em > [contenteditable]:empty){ display:none; }
  #deck-a4 .para{ font-size:calc(11.5pt * var(--k,1)); line-height:1.55; color:var(--ink); margin-top:4mm; max-width:220mm; }
  #deck-a4 .callout{ position:relative; margin-top:6mm; max-width:230mm; background:var(--band); border-radius:4px; padding:4.5mm 7mm 4.5mm 9mm;
    font-family:var(--font-spectral),serif; font-size:calc(13pt * var(--k,1)); line-height:1.45; }
  #deck-a4 .callout::before{ content:""; position:absolute; left:0; top:0; bottom:0; width:3pt; background:var(--amber); border-radius:4px 0 0 4px; }
  #deck-a4 .callout:empty{ display:none; }
  #deck-a4 .lab{ font-family:var(--font-jetbrains),monospace; font-size:7.5pt; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); display:flex; align-items:center; gap:4mm; margin-top:8mm; }
  #deck-a4 .lab::after{ content:""; flex:1; height:1px; background:var(--line); }

  /* капс-заголовки (перемикач) */
  #deck-a4.caps h1{ text-transform:uppercase; letter-spacing:.035em; font-size:calc(24pt * var(--kh,1)); line-height:1.12; }
  #deck-a4.caps .t-cover h1{ font-size:38pt; letter-spacing:.03em; line-height:1.06; }
  #deck-a4.caps .t-cover h1 em{ font-size:22pt; letter-spacing:.04em; }
  #deck-a4.caps .t-section h1{ font-size:30pt; }
  #deck-a4.caps .t-section .withimg h1{ font-size:26pt; }
  #deck-a4.caps .t-about h1{ font-size:28pt; }
  #deck-a4.caps .t-closing h1{ font-size:32pt; }
  #deck-a4.caps .col h3, #deck-a4.caps .step .h{ text-transform:uppercase; letter-spacing:.06em; font-size:calc(10.5pt * var(--k,1)); font-style:normal; }
  /* кольорові маркери психотипів */
  #deck-a4 .chip{ display:inline-block; width:.62em; height:.62em; border-radius:99px; margin-right:.35em; vertical-align:baseline; transform:translateY(-.02em); }
  #deck-a4 .chip.red{ background:#D9342B; } #deck-a4 .chip.yellow{ background:#F2C230; } #deck-a4 .chip.blue{ background:#2F62C7; }
  #deck-a4 .t-gallery .lead{ font-size:calc(17pt * var(--k,1)); font-style:italic; color:var(--acc); }

  /* bullets */
  #deck-a4 ul.bul{ list-style:none; margin-top:5mm; display:flex; flex-direction:column; gap:calc(2.6mm * var(--k,1)); max-width:230mm; }
  #deck-a4 ul.bul li{ position:relative; padding-left:6mm; font-size:calc(11.8pt * var(--k,1)); line-height:1.5; }
  #deck-a4 ul.bul li::before{ content:""; position:absolute; left:0; top:.55em; width:3.6pt; height:3.6pt; border-radius:99px; background:var(--amber); }
  #deck-a4 ul.bul.sm li{ font-size:calc(10.2pt * var(--k,1)); line-height:1.45; }
  #deck-a4 ul.bul.sm{ gap:2mm; margin-top:3mm; }

  /* ілюстрація праворуч */
  #deck-a4 .withimg{ display:grid; grid-template-columns:1fr calc(84mm * var(--k,1)); column-gap:12mm; align-items:start; flex:1; min-height:0; }
  #deck-a4 .withimg .fig{ width:calc(84mm * var(--k,1)); height:100%; max-height:150mm; display:flex; align-items:center; justify-content:center; }
  #deck-a4 .withimg .fig img{ max-width:100%; max-height:150mm; box-shadow:0 10px 30px rgba(60,40,15,.14); object-fit:contain; display:block; border-radius:3px; }
  #deck-a4 .body{ min-width:0; }
  #deck-a4 .sheet[data-sparse] .withimg{ align-items:center; }
  #deck-a4 .sheet[data-sparse] .withimg .fig{ max-height:none; height:auto; }
  #deck-a4 .sheet[data-sparse] .withimg .fig img{ max-height:150mm; }
  #deck-a4 .sheet[data-sparse] .body > h1:first-child{ margin-top:0; }
  /* gallery */
  #deck-a4 .gal{ display:grid; grid-template-columns:repeat(3,1fr); gap:8mm; margin-top:7mm; }
  #deck-a4 .gal figure{ text-align:center; }
  #deck-a4 .gal img{ width:100%; height:96mm; object-fit:cover; display:block; border-radius:3px; border:.75pt solid var(--line); }
  #deck-a4 .gal figcaption{ font-family:var(--font-spectral),serif; font-style:italic; font-size:15pt; color:var(--acc); margin-top:3mm; }
  #deck-a4 .t-section .withimg .fig img{ max-height:120mm; }
  #deck-a4 .t-closing .qr{ width:34mm; height:34mm; object-fit:contain; display:block; margin-top:6mm; border:0; padding:0; }
  /* twocol */
  #deck-a4 .cols{ display:grid; grid-template-columns:1fr 1fr; column-gap:10mm; row-gap:6mm; margin-top:6mm; }
  #deck-a4 .cols[data-n="3"]{ grid-template-columns:repeat(3,1fr); }
  #deck-a4 .cols[data-n="4"]{ grid-template-columns:repeat(4,1fr); column-gap:7mm; }
  #deck-a4 .col h3{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:calc(13.5pt * var(--k,1)); color:var(--acc); line-height:1.25; padding-bottom:2mm; border-bottom:1px solid var(--line); }

  /* steps */
  #deck-a4 .steps{ margin-top:5mm; display:flex; flex-direction:column; max-width:240mm; }
  #deck-a4 .step{ display:grid; grid-template-columns:60mm 1fr; gap:6mm; padding:calc(3.2mm * var(--k,1)) 0; border-top:1px solid var(--line); align-items:baseline; }
  #deck-a4 .step:first-child{ border-top:0; }
  #deck-a4 .step .h{ font-family:var(--font-spectral),serif; font-style:italic; font-size:calc(13.5pt * var(--k,1)); color:var(--acc); line-height:1.3; }
  #deck-a4 .step .t{ font-size:calc(11.5pt * var(--k,1)); line-height:1.5; }

  /* table */
  #deck-a4 table{ width:100%; border-collapse:collapse; margin-top:6mm; font-size:calc(10pt * var(--k,1)); line-height:1.42; }
  #deck-a4 th{ text-align:left; font-family:var(--font-jetbrains),monospace; font-size:7pt; letter-spacing:.18em; text-transform:uppercase; color:var(--faint); padding:0 3mm 2.4mm 0; border-bottom:1px solid var(--ink); font-weight:500; }
  #deck-a4 td{ vertical-align:top; padding:calc(2.8mm * var(--k,1)) 3mm calc(2.8mm * var(--k,1)) 0; border-bottom:1px solid var(--line); }
  #deck-a4 td:first-child{ color:var(--acc); font-family:var(--font-spectral),serif; font-style:italic; font-size:calc(10.5pt * var(--k,1)); white-space:nowrap; }
  #deck-a4 td[contenteditable]:empty{ min-height:6mm; display:block; }

  /* cover */
  #deck-a4 .t-cover .rh .tag{ visibility:hidden; }
  #deck-a4 .t-cover .cv{ display:grid; grid-template-columns:1fr 118mm; gap:14mm; flex:1; min-height:0; margin-top:6mm; }
  #deck-a4 .t-cover .cv-l{ display:flex; flex-direction:column; padding-top:16mm; }
  #deck-a4 .t-cover .eyebrow{ font-family:var(--font-jetbrains),monospace; font-size:8.5pt; letter-spacing:.28em; text-transform:uppercase; color:var(--acc); }
  #deck-a4 .t-cover h1{ font-size:48pt; line-height:.98; margin-top:7mm; letter-spacing:-.012em; }
  #deck-a4 .t-cover h1 em{ display:block; font-size:30pt; line-height:1.1; margin-top:5mm; letter-spacing:0; }
  #deck-a4 .t-cover .sub{ font-family:var(--font-spectral),serif; font-size:16pt; line-height:1.4; color:var(--muted); margin-top:6mm; max-width:150mm; }
  #deck-a4 .t-cover .sub:empty{ display:none; }
  #deck-a4 .t-cover .who{ margin-top:auto; padding-top:8mm; font-size:11.5pt; line-height:1.6; color:var(--ink); border-top:1px solid var(--line); max-width:150mm; }
  #deck-a4 .t-cover .who .w{ font-family:var(--font-jetbrains),monospace; font-size:7.8pt; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); margin-top:1.5mm; }
  #deck-a4 .t-cover .cv-r{ position:relative; align-self:stretch; display:flex; flex-direction:column; align-items:flex-end; }
  #deck-a4 .t-cover .cv-r .np-big{ width:96mm; height:auto; display:block; margin-top:6mm; }
  #deck-a4 .t-cover .cv-r .ill{ flex:1; min-height:0; width:100%; object-fit:contain; object-position:right bottom; display:block; margin-top:4mm; max-height:96mm; filter:drop-shadow(0 14px 26px rgba(80,40,160,.18)); }
  #deck-a4 .t-cover .foot{ margin-top:10mm; }
  #deck-a4 .t-cover .band{ position:absolute; left:0; right:0; bottom:0; height:5mm; background:linear-gradient(90deg,var(--amber),var(--gold)); }

  /* section */
  #deck-a4 .t-section{ background:var(--band); }
  #deck-a4 .t-section .secwrap{ display:grid; grid-template-columns:auto 1fr; column-gap:14mm; align-items:end; margin:auto 0; padding-bottom:14mm; }
  #deck-a4 .t-section .num{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:190pt; line-height:.78; color:var(--amber); }
  #deck-a4 .t-section .num:empty{ display:none; }
  #deck-a4 .t-section .sec-t{ padding-bottom:6mm; }
  #deck-a4 .t-section .kicker{ font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.26em; text-transform:uppercase; color:var(--faint); margin-bottom:6mm; display:flex; align-items:center; gap:4mm; }
  #deck-a4 .t-section .kicker::after{ content:""; width:40mm; height:1px; background:var(--gold); }
  #deck-a4 .t-section h1{ font-size:38pt; margin-top:0; max-width:190mm; line-height:1.04; }
  #deck-a4 .t-section .sub{ font-family:var(--font-spectral),serif; font-style:italic; font-size:15pt; color:var(--muted); margin-top:5mm; max-width:170mm; }
  #deck-a4 .t-section .sub:empty{ display:none; }
  #deck-a4 .t-section .withimg{ align-items:center; }
  #deck-a4 .t-section .withimg .fig img{ max-height:130mm; }
  #deck-a4 .t-section .withimg .secwrap{ padding-bottom:0; margin:0; min-width:0; }
  #deck-a4 .t-section .secwrap .sec-t{ min-width:0; }
  #deck-a4 .t-section .withimg h1{ max-width:100%; font-size:32pt; }
  #deck-a4 .t-section .withimg .num{ font-size:150pt; }

  /* about */
  #deck-a4 .t-about .hero{ display:grid; grid-template-columns:1fr 74mm; gap:12mm; margin-top:3mm; align-items:start; }
  #deck-a4 .t-about h1{ margin-top:3mm; font-size:34pt; }
  #deck-a4 .t-about .role{ font-size:10.5pt; line-height:1.5; color:var(--muted); margin-top:3mm; max-width:170mm; }
  #deck-a4 .t-about .role:empty{ display:none; }
  #deck-a4 .t-about .quote{ position:relative; margin-top:5mm; background:var(--band); border-radius:4px; padding:3.5mm 6mm 3.5mm 8mm; font-family:var(--font-spectral),serif; font-size:11.2pt; line-height:1.45; }
  #deck-a4 .t-about .quote::before{ content:""; position:absolute; left:0; top:0; bottom:0; width:3pt; background:var(--amber); border-radius:4px 0 0 4px; }
  #deck-a4 .t-about .quote:empty{ display:none; }
  #deck-a4 .t-about .portrait{ position:relative; width:74mm; }
  #deck-a4 .t-about .portrait img{ display:block; width:100%; height:92mm; object-fit:cover; object-position:center 15%; position:relative; z-index:1; filter:saturate(.9); }
  #deck-a4 .t-about .portrait .frame{ position:absolute; top:3mm; left:3mm; right:-2.6mm; bottom:-2.3mm; border:.75pt solid var(--gold); }
  #deck-a4 .t-about .stats{ display:grid; grid-template-columns:repeat(4,1fr); margin-top:6mm; }
  #deck-a4 .t-about .stat{ padding:0 5mm; border-left:1px solid var(--line); }
  #deck-a4 .t-about .stat:first-child{ border-left:0; padding-left:0; }
  #deck-a4 .t-about .stat .n{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:22pt; line-height:1; color:var(--acc); }
  #deck-a4 .t-about .stat .t{ font-size:8.4pt; line-height:1.45; color:var(--muted); margin-top:2mm; }
  #deck-a4 .t-about .bottom{ display:grid; grid-template-columns:1fr 1fr; column-gap:12mm; margin-top:5mm; align-items:start; }
  #deck-a4 .t-about .bottom ul.bul{ margin-top:3mm; gap:2mm; }
  #deck-a4 .t-about .bottom ul.bul li{ font-size:9.4pt; line-height:1.45; }
  #deck-a4 .t-about .note{ font-size:9.4pt; line-height:1.5; color:var(--ink); margin-top:3mm; }
  #deck-a4 .t-about .note:empty{ display:none; }
  #deck-a4 .t-about .logos{ display:block; width:100%; max-width:130mm; max-height:12mm; object-fit:contain; object-position:left; margin-top:6mm; }
  #deck-a4 .t-about .lab{ margin-top:4mm; }

  /* closing */
  #deck-a4 .t-closing .wrap{ display:grid; grid-template-columns:1fr 62mm; gap:14mm; margin-top:auto; margin-bottom:auto; align-items:center; }
  #deck-a4 .t-closing h1{ font-size:40pt; margin-top:0; }
  #deck-a4 .t-closing .sub{ font-family:var(--font-spectral),serif; font-size:13pt; color:var(--muted); margin-top:6mm; }
  #deck-a4 .t-closing ul.ct{ list-style:none; margin-top:8mm; display:flex; flex-direction:column; gap:1.5mm; font-family:var(--font-jetbrains),monospace; font-size:10pt; color:var(--acc); }
  #deck-a4 .t-closing .wrap > img{ width:62mm; height:78mm; object-fit:cover; object-position:center 20%; display:block; border:.75pt solid var(--gold); padding:3mm; background:#fff; }

  @media print{
    @page{ size:297mm 210mm; margin:0; }
    html, body{ background:#fff !important; margin:0 !important; padding:0 !important; height:auto !important; }
    #deck-a4{ gap:0; padding:0; display:block; }
    #deck-a4 > div{ break-after:page; page-break-after:always; margin:0 auto; width:297mm; }
    #deck-a4 > div:last-child{ break-after:auto; page-break-after:auto; }
    #deck-a4 .sheet{ box-shadow:none; height:209.4mm; break-inside:avoid; page-break-inside:avoid; }
    #deck-a4 .sheet *{ break-inside:avoid; }
    #deck-a4 [contenteditable]:hover, #deck-a4 [contenteditable]:focus{ box-shadow:none; background:transparent; }
    #deck-a4 [contenteditable]:empty::before{ content:""; }
  }
`;

type Patch = (patch: Record<string, unknown>) => void;

/* ───────── editable primitives ───────── */

function E({
  tag: Tag = "span",
  value,
  onChange,
  className,
  ph,
  editable,
}: {
  tag?: keyof JSX.IntrinsicElements;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  ph?: string;
  editable: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const T = Tag as any;
  return (
    <T
      ref={ref}
      className={className}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      data-ph={ph || "…"}
      onBlur={() => {
        const v = (ref.current?.innerText ?? "").replace(/ /g, " ").trim();
        if (v !== value) onChange(v);
      }}
    >
      {value}
    </T>
  );
}

function EList({
  items,
  onChange,
  className,
  editable,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  className?: string;
  editable: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  return (
    <ul
      ref={ref}
      className={className}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      onBlur={() => {
        const lis = Array.from(ref.current?.querySelectorAll("li") ?? []);
        const v = lis.map((li) => li.innerText.replace(/ /g, " ").trim()).filter(Boolean);
        if (JSON.stringify(v) !== JSON.stringify(items)) onChange(v.length ? v : [""]);
      }}
    >
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

function WithImg({ image, children }: { image?: string; children: React.ReactNode }) {
  if (!image) return <>{children}</>;
  return (
    <div className="withimg">
      <div className="body">{children}</div>
      <div className="fig"><img src={image} alt="" /></div>
    </div>
  );
}

function chipFor(text: string): string | null {
  const t = text.trim().toLowerCase();
  if (t.startsWith("червон")) return "red";
  if (t.startsWith("жовт")) return "yellow";
  if (t.startsWith("син")) return "blue";
  return null;
}

function Title({ p, set, editable, className }: { p: { title: string; titleEm: string }; set: Patch; editable: boolean; className?: string }) {
  return (
    <h1 className={className}>
      <E value={p.title} onChange={(v) => set({ title: v })} editable={editable} ph="Заголовок" />{" "}
      <em>
        <E value={p.titleEm} onChange={(v) => set({ titleEm: v })} editable={editable} ph="акцент" />
      </em>
    </h1>
  );
}

/* ───────── pages ───────── */

function textLen(p: DeckPage): number {
  const walk = (v: unknown): number =>
    typeof v === "string" ? v.length : Array.isArray(v) ? v.reduce((a: number, x) => a + walk(x), 0) : v && typeof v === "object" ? Object.entries(v).reduce((a, [k, x]) => (k === "id" || k === "type" || k === "image" || k === "logos" || k === "qr" || k === "src" ? a : a + walk(x)), 0) : 0;
  return walk(p);
}
function density(p: DeckPage): { k: number; kh: number } {
  if (p.type === "cover" || p.type === "section" || p.type === "closing" || p.type === "about") return { k: 1, kh: 1 };
  let n = textLen(p);
  if ("image" in p && p.image) n *= 1.6;
  if (p.type === "table") n *= 1.4;
  const k = n < 220 ? 1.5 : n < 420 ? 1.32 : n < 700 ? 1.16 : n < 1100 ? 1.05 : 1;
  const cap = p.type === "table" ? 1.25 : 1.5;
  return { k: Math.min(k, cap), kh: Math.min(1.2, k) };
}

function Sheet({ deck, i, cls, page, children, editable, onRunhead }: { deck: Deck; i: number; cls?: string; page: DeckPage; children: React.ReactNode; editable: boolean; onRunhead: (v: string) => void }) {
  const d = density(page);
  const ref = useRef<HTMLElement>(null);
  const [k, setK] = useState(d.k);
  // При зміні вмісту — почати з розрахункового масштабу, потім зменшувати, поки не вміститься.
  useLayoutEffect(() => { setK(d.k); }, [d.k, page]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollHeight > el.clientHeight + 2 && k > 0.8) {
      const id = requestAnimationFrame(() => setK((v) => Math.round((v - 0.05) * 100) / 100));
      return () => cancelAnimationFrame(id);
    }
  }, [k, page]);
  return (
    <section ref={ref} className={`sheet ${cls ?? ""}`} data-page={i + 1} data-sparse={k >= 1.32 ? "1" : undefined} style={{ ["--k" as any]: k, ["--kh" as any]: Math.min(1.2, k) }}>
      <div className="rh">
        <span className="wm">Pan<em>&amp;</em>Partners</span>
        <span className="fill" />
        <E value={deck.runhead} onChange={onRunhead} editable={editable} className="tag" ph="колонтитул" />
      </div>
      {children}
      <div className="foot">
        <span className="tl">
          <b>Тетяна Пан</b> · Pan&amp;Partners · pan-partners.agency
        </span>
        <span className="pg">
          {String(i + 1).padStart(2, "0")} / {String(deck.pages.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}

export function DeckPages({
  deck,
  editable = false,
  onPatch,
  onRunhead,
  renderControls,
  only,
}: {
  deck: Deck;
  only?: number;
  editable?: boolean;
  onPatch?: (index: number, patch: Record<string, unknown>) => void;
  onRunhead?: (v: string) => void;
  renderControls?: (index: number) => React.ReactNode;
}) {
  const rh = onRunhead ?? (() => {});
  return (
    <div id="deck-a4" className={deck.caps ? "caps" : undefined}>
      <style dangerouslySetInnerHTML={{ __html: DECK_CSS }} />
      {deck.pages.map((p, i) => {
        if (only && only !== i + 1) return null;
        const set: Patch = (patch) => onPatch?.(i, patch);
        return (
          <div key={p.id} style={{ position: "relative" }}>
            {renderControls?.(i)}
            <Sheet deck={deck} i={i} cls={"t-" + p.type} page={p} editable={editable} onRunhead={rh}>
              <PageBody p={p} set={set} editable={editable} />
            </Sheet>
          </div>
        );
      })}
    </div>
  );
}

function PageBody({ p, set, editable }: { p: DeckPage; set: Patch; editable: boolean }) {
  const e = editable;
  switch (p.type) {
    case "cover":
      return (
        <>
          <div className="cv">
            <div className="cv-l">
              <E tag="p" className="eyebrow" value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} editable={e} ph="надзаголовок" />
              <Title p={p} set={set} editable={e} />
              <E tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="" />
              <div className="who">
                <E tag="p" value={p.who} onChange={(v) => set({ who: v })} editable={e} ph="хто проводить" />
                <E tag="p" className="w" value={p.when} onChange={(v) => set({ when: v })} editable={e} ph="де, коли" />
              </div>
            </div>
            <div className="cv-r">
              <img className="np-big" src="/deck/novapay/novapay-logo.png" alt="NovaPay" />
              <img className="ill" src="/deck/novapay/money.png" alt="" />
            </div>
          </div>
          <div className="band" />
        </>
      );
    case "about":
      return (
        <>
          <div className="hero">
            <div>
              <div className="lab" style={{ marginTop: "4mm" }}>Тренерка</div>
              <Title p={p} set={set} editable={e} />
              <E tag="p" className="role" value={p.role ?? ""} onChange={(v) => set({ role: v })} editable={e} ph="" />
              <E tag="div" className="quote" value={p.quote ?? ""} onChange={(v) => set({ quote: v })} editable={e} ph="" />
              {p.stats && p.stats.length ? (
                <div className="stats">
                  {p.stats.map((st, k) => (
                    <div className="stat" key={k}>
                      <E tag="div" className="n" value={st.n} onChange={(v) => set({ stats: p.stats!.map((x, j) => (j === k ? { ...x, n: v } : x)) })} editable={e} ph="" />
                      <E tag="div" className="t" value={st.t} onChange={(v) => set({ stats: p.stats!.map((x, j) => (j === k ? { ...x, t: v } : x)) })} editable={e} ph="" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="portrait">
              <img src={p.image} alt="" />
              <div className="frame" />
            </div>
          </div>
          <div className="bottom">
            <div>
              <div className="lab">Моя спеціалізація</div>
              <EList className="bul" items={p.facts} onChange={(v) => set({ facts: v })} editable={e} />
            </div>
            <div>
              <div className="lab">Географія проєктів</div>
              <E tag="p" className="note" value={p.note} onChange={(v) => set({ note: v })} editable={e} ph="" />
              {p.logos ? <img className="logos" src={p.logos} alt="" /> : null}
            </div>
          </div>
        </>
      );
    case "section":
      return (
        <WithImg image={p.image}>
          <div className="secwrap">
            <E tag="div" className="num serif" value={p.num} onChange={(v) => set({ num: v })} editable={e} ph="" />
            <div className="sec-t">
              <div className="kicker">Розділ</div>
              <h1>
                <E value={p.title} onChange={(v) => set({ title: v })} editable={e} ph="Назва розділу" />
              </h1>
              <E tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="" />
            </div>
          </div>
        </WithImg>
      );
    case "text":
      return (
        <WithImg image={p.image}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          {p.paras.map((t, k) => (
            <E
              key={k}
              tag="p"
              className="para"
              value={t}
              onChange={(v) => set({ paras: p.paras.map((x, j) => (j === k ? v : x)) })}
              editable={e}
              ph="абзац"
            />
          ))}
          <E tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
        </WithImg>
      );
    case "bullets":
      return (
        <WithImg image={p.image}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <EList className="bul" items={p.items} onChange={(v) => set({ items: v })} editable={e} />
          <E tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
        </WithImg>
      );
    case "twocol":
      return (
        <WithImg image={p.image}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <div className="cols" data-n={String(Math.min(4, Math.max(2, p.cols.length)))}>
            {p.cols.map((c, k) => (
              <div className="col" key={k}>
                <h3>
                  {chipFor(c.head) ? <span className={"chip " + chipFor(c.head)} /> : null}
                  <E value={c.head} onChange={(v) => set({ cols: p.cols.map((x, j) => (j === k ? { ...x, head: v } : x)) })} editable={e} ph="підзаголовок" />
                </h3>
                <EList className="bul sm" items={c.items} onChange={(v) => set({ cols: p.cols.map((x, j) => (j === k ? { ...x, items: v } : x)) })} editable={e} />
              </div>
            ))}
          </div>
        </WithImg>
      );
    case "steps":
      return (
        <WithImg image={p.image}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <div className="steps">
            {p.steps.map((st, k) => (
              <div className="step" key={k}>
                <E tag="div" className="h" value={st.head} onChange={(v) => set({ steps: p.steps.map((x, j) => (j === k ? { ...x, head: v } : x)) })} editable={e} ph="крок" />
                <E tag="div" className="t" value={st.text} onChange={(v) => set({ steps: p.steps.map((x, j) => (j === k ? { ...x, text: v } : x)) })} editable={e} ph="опис" />
              </div>
            ))}
          </div>
        </WithImg>
      );
    case "table":
      return (
        <>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <table>
            <thead>
              <tr>
                {p.head.map((h, k) => (
                  <th key={k}>
                    <E value={h} onChange={(v) => set({ head: p.head.map((x, j) => (j === k ? v : x)) })} editable={e} ph="—" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.rows.map((r, ri) => (
                <tr key={ri}>
                  {p.head.map((_, ci) => (
                    ci === 0 && chipFor(r[0] ?? "") ? (
                      <td key={ci}>
                        <span className={"chip " + chipFor(r[0] ?? "")} />
                        <E value={r[0] ?? ""} onChange={(v) => set({ rows: p.rows.map((row, j) => (j === ri ? p.head.map((__, c) => (c === 0 ? v : row[c] ?? "")) : row)) })} editable={e} ph="" />
                      </td>
                    ) : (
                    <E
                      key={ci}
                      tag="td"
                      value={r[ci] ?? ""}
                      onChange={(v) => set({ rows: p.rows.map((row, j) => (j === ri ? p.head.map((__, c) => (c === ci ? v : row[c] ?? "")) : row)) })}
                      editable={e}
                      ph=""
                    />
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <E tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
        </>
      );
    case "gallery":
      return (
        <>
          <Title p={p} set={set} editable={e} />
          <p className="lead" style={{ display: p.lead ? undefined : "none" }}>
            {chipFor(p.lead) ? <span className={"chip " + chipFor(p.lead)} /> : null}
            <E value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          </p>
          <div className="gal">
            {p.images.map((im, k) => (
              <figure key={k}>
                <img src={im.src} alt="" />
                <E tag="figcaption" value={im.cap} onChange={(v) => set({ images: p.images.map((x, j) => (j === k ? { ...x, cap: v } : x)) })} editable={e} ph="" />
              </figure>
            ))}
          </div>
        </>
      );
    case "closing":
      return (
        <div className="wrap">
          <div>
            <Title p={p} set={set} editable={e} />
            <E tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="підпис" />
            <EList className="ct" items={p.contacts} onChange={(v) => set({ contacts: v })} editable={e} />
            {p.qr ? <img className="qr" src={p.qr} alt="" /> : null}
          </div>
          <img src={p.image} alt="" />
        </div>
      );
  }
}
