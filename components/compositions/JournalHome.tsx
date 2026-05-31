"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Check } from "@/components/ui/icons";

const hand = { fontFamily: "var(--font-caveat)" } as const;

function Tape({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute h-6 w-20 rotate-[-4deg] bg-gold/25 ${className}`}
      style={{ backdropFilter: "blur(1px)" }}
    />
  );
}

function Polaroid({
  img,
  caption,
  rot,
}: {
  img: string;
  caption: string;
  rot: number;
}) {
  return (
    <div
      className="relative bg-[#fbf8f1] p-3 pb-9 shadow-[0_18px_40px_-18px_rgba(40,30,16,0.5)]"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <Tape className="-top-3 left-1/2 -translate-x-1/2" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" className="aspect-square w-44 object-cover sm:w-52" />
      <p
        className="mt-2 text-center text-xl text-[#2a2620]"
        style={hand}
      >
        {caption}
      </p>
    </div>
  );
}

function Note({
  children,
  rot,
  className = "",
}: {
  children: ReactNode;
  rot: number;
  className?: string;
}) {
  return (
    <div
      className={`relative bg-raised p-5 shadow-[0_14px_30px_-16px_rgba(40,30,16,0.45)] ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      {children}
    </div>
  );
}

export function JournalHome() {
  return (
    <section className="relative overflow-hidden pb-24 pt-32">
      <div className="container-shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-2xl text-gold" style={hand}>
            польовий щоденник тренерки з продажів
          </p>
          <h1
            className="mt-2 text-[clamp(3rem,9vw,7rem)] leading-[0.9] text-ink"
            style={hand}
          >
            Продажі — це навичка,
            <br />
            не магія
          </h1>
          <p className="mx-auto mt-5 max-w-md text-muted">
            Нотатки, кейси й прийоми з 17+ років навчання команд продавати та
            вести переговори.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-start justify-center gap-8">
          <Reveal>
            <Polaroid img="/brand/ph/p5.jpg" caption="тренінг, Київ · 2025" rot={-5} />
          </Reveal>

          <Reveal delay={0.05}>
            <Note rot={2} className="max-w-xs">
              <p className="text-2xl leading-snug text-ink" style={hand}>
                «Знижка — це не аргумент. Цінність — аргумент.»
              </p>
              <p className="mt-3 text-xs text-muted">— з блокнота, маржа врятована ✦</p>
            </Note>
          </Reveal>

          <Reveal delay={0.1}>
            <Note rot={-2} className="max-w-xs">
              <p className="text-sm uppercase tracking-wider text-faint">
                чек-лист дзвінка
              </p>
              <ul className="mt-3 space-y-2">
                {["Знайти справжню потребу", "Назвати ціну впевнено", "Відпрацювати заперечення", "Домовитись про крок"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-ink">
                    <span className="grid h-5 w-5 place-items-center rounded-[4px] bg-gold/15 text-gold">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                    <span style={hand} className="text-lg">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </Note>
          </Reveal>

          <Reveal delay={0.15}>
            <Polaroid img="/brand/ph/p8.jpg" caption="команда після курсу" rot={4} />
          </Reveal>

          <Reveal delay={0.1}>
            <Note rot={1.5} className="max-w-[15rem] text-center">
              <div className="stat-number text-5xl">×5</div>
              <p className="mt-1 text-lg text-ink" style={hand}>
                зростання продажів
              </p>
            </Note>
          </Reveal>

          <Reveal delay={0.05}>
            <Polaroid img="/brand/ph/p9.jpg" caption="перемовини, розбір" rot={-3} />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-16 text-center">
          <p className="text-2xl text-ink" style={hand}>
            хочете так само у своїй команді?
          </p>
          <Link href="/consultation#book" className="btn btn-primary mt-4">
            Забронювати консультацію <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
