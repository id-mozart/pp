"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { hero, formats, testimonials } from "@/lib/content";
import { Ambient } from "@/components/ui/Ambient";
import { ArrowRight } from "@/components/ui/icons";

export function CinematicHome() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const h1Op = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const h1Scale = useTransform(scrollYProgress, [0, 0.16], [1, 1.22]);
  const statOp = useTransform(scrollYProgress, [0.18, 0.27, 0.42, 0.5], [0, 1, 1, 0]);
  const num = useTransform(scrollYProgress, [0.2, 0.46], [5, 30]);
  const numText = useTransform(num, (v) => `${Math.round(v)}%`);
  const fmtOp = useTransform(scrollYProgress, [0.5, 0.6, 0.74, 0.82], [0, 1, 1, 0]);
  const fmtY = useTransform(scrollYProgress, [0.5, 0.6], [50, 0]);
  const ctaOp = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.82, 0.92], [40, 0]);
  const barW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduce) {
    return (
      <section className="container-shell space-y-16 py-32 text-center">
        <h1 className="text-[clamp(2.6rem,6vw,5rem)] leading-[1.04] text-ink">
          {hero.title}
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted">{hero.lead}</p>
        <div className="stat-number text-7xl">5% → 30%</div>
        <Link href="/consultation#book" className="btn btn-primary mx-auto w-fit">
          Забронювати <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[440vh]">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <Ambient />
        <motion.div
          style={{ width: barW }}
          className="absolute left-0 top-0 z-10 h-1 bg-gold"
        />

        {/* 1 — opening statement */}
        <motion.div
          style={{ opacity: h1Op, scale: h1Scale }}
          className="container-shell absolute text-center"
        >
          <span className="eyebrow mx-auto w-fit">{hero.eyebrow}</span>
          <h1 className="mx-auto mt-5 max-w-4xl text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[1.03] text-ink">
            {hero.title}
          </h1>
          <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-faint">
            ↓ гортайте, щоб побачити, як це працює
          </p>
        </motion.div>

        {/* 2 — the metric */}
        <motion.div
          style={{ opacity: statOp }}
          className="container-shell absolute text-center"
        >
          <p className="text-lg text-muted">Конверсія з</p>
          <motion.div className="stat-number text-[clamp(5rem,18vw,16rem)] leading-none">
            {numText}
          </motion.div>
          <p className="mt-2 text-lg text-muted">— завдяки системі продажів</p>
        </motion.div>

        {/* 3 — formats */}
        <motion.div
          style={{ opacity: fmtOp, y: fmtY }}
          className="container-shell absolute"
        >
          <h2 className="mb-10 text-center text-[clamp(1.8rem,4vw,3rem)] text-ink">
            Три формати — один результат
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {formats.cards.map((c) => (
              <div key={c.number} className="text-center">
                <div className="stat-number text-5xl">{c.number}</div>
                <h3 className="mt-2 text-2xl text-ink">{c.title}</h3>
                <p className="mt-1 text-sm text-muted">{c.result}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 4 — CTA */}
        <motion.div
          style={{ opacity: ctaOp, y: ctaY }}
          className="container-shell absolute text-center"
        >
          <blockquote className="mx-auto max-w-3xl text-pretty font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-snug text-gradient-gold">
            “{testimonials.items[0].quote}”
          </blockquote>
          <h2 className="mx-auto mt-10 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] leading-[1.0] text-ink">
            Готові продавати впевнено?
          </h2>
          <Link href="/consultation#book" className="btn btn-primary mx-auto mt-7 w-fit">
            Забронювати консультацію <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
