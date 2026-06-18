import { useContent, useUi } from "@/components/providers/LocaleProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, CTAG_BG, gradText } from "@/lib/ember";

export function B2BExperience() {
  const { b2b } = useContent();
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
            <span
              aria-hidden
              className="mt-5 block h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <ul className="mt-8 flex flex-col">
              {experience.items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-5 border-t border-line/50 py-5 last:border-b"
                >
                  <span
                    className="font-mono text-sm font-medium tracking-[0.1em]"
                    style={gradText(GRAD_ACC)}
                  >
                    0{i + 1}
                  </span>
                  <p className="text-base leading-relaxed text-ink/90">{item}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="relative">
              <span
                aria-hidden
                className="absolute left-8 top-0 z-10 h-[3px] w-16 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <div
                className="flex flex-col gap-7 rounded-[14px] border border-line/70 p-8"
                style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <Stat value="25+" label="років у B2B" />
                  <Stat value="€500–700K+" label="оборот клієнтів / міс" />
                </div>
                <div className="hairline" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint">
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
      <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] leading-snug text-muted">
        {label}
      </div>
    </div>
  );
}

export function B2BSolutions() {
  const { b2b } = useContent();
  const ui = useUi();
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
            {ui.b2bPage.solutionsTitlePre}
            <em className="italic" style={gradText(GRAD_ACC)}>
              {ui.b2bPage.solutionsTitleEm}
            </em>
          </h2>
          <span
            aria-hidden
            className="h-[2px] w-16 rounded-full"
            style={{ background: GRAD_GOLD }}
          />
        </Reveal>

        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {solutions.cards.map((card) => (
            <RevealItem key={card.number}>
              <div
                className="group relative h-full overflow-hidden rounded-[14px] border border-line/70 p-8 transition-all duration-500 ease-lux hover:border-gold/40"
                style={{ background: CARD_BG }}
              >
                <span
                  aria-hidden
                  className="absolute left-8 top-0 h-[3px] w-12 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <span className="pointer-events-none absolute -right-3 -top-7 font-display text-[6.5rem] leading-none text-gold/[0.07] transition-colors group-hover:text-gold/15">
                  {card.number}
                </span>
                <h3 className="relative font-display text-2xl font-medium text-ink">
                  {card.title}
                </h3>
                <ul className="relative mt-5 flex flex-col gap-3">
                  {card.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.2} />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className="relative mt-6 inline-block font-display text-base italic transition-transform duration-500 ease-lux group-hover:translate-x-1.5"
                  style={gradText(GRAD_ACC)}
                >
                  {ui.b2bPage.discussCard}
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.06} className="mt-10">
          <a
            href="#contact"
            className="inline-block font-display text-lg font-medium italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
            style={gradText(GRAD_ACC)}
          >
            {ui.b2bPage.discussWhich}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function B2BApproach() {
  const { b2b } = useContent();
  const { approach } = b2b;
  return (
    <section className="section-pad">
      <div className="container-shell">
        <div
          className="relative overflow-hidden rounded-[14px] border border-line/70 p-8 grain sm:p-12 lg:p-16"
          style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
        >
          {/* blueprint-сітка + янтарне світіння */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(82,68,52,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(82,68,52,.2) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(85% 60% at 50% 0%, rgba(226,166,56,.12), transparent 70%)",
            }}
          />
          <Reveal className="relative flex flex-col gap-4">
            <span className="eyebrow">{approach.eyebrow}</span>
            <h2 className="max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.08] text-ink">
              {approach.title}
            </h2>
            <span
              aria-hidden
              className="h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
          </Reveal>

          <RevealGroup className="relative mt-12 grid gap-px overflow-hidden rounded-2xl border border-line/50 bg-line/40 md:grid-cols-3">
            {approach.pillars.map((p, i) => (
              <RevealItem key={p.label}>
                <div className="h-full p-7" style={{ background: CTAG_BG }}>
                  <span
                    className="font-mono text-[0.85rem] font-medium tracking-[0.2em]"
                    style={gradText(GRAD_ACC)}
                  >
                    0{i + 1}
                  </span>
                  <p className="mt-5 font-mono text-sm uppercase tracking-[0.16em] text-gold">
                    {p.label}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-muted">
                    {p.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
