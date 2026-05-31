"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

type Opt = { label: string; dm: number; dt: number; reply: string };
const ROUNDS: { client: string; options: Opt[] }[] = [
  {
    client: "Нам цікаво, але в конкурентів дешевше. Дайте −20%.",
    options: [
      { label: "Окей, −20%, аби закрити", dm: -20, dt: -5, reply: "Домовились. (Маржу віддано без бою.)" },
      { label: "Покажу цінність — чому ціна саме така", dm: 0, dt: 15, reply: "Хм… звучить аргументовано." },
      { label: "Можу −10%", dm: -10, dt: 0, reply: "А ще трохи?" },
    ],
  },
  {
    client: "А за більший обсяг — знижка буде?",
    options: [
      { label: "Так, за обсяг −15%", dm: -15, dt: 0, reply: "От і добре." },
      { label: "За обсяг — більше цінності, не нижча ціна", dm: 0, dt: 12, reply: "Логічно, розглянемо." },
      { label: "−7%", dm: -7, dt: 0, reply: "Окей." },
    ],
  },
  {
    client: "Мені треба погодити з керівництвом.",
    options: [
      { label: "Тисну: знижка діє лише сьогодні", dm: 0, dt: -14, reply: "…не люблю, коли тиснуть." },
      { label: "Підготую аргументи для керівництва", dm: 0, dt: 15, reply: "Це дуже допоможе, дякую." },
      { label: "Добре, чекаю", dm: 0, dt: 0, reply: "Гаразд." },
    ],
  },
];

type Msg = { who: "client" | "you"; text: string };
const clamp = (n: number) => Math.max(0, Math.min(100, n));

function Meter({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-mono uppercase tracking-wider text-faint">{label}</span>
        <span className={danger && value < 80 ? "text-ember" : "text-gold"}>{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line/50">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-lux ${danger && value < 80 ? "bg-ember" : "bg-gold"}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function NegotiationHome() {
  const [round, setRound] = useState(0);
  const [margin, setMargin] = useState(100);
  const [trust, setTrust] = useState(50);
  const [msgs, setMsgs] = useState<Msg[]>([{ who: "client", text: ROUNDS[0].client }]);
  const done = round >= ROUNDS.length;

  const pick = (o: Opt) => {
    const m = clamp(margin + o.dm);
    const t = clamp(trust + o.dt);
    setMargin(m);
    setTrust(t);
    const next = round + 1;
    const added: Msg[] = [
      { who: "you", text: o.label },
      { who: "client", text: o.reply },
    ];
    if (next < ROUNDS.length) added.push({ who: "client", text: ROUNDS[next].client });
    setMsgs((x) => [...x, ...added]);
    setRound(next);
  };

  const reset = () => {
    setRound(0);
    setMargin(100);
    setTrust(50);
    setMsgs([{ who: "client", text: ROUNDS[0].client }]);
  };

  const outcome =
    margin >= 95 && trust >= 70
      ? { t: "Угоду закрито за повну ціну.", d: "Маржу збережено, довіру вибудувано — це і є метод.", good: true }
      : margin >= 80
        ? { t: "Закрили, але частину маржі віддали.", d: "Система переговорів допомогла б утримати ціну." , good: false }
        : { t: "Угода на їхніх умовах. Маржу втрачено.", d: "Саме тут і працює метод Pan&Partners.", good: false };

  return (
    <section className="container-shell flex min-h-[90vh] max-w-2xl flex-col justify-center pb-16 pt-32">
      <Reveal className="mb-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
          Симулятор переговорів
        </span>
        <h1 className="mt-3 text-[clamp(1.9rem,4vw,3rem)] leading-tight text-ink">
          Клієнт тисне на знижку. Ваш хід.
        </h1>
      </Reveal>

      <div className="surface overflow-hidden">
        <div className="grid grid-cols-2 gap-5 border-b border-line/60 bg-raised p-5">
          <Meter label="Маржа угоди" value={margin} danger />
          <Meter label="Довіра клієнта" value={trust} />
        </div>

        <div className="max-h-[42vh] space-y-3 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.who === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.who === "you" ? "bg-gold text-oncontrast" : "bg-raised text-ink"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line/60 p-5">
          {!done ? (
            <div className="flex flex-col gap-2.5">
              {ROUNDS[round].options.map((o) => (
                <button
                  key={o.label}
                  onClick={() => pick(o)}
                  className="rounded-xl border border-line/70 px-4 py-3 text-left text-sm text-ink transition-colors hover:border-gold/60 hover:bg-gold/[0.06]"
                >
                  {o.label}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <p className={`text-xl ${outcome.good ? "text-gold" : "text-ember"}`}>
                {outcome.t}
              </p>
              <p className="mt-2 text-sm text-muted">{outcome.d}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/consultation#book" className="btn btn-primary">
                  Навчитися так насправді <ArrowRight className="h-4 w-4" />
                </Link>
                <button onClick={reset} className="btn btn-ghost">
                  Спробувати ще раз
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-faint">
        Ігрова симуляція. У реальних переговорах метод дає чіткі скрипти й підготовку.
      </p>
    </section>
  );
}
