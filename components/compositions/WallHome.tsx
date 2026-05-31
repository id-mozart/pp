"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

export function WallHome() {
  const [broken, setBroken] = useState(false);
  const cells = Array.from({ length: 120 });

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32 text-center">
        <Reveal className="container-shell">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ember">
            Стіна відмов
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] leading-tight text-ink">
            9 з 10 B2B-клієнтів кажуть{" "}
            <span className="text-ember">«НІ»</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            …поки продаж тримається на інтуїції. Система перетворює відмови на
            керовану воронку.
          </p>
          <button
            onClick={() => setBroken((b) => !b)}
            className="btn btn-primary mt-6"
          >
            {broken ? "Зібрати стіну" : "Пробити стіну системою"}
          </button>
        </Reveal>

        <div className="container-shell mt-12">
          <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-10">
            {cells.map((_, i) => {
              const isYes = broken && i % 9 === 4;
              return (
                <div
                  key={i}
                  className={`grid aspect-square place-items-center rounded-[3px] font-mono text-[0.6rem] transition-all duration-500 sm:text-xs ${
                    isYes ? "bg-gold text-oncontrast" : "bg-surface text-faint"
                  }`}
                  style={{ transitionDelay: `${(i % 10) * 25}ms` }}
                >
                  {isYes ? "ТАК" : "НІ"}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {broken && (
        <Reveal>
          <section className="relative grain border-t border-line/50 bg-surface section-pad">
            <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                  За стіною — метод
                </span>
                <h2 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
                  Кожне «НІ» — це не кінець, а слабке місце процесу
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">
                  Діагностика → структура → переговори без тиску → впровадження.
                  Так 80–90% відмов перетворюються на прогнозовану воронку угод.
                </p>
                <Link href="/consultation#book" className="btn btn-primary mt-6">
                  Перетворити НІ на ТАК <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/ph/p7.jpg"
                alt=""
                className="aspect-[16/10] w-full rounded-2xl object-cover"
              />
            </div>
          </section>
        </Reveal>
      )}
    </>
  );
}
