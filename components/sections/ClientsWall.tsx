"use client";

import { clients } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Clients shown as a GRID of individual logo tiles (a "logo wall") to convey
 * scale — not a marquee. Logos are placeholders in /public/brand/logos; swap
 * the files for real logos later (keep the same paths).
 */
export function ClientsWall() {
  return (
    <section className="section-pad" id="clients">
      <div className="container-shell">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <span className="eyebrow">{clients.eyebrow}</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              {clients.title}
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted">{clients.subtitle}</p>
            <p className="mt-6 max-w-md text-pretty text-xl leading-snug text-ink">
              <span className="text-gradient-gold font-display">90%</span> клієнтів
              продовжують співпрацю з нами та рекомендують нас своїм партнерам.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/40">
              {clients.stats.map((s) => (
                <div key={s.label} className="bg-surface p-6 text-center">
                  <div className="stat-number text-4xl sm:text-5xl">{s.value}</div>
                  <div className="mt-2 text-xs leading-snug text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Logo grid — one tile per client */}
        <Reveal className="mt-14">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {clients.logoTiles.map((logo) => (
              <div
                key={logo.name}
                className="flex min-h-[7rem] items-center justify-center rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-black/5 transition-transform duration-500 hover:-translate-y-1 sm:min-h-[8rem]"
                title={logo.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-8 w-auto max-w-[82%] object-contain sm:h-10"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-pretty text-sm italic leading-relaxed text-muted">
            {clients.caption}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
