"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";
import { ClientsWall } from "@/components/sections/ClientsWall";
import { Testimonials } from "@/components/sections/Testimonials";
import { BookingCalendar } from "@/components/sections/BookingCalendar";
import { ContactForm } from "@/components/sections/ContactForm";
import { smoothScrollToEl } from "@/lib/smoothScroll";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, CTAG_BG, gradText } from "@/lib/ember";

/**
 * Main 5 · «ГОДИНА» — авторська версія: сторінка-сесія.
 * Уся драматургія — навколо однієї 60-хвилинної консультації: відвідувач
 * «проживає» годину ще до бронювання. Таймкоди живуть лише в рейці-хронометрі
 * та дрібних маркерах; календар вбудовано просто на головну (#book).
 */

/* ---------- спільні дрібниці ---------- */

/** Янтарна «рампа» — театральні footlights, наскрізний світловий мотив. */
function Ramp() {
  return (
    <div aria-hidden className="relative mx-auto h-px w-full max-w-5xl">
      <div className="absolute inset-0" style={{ background: GRAD_GOLD, opacity: 0.55 }} />
      <div
        className="absolute inset-x-8 -top-3 h-6 blur-lg"
        style={{ background: GRAD_GOLD, opacity: 0.22 }}
      />
    </div>
  );
}

/** Мono-маркер хвилини над секцією («−00:01 · ПЕРЕД ГОДИНОЮ»). */
function MinuteMark({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.3em] text-faint">
      {children}
    </span>
  );
}

function goTo(e: React.MouseEvent, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  smoothScrollToEl(el);
}

/* ---------- хронометр-рейка (desktop) ---------- */

// Рейка-хронометр: ті самі таймстампи, що й на фазах таймлайну справа.
const RAIL = [
  { t: "00:00", id: "hour" },
  { t: "15:00", id: "hp-1" },
  { t: "40:00", id: "hp-2" },
  { t: "60:00", id: "after" },
];

