"use client";

import { testimonials, credibility, cases, about } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Play } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import type { Testimonial } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export function Testimonials({
  stats,
}: {
  /** Override the 3 credibility marks with custom stat tiles (proof-band style). */
  stats?: { v: string; l: string }[];
} = {}) {
  return (
    <section
      id="cases"
      className="relative grain overflow-hidden border-y border-line/50 bg-surface section-pad"
    >
      <div className="container-shell relative">
        {/* Header */}
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <span className="eyebrow">{testimonials.eyebrow}</span>
          <h2 className="text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.05] text-ink">
            Що кажуть клієнти{" "}
            <em className="italic" style={gradText(GRAD_ACC)}>
              після спільної роботи
            </em>
          </h2>
          <p className="max-w-2xl font-display text-lg italic leading-relaxed text-muted">
            {testimonials.intro}
          </p>
        </Reveal>

        {/* Credibility marks */}
        {stats ? (
          <Reveal delay={0.05}>
            <div
              className="relative mt-12 grid grid-cols-2 divide-x divide-line/40 rounded-[14px] border border-line/60 lg:grid-cols-4"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <span
                aria-hidden
                className="absolute left-8 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              {stats.map((s) => (
                <div key={s.l} className="h-full p-6 text-center">
                  <div className="stat-number text-3xl sm:text-4xl">{s.v}</div>
                  <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] leading-snug text-muted">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.05}>
            <div
              className="relative mx-auto mt-12 grid max-w-4xl grid-cols-1 divide-y divide-line/40 rounded-[14px] border border-line/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <span
                aria-hidden
                className="absolute left-8 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              {credibility.marks.map((m) => (
                <div key={m.label} className="p-6 text-center">
                  <div className="stat-number text-4xl sm:text-5xl">{m.value}</div>
                  <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] leading-snug text-muted">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Manifesto pull-quote */}
        <Reveal delay={0.1}>
          <figure className="mx-auto mt-16 max-w-3xl text-center">
            <span
              aria-hidden
              className="mx-auto block h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <blockquote className="mt-6 text-pretty font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-snug text-ink">
              Без тиску. Без маніпуляцій.{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                Природно та легко.
              </em>
            </blockquote>
            <figcaption className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
              — {about.name} · Pan&amp;Partners
            </figcaption>
          </figure>
        </Reveal>

        {/* Testimonial wall (masonry) */}
        <div className="mt-14 [column-gap:1.5rem] sm:columns-2 lg:columns-3">
          {testimonials.videos.map((t) => (
            <VideoCard key={t.name} t={t} />
          ))}
          {testimonials.items.map((t) => (
            <TextCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/12 font-display text-sm text-gold ring-1 ring-gold/20">
      {initials(name)}
    </span>
  );
}

function Meta({ t }: { t: Testimonial }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-ink">{t.name}</p>
      <p className="text-xs leading-snug text-muted">{t.role}</p>
      {t.date && <p className="mt-0.5 text-[0.7rem] text-faint">{t.date}</p>}
    </div>
  );
}

function TextCard({ t }: { t: Testimonial }) {
  return (
    <figure
      className="mb-6 break-inside-avoid rounded-[14px] border border-line/60 p-6"
      style={{
        background: CARD_BG,
        borderLeft: "3px solid #E2A638",
        boxShadow: "0 18px 44px rgba(0,0,0,.4)",
      }}
    >
      <span
        aria-hidden
        className="block font-display text-5xl leading-[0.55] text-gold/40"
      >
        “
      </span>
      <blockquote className="mt-4 text-pretty font-display text-xl italic leading-snug text-ink">
        {t.quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line/50 pt-4">
        <Avatar name={t.name} />
        <Meta t={t} />
      </figcaption>
    </figure>
  );
}

function VideoCard({ t }: { t: Testimonial }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${t.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group mb-6 block break-inside-avoid overflow-hidden rounded-[14px] border border-line/60 transition-all duration-500 ease-lux hover:-translate-y-1 hover:border-gold/40"
      style={{ background: CARD_BG, boxShadow: "0 18px 44px rgba(0,0,0,.4)" }}
    >
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
        />
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg,rgba(11,7,4,.78) 0%,rgba(12,8,5,.18) 55%,rgba(13,9,5,.35) 100%)",
          }}
        />
        <span
          className="relative grid h-16 w-16 place-items-center rounded-full text-oncontrast shadow-[0_14px_30px_-12px_rgb(var(--c-gold)/0.7)] transition-transform duration-500 ease-lux group-hover:scale-110"
          style={{ background: GRAD_GOLD }}
        >
          <Play className="h-6 w-6 translate-x-0.5" />
        </span>
        <span
          className="absolute bottom-3 right-4 font-display text-sm italic"
          style={gradText(GRAD_ACC)}
        >
          дивитися відгук →
        </span>
      </div>
      <figcaption className="flex items-center gap-3 p-5">
        <Avatar name={t.name} />
        <Meta t={t} />
      </figcaption>
    </a>
  );
}
