"use client";

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { formats, testimonials, clients } from "@/lib/content";
import { ArrowRight, Star } from "@/components/ui/icons";

export function MovementHome() {
  return (
    <>
      {/* Hero */}
      <section className="container-shell pb-16 pt-32 sm:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="text-center lg:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Рух Pan&amp;Partners · приєднуйтесь
            </p>
            <h1 className="mt-5 text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.98] text-ink">
              Продавайте як профі. <span className="text-gold">Без тиску.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-lg text-muted lg:mx-0">
              Система продажів, що працює®. Приєднуйтесь до 15 000+ підприємців і
              команд, які продають упевнено.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/consultation#book" className="btn btn-primary">
                ПРИЄДНАТИСЯ <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#proof" className="btn btn-ghost">
                Дивитися результати
              </Link>
            </div>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wider text-faint">Серед клієнтів</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 lg:justify-start">
                {clients.named.map((n) => (
                  <span key={n} className="font-display text-lg text-ink/60">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/Tania2.jpg"
                alt="Тетяна Пан"
                className="aspect-[4/5] w-full rounded-[28px] object-cover object-top"
              />
              <div className="absolute -bottom-5 -left-5 rounded-2xl bg-gold px-5 py-4 text-oncontrast shadow-[var(--shadow-lux)]">
                <div className="text-3xl font-extrabold">15 000+</div>
                <div className="text-xs">учнів за методом</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Value prop */}
      <section className="border-y border-line/50 bg-surface section-pad text-center">
        <div className="container-shell">
          <h2 className="mx-auto max-w-3xl text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight text-ink">
            Побудуйте <span className="text-gold">систему продажів</span>, що дає
            передбачуваний результат — і поверніть контроль.
          </h2>
        </div>
      </section>

      {/* Numbered offerings */}
      <section className="section-pad">
        <div className="container-shell">
          <RevealGroup className="grid gap-6 md:grid-cols-3">
            {formats.cards.map((c) => (
              <RevealItem key={c.number}>
                <div className="surface h-full p-7">
                  <div className="text-5xl font-extrabold text-gold">{c.number}</div>
                  <h3 className="mt-3 text-2xl font-bold text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted">{c.summary}</p>
                  <p className="mt-3 text-sm font-semibold text-ink">{c.result}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Social proof + testimonials */}
      <section id="proof" className="border-y border-line/50 bg-surface section-pad">
        <div className="container-shell">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { v: "25+", l: "років досвіду" },
              { v: "90%", l: "повертаються" },
              { v: "№2", l: "тренерів UBA 2023" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-4xl font-extrabold text-gold sm:text-5xl">{s.v}</div>
                <div className="mt-1 text-xs text-muted">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.items.slice(0, 3).map((t) => (
              <div key={t.name} className="surface p-6">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-3 text-pretty text-ink">“{t.quote}”</p>
                <p className="mt-3 text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community CTA */}
      <section className="section-pad text-center">
        <div className="container-shell">
          <h2 className="mx-auto max-w-2xl text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-tight text-ink">
            Готові приєднатися до руху?
          </h2>
          <Link href="/consultation#book" className="btn btn-primary mt-7">
            ПРИЄДНАТИСЯ СЬОГОДНІ <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
