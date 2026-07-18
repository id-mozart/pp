"use client";

import { useState } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";

/* ─── Дані брендбука (єдине джерело — globals.css / lib/ember.ts) ─── */

const SITE_COLORS = [
  { hex: "#17100B", name: "Canvas", note: "фон сторінки" },
  { hex: "#231A12", name: "Surface", note: "панелі, картки" },
  { hex: "#2E2218", name: "Raised", note: "підняті елементи" },
  { hex: "#564430", name: "Line", note: "лінії, рамки" },
  { hex: "#F5E9D7", name: "Ink", note: "основний текст" },
  { hex: "#B8A386", name: "Muted", note: "другорядний текст" },
  { hex: "#82715A", name: "Faint", note: "підписи, мітки" },
  { hex: "#D8A24A", name: "Gold", note: "акцент, кнопки" },
  { hex: "#E9C486", name: "Gold soft", note: "м'який акцент" },
  { hex: "#C56531", name: "Ember", note: "теплий акцент" },
];

const PRINT_COLORS = [
  { hex: "#FCF8F1", name: "Sheet", note: "кремовий аркуш" },
  { hex: "#F4ECDC", name: "Band", note: "бежеві плашки" },
  { hex: "#2A2018", name: "Ink", note: "текст" },
  { hex: "#C4621F", name: "Accent", note: "акцентні лінії" },
  { hex: "#D2701C", name: "Amber", note: "виділення" },
  { hex: "#C98A2B", name: "Gold", note: "рамки, дрібниці" },
];

const GRADIENTS = [
  {
    name: "Ember",
    css: GRAD_ACC,
    note: "головний акцент: слова-курсиви у заголовках, цифри, «&» у лого",
  },
  {
    name: "Gold",
    css: GRAD_GOLD,
    note: "лінії-роздільники, маркери, дрібні деталі",
  },
];

const FONTS = [
  {
    name: "Spectral",
    varName: "var(--font-spectral)",
    role: "Заголовки й великі написи",
    detail: "вага 500 Medium · трекінг −0.018em · курсив для акцент-слів",
    sampleSize: "2rem",
    sampleWeight: 500,
    sample: "Продажі, що тримаються на системі",
  },
  {
    name: "Inter",
    varName: "var(--font-inter)",
    role: "Основний текст",
    detail: "абзаци, кнопки, форми, інтерфейс · всі ваги (variable)",
    sampleSize: "1.05rem",
    sampleWeight: 400,
    sample:
      "Ми будуємо відділи продажів, які працюють без ручного керування — процеси, люди, метрики.",
  },
  {
    name: "JetBrains Mono",
    varName: "var(--font-jetbrains)",
    role: "Технічні підписи",
    detail: "капс-мітки з розрядкою 0.18–0.22em · цифри у статистиці",
    sampleSize: "0.72rem",
    sampleWeight: 500,
    sample: "ТРЕНІНГИ · КОНСАЛТИНГ · 20 РОКІВ У ПРОДАЖАХ",
    mono: true,
  },
  {
    name: "Playfair Display",
    varName: "var(--font-playfair)",
    role: "Тільки вордмарк",
    detail: "лого «Pan&Partners» · Medium 500 · «&» — курсив із градієнтом Ember",
    sampleSize: "2rem",
    sampleWeight: 500,
    sample: "Pan&Partners",
  },
];

const DOWNLOADS = [
  {
    file: "/brand/pan-partners-brand.zip",
    dl: "pan-partners-brand.zip",
    title: "Бренд-пак",
    desc: "лого + шрифти + пам'ятка",
    size: "3,2 МБ",
    primary: true,
  },
  {
    file: "/brand/logo/pan-partners-logo.zip",
    dl: "pan-partners-logo.zip",
    title: "Лого окремо",
    desc: "SVG у кривих + PNG 4800px",
    size: "0,5 МБ",
  },
  {
    file: "/brand/fonts/pan-partners-fonts.zip",
    dl: "pan-partners-fonts.zip",
    title: "Шрифти окремо",
    desc: "4 родини, ліцензія OFL",
    size: "2,7 МБ",
  },
];

