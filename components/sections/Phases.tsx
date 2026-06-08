"use client";

import type { ReactNode } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export type Phase = { n: string; t: string; d: string };

/**
 * The "4 phases" section — a horizontal numbered timeline with a connecting
 * line, on a surface band. Shared by the Method and Concept compositions so
 * they look identical.
 */
export function Phases({
  eyebrow,
  title,
  lead,
  phases,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  phases: Phase[];
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative grain border-y border-line/50 bg-surface section-pad"
    >
      <div className="container-shell relative">
        <Reveal className="mb-14 flex max-w-4xl flex-col gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </span>
          <h2 className="text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.06] text-ink">
            {title}
          </h2>
          {lead && (
            <p className="max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>
          )}
        </Reveal>
        <RevealGroup className="relative grid gap-10 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-gold/10 via-gold/50 to-gold/10 md:block" />
          {phases.map((p) => (
            <RevealItem key={p.n}>
              <div className="relative">
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-canvas font-mono text-gold">
                  {p.n}
                </div>
                <h3 className="mt-5 text-xl text-ink">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.d}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
