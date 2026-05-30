"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

type Opt = { label: string; to: string };
type Node = { text: ReactNode; options?: Opt[]; cta?: boolean };

const FLOW: Record<string, Node> = {
  start: {
    text: "Вітаю! Я Тетяна 🧡 Допомагаю командам продавати й вести переговори з B2B-клієнтами. Що вас цікавить?",
    options: [
      { label: "Які формати роботи?", to: "formats" },
      { label: "З чим ви працюєте?", to: "problems" },
      { label: "Скільки це коштує?", to: "price" },
      { label: "Хочу консультацію", to: "book" },
    ],
  },
  formats: {
    text: "Три формати: корпоративні тренінги для команд, готові онлайн-курси та індивідуальний менторинг. Підберемо під вашу ціль і темп.",
    options: [
      { label: "А з чим працюєте?", to: "problems" },
      { label: "Хочу консультацію", to: "book" },
    ],
  },
  problems: {
    text: "Низькі чи нестабільні продажі, 80–90% відмов у B2B, знижки замість аргументів, команда без стабільного результату — це те, що ми розвʼязуємо.",
    options: [
      { label: "Які формати роботи?", to: "formats" },
      { label: "Скільки це коштує?", to: "price" },
      { label: "Хочу консультацію", to: "book" },
    ],
  },
  price: {
    text: "Залежить від формату й обсягу. Найпростіший старт — фокусна онлайн-консультація на 60 хвилин: розберу вашу ситуацію і дам чіткий план дій.",
    options: [
      { label: "Які формати роботи?", to: "formats" },
      { label: "Хочу консультацію", to: "book" },
    ],
  },
  book: {
    text: "Чудово! Оберіть вільний слот — і до зустрічі 🧡",
    cta: true,
    options: [{ label: "Поставити інше питання", to: "start" }],
  },
};

type Msg = { from: "her" | "me"; node: ReactNode; cta?: boolean };

export function DialogueHome() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [options, setOptions] = useState<Opt[]>([]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const go = (key: string) => {
    const node = FLOW[key];
    if (!node) return;
    setOptions([]);
    setTyping(true);
    const t = setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "her", node: node.text, cta: node.cta }]);
      setOptions(node.options ?? []);
    }, 850);
    return () => clearTimeout(t);
  };

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    go("start");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing, options]);

  const pick = (o: Opt) => {
    setMsgs((m) => [...m, { from: "me", node: o.label }]);
    setOptions([]);
    setTimeout(() => go(o.to), 320);
  };

  return (
    <section className="container-shell max-w-2xl pb-16 pt-28 sm:pt-32">
      <div className="surface flex h-[74vh] flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line/60 bg-raised px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/tania-portrait.jpg"
            alt="Тетяна Пан"
            className="h-10 w-10 rounded-full object-cover object-top"
          />
          <div>
            <p className="text-sm font-medium text-ink">Тетяна Пан</p>
            <p className="text-xs text-gold">● онлайн</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.from === "me"
                    ? "bg-gold text-oncontrast"
                    : "bg-raised text-ink"
                }`}
              >
                {m.node}
                {m.cta && (
                  <Link
                    href="/consultation#book"
                    className="btn btn-primary mt-3 w-full !py-2 text-xs"
                  >
                    Забронювати консультацію
                  </Link>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-raised px-4 py-3">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-muted"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line/60 p-4">
          {options.map((o) => (
            <button
              key={o.label}
              onClick={() => pick(o)}
              className="rounded-full border border-gold/40 px-4 py-2 text-sm text-gold transition-colors hover:bg-gold/10"
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
