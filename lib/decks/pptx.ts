/**
 * Експорт деки у PPTX (клієнт): кожна сторінка — нативний слайд A4 landscape
 * з редагованим текстом, фігурами, таблицями й картинками у фірмових кольорах.
 * Схеми (тип diagram) PowerPoint нативно не відтворить — їх знімаємо з екрана як PNG.
 */
import type { Deck, DeckPage } from "./types";
import { deckT, splitBold } from "./i18n";

type Pptx = import("pptxgenjs").default;
type Slide = import("pptxgenjs").default.Slide;
type TextProps = import("pptxgenjs").default.TextPropsOptions;

// A4 landscape у дюймах
const W = 11.69, H = 8.27;
const M = 0.63; // поле ≈16mm
const C = { sheet: "FCF8F1", band: "F4ECDC", ink: "2A2018", muted: "5E4C36", faint: "9C8B73", acc: "C4621F", amber: "D2701C", gold: "C98A2B", line: "D9CDB9", white: "FFFFFF" };
const SERIF = "Georgia";
const SANS = "Arial"; // за шириною ближчий до Inter на сайті, ніж Calibri
const MONO = "Consolas";

const mm = (v: number) => v / 25.4;

/** Знімок DOM-елемента у data-URL (для схем). Викликач передає функцію, щоб lib не залежала від DOM. */
export type Snap = (pageIndex: number, selector: string) => Promise<{ data: string; w: number; h: number } | null>;

async function imgInfo(src: string, knockWhite = false): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const r = await fetch(src); if (!r.ok) return null;
    const blob = await r.blob();
    const data: string = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = rej; fr.readAsDataURL(blob); });
    const dim = await new Promise<{ w: number; h: number }>((res) => { const im = new Image(); im.onload = () => res({ w: im.naturalWidth, h: im.naturalHeight }); im.onerror = () => res({ w: 4, h: 3 }); im.src = data; });
    // SVG без розмірів → малюємо на canvas
    if (blob.type === "image/svg+xml") {
      const im = new Image(); await new Promise((res) => { im.onload = res; im.onerror = res; im.src = data; });
      const ar = im.naturalWidth && im.naturalHeight ? im.naturalWidth / im.naturalHeight : 1;
      const cw = ar >= 1 ? 1600 : Math.round(1600 * ar), chh = ar >= 1 ? Math.round(1600 / ar) : 1600;
      const cv = document.createElement("canvas"); cv.width = cw; cv.height = chh; cv.getContext("2d")!.drawImage(im, 0, 0, cw, chh);
      return { data: cv.toDataURL("image/png"), w: cw, h: chh };
    }
    if (knockWhite) { // білий фон → прозорий (на сайті це mix-blend-mode: multiply)
      const im = new Image(); await new Promise((res) => { im.onload = res; im.onerror = res; im.src = data; });
      const cv = document.createElement("canvas"); cv.width = dim.w; cv.height = dim.h;
      const g = cv.getContext("2d")!; g.drawImage(im, 0, 0);
      const id = g.getImageData(0, 0, cv.width, cv.height), px = id.data;
      for (let j = 0; j < px.length; j += 4) { const mn = Math.min(px[j], px[j + 1], px[j + 2]); if (mn > 238) px[j + 3] = Math.round(((255 - mn) / 17) * px[j + 3]); }
      g.putImageData(id, 0, 0);
      return { data: cv.toDataURL("image/png"), ...dim };
    }
    return { data, ...dim };
  } catch { return null; }
}

const nb = (v: string) => v.replace(/\u00a0/g, " ").replace(/\u2011/g, "-").replace(/ +—/g, "\u00a0—").replace(/(^|\s)(\d{1,3}) (?=\p{L})/gu, "$1$2\u00a0");
function txt(s: string) { return nb((s ?? "").replace(/\*\*/g, "")); }
/** Текст із **жирним** → run-и pptxgenjs; opts першого/останнього run-а задає абзац (маркер, перенос). */
function runs(v: string, opts: TextProps = {}, first: TextProps = {}, last: TextProps = {}): { text: string; options: TextProps }[] {
  const parts = splitBold(nb(v ?? ""));
  return parts.map((x, k) => ({ text: x.t, options: { ...opts, ...(x.b ? { bold: true } : {}), ...(k === 0 ? first : {}), ...(k === parts.length - 1 ? last : {}) } }));
}

