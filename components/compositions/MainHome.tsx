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
              <Link href="#formats" className="btn btn-ghost">
                Як це працює
              </Link>
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

      {/* MENTORING — особистий бізнес-менторинг (окрема послуга) */}
      <section id="mentoring" className="relative grain section-pad">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal delay={0.08} className="lg:order-2 lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-[var(--shadow-lux)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/1M6A0522.webp"
                alt="Тетяна Пан — особистий бізнес-менторинг"
                className="aspect-[4/5] w-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 font-mono text-[0.62rem] uppercase tracking-widest text-ink/90">
                менторинг із Тетяною Пан
              </div>
            </div>
          </Reveal>
          <div className="lg:order-1 lg:col-span-7">
            <Reveal className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                Окрема послуга
              </span>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                Особистий <span className="text-gradient-gold">бізнес-менторинг</span>
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                Індивідуальна робота з Тетяною Пан для власників та керівників:
                навчання, розбір саме ваших кейсів і підтримка між зустрічами — у
                вашому темпі та під вашу ціль.
              </p>
            </Reveal>
            <RevealGroup className="mt-8 flex flex-col">
              {[
                { k: "Формат", v: "Індивідуально або в міні-групі до 4 осіб · онлайн чи офлайн" },
                { k: "Для кого", v: "Власники бізнесу та керівники продажів" },
                { k: "Результат", v: "Зростання продажів від +20% до ×2" },
                { k: "Як", v: "Методологія продажів, розбір бізнес-кейсів, підтримка між зустрічами" },
              ].map((d) => (
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
            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
              <Link href="/consultation#book" className="btn btn-primary">
                Записатися на менторинг <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#contact" className="btn btn-ghost">
                Поставити запитання
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — social proof voices (with the proof tiles) */}
      <Testimonials stats={PROOF} />

      {/* FORMATS — offer: three services as story-style cover cards */}
      <FormatsShowcase />

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
