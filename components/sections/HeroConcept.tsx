"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { hero } from "@/lib/content";
import { ArrowRight, Check } from "@/components/ui/icons";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Crossfading hero slideshow — same three photos and cadence as the source
 * (tetianapansales.com): Tania3 → Tania1-2 → Tania1-3, 5s hold, 2s fade.
 */
const SLIDES = [
  "/brand/Tania3.webp",
  "/brand/Tania1-2.webp",
  "/brand/Tania1-3.webp",
];
const INTERVAL = 5000;
const FADE_MS = 2000;

/* Fixed colours: the hero sits on a darkened photo, so it reads identically
   in both light and dark modes (only the body below reacts to the toggle). */
const CREAM = "#F5ECDE";
const CREAM_DIM = "rgba(244,236,222,0.82)";
const CREAM_FAINT = "rgba(244,236,222,0.55)";
const GOLD = "#E3B765";
const DARK = "#0E0B09";

function goldPhrase(text: string, phrase: string) {
  const i = text.indexOf(phrase);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color: GOLD }}>{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

export function HeroConcept() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce || SLIDES.length < 2) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % SLIDES.length),
      INTERVAL,
    );
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <section className="relative grain min-h-[78vh] overflow-hidden">
      {/* Crossfading slideshow */}
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{
              opacity: i === idx ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          />
        ))}
        {/* Fixed dark wash for legibility in both modes */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #0E0B09 0%, rgba(14,11,9,0.9) 32%, rgba(14,11,9,0.45) 70%, rgba(14,11,9,0.18) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, #0E0B09 2%, rgba(14,11,9,0.2) 46%, rgba(14,11,9,0.66) 100%)",
          }}
        />
      </div>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-[8%] -top-[16%] h-[48vw] w-[48vw] rounded-full blur-[120px]"
          style={{ background: "rgba(201,150,46,0.16)" }}
          animate={reduce ? {} : { scale: [1, 1.12, 1], x: [0, 28, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-shell relative flex min-h-[78vh] flex-col justify-center pb-14 pt-32">
        <div className="flex max-w-3xl flex-col gap-7">
          <motion.span
            className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em]"
            style={{ color: GOLD }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="h-px w-6" style={{ background: GOLD }} />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.05 }}
            className="font-display text-[clamp(1.7rem,3.4vw,3rem)] leading-[1.1]"
            style={{ color: CREAM, fontWeight: 500, letterSpacing: "-0.015em" }}
          >
            {goldPhrase(hero.title, "B2B-клієнтами")}
          </motion.h1>

          <p className="max-w-xl text-lg leading-relaxed" style={{ color: CREAM_DIM }}>
            {hero.lead}
          </p>

          <ul className="flex flex-col gap-2.5">
            {hero.bullets.map((b) => (
              <li
                key={b}
                className="flex items-center gap-3 text-sm"
                style={{ color: CREAM_DIM }}
              >
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                  style={{ background: "rgba(227,183,101,0.18)", color: GOLD }}
                >
                  <Check className="h-3 w-3" strokeWidth={2.4} />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={hero.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-transform duration-300 hover:-translate-y-0.5"
              style={{ background: "#C9962E", color: DARK }}
            >
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-colors duration-300 hover:border-[rgba(244,236,222,0.8)]"
              style={{ borderColor: "rgba(244,236,222,0.4)", color: CREAM }}
            >
              {hero.secondaryCta.label}
            </Link>
          </div>

          {/* Slideshow indicator (also lets you drive it) */}
          <div className="flex items-center gap-2.5 pt-1">
            {SLIDES.map((src, i) => (
              <button
                key={src}
                onClick={() => setIdx(i)}
                aria-label={`Показати фото ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === idx ? 30 : 8,
                  background: i === idx ? GOLD : "rgba(244,236,222,0.35)",
                }}
              />
            ))}
          </div>

          <p className="max-w-lg text-sm leading-relaxed" style={{ color: CREAM_FAINT }}>
            {hero.formats}
          </p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="container-shell relative pb-10">
        <div className="h-px w-full" style={{ background: "rgba(244,236,222,0.14)" }} />
        <div className="flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              { v: "25+", l: "років у продажах" },
              { v: "17+", l: "років навчання" },
              { v: "6", l: "галузей" },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline gap-3">
                <span className="font-display text-4xl" style={{ color: GOLD }}>
                  {s.v}
                </span>
                <span
                  className="max-w-[7rem] text-xs leading-snug"
                  style={{ color: CREAM_DIM }}
                >
                  {s.l}
                </span>
              </div>
            ))}
          </div>
          <p className="max-w-xs text-sm sm:text-right" style={{ color: CREAM_DIM }}>
            {hero.trust}
          </p>
        </div>
      </div>
    </section>
  );
}