export async function exportDeckPptx(deck: Deck, opts: { snap?: Snap; scale?: (pageIndex: number) => number | undefined; web?: (pageIndex: number) => { w?: number[]; fs?: number } | undefined; onProgress?: (i: number, n: number) => void } = {}) {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "A4L", width: W, height: H });
  pptx.layout = "A4L";
  pptx.title = deck.name; pptx.author = "Pan&Partners";
  const k = Math.min(1.35, Math.max(0.8, deck.fs ?? 1)); // множник кегля деки
  const total = deck.pages.length;

  for (let i = 0; i < total; i++) {
    opts.onProgress?.(i + 1, total);
    const p = deck.pages[i];
    const s = pptx.addSlide();
    s.background = { color: C.sheet };
    // масштаб кегля: беремо підібраний сайтом (--k на аркуші: розріджені сторінки — більший текст), інакше рахуємо
    // титул, розділ, «про тренера» і фінал на сайті мають фіксований кегль (density k=1), тож підібраний --k там не беремо
    const fixed = p.type === "cover" || p.type === "section" || p.type === "closing" || p.type === "about";
    const dom = fixed ? undefined : opts.scale?.(i);
    const kp = dom && Number.isFinite(dom) ? Math.min(1.8, Math.max(0.6, dom)) : k * Math.min(1.4, Math.max(0.7, p.fs ?? 1));
    const kh = kp >= 1.1 ? 1.1 : kp < 0.95 ? 0.9 : 1; // заголовки ростуть слабше, як на сайті
    const ctx: Ctx = { pptx, s, deck, i, total, k: kp, kh, snap: opts.snap, big: !!deck.big, web: opts.web?.(i) };
    chrome(ctx, p);
    await page(ctx, p);
  }
  const safe = deck.name.replace(/[\\/:*?"<>|]+/g, " ").trim() || "deck";
  const out = (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(out);
  await Promise.all(Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).map(async (f) => {
    const x = await zip.file(f)!.async("string");
    zip.file(f, x.replace(/<a:buSzPct val="100000"\/><a:buChar char="&#x2022;"\/>/g, '<a:buClr><a:srgbClr val="C4621F"/></a:buClr><a:buSzPct val="120000"/><a:buChar char="&#x2022;"/>'));
  }));
  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${safe}.pptx`; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}

type Ctx = { pptx: Pptx; s: Slide; deck: Deck; i: number; total: number; k: number; kh: number; snap?: Snap; big: boolean; web?: { w?: number[]; fs?: number } };

// без автопідбору кегля: розміри вже підібрані сайтом; рамки рахуємо із запасом, щоб Keynote/PowerPoint не зменшували текст
const base = (o: TextProps = {}): TextProps => ({ fontFace: SANS, color: C.ink, margin: 0, valign: "top", fit: "none", ...o });

/** Колонтитули: логотип + рядок деки зверху / знизу, номер сторінки. */
function chrome({ s, deck, i, total }: Ctx, p: DeckPage) {
  const isCover = p.type === "cover", isSection = p.type === "section", isClosing = p.type === "closing";
  const ampCover = isCover && (p.variant === "amp" || p.variant === "photo" || p.variant === "full" || p.variant === "band");
  // логотип (для титулу з фото на весь аркуш і банер-розділу — після картинки, див. wordmark())
  if (!(isCover && (p.variant === "full" || p.variant === "band" || ((p.variant === "amp" || p.variant === "photo") && deck.logo))) && !(isSection && p.image && p.fit === "top")) s.addText([{ text: "Pan", options: { color: C.ink } }, { text: "&", options: { color: C.amber } }, { text: "Partners", options: { color: C.ink } }],
    base({ x: M, y: 0.42, w: 3.2, h: 0.4, fontFace: SERIF, fontSize: ampCover ? 22 : 13.5, bold: false, valign: "middle" }));
  if (!ampCover && !deck.footRunhead && !isCover) s.addText(txt(deck.runhead).toUpperCase(), base({ x: W - M - 6, y: 0.42, w: 6, h: 0.4, fontFace: MONO, fontSize: 7.5, color: C.faint, align: "right", valign: "middle", charSpacing: 2 }));
  if (!ampCover) s.addShape("line", { x: M + (isCover ? 0 : 1.65), y: 0.62, w: W - 2 * M - (isCover ? 0 : 1.65) - (!deck.footRunhead && !isCover ? 6.1 : 0), h: 0, line: { color: C.line, width: 0.5 } });
  if (isCover || ((isSection || isClosing) && !deck.big)) return;
  // нижній колонтитул (на фіналі й розділах із фото праворуч — лише до фото)
  const fw = (isClosing || (isSection && p.image && p.fit !== "top")) ? W - 4.5 - 0.2 - M : W - 2 * M;
  s.addShape("line", { x: M, y: H - 0.62, w: fw, h: 0, line: { color: C.line, width: 0.5 } });
  const foot = deck.footRunhead ? txt(deck.runhead).toUpperCase() : `${deckT(deck.lang).trainer} · Pan&Partners · pan-partners.agency`;
  s.addText(foot, base({ x: M, y: H - 0.56, w: 7, h: 0.3, fontFace: deck.footRunhead ? MONO : SERIF, italic: !deck.footRunhead, fontSize: deck.footRunhead ? (deck.big ? 8.5 : 7.5) : 9, color: deck.footRunhead ? (deck.big ? C.muted : C.faint) : C.muted, charSpacing: deck.footRunhead ? 2 : 0, valign: "middle" }));
  const num = deck.footRunhead ? String(i + 1).padStart(2, "0") : `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  s.addText(num, base({ x: M + fw - 2, y: H - 0.56, w: 2, h: 0.3, fontFace: MONO, fontSize: deck.big ? 9 : 8, color: deck.big ? C.muted : C.faint, align: "right", valign: "middle", charSpacing: 2 }));
}

/** Локап титулу: наш знак, «×», логотип клієнта (висотою як великі літери знака). */
async function lockup(ctx: Ctx, light: boolean, size = 22) {
  const deck = ctx.deck;
  wordmark(ctx, light, size);
  const lg = light ? deck.logoLight || deck.logo : deck.logo;
  if (!lg) return;
  const tw = ("Pan&Partners".length * size * 0.55) / 72; // ширина знака Georgia
  const xx = M + tw + 0.1;
  ctx.s.addText("×", base({ x: xx, y: 0.42, w: 0.3, h: 0.4, fontFace: SERIF, fontSize: size * 0.9, color: light ? C.sheet : C.ink, transparency: light ? 20 : 45, align: "center", valign: "middle" }));
  await picture(ctx, lg, xx + 0.38, 0.4, 2.4, 0.34, "contain");
}

/** Логотип поверх фото (титул на весь аркуш, банер-розділ). */
function wordmark(ctx: Ctx, light: boolean, size = 13.5) {
  ctx.s.addText([{ text: "Pan", options: { color: light ? C.sheet : C.ink } }, { text: "&", options: { color: light ? "F0B450" : C.amber } }, { text: "Partners", options: { color: light ? C.sheet : C.ink } }],
    base({ x: M, y: 0.42, w: 3.2, h: 0.4, fontFace: SERIF, fontSize: size, valign: "middle" }));
}

/** Заголовок з акцентом: повертає нижню межу. */
function title(ctx: Ctx, y: number, t: string, em: string, wIn = W - 2 * M, size = 26) {
  const runs: { text: string; options?: TextProps }[] = [];
  if (t) runs.push({ text: txt(t), options: { color: C.ink } });
  if (em) runs.push({ text: (t && !/-$/.test(t.trim()) ? " " : "") + txt(em), options: { color: C.amber, italic: true } });
  if (!runs.length) return y;
  const fs = size * ctx.kh;
  const lines = Math.max(1, Math.ceil(((t + " " + em).length * fs * 0.57) / (wIn * 72)));
  const h = (lines * fs * 1.15) / 72 + 0.08;
  ctx.s.addText(runs, base({ x: M, y, w: wIn, h, fontFace: SERIF, fontSize: fs }));
  return y + h;
}

function lead(ctx: Ctx, y: number, text: string, wIn = W - 2 * M) {
  if (!text) return y;
  const fs = ctx.big ? 12.6 * ctx.k : 13 * Math.min(ctx.k, 1.15);
  const lines = text.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil((l.length * fs * 0.57) / (wIn * 72))), 0);
  const h = (lines * fs * 1.45) / 72 + 0.1;
  ctx.s.addText(runs(text), base({ x: M, y: y + 0.12, w: wIn, h, fontFace: SERIF, fontSize: fs, color: C.ink }));
  return y + 0.12 + h;
}

function callout(ctx: Ctx, y: number, text: string, wIn = W - 2 * M) {
  if (!text) return y;
  const fs = 13 * ctx.k;
  const lines = text.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil((l.length * fs * 0.57) / ((wIn - 0.5) * 72))), 0);
  const h = (lines * fs * 1.45) / 72 + 0.3;
  y = Math.min(y, H - 0.78 - 0.2 - h); // не заходити на колонтитул
  ctx.s.addShape("rect", { x: M, y: y + 0.2, w: wIn, h, fill: { color: C.band }, line: { color: C.band } });
  ctx.s.addShape("rect", { x: M, y: y + 0.2, w: 0.05, h, fill: { color: C.amber }, line: { color: C.amber } });
  ctx.s.addText(runs(text), base({ x: M + 0.25, y: y + 0.2, w: wIn - 0.4, h, fontFace: SERIF, italic: !ctx.big, fontSize: fs, valign: "middle" }));
  return y + 0.2 + h;
}

async function picture(ctx: Ctx, src: string | undefined, x: number, y: number, w: number, h: number, mode: "cover" | "contain" = "cover", circle = false, knockWhite = false, focus?: [number, number]) {
  if (!src) return;
  const im = await imgInfo(src, knockWhite); if (!im) return;
  if (mode === "cover" && focus) { // кадрування з фокусом (як object-position на сайті): вирізаємо на canvas
    const el = new Image(); await new Promise((r) => { el.onload = r; el.onerror = r; el.src = im.data; });
    const ar = w / h, iw = el.naturalWidth || im.w, ih = el.naturalHeight || im.h;
    const cw = Math.min(iw, ih * ar), chh = cw / ar, sx = (iw - cw) * focus[0], sy = (ih - chh) * focus[1];
    const cv = document.createElement("canvas"); const scale = Math.min(1, 2400 / cw); cv.width = Math.round(cw * scale); cv.height = Math.round(chh * scale);
    cv.getContext("2d")!.drawImage(el, sx, sy, cw, chh, 0, 0, cv.width, cv.height);
    ctx.s.addImage({ data: cv.toDataURL("image/jpeg", 0.9), x, y, w, h, rounding: circle });
    return;
  }
  ctx.s.addImage({ data: im.data, x, y, w, h, sizing: { type: mode, w, h }, rounding: circle });
}

