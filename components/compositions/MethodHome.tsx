"use client";

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight, Users, Calendar, Plus } from "@/components/ui/icons";
import { Formats } from "@/components/sections/Formats";
import { Phases } from "@/components/sections/Phases";
import { Requests } from "@/components/sections/Requests";
import { ClientsWall } from "@/components/sections/ClientsWall";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/sections/ContactForm";
import { HeroSlideshowBg } from "@/components/sections/HeroSlideshowBg";
import { HERO_SLIDES } from "@/lib/heroSlides";
import { contacts, system } from "@/lib/content";

const PRINCIPLES = [
  { n: "01", t: "Без тиску" },
  { n: "02", t: "Без маніпуляцій" },
  { n: "03", t: "Структура понад інтуїцію" },
  { n: "04", t: "Вимірюваний результат" },
];

const PROOF = [
  { v: "25+", l: "років у продажах" },
  { v: "17+", l: "років навчання" },
  { v: "90%", l: "продовжують співпрацю" },
  { v: "15 000+", l: "учнів за методом" },
  { v: "№2", l: "ТОП-тренерів UBA 2023" },
  { v: "6", l: "галузей" },
];

const DOSSIER = [
  { k: "Хто", v: "Власниця компанії Pan&Partners, бізнес-тренерка, експертка з продажів та переговорів." },
  { k: "Досвід", v: "25+ років власного досвіду в продажах і керівництві: «Олімп» (горілчана компанія), Danone, Coca-Cola, власні магазини та власна консалтингова компанія." },
  { k: "Навчання", v: "17+ років навчає продавати й вести переговори · 15 000+ учнів за методом." },
  { k: "Галузі", v: "Досвід у 6 галузях — від FMCG до B2B-послуг." },
  { k: "Підхід", v: "Чітко та структуровано, впевнено, з очікуваним результатом. Без тиску. Без маніпуляцій. Природно та легко." },
  { k: "Місія", v: "Допомогти вам відчувати задоволення від отриманого результату." },
  { k: "Визнання", v: "№2 серед ТОП-тренерів України, UBA 2023." },
];

const AUDIENCES = [
  "Власники бізнесу",
  "Керівники продажів",
  "Команди продажів",
  "Експерти та ФОП",
];

/* Outcomes — before → after, from the source figures */
const RESULTS = [
  { label: "Конверсія у продаж", from: "5%", to: "20–30%", pct: 82 },
  { label: "Зростання продажів", from: "+20%", to: "×5", pct: 96 },
  { label: "Утримання клієнтів", from: "—", to: "90%", pct: 90 },
];

