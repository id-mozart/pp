"use client";

import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { formats } from "@/lib/content";

const LABEL = "font-mono text-[0.65rem] uppercase tracking-[0.3em]";

export function MaisonHome() {
  return (
    <>
      {/* Campaign hero */}
      <section className="relative flex h-[100svh] items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/ph/p1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative px-6 text-center text-[rgb(247,244,238)]">
          <p className={`${LABEL} text-white/80`}>Pan&amp;Partners · Maison de Vente</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] font-light leading-[0.95]">
            Мистецтво продажів
          </h1>
          <Link
            href="#method"
            className="mt-8 inline-block border-b border-white/60 pb-1 text-xs uppercase tracking-[0.25em] text-white/90 transition-colors hover:border-white"
          >
            Відкрити
          </Link>
        </div>
      </section>

      {/* Editorial statement */}
      <section id="method" className="section-pad text-center">
        <Reveal className="container-shell mx-auto max-w-3xl">
          <p className={`${LABEL} text-gold`}>L&apos;art de vendre</p>
          <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.6rem)] font-light leading-[1.12] text-ink">
            Продажі та переговори, відточені до рівня мистецтва.
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-gold" />
          <p className="mx-auto mt-8 max-w-xl text-muted">
            Навчаємо команди продавати з B2B-клієнтами — чітко, впевнено, без
            тиску. Двадцять пʼять років майстерності.
          </p>
        </Reveal>
      </section>

      {/* The collection (formats as products) */}
      <section className="pb-24">
        <div className="container-shell">
          <p className={`${LABEL} text-center text-gold`}>Колекція форматів</p>
          <RevealGroup className="mt-12 grid gap-8 md:grid-cols-3">
            {formats.cards.map((c, i) => (
              <RevealItem key={c.number}>
                <Link href={c.href} className="group block text-center">
                  <div className="relative aspect-[3/4] overflow-hidden bg-raised">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/brand/ph/p${i + 3}.jpg`}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-lux group-hover:scale-105"
                    />
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
      <section className="border-t border-line/50 section-pad">
        <div className="container-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/Tania2.jpg" alt="Тетяна Пан" className="aspect-[4/5] w-full object-cover object-top" />
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
