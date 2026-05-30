"use client";

import Link from "next/link";
import { hero, formats, clients, testimonials, contacts } from "@/lib/content";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  WhatsApp,
  Telegram,
  Quote,
} from "@/components/ui/icons";

const STATS = [
  { v: "25+", l: "років у продажах" },
  { v: "17+", l: "років навчання" },
  { v: "90%", l: "продовжують співпрацю" },
];

export function BentoHome() {
  const t = testimonials.items[0];
  return (
    <>
      <section className="container-shell pb-16 pt-28 sm:pt-32">
        <Reveal className="mb-6">
          <span className="eyebrow">{hero.eyebrow}</span>
        </Reveal>
        <RevealGroup className="grid auto-rows-[150px] grid-cols-2 gap-4 md:grid-cols-6">
          {/* Hero tile */}
          <RevealItem className="col-span-2 row-span-2 md:col-span-4">
            <div className="surface flex h-full flex-col justify-between gap-6 p-7 sm:p-9">
              <h1 className="text-[clamp(1.9rem,3.4vw,3.3rem)] leading-[1.04] text-ink">
                Ваша команда продає{" "}
                <span className="text-gradient-gold">B2B</span> — впевнено,
                системно, з результатом.
              </h1>
              <div className="flex flex-wrap gap-3">
                <Link href="/consultation#book" className="btn btn-primary">
                  Забронювати <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#contact" className="btn btn-ghost">
                  Залишити заявку
                </Link>
              </div>
            </div>
          </RevealItem>

          {/* Portrait tile */}
          <RevealItem className="col-span-2 row-span-2">
            <div className="surface relative h-full overflow-hidden !p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/Tania2.jpg"
                alt="Тетяна Пан"
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas/85 to-transparent p-5">
                <p className="font-display text-lg text-ink">Тетяна Пан</p>
                <p className="text-xs text-muted">Власниця Pan&amp;Partners</p>
              </div>
            </div>
          </RevealItem>

          {/* Stats */}
          {STATS.map((s) => (
            <RevealItem key={s.l} className="col-span-1 md:col-span-2">
              <div className="surface flex h-full flex-col justify-center p-6">
                <div className="stat-number text-4xl">{s.v}</div>
                <div className="mt-1 text-xs leading-snug text-muted">{s.l}</div>
              </div>
            </RevealItem>
          ))}

          {/* Formats tile */}
          <RevealItem className="col-span-2 row-span-2 md:col-span-3">
            <div className="surface flex h-full flex-col p-7">
              <p className="font-mono text-xs uppercase tracking-wider text-faint">
                Формати роботи
              </p>
              <div className="mt-3 flex flex-1 flex-col justify-center divide-y divide-line/40">
                {formats.cards.map((c) => (
                  <Link
                    key={c.title}
                    href={c.href}
                    className="group flex items-center justify-between py-3"
                  >
                    <span className="text-lg text-ink transition-colors group-hover:text-gold">
                      {c.title}
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </RevealItem>

          {/* Testimonial tile */}
          <RevealItem className="col-span-2 row-span-2 md:col-span-3">
            <div className="surface flex h-full flex-col justify-between gap-4 p-7">
              <Quote className="h-8 w-8 text-gold/30" />
              <p className="text-pretty text-lg leading-snug text-ink">
                “{t.quote}”
              </p>
              <div>
                <p className="text-sm text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </RevealItem>

          {/* Clients tile */}
          <RevealItem className="col-span-2 md:col-span-4">
            <div className="surface flex h-full flex-col justify-center p-7">
              <p className="font-mono text-xs uppercase tracking-wider text-faint">
                Серед клієнтів
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                {clients.named.map((n) => (
                  <span key={n} className="font-display text-xl text-ink/80">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </RevealItem>

          {/* Contacts tile */}
          <RevealItem className="col-span-2 md:col-span-2">
            <div className="surface flex h-full flex-col justify-center gap-3 p-6">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-ink transition-colors hover:text-gold"
              >
                <WhatsApp className="h-4 w-4 text-gold" /> {contacts.whatsapp.label}
              </a>
              <a
                href={contacts.telegram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-ink transition-colors hover:text-gold"
              >
                <Telegram className="h-4 w-4 text-gold" /> {contacts.telegram.label}
              </a>
            </div>
          </RevealItem>
        </RevealGroup>
      </section>
      <ContactForm />
    </>
  );
}