/* FAQ — objection handling; answers assembled from the source facts */
const FAQ = [
  {
    q: "З чого почати співпрацю?",
    a: "З онлайн-консультації 1:1 — одна фокусна година: діагностуємо вузьке місце ваших продажів, даємо план наступних кроків і конкретні скрипти.",
  },
  {
    q: "Які формати роботи можливі?",
    a: "Корпоративні тренінги під ваш запит, готові онлайн-курси та наставництво (командне або індивідуальне, групи до 4 осіб). Працюємо онлайн та офлайн.",
  },
  {
    q: "Це підходить лише для B2B?",
    a: "Основна спеціалізація — B2B-продажі та переговори з великими клієнтами. Водночас система адаптується й під B2C — будуємо простий продажний процес під вашу реальність.",
  },
  {
    q: "Який результат можна очікувати?",
    a: "Зростання продажів від +20% до ×5, конверсія з 5% до 20–30%. 90% клієнтів продовжують співпрацю з нами та рекомендують нас своїм партнерам.",
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

export function MethodHome() {
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
              {/* gold-foil shimmer wash (переливи, як у VII) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(52vw 52vw at 88% -8%, rgb(203 164 90 / 0.14), transparent 62%), radial-gradient(46vw 46vw at -6% 104%, rgb(176 120 60 / 0.1), transparent 62%)",
                }}
              />
            </>
          }
        />
        <div className="container-shell relative grid min-h-[78vh] items-center gap-10 pb-16 pt-32 lg:grid-cols-12">
          <Reveal className="flex flex-col gap-7 lg:col-span-6 lg:col-start-7">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Pan&amp;Partners · метод продажів
            </span>
            <h1 className="font-display text-[clamp(2.7rem,6vw,5.4rem)] leading-[1.02] text-ink">
              Продажі — це не талант.
              <br />
              <span className="text-gradient-gold">Це система.</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-ink/80">
              Метод, що перетворює переговори з B2B-клієнтами на прогнозований,
              повторюваний результат.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/consultation#book" className="btn btn-primary">
                Запустити систему <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#method" className="btn btn-ghost">
                Як це працює
              </Link>
            </div>

            {/* info pills — like the slide's bordered cards */}
            <div className="flex flex-wrap gap-3 pt-1">
              {[
                { Icon: Users, label: "Бізнес-тренерка", value: "Тетяна Пан" },
                { Icon: Calendar, label: "Україна", value: "2026" },
              ].map(({ Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-canvas/35 py-2.5 pl-2.5 pr-5 backdrop-blur-sm"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold/35 text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs text-muted">{label}</span>
                    <span className="block text-base font-medium text-gold">
                      {value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMPANY — who we are */}
      <section id="company" className="relative grain border-b border-line/40 section-pad">
        <div className="container-shell relative grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-4 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Pan&amp;Partners · про компанію
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Будуємо системи продажів, а не разові тренінги
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col justify-center gap-5 lg:col-span-7">
            <p className="text-lg leading-relaxed text-muted">
              Pan&amp;Partners — українська консалтингова компанія з продажів та
              переговорів. Навчаємо команди продавати та вести переговори з
              B2B-клієнтами, ставимо процес і супроводжуємо до вимірюваного
              результату — онлайн та офлайн.
            </p>
            <p className="text-lg leading-relaxed text-muted">
              Компанію заснувала Тетяна Пан — бізнес-тренерка та експертка з
              продажів із 25+ роками власного досвіду («Олімп», Danone,
              Coca-Cola, власні магазини) та 17+ роками навчання команд. Формати
              роботи — корпоративні тренінги, онлайн-курси та наставництво.
            </p>
            <p className="max-w-xl text-pretty font-display text-xl leading-snug text-gradient-gold">
              Без тиску. Без маніпуляцій. Природно та легко — з очікуваним
              результатом.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TRUST — client logo wall right after the promise */}
      <ClientsWall />

      {/* PAINS — what people come with (from Concept 0) */}
      <Requests />

      {/* SYSTEM — 4 phases (same composition as Concept 0) */}
      <Phases
        id="method"
        eyebrow={system.eyebrow}
        title={
          <>
            Продажі — це <span className="text-gradient-gold">система</span>, а не
            везіння
          </>
        }
        lead={system.intro}
        phases={system.phases}
      />

      {/* RESULTS — before → after outcomes */}
      <section id="results" className="relative grain section-pad">
        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="flex flex-col gap-4 lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Результати · до → після
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                Що змінюється, коли продажі стають{" "}
                <span className="text-gradient-gold">системою</span>
              </h2>
              <p className="max-w-md text-lg leading-relaxed text-muted">
                Цифри наших клієнтів після впровадження системи — від перших
                тижнів до повного супроводу.
              </p>
            </Reveal>
            <RevealGroup className="flex flex-col justify-center gap-7 lg:col-span-7">
              {RESULTS.map((m) => (
                <RevealItem key={m.label}>
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-lg text-ink">{m.label}</span>
                      <span className="font-mono text-sm text-muted">
                        {m.from} →{" "}
                        <span className="text-xl font-medium text-gold">{m.to}</span>
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line/40">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${m.pct}%`,
                          background:
                            "linear-gradient(90deg, #e6cd9a 0%, #cba45a 55%, #9c6f2e 100%)",
                        }}
                      />
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* PRINCIPLES — manifesto */}
      <section className="section-pad">
        <div className="container-shell">
          <Reveal className="mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Принципи
            </span>
          </Reveal>
          <RevealGroup className="flex flex-col">
            {PRINCIPLES.map((p) => (
              <RevealItem key={p.n}>
                <div className="group flex items-center gap-6 border-t border-line/50 py-6 last:border-b">
                  <span className="font-mono text-sm text-gold">{p.n}</span>
                  <span className="font-display text-[clamp(1.6rem,4vw,3rem)] leading-tight text-ink transition-colors group-hover:text-gold">
                    {p.t}
                  </span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ARCHITECT — dossier (more source detail) */}
      <section className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-2xl border border-gold/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/Tania4.webp"
                alt="Тетяна Пан"
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/55 via-transparent to-transparent" />
              <div className="grain absolute inset-0 opacity-20" />
              <div className="absolute bottom-4 left-4 font-mono text-[0.62rem] uppercase tracking-widest text-ink/90">
                автор методу
              </div>
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <Reveal className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Архітектор методу
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                Тетяна Пан
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                Понад 25 років у продажах і керівництві, 17+ років навчає команди
                продавати та вести переговори. Метод народився з реальної практики —
                від лінійних продажів до власного консалтингу.
              </p>
            </Reveal>
            <RevealGroup className="mt-8 flex flex-col">
              {DOSSIER.map((d) => (
                <RevealItem key={d.k}>
                  <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line/50 py-4 sm:grid-cols-[9rem_1fr]">
                    <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-faint">
                      {d.k}
                    </dt>
                    <dd className="text-base leading-relaxed text-ink/90">{d.v}</dd>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* PROOF — evidence */}
      <section id="proof" className="relative grain border-y border-line/50 bg-surface section-pad">
        <div className="container-shell relative">
          <Reveal className="mb-10">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Доказова база
            </span>
          </Reveal>
          <RevealGroup className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/40 md:grid-cols-3 lg:grid-cols-6">
            {PROOF.map((s) => (
              <RevealItem key={s.l}>
                <div className="h-full bg-surface p-6 text-center">
                  <div className="stat-number text-3xl sm:text-4xl">{s.v}</div>
                  <div className="mt-2 text-xs leading-snug text-muted">{s.l}</div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* TESTIMONIALS — social proof voices */}
      <Testimonials />

      {/* AUDIENCES + CTA — graphite grid band */}
      <section className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell relative">
          <Reveal className="flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Для кого
            </span>
            <div className="flex flex-wrap gap-3">
              {AUDIENCES.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-line/70 px-4 py-2 text-sm text-ink"
                >
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-14 flex flex-col items-start gap-6 border-t border-line/50 pt-12">
            <h2 className="max-w-3xl font-display text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.04] text-ink">
              Готові замінити інтуїцію на{" "}
              <span className="text-gradient-gold">систему</span>?
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/consultation#book" className="btn btn-primary">
                Запустити систему продажів <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Написати у WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FORMATS — offer: ways of cooperation */}
      <Formats />

      {/* FAQ — objection handling before the form */}
      <section id="faq" className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="flex flex-col gap-4 lg:col-span-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Питання · відповіді
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                Часті питання
              </h2>
              <p className="text-lg leading-relaxed text-muted">
                Не знайшли відповідь? Напишіть нам — відповімо особисто.
              </p>
            </Reveal>
            <RevealGroup className="lg:col-span-8">
              {FAQ.map((f) => (
                <RevealItem key={f.q}>
                  <details className="group border-t border-line/50 py-5 last:border-b">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 [&::-webkit-details-marker]:hidden">
                      <span className="text-lg text-ink sm:text-xl">{f.q}</span>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/35 text-gold transition-transform duration-300 group-open:rotate-45">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>
                    <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted">
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
