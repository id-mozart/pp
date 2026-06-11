import Link from "next/link";
import { consultation } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight, Compass, Results, Spark } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, CTAG_BG, gradText } from "@/lib/ember";

const CARD_ICONS = [Compass, Results, Spark];

export function ConsultCards() {
  return (
    <div className="container-shell relative">
      <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
        {consultation.hero.cards.map((c, i) => {
          const Icon = CARD_ICONS[i % CARD_ICONS.length];
          return (
            <RevealItem key={c.title}>
              <div
                className="relative h-full rounded-[14px] border border-line/70 p-6"
                style={{ background: CARD_BG }}
              >
                <span
                  aria-hidden
                  className="absolute left-6 top-0 h-[3px] w-10 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[0.7rem] font-medium tracking-[0.2em]"
                    style={gradText(GRAD_ACC)}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* Мостик: менторинг / корпоративний формат */}
      <Reveal delay={0.08} className="mt-8">
        <p className="max-w-3xl font-display text-lg italic leading-relaxed text-muted">
          Цікавить менторинг або корпоративний формат? Перший крок той самий —{" "}
          <em style={gradText(GRAD_ACC)}>консультація 1:1</em>: на ній визначаємо
          формат і програму.
        </p>
      </Reveal>
    </div>
  );
}

export function ConsultWhat() {
  const { what } = consultation;
  return (
    <section id="what" className="section-pad">
      <div className="container-shell">
        <Reveal className="mb-12 flex flex-col gap-5">
          <span className="eyebrow">{what.eyebrow}</span>
          <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
            {what.title}
          </h2>
          <span
            aria-hidden
            className="h-[2px] w-16 rounded-full"
            style={{ background: GRAD_GOLD }}
          />
        </Reveal>

        {/* Audiences */}
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {what.audiences.map((a) => (
            <RevealItem key={a.title}>
              <div
                className="relative h-full rounded-[14px] border border-line/70 p-8"
                style={{ background: CARD_BG }}
              >
                <span
                  aria-hidden
                  className="absolute left-8 top-0 h-[3px] w-12 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <span
                  className="inline-flex rounded-[10px] border border-line/70 px-3 py-1.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                  style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                >
                  {a.kicker}
                </span>
                <h3 className="mt-4 font-display text-xl font-medium text-ink">
                  {a.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{a.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* You will get */}
        <div className="mt-16 flex items-center gap-4">
          <span
            aria-hidden
            className="h-[2px] w-16 rounded-full"
            style={{ background: GRAD_GOLD }}
          />
          <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
            Ви отримаєте
          </span>
        </div>
        <RevealGroup className="mt-5 grid gap-6 md:grid-cols-3">
          {what.youWillGet.map((y) => (
            <RevealItem key={y.title}>
              <div
                className="group h-full overflow-hidden rounded-[14px] border border-line/70 transition-all duration-500 ease-lux hover:border-gold/40"
                style={{ background: CARD_BG }}
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={y.image}
                    alt={y.title}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(0deg,rgba(11,7,4,.86) 0%,rgba(12,8,5,.2) 60%,transparent 100%)",
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-medium text-ink">
                    {y.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{y.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* How it works */}
        <Reveal delay={0.05} className="mt-12">
          <div className="relative">
            <span
              aria-hidden
              className="absolute left-10 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <div
              className="relative overflow-hidden rounded-[14px] border border-line/70 p-8 grain sm:p-12"
              style={{ background: CARD_BG }}
            >
              <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-xl">
                  <h3 className="font-display text-2xl text-ink">
                    Як це{" "}
                    <em className="italic" style={gradText(GRAD_ACC)}>
                      працює
                    </em>
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {what.howItWorks.body}
                  </p>
                </div>
                <Link href={what.howItWorks.cta.href} className="btn btn-primary shrink-0">
                  {what.howItWorks.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
