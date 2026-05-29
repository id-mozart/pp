import Link from "next/link";
import { consultation } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight, Compass, Results, Spark } from "@/components/ui/icons";

const CARD_ICONS = [Compass, Results, Spark];

export function ConsultCards() {
  return (
    <div className="container-shell relative">
      <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
        {consultation.hero.cards.map((c, i) => {
          const Icon = CARD_ICONS[i % CARD_ICONS.length];
          return (
            <RevealItem key={c.title}>
              <div className="h-full surface p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/12 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg text-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.body}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
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
        </Reveal>

        {/* Audiences */}
        <RevealGroup className="grid gap-6 md:grid-cols-2">
          {what.audiences.map((a) => (
            <RevealItem key={a.title}>
              <div className="h-full surface p-8">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
                  {a.kicker}
                </span>
                <h3 className="mt-3 text-xl text-ink">{a.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted">{a.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* You will get */}
        <p className="mt-16 font-mono text-xs uppercase tracking-[0.18em] text-faint">
          Ви отримаєте
        </p>
        <RevealGroup className="mt-5 grid gap-6 md:grid-cols-3">
          {what.youWillGet.map((y) => (
            <RevealItem key={y.title}>
              <div className="group h-full overflow-hidden surface transition-all duration-500 ease-lux hover:border-gold/40">
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={y.image}
                    alt={y.title}
                    className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-canvas/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-ink">{y.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{y.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* How it works */}
        <Reveal delay={0.05} className="mt-12">
          <div className="relative overflow-hidden rounded-[24px] border border-gold/20 bg-raised p-8 grain sm:p-12">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h3 className="text-2xl text-ink">{what.howItWorks.title}</h3>
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
        </Reveal>
      </div>
    </section>
  );
}
