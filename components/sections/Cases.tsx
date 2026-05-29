import Link from "next/link";
import { cases, about, brand } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Quote, ArrowRight } from "@/components/ui/icons";

export function Cases() {
  return (
    <section id="cases" className="relative grain overflow-hidden border-y border-line/50 bg-surface section-pad">
      <div className="container-shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-[28px] border border-gold/20 shadow-[var(--shadow-lux)]">
              <img
                src={about.portrait}
                alt={about.name}
                className="aspect-[4/5] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/40 to-transparent" />
            </div>
          </Reveal>

          <div className="flex flex-col gap-7 lg:col-span-7">
            <Reveal className="flex flex-col gap-5">
              <span className="eyebrow">{cases.eyebrow}</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                {cases.title}
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                {cases.body}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <figure className="relative max-w-xl border-l-2 border-gold/50 pl-6">
                <Quote className="absolute -left-1 -top-2 h-8 w-8 text-gold/30" />
                <blockquote className="text-pretty font-display text-2xl leading-snug text-gradient-gold sm:text-3xl">
                  {cases.pullquote}
                </blockquote>
                <figcaption className="mt-3 text-sm text-muted">
                  — {about.name}, {brand.role.split(" · ")[0]}
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.15}>
              <Link href={cases.cta.href} className="btn btn-primary w-fit">
                {cases.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
