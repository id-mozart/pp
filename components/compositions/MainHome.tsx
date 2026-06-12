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
  { v: "90%", l: "клієнтів продовжують співпрацю" },
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

/* FAQ — objection handling; answers assembled from the source facts */
const FAQ = [
  {
    q: "З чого почати співпрацю?",
    a: "З онлайн-консультації 1:1. Одна фокусна година — і ви знаєте вузьке місце своїх продажів, маєте план наступних кроків і конкретні скрипти.",
  },
  {
    q: "Які формати роботи можливі?",
    a: "Корпоративні тренінги під ваш запит, готові онлайн-курси та наставництво — командне чи індивідуальне, у групах до 4 осіб. Онлайн або офлайн — як зручніше вам.",
  },
  {
    q: "Це підходить лише для B2B?",
    a: "Наша головна спеціалізація — B2B-продажі та переговори з великими клієнтами. Але та сама система працює і в B2C: будуємо простий продажний процес під вашу реальність.",
  },
  {
    q: "Який результат можна очікувати?",
    a: "Зростання продажів від +20% до ×5, конверсія з 5% до 20–30%. І показник, яким пишаємося найбільше: 90% клієнтів продовжують співпрацю та рекомендують нас партнерам.",
  },
  {
    q: "Чи є досвід у нашій галузі?",
    a: "25+ років практики в 6 галузях — від FMCG (Danone, Coca-Cola, «Олімп») до телекому та енергетики (Vodafone, Kyivstar, ДТЕК). Методологію будуємо під ваш бізнес, а не за шаблоном.",
  },
  {
    q: "Без тиску — це як?",
    a: "Ми не вчимо маніпуляціям і «дотисканню». Система спирається на структуру, підготовку та переговори, після яких клієнт повертається — природно та легко.",
  },
];

