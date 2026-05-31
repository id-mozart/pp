"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

const eur = (n: number) =>
  new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

function Slider({
  label,
  value,
  set,
  min,
  max,
  step,
  fmt,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
  fmt: (n: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-mono text-lg text-gold">{fmt(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line/60"
        style={{ accentColor: "rgb(var(--c-gold))" }}
      />
    </label>
  );
}

export function CalculatorHome() {
  const [revenue, setRevenue] = useState(50000);
  const [rejection, setRejection] = useState(85);
  const [discount, setDiscount] = useState(15);

  const winnable = revenue * (rejection / 100) * 0.35;
  const discountLeak = revenue * (discount / 100) * 0.5;
  const monthlyLoss = winnable + discountLeak;
  const recover = monthlyLoss * 0.6;

  return (
    <section className="container-shell flex min-h-[88vh] flex-col justify-center pb-16 pt-32">
      <Reveal className="mb-10 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
          Калькулятор втрат
        </span>
        <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] text-ink">
          Скільки ви втрачаєте{" "}
          <span className="text-gradient-gold">без системи продажів?</span>
        </h1>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="surface flex flex-col justify-center gap-8 p-8">
          <Slider
            label="Оборот на місяць"
            value={revenue}
            set={setRevenue}
            min={5000}
            max={500000}
            step={5000}
            fmt={eur}
          />
          <Slider
            label="Відмов від B2B-клієнтів"
            value={rejection}
            set={setRejection}
            min={30}
            max={95}
            step={1}
            fmt={(n) => `${n}%`}
          />
          <Slider
            label="Середня знижка під тиском"
            value={discount}
            set={setDiscount}
            min={0}
            max={40}
            step={1}
            fmt={(n) => `${n}%`}
          />
        </Reveal>

        <Reveal delay={0.05} className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-wider text-faint">
            Орієнтовний витік щомісяця
          </p>
          <div className="mt-2 font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-none text-ember">
            {eur(monthlyLoss)}
          </div>
          <p className="mt-2 text-muted">
            ≈ {eur(monthlyLoss * 12)} на рік недоотриманого прибутку.
          </p>

          <div className="mt-8 border-t border-line/50 pt-6">
            <p className="text-sm uppercase tracking-wider text-faint">
              Що реально повернути із системою
            </p>
            <div className="mt-1 stat-number text-4xl sm:text-5xl">
              + {eur(recover)} / міс
            </div>
          </div>

          <Link href="/consultation#book" className="btn btn-primary mt-8 w-fit">
            Зупинити витік — забронювати <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-faint">
            Оцінка ілюстративна — точні цифри рахуємо на консультації.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
