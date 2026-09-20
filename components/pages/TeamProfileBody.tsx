"use client";

import Link from "next/link";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight, Download } from "@/components/ui/icons";
import { CARD_BG, CTAG_BG, GRAD_ACC, GRAD_GOLD, gradText } from "@/lib/ember";
import type { TeamProfile } from "@/lib/teamProfiles";

/** Сторінка профайлу тренера: той самий вміст, що й у PDF, плюс кнопка завантаження. */
export function TeamProfileBody({ p }: { p: TeamProfile }) {
  return (
    <>
      <section className="relative grain overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="container-shell">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <Link href="/team" className="eyebrow inline-flex items-center gap-2 no-underline">
                ← Команда
              </Link>
              <h1 className="mt-6 text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.03] text-ink">{p.name}</h1>
              <span
                aria-hidden
                className="mt-5 block h-[2px] w-16 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{p.role}</p>
              {p.intro && (
                <p className="mt-6 max-w-2xl font-display text-lg italic leading-relaxed text-ink/90">{p.intro}</p>
              )}
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={p.pdf} download className="btn btn-primary">
                  Завантажити профайл (PDF) <Download className="h-4 w-4" />
                </a>
                <a href="#contact" className="btn btn-ghost">
                  Обговорити навчання <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute left-8 top-0 z-10 h-[3px] w-16 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.portrait}
                  alt={p.name}
                  style={{ objectPosition: p.objectPosition }}
                  className="aspect-[4/5] w-full rounded-[14px] border border-line/70 object-cover"
                />
              </div>
            </Reveal>
          </div>

          {/* цифри */}
          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {p.stats.map((s, i) => (
              <RevealItem key={i}>
                <div className="h-full border-t border-line/60 pt-5">
                  <div className="font-display text-[2rem] italic leading-none" style={gradText(GRAD_GOLD)}>
                    {s.big} {s.u && <span className="text-[1.2rem] not-italic">{s.u}</span>}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/80">{s.t}</p>
                  {s.uba && (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{s.uba}</p>
                  )}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* спеціалізація + другий блок */}
      <section className="section-pad pt-4">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Block label="Моя спеціалізація" items={p.spec} />
            </Reveal>
            <Reveal delay={0.08}>
              <Block label={p.secondLabel} items={p.second} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* програми */}
      <section className="section-pad pt-0">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">Ключові програми</span>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.1] text-ink">
              Що проводимо <em className="italic text-gradient-gold">для команд</em>
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2">
            {p.programs.map((pr, i) => (
              <RevealItem key={i}>
                <div
                  className="flex h-full flex-col gap-3 rounded-[14px] border border-line/70 p-7"
                  style={{ background: CARD_BG }}
                >
                  <span className="font-mono text-xs tracking-[0.18em]" style={gradText(GRAD_ACC)}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {pr.name && <h3 className="text-lg leading-snug text-ink">{pr.name}</h3>}
                  <p className="text-sm leading-relaxed text-ink/85">{pr.lead}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* результат + останній блок */}
      <section className="section-pad pt-0">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div
                className="rounded-[14px] border border-line/70 p-8"
                style={{ background: CTAG_BG }}
              >
                <span className="eyebrow">Що дає максимальний результат</span>
                <ul className="mt-6 flex flex-col gap-4">
                  {p.drives.map((d, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/85">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 flex-none rounded-full"
                        style={{ background: GRAD_ACC }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-7">
              <Block label={p.lastLabel} items={p.last} numbered />
            </Reveal>
          </div>
        </div>
      </section>

      <ContactForm
        title={
          <>
            Запросити <em className="italic text-gradient-gold">{p.name.split(" ")[0]}</em> у ваш проєкт
          </>
        }
      />
    </>
  );
}

function Block({ label, items, numbered }: { label: string; items: string[]; numbered?: boolean }) {
  return (
    <div>
      <span className="eyebrow">{label}</span>
      <ul className="mt-6 flex flex-col">
        {items.map((it, i) => (
          <li key={i} className="flex gap-5 border-t border-line/50 py-4 last:border-b">
            {numbered ? (
              <span className="font-mono text-xs tracking-[0.1em]" style={gradText(GRAD_ACC)}>
                {String(i + 1).padStart(2, "0")}
              </span>
            ) : (
              <span
                aria-hidden
                className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full"
                style={{ background: GRAD_ACC }}
              />
            )}
            <p className="text-base leading-relaxed text-ink/90">{it}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
