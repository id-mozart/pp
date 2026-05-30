"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { hero, requests, formats, clients, testimonials, contacts } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, ArrowUpRight, WhatsApp, Telegram } from "@/components/ui/icons";

function Slide({
  n,
  total,
  kicker,
  children,
  className = "",
}: {
  n: string;
  total: string;
  kicker: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="flex min-h-[100svh] snap-start items-center py-24">
      <div className="container-shell w-full">
        <div className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
          <span className="text-gold">{n}</span>
          <span className="h-px w-10 bg-line" />
          <span>{kicker}</span>
          <span className="ml-auto text-faint/70">
            {n} / {total}
          </span>
        </div>
        <div className={className}>{children}</div>
      </div>
    </section>
  );
}

export function DeckHome() {
  const T = "06";
  const t = testimonials.items[0];
  return (
    <div className="deck-root">
      <Slide n="01" total={T} kicker="Pan&Partners · B2B">
        <Reveal className="flex flex-col gap-7">
          <h1 className="max-w-4xl text-[clamp(2.6rem,6.5vw,5.6rem)] leading-[1.0] text-ink">
            Перетворюємо ваші продажі на{" "}
            <span className="text-gradient-gold">систему, що працює</span>.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{hero.lead}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/consultation#book" className="btn btn-primary">
              Забронювати <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="self-center font-mono text-xs uppercase tracking-widest text-faint">
              ↓ гортайте
            </span>
          </div>
        </Reveal>
      </Slide>

      <Slide n="02" total={T} kicker="Проблема">
        <Reveal>
          <h2 className="mb-8 max-w-2xl text-[clamp(1.6rem,3vw,2.4rem)] text-muted">
            Якщо ви впізнаєте тут себе — це те, що ми розвʼязуємо:
          </h2>
          <ul className="flex flex-col">
            {requests.items.map((item, i) => (
              <li
                key={item}
                className="flex items-center gap-5 border-t border-line/40 py-4 last:border-b"
              >
                <span className="font-mono text-sm text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[clamp(1.3rem,3vw,2.2rem)] text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Slide>

      <Slide n="03" total={T} kicker="Підхід">
        <Reveal>
          <h2 className="mb-10 text-[clamp(1.8rem,4vw,3rem)] text-ink">
            Три формати — один результат
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {formats.cards.map((c) => (
              <Link key={c.title} href={c.href} className="group">
                <div className="stat-number text-5xl">{c.number}</div>
                <h3 className="mt-3 text-2xl text-ink transition-colors group-hover:text-gold">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.result}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-gold">
                  {c.cta} <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </Slide>

      <Slide n="04" total={T} kicker="Доказ">
        <Reveal>
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {[
              { v: "25+", l: "років досвіду" },
              { v: "17+", l: "років навчання" },
              { v: "90%", l: "утримання" },
              { v: "6", l: "галузей" },
            ].map((s) => (
              <div key={s.l}>
                <div className="stat-number text-[clamp(3rem,7vw,5.5rem)]">{s.v}</div>
                <div className="mt-1 text-sm text-muted">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            {clients.named.map((nm) => (
              <span key={nm} className="font-display text-2xl text-ink/70">
                {nm}
              </span>
            ))}
          </div>
        </Reveal>
      </Slide>

      <Slide n="05" total={T} kicker="Відгук">
        <Reveal className="max-w-3xl">
          <blockquote className="text-pretty font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.12] text-gradient-gold">
            “{t.quote}”
          </blockquote>
          <p className="mt-6 text-sm text-muted">
            {t.name} — {t.role}
          </p>
        </Reveal>
      </Slide>

      <Slide n="06" total={T} kicker="Дія">
        <Reveal className="flex flex-col gap-7">
          <h2 className="max-w-3xl text-[clamp(2.4rem,6vw,5rem)] leading-[1.0] text-ink">
            Готові продавати <span className="text-gradient-gold">впевнено</span>?
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/consultation#book" className="btn btn-primary">
              Забронювати консультацію <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={contacts.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <WhatsApp className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={contacts.telegram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <Telegram className="h-4 w-4" /> Telegram
            </a>
          </div>
        </Reveal>
      </Slide>
    </div>
  );
}
