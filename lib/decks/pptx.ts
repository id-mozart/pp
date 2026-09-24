/**
 * Експорт деки у PPTX (клієнт): кожна сторінка — нативний слайд A4 landscape
 * з редагованим текстом, фігурами, таблицями й картинками у фірмових кольорах.
 * Схеми (тип diagram) PowerPoint нативно не відтворить — їх знімаємо з екрана як PNG.
 */
import type { Deck, DeckPage } from "./types";

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
      const cv = document.createElement("canvas"); cv.width = 800; cv.height = 800; cv.getContext("2d")!.drawImage(im, 0, 0, 800, 800);
      return { data: cv.toDataURL("image/png"), w: 800, h: 800 };
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

function txt(s: string) { return (s ?? "").replace(/ /g, " ").replace(/‑/g, "-"); }

export async function exportDeckPptx(deck: Deck, opts: { snap?: Snap; scale?: (pageIndex: number) => number | undefined; onProgress?: (i: number, n: number) => void } = {}) {
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
    const ctx: Ctx = { pptx, s, deck, i, total, k: kp, kh, snap: opts.snap };
    chrome(ctx, p);
    await page(ctx, p);
  }
  const safe = deck.name.replace(/[\\/:*?"<>|]+/g, " ").trim() || "deck";
  await pptx.writeFile({ fileName: `${safe}.pptx` });
}

type Ctx = { pptx: Pptx; s: Slide; deck: Deck; i: number; total: number; k: number; kh: number; snap?: Snap };

// без автопідбору кегля: розміри вже підібрані сайтом; рамки рахуємо із запасом, щоб Keynote/PowerPoint не зменшували текст
const base = (o: TextProps = {}): TextProps => ({ fontFace: SANS, color: C.ink, margin: 0, valign: "top", fit: "none", ...o });

/** Колонтитули: логотип + рядок деки зверху / знизу, номер сторінки. */
function chrome({ s, deck, i, total }: Ctx, p: DeckPage) {
  const isCover = p.type === "cover", isSection = p.type === "section", isClosing = p.type === "closing";
  const ampCover = isCover && (p.variant === "amp" || p.variant === "photo");
  // логотип
  s.addText([{ text: "Pan", options: { color: C.ink } }, { text: "&", options: { color: C.amber } }, { text: "Partners", options: { color: C.ink } }],
    base({ x: M, y: 0.42, w: 3.2, h: 0.4, fontFace: SERIF, fontSize: ampCover ? 22 : 13.5, bold: false, valign: "middle" }));
  if (!ampCover && !deck.footRunhead && !isCover) s.addText(txt(deck.runhead).toUpperCase(), base({ x: W - M - 6, y: 0.42, w: 6, h: 0.4, fontFace: MONO, fontSize: 7.5, color: C.faint, align: "right", valign: "middle", charSpacing: 2 }));
  if (!ampCover) s.addShape("line", { x: M + (isCover ? 0 : 1.65), y: 0.62, w: W - 2 * M - (isCover ? 0 : 1.65) - (!deck.footRunhead && !isCover ? 6.1 : 0), h: 0, line: { color: C.line, width: 0.5 } });
  if (isCover || isSection || isClosing) return;
  // нижній колонтитул
  s.addShape("line", { x: M, y: H - 0.62, w: W - 2 * M, h: 0, line: { color: C.line, width: 0.5 } });
  const foot = deck.footRunhead ? txt(deck.runhead).toUpperCase() : "Тетяна Пан · Pan&Partners · pan-partners.agency";
  s.addText(foot, base({ x: M, y: H - 0.56, w: 7, h: 0.3, fontFace: deck.footRunhead ? MONO : SERIF, italic: !deck.footRunhead, fontSize: deck.footRunhead ? 7.5 : 9, color: deck.footRunhead ? C.faint : C.muted, charSpacing: deck.footRunhead ? 2 : 0, valign: "middle" }));
  const num = deck.footRunhead ? String(i + 1).padStart(2, "0") : `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  s.addText(num, base({ x: W - M - 2, y: H - 0.56, w: 2, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, align: "right", valign: "middle", charSpacing: 2 }));
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
  const fs = 13 * Math.min(ctx.k, 1.15);
  const lines = Math.max(1, Math.ceil((text.length * fs * 0.57) / (wIn * 72)));
  const h = (lines * fs * 1.45) / 72 + 0.1;
  ctx.s.addText(txt(text), base({ x: M, y: y + 0.12, w: wIn, h, fontFace: SERIF, fontSize: fs, color: C.ink }));
  return y + 0.12 + h;
}

function callout(ctx: Ctx, y: number, text: string, wIn = W - 2 * M) {
  if (!text) return y;
  const fs = 13 * ctx.k;
  const lines = Math.max(1, Math.ceil((text.length * fs * 0.57) / ((wIn - 0.5) * 72)));
  const h = (lines * fs * 1.45) / 72 + 0.3;
  ctx.s.addShape("rect", { x: M, y: y + 0.2, w: wIn, h, fill: { color: C.band }, line: { color: C.band } });
  ctx.s.addShape("rect", { x: M, y: y + 0.2, w: 0.05, h, fill: { color: C.amber }, line: { color: C.amber } });
  ctx.s.addText(txt(text), base({ x: M + 0.25, y: y + 0.2, w: wIn - 0.4, h, fontFace: SERIF, italic: true, fontSize: fs, valign: "middle" }));
  return y + 0.2 + h;
}

async function picture(ctx: Ctx, src: string | undefined, x: number, y: number, w: number, h: number, mode: "cover" | "contain" = "cover", circle = false, knockWhite = false) {
  if (!src) return;
  const im = await imgInfo(src, knockWhite); if (!im) return;
  ctx.s.addImage({ data: im.data, x, y, w, h, sizing: { type: mode, w, h }, rounding: circle });
}

/** Ілюстрація праворуч для text/bullets/steps/twocol: повертає ширину текстової колонки. */
async function sideImage(ctx: Ctx, image: string | undefined) {
  if (!image) return W - 2 * M;
  const iw = 4.6, gap = 0.5;
  await picture(ctx, image, W - M - iw, 0.95, iw, H - 0.95 - 0.85);
  return W - 2 * M - iw - gap;
}

function bulletList(ctx: Ctx, y: number, items: string[], wIn: number, size = 12.5) {
  const fs = size * ctx.k;
  const est = items.reduce((a, t) => a + Math.max(1, Math.ceil((t.length * fs * 0.57) / ((wIn - 0.3) * 72))), 0);
  const h = Math.min(H - 0.9 - y, (est * fs * 1.5) / 72 + items.length * 0.08 + 0.1);
  // пронумеровані пункти («1. …») — без маркера, як на сайті
  ctx.s.addText(items.map((t) => ({ text: txt(t), options: { ...(/^\s*\d+[.)]\s/.test(t) ? { bullet: false as const } : { bullet: { indent: 14, code: "25CF" } }), color: C.ink, breakLine: true, paraSpaceAfter: 5 } })),
    base({ x: M, y: y + 0.15, w: wIn, h, fontSize: fs }));
  return y + 0.15 + h;
}

async function page(ctx: Ctx, p: DeckPage) {
  const { s, deck } = ctx;
  switch (p.type) {
    case "cover": {
      const amp = p.variant === "amp" || p.variant === "photo";
      const colW = amp ? (p.variant === "photo" ? W - 2 * M - 4.6 : 6.4) : 5.2; // ліва колонка як на сайті (амперсанд: половина; звичайний: 1fr | 118mm)
      if (p.variant === "amp") s.addText("&", base({ x: W - 6.2, y: H - 6.4, w: 6.5, h: 6.5, fontFace: SERIF, fontSize: 400, color: C.amber, transparency: 86, align: "right", valign: "bottom" }));
      if (p.variant === "photo" && p.image) await picture(ctx, p.image, W - M - 4.25, 1.2, 4.25, H - 2.5);
      if (deck.logo && amp) { // логотип клієнта одразу після нашого, через «×», як на сайті
        s.addText("×", base({ x: M + 2.2, y: 0.42, w: 0.4, h: 0.4, fontFace: SERIF, fontSize: 16, color: C.faint, align: "center", valign: "middle" }));
        await picture(ctx, deck.logo, M + 2.65, 0.32, 1.9, 0.6, "contain");
      }
      if (p.eyebrow) s.addText(txt(p.eyebrow).toUpperCase(), base({ x: amp ? W - M - 4 : M, y: amp ? 0.42 : 1.5, w: amp ? 4 : colW, h: 0.35, fontFace: MONO, fontSize: amp ? 10 : 8.5, color: C.acc, charSpacing: 4, align: amp ? "right" : "left", valign: "middle" }));
      const ty = amp ? 2.4 : 2.0;
      const fs = (amp ? 44 : 46) * ctx.k;
      s.addText([{ text: txt(p.title), options: { color: C.ink } }, ...(p.titleEm ? [{ text: txt(p.titleEm), options: { color: C.amber, italic: true, fontSize: fs * 0.64, breakLine: false } }] : [])].map((r, j) => j === 1 ? { ...r, text: "\n" + r.text } : r),
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
      s.addText("ТРЕНЕРКА", base({ x: M, y: 0.9, w: 3, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 3 }));
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
      s.addText("МОЯ СПЕЦІАЛІЗАЦІЯ", base({ x: M, y: by, w: 4, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 3 }));
      bulletList(ctx, by + 0.2, p.facts, 6.4, 10.5);
      if (p.note) s.addText(txt(p.note), base({ x: M + 6.9, y: by, w: W - 2 * M - 6.9, h: 1.1, fontSize: 9.5 * ctx.k, color: C.muted }));
      if (p.logos) await picture(ctx, p.logos, M + 6.9, by + 1.2, W - 2 * M - 6.9, 0.9, "contain", false, /\.png(\?|$)/i.test(p.logos));
      break;
    }
    case "section": {
      s.background = { color: C.band }; // на сайті розділ — на плашці
      const hasImg = !!p.image, top = p.fit === "top";
      if (hasImg) await picture(ctx, p.image, top ? 0 : W - 4.5, 0, top ? W : 4.5, top ? 3.6 : H);
      const tw = hasImg && !top ? W - 2 * M - 4.7 : W - 2 * M;
      // композиція як на сайті: цифра ліворуч, праворуч надрядок «РОЗДІЛ» з рискою, заголовок і підзаголовок; блок по центру вільної площі
      const numW = p.num ? 0.85 * String(p.num).length + 0.6 : 0, tx = M + numW + (numW ? 0.35 : 0), tcw = tw - numW - (numW ? 0.35 : 0);
      const tfs = 30 * ctx.kh, tLines = Math.max(1, Math.ceil((p.title.length * tfs * 0.57) / (tcw * 72))), tH = (tLines * tfs * 1.08) / 72 + 0.1;
      const subH = p.sub ? 0.45 : 0, blockH = 0.4 + tH + (subH ? subH + 0.08 : 0);
      const areaY = top ? 3.6 : 0.8, areaH = H - 0.6 - areaY, by = areaY + (areaH - blockH) / 2 - (top ? 0.1 : 0.4);
      if (p.num) s.addText(txt(p.num), base({ x: M - 0.1, y: by + blockH - 2.05, w: numW + 0.3, h: 2.1, fontFace: SERIF, italic: true, fontSize: 130, color: C.amber, valign: "bottom" }));
      s.addText("РОЗДІЛ", base({ x: tx, y: by, w: 0.9, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 3, valign: "middle" }));
      s.addShape("line", { x: tx + 0.85, y: by + 0.15, w: 2.2, h: 0, line: { color: C.amber, width: 0.5 } });
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
        s.addText(p.paras.map((t) => ({ text: txt(t), options: { breakLine: true, paraSpaceAfter: 8 } })), base({ x: M, y: y + 0.15, w: wIn, h, fontSize: fs }));
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
          s.addText(txt(body), base({ x: cx + pad, y: cy + pad + nfs / 72 + 0.1, w: cw - 2 * pad, h: ch - (pad + nfs / 72 + 0.1) - pad * 0.6, fontSize: fs }));
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
        y = bulletList(ctx, y, items, wIn);
      }
      callout(ctx, y, p.callout, wIn);
      break;
    }
    case "twocol": {
      const wIn = await sideImage(ctx, p.image);
      let y = title(ctx, 1.0, p.title, p.titleEm, wIn);
      y = lead(ctx, y, p.lead, wIn);
      // колонки-картки на плашці з помаранчевою рискою зверху, однакової висоти (за найдовшою), як на сайті
      const n = Math.max(1, p.cols.length), gap = n >= 4 ? 0.2 : 0.39, cw = (wIn - gap * (n - 1)) / n, pad = n >= 4 ? 0.18 : 0.24;
      const fs = 12.2 * ctx.k, hfs = 13.5 * ctx.k, availH = H - 0.95 - (y + 0.25);
      const hOf = (c: { head: string; items: string[] }) => {
        const hl = Math.max(1, Math.ceil((c.head.length * hfs * 0.6) / ((cw - 2 * pad) * 72)));
        const il = c.items.reduce((a, t) => a + Math.max(1, Math.ceil((t.length * fs * 0.57) / ((cw - 2 * pad - 0.25) * 72))), 0);
        return { hh: (hl * hfs * 1.3) / 72 + 0.08, total: pad + (hl * hfs * 1.3) / 72 + 0.2 + (il * fs * 1.5) / 72 + c.items.length * 0.06 + pad };
      };
      const hs = p.cols.map(hOf), ch = Math.min(availH, Math.max(...hs.map((h) => h.total)));
      p.cols.forEach((c, j) => {
        const cx = M + j * (cw + gap), hh = hs[j].hh;
        s.addShape("rect", { x: cx, y: y + 0.25, w: cw, h: ch, fill: { color: C.band }, line: { color: C.band } });
        s.addShape("rect", { x: cx, y: y + 0.25, w: cw, h: 0.035, fill: { color: C.amber }, line: { color: C.amber } });
        s.addText(txt(c.head), base({ x: cx + pad, y: y + 0.25 + pad, w: cw - 2 * pad, h: hh, fontFace: SERIF, italic: true, fontSize: hfs, color: C.acc }));
        s.addText(c.items.map((t) => ({ text: txt(t), options: { bullet: { indent: 12, code: "25CF" }, breakLine: true, paraSpaceAfter: 4 } })), base({ x: cx + pad, y: y + 0.25 + pad + hh + 0.12, w: cw - 2 * pad, h: ch - pad - hh - 0.12 - pad * 0.6, fontSize: fs }));
      });
      break;
    }
    case "steps": {
      const wIn = await sideImage(ctx, p.image);
      let y = title(ctx, 1.0, p.title, p.titleEm, wIn);
      y = lead(ctx, y, p.lead, wIn);
      // рядки за вмістом (не розтягуємо на сторінку), колонка заголовка 60 мм, кільце-маркер і суцільна лінія, як на сайті
      const kk = Math.min(ctx.k, 1.18), fh = 13.5 * kk, ft = 12.2 * kk;
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
        s.addText(txt(st.text), base({ x: M + lw + 0.24, y: sy, w: tw, h: rh - 0.08, fontSize: ft }));
        sy += rh;
      });
      break;
    }
    case "table": {
      let y = title(ctx, 1.0, p.title, p.titleEm);
      y = lead(ctx, y, p.lead);
      const cols = Math.max(p.head.length, ...p.rows.map((r) => r.length), 1);
      const fs = 10.5 * ctx.k;
      const availH = H - 0.95 - (y + 0.2) - (p.callout ? 1.1 : 0);
      const rowH = Math.min(0.85, availH / (p.rows.length + 1));
      // стиль як на сайті: без заливок, тонкі лінії між рядками, шапка моноширинним капітелем, перша колонка курсивом акцентного кольору
      const numeric = p.rows.length > 0 && p.rows.every((r) => /^\s*\d+[.)]?\s*$/.test(r[0] ?? ""));
      const none = { type: "none" as const }, bLine = (c: string, pt: number) => [none, none, { type: "solid" as const, color: c, pt }, none];
      const rows = [
        p.head.map((h) => ({ text: txt(h).toUpperCase(), options: { color: C.faint, fontFace: MONO, fontSize: 7.5, charSpacing: 1.5, valign: "bottom" as const, border: bLine(C.ink, 0.75) } })),
        ...p.rows.map((r) => Array.from({ length: cols }, (_, ci) => ({ text: txt(r[ci] ?? ""), options: { fontSize: ci === 0 ? 11 * ctx.k : fs, ...(ci === 0 ? { fontFace: SERIF, italic: true, color: C.acc } : {}), border: bLine(C.line, 0.5) } }))),
      ];
      const firstW = cols > 1 ? (numeric ? 0.5 : (W - 2 * M) * 0.17) : W - 2 * M;
      const colW = Array.from({ length: cols }, (_, ci) => (ci === 0 ? firstW : (W - 2 * M - firstW) / (cols - 1)));
      s.addTable(rows as any, { x: M, y: y + 0.2, w: W - 2 * M, colW, rowH, fontFace: SANS, color: C.ink, valign: "top", margin: [0.09, 0.12, 0.09, 0.04] });
      callout(ctx, y + 0.2 + rowH * (p.rows.length + 1), p.callout);
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
      if (p.sub) s.addText(txt(p.sub), base({ x: M, y: 3.8, w: tw, h: 0.45, fontFace: MONO, fontSize: 9, color: C.faint, charSpacing: 2 }));
      const cy = p.sub ? 4.3 : 3.5;
      s.addText(p.contacts.map((c) => ({ text: txt(c), options: { breakLine: true, paraSpaceAfter: 8 } })), base({ x: M, y: cy, w: tw - 1.8, h: 2.2, fontFace: MONO, fontSize: 11 * ctx.k, color: C.acc, charSpacing: 1 }));
      if (p.qr) await picture(ctx, p.qr, M + tw - 1.5, cy, 1.5, 1.5, "contain");
      s.addText("pan-partners.agency", base({ x: M, y: H - 0.9, w: tw, h: 0.3, fontFace: MONO, fontSize: 8, color: C.faint, charSpacing: 2 }));
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
