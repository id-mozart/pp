"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

const CHANNELS = [
  { ch: "CH 01", img: "/brand/ph/p3.jpg", kicker: "Прямий ефір · продажі", line: "Навчаємо команди продавати з B2B-клієнтами" },
  { ch: "CH 02", img: "/brand/ph/p4.jpg", kicker: "Сюжет · результат", line: "×5 продажів. 90% клієнтів повертаються." },
  { ch: "CH 03", img: "/brand/ph/p6.jpg", kicker: "Інтервʼю · метод", line: "Без тиску. Без маніпуляцій." },
];

export function VhsHome() {
  const [ch, setCh] = useState(0);
  const [t, setT] = useState("00:00:00");
  useEffect(() => {
    const id = setInterval(() => setT(new Date().toTimeString().slice(0, 8)), 1000);
    return () => clearInterval(id);
  }, []);
  const c = CHANNELS[ch];

  return (
    <section className="relative h-[100svh] overflow-hidden bg-black text-[rgb(232,222,202)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.img} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "repeating-linear-gradient(transparent 0 2px, rgba(0,0,0,0.28) 2px 4px)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 100% at 50% 45%, transparent 52%, rgba(0,0,0,0.75))" }}
      />
      <div className="pointer-events-none absolute inset-0 animate-pulse bg-white/[0.015]" />

      <div className="absolute left-6 top-24 flex items-center gap-2 font-mono text-sm">
        <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" /> REC
      </div>
      <div className="absolute right-6 top-24 text-right font-mono text-sm">
        {t}
        <div className="text-xs opacity-80">{c.ch}</div>
      </div>
      <div className="absolute bottom-44 left-6 font-mono text-xs tracking-[0.3em] opacity-80">
        PAN&amp;PARTNERS · TV
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{c.kicker}</div>
        <h1 className="mt-2 max-w-3xl font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.02]">
          {c.line}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {CHANNELS.map((x, i) => (
            <button
              key={x.ch}
              onClick={() => setCh(i)}
              className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
                i === ch ? "border-gold bg-gold/20 text-gold" : "border-white/30 text-white/70"
              }`}
            >
              {x.ch}
            </button>
          ))}
          <Link href="/consultation#book" className="btn btn-primary !py-2 text-sm">
            Забронювати <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
