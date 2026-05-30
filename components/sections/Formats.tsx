"use client";

import Link from "next/link";
import { formats } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight, Target, Spark, Compass } from "@/components/ui/icons";

const ICONS = [Target, Spark, Compass];

export function Formats() {
  return (
    <section id="formats" className="section-pad">
      <div className="container-shell">
        <Reveal className="mb-12 flex flex-col gap-5">
          <span className="eyebrow">{formats.eyebrow}</span>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              {formats.title}
            </h2>
            <p className="max-w-sm text-lg leading-relaxed text-muted">
              {formats.subtitle}
            </p>
          </div>
        </Reveal>

        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {formats.cards.map((card, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <RevealItem key={card.number}>
                <Link
                  href={card.href}
                  className="group relative flex h-full flex-col overflow-hidden surface p-7 transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lux)]"
                >
                  <span className="pointer-events-none absolute -right-4 -top-6 font-display text-[7rem] leading-none text-ink/[0.04] transition-colors group-hover:text-gold/10">
                    {card.number}
                  </span>
                  <span className="relative grid h-12 w-12 place-items-center rounded-full bg-gold/12 text-gold">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="relative mt-6 text-2xl text-ink">{card.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted">
                    {card.summary}
                  </p>

                  <dl className="relative mt-6 flex flex-col gap-3 border-t border-line/50 pt-5">
                    <Meta label="Для кого" value={card.who} />
                    <Meta label="Результат" value={card.result} />
                    <Meta label="Як" value={card.how} />
                  </dl>

                  <span className="relative mt-7 inline-flex items-center gap-2 text-sm text-gold">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3">
      <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-faint">
        {label}
      </dt>
      <dd className="text-sm text-ink/90">{value}</dd>
    </div>
  );
}
