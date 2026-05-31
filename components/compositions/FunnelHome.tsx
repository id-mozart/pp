"use client";

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

const STAGES = [
  { n: "1000", w: "100%", label: "Холодні ліди", note: "Багато контактів — мало системи." },
  { n: "300", w: "76%", label: "Кваліфікація", note: "Більшість відсіюється: меседж і офер не чіпляють." },
  { n: "90", w: "54%", label: "Переговори", note: "Тут втрачають на тиску, знижках і відмовах (80–90%)." },
  { n: "30", w: "34%", label: "Угода", note: "Без системи доходять одиниці." },
];

export function FunnelHome() {
  return (
    <>
      <section className="container-shell pb-8 pt-32 text-center sm:pt-40">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-5">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
            Воронка продажів
          </span>
          <h1 className="text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[1.04] text-ink">
            Ваша воронка зараз{" "}
            <span className="text-gradient-gold">тече</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            Подивіться, де зникають угоди — і скільки повертає система продажів.
          </p>
        </Reveal>
      </section>

      {/* The funnel */}
      <section className="relative overflow-hidden pb-4">
        <div className="container-shell relative">
          <div className="relative mx-auto max-w-4xl">
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(3% 0, 97% 0, 67% 100%, 33% 100%)",
                background:
                  "linear-gradient(rgb(var(--c-gold) / 0.14), rgb(var(--c-gold) / 0.02))",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ clipPath: "polygon(3% 0, 3.4% 0, 33.4% 100%, 33% 100%)", background: "rgb(var(--c-gold) / 0.5)" }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ clipPath: "polygon(96.6% 0, 97% 0, 67% 100%, 66.6% 100%)", background: "rgb(var(--c-gold) / 0.5)" }}
            />
            <RevealGroup className="relative flex flex-col items-center gap-5 py-12">
              {STAGES.map((s, i) => (
                <RevealItem key={s.label} className="w-full">
                  <div
                    className="mx-auto surface flex items-center justify-between gap-4 p-5 text-left"
                    style={{ maxWidth: s.w }}
                  >
                    <div>
                      <p className="text-lg text-ink">{s.label}</p>
                      <p className="mt-0.5 text-xs leading-snug text-muted">{s.note}</p>
                    </div>
                    <span className="stat-number shrink-0 text-3xl sm:text-4xl">{s.n}</span>
                  </div>
                  {i < STAGES.length - 1 && (
                    <p className="mt-3 text-center font-mono text-[0.7rem] uppercase tracking-wider text-ember">
                      ↓ витік ↓
                    </p>
                  )}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* With the system — the funnel reopens */}
      <section className="relative grain border-t border-line/50 bg-surface section-pad">
        <div className="container-shell relative text-center">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-5">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Із системою Pan&amp;Partners
            </span>
            <h2 className="text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] text-ink">
              Та сама воронка — інша конверсія
            </h2>
            <div className="mt-4 flex items-center gap-5 sm:gap-10">
              <div>
                <div className="stat-number text-5xl sm:text-6xl">30</div>
                <div className="mt-1 text-xs text-muted">угод без системи</div>
              </div>
              <ArrowRight className="h-8 w-8 text-gold" />
              <div>
                <div className="stat-number text-6xl sm:text-7xl">×5</div>
                <div className="mt-1 text-xs text-muted">до 150 угод із системою</div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-muted">
              Менше витоку на кожному кроці: чіткий меседж, сильні переговори,
              структурований процес.
            </p>
            <Link href="/consultation#book" className="btn btn-primary mt-4">
              Закрити витік — забронювати <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
