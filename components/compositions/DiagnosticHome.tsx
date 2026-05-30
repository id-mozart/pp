"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

const STEPS = [
  { q: "Хто ви?", opts: ["Власник бізнесу", "Керівник продажів", "Експерт / фриланс", "Команда продажів"] },
  { q: "Що болить найбільше?", opts: ["Низькі продажі", "Нестабільність", "80–90% відмов у B2B", "Клієнти просять знижки", "Немає системи"] },
  { q: "Який розмір команди продажів?", opts: ["Лише я", "2–5 людей", "6–20 людей", "20+ людей"] },
  { q: "Головна ціль на пів року?", opts: ["×2 продажі", "Стабільний результат", "Вийти в B2B", "Побудувати систему"] },
];

function recommend(a: string[]) {
  if (a[3] === "Вийти в B2B")
    return { title: "B2B-програма виходу на великих клієнтів", stat: "€500–700K+", statL: "оборот клієнтів, з якими працюємо", href: "/b2b" };
  if (a[0] === "Експерт / фриланс" || a[2] === "Лише я")
    return { title: "Персональна консультація 1:1", stat: "60 хв", statL: "фокусна сесія з планом дій", href: "/consultation#book" };
  if (a[0] === "Команда продажів" || a[0] === "Керівник продажів")
    return { title: "Корпоративний тренінг для команди", stat: "+20% → ×5", statL: "зростання продажів", href: "/b2b" };
  return { title: "Менторинг та коучинг", stat: "×2", statL: "конверсія угод", href: "/consultation#book" };
}

export function DiagnosticHome() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = step >= STEPS.length;
  const rec = done ? recommend(answers) : null;
  const progress = (Math.min(step, STEPS.length) / STEPS.length) * 100;

  const pick = (opt: string) => {
    setAnswers((a) => {
      const n = [...a];
      n[step] = opt;
      return n;
    });
    setStep((s) => s + 1);
  };

  return (
    <section className="container-shell flex min-h-[82vh] max-w-2xl flex-col justify-center pb-16 pt-28">
      <Reveal>
        <span className="eyebrow">Експрес-діагностика</span>
        <h1 className="mt-4 text-[clamp(1.9rem,4.4vw,3.2rem)] leading-tight text-ink">
          Що блокує ваші продажі?
        </h1>
        <p className="mt-3 text-lg text-muted">
          {done
            ? "Готово — ось рекомендація під вашу ситуацію."
            : "4 короткі кроки → персональна рекомендація формату роботи."}
        </p>
      </Reveal>

      <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-line/40">
        <div
          className="h-full rounded-full bg-gold transition-all duration-500 ease-lux"
          style={{ width: `${done ? 100 : progress}%` }}
        />
      </div>

      {!done ? (
        <div className="mt-8" key={step}>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            Крок {step + 1} / {STEPS.length}
          </p>
          <h2 className="mt-2 text-2xl text-ink sm:text-3xl">{STEPS[step].q}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {STEPS[step].opts.map((o) => (
              <button
                key={o}
                onClick={() => pick(o)}
                className="surface group flex items-center justify-between p-4 text-left text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50"
              >
                <span>{o}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-6 text-sm text-muted transition-colors hover:text-gold"
            >
              ← назад
            </button>
          )}
        </div>
      ) : (
        <Reveal className="mt-8">
          <div className="surface p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-wider text-gold">
              Рекомендуємо
            </p>
            <h2 className="mt-2 text-[clamp(1.7rem,3.4vw,2.6rem)] leading-tight text-ink">
              {rec!.title}
            </h2>
            <div className="mt-6 flex items-center gap-4 border-t border-line/50 pt-6">
              <span className="stat-number text-4xl sm:text-5xl">{rec!.stat}</span>
              <span className="max-w-[12rem] text-sm leading-snug text-muted">
                {rec!.statL}
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={rec!.href} className="btn btn-primary">
                Забронювати <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  setStep(0);
                  setAnswers([]);
                }}
                className="btn btn-ghost"
              >
                Почати заново
              </button>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
