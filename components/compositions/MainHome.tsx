"use client";

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight, Plus } from "@/components/ui/icons";
import { FormatsShowcase } from "@/components/sections/FormatsShowcase";
import { Requests } from "@/components/sections/Requests";
import { ClientsWall } from "@/components/sections/ClientsWall";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/sections/ContactForm";
import { HeroSlideshowBg } from "@/components/sections/HeroSlideshowBg";
import { HERO_SLIDES } from "@/lib/heroSlides";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, CTAG_BG, gradText } from "@/lib/ember";
import { MAIN_CONTENT_DEFAULTS, type MainContent } from "@/lib/mainContent";

const PROOF = [
  { v: "25+", l: "років у продажах" },
  { v: "17+", l: "років навчання" },
  { v: "90%", l: "продовжують співпрацю" },
  { v: "15 000+", l: "учнів за методом" },
  { v: "№2", l: "ТОП-тренерів UBA 2023" },
  { v: "6", l: "галузей" },
];

/* Шлях Тетяни — лише факти з джерела */
const JOURNEY = [
  { t: "«Олімп»", d: "горілчана компанія", now: false },
  { t: "Danone", d: "FMCG", now: false },
  { t: "Coca-Cola", d: "FMCG", now: false },
  { t: "Власні магазини", d: "власна справа", now: false },
  { t: "Pan&Partners", d: "консалтинг", now: true },
];

const FACTS = [
  { v: "15 000+", l: "людей продають за її методом" },
  { v: "6", l: "галузей — від FMCG до B2B-послуг" },
  { v: "№2", l: "у ТОП тренерів України · UBA 2023" },
];

const MENTORING_STEPS = [
  {
    n: "01",
    t: "Методологія під",
    em: "ваш бізнес",
    d: "Жодних шаблонів: будуємо структуру продажів під вашу ціль і вашу реальність.",
  },
  {
    n: "02",
    t: "Розбір",
    em: "ваших кейсів",
    d: "Працюємо на реальних угодах і переговорах — і розбираємо їх до рішення.",
  },
  {
    n: "03",
    t: "Підтримка",
    em: "між зустрічами",
    d: "Ви не залишаєтеся наодинці з питаннями — рухаємося до результату разом.",
  },
];

