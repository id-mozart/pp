"use client";

import { useCallback, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { toPng } from "html-to-image";

/* =====================================================================
   Instagram-carousel studio — generates 1080×1350 PNGs from the
   Сільпо × Pan&Partners handoff template (v4 «Ember»).
   Three slide types: cover · numbered content · closing.
   ===================================================================== */

const W = 1080;
const H = 1350;
const PREVIEW_SCALE = 0.27;

interface CoverData {
  eyebrow: string;
  title: string;
  sub: string;
  tag: string;
  photo: string;
  pos: string;
}
interface ContentData {
  kicker: string;
  title: string;
  body: string;
  photo: string;
  pos: string;
}
interface ClosingData {
  eyebrow: string;
  title: string;
  quote: string;
  ctaText: string;
  ctaLink: string;
  photo: string;
  pos: string;
}

const DEFAULT_COVER: CoverData = {
  eyebrow: "Бізнес-тренінг",
  title: "Результативні переговори команди *Сільпо-Фуд*",
  sub: "Актуальні інструменти ведення переговорів з орендарями",
  tag: "Бізнес-тренерка **Тетяна Пан**",
  photo: "/brand/Tania5.jpg",
  pos: "74% 48%",
};

const DEFAULT_SLIDES: ContentData[] = [
  {
    kicker: "Початок",
    title: "Альянс *з перших хвилин*",
    body: "Буквально з перших хвилин, коли учасники озвучували свої цілі й очікування, було відчуття, що ми не просто працюємо на тренінгу, а разом створюємо рішення.",
    photo: "/brand/Tania1-2.webp",
    pos: "center 24%",
  },
  {
    kicker: "Єдність",
    title: "Команда, об'єднана *по-справжньому*",
    body: "У кожного свій рівень, свій підхід, свій стиль, але всі дуже чітко розуміють цілі, навіщо вони це роблять і чому хочуть робити це круто.",
    photo: "/brand/Tania1-3.webp",
    pos: "center 30%",
  },
  {
    kicker: "Розвиток",
    title: "Розвиток команди видно *в дії*",
    body: "З кожною рольовою грою, з кожним кейсом було видно, як учасники швидко розуміють, що потрібно змінити, і одразу пробують нові підходи.",
    photo: "/brand/1M6A0522.webp",
    pos: "center 20%",
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

/* ------------------------------ slides ------------------------------ */

function Lockup({ brand }: { brand: string }) {
  return (
    <div className="ig-lockup">
      <span className="ig-sip">{brand}</span>
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
  meta,
}: {
  d: CoverData;
  brand: string;
  meta: string;
}) {
  return (
    <section className="ig-slide ig-cover">
      <div className="ig-cover-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos }} />
      </div>
      <div className="ig-cover-shade" />
      <div className="ig-cover-in">
        <div className="ig-top">
          <Lockup brand={brand} />
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
        <img src={d.photo} alt="" style={{ objectPosition: d.pos }} />
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
  meta,
}: {
  d: ClosingData;
  brand: string;
  meta: string;
}) {
  return (
    <section className="ig-slide ig-closing">
      <div className="ig-photo ig-close-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.photo} alt="" style={{ objectPosition: d.pos }} />
      </div>
      <div className="ig-scrim-bot ig-close-scrim" />
      <div className="ig-close-glow" />
      <div className="ig-close-in">
        <div className="ig-eyebrow">{d.eyebrow}</div>
        <h2 className="ig-close-h2">{rich(d.title)}</h2>
        <p className="ig-close-quote">{rich(d.quote)}</p>
        <div className="ig-top ig-close-foot2">
          <Lockup brand={brand} />
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
  pos,
  onPhoto,
  onPos,
}: {
  photo: string;
  pos: string;
  onPhoto: (dataUrl: string) => void;
  onPos: (v: string) => void;
}) {
  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPhoto(await readFileAsDataURL(f));
  };
  return (
    <div className="flex items-end gap-3">
      <div
        className="h-14 w-14 shrink-0 rounded-lg border border-line/60 bg-cover bg-center"
        style={{ backgroundImage: `url(${photo})` }}
      />
      <div className="min-w-0 flex-1">
        <Field label="Фото">
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="block w-full text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:text-gold"
          />
        </Field>
      </div>
      <div className="w-32">
        <Field label="Позиція">
          <input
            className={inputCls}
            type="text"
            value={pos}
            onChange={(e) => onPos(e.target.value)}
            placeholder="center 24%"
          />
        </Field>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line/50 bg-surface/60 p-5">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-gold">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

/* ------------------------------ studio ------------------------------ */

export function CarouselStudio() {
  const [brand, setBrand] = useState("Сільпо-Фуд");
  const [meta, setMeta] = useState("Київ · 2026");
  const [cover, setCover] = useState<CoverData>(DEFAULT_COVER);
  const [slides, setSlides] = useState<ContentData[]>(DEFAULT_SLIDES);
  const [closing, setClosing] = useState<ClosingData>(DEFAULT_CLOSING);
  const [busy, setBusy] = useState<string | null>(null);

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const total = slides.length + 2;
  const names = [
    "01-cover.png",
    ...slides.map((_, i) => `${String(i + 2).padStart(2, "0")}-slide.png`),
    `${String(total).padStart(2, "0")}-closing.png`,
  ];

  const patchSlide = (i: number, patch: Partial<ContentData>) =>
    setSlides((s) => s.map((sl, k) => (k === i ? { ...sl, ...patch } : sl)));

  const addSlide = () =>
    setSlides((s) => [
      ...s,
      {
        kicker: "Новий слайд",
        title: "Заголовок з *акцентом*",
        body: "Текст слайда…",
        photo: "/brand/ph/p1.jpg",
        pos: "center 30%",
      },
    ]);

  const removeSlide = (i: number) =>
    setSlides((s) => s.filter((_, k) => k !== i));

  const exportOne = useCallback(
    async (idx: number) => {
      const node = refs.current[idx];
      if (!node) return null;
      const dataUrl = await toPng(node, {
        width: W,
        height: H,
        pixelRatio: 1,
        style: { transform: "none" },
      });
      return dataUrl;
    },
    [],
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
  }

  const allSlides: ReactNode[] = [
    <CoverSlide key="cover" d={cover} brand={brand} meta={meta} />,
    ...slides.map((s, i) => (
      <ContentSlide key={`s${i}`} d={s} n={i + 1} brand={brand} meta={meta} />
    )),
    <ClosingSlide key="closing" d={closing} brand={brand} meta={meta} />,
  ];

  return (
    <section className="container-shell pb-24 pt-28">
      <style dangerouslySetInnerHTML={{ __html: SLIDE_CSS }} />

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Адмін · студія</span>
          <h1 className="mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-ink">
            Генератор Instagram-каруселі
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Шаблон 1080×1350 (обкладинка · нумеровані слайди · фінальний).
            Акценти в текстах: <code className="text-gold">*курсив-градієнт*</code>{" "}
            та <code className="text-gold">**жирний-градієнт**</code>.
          </p>
        </div>
        <button
          onClick={handleExportAll}
          disabled={busy !== null}
          className="btn btn-primary disabled:opacity-60"
        >
          {busy ? `Генеруємо ${busy}…` : `Згенерувати всі PNG (${total})`}
        </button>
      </header>

      <div className="grid gap-10 xl:grid-cols-[420px_1fr]">
        {/* ----- editor ----- */}
        <div className="flex flex-col gap-5">
          <Panel title="Загальне">
            <Field label="Бренд клієнта (зліва в лого та шапці)">
              <TextInput value={brand} onChange={setBrand} />
            </Field>
            <Field label="Мітка справа (місто · рік)">
              <TextInput value={meta} onChange={setMeta} />
            </Field>
          </Panel>

          <Panel title="Обкладинка">
            <Field label="Eyebrow">
              <TextInput
                value={cover.eyebrow}
                onChange={(v) => setCover({ ...cover, eyebrow: v })}
              />
            </Field>
            <Field label="Заголовок">
              <TextInput
                rows={2}
                value={cover.title}
                onChange={(v) => setCover({ ...cover, title: v })}
              />
            </Field>
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
            <PhotoInput
              photo={cover.photo}
              pos={cover.pos}
              onPhoto={(p) => setCover({ ...cover, photo: p })}
              onPos={(p) => setCover({ ...cover, pos: p })}
            />
          </Panel>

          {slides.map((s, i) => (
            <Panel key={i} title={`Слайд ${String(i + 1).padStart(2, "0")}`}>
              <Field label="Кікер (після номера)">
                <TextInput
                  value={s.kicker}
                  onChange={(v) => patchSlide(i, { kicker: v })}
                />
              </Field>
              <Field label="Заголовок">
                <TextInput
                  rows={2}
                  value={s.title}
                  onChange={(v) => patchSlide(i, { title: v })}
                />
              </Field>
              <Field label="Текст">
                <TextInput
                  rows={3}
                  value={s.body}
                  onChange={(v) => patchSlide(i, { body: v })}
                />
              </Field>
              <PhotoInput
                photo={s.photo}
                pos={s.pos}
                onPhoto={(p) => patchSlide(i, { photo: p })}
                onPos={(p) => patchSlide(i, { pos: p })}
              />
              <button
                onClick={() => removeSlide(i)}
                className="self-start text-xs text-faint underline-offset-2 hover:text-ember hover:underline"
              >
                Видалити слайд
              </button>
            </Panel>
          ))}

          <button
            onClick={addSlide}
            className="btn btn-ghost self-start !px-5 !py-2.5 text-sm"
          >
            + Додати слайд
          </button>

          <Panel title="Фінальний слайд">
            <Field label="Eyebrow">
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
            <Field label="Цитата">
              <TextInput
                rows={3}
                value={closing.quote}
                onChange={(v) => setClosing({ ...closing, quote: v })}
              />
            </Field>
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
            <PhotoInput
              photo={closing.photo}
              pos={closing.pos}
              onPhoto={(p) => setClosing({ ...closing, photo: p })}
              onPos={(p) => setClosing({ ...closing, pos: p })}
            />
          </Panel>
        </div>

        {/* ----- preview / export nodes ----- */}
        <div>
          <p className="mb-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint">
            Прев&apos;ю · {total} слайдів · 1080×1350
          </p>
          <div className="flex flex-wrap gap-5">
            {allSlides.map((slide, i) => (
              <figure key={i} className="flex flex-col gap-2">
                <div
                  className="overflow-hidden rounded-xl ring-1 ring-line/50"
                  style={{ width: W * PREVIEW_SCALE, height: H * PREVIEW_SCALE }}
                >
                  <div
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    style={{
                      width: W,
                      height: H,
                      transform: `scale(${PREVIEW_SCALE})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {slide}
                  </div>
                </div>
                <figcaption className="flex items-center justify-between">
                  <code className="font-mono text-[0.62rem] text-faint">
                    {names[i]}
                  </code>
                  <button
                    onClick={() => handleExport(i)}
                    disabled={busy !== null}
                    className="rounded-full border border-gold/40 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-gold transition-colors hover:bg-gold/10 disabled:opacity-50"
                  >
                    PNG ↓
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
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