function ChronoRail() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    RAIL.forEach((r) => {
      const el = document.getElementById(r.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Хвилини сесії"
      className="fixed left-7 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-6 2xl:flex"
    >
      {RAIL.map((r) => {
        const on = active === r.id;
        return (
          <a
            key={r.id}
            href={`#${r.id}`}
            onClick={(e) => goTo(e, r.id)}
            className="group flex items-center gap-2.5"
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-all duration-500"
              style={{
                background: on ? "#E2A638" : "rgba(82,68,52,.8)",
                boxShadow: on ? "0 0 10px rgba(226,166,56,.8)" : "none",
              }}
            />
            <span
              className={`font-mono text-[0.62rem] tracking-[0.2em] transition-colors duration-500 ${on ? "" : "text-faint group-hover:text-muted"}`}
              style={on ? gradText(GRAD_ACC) : undefined}
            >
              {r.t}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

/* ---------- дані ---------- */

/* Репліки — прямою мовою клієнта; topic іде у префіл поля «Запит» */
const REPLICAS = [
  { say: "Продажі низькі, і ніхто не розуміє, чому.", topic: "Низькі продажі" },
  { say: "Цього місяця план є, наступного — провал.", topic: "Нестабільні продажі" },
  {
    say: "80–90% B2B-клієнтів відмовляють ще на вході.",
    topic: "80–90% відмов від B2B-клієнтів",
  },
  { say: "«Купимо. Якщо дасте знижку».", topic: "Клієнти вимагають знижки" },
  {
    say: "Команда працює, а стабільного результату немає.",
    topic: "Команда не дає стабільного результату",
  },
];

const HOUR_PHASES = [
  {
    time: "00:00 — 15:00",
    title: "Діагностика",
    text: "Знаходимо, що саме блокує продажі: меседж, офер, переговори чи процес. Ви розповідаєте — Тетяна ставить точні запитання.",
    photo: "/brand/youwill1.webp",
  },
  {
    time: "15:00 — 40:00",
    title: "Розбір вашої ситуації",
    text: "Дивимось на реальні діалоги, відмови та знижки. Знаходимо місце, де клієнти кажуть «ні» — і чому.",
    photo: "/brand/youwill2.webp",
  },
  {
    time: "40:00 — 60:00",
    title: "План дій і скрипти",
    text: "Ви виходите з простим планом наступних кроків і конкретними фразами під ваші кейси — застосувати можна того ж дня.",
    photo: "/brand/youwill3.webp",
  },
];

const PERSON_FACTS = [
  { v: "25+", l: "років у продажах — «Олімп», Danone, Coca-Cola, власні магазини" },
  { v: "17+", l: "років навчає продавати та вести переговори" },
  { v: "№2", l: "у ТОП тренерів України — UBA 2023" },
  { v: "15 000+", l: "учнів застосовують технологію продажів" },
];

const LEDGER = [
  { v: "5% → 20–30%", l: "зростання конверсії після онлайн-курсів" },
  { v: "+20% → ×5", l: "максимальне зафіксоване зростання продажів" },
  { v: "90%", l: "клієнтів продовжують співпрацю та рекомендують" },
];

const PATHS = [
  {
    kicker: "Тренінги",
    title: (
      <>
        Корпоративні{" "}
        <em className="italic" style={gradText(GRAD_ACC)}>
          тренінги
        </em>
      </>
    ),
    photo: "/brand/Tania1-2.webp",
    pos: "30% 20%",
    result: "+20% → ×5",
    who: "Для керівників і команд — на ваших реальних кейсах.",
    href: "/b2b",
  },
  {
    kicker: "Курси",
    title: (
      <>
        Онлайн-
        <em className="italic" style={gradText(GRAD_ACC)}>
          курси
        </em>
      </>
    ),
    photo: "/brand/Tania1-3.webp",
    pos: "42% 15%",
    result: "5% → 20–30%",
    who: "Для власників МСБ і менеджерів — застосовуєте вже сьогодні.",
    href: "/courses",
  },
  {
    kicker: "Менторинг",
    title: (
      <>
        Менторинг та{" "}
        <em className="italic" style={gradText(GRAD_ACC)}>
          коучинг
        </em>
      </>
    ),
    photo: "/brand/1M6A0522.webp",
    pos: "center 18%",
    result: "+20% → ×2",
    who: "Особисто з Тетяною — індивідуально або в групі до 4 осіб.",
    href: "/consultation",
  },
];

const HONEST_FAQ = [
  {
    q: "Це продажний дзвінок під виглядом консультації?",
    a: "Ні. Без тиску й без маніпуляцій: за 60 хвилин ви отримуєте план дій і скрипти — незалежно від того, чи працюватимемо ми далі.",
  },
  {
    q: "Моя ніша специфічна — спрацює?",
    a: "25+ років продажів, 6 галузей — від FMCG до телекому та енергетики. Розбір будується на ваших реальних кейсах, а не на шаблоні.",
  },
  {
    q: "Що я матиму на руках після дзвінка?",
    a: "Простий план наступних кроків і конкретні скрипти, які можна застосувати того ж дня.",
  },
  {
    q: "Мені потрібен тренінг для команди, а не консультація.",
    a: "Тим більше почніть із години: діагностика покаже, який формат дасть результат — тренінг, курс чи менторинг.",
  },
];

/* ---------- композиція ---------- */

export function Main5Home() {
  function pickReplica(e: React.MouseEvent, topic: string) {
    try {
      sessionStorage.setItem("lead_topic", topic);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("pp:lead-topic", { detail: topic }));
    goTo(e, "book");
  }

  return (
    <>
      <ChronoRail />

      {/* HERO «60:00» — одна година, один CTA */}
      <section className="relative grain overflow-hidden">
        {/* гігантський контурний хронометр на тлі */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-16 select-none font-mono text-[clamp(9rem,24vw,22rem)] font-semibold leading-none tracking-tight"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(226,166,56,.14)",
          }}
        >
          60:00
        </div>
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(56vw 56vw at 84% -10%, rgb(226 166 56 / 0.12), transparent 62%), radial-gradient(44vw 44vw at -8% 110%, rgb(214 106 44 / 0.09), transparent 62%)",
          }}
        />
        <div className="container-shell relative grid items-center gap-12 pb-20 pt-32 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-40">
          <Reveal className="flex flex-col gap-7 lg:col-span-7">
            <span className="eyebrow">Онлайн 1:1 · 60 хвилин · план дій і скрипти</span>
            <h1 className="font-display text-[clamp(2.6rem,5.6vw,5rem)] leading-[1.04] text-ink">
              Одна{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                година
              </em>{" "}
              — і у ваших продажів є план
            </h1>
            <span
              aria-hidden
              className="h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <p className="max-w-lg font-display text-lg italic leading-relaxed text-ink/85">
              Перша консультація з Тетяною Пан: діагностика того, що саме блокує
              продажі, розбір вашої ситуації та конкретні наступні кроки. Без
              тиску. Без маніпуляцій.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <a href="#book" onClick={(e) => goTo(e, "book")} className="btn btn-primary">
                Забронювати годину <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#hour" onClick={(e) => goTo(e, "hour")} className="btn btn-ghost">
                Що відбувається за 60 хвилин ↓
              </a>
            </div>
            <span
              className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
              style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
            >
              Найближчий вільний слот —{" "}
              <b className="font-semibold" style={gradText(GRAD_ACC)}>
                у календарі нижче
              </b>
            </span>
          </Reveal>

          {/* портретна плита */}
          <Reveal delay={0.08} className="lg:col-span-5">
            <div
              className="relative overflow-hidden rounded-[14px] border border-line/60"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <span
                aria-hidden
                className="absolute left-6 top-0 z-10 h-[3px] w-16 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/portrait.png"
                alt="Тетяна Пан — засновниця Pan&Partners"
                className="aspect-[4/5] w-full object-cover"
                style={{ objectPosition: "center 18%" }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-[45%]"
                style={{
                  background:
                    "linear-gradient(0deg,rgba(11,7,4,.88) 0%,rgba(12,8,5,.3) 60%,transparent 100%)",
                }}
              />
              <div className="grain absolute inset-0 opacity-20" />
              <div className="absolute left-6 right-6 top-5 z-10 flex items-center justify-between font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em]">
                <span style={gradText(GRAD_ACC)}>Ваша година · 1:1</span>
                <span className="h-2 w-2 rounded-full" style={{ background: GRAD_GOLD }} />
              </div>
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
                  Тетяна Пан
                </span>
              </div>
            </div>
          </Reveal>
        </div>
        <Ramp />
      </section>

      {/* −00:01 · ПЕРЕД ГОДИНОЮ — репліки, з яких усе починається */}
      <section id="before" className="relative grain section-pad">
        <div className="container-shell">
          <Reveal className="flex flex-col gap-4">
            <MinuteMark>−00:01 · Перед годиною</MinuteMark>
            <h2 className="max-w-3xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Пʼять реплік, з яких ця{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                година
              </em>{" "}
              починається
            </h2>
            <p className="max-w-xl font-display text-lg italic leading-relaxed text-muted">
              Впізнали свою? Натисніть — і вона вже буде в полі «Запит» поруч із
              календарем.
            </p>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {REPLICAS.map((r) => (
              <RevealItem key={r.topic}>
                <button
                  type="button"
                  onClick={(e) => pickReplica(e, r.topic)}
                  className="group relative h-full w-full rounded-[12px] border border-line/70 p-6 text-left transition-colors duration-500 hover:border-gold/50"
                  style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                >
                  <p className="text-pretty font-display text-[1.15rem] italic leading-snug text-ink/90">
                    — {r.say}
                  </p>
                  <span
                    className="mt-4 inline-block font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em] text-faint transition-colors duration-500 group-hover:text-gold"
                  >
                    Це про нас → обрати час
                  </span>
                </button>
              </RevealItem>
            ))}
            <RevealItem>
              <div className="flex h-full items-center rounded-[12px] p-6">
                <p className="text-pretty font-display text-[1.2rem] italic leading-snug">
                  <span style={gradText(GRAD_ACC)}>
                    Кожна репліка — не вирок, а симптом.
                  </span>{" "}
                  <span className="text-ink/85">
                    За 60 хвилин ми знаходимо причину.
                  </span>
                </p>
              </div>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* 00:00–60:00 · ХВИЛИНА ЗА ХВИЛИНОЮ — ядро сторінки */}
      <section id="hour" className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell">
          <Reveal className="flex flex-col gap-4">
            <MinuteMark>00:00 · Хвилина за хвилиною</MinuteMark>
            <span className="eyebrow">Що відбувається за 60 хвилин</span>
            <h2 className="max-w-3xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Це не «знайомство». Це{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                робоча сесія
              </em>
            </h2>
          </Reveal>

          {/* таймлайн із золотою рейкою */}
          <div className="relative mt-12">
            <span
              aria-hidden
              className="absolute bottom-6 left-[7px] top-2 w-[2px] rounded-full lg:left-1/2 lg:-translate-x-1/2"
              style={{ background: GRAD_GOLD, opacity: 0.5 }}
            />
            <div className="flex flex-col gap-12 lg:gap-16">
              {HOUR_PHASES.map((p, i) => (
                <Reveal
                  key={p.title}
                  delay={0.05 * i}
                  className={`relative grid items-center gap-6 pl-10 lg:grid-cols-2 lg:gap-20 lg:pl-0`}
                >
                  {/* якір для рейки-хронометра (фази 2 і 3) */}
                  {i > 0 && (
                    <span id={`hp-${i}`} aria-hidden className="absolute -top-24 h-2 w-2" />
                  )}
                  {/* вузол на рейці */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 grid h-4 w-4 place-items-center rounded-full border border-gold/50 lg:left-1/2 lg:-translate-x-1/2"
                    style={{ background: "#0b0a09" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: GRAD_GOLD }} />
                  </span>
                  <div className={i % 2 ? "lg:order-2 lg:pl-14" : "lg:pr-14 lg:text-right"}>
                    <p
                      className="font-mono text-[0.7rem] font-medium tracking-[0.22em]"
                      style={gradText(GRAD_ACC)}
                    >
                      {p.time}
                    </p>
                    <h3 className="mt-3 font-display text-[1.7rem] font-medium leading-tight text-ink">
                      {p.title}
                    </h3>
                    <p className={`mt-3 max-w-md text-base leading-relaxed text-muted ${i % 2 ? "" : "lg:ml-auto"}`}>
                      {p.text}
                    </p>
                  </div>
                  <div className={i % 2 ? "lg:order-1 lg:pr-14" : "lg:pl-14"}>
                    <div
                      className="relative overflow-hidden rounded-[14px] border border-line/60"
                      style={{ boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.photo}
                        alt=""
                        aria-hidden
                        className="aspect-[16/9] w-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(0deg,rgba(11,7,4,.55) 0%,rgba(12,8,5,.12) 55%,rgba(13,9,5,.3) 100%)",
                        }}
                      />
                      <div className="grain absolute inset-0 opacity-20" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* що на руках */}
          <Reveal delay={0.1} className="mt-14">
            <div
              className="relative flex flex-col items-start justify-between gap-6 rounded-[14px] border border-line/70 p-7 sm:p-9 lg:flex-row lg:items-center"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <span
                aria-hidden
                className="absolute left-8 top-0 h-[3px] w-20 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <div>
                <p className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.22em] text-faint">
                  На руках після дзвінка
                </p>
                <p className="mt-3 max-w-xl font-display text-xl italic leading-snug text-ink">
                  План дій{" "}
                  <span className="text-faint">·</span>{" "}
                  скрипти під ваші кейси{" "}
                  <span className="text-faint">·</span>{" "}
                  <span style={gradText(GRAD_ACC)}>чіткий перший крок</span>
                </p>
              </div>
              <a
                href="#book"
                onClick={(e) => goTo(e, "book")}
                className="btn btn-primary shrink-0"
              >
                Забронювати годину <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ХТО ПО ТОЙ БІК ЕКРАНА — Тетяна у прожекторі */}
      <section id="person" className="relative grain section-pad">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal delay={0.08} className="relative lg:col-span-5">
            <div className="relative">
              {/* конус прожектора */}
              <div
                aria-hidden
                className="absolute -inset-x-10 -top-12 bottom-0"
                style={{
                  background:
                    "radial-gradient(60% 70% at 50% 0%, rgba(226,166,56,.16), transparent 70%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/Tania4.webp"
                alt="Тетяна Пан — засновниця Pan&Partners"
                className="relative z-[1] mx-auto block w-[72%] max-w-[320px]"
                loading="lazy"
              />
              {/* світло на підлозі */}
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
              <span className="eyebrow">Ваші 60 хвилин — з цією людиною</span>
              <h2 className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] text-ink">
                Тетяна{" "}
                <em className="italic" style={gradText(GRAD_ACC)}>
                  Пан
                </em>
              </h2>
              <p className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">
                Власниця Pan&amp;Partners · експертка з продажів та переговорів
              </p>
            </Reveal>

            <RevealGroup className="mt-9 grid gap-3 sm:grid-cols-2">
              {PERSON_FACTS.map((f) => (
                <RevealItem key={f.v}>
                  <div
                    className="relative h-full rounded-[14px] border border-line/70 p-5"
                    style={{ background: CARD_BG }}
                  >
                    <span
                      aria-hidden
                      className="absolute left-5 top-0 h-[3px] w-10 -translate-y-1/2 rounded-full"
                      style={{ background: GRAD_GOLD }}
                    />
                    <div className="font-display text-[1.7rem] leading-none" style={gradText(GRAD_ACC)}>
                      {f.v}
                    </div>
                    <p className="mt-2 text-sm leading-snug text-muted">{f.l}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.08} className="mt-10">
              <figure className="relative max-w-2xl pl-7">
                <span
                  aria-hidden
                  className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <blockquote
                  className="text-pretty font-display text-[clamp(1.4rem,2.3vw,1.9rem)] font-medium italic leading-[1.3]"
                  style={gradText(GRAD_ACC)}
                >
                  «Без тиску. Без маніпуляцій. Природно та легко».
                </blockquote>
                <figcaption className="mt-4 flex items-end gap-4">
                  <span
                    className="text-3xl leading-none text-gold"
                    style={{ fontFamily: "var(--font-caveat)" }}
                  >
                    Тетяна Пан
                  </span>
                  <span className="pb-0.5 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-faint">
                    засновниця
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 60:01 · ПІСЛЯ ГОДИНИ — леджер результатів */}
      <section id="after" className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="flex flex-col gap-4">
            <MinuteMark>60:01 · Що змінюється далі</MinuteMark>
            <span className="eyebrow">Результати тих, хто почав з однієї години</span>
          </Reveal>
          <RevealGroup className="mt-10 max-w-3xl">
            {LEDGER.map((r) => (
              <RevealItem key={r.l}>
                <div className="flex flex-col gap-1 border-t border-line/50 py-6 last:border-b sm:flex-row sm:items-baseline sm:gap-8">
                  <div
                    className="shrink-0 font-display text-[clamp(1.9rem,3.4vw,2.7rem)] leading-none sm:w-72"
                    style={gradText(GRAD_ACC)}
                  >
                    {r.v}
                  </div>
                  <p className="text-base leading-relaxed text-muted">{r.l}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.08} className="mt-8 flex flex-col gap-3">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
              Джерела: рейтинг UBA 2023 · внутрішня статистика проєктів Pan&amp;Partners
            </p>
            <p className="max-w-xl font-display text-lg italic leading-relaxed text-muted">
              Це не магія однієї розмови — це система, яка починається з
              правильної діагностики.
            </p>
          </Reveal>
        </div>
      </section>

      {/* СВІДЧЕННЯ — голоси клієнтів (спільний компонент) */}
      <Testimonials />

      {/* ДОСВІД НАВПРОТИ ВАС — стіна логотипів */}
      <ClientsWall logoWall />

      {/* 61:00 · ЩО ДАЛІ — три шляхи після години */}
      <section id="next" className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell">
          <Reveal className="flex flex-col gap-4">
            <MinuteMark>61:00 · Що далі після години</MinuteMark>
            <h2 className="max-w-3xl text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Консультація — це двері.{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                За ними — три шляхи
              </em>
            </h2>
            <p className="max-w-xl font-display text-lg italic leading-relaxed text-muted">
              Якщо після години захочеться йти далі — є три глибини занурення.
              Але всі вони починаються з одного й того самого кроку.
            </p>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {PATHS.map((p, i) => (
              <RevealItem key={p.kicker}>
                <Link
                  href={p.href}
                  className="group relative block overflow-hidden rounded-[14px] border border-line/60 transition-colors duration-500 hover:border-gold/50"
                  style={{ aspectRatio: "4 / 5.2", boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.photo}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-[1.05]"
                    style={{ objectPosition: p.pos }}
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
                    className="absolute inset-x-0 bottom-0 h-[72%]"
                    style={{
                      background:
                        "linear-gradient(0deg,rgba(11,7,4,.88) 0%,rgba(12,8,5,.30) 60%,transparent 100%)",
                    }}
                  />
                  <div className="absolute left-6 right-6 top-5 flex items-center justify-between font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em]">
                    <span style={gradText(GRAD_ACC)}>
                      0{i + 1} — {p.kicker}
                    </span>
                    <span className="h-2 w-2 rounded-full" style={{ background: GRAD_GOLD }} />
                  </div>
                  <div
                    className="absolute inset-x-4 bottom-4 rounded-[14px] border border-line/70 p-6"
                    style={{ background: CARD_BG }}
                  >
                    <span
                      aria-hidden
                      className="absolute left-6 top-0 h-[3px] w-16 -translate-y-1/2 rounded-full"
                      style={{ background: GRAD_GOLD }}
                    />
                    <h3 className="font-display text-[1.55rem] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 font-display text-[0.95rem] italic leading-snug text-muted">
                      {p.who}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center gap-2 rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                        style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                      >
                        Результат{" "}
                        <b className="font-semibold" style={gradText(GRAD_ACC)}>
                          {p.result}
                        </b>
                      </span>
                    </div>
                    <div className="mt-5 border-t border-line/60 pt-4">
                      <span className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.16em] text-faint">
                        Початок — та сама перша година
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <a href="#book" onClick={(e) => goTo(e, "book")} className="btn btn-primary">
              Почати з години <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ЧЕСНІ ВІДПОВІДІ — чотири заперечення перед слотом */}
      <section id="faq" className="relative grain section-pad">
        <div className="container-shell">
          <Reveal className="flex flex-col gap-4">
            <span className="eyebrow">Перед тим, як обрати слот</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Чесні{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                відповіді
              </em>
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-4 md:grid-cols-2">
            {HONEST_FAQ.map((f) => (
              <RevealItem key={f.q}>
                <div
                  className="relative h-full rounded-[14px] border border-line/70 p-7"
                  style={{ background: CARD_BG }}
                >
                  <span
                    aria-hidden
                    className="absolute left-7 top-0 h-[3px] w-12 -translate-y-1/2 rounded-full"
                    style={{ background: GRAD_GOLD }}
                  />
                  <p className="font-display text-xl font-medium italic leading-snug text-ink">
                    «{f.q}»
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-muted">{f.a}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* РАМПА + ОБЕРІТЬ СВОЮ ГОДИНУ — кульмінація (#book усередині) */}
      <Ramp />
      <BookingCalendar
        title={
          <>
            Оберіть свою{" "}
            <em className="italic" style={gradText(GRAD_ACC)}>
              годину
            </em>
          </>
        }
        lead="Оберіть день, потім час. Поле «Запит» — необовʼязкове, але корисне."
      />

      {/* запасний канал — класична форма */}
      <ContactForm />

      {/* ФІНАЛ-МАНІФЕСТ — завіса */}
      <section className="relative grain overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/Tania1-2.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-30"
          style={{ objectPosition: "30% 25%" }}
          loading="lazy"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,9,8,.97) 0%, rgba(9,9,8,.72) 45%, rgba(9,9,8,.97) 100%)",
          }}
        />
        <div className="container-shell relative flex flex-col items-center gap-7 py-28 text-center lg:py-36">
          <p
            className="max-w-4xl text-balance font-display text-[clamp(1.9rem,4.6vw,3.6rem)] font-medium italic leading-[1.15]"
            style={gradText(GRAD_GOLD)}
          >
            Без тиску. Без маніпуляцій.
            <br />
            Природно та легко.
          </p>
          <p className="font-display text-lg italic text-ink/85">
            Перший крок триває одну годину.
          </p>
          <span
            className="text-4xl leading-none text-gold"
            style={{ fontFamily: "var(--font-caveat)" }}
          >
            Тетяна Пан
          </span>
          <a
            href="#book"
            onClick={(e) => goTo(e, "book")}
            className="font-display text-lg font-medium italic transition-transform duration-500 ease-lux hover:-translate-y-0.5"
            style={gradText(GRAD_ACC)}
          >
            забронювати годину ↑
          </a>
        </div>
        <Ramp />
      </section>
    </>
  );
}