export function MainHome({ content }: { content?: MainContent } = {}) {
  const c = content ?? MAIN_CONTENT_DEFAULTS;
  return (
    <>
      {/* HERO — full-bleed slideshow + right-aligned manifesto */}
      <section className="relative grain min-h-[78vh] overflow-hidden">
        <HeroSlideshowBg
          images={HERO_SLIDES}
          overlay={
            <>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(9,9,8,0.45) 0%, rgba(9,9,8,0.66) 44%, rgba(9,9,8,0.96) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(9,9,8,0.92) 0%, rgba(9,9,8,0.08) 55%)",
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(9,9,8,0.75) 0%, rgba(9,9,8,0) 100%)",
                }}
              />
              {/* lux vignette — the scene emerges from darkness */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(110% 85% at 38% 42%, transparent 38%, rgba(7,7,6,0.74) 100%)",
                }}
              />
              {/* amber shimmer wash (переливи, як у VII) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(52vw 52vw at 88% -8%, rgb(226 166 56 / 0.14), transparent 62%), radial-gradient(46vw 46vw at -6% 104%, rgb(214 106 44 / 0.1), transparent 62%)",
                }}
              />
            </>
          }
        />
        <div className="container-shell relative grid min-h-[78vh] items-center gap-10 pb-28 pt-32 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-7 lg:col-span-6 lg:col-start-7">
            <span className="eyebrow">{c.hero.eyebrow}</span>
            <h1 className="font-display text-[clamp(2.7rem,6vw,5.4rem)] leading-[1.02] text-ink">
              {c.hero.titleTop}
              <br />
              <em className="italic text-gradient-gold">{c.hero.titleEm}</em>
            </h1>
            <span
              aria-hidden
              className="h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <p className="max-w-md font-display text-lg italic leading-relaxed text-ink/85">
              {c.hero.lead}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/consultation#book" className="btn btn-primary">
                {c.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#formats" className="btn btn-ghost">
                {c.hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMPANY — who we are */}
      <section id="company" className="relative grain section-pad">
        <div className="container-shell relative grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-4 lg:col-span-5">
            <span className="eyebrow">{c.company.eyebrow}</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              {c.company.headTop}{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                {c.company.headEm}
              </em>
              {c.company.headTail}
            </h2>
            <span
              aria-hidden
              className="mt-1 h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col justify-center gap-5 lg:col-span-7">
            <p className="max-w-xl text-pretty font-display text-xl italic leading-snug text-ink/90">
              {c.company.para1}
            </p>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted">
              {c.company.para2}
            </p>
            <div className="mt-2 max-w-xl">
              <span
                aria-hidden
                className="block h-[2px] w-16 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <Link
                href="#formats"
                className="mt-5 inline-block font-display text-lg font-medium italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
                style={gradText(GRAD_ACC)}
              >
                {c.company.cta} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <div className="container-shell">
        <div className="hairline" />
      </div>

      {/* TRUST — client logo wall right after the promise */}
      <ClientsWall logoWall lean />

      {/* PAINS — what people come with */}
      <Requests />

      {/* FORMATS — offer: three services as story-style cover cards */}
      <FormatsShowcase lean />


      {/* ARCHITECT — людина за методом */}
      <section className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:col-span-5">
            <div className="relative">
              {/* м'яке світло за фігурою — без жорстких країв (гасне до прозорого) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(55% 52% at 50% 46%, rgba(226,166,56,.13), transparent 70%)",
                }}
              />
              {/* фігура на повний зріст */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.architect.image}
                alt="Тетяна Пан — засновниця Pan&Partners"
                className="relative z-[1] mx-auto block w-[72%] max-w-[320px]"
                loading="lazy"
              />
              {/* світло на підлозі + тінь */}
              <div
                aria-hidden
                className="absolute inset-x-10 -bottom-2 h-10"
                style={{
                  background:
                    "radial-gradient(50% 100% at 50% 100%, rgba(226,166,56,.18), transparent 70%)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-16 bottom-0 h-8"
                style={{
                  background:
                    "radial-gradient(50% 100% at 50% 100%, rgba(0,0,0,.55), transparent 70%)",
                }}
              />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal className="flex flex-col gap-4">
              <span className="eyebrow">{c.architect.eyebrow}</span>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                {c.architect.nameTop}{" "}
                <em className="italic" style={gradText(GRAD_ACC)}>
                  {c.architect.nameEm}
                </em>
              </h2>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                {c.architect.para1}
              </p>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                {c.architect.para2}
              </p>
            </Reveal>

            {/* Цитата засновниці */}
            <Reveal delay={0.08} className="mt-10">
              <figure className="relative max-w-2xl pl-4 sm:pl-7">
                <span
                  className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <blockquote
                  className="text-pretty font-display text-[clamp(1.45rem,2.4vw,1.95rem)] font-medium italic leading-[1.3]"
                  style={gradText(GRAD_ACC)}
                >
                  {c.architect.quote}
                </blockquote>
                <figcaption className="mt-4 font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">
                  {c.architect.quoteAuthor}
                </figcaption>
              </figure>
            </Reveal>

            {/* Таймлайн «Шлях» */}
            <RevealGroup className="mt-12">
              <div className="flex items-center gap-4">
                <span
                  className="h-[2px] w-16 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
                  Шлях довжиною 25+ років
                </span>
              </div>
              <div className="mt-7 flex flex-col sm:flex-row">
                {JOURNEY.map((s) => (
                  <RevealItem key={s.t} className="flex-1">
                    <div className="relative border-l border-line/60 pb-6 pl-5 sm:border-l-0 sm:border-t sm:pb-0 sm:pl-0 sm:pr-5 sm:pt-5">
                      <span
                        className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full sm:-top-[4.5px] sm:left-0"
                        style={{
                          background: s.now ? GRAD_GOLD : "rgba(82,68,52,.9)",
                        }}
                      />
                      <div
                        className={`font-display text-[1.05rem] leading-tight ${s.now ? "" : "text-ink"}`}
                        style={s.now ? gradText(GRAD_ACC) : undefined}
                      >
                        {s.t}
                      </div>
                      <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                        {s.d}
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </div>
            </RevealGroup>

            {/* Три живих факти */}
            <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-3">
              {FACTS.map((f) => (
                <RevealItem key={f.l}>
                  <div
                    className="relative h-full rounded-[14px] border border-line/70 p-5"
                    style={{ background: CARD_BG }}
                  >
                    <span
                      className="absolute left-5 top-0 h-[3px] w-10 -translate-y-1/2 rounded-full"
                      style={{ background: GRAD_GOLD }}
                    />
                    <div
                      className="font-display text-[1.7rem] leading-none"
                      style={gradText(GRAD_ACC)}
                    >
                      {f.v}
                    </div>
                    <p className="mt-2 text-sm leading-snug text-muted">{f.l}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* MENTORING — особиста робота з Тетяною */}
      <section id="mentoring" className="relative grain section-pad">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal delay={0.08} className="lg:order-2 lg:col-span-5">
            <div
              className="relative overflow-hidden rounded-[14px] border border-line/60"
              style={{ boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.mentoring.image}
                alt="Тетяна Пан"
                className="aspect-[4/5] w-full object-cover"
                style={{ objectPosition: "center 18%" }}
                loading="lazy"
              />
              <div
                className="absolute inset-x-0 top-0 h-36"
                style={{
                  background:
                    "linear-gradient(180deg,rgba(13,9,5,.82) 0%,rgba(13,9,5,.30) 55%,transparent 100%)",
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[55%]"
                style={{
                  background:
                    "linear-gradient(0deg,rgba(11,7,4,.86) 0%,rgba(12,8,5,.30) 60%,transparent 100%)",
                }}
              />
              <div className="grain absolute inset-0 opacity-20" />
              <div className="absolute left-6 right-6 top-5 flex items-center justify-between font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em]">
                <span style={gradText(GRAD_ACC)}>Менторинг · 1:1</span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
              </div>
              <div className="absolute inset-x-6 bottom-5 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                  style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                >
                  міні-група — до 4 осіб
                </span>
                <span
                  className="inline-flex items-center rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                  style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                >
                  онлайн / офлайн
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:order-1 lg:col-span-7">
            <Reveal className="flex flex-col gap-4">
              <span className="eyebrow">{c.mentoring.eyebrow}</span>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                {c.mentoring.headTop}
                <em className="italic" style={gradText(GRAD_ACC)}>
                  {c.mentoring.headEm}
                </em>
              </h2>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                {c.mentoring.lead}
              </p>
            </Reveal>

            {/* Як проходить робота */}
            <RevealGroup className="mt-9 flex flex-col">
              {MENTORING_STEPS.map((s) => (
                <RevealItem key={s.n}>
                  <div className="grid grid-cols-[3.2rem_1fr] gap-4 border-t border-line/50 py-5 last:border-b sm:grid-cols-[4rem_1fr] sm:gap-6">
                    <span
                      className="pt-1 font-mono text-sm font-medium tracking-[0.1em]"
                      style={gradText(GRAD_ACC)}
                    >
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-medium leading-snug text-ink">
                        {s.t}{" "}
                        <em className="italic" style={gradText(GRAD_ACC)}>
                          {s.em}
                        </em>
                      </h3>
                      <p className="mt-1.5 max-w-lg text-base leading-relaxed text-muted">
                        {s.d}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Кому підходить */}
            <Reveal delay={0.06} className="mt-8 flex flex-wrap items-center gap-2">
              {[
                "Власникам бізнесу",
                "Керівникам продажів",
                "Індивідуально або в групі до 4",
              ].map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line/70 bg-raised/40 px-3.5 py-1.5 text-sm text-ink/85"
                >
                  {c}
                </span>
              ))}
            </Reveal>

            <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link href="/consultation#book" className="btn btn-primary">
                {c.mentoring.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#contact"
                className="font-display text-lg font-medium italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
                style={gradText(GRAD_ACC)}
              >
                {c.mentoring.ctaSecondary}
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — social proof voices (with the proof tiles) */}
      <Testimonials stats={PROOF.slice(0, 4)} />

      {/* FAQ — objection handling before the form */}
      <section id="faq" className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="flex flex-col gap-4 lg:col-span-4">
              <span className="eyebrow">Питання · відповіді</span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                Часті{" "}
                <em className="italic" style={gradText(GRAD_ACC)}>
                  питання
                </em>
              </h2>
              <span
                aria-hidden
                className="h-[2px] w-16 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <p className="font-display text-lg italic leading-relaxed text-muted">
                Не знайшли відповідь?
              </p>
              <a
                href="#contact"
                className="w-fit font-display text-lg italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
                style={gradText(GRAD_ACC)}
              >
                напишіть нам — відповімо особисто →
              </a>
            </Reveal>
            <RevealGroup className="lg:col-span-8">
              {c.faq.map((f, i) => (
                <RevealItem key={f.q}>
                  <details className="group border-t border-line/50 py-5 last:border-b">
                    <summary className="flex cursor-pointer list-none items-baseline gap-4 [&::-webkit-details-marker]:hidden">
                      <span
                        className="shrink-0 font-mono text-[0.7rem] font-medium tracking-[0.2em]"
                        style={gradText(GRAD_ACC)}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="faq-q font-display text-xl font-medium leading-snug text-ink transition-colors duration-300 sm:text-2xl">
                        {f.q}
                      </span>
                      <span className="ml-auto grid h-8 w-8 shrink-0 translate-y-1 place-items-center rounded-full border border-gold/35 text-gold transition-transform duration-300 group-open:rotate-45">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>
                    <p className="mt-3 max-w-3xl pl-[2.35rem] text-base leading-relaxed text-muted">
                      {f.a}
                    </p>
                  </details>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <ContactForm />
    </>
  );
}
