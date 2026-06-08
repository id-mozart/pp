"use client";

import { system, consultation } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export function System() {
  const gains = consultation.what.youWillGet;
  return (
    <section
      id="system"
      className="relative grain overflow-hidden border-y border-line/50 bg-surface section-pad"
    >
      <div className="container-shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Statement + phases */}
          <div className="lg:col-span-7">
            <Reveal className="flex flex-col gap-5">
              <span className="eyebrow">{system.eyebrow}</span>
              <h2 className="text-[clamp(2rem,4vw,3.3rem)] leading-[1.05] text-ink">
                Продажі — це{" "}
                <span className="text-gradient-gold">система</span>, а не
                везіння
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                {system.intro}
              </p>
            </Reveal>

            <RevealGroup className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {system.phases.map((p) => (
                <RevealItem key={p.n}>
                  <div className="flex gap-4 border-t border-line/50 pt-4">
                    <span className="font-mono text-sm text-gold">{p.n}</span>
                    <div>
                      <p className="text-lg text-ink">{p.t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{p.d}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* Portrait */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[28px] border border-gold/20 shadow-[var(--shadow-lux)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={system.portrait}
                alt="Тетяна Пан"
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/40 to-transparent" />
            </div>
          </Reveal>
        </div>

        {/* Gains gallery */}
        <p className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-faint">
          {system.gainsTitle}
        </p>
        <RevealGroup className="mt-5 grid gap-6 md:grid-cols-3">
          {gains.map((g) => (
            <RevealItem key={g.title}>
              <div className="group h-full overflow-hidden surface transition-all duration-500 ease-lux hover:border-gold/40">
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.image}
                    alt={g.title}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas/55 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-ink">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{g.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
