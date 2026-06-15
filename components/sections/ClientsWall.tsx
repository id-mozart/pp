"use client";

import { clients } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";

/**
 * Clients in the «Ember» slide language: a dark stat plate with the gold top
 * bar and the 90% retention line as a signed serif statement. The wall below
 * is either serif wordmarks (default) or the monochrome logo-tile grid
 * (logoWall — placeholders from /brand/logos until real files arrive).
 */
export function ClientsWall({
  logoWall = false,
  lean = false,
  subtitle,
}: { logoWall?: boolean; lean?: boolean; subtitle?: string } = {}) {
  return (
    <section className="relative grain section-pad" id="clients">
      <div className="container-shell">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <span className="eyebrow">{clients.eyebrow}</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Наші{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                клієнти
              </em>
            </h2>
            <p className="mt-4 max-w-md font-display text-lg italic leading-relaxed text-muted xl:max-w-none xl:whitespace-nowrap">
              {subtitle ?? clients.subtitle}
            </p>
            {!lean && (
              <div className="mt-8 max-w-md">
                <span
                  aria-hidden
                  className="block h-[2px] w-16 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <p className="mt-4 font-display text-xl italic leading-snug text-ink">
                  <b className="stat-number align-baseline text-3xl not-italic">
                    90%
                  </b>{" "}
                  клієнтів продовжують співпрацю з нами та рекомендують нас
                  своїм партнерам.
                </p>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6">
            <div
              className="relative grid grid-cols-3 divide-x divide-line/40 rounded-[14px] border border-line/70"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <span
                aria-hidden
                className="absolute left-6 top-0 h-[3px] w-20 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              {clients.stats.map((s) => (
                <div key={s.label} className="p-6 text-center">
                  <div className="stat-number text-4xl sm:text-5xl">{s.value}</div>
                  <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] leading-snug text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {logoWall ? (
          /* Logo wall — монохромна плитка логотипів (плейсхолдери до заміни) */
          <RevealGroup className="mt-16 grid grid-cols-3 items-center gap-x-8 gap-y-12 sm:grid-cols-4 lg:grid-cols-5">
            {clients.logoTiles.map((logo) => (
              <RevealItem key={logo.name}>
                <div className="flex items-center justify-center" title={logo.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="logo-wall-img"
                    loading="lazy"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          /* Wordmark wall — реальні імена з джерела, серифом */
          <RevealGroup className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {clients.named.map((n) => (
              <RevealItem key={n}>
                <div className="flex items-center justify-center py-2 font-display text-xl tracking-wide text-muted/80 transition-colors duration-500 hover:text-ink">
                  {n}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        )}

        <Reveal className="mx-auto mt-14 max-w-2xl text-center">
          <span
            aria-hidden
            className="mx-auto mb-5 block h-[2px] w-16 rounded-full"
            style={{ background: GRAD_GOLD }}
          />
          <p className="text-pretty font-display text-base italic leading-relaxed text-muted">
            {clients.caption}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
