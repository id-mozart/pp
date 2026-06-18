"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";
import { BookingCalendar } from "@/components/sections/BookingCalendar";
import { ArchitectSection } from "@/components/sections/ArchitectSection";
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
  { t: "60:00", id: "book" },
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
      <section id="hour" className="relative grain border-t border-line/50 bg-surface py-14 lg:py-20">
        <div className="container-shell">
          <Reveal className="flex flex-col gap-3">
            <MinuteMark>00:00 · Хвилина за хвилиною</MinuteMark>
            <span className="eyebrow">Що відбувається за 60 хвилин</span>
            <h2 className="max-w-3xl text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.05] text-ink">
              Це не «знайомство». Це{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                робоча сесія
              </em>
            </h2>
          </Reveal>

          {/* 3 фази в ряд — компактно, на один екран */}
          <div className="relative mt-9">
            {/* горизонтальна рейка-хронометр (десктоп) */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-[9px] hidden h-[2px] rounded-full md:block"
              style={{ background: GRAD_GOLD, opacity: 0.35 }}
            />
            <RevealGroup className="grid gap-6 md:grid-cols-3 lg:gap-8">
              {HOUR_PHASES.map((p, i) => (
                <RevealItem key={p.title}>
                  <div id={i > 0 ? `hp-${i}` : undefined} className="relative">
                    {/* точка — лишається на лінії */}
                    <span
                      aria-hidden
                      className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-gold/50"
                      style={{ background: "#0b0a09" }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: GRAD_GOLD }}
                      />
                    </span>
                    {/* діапазон — зміщено вниз, над назвою, щоб рейка не перетинала цифри */}
                    <p
                      className="mt-6 font-mono text-[0.66rem] font-medium tracking-[0.2em]"
                      style={gradText(GRAD_ACC)}
                    >
                      {p.time}
                    </p>
                    <h3 className="mt-2 font-display text-[1.45rem] font-medium leading-tight text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted">
                      {p.text}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          {/* що на руках */}
          <Reveal delay={0.1} className="mt-8">
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

      {/* ХТО ПО ТОЙ БІК ЕКРАНА — той самий блок про Тетяну, що й на головній */}
      <ArchitectSection id="person" />

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
