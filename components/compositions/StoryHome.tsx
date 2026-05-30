"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { about, contacts } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Quote } from "@/components/ui/icons";

function Chapter({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16">
      <Reveal>
        <div className="flex items-baseline gap-4 border-t border-line/50 pt-5">
          <span className="font-mono text-sm text-gold">{n}</span>
          <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] leading-tight text-ink">
            {title}
          </h2>
        </div>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted [&>p]:text-pretty">
          {children}
        </div>
      </Reveal>
    </section>
  );
}

export function StoryHome() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[65] h-1 bg-gold transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
      <article className="container-shell max-w-3xl pb-24 pt-32">
        <Reveal className="flex flex-col gap-6">
          <span className="eyebrow">Історія · як ми працюємо</span>
          <h1 className="text-[clamp(2.4rem,5.2vw,4.4rem)] leading-[1.04] text-ink">
            Як перетворити нестабільні продажі на систему, якій довіряють
          </h1>
          <p className="text-xl leading-relaxed text-muted">
            Більшість команд втрачають угоди не тому, що продукт слабкий, а тому,
            що продаж тримається на інтуїції окремих людей. Ось як це змінюється.
          </p>
          <div className="flex items-center gap-3 text-sm text-faint">
            <span className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-gold/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/tania-portrait.jpg"
                alt={about.name}
                className="h-full w-full object-cover object-top"
              />
            </span>
            <span>
              {about.name} · власниця Pan&amp;Partners · 25+ років у продажах
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <div className="relative overflow-hidden rounded-[24px] border border-gold/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/Tania3.jpg"
              alt="Pan&Partners"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </Reveal>

        <Chapter n="01" title="Проблема: продажі без системи">
          <p>
            <span className="float-left mr-3 font-display text-6xl leading-[0.7] text-gold">
              К
            </span>
            оли продажі залежать від настрою чи окремих «зірок», результат
            неможливо прогнозувати. Знижки замінюють аргументи, 80–90% B2B-клієнтів
            кажуть «ні», а команда не дає стабільного результату з місяця в місяць.
          </p>
          <p>
            Перший крок — побачити, що саме блокує продажі зараз: меседж, офер,
            переговори чи процес. Без цієї діагностики будь-яке навчання — це
            постріл наосліп.
          </p>
        </Chapter>

        <Reveal className="my-12">
          <figure className="border-l-2 border-gold/50 pl-6">
            <Quote className="mb-2 h-7 w-7 text-gold/30" />
            <blockquote className="text-pretty font-display text-2xl leading-snug text-gradient-gold sm:text-3xl">
              Без тиску. Без маніпуляцій. Природно та легко.
            </blockquote>
          </figure>
        </Reveal>

        <Chapter n="02" title="Підхід: структура замість інтуїції">
          <p>
            Ми будуємо методологію під ваш бізнес — не стандартний тренінг, а
            систему: чіткі схеми переговорів, підготовка позицій, робота з тиском і
            запереченнями, практика на реальних кейсах вашої компанії.
          </p>
          <div className="my-6 grid grid-cols-3 gap-4 border-y border-line/50 py-6 text-center">
            {[
              { v: "5% → 30%", l: "конверсія" },
              { v: "+20% → ×5", l: "продажі" },
              { v: "×2", l: "конверсія угод" },
            ].map((s) => (
              <div key={s.l}>
                <div className="stat-number text-2xl sm:text-3xl">{s.v}</div>
                <div className="mt-1 text-xs text-muted">{s.l}</div>
              </div>
            ))}
          </div>
          <p>
            Далі — впровадження та супровід між зустрічами, щоб навички
            перетворилися на щоденну практику команди, а не на конспект, що пилиться.
          </p>
        </Chapter>

        <Chapter n="03" title="Результат: передбачуване зростання">
          <p>
            90% клієнтів продовжують співпрацю та рекомендують нас партнерам. За 17+
            років ми навчили команди в 6 галузях — від телеком-гігантів до малого та
            середнього бізнесу з оборотом €500–700K+ на місяць.
          </p>
          <p>
            Продажі стають прозорими й керованими: ви бачите воронку, розумієте
            кроки й отримуєте результат, який можна повторити.
          </p>
        </Chapter>

        <Reveal className="mt-16 border-t border-line/50 pt-10">
          <h2 className="text-[clamp(1.8rem,4vw,3rem)] leading-tight text-ink">
            Почнімо з вашої ситуації
          </h2>
          <p className="mt-3 max-w-xl text-lg text-muted">
            Забронюйте фокусну консультацію — розберу ваш випадок і дам конкретний
            план наступних кроків.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/consultation#book" className="btn btn-primary">
              Забронювати консультацію <ArrowRight className="h-4 w-4" />
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
      </article>
    </>
  );
}
