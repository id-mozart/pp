"use client";

import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

const SPREADS = [
  { img: "/brand/ph/p1.jpg", n: "01", kicker: "Pan&Partners · Lookbook 2026", title: "Продажі, що виглядають дорого", sub: "Навчаємо команди продавати й вести переговори з B2B-клієнтами." },
  { img: "/brand/ph/p3.jpg", n: "02", kicker: "Експертиза", title: "25+ років у грі", sub: "Олімп · Danone · Coca-Cola. 17+ років навчаю." },
  { img: "/brand/ph/p6.jpg", n: "03", kicker: "Метод", title: "Без тиску. Без маніпуляцій.", sub: "Природно, структуровано, з очікуваним результатом." },
  { img: "/brand/ph/p4.jpg", n: "04", kicker: "Результат", title: "×5 продажів", sub: "90% клієнтів продовжують співпрацю та рекомендують нас." },
  { img: "/brand/ph/p2.jpg", n: "05", kicker: "Дія", title: "Ваш вихід", sub: "Забронюйте персональну консультацію.", cta: true },
];

export function LookbookHome() {
  return (
    <div>
      {SPREADS.map((s) => (
        <section
          key={s.n}
          className="relative flex h-[100svh] snap-start items-end overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.img} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
          <div className="container-shell relative w-full pb-16 text-[rgb(245,240,232)] sm:pb-24">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/70">
              <span className="text-gold">{s.n}</span>
              <span className="h-px w-10 bg-white/40" />
              <span>{s.kicker}</span>
              <span className="ml-auto">{s.n} / 05</span>
            </div>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]">
              {s.title}
            </h2>
            <p className="mt-4 max-w-md text-lg text-white/80">{s.sub}</p>
            {s.cta && (
              <Link href="/consultation#book" className="btn btn-primary mt-6">
                Забронювати <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
