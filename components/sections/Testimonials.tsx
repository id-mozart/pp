"use client";

import { testimonials, credibility, cases, about } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Quote, Play, Star, ArrowUpRight } from "@/components/ui/icons";
import type { Testimonial } from "@/lib/content";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export function Testimonials() {
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
            {testimonials.title}
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            {testimonials.intro}
          </p>
        </Reveal>

        {/* Credibility marks */}
        <Reveal delay={0.05}>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/40 sm:grid-cols-3">
            {credibility.marks.map((m) => (
              <div key={m.label} className="bg-surface p-6 text-center">
                <div className="stat-number text-4xl sm:text-5xl">{m.value}</div>
                <div className="mt-2 text-xs leading-snug text-muted">{m.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Manifesto pull-quote */}
        <Reveal delay={0.1}>
          <figure className="mx-auto mt-16 max-w-3xl text-center">
            <Quote className="mx-auto h-9 w-9 text-gold/30" />
            <blockquote className="mt-4 text-pretty font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-snug text-gradient-gold">
              {cases.pullquote}
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted">
              — {about.name}, власниця Pan&amp;Partners
            </figcaption>
          </figure>
        </Reveal>

        {/* Testimonial wall (masonry) */}
        <div className="mt-14 [column-gap:1.5rem] sm:columns-2 lg:columns-3">
          {testimonials.videos.map((t) => (
            <VideoCard key={t.name} t={t} label={testimonials.videoLabel} />
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
    <figure className="mb-6 break-inside-avoid surface p-6">
      <div className="flex gap-0.5 text-gold" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5" />
        ))}
      </div>
      <blockquote className="mt-4 text-pretty text-lg leading-snug text-ink">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line/50 pt-4">
        <Avatar name={t.name} />
        <Meta t={t} />
      </figcaption>
    </figure>
  );
}

function VideoCard({ t, label }: { t: Testimonial; label: string }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${t.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group mb-6 block break-inside-avoid overflow-hidden surface transition-all duration-500 ease-lux hover:-translate-y-1 hover:border-gold/40"
    >
      <div className="relative grid aspect-[16/10] place-items-center bg-gradient-to-br from-raised to-surface">
        <span className="absolute inset-0 grain opacity-50" />
        <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gold text-oncontrast shadow-[0_14px_30px_-12px_rgb(var(--c-gold)/0.7)] transition-transform duration-500 ease-lux group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5" />
        </span>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-xs text-gold">
          {label} <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <figcaption className="flex items-center gap-3 p-5">
        <Avatar name={t.name} />
        <Meta t={t} />
      </figcaption>
    </a>
  );
}
