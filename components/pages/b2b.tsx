import { b2b } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Check, Target, Practice, Results } from "@/components/ui/icons";

export function B2BExperience() {
  const { experience } = b2b;
  return (
    <section className="section-pad">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <span className="eyebrow">{experience.eyebrow}</span>
            <h2 className="mt-5 max-w-xl text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.08] text-ink">
              {experience.title}
            </h2>
            <ul className="mt-8 flex flex-col">
              {experience.items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-5 border-t border-line/50 py-5 last:border-b"
                >
                  <span className="font-mono text-sm text-gold">0{i + 1}</span>
                  <p className="text-base leading-relaxed text-ink/90">{item}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="surface flex flex-col gap-7 p-8">
              <div className="grid grid-cols-2 gap-6">
                <Stat value="25+" label="років у B2B" />
                <Stat value="€500–700K+" label="оборот клієнтів / міс" />
              </div>
              <div className="hairline" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  Серед клієнтів
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {["Vodafone", "Kyivstar", "ДТЕК"].map((n) => (
                    <span
                      key={n}
                      className="font-display text-2xl tracking-tight text-ink/80"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="stat-number text-3xl sm:text-4xl">{value}</div>
      <div className="mt-2 text-xs leading-snug text-muted">{label}</div>
    </div>
  );
}

export function B2BSolutions() {
  const { solutions } = b2b;
  return (
    <section
      id="solutions"
      className="relative grain border-y border-line/50 bg-surface section-pad"
    >
      <div className="container-shell relative">
        <Reveal className="mb-12 flex flex-col gap-5">
          <span className="eyebrow">{solutions.eyebrow}</span>
          <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
            {solutions.title}
          </h2>
        </Reveal>

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {solutions.cards.map((card) => (
            <RevealItem key={card.number}>
              <div className="group relative h-full overflow-hidden surface p-8 transition-all duration-500 ease-lux hover:border-gold/40">
                <span className="pointer-events-none absolute -right-3 -top-7 font-display text-[6.5rem] leading-none text-ink/[0.04] transition-colors group-hover:text-gold/10">
                  {card.number}
                </span>
                <h3 className="relative text-2xl text-ink">{card.title}</h3>
                <ul className="relative mt-5 flex flex-col gap-3">
                  {card.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.2} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const PILLAR_ICONS = [Target, Practice, Results];

export function B2BApproach() {
  const { approach } = b2b;
  return (
    <section className="section-pad">
      <div className="container-shell">
        <div className="relative overflow-hidden rounded-[28px] border border-gold/20 bg-raised p-8 grain sm:p-12 lg:p-16">
          <Reveal className="flex flex-col gap-4">
            <span className="eyebrow">{approach.eyebrow}</span>
            <h2 className="max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.08] text-ink">
              {approach.title}
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line/50 bg-line/40 md:grid-cols-3">
            {approach.pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
              return (
                <RevealItem key={p.label}>
                  <div className="h-full bg-raised p-7">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/12 text-gold">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-5 font-mono text-sm uppercase tracking-[0.16em] text-gold">
                      {p.label}
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      {p.body}
                    </p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