export function MainHome() {
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
            <span className="eyebrow">Pan&amp;Partners · метод продажів</span>
            <h1 className="font-display text-[clamp(2.7rem,6vw,5.4rem)] leading-[1.02] text-ink">
              Продажі — це не талант.
              <br />
              <em className="italic text-gradient-gold">Це система.</em>
            </h1>
            <span
              aria-hidden
              className="h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <p className="max-w-md font-display text-lg italic leading-relaxed text-ink/85">
              Метод, що перетворює переговори з B2B-клієнтами на результат, який
              можна передбачити — і повторити.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/consultation#book" className="btn btn-primary">
                Запустити систему <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#formats" className="btn btn-ghost">
                Як це працює
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMPANY — who we are */}
      <section id="company" className="relative grain section-pad">
        <div className="container-shell relative grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-4 lg:col-span-5">
            <span className="eyebrow">Pan&amp;Partners · про компанію</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Будуємо{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                системи продажів
              </em>
              , а не разові тренінги
            </h2>
            <span
              aria-hidden
              className="mt-1 h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col justify-center gap-5 lg:col-span-7">
            <p className="max-w-xl text-pretty font-display text-xl italic leading-snug text-ink/90">
              Pan&amp;Partners — українська консалтингова компанія з продажів та
              переговорів. Ми вчимо команди продавати B2B-клієнтам і впевнено
              домовлятися, вибудовуємо процес і залишаємося поруч до
              вимірюваного результату — онлайн та офлайн.
            </p>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted">
              Компанію заснувала Тетяна Пан — бізнес-тренерка та експертка з
              продажів: 25+ років власної практики («Олімп», Danone, Coca-Cola,
              власні магазини) і 17+ років навчання команд. Працюємо так, як
              зручно вам: корпоративні тренінги, онлайн-курси, наставництво.
            </p>
            <div className="mt-2 max-w-xl">
              <span
                aria-hidden
                className="block h-[2px] w-16 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <Link href="#formats" className="btn btn-primary mt-6 w-fit">
                Обрати спосіб роботи <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <div className="container-shell">
        <div className="hairline" />
      </div>

      {/* TRUST — client logo wall right after the promise */}
      <ClientsWall logoWall />

      {/* PAINS — what people come with */}
      <Requests />

      {/* FORMATS — offer: three services as story-style cover cards */}
      <FormatsShowcase lean />


      {/* ARCHITECT — людина за методом */}
      <section className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:col-span-5">
            <div
              className="relative overflow-hidden rounded-[14px] border border-line/60"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              {/* blueprint-сітка + бурштинове світіння */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(82,68,52,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(82,68,52,.2) 1px,transparent 1px)",
                  backgroundSize: "64px 64px",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(85% 60% at 50% 26%, rgba(226,166,56,.16), transparent 70%)",
                }}
              />
              {/* runhead */}
              <div className="absolute left-6 right-6 top-5 z-10 flex items-center justify-between font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em]">
                <span style={gradText(GRAD_ACC)}>Pan&amp;Partners</span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
              </div>
              {/* фігура на повний зріст */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/Tania4.webp"
                alt="Тетяна Пан — засновниця Pan&Partners"
                className="relative z-[1] mx-auto mb-16 mt-16 block w-[66%] max-w-[300px]"
                loading="lazy"
              />
              {/* тінь під фігурою */}
              <div
                className="absolute inset-x-12 bottom-14 h-8"
                style={{
                  background:
                    "radial-gradient(50% 100% at 50% 100%, rgba(0,0,0,.5), transparent 70%)",
                }}
              />
              <div className="grain absolute inset-0 opacity-20" />
              {/* ctag-визнання + підпис */}
              <div className="absolute inset-x-6 bottom-5 z-10 flex flex-wrap items-center justify-between gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                  style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                >
                  №2{" "}
                  <b className="font-semibold" style={gradText(GRAD_ACC)}>
                    ТОП-тренерів UBA 2023
                  </b>
                </span>
                <span className="font-mono text-[0.62rem] uppercase tracking-widest text-ink/75">
                  засновниця
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal className="flex flex-col gap-4">
              <span className="eyebrow">Архітектор методу</span>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                Тетяна{" "}
                <em className="italic" style={gradText(GRAD_ACC)}>
                  Пан
                </em>
              </h2>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                Тетяна не вивчала продажі з книжок — вона пройшла цей шлях сама:
                продавчинею і керівницею з продажів у «Олімпі», Danone та
                Coca-Cola, згодом — у власних магазинах і власній консалтинговій
                компанії. Понад 25 років реальних угод, команд і переговорів.
              </p>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                А 17 років тому вона почала вчити цього інших. Так особистий
                досвід став методом Pan&amp;Partners: чітким і структурованим,
                без тиску й маніпуляцій — щоб результат був очікуваним, а
                клієнти поверталися.
              </p>
            </Reveal>

            {/* Цитата засновниці */}
            <Reveal delay={0.08} className="mt-10">
              <figure className="relative max-w-2xl pl-7">
                <span
                  className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <blockquote
                  className="text-pretty font-display text-[clamp(1.45rem,2.4vw,1.95rem)] font-medium italic leading-[1.3]"
                  style={gradText(GRAD_ACC)}
                >
                  «Я не вчу тиснути й маніпулювати. Я вчу продавати так, щоб
                  клієнт повертався — природно та легко, із задоволенням від
                  результату».
                </blockquote>
                <figcaption className="mt-4 font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">
                  — Тетяна Пан, засновниця
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
                src="/brand/Tania5.jpg"
                alt="Тетяна Пан проводить навчання"
                className="aspect-[4/5] w-full object-cover"
                style={{ objectPosition: "46% 24%" }}
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
              <span className="eyebrow">Особиста робота з Тетяною</span>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                Бізнес-
                <em className="italic" style={gradText(GRAD_ACC)}>
                  менторинг
                </em>
              </h2>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
                Є питання, які не вирішує тренінг для команди: ціна, стратегія
                переговорів з ключовими клієнтами, ваша власна впевненість. Для
                них є менторинг: методологія Тетяни, ваші кейси, ваш темп.
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
                Записатися на менторинг <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#contact"
                className="font-display text-lg font-medium italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
                style={gradText(GRAD_ACC)}
              >
                поставити запитання →
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
              {FAQ.map((f, i) => (
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
