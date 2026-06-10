"use client";

import Link from "next/link";
import { Ambient } from "@/components/ui/Ambient";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { formats } from "@/lib/content";

const LABEL = "font-mono text-[0.65rem] uppercase tracking-[0.3em]";

export function MaisonNoirHome() {
  return (
    <>
      {/* Cinematic couture hero (Ember bg + Maison composition) */}
      <section className="relative grain flex min-h-[100svh] items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/Tania1-3.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/75 via-canvas/45 to-canvas/90" />
        <Ambient />
        <div className="pointer-events-none absolute inset-5 border border-gold/25 sm:inset-8" />
        <div className="relative px-6 text-center">
          <p className={`${LABEL} text-gold`}>Pan&amp;Partners · Maison de Vente</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,7.5rem)] font-light leading-[0.95] text-ink">
            Мистецтво продажів
          </h1>
          <Link
            href="#method"
            className="mt-8 inline-block border-b border-gold/60 pb-1 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:border-gold"
          >
            Відкрити
          </Link>
        </div>
      </section>

      {/* Editorial statement */}
      <section id="method" className="relative grain overflow-hidden section-pad text-center">
        <Ambient />
        <Reveal className="container-shell relative mx-auto max-w-3xl">
          <p className={`${LABEL} text-gold`}>L&apos;art de vendre</p>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.6rem)] font-light leading-[1.12] text-ink">
            Продажі та переговори, відточені до рівня{" "}
            <span className="text-gradient-gold">мистецтва</span>.
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-gold" />
          <p className="mx-auto mt-8 max-w-xl text-muted">
            Навчаємо команди продавати з B2B-клієнтами — чітко, впевнено, без
            тиску. Двадцять пʼять років майстерності.
          </p>
        </Reveal>
      </section>

      {/* The collection */}
      <section className="pb-24">
        <div className="container-shell">
          <p className={`${LABEL} text-center text-gold`}>Колекція форматів</p>
          <RevealGroup className="mt-12 grid gap-8 md:grid-cols-3">
            {formats.cards.map((c, i) => (
              <RevealItem key={c.number}>
                <Link href={c.href} className="group block text-center">
                  <div className="relative aspect-[3/4] overflow-hidden border border-gold/20 bg-raised">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/brand/ph/p${i + 3}.jpg`}
                      alt=""
                      className="h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] ease-lux group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 to-transparent" />
                  </div>
                  <p className="mt-5 font-display text-2xl font-light text-ink">{c.title}</p>
                  <p className="mt-1 text-sm text-muted">{c.result}</p>
                  <span className="mt-3 inline-block border-b border-gold/60 pb-0.5 text-[0.7rem] uppercase tracking-[0.25em] text-gold">
                    Дізнатися
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* La Créatrice */}
      <section className="relative grain overflow-hidden border-t border-line/50 section-pad">
        <Ambient />
        <div className="container-shell relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative overflow-hidden border border-gold/25">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/Tania2.jpg" alt="Тетяна Пан" className="aspect-[4/5] w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/50 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="text-center lg:text-left">
            <p className={`${LABEL} text-gold`}>La Créatrice</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.4rem)] font-light text-ink">
              Тетяна Пан
            </h2>
            <div className="mx-auto mt-6 h-px w-16 bg-gold lg:mx-0" />
            <p className="mt-6 max-w-md text-muted lg:mx-0">
              Власниця Pan&amp;Partners. 25+ років у продажах — «Олімп», Danone,
              Coca-Cola. 17+ років навчаємо команди продавати природно та з
              результатом.
            </p>
            <Link href="/consultation#book" className="btn btn-primary mt-8">
              Записатися на консультацію
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