/** Ілюстрація праворуч для text/bullets/steps/twocol: повертає ширину текстової колонки. */
async function sideImage(ctx: Ctx, image: string | undefined) {
  if (!image) return W - 2 * M;
  const iw = 4.6, gap = 0.5;
  await picture(ctx, image, W - M - iw, 0.95, iw, H - 0.95 - 0.85);
  return W - 2 * M - iw - gap;
}

/** Абзаци списку: «1. …» — без маркера, «- …» — підпункт (другий рівень), інакше помаранчева крапка. */
function listParas(items: string[], extra: TextProps = {}) {
  return items.flatMap((t) => {
    const sub = /^- /.test(t); let t0 = sub ? t.slice(2) : t;
    const head = /^\*\*[^*]+\*\*$/.test(t0.trim());
    const nm = t0.match(/^\s*(\d+)([.)])\s+/);
    const fs0 = (extra.fontSize as number) || 14;
    let first: TextProps;
    if (nm) { // справжня нумерація: висячий відступ, перенос під текст, а не під номер
      t0 = t0.slice(nm[0].length);
      first = { bullet: { type: "number", style: nm[2] === ")" ? "arabicParenR" : "arabicPeriod", startAt: Number(nm[1]), indent: Math.round(fs0 * 1.25) } as any, ...(sub ? { indentLevel: 1 } : {}) };
    } else if (head) first = { bullet: false as const };
    else first = { bullet: { indent: Math.round(fs0 * 0.9), code: "2022", color: C.acc } as any, ...(sub ? { indentLevel: 1 } : {}) };
    return runs(t0, { color: C.ink, ...extra }, { ...first, lineSpacingMultiple: 1.12 } as TextProps, { breakLine: true, paraSpaceAfter: sub ? 3 : 6 });
  });
}
function listLines(items: string[], fs: number, wIn: number) {
  const ind = (fs * 0.95) / 72; // висячий відступ маркера/номера
  return items.reduce((a, t) => a + Math.max(1, Math.ceil((t.replace(/\*\*/g, "").length * fs * 0.45) / ((wIn - ind - 0.1 - (/^- /.test(t) ? ind : 0)) * 72))), 0);
}
function bulletList(ctx: Ctx, y: number, items: string[], wIn: number, size = 12.5, reserve = 0) {
  let fs = size * ctx.k;
  if (ctx.big) { // «великий друк»: кегль росте, поки список (у 1 або 2 колонки) вміщається до колонтитула
    const two = items.length >= 10 && wIn > 8, cw = two ? (wIn - 0.45) / 2 : wIn;
    const avail = H - 0.95 - y - 0.15 - reserve;
    const g1 = items.map((t, j) => (/^\*\*[^*]+:\*\*$/.test(t.trim()) ? j : -1)).filter((j) => j > 0);
    const hOf = (f: number) => two && g1.length === 1
      ? (items.slice(0, g1[0] + 1).reduce((a, t) => a + Math.max(1, Math.ceil((t.replace(/\*\*/g, "").length * f * 0.5) / ((wIn - 0.4) * 72))), 0) * 1.24 + listLines(items.slice(g1[0] + 1), f, cw) / 2 * 1.1 * 1.32) * f / 72 + items.length * 0.08
      : (two ? listLines(items, f, cw) / 2 * 1.1 : listLines(items, f, cw)) * f * 1.38 / 72 + items.length * (two ? 0.05 : 0.09);
    while (fs < 24 && hOf(fs * 1.04) < avail * 0.97) fs *= 1.04;
    while (fs > 9 && hOf(fs) > avail) fs *= 0.96;
    // фактичний кегль сайту (там уміщення перевірене) — нижня межа; PowerPoint-рядки щільніші за вебові
    const wf = ctx.web?.fs;
    if (wf && size >= 12 && wf * 0.97 > fs) fs = Math.min(wf * 0.97, 24);
  }
  // «великий друк»: довгі списки — у дві колонки (розрив перед пунктом верхнього рівня, ближчим до середини)
  if (ctx.big && items.length >= 10 && wIn > 8) {
    // розрив там, де обсяг тексту ділиться навпіл (як на сайті)
    const L = items.map((t) => t.replace(/\*\*/g, "").length + 40), tot = L.reduce((a, b) => a + b, 0);
    const isHead = (t: string) => /^\*\*[^*]+:\*\*$/.test(t.trim()) || (!/^- /.test(t) && items.some((x) => /^- /.test(x)));
    let mid = Math.ceil(items.length / 2), bestD = Infinity, acc = 0;
    const cw = (wIn - 0.45) / 2;
    const gh = items.map((t, j) => (/^\*\*[^*]+:\*\*$/.test(t.trim()) ? j : -1)).filter((j) => j > 0);
    if (gh.length === 1) { // дві групи: перша (і заголовок другої) — на всю ширину, друга група — у дві колонки
      const top = items.slice(0, gh[0] + 1), rest = items.slice(gh[0] + 1);
      const h1 = (top.reduce((a, t) => a + Math.max(1, Math.ceil((t.replace(/\*\*/g, "").length * fs * 0.5) / ((wIn - (fs * 0.95) / 72 - 0.1) * 72))), 0) * fs * 1.24) / 72 + top.length * 0.07 + 0.04;
      ctx.s.addText(listParas(top, { fontSize: fs }), base({ x: M, y: y + 0.15, w: wIn, h: h1, fontSize: fs }));
      const half = Math.ceil(rest.length / 2), parts2 = [rest.slice(0, half), rest.slice(half)];
      const h2 = Math.max(...parts2.map((it) => (listLines(it, fs, cw) * fs * 1.38) / 72 + it.length * 0.09 + 0.1));
      parts2.forEach((it, j) => ctx.s.addText(listParas(it, { fontSize: fs }), base({ x: M + j * (cw + 0.45), y: y + 0.1 + h1, w: cw, h: h2, fontSize: fs })));
      return y + 0.15 + h1 + h2;
    }
    for (let j = 1; j < items.length && bestD >= 0; j++) {
      acc += L[j - 1];
      if (isHead(items[j - 1])) continue;
      const d = Math.abs(acc - tot / 2) + (/^- /.test(items[j]) && !isHead(items[j]) ? tot * 0.04 : 0);
      if (d < bestD) { bestD = d; mid = j; }
    }
    const parts = [items.slice(0, mid), items.slice(mid)];
    const h = Math.min(H - 0.9 - y, Math.max(...parts.map((it) => (listLines(it, fs, cw) * fs * 1.45) / 72 + it.length * 0.09 + 0.1)));
    parts.forEach((it, j) => ctx.s.addText(listParas(it, { fontSize: fs }), base({ x: M + j * (cw + 0.45), y: y + 0.15, w: cw, h, fontSize: fs })));
    return y + 0.15 + h;
  }
  const h = Math.min(H - 0.9 - y, (listLines(items, fs, wIn) * fs * 1.45) / 72 + items.length * 0.09 + 0.1);
  ctx.s.addText(listParas(items, { fontSize: fs }), base({ x: M, y: y + 0.15, w: wIn, h, fontSize: fs }));
  return y + 0.15 + h;
}

