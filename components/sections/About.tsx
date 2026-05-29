import { about } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/icons";

export function About() {
  return (
    <section id="about" className="section-pad">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <Reveal className="lg:col-span-5">
            <div className="relative lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-[28px] border border-gold/20 shadow-[var(--shadow-lux)]">
                <img
                  src={about.image}
                  alt={about.name}
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="font-display text-xl text-ink">{about.name}</p>
                  <p className="text-sm text-muted">
                    Власниця Pan&amp;Partners
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="stat-number text-3xl">25+</div>
                    <div className="text-xs text-faint">років у продажах</div>
                  </div>
                  <div>
                    <div className="stat-number text-3xl">17+</div>
                    <div className="text-xs text-faint">років навчання</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <div className="flex flex-col gap-8 lg:col-span-7">
            <Reveal className="flex flex-col gap-4">
              <span className="eyebrow">{about.eyebrow}</span>
              <p className="font-display text-2xl italic text-gold">
                {about.greeting} —
              </p>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                {about.intro}
              </h2>
            </Reveal>

            <Reveal delay={0.05} className="flex flex-col gap-4">
              {about.credentials.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-4 border-t border-line/50 pt-4"
                >
                  <span className="font-mono text-sm text-gold">0{i + 1}</span>
                  <p className="text-base leading-relaxed text-muted">{c}</p>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="surface flex flex-col gap-5 p-7">
              <p className="text-base text-ink">{about.helpIntro}</p>
              <div className="flex flex-wrap gap-2.5">
                {about.helpPoints.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-3.5 py-1.5 text-sm text-ink"
                  >
                    <Check className="h-3.5 w-3.5 text-gold" strokeWidth={2.4} />
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-lg font-medium text-ink">{about.manner}</p>
              <div className="hairline" />
              <p className="text-pretty font-display text-xl leading-snug text-gradient-gold">
                {about.mission}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
