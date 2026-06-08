"use client";

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";
import { Formats } from "@/components/sections/Formats";
import { HeroSlideshowBg } from "@/components/sections/HeroSlideshowBg";
import { clients, contacts } from "@/lib/content";

const HERO_SLIDES = [
  "/brand/Tania3.webp",
  "/brand/Tania1-2.webp",
  "/brand/Tania1-3.webp",
];

const PHASES = [
  { n: "01", t: "Діагностика", d: "Знаходимо, що саме блокує продажі: меседж, офер, переговори чи процес." },
  { n: "02", t: "Структура", d: "Будуємо процес, скрипти та методологію під ваш бізнес — не шаблон." },
  { n: "03", t: "Переговори", d: "Тренуємо команду на реальних кейсах. Без тиску й маніпуляцій." },
  { n: "04", t: "Впровадження", d: "Супровід до результату: воронка стає прозорою й керованою." },
];

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

export function MethodHome() {
  return (
    <>
      {/* HERO — full-bleed slideshow + right-aligned manifesto */}
      <section className="relative grain min-h-[94vh] overflow-hidden">
        <HeroSlideshowBg
          images={HERO_SLIDES}
          overlay={
            <>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(16,15,12,0.38) 0%, rgba(16,15,12,0.6) 44%, rgba(16,15,12,0.95) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(16,15,12,0.88) 0%, rgba(16,15,12,0.05) 55%)",
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(16,15,12,0.7) 0%, rgba(16,15,12,0) 100%)",
                }}
              />
            </>
          }
        />
        <div className="container-shell relative grid min-h-[94vh] items-center gap-10 pb-20 pt-32 lg:grid-cols-12">
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
          </Reveal>
        </div>
      </section>

      {/* METHOD — 4 phases (full-width heading, no graphic) */}
      <section
        id="method"
        className="relative grain border-y border-line/50 bg-surface section-pad"
      >
        <div className="container-shell relative">
          <Reveal className="mb-14 flex max-w-4xl flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Метод · 4 фази
            </span>
            <h2 className="text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.06] text-ink">
              Від хаосу до системи — за чотири фази
            </h2>
            <p className="max-w-2xl text-lg leading-relaxed text-muted">
              Кожна фаза — окремий вузол системи. Разом вони роблять воронку
              прозорою та керованою.
            </p>
          </Reveal>
          <RevealGroup className="relative grid gap-10 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-gold/10 via-gold/50 to-gold/10 md:block" />
            {PHASES.map((p) => (
              <RevealItem key={p.n}>
                <div className="relative">
                  <div className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-gold/40 bg-canvas font-mono text-gold">
                    {p.n}
                  </div>
                  <h3 className="mt-5 text-xl text-ink">{p.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.d}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
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

      {/* FORMATS — ways of cooperation */}
      <Formats />

      {/* PROOF — evidence */}
      <section className="relative grain border-y border-line/50 bg-surface section-pad">
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

      {/* CLIENTS — logo wall */}
      <section id="clients" className="section-pad">
        <div className="container-shell">
          <Reveal className="mb-12 flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Клієнти
            </span>
            <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Метод працює там, де ставки високі
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              <span className="text-gradient-gold font-display">90%</span> клієнтів
              продовжують співпрацю з нами та рекомендують нас своїм партнерам.
            </p>
          </Reveal>
          <RevealGroup className="grid grid-cols-3 items-center gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-y-12 lg:grid-cols-6">
            {clients.logoTiles.map((logo) => (
              <RevealItem key={logo.name}>
                <div className="flex items-center justify-center" title={logo.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="logo-wall-img"
                    loading="lazy"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-pretty text-sm italic leading-relaxed text-muted">
              {clients.caption}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ARCHITECT — dossier (more source detail) */}
      <section className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-2xl border border-gold/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/tania-portrait.jpg"
                alt="Тетяна Пан"
                className="aspect-[4/5] w-full object-cover object-top grayscale contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gold/70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-canvas/25" />
              <div className="grain absolute inset-0 opacity-40" />
              <div className="absolute bottom-4 left-4 font-mono text-[0.62rem] uppercase tracking-widest text-canvas/90">
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
                Привіт! Понад 25 років я в продажах і керівництві, 17+ років навчаю
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

      {/* AUDIENCES + CTA */}
      <section className="relative grain border-t border-line/50 section-pad">
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
    </>
  );
}
