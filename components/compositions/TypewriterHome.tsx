"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "@/components/ui/icons";

const LINES = [
  "Продаж — це не імпровізація.",
  "Це підготовка, структура, переговори.",
  "Без тиску. Без маніпуляцій.",
  "17 років. 15 000+ учнів. 6 галузей.",
  "Час побудувати вашу систему продажів.",
];
const FULL = LINES.join("\n");

export function TypewriterHome() {
  const reduce = useReducedMotion();
  const [text, setText] = useState(reduce ? FULL : "");
  const [done, setDone] = useState(!!reduce);

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setText(FULL.slice(0, i));
      if (i >= FULL.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section className="container-shell flex min-h-[100svh] max-w-3xl flex-col justify-center pb-16 pt-28">
      <div className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
        Pan&amp;Partners · маніфест
      </div>
      <pre className="mt-7 whitespace-pre-wrap font-mono text-[clamp(1.3rem,3.4vw,2.4rem)] font-medium leading-[1.5] text-ink">
        {text}
        <span
          className={`ml-0.5 inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] bg-gold ${
            done ? "opacity-0" : "animate-pulse"
          }`}
        />
      </pre>
      <div
        className={`mt-12 transition-opacity duration-700 ${done ? "opacity-100" : "opacity-0"}`}
      >
        <Link href="/consultation#book" className="btn btn-primary">
          Забронювати консультацію <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
