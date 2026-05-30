"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { formats, clients, testimonials, contacts } from "@/lib/content";
import { ArrowRight, WhatsApp, Telegram } from "@/components/ui/icons";

const PLANE_W = 2400;
const PLANE_H = 1500;

function Block({
  x,
  y,
  rot = 0,
  w,
  children,
}: {
  x: number;
  y: number;
  rot?: number;
  w: number;
  children: ReactNode;
}) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, width: w, transform: `rotate(${rot}deg)` }}
    >
      <div className="surface p-6 shadow-[var(--shadow-lux)]">{children}</div>
    </div>
  );
}

export function CanvasHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  return (
    <section className="relative h-[100svh] select-none overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <motion.div
          drag={!reduce}
          dragConstraints={containerRef}
          dragElastic={0.05}
          className="absolute left-1/2 top-1/2 cursor-grab active:cursor-grabbing"
          style={{
            width: PLANE_W,
            height: PLANE_H,
            marginLeft: -PLANE_W / 2,
            marginTop: -PLANE_H / 2,
            backgroundImage:
              "radial-gradient(circle, rgb(var(--c-ink) / 0.09) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        >
          {/* Hero */}
          <Block x={860} y={470} rot={-1.5} w={480}>
            <span className="eyebrow">Pan&amp;Partners</span>
            <h1 className="mt-3 text-[2.6rem] leading-[1.02] text-ink">
              Продажі як <span className="text-gradient-gold">система</span>, а
              не везіння
            </h1>
            <p className="mt-3 text-sm text-muted">
              Навчаємо команди продавати й вести переговори з B2B-клієнтами.
            </p>
            <Link href="/consultation#book" className="btn btn-primary mt-5">
              Забронювати <ArrowRight className="h-4 w-4" />
            </Link>
          </Block>

          {/* About */}
          <Block x={1430} y={560} rot={1.5} w={340}>
            <p className="font-mono text-xs uppercase tracking-wider text-faint">
              Експерт
            </p>
            <p className="mt-2 font-display text-xl text-ink">Тетяна Пан</p>
            <p className="mt-1 text-sm text-muted">
              25+ років у продажах · Олімп, Danone, Coca-Cola. 17+ років навчаю.
            </p>
          </Block>

          {/* Stats */}
          <Block x={520} y={720} rot={-3} w={260}>
            <div className="flex items-baseline gap-4">
              <span className="stat-number text-4xl">90%</span>
              <span className="text-xs text-muted">клієнтів продовжують співпрацю</span>
            </div>
          </Block>

          {/* Clients */}
          <Block x={930} y={250} rot={1} w={420}>
            <p className="font-mono text-xs uppercase tracking-wider text-faint">
              Серед клієнтів
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {clients.named.map((n) => (
                <span key={n} className="font-display text-lg text-ink/80">
                  {n}
                </span>
              ))}
            </div>
          </Block>

          {/* Testimonial */}
          <Block x={1500} y={250} rot={-2.5} w={360}>
            <p className="text-sm leading-relaxed text-ink">
              “{testimonials.items[0].quote}”
            </p>
            <p className="mt-3 text-xs text-gold">{testimonials.items[0].name}</p>
          </Block>

          {/* Formats */}
          {formats.cards.map((c, i) => (
            <Block key={c.number} x={620 + i * 360} y={1010 + (i % 2) * 30} rot={i % 2 ? 2 : -2} w={300}>
              <span className="stat-number text-2xl">{c.number}</span>
              <p className="mt-1 text-lg text-ink">{c.title}</p>
              <p className="mt-1 text-xs text-muted">{c.result}</p>
            </Block>
          ))}

          {/* Contact */}
          <Block x={1620} y={1000} rot={2} w={300}>
            <p className="font-mono text-xs uppercase tracking-wider text-faint">
              Прямий контакт
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-ink hover:text-gold"
              >
                <WhatsApp className="h-4 w-4 text-gold" /> {contacts.whatsapp.label}
              </a>
              <a
                href={contacts.telegram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-ink hover:text-gold"
              >
                <Telegram className="h-4 w-4 text-gold" /> {contacts.telegram.label}
              </a>
            </div>
          </Block>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-line/60 bg-surface/80 px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted backdrop-blur-md">
        ✋ тягніть полотно, щоб досліджувати
      </div>
    </section>
  );
}