async function page(ctx: Ctx, p: DeckPage) {
  const { s, deck } = ctx;
  switch (p.type) {
    case "cover": {
      const full = p.variant === "full";
      if (full) {
        if (p.image) await picture(ctx, p.image, 0, 0, W, H);
        // затемнення зліва — справжній градієнт (PNG з альфою), без видимих смуг
        const cv = document.createElement("canvas"); cv.width = 1200; cv.height = 8;
        const g = cv.getContext("2d")!, gr = g.createLinearGradient(0, 0, 1200, 0);
        gr.addColorStop(0, "rgba(24,16,9,.92)"); gr.addColorStop(0.38, "rgba(24,16,9,.82)"); gr.addColorStop(0.62, "rgba(24,16,9,.35)"); gr.addColorStop(0.8, "rgba(24,16,9,0)");
        g.fillStyle = gr; g.fillRect(0, 0, 1200, 8);
        s.addImage({ data: cv.toDataURL("image/png"), x: 0, y: 0, w: W, h: H });
        await lockup(ctx, true);
        const cw = 5.8, fs = 50;
        if (p.eyebrow) s.addText(txt(p.eyebrow).toUpperCase(), base({ x: M, y: 1.7, w: cw, h: 0.35, fontFace: MONO, fontSize: 10, color: "F0B450", charSpacing: 4, valign: "middle" }));
        s.addText([{ text: txt(p.title), options: { color: C.sheet } }, ...(p.titleEm ? [{ text: "\n" + txt(p.titleEm), options: { color: "F0B450", italic: true, fontSize: fs * 0.6 } }] : [])],
          base({ x: M, y: 2.2, w: cw, h: 2.8, fontFace: SERIF, fontSize: fs, valign: "top" }));
        const whoLines = txt(p.who).split("\n");
        s.addShape("line", { x: M, y: H - 1.75, w: 4.2, h: 0, line: { color: "D9CDB9", width: 0.5, transparency: 40 } as any });
        s.addText(whoLines.map((l, j) => ({ text: l, options: { fontFace: j === 0 && whoLines.length > 1 ? SERIF : SANS, fontSize: j === 0 && whoLines.length > 1 ? 16 : 11.5, color: j === 0 ? C.sheet : "D9CDB9", breakLine: true } })),
          base({ x: M, y: H - 1.65, w: 5, h: 0.7, valign: "top" }));
        if (p.when) s.addText(txt(p.when).toUpperCase(), base({ x: M, y: H - 0.95, w: 4, h: 0.3, fontFace: MONO, fontSize: 10, color: "E8DCC8", charSpacing: 3, valign: "middle" }));
        s.addShape("rect", { x: 0, y: H - 0.2, w: W, h: 0.2, fill: { color: C.amber }, line: { color: C.amber } });
        break;
      }
      if (p.variant === "band") { // фото-смуга на верхні 52%, під нею назва на кремовому полі
        const by0 = 1.06, bh = by0 + H * 0.44; // фото-смуга під шапкою; локап — на кремовому полі
        if (p.image) await picture(ctx, p.image, 0, by0, W, H * 0.44, "cover", false, false, [0.5, 0.78]);
        await lockup(ctx, false);
        if (p.eyebrow) s.addText(txt(p.eyebrow).toUpperCase(), base({ x: M, y: bh + 0.3, w: 6, h: 0.3, fontFace: MONO, fontSize: 10, color: C.acc, charSpacing: 4, valign: "middle" }));
        s.addText([{ text: txt(p.title), options: { color: C.ink } }, ...(p.titleEm ? [{ text: " " + txt(p.titleEm), options: { color: C.amber, italic: true } }] : [])],
          base({ x: M, y: bh + 0.62, w: 7.2, h: 1.45, fontFace: SERIF, fontSize: 42, valign: "top" }));
        const whoLines = txt(p.who).split("\n");
        s.addText(whoLines.map((l, j) => ({ text: l, options: { fontFace: j === 0 && whoLines.length > 1 ? SERIF : SANS, fontSize: j === 0 && whoLines.length > 1 ? 16 : 11.5, color: j === 0 ? C.ink : C.muted, breakLine: true } })),
          base({ x: M, y: bh + 2.15, w: 6, h: 0.8, valign: "top" }));
        if (p.when) s.addText(txt(p.when).toUpperCase(), base({ x: W - M - 4, y: bh + 2.2, w: 4, h: 0.3, fontFace: MONO, fontSize: 10, color: C.muted, charSpacing: 3, align: "right", valign: "middle" }));
        s.addShape("rect", { x: 0, y: H - 0.2, w: W, h: 0.2, fill: { color: C.amber }, line: { color: C.amber } });
        break;
      }
      const amp = p.variant === "amp" || p.variant === "photo";
      const colW = amp ? (p.variant === "photo" ? W - 2 * M - 4.6 : 6.4) : 5.2; // ліва колонка як на сайті (амперсанд: половина; звичайний: 1fr | 118mm)
      if (p.variant === "amp") s.addText("&", base({ x: W - 6.2, y: H - 6.4, w: 6.5, h: 6.5, fontFace: SERIF, fontSize: 400, color: C.amber, transparency: 86, align: "right", valign: "bottom" }));
      if (p.variant === "photo" && p.image) await picture(ctx, p.image, W - M - 4.25, 1.2, 4.25, H - 2.5, "cover", false, false, [0.5, 0.3]);
      if (deck.logo && amp) await lockup(ctx, false); // логотип клієнта після нашого, через «×», як на сайті
      if (p.eyebrow) s.addText(txt(p.eyebrow).toUpperCase(), base({ x: amp ? W - M - 4 : M, y: amp ? 0.42 : 1.5, w: amp ? 4 : colW, h: 0.35, fontFace: MONO, fontSize: amp ? 10 : 8.5, color: C.acc, charSpacing: 4, align: amp ? "right" : "left", valign: "middle" }));
      const ty = amp ? 2.4 : 2.0;
      const fs = (amp ? 44 : 46) * ctx.k;
      s.addText([{ text: txt(p.title), options: { color: C.ink } }, ...(p.titleEm ? [{ text: txt(p.titleEm), options: { color: C.amber, italic: true, fontSize: fs * (p.variant === "photo" ? 0.56 : 0.64), breakLine: false } }] : [])].map((r, j) => j === 1 ? { ...r, text: "\n" + r.text } : r),
        base({ x: M, y: ty, w: colW, h: 2.6, fontFace: SERIF, fontSize: fs, valign: "top" }));
      if (p.sub) s.addText(txt(p.sub), base({ x: M, y: ty + 2.7, w: colW, h: 0.8, fontFace: SERIF, fontSize: 15 * ctx.k, color: C.muted }));
      // підпис: аватар + хто/де
      const whoY = H - 1.55;
      let wx = M;
      if (p.avatar) { await picture(ctx, p.avatar, M, whoY - 0.15, 0.85, 0.85, "cover", true); wx = M + 1.05; }
      const whoLines = txt(p.who).split("\n");
      s.addText(whoLines.map((l, j) => ({ text: l, options: { fontFace: j === 0 && whoLines.length > 1 ? SERIF : SANS, fontSize: j === 0 && whoLines.length > 1 ? 16 : 11.5, color: j === 0 ? C.ink : C.muted, breakLine: true } })),
        base({ x: wx, y: whoY - 0.15, w: 6, h: 0.9, valign: "middle" }));
      s.addText(txt(p.when).toUpperCase(), base({ x: amp ? W - M - 4 : M, y: amp ? H - 0.85 : H - 0.62, w: 4, h: 0.3, fontFace: MONO, fontSize: amp ? 10 : 7.8, color: C.faint, charSpacing: 3, align: amp ? "right" : "left", valign: "middle" }));
      if (!amp) {
        if (deck.logo) await picture(ctx, deck.logo, W - M - 3.6, 1.1, 3.6, 1.1, "contain");
        const ill = p.image || (deck.logo ? "/deck/novapay/money.png" : ""); // як на сайті: без власної картинки — стандартна ілюстрація
        if (ill) await picture(ctx, ill, W - M - 4.6, deck.logo ? 2.5 : 1.2, 4.6, deck.logo ? 4.3 : H - 2.4, deck.logo || !p.image ? "contain" : "cover");
        s.addShape("line", { x: M, y: whoY - 0.35, w: 5.9, h: 0, line: { color: C.line, width: 0.5 } });
      }
      s.addShape("rect", { x: 0, y: H - 0.2, w: W, h: 0.2, fill: { color: C.amber }, line: { color: C.amber } });
      break;
    }
    case "about": {
      const colW = 6.9;
      s.addText(deckT(deck.lang).trainerLab.toUpperCase(), base({ x: M, y: 0.9, w: 3, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 3 }));
      let y = title(ctx, 1.2, p.title, p.titleEm, colW, 34);
      if (p.role) { s.addText(txt(p.role), base({ x: M, y, w: colW, h: 0.7, fontSize: 10.5 * ctx.k, color: C.muted })); y += 0.72; }
      if (p.quote) { s.addText(txt(p.quote), base({ x: M, y, w: colW, h: 1.1, fontFace: SERIF, italic: true, fontSize: 11.5 * ctx.k })); y += 1.15; }
      if (p.stats?.length) {
        const cw = colW / p.stats.length;
        p.stats.forEach((st, j) => {
          if (j) s.addShape("line", { x: M + j * cw, y: y + 0.05, w: 0, h: 0.95, line: { color: C.line, width: 0.5 } });
          s.addText(txt(st.n), base({ x: M + j * cw + (j ? 0.15 : 0), y, w: cw - 0.2, h: 0.4, fontFace: SERIF, italic: true, fontSize: 18, color: C.acc, valign: "middle" }));
          s.addText(txt(st.t), base({ x: M + j * cw + (j ? 0.15 : 0), y: y + 0.42, w: cw - 0.2, h: 0.62, fontSize: 8.5 * ctx.k, color: C.muted }));
        });
        y += 1.1;
      }
      await picture(ctx, p.image, W - M - 3.1, 0.95, 3.1, 4.1);
      // низ: спеціалізація + нотатка/логотипи
      const by = Math.max(y + 0.2, 5.3);
      s.addText(deckT(deck.lang).spec.toUpperCase(), base({ x: M, y: by, w: 4, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 3 }));
      bulletList(ctx, by + 0.2, p.facts, 6.4, 10.5);
      if (p.note) s.addText(txt(p.note), base({ x: M + 6.9, y: by, w: W - 2 * M - 6.9, h: 1.1, fontSize: 9.5 * ctx.k, color: C.muted }));
      if (p.logos) await picture(ctx, p.logos, M + 6.9, by + 1.2, W - 2 * M - 6.9, 0.9, "contain", false, /\.png(\?|$)/i.test(p.logos));
      break;
    }
    case "section": {
      s.background = { color: C.band }; // на сайті розділ — на плашці
      const hasImg = !!p.image, top = p.fit === "top";
      if (hasImg) await picture(ctx, p.image, top ? 0 : W - 4.5, 0, top ? W : 4.5, top ? 3.6 : H);
      if (hasImg && top) { // банер: темний градієнт під логотипом і сам логотип — поверх фото
        s.addShape("rect", { x: 0, y: 0, w: W, h: 0.75, fill: { color: "140C06", transparency: 45 }, line: { type: "none" } as any });
        s.addShape("rect", { x: 0, y: 0.75, w: W, h: 0.5, fill: { color: "140C06", transparency: 78 }, line: { type: "none" } as any });
        wordmark(ctx, true);
      }
      const tw = hasImg && !top ? W - 2 * M - 4.7 : W - 2 * M;
      // композиція як на сайті: цифра ліворуч, праворуч надрядок «РОЗДІЛ» з рискою, заголовок і підзаголовок; блок по центру вільної площі
      const numW = p.num ? 0.85 * String(p.num).length + 0.6 : 0, tx = M + numW + (numW ? 0.35 : 0), tcw = tw - numW - (numW ? 0.35 : 0);
      const tfs = 30 * ctx.kh, tLines = Math.max(1, Math.ceil((p.title.length * tfs * 0.57) / (tcw * 72))), tH = (tLines * tfs * 1.08) / 72 + 0.1;
      const subH = p.sub ? 0.45 : 0, blockH = 0.4 + tH + (subH ? subH + 0.08 : 0);
      const areaY = top ? 3.6 : 0.8, areaH = H - 0.6 - areaY, by = areaY + (areaH - blockH) / 2 - (top ? 0.1 : 0.4);
      if (p.num) s.addText(txt(p.num), base({ x: M - 0.1, y: by + blockH - 2.05, w: numW + 0.3, h: 2.1, fontFace: SERIF, italic: true, fontSize: 130, color: C.amber, valign: "bottom" }));
      if (!ctx.big) {
        s.addText(deckT(ctx.deck.lang).section.toUpperCase(), base({ x: tx, y: by, w: 0.9, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 3, valign: "middle" }));
        s.addShape("line", { x: tx + 0.85, y: by + 0.15, w: 2.2, h: 0, line: { color: C.amber, width: 0.5 } });
      }
      s.addText(txt(p.title), base({ x: tx, y: by + 0.4, w: tcw, h: tH, fontFace: SERIF, fontSize: tfs, valign: "top" }));
      if (p.sub) s.addText(txt(p.sub), base({ x: tx, y: by + 0.4 + tH + 0.08, w: tcw, h: subH, fontFace: SERIF, italic: true, fontSize: 15 * ctx.k, color: C.muted }));
      break;
    }
    case "text": {
      if (!p.title && !p.titleEm && !p.lead && !p.paras.length && p.image) { // цитата з фото
        await picture(ctx, p.image, W - M - 5, 1.1, 5, H - 2.1);
        const qh = Math.min(H - 3.2, ((Math.ceil((p.callout.length * 26 * 0.57) / ((W - 2 * M - 5.6) * 72)) * 26 * 1.32) / 72) + 0.2), qy = 1.1 + (H - 2.1 - qh - 0.9) / 2;
        s.addText("“", base({ x: M - 0.05, y: qy, w: 1, h: 0.9, fontFace: SERIF, fontSize: 80, color: C.amber, valign: "top" }));
        s.addText(txt(p.callout), base({ x: M, y: qy + 0.9, w: W - 2 * M - 5.6, h: qh, fontFace: SERIF, italic: true, fontSize: 26, valign: "top" }));
        break;
      }
      if (!p.paras.length && !p.callout && p.image) { // ілюстрація на всю ширину під заголовком (логотипи клієнтів тощо)
        let y = title(ctx, 1.0, p.title, p.titleEm); y = lead(ctx, y, p.lead);
        const availH = H - 0.95 - (y + 0.3), h = Math.min(availH, 4.9);
        await picture(ctx, p.image, M, y + 0.3 + (availH - h) / 2, W - 2 * M, h, "contain", false, /\.png(\?|$)/i.test(p.image));
        break;
      }
      const wIn = await sideImage(ctx, p.image);
      let y = title(ctx, 1.0, p.title, p.titleEm, wIn);
      y = lead(ctx, y, p.lead, wIn);
      if (p.paras.length) {
        const fs = 12 * ctx.k;
        const est = p.paras.reduce((a, t) => a + Math.max(1, Math.ceil((t.length * fs * 0.57) / (wIn * 72))), 0);
        const h = Math.min(H - 1.0 - y - (p.callout ? 1.2 : 0), (est * fs * 1.55) / 72 + p.paras.length * 0.12 + 0.1);
        s.addText(p.paras.flatMap((t) => runs(t, {}, {}, { breakLine: true, paraSpaceAfter: 8 })), base({ x: M, y: y + 0.15, w: wIn, h, fontSize: fs }));
        y += 0.15 + h;
      }
      callout(ctx, y, p.callout, wIn);
      break;
    }
    case "bullets": {
      const wIn = await sideImage(ctx, p.image);
      let y = title(ctx, 1.0, p.title, p.titleEm, wIn);
      y = lead(ctx, y, p.lead, wIn);
      const items = p.items;
      if (p.variant === "cards" && !p.image) {
        // сітка як на сайті: 2 → 2, 4 → 2×2, до 6 → 3, далі 4 колонки; висота картки — за вмістом, мінімум 28 мм·k
        const n = items.length, cols = n <= 2 ? Math.max(1, n) : n === 4 ? 2 : n <= 6 ? 3 : 4, rows = Math.ceil(n / cols), gap = cols === 4 ? 0.18 : 0.24;
        const cw = (wIn - gap * (cols - 1)) / cols, availH = H - 0.95 - (y + 0.28) - (p.callout ? 1.1 : 0);
        const fs = 11.5 * ctx.k, nfs = 20 * ctx.k, pad = 0.24;
        const parsed = items.map((it, j) => { const m = it.match(/^\s*(\d+)\s*[.)]\s*(.*)$/s); return { num: (m ? m[1] : String(j + 1)).padStart(2, "0"), body: m ? m[2] : it }; });
        const chOf = (body: string) => { const lines = Math.max(1, Math.ceil((body.length * fs * 0.57) / ((cw - 2 * pad) * 72))); return Math.max(1.1 * ctx.k, pad + nfs / 72 + 0.1 + (lines * fs * 1.45) / 72 + pad); };
        const ch = Math.min((availH - gap * (rows - 1)) / rows, Math.max(...parsed.map((x) => chOf(x.body))));
        parsed.forEach(({ num, body }, j) => {
          const cx = M + (j % cols) * (cw + gap), cy = y + 0.28 + Math.floor(j / cols) * (ch + gap);
          s.addShape("rect", { x: cx, y: cy, w: cw, h: ch, fill: { color: C.band }, line: { color: C.band } });
          s.addShape("rect", { x: cx, y: cy, w: cw, h: 0.035, fill: { color: C.amber }, line: { color: C.amber } });
          s.addText(num, base({ x: cx + pad, y: cy + pad - 0.02, w: cw - 2 * pad, h: nfs / 72 + 0.1, fontFace: SERIF, italic: true, fontSize: nfs, color: C.acc }));
          s.addText(runs(body), base({ x: cx + pad, y: cy + pad + nfs / 72 + 0.1, w: cw - 2 * pad, h: ch - (pad + nfs / 72 + 0.1) - pad * 0.6, fontSize: fs }));
        });
        y += 0.28 + rows * (ch + gap);
      } else if (p.variant === "bubbles" && !p.image) {
        const fs = 12.5 * ctx.k;
        items.forEach((it) => {
          const lines = Math.max(1, Math.ceil((it.length * fs * 0.57) / ((wIn - 0.9) * 72)));
          const h = (lines * fs * 1.45) / 72 + 0.3;
          s.addShape("roundRect", { x: M, y: y + 0.18, w: wIn - 0.5, h, fill: { color: C.band }, line: { color: C.line, width: 0.5 }, rectRadius: 0.15 });
          s.addText("“", base({ x: M + 0.15, y: y + 0.18, w: 0.4, h: 0.5, fontFace: SERIF, fontSize: 24, color: C.amber }));
          s.addText(txt(it), base({ x: M + 0.5, y: y + 0.18, w: wIn - 1.1, h, fontFace: SERIF, italic: true, fontSize: fs, valign: "middle" }));
          y += 0.18 + h;
        });
      } else {
        y = bulletList(ctx, y, items, wIn, 12.5, p.callout ? 0.3 + (Math.ceil((p.callout.length * 13 * ctx.k * 0.57) / ((wIn - 0.5) * 72)) * 13 * ctx.k * 1.45) / 72 + 0.3 : 0);
      }
      callout(ctx, y, p.callout, wIn);
      break;
    }
    case "twocol": {
      const wIn = await sideImage(ctx, p.image);
      let y = title(ctx, 1.0, p.title, p.titleEm, wIn);
      y = lead(ctx, y, p.lead, wIn);
      // колонки-картки на плашці з помаранчевою рискою зверху, однакової висоти (за найдовшою), як на сайті
      const n = Math.max(1, p.cols.length), gap = n >= 4 ? 0.2 : 0.39, pad = n >= 4 ? 0.18 : 0.24;
      // ширини колонок: у «великому друці» — за обсягом тексту (як на сайті), інакше рівні
      const wts = ctx.big && n === 2 ? (() => { const L = p.cols.map((c) => c.items.join(" ").length + c.head.length + 40); const r = Math.min(1.5, Math.max(1 / 1.5, L[0] / L[1])); return [r, 1]; })() : p.cols.map(() => 1);
      const wsum = wts.reduce((a, b) => a + b, 0), cws = wts.map((x) => ((wIn - gap * (n - 1)) * x) / wsum), cw = Math.min(...cws);
      const heads = p.cols.some((c) => c.head.trim());
      let fs = 12.2 * ctx.k; const hfs = 13.5 * ctx.k, availH = H - 0.95 - (y + 0.25);
      const hOf = (c: { head: string; items: string[] }, j: number) => {
        const w = cws[j];
        const hl = heads ? Math.max(1, Math.ceil((c.head.length * hfs * 0.6) / ((w - 2 * pad) * 72))) : 0;
        const il = listLines(c.items, fs, w - 2 * pad);
        return { hh: hl ? (hl * hfs * 1.3) / 72 + 0.08 : 0, total: pad + (hl * hfs * 1.3) / 72 + (hl ? 0.2 : 0) + (il * fs * 1.36) / 72 + c.items.length * 0.07 + pad };
      };
      let hs = p.cols.map(hOf);
      for (let it = 0; it < 25 && Math.max(...hs.map((h) => h.total)) > availH - (p.callout ? 1.1 : 0) && fs > 9; it++) { fs *= 0.96; hs = p.cols.map(hOf); }
      const ch = Math.min(availH - (p.callout ? 1.1 : 0), Math.max(...hs.map((h) => h.total)));
      void cw;
      p.cols.forEach((c, j) => {
        const cxw = cws[j], cx = M + cws.slice(0, j).reduce((a, b) => a + b, 0) + j * gap, hh = hs[j].hh;
        s.addShape("rect", { x: cx, y: y + 0.25, w: cxw, h: ch, fill: { color: C.band }, line: { color: C.band } });
        s.addShape("rect", { x: cx, y: y + 0.25, w: cxw, h: 0.035, fill: { color: C.amber }, line: { color: C.amber } });
        if (c.head.trim()) s.addText(txt(c.head), base({ x: cx + pad, y: y + 0.25 + pad, w: cxw - 2 * pad, h: hh, fontFace: SERIF, italic: true, fontSize: hfs, color: C.acc }));
        s.addText(listParas(c.items, { fontSize: fs }), base({ x: cx + pad, y: y + 0.25 + pad + hh + (hh ? 0.12 : 0), w: cxw - 2 * pad, h: ch - pad - hh - 0.12 - pad * 0.6, fontSize: fs }));
      });
      callout(ctx, y + 0.25 + ch, p.callout ?? "", wIn);
      break;
    }
    case "steps": {
      const wIn = await sideImage(ctx, p.image);
      let y = title(ctx, 1.0, p.title, p.titleEm, wIn);
      y = lead(ctx, y, p.lead, wIn);
      // рядки за вмістом (не розтягуємо на сторінку), колонка заголовка 60 мм, кільце-маркер і суцільна лінія, як на сайті
      const kk = Math.min(ctx.k, 1.18), fh = 13.5 * (ctx.big ? Math.min(ctx.k, 1.5) : kk), ft = (ctx.big ? 12.6 * ctx.k : 12.2 * kk);
      const lw = Math.min(Math.max(1.8, (Math.max(...p.steps.map((x) => x.head.length)) * fh * 0.57) / 72 + 0.6), Math.min(4.2, wIn * 0.42)), tw = wIn - lw - 0.24;
      const rhOf = (st: { head: string; text: string }) => {
        const l1 = Math.ceil((st.head.length * fh * 0.6) / ((lw - 0.45) * 72)), l2 = Math.ceil((st.text.length * ft * 0.57) / (tw * 72));
        return (Math.max(1, l1, l2) * ft * 1.5) / 72 + 0.26 * ctx.k;
      };
      const rhs = p.steps.map(rhOf), total = rhs.reduce((a, b) => a + b, 0), availH = H - 0.95 - (y + 0.2), sc = total > availH ? availH / total : 1;
      const y0 = y + 0.2;
      if (p.steps.length > 1) s.addShape("line", { x: M + 0.12, y: y0 + 0.16, w: 0, h: (total - rhs[rhs.length - 1]) * sc, line: { color: C.line, width: 0.75 } });
      let sy = y0;
      p.steps.forEach((st, j) => {
        const rh = rhs[j] * sc;
        s.addShape("ellipse", { x: M, y: sy + 0.04, w: 0.24, h: 0.24, fill: { color: C.sheet }, line: { color: C.amber, width: 1.5 } });
        s.addShape("ellipse", { x: M + 0.07, y: sy + 0.11, w: 0.1, h: 0.1, fill: { color: C.amber }, line: { color: C.amber } });
        s.addText(txt(st.head), base({ x: M + 0.42, y: sy, w: lw - 0.42, h: rh - 0.08, fontFace: SERIF, italic: true, fontSize: fh, color: C.acc }));
        s.addText(runs(st.text), base({ x: M + lw + 0.24, y: sy, w: tw, h: rh - 0.08, fontSize: ft }));
        sy += rh;
      });
      break;
    }
    case "table": {
      let y = title(ctx, 1.0, p.title, p.titleEm);
      y = lead(ctx, y, p.lead);
      const cols = Math.max(p.head.length, ...p.rows.map((r) => r.length), 1), TW = W - 2 * M;
      const numeric = p.rows.length > 0 && p.rows.every((r) => /^\s*\d+[.)]?\s*$/.test(r[0] ?? ""));
      const isWide = (r: string[]) => (r[0] ?? "").length > 60 && r.slice(1).every((c) => !c.trim()) && cols > 1;
      const normal = p.rows.filter((r) => !isWide(r));
      const fcText = !numeric && normal.length > 0 && normal.reduce((a, r) => a + (r[0] ?? "").length, 0) / normal.length > 45;
      const empt = normal.flatMap((r) => r.slice(1)).filter((c) => !c.trim()).length / Math.max(1, normal.length * (cols - 1));
      const ws = empt >= 0.4 || (ctx.big && normal.some((r) => r.slice(1).every((c) => !c.trim())));
      // ширини колонок — як на сайті
      const frac: number[] =
        fcText ? Array(cols).fill(1 / cols)
        : cols === 1 ? [1]
        : numeric ? [0.06, ...Array(cols - 1).fill(0.94 / (cols - 1))]
        : cols === 2 ? [0.24, 0.76]
        : cols === 3 ? [0.2, 0.34, 0.46]
        : cols >= 7 ? (() => { const mx = Array.from({ length: cols - 1 }, (_, ci) => Math.max(7, ...p.rows.map((r) => (r[ci + 1] ?? "").replace(/\*\*/g, "").split("\n").reduce((a, l) => Math.max(a, l.length), 0))) + 2); const sm = mx.reduce((a, b) => a + b, 0); return [0.25, ...mx.map((v) => (0.75 * v) / sm)]; })()
        : [0.2, ...Array(cols - 1).fill(0.8 / (cols - 1))];
      // ширини, підібрані сайтом для цієї сторінки (найбільший кегль без розриву слів)
      const cw0 = ctx.web?.w, opt = cw0 && (cols === 2 || cols === 3) && cw0.length === cols - 1 && !fcText && !numeric && !ws ? cw0.map((x) => x / 100) : null;
      if (opt) { frac.splice(0, frac.length, ...opt, 1 - opt.reduce((a, b) => a + b, 0)); }
      const colW = frac.map((f) => f * TW);
      const availH = H - 0.95 - (y + 0.2) - (p.callout ? 1.1 : 0);
      const none = { type: "none" as const }, bLine = (c: string, pt: number) => [none, none, { type: "solid" as const, color: c, pt }, none];
      const lh = 1.3, padV = 0.18;
      const cellLines = (t: string, w: number, f: number) => t.split("\n").reduce((a, l) => a + Math.max(1, Math.ceil((l.replace(/\*\*/g, "").length * f * 0.47) / (Math.max(0.3, w - 0.16) * 72))), 0);
      let fs = (ws ? 11 : 10.5) * ctx.k, hfs = ctx.big ? 10 : 7.5;
      const heights = (f: number) => {
        const hh = (Math.max(...p.head.map((h, ci) => cellLines(h, colW[ci], hfs))) * hfs * lh) / 72 + padV;
        const rh = p.rows.map((r) => isWide(r) ? (cellLines(r[0] ?? "", TW, f) * f * lh) / 72 + padV + 0.08 : (Math.max(...Array.from({ length: cols }, (_, ci) => cellLines(r[ci] ?? "", colW[ci], f))) * f * lh) / 72 + padV);
        return { hh, rh };
      };
      let { hh, rh } = heights(fs);
      const tot = (f: number) => { const x = heights(f); return x.hh + x.rh.reduce((a, b) => a + b, 0); };
      if (ctx.big && !ws) while (fs < 16 && tot(fs * 1.04) <= availH) fs *= 1.04;
      ({ hh, rh } = heights(fs));
      for (let it = 0; it < 30 && hh + rh.reduce((a, b) => a + b, 0) > availH && fs > 8; it++) { fs *= 0.95; ({ hh, rh } = heights(fs)); }
      // «великий друк»: сайт уже перевірив, що таблиця вміщається цим кеглем (Arial вужчий за Inter) — не дрібнішаємо,
      // а мінімальні висоти рядків стискаємо пропорційно до вільного місця (рядок сам виросте під текст)
      const wf = ctx.web?.fs;
      if (ctx.big && !ws && wf && wf * 0.97 > fs) {
        fs = wf * 0.97; ({ hh, rh } = heights(fs));
        const sum = hh + rh.reduce((a, b) => a + b, 0);
        if (sum > availH) { const f = Math.max(0.5, (availH - hh) / (sum - hh)); rh = rh.map((h) => h * f); }
      }
      // робочий аркуш: порожні рядки ділять вільну висоту (до колонтитула)
      if (ws) {
        const blank = p.rows.map((r) => !isWide(r) && r.slice(1).every((c) => !c.trim()));
        const used = hh + rh.reduce((a, b, j) => a + (blank[j] ? 0 : b), 0), nb0 = blank.filter(Boolean).length;
        if (nb0) { const each = Math.max(0.6, (availH - used) / nb0); rh = rh.map((h, j) => (blank[j] ? each : h)); }
      }
      const head = p.head.map((h, ci) => ({ text: ctx.big ? txt(h) : txt(h).toUpperCase(), options: ctx.big
        ? { color: C.ink, fontFace: SANS, bold: true, fontSize: hfs, valign: "bottom" as const, ...(cols >= 7 && ci > 0 ? { align: "right" as const } : {}), border: bLine(C.ink, 0.75) }
        : { color: C.faint, fontFace: MONO, fontSize: hfs, charSpacing: 1.5, valign: "bottom" as const, border: bLine(C.ink, 0.75) } }));
      const firstStyle = fcText ? {} : ctx.big ? { bold: true, color: "8E4213" } : { fontFace: SERIF, italic: true, color: C.acc };
      const body = p.rows.map((r) => isWide(r)
        ? [{ text: runs(r[0] ?? "") as any, options: { colspan: cols, fontSize: fs, fill: { color: C.band }, border: bLine(C.line, 0.5) } }]
        : Array.from({ length: cols }, (_, ci) => ({ text: runs(r[ci] ?? "") as any, options: { fontSize: ci === 0 && !fcText ? (ctx.big ? fs : 11 * ctx.k) : fs, ...(ci === 0 ? firstStyle : {}), ...(cols >= 7 && ci > 0 ? { align: "right" as const } : {}), border: bLine(C.line, 0.5) } })));
      const ty = y + 0.2;
      const noHead = p.head.every((h) => !h.trim());
      if (noHead) hh = 0;
      s.addTable((noHead ? body : [head, ...body]) as any, { x: M, y: ty, w: TW, colW, rowH: noHead ? rh : [hh, ...rh], fontFace: SANS, color: C.ink, valign: "top", margin: [0.07, 0.1, 0.07, 0.04] });
      // лінії для запису в порожніх клітинках робочого аркуша
      if (ws) {
        let ry = ty + hh;
        p.rows.forEach((r, j) => {
          if (!isWide(r)) for (let ci = 1; ci < cols; ci++) {
            if ((r[ci] ?? "").trim()) continue;
            const cx = M + colW.slice(0, ci).reduce((a, b) => a + b, 0);
            for (let ly = ry + 0.38; ly < ry + rh[j] - 0.1; ly += 0.36) s.addShape("line", { x: cx + 0.08, y: ly, w: colW[ci] - 0.2, h: 0, line: { color: "B9AA92", width: 0.5 } });
          }
          ry += rh[j];
        });
      }
      callout(ctx, ty + hh + rh.reduce((a, b) => a + b, 0), p.callout);
      break;
    }
    case "gallery": {
      let y = title(ctx, 1.0, p.title, p.titleEm);
      if (p.lead) { s.addText(txt(p.lead), base({ x: M, y: y + 0.1, w: W - 2 * M, h: 0.5, fontFace: SERIF, italic: true, fontSize: 16 * ctx.k, color: C.acc })); y += 0.6; }
      const n = Math.max(1, p.images.length), gap = 0.25, cw = (W - 2 * M - gap * (n - 1)) / n;
      const ih = Math.min(H - 0.95 - (y + 0.25) - 0.5, cw * 1.05);
      for (let j = 0; j < n; j++) {
        const g = p.images[j], gx = M + j * (cw + gap);
        await picture(ctx, g.src, gx, y + 0.25, cw, ih);
        s.addText(txt(g.cap), base({ x: gx, y: y + 0.3 + ih, w: cw, h: 0.4, fontFace: SERIF, italic: true, fontSize: 11 * ctx.k, color: C.muted, align: "center" }));
      }
      break;
    }
    case "closing": {
      await picture(ctx, p.image, W - 4.5, 0, 4.5, H);
      const tw = W - 2 * M - 4.7;
      title(ctx, 2.0, p.title, p.titleEm, tw, 40);
      if (p.sub) s.addText(txt(p.sub), ctx.big ? base({ x: M, y: 3.75, w: tw, h: 0.5, fontFace: SERIF, fontSize: 14, color: C.muted }) : base({ x: M, y: 3.8, w: tw, h: 0.45, fontFace: MONO, fontSize: 9, color: C.faint, charSpacing: 2 }));
      const cy = p.sub ? 4.3 : 3.5;
      s.addText(p.contacts.map((c) => ({ text: txt(c), options: { breakLine: true, paraSpaceAfter: 8 } })), ctx.big ? base({ x: M, y: cy, w: tw - 1.8, h: 2.2, fontFace: SANS, fontSize: 15, color: C.ink }) : base({ x: M, y: cy, w: tw - 1.8, h: 2.2, fontFace: MONO, fontSize: 11 * ctx.k, color: C.acc, charSpacing: 1 }));
      if (p.qr) {
        const qx = ctx.big ? M : M + tw - 1.5, qy = ctx.big ? cy + 1.35 : cy;
        await picture(ctx, p.qr, qx, qy, 1.3, 1.3, "contain");
        if (ctx.big) s.addText("Instagram", base({ x: qx, y: qy + 1.33, w: 1.3, h: 0.25, fontSize: 9.5, color: C.muted, align: "center" }));
      }
      if (!p.contacts.some((c) => /pan-partners\.agency/.test(c))) s.addText("pan-partners.agency", base({ x: M, y: H - 0.9, w: tw, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 2 }));
      break;
    }
    case "diagram": {
      let y = title(ctx, 1.0, p.title, p.titleEm);
      y = lead(ctx, y, p.lead);
      const snap = ctx.snap ? await ctx.snap(ctx.i, ".dg") : null;
      const availH = H - 0.95 - (y + 0.2) - (p.callout ? 1.1 : 0);
      if (snap) {
        const ar = snap.w / snap.h; let w = W - 2 * M, h = w / ar; if (h > availH) { h = availH; w = h * ar; }
        s.addImage({ data: snap.data, x: M + (W - 2 * M - w) / 2, y: y + 0.2, w, h });
        y += 0.2 + h;
      } else {
        y = bulletList(ctx, y, p.labels.filter(Boolean), W - 2 * M);
      }
      callout(ctx, y, p.callout);
      break;
    }
  }
}
