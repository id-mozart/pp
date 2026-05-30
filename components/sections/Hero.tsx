"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useConcept } from "@/components/providers/ConceptProvider";
import { hero } from "@/lib/content";
import { ArrowRight, ArrowUpRight, Check } from "@/components/ui/icons";

const EASE = [0.16, 1, 0.3, 1] as const;

const EMBER_BG = "/brand/Tania1-3.webp";
const PORTRAIT = "/brand/tania-portrait.jpg";
const EDITION_PORTRAIT = "/brand/Tania2.jpg";

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
  const reduce = useReducedMotion();
  const hm = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : headlineMotion;

  /* ----------------------------- SOLARIS ----------------------------- */
  if (concept === "solaris") {
    return (
      <section className="relative grain min-h-[92vh] overflow-hidden pb-16 pt-36">
        <HeroAmbient />
        <div className="container-shell relative flex flex-col items-center gap-7 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative h-24 w-24 overflow-hidden rounded-full shadow-[var(--shadow-lux)] ring-1 ring-gold/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT}
              alt="Тетяна Пан"
              className="h-full w-full object-cover object-top"
            />
          </motion.div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <motion.h1
            {...hm}
            transition={{ duration: 1, ease: EASE, delay: 0.05 }}
            className="max-w-4xl text-[clamp(2.7rem,6.2vw,5.6rem)] leading-[1.05] text-ink"
          >
            {emphasize(hero.title, "B2B-клієнтами")}
          </motion.h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">{hero.lead}</p>
          <div className="flex w-full justify-center">
            <CTAs />
          </div>
        </div>

        <div className="container-shell relative mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-3">
          {hero.bullets.map((b, i) => (
            <div key={b} className="surface flex items-center gap-3 p-5 text-left">
              <span className="font-display text-3xl text-gradient-gold">0{i + 1}</span>
              <span className="text-sm leading-snug text-ink">{b}</span>
            </div>
          ))}
        </div>

        <div className="container-shell relative mt-10">
          <div className="hairline" />
          <p className="py-5 text-center text-sm text-muted">{hero.trust}</p>
        </div>
      </section>
    );
  }

  /* ----------------------------- ÉDITION ----------------------------- */
  if (concept === "edition") {
    return (
      <section className="relative grain overflow-hidden pt-28">
        <div className="container-shell relative border-b-2 border-ink pb-4 pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-none text-ink">
              Pan<span className="text-gold">&amp;</span>Partners
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted">
              B2B · вип. 01 · 2026 · Київ
            </span>
          </div>
        </div>

        <div className="container-shell relative grid items-center gap-10 py-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <span className="eyebrow">{hero.eyebrow}</span>
            <motion.h1
              {...hm}
              transition={{ duration: 1, ease: EASE, delay: 0.05 }}
              className="text-[clamp(2.6rem,6vw,5.4rem)] leading-[1.0] text-ink"
            >
              {emphasize(hero.title, "B2B-клієнтами")}
            </motion.h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
            <div className="flex">
              <CTAs />
            </div>
          </div>
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.15 }}
              className="relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={EDITION_PORTRAIT}
                alt="Тетяна Пан"
                className="w-full rounded-sm object-cover"
              />
              <div className="absolute -left-3 top-8 -rotate-3 bg-gold px-4 py-2 font-mono text-[0.7rem] uppercase tracking-wider text-oncontrast shadow-[var(--shadow-lux)]">
                Експертка з B2B-продажів
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container-shell relative border-t-2 border-ink">
          <div className="grid sm:grid-cols-3">
            {hero.bullets.map((b, i) => (
              <div
                key={b}
                className="flex items-baseline gap-3 py-5 sm:border-line sm:px-5 sm:[&:not(:first-child)]:border-l"
              >
                <span className="font-display text-2xl text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-snug text-ink">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------ BRUT ------------------------------- */
  if (concept === "brut") {
    return (
      <section className="relative grain overflow-hidden pb-12 pt-28">
        <div className="container-shell relative">
          <div className="grid grid-cols-2 border-2 border-ink lg:grid-cols-12">
            <div className="col-span-2 flex items-center justify-between border-b-2 border-ink px-5 py-3 lg:col-span-12">
              <span className="eyebrow">{hero.eyebrow}</span>
              <span className="font-mono text-xs text-muted">01 — 06</span>
            </div>
            <div className="col-span-2 border-b-2 border-ink px-5 py-8 lg:col-span-8 lg:border-r-2">
              <motion.h1
                {...hm}
                transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
                className="text-[clamp(2.4rem,6vw,5rem)] leading-[0.92] text-ink"
              >
                {emphasize(hero.title, "B2B-клієнтами")}
              </motion.h1>
            </div>
            <div className="col-span-2 border-b-2 border-ink lg:col-span-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PORTRAIT}
                alt="Тетяна Пан"
                className="h-64 w-full object-cover object-top lg:h-full"
              />
            </div>
            <div className="col-span-2 border-b-2 border-ink px-5 py-6 lg:col-span-7 lg:border-b-0 lg:border-r-2">
              <p className="text-lg leading-relaxed text-muted">{hero.lead}</p>
              <div className="mt-6">
                <CTAs />
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-2 lg:col-span-5">
              {[
                { v: "25+", l: "років" },
                { v: "17+", l: "навчання" },
                { v: "×5", l: "продажі" },
                { v: "6", l: "галузей" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className={`border-ink px-5 py-5 ${i % 2 === 0 ? "border-r-2" : ""} ${i < 2 ? "border-b-2" : ""}`}
                >
                  <div className="font-display text-3xl text-gold">{s.v}</div>
                  <div className="font-mono text-[0.6rem] uppercase tracking-wider text-muted">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {hero.trust}
          </p>
        </div>
      </section>
    );
  }

  /* ------------------------------ NOIR ------------------------------- */
  if (concept === "noir") {
    return (
      <section className="relative grain grid min-h-[94vh] place-items-center overflow-hidden pt-24">
        <div className="pointer-events-none absolute inset-4 border border-gold/25 sm:inset-8" />
        <HeroAmbient />
        <div className="container-shell relative flex max-w-4xl flex-col items-center gap-8 text-center">
          <span className="eyebrow">{hero.eyebrow}</span>
          <motion.h1
            {...hm}
            transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
            className="text-[clamp(2.6rem,6.2vw,5.6rem)] leading-[1.06] text-ink"
          >
            {emphasize(hero.title, "B2B-клієнтами")}
          </motion.h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
          <div className="flex justify-center">
            <CTAs />
          </div>
        </div>
        <div className="absolute left-6 top-6 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint sm:left-10 sm:top-10">
          Pan&amp;Partners
        </div>
        <div className="absolute bottom-6 right-6 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint sm:bottom-10 sm:right-10">
          B2B · Київ
        </div>
      </section>
    );
  }

  /* ----------------------------- KINETIK ----------------------------- */
  if (concept === "kinetik") {
    const words = ["Продажі", "Переговори", "B2B", "Результат", "Зростання"];
    const Strip = ({ reverse }: { reverse?: boolean }) => (
      <div className="relative overflow-hidden mask-fade-r">
        <div
          className={`flex w-max animate-marquee items-center ${reverse ? "[animation-direction:reverse]" : ""}`}
          style={{ ["--marquee-dur" as string]: "32s" }}
        >
          {[...words, ...words].map((w, i) => (
            <span
              key={i}
              className={`flex items-center whitespace-nowrap font-display text-[clamp(2.4rem,7vw,5.6rem)] uppercase leading-none ${
                i % 2 ? "text-outline-gold" : "text-gold"
              }`}
            >
              {w}
              <span className="px-5 text-ink/25">/</span>
            </span>
          ))}
        </div>
      </div>
    );
    return (
      <section className="relative grain flex min-h-[92vh] flex-col justify-center gap-9 overflow-hidden pt-24">
        <HeroAmbient />
        <Strip />
        <div className="container-shell relative flex flex-col gap-6">
          <span className="eyebrow">{hero.eyebrow}</span>
          <motion.h1
            {...hm}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="max-w-4xl text-[clamp(2rem,4.6vw,3.7rem)] leading-[1.02] text-ink"
          >
            {emphasize(hero.title, "B2B-клієнтами")}
          </motion.h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
          <div>
            <CTAs />
          </div>
        </div>
        <Strip reverse />
      </section>
    );
  }

  /* ----------------------------- DOSSIER ----------------------------- */
  if (concept === "dossier") {
    const metrics = [
      { label: "Конверсія", from: "5%", to: "20–30%", pct: 82 },
      { label: "Зростання продажів", from: "+20%", to: "×5", pct: 96 },
      { label: "Утримання клієнтів", from: "—", to: "90%", pct: 90 },
    ];
    return (
      <section className="relative grain overflow-hidden pb-16 pt-32">
        <div className="container-shell relative">
          <div className="flex items-center justify-between border-b border-ink/30 pb-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            <span>Pan&amp;Partners — Dossier</span>
            <span>2026 / B2B / UA</span>
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-7">
              <span className="eyebrow">{hero.eyebrow}</span>
              <motion.h1
                {...hm}
                transition={{ duration: 1, ease: EASE, delay: 0.05 }}
                className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.05] text-ink"
              >
                {emphasize(hero.title, "B2B-клієнтами")}
              </motion.h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
              <div>
                <CTAs />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="surface p-6">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-faint">
                  Показники · до → після
                </p>
                <div className="mt-5 flex flex-col gap-5">
                  {metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="text-ink">{m.label}</span>
                        <span className="font-mono text-muted">
                          {m.from} → <span className="text-gold">{m.to}</span>
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line/50">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${m.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------ AURORA ----------------------------- */
  if (concept === "aurora") {
    return (
      <section className="relative grain min-h-[92vh] overflow-hidden pt-28">
        <HeroAmbient />
        <div className="container-shell relative grid min-h-[calc(92vh-7rem)] items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-7">
            <span className="eyebrow">{hero.eyebrow}</span>
            <motion.h1
              {...hm}
              transition={{ duration: 1, ease: EASE, delay: 0.05 }}
              className="text-[clamp(2.6rem,6vw,5rem)] leading-[1.03] text-ink"
            >
              {emphasize(hero.title, "B2B-клієнтами")}
            </motion.h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
            <Bullets />
            <div>
              <CTAs />
            </div>
          </div>
          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[40px] shadow-[var(--shadow-lux)] ring-1 ring-gold/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/Tania4.webp"
                alt="Тетяна Пан"
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------ VAPOR ------------------------------ */
  if (concept === "vapor") {
    const stats = [
      { v: "25+", l: "років у продажах" },
      { v: "×5", l: "зростання продажів" },
      { v: "90%", l: "утримання клієнтів" },
    ];
    return (
      <section className="relative grain min-h-[92vh] overflow-hidden pb-12 pt-28">
        <HeroAmbient />
        <div className="container-shell relative grid min-h-[calc(92vh-9rem)] items-center gap-8 lg:grid-cols-12">
          <div className="surface relative flex flex-col gap-6 p-8 sm:p-10 lg:col-span-7">
            <span className="eyebrow">{hero.eyebrow}</span>
            <motion.h1
              {...hm}
              transition={{ duration: 1, ease: EASE, delay: 0.05 }}
              className="text-[clamp(2.3rem,5.4vw,4.8rem)] leading-[1.03] text-ink"
            >
              {emphasize(hero.title, "B2B-клієнтами")}
            </motion.h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
            <div>
              <CTAs />
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            {stats.map((s) => (
              <div key={s.l} className="surface flex items-center gap-4 p-5">
                <span className="stat-number text-4xl">{s.v}</span>
                <span className="text-sm text-muted">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- TERMINAL ---------------------------- */
  if (concept === "terminal") {
    return (
      <section className="relative grain min-h-[92vh] overflow-hidden pb-12 pt-28">
        <div className="container-shell relative">
          <div className="surface overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line/60 bg-raised px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-ember" />
              <span className="h-3 w-3 rounded-full bg-gold" />
              <span className="h-3 w-3 rounded-full bg-muted/40" />
              <span className="ml-3 text-xs text-muted">
                pan@partners — продажі та переговори
              </span>
            </div>
            <div className="p-6 text-sm leading-relaxed sm:p-10 sm:text-base">
              <p className="text-muted">
                <span className="text-gold">pan@partners</span>:~$ ./train --segment=b2b
              </p>
              <motion.h1
                {...hm}
                transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
                className="mt-5 text-[clamp(1.7rem,4.2vw,3.2rem)] leading-tight text-ink"
              >
                {emphasize(hero.title, "B2B-клієнтами")}
                <span className="ml-1 inline-block h-[0.95em] w-[0.5em] translate-y-[0.12em] animate-pulse bg-gold" />
              </motion.h1>
              <p className="mt-6 text-muted"># {hero.lead}</p>
              <p className="mt-5 text-gold">→ results[]:</p>
              <div className="space-y-1 text-muted">
                {hero.bullets.map((b) => (
                  <p key={b}>
                    {"  "}
                    <span className="text-gold">✓</span> {b}
                  </p>
                ))}
              </div>
              <div className="mt-8">
                <CTAs />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------ RISO ------------------------------- */
  if (concept === "riso") {
    return (
      <section className="relative overflow-hidden pb-12 pt-28">
        <div className="grain pointer-events-none absolute inset-0" />
        <div className="container-shell relative grid items-center gap-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <span className="eyebrow">{hero.eyebrow}</span>
            <motion.h1
              {...hm}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
              className="relative text-[clamp(2.3rem,5.6vw,4.8rem)] uppercase leading-[0.98]"
            >
              <span
                className="absolute inset-0 translate-x-[5px] translate-y-[5px] text-gold/85"
                aria-hidden
              >
                {hero.title}
              </span>
              <span className="relative text-ink">{hero.title}</span>
            </motion.h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
            <div>
              <CTAs />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PORTRAIT}
                alt="Тетяна Пан"
                className="aspect-[4/5] w-full object-cover object-top grayscale contrast-[1.15]"
              />
              <div className="absolute inset-0 bg-gold opacity-90 mix-blend-multiply" />
              <div className="grain absolute inset-0 opacity-20" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- BAUHAUS ----------------------------- */
  if (concept === "bauhaus") {
    return (
      <section className="relative grain min-h-[92vh] overflow-hidden pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[6%] top-[13%] h-36 w-36 rounded-full bg-gold sm:h-56 sm:w-56" />
          <div className="absolute right-[26%] bottom-[14%] hidden h-40 w-40 bg-ink md:block" />
          <div className="absolute right-[5%] bottom-[3%] h-0 w-0 border-b-[140px] border-l-[80px] border-b-ember border-l-transparent sm:border-b-[210px] sm:border-l-[120px]" />
          <div className="absolute left-[36%] top-[7%] hidden h-2.5 w-44 bg-ember md:block" />
          <div className="absolute right-[13%] top-[46%] hidden h-24 w-24 rounded-full border-[10px] border-ink lg:block" />
        </div>
        <div className="container-shell relative grid min-h-[calc(92vh-7rem)] items-center">
          <div className="max-w-3xl">
            <span className="eyebrow">{hero.eyebrow}</span>
            <motion.h1
              {...hm}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
              className="mt-5 text-[clamp(2.5rem,6vw,5.2rem)] leading-[0.98] text-ink"
            >
              {emphasize(hero.title, "B2B-клієнтами")}
            </motion.h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
            <div className="mt-8">
              <CTAs />
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- MAXIMAL ----------------------------- */
  if (concept === "maximal") {
    const tags = [
      { t: "B2B", cls: "bg-gold text-oncontrast rotate-2" },
      { t: "Переговори", cls: "border border-ink text-ink -rotate-1" },
      { t: "+20% → ×5", cls: "bg-ember text-oncontrast -rotate-2 font-mono" },
      { t: "Без тиску", cls: "border border-gold text-gold rotate-1" },
      { t: "Конверсія ×2", cls: "bg-surface text-ink rotate-1 font-mono" },
    ];
    return (
      <section className="relative grain min-h-[92vh] overflow-hidden pb-12 pt-28">
        <HeroAmbient />
        <div className="container-shell relative">
          <span className="eyebrow">{hero.eyebrow}</span>
          <motion.h1
            {...hm}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="mt-5 text-[clamp(2.6rem,7vw,6rem)] leading-[0.94] text-ink"
          >
            {emphasize(hero.title, "B2B-клієнтами")}
          </motion.h1>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {tags.map((x) => (
              <span
                key={x.t}
                className={`inline-flex rounded-full px-4 py-1.5 text-sm ${x.cls}`}
              >
                {x.t}
              </span>
            ))}
          </div>
          <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
              <div className="mt-7">
                <CTAs />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative ml-auto w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={EDITION_PORTRAIT}
                  alt="Тетяна Пан"
                  className="w-56 -rotate-2 rounded-sm object-cover shadow-[var(--shadow-lux)] sm:w-64"
                />
                <span className="absolute -left-4 top-6 -rotate-6 bg-ink px-3 py-1 font-mono text-xs text-oncontrast">
                  Тетяна Пан
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- GAZETTE ----------------------------- */
  if (concept === "gazette") {
    const firstLetter = hero.lead.charAt(0);
    const leadRest = hero.lead.slice(1);
    return (
      <section className="relative grain overflow-hidden pb-12 pt-28">
        <div className="container-shell relative">
          <div className="border-y-2 border-ink py-4 text-center">
            <div className="flex items-center justify-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted">
              <span>Засн. 2001</span>
              <span className="h-px w-8 bg-ink/40" />
              <span>Київ</span>
              <span className="h-px w-8 bg-ink/40" />
              <span>Випуск I · 2026</span>
            </div>
            <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,5rem)] leading-none text-ink">
              Pan<span className="text-gold">&amp;</span>Partners
            </h2>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              Продажі · Переговори · B2B-консалтинг
            </p>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 lg:border-r lg:border-ink/20 lg:pr-8">
              <span className="eyebrow">{hero.eyebrow}</span>
              <motion.h1
                {...hm}
                transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
                className="mt-3 text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.03] text-ink"
              >
                {emphasize(hero.title, "B2B-клієнтами")}
              </motion.h1>
              <div className="mt-5 gap-7 text-pretty text-base leading-relaxed text-muted sm:columns-2 [&>p]:mb-3">
                <p>
                  <span className="float-left mr-2 font-display text-6xl leading-[0.7] text-ink">
                    {firstLetter}
                  </span>
                  {leadRest}
                </p>
                <p>{hero.formats}</p>
              </div>
              <div className="mt-6">
                <CTAs />
              </div>
            </div>
            <aside className="lg:col-span-4">
              <div className="border-t-2 border-ink pt-3">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-gold">
                  Цифри номера
                </p>
                <div className="mt-3 flex flex-col divide-y divide-ink/15">
                  {[
                    { v: "25+", l: "років досвіду" },
                    { v: "×5", l: "зростання продажів" },
                    { v: "90%", l: "утримання клієнтів" },
                  ].map((s) => (
                    <div key={s.l} className="flex items-baseline justify-between py-2.5">
                      <span className="font-display text-3xl text-ink">{s.v}</span>
                      <span className="text-xs text-muted">{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    );
  }

  /* --------------------------- CONSTRUCTIVIST ------------------------ */
  if (concept === "construct") {
    return (
      <section className="relative grain min-h-[92vh] overflow-hidden pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-24 -top-10 h-[150%] w-40 rotate-[22deg] bg-gold/90" />
          <div className="absolute right-2 -top-10 h-[150%] w-14 rotate-[22deg] bg-ink" />
          <div className="absolute left-[34%] top-8 hidden h-2.5 w-40 -rotate-[8deg] bg-gold md:block" />
        </div>
        <div className="container-shell relative grid min-h-[calc(92vh-7rem)] items-center">
          <div className="max-w-3xl">
            <span className="eyebrow">{hero.eyebrow}</span>
            <motion.h1
              {...hm}
              transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
              className="mt-4 text-[clamp(2.6rem,6.5vw,5.6rem)] leading-[0.92] text-ink"
            >
              {emphasize(hero.title, "B2B-клієнтами")}
            </motion.h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
            <div className="mt-8">
              <CTAs />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-6 right-8 font-display text-[8rem] leading-none text-gold/25 sm:text-[12rem]">
          ↗
        </div>
      </section>
    );
  }

  /* ---------------------------- CHAMPAGNE ---------------------------- */
  if (concept === "champagne") {
    return (
      <section className="relative grain overflow-hidden pt-32 lg:pt-40">
        <HeroAmbient />
        <div className="container-shell relative pb-20 lg:pb-28">
          <Eyebrow />
          <div className="mt-7 grid items-end gap-12 lg:grid-cols-12">
            <motion.h1
              {...hm}
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
                {...hm}
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