/* ─── Дрібні елементи ─── */

function DownloadIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
    </svg>
  );
}

/** Плашка кольору: клік копіює HEX. */
function Swatch({ hex, name, note }: { hex: string; name: string; note: string }) {
  const [copied, setCopied] = useState(false);
  const light = ["#F5E9D7", "#E9C486", "#FCF8F1", "#F4ECDC"].includes(hex);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(hex)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          })
          .catch(() => {});
      }}
      title={`Скопіювати ${hex}`}
      className="group w-full rounded-[14px] border border-line/60 p-3 text-left transition-colors duration-300 hover:border-gold/50"
      style={{ background: CARD_BG }}
    >
      <span
        className="flex h-16 items-end justify-end rounded-[9px] border border-black/20 p-2"
        style={{ background: hex }}
      >
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.08em] ${
            light ? "bg-black/60 text-white/90" : "bg-white/12 text-white/85"
          }`}
          style={!light ? { background: "rgba(255,255,255,.14)" } : undefined}
        >
          {copied ? "✓ скопійовано" : hex}
        </span>
      </span>
      <span className="mt-2.5 block text-sm text-ink">{name}</span>
      <span className="block text-[0.78rem] leading-snug text-faint">{note}</span>
    </button>
  );
}

/** Смуга градієнта з CSS-рядком, клік копіює. */
function GradientBar({ name, css, note }: { name: string; css: string; note: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(css)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          })
          .catch(() => {});
      }}
      title="Скопіювати CSS"
      className="group w-full rounded-[14px] border border-line/60 p-4 text-left transition-colors duration-300 hover:border-gold/50"
      style={{ background: CARD_BG }}
    >
      <span className="block h-10 rounded-[8px]" style={{ background: css }} />
      <span className="mt-3 flex items-baseline justify-between gap-3">
        <span className="font-display text-lg text-ink">{name}</span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
          {copied ? "✓ скопійовано" : "клік — копіює css"}
        </span>
      </span>
      <span className="mt-1 block text-[0.82rem] leading-snug text-muted">{note}</span>
      <code className="mt-2 block overflow-x-auto whitespace-nowrap font-mono text-[0.62rem] leading-relaxed text-faint">
        {css}
      </code>
    </button>
  );
}

/* ─── Сторінка ─── */

export function BrandBook() {
  return (
    <div className="grain">
      {/* Шапка + завантаження */}
      <section className="relative border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="flex flex-col gap-4">
            <span className="eyebrow">Фірмовий стиль</span>
            <h1 className="max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-ink">
              Бренд{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                Pan&Partners
              </em>
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
              Кольори, шрифти й логотип — усе, що потрібно дизайнеру чи
              підряднику, щоб матеріали виглядали «наші». Плашки нижче
              копіюються кліком.
            </p>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-3">
            {DOWNLOADS.map((d) => (
              <RevealItem key={d.file}>
                <a
                  href={d.file}
                  download={d.dl}
                  className={`group flex h-full flex-col justify-between rounded-[14px] border p-5 transition-colors duration-300 ${
                    d.primary
                      ? "border-gold/50 hover:border-gold"
                      : "border-line/70 hover:border-gold/50"
                  }`}
                  style={{ background: CARD_BG }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-lg text-ink">{d.title}</span>
                      <DownloadIcon className="h-4 w-4 text-faint transition-colors group-hover:text-gold" />
                    </div>
                    <p className="mt-1 text-sm leading-snug text-muted">{d.desc}</p>
                  </div>
                  <span className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                    zip · {d.size}
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Логотип */}
      <section className="relative border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="flex items-center gap-4">
            <span className="h-[2px] w-16 rounded-full" style={{ background: GRAD_GOLD }} />
            <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
              Логотип
            </span>
          </Reveal>
          <RevealGroup className="mt-7 grid gap-3 sm:grid-cols-2">
            <RevealItem>
              <figure className="rounded-[14px] border border-line/60 p-2" style={{ background: CARD_BG }}>
                <span className="flex h-40 items-center justify-center rounded-[9px] bg-[#17100B] px-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/logo/pan-partners-light.svg" alt="Pan&Partners — світлий вордмарк" className="h-9 w-auto" />
                </span>
                <figcaption className="px-3 py-2.5 text-[0.82rem] text-muted">
                  <span className="text-ink">Light</span> — кремовий текст, для темного фону
                </figcaption>
              </figure>
            </RevealItem>
            <RevealItem>
              <figure className="rounded-[14px] border border-line/60 p-2" style={{ background: CARD_BG }}>
                <span className="flex h-40 items-center justify-center rounded-[9px] bg-[#FCF8F1] px-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/logo/pan-partners-dark.svg" alt="Pan&Partners — темний вордмарк" className="h-9 w-auto" />
                </span>
                <figcaption className="px-3 py-2.5 text-[0.82rem] text-muted">
                  <span className="text-ink">Dark</span> — темний текст, для світлого фону
                </figcaption>
              </figure>
            </RevealItem>
          </RevealGroup>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-2xl text-[0.92rem] leading-relaxed text-muted">
              Вордмарк — Playfair Display Medium у кривих; «&» завжди курсивом
              із градієнтом Ember. Не перефарбовуйте, не розтягуйте й не
              набирайте лого текстом — беріть готові файли з архіву.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Кольори сайту */}
      <section className="relative border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="flex items-center gap-4">
            <span className="h-[2px] w-16 rounded-full" style={{ background: GRAD_GOLD }} />
            <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
              Кольори · сайт
            </span>
          </Reveal>
          <RevealGroup className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {SITE_COLORS.map((c) => (
              <RevealItem key={c.hex}>
                <Swatch {...c} />
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-2">
            {GRADIENTS.map((g) => (
              <RevealItem key={g.name}>
                <GradientBar {...g} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Кольори друку */}
      <section className="relative border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="flex items-center gap-4">
            <span className="h-[2px] w-16 rounded-full" style={{ background: GRAD_GOLD }} />
            <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
              Кольори · друк (профайл, PDF)
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-muted">
              Друковані матеріали (профайл тренера) живуть на кремовому аркуші —
              тепла світла палітра з тими самими янтарними акцентами.
            </p>
          </Reveal>
          <RevealGroup className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PRINT_COLORS.map((c) => (
              <RevealItem key={c.hex}>
                <Swatch {...c} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Типографіка */}
      <section className="relative border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="flex items-center gap-4">
            <span className="h-[2px] w-16 rounded-full" style={{ background: GRAD_GOLD }} />
            <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
              Типографіка
            </span>
          </Reveal>
          <RevealGroup className="mt-7 grid gap-3 lg:grid-cols-2">
            {FONTS.map((f) => (
              <RevealItem key={f.name}>
                <div
                  className="flex h-full flex-col rounded-[14px] border border-line/60 p-6"
                  style={{ background: CARD_BG }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-display text-xl text-ink">{f.name}</span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={gradText(GRAD_ACC)}>
                      {f.role}
                    </span>
                  </div>
                  <p
                    className={`mt-5 text-pretty leading-snug text-ink ${f.mono ? "tracking-[0.2em] text-muted" : ""}`}
                    style={{
                      fontFamily: f.varName,
                      fontSize: f.sampleSize,
                      fontWeight: f.sampleWeight,
                      ...(f.name === "Spectral" ? { letterSpacing: "-0.018em" } : {}),
                    }}
                  >
                    {f.name === "Playfair Display" ? (
                      <>
                        Pan
                        <em className="italic" style={gradText(GRAD_ACC)}>
                          &
                        </em>
                        Partners
                      </>
                    ) : (
                      f.sample
                    )}
                  </p>
                  <p className="mt-auto pt-4 text-[0.82rem] leading-snug text-faint">{f.detail}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-2xl text-[0.92rem] leading-relaxed text-muted">
              Всі шрифти — Google Fonts, ліцензія OFL: вільно для друку, вебу й
              презентацій. В архіві — TTF з підтримкою кирилиці.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
