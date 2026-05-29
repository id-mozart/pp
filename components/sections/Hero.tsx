"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useConcept } from "@/components/providers/ConceptProvider";
import { hero } from "@/lib/content";
import { ArrowRight, ArrowUpRight, Check } from "@/components/ui/icons";

const EASE = [0.16, 1, 0.3, 1] as const;

const EMBER_BG = "/brand/Tania1-3.webp";
const PORTRAIT = "/brand/1M6A0522.webp";

function emphasize(text: string, phrase: string) {
  const i = text.indexOf(phrase);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-gradient-gold">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  );
}

function HeroAmbient() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-[10%] -top-[20%] h-[55vw] w-[55vw] rounded-full blur-[100px]"
        style={{ background: "var(--glow-a)" }}
        animate={reduce ? {} : { scale: [1, 1.12, 1], x: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[25%] -left-[10%] h-[48vw] w-[48vw] rounded-full blur-[110px]"
        style={{ background: "var(--glow-b)" }}
        animate={reduce ? {} : { scale: [1, 1.18, 1], y: [0, -28, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}

function Eyebrow() {
  return (
    <motion.span
      className="eyebrow"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {hero.eyebrow}
    </motion.span>
  );
}

function CTAs() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href={hero.primaryCta.href} className="btn btn-primary">
        {hero.primaryCta.label}
        <ArrowRight className="h-4 w-4" />
      </Link>
      <Link href={hero.secondaryCta.href} className="btn btn-ghost">
        {hero.secondaryCta.label}
      </Link>
    </div>
  );
}

function Bullets() {
  return (
    <ul className="flex flex-col gap-2.5">
      {hero.bullets.map((b) => (
        <li key={b} className="flex items-center gap-3 text-sm text-muted">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
            <Check className="h-3 w-3" strokeWidth={2.4} />
          </span>
          {b}
        </li>
      ))}
    </ul>
  );
}

const headlineMotion = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  const { concept } = useConcept();

  /* ---------------------------- CHAMPAGNE ---------------------------- */
  if (concept === "champagne") {
    return (
      <section className="relative grain overflow-hidden pt-32 lg:pt-40">
        <HeroAmbient />
        <div className="container-shell relative pb-20 lg:pb-28">
          <Eyebrow />
          <div className="mt-7 grid items-end gap-12 lg:grid-cols-12">
            <motion.h1
              {...headlineMotion}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
              className="text-[clamp(2.6rem,6.4vw,5.4rem)] leading-[1.02] text-ink lg:col-span-8"
            >
              {emphasize(hero.title, "B2B-клієнтами")}
            </motion.h1>
            <div className="lg:col-span-4 lg:pb-2">
              <div className="flex items-end gap-4">
                <span className="stat-number text-7xl">90%</span>
                <span className="pb-2 text-sm leading-snug text-muted">
                  клієнтів продовжують співпрацю та рекомендують нас
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative">
                <img
                  src={PORTRAIT}
                  alt="Тетяна Пан"
                  className="aspect-[4/5] w-full rounded-[28px] object-cover object-top shadow-[var(--shadow-lux)]"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-gold/30" />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-7 lg:col-span-7">
              <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
              <Bullets />
              <p className="max-w-lg text-sm leading-relaxed text-faint">{hero.formats}</p>
              <CTAs />
              <div className="hairline mt-2 max-w-md" />
              <p className="text-sm text-muted">{hero.trust}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- BRONZE ------------------------------ */
  if (concept === "bronze") {
    return (
      <section className="relative grain overflow-hidden pt-32 lg:pt-40">
        <HeroAmbient />
        <div className="container-shell relative pb-20 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="flex flex-col gap-8 lg:col-span-7">
              <Eyebrow />
              <motion.h1
                {...headlineMotion}
                transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
                className="text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.96] text-ink"
              >
                {emphasize(hero.title, "B2B-клієнтами")}
              </motion.h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
              <CTAs />
              <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line/60 bg-line/40">
                {[
                  { v: "25+", l: "років досвіду" },
                  { v: "17+", l: "років навчання" },
                  { v: "×5", l: "зростання продажів" },
                ].map((s) => (
                  <div key={s.l} className="bg-surface p-4">
                    <div className="stat-number text-3xl">{s.v}</div>
                    <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-faint">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="surface relative overflow-hidden p-2">
                <img
                  src={PORTRAIT}
                  alt="Тетяна Пан"
                  className="aspect-[4/5] w-full rounded-[2px] object-cover object-top"
                />
              </div>
              <div className="mt-4 surface p-5">
                <div className="flex flex-col gap-3">
                  {hero.bullets.map((b, i) => (
                    <div key={b} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gold">0{i + 1}</span>
                      <span className="text-sm text-muted">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.16em] text-faint">
            {hero.trust}
          </p>
        </div>
      </section>
    );
  }

  /* ------------------------- EMBER (default) ------------------------- */
  return (
    <section className="relative grain min-h-[92vh] overflow-hidden">
      {/* Cinematic backdrop */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={EMBER_BG}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/90 to-canvas/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/30 to-canvas/70" />
      </div>
      <HeroAmbient />

      <div className="container-shell relative flex min-h-[92vh] flex-col justify-center pb-16 pt-32">
        <div className="flex max-w-3xl flex-col gap-7">
          <Eyebrow />
          <motion.h1
            {...headlineMotion}
            transition={{ duration: 1, ease: EASE, delay: 0.05 }}
            className="text-[clamp(2.6rem,6vw,5.4rem)] leading-[1.04] text-ink"
          >
            {emphasize(hero.title, "B2B-клієнтами")}
          </motion.h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
          <Bullets />
          <CTAs />
          <p className="max-w-lg text-sm leading-relaxed text-faint">{hero.formats}</p>
        </div>
      </div>

      {/* Stat strip */}
      <div className="container-shell relative pb-10">
        <div className="hairline" />
        <div className="flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              { v: "25+", l: "років у продажах" },
              { v: "17+", l: "років навчання" },
              { v: "6", l: "галузей" },
            ].map((s) => (
              <div key={s.l} className="flex items-baseline gap-3">
                <span className="stat-number text-4xl">{s.v}</span>
                <span className="max-w-[7rem] text-xs leading-snug text-muted">
                  {s.l}
                </span>
              </div>
            ))}
          </div>
          <p className="max-w-xs text-sm text-muted sm:text-right">{hero.trust}</p>
        </div>
      </div>
    </section>
  );
}
