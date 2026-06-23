"use client";

import Link from "next/link";
import { useContent, useUi, useLocalizedHref } from "@/components/providers/LocaleProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Check } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, CTAG_BG, gradText } from "@/lib/ember";

export function CoursesIntro() {
  const { courses } = useContent();
  const { hero } = courses;
  return (
    <section className="pb-4">
      <div className="container-shell">
        {/* numbered solutions — три окремі плити */}
        <RevealGroup className="grid gap-3 sm:grid-cols-3">
          {hero.items.map((it) => (
            <RevealItem key={it.n}>
              <div
                className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line/70 transition-colors duration-500 ease-lux hover:border-gold/40"
                style={{ background: CARD_BG }}
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt={it.title}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-20"
                    style={{
                      background:
                        "linear-gradient(0deg,rgba(19,12,6,.97),rgba(19,12,6,.5) 48%,transparent)",
                    }}
                  />
                </div>
                <div className="relative -mt-7 flex flex-1 flex-col px-7 pb-7">
                  <span className="font-display text-3xl" style={gradText(GRAD_ACC)}>
                    {it.n}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-medium text-ink">
                    {it.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{it.sub}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* features */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {hero.features.map((f) => (
            <Reveal key={f.title}>
              <div
                className="relative h-full rounded-[14px] border border-line/70 p-7"
                style={{ background: CARD_BG }}
              >
                <span
                  aria-hidden
                  className="absolute left-7 top-0 h-[3px] w-10 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                <h3 className="font-display text-xl font-medium text-ink">
                  {f.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-muted">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                        strokeWidth={2.2}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const ctagCls =
  "rounded-[10px] border border-line/70 px-3 py-1.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink backdrop-blur-md";
const ctagStyle = { background: CTAG_BG, borderLeft: "3px solid #E2A638" } as const;

export function CoursesList() {
  const { courses } = useContent();
  const ui = useUi();
  const localizedHref = useLocalizedHref();
  const { list } = courses;
  const EXTRA = ui.coursesPage.extra;
  return (
    <section id="catalog" className="section-pad">
      <div className="container-shell">
        <Reveal className="mb-10 flex flex-col gap-4">
          <span className="eyebrow">{ui.coursesPage.catalog}</span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
            {list.title}
          </h2>
          <span
            aria-hidden
            className="h-[2px] w-16 rounded-full"
            style={{ background: GRAD_GOLD }}
          />
          <p className="max-w-xl font-display text-lg italic leading-relaxed text-muted">
            {list.subtitle}
          </p>
        </Reveal>

        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.cards.map((c) => {
            const internal = c.href.startsWith("/");
            const cardCls =
              "group flex h-full flex-col overflow-hidden rounded-[14px] border border-line/70 transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-gold/40";
            const inner = (
              <>
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className={`absolute right-3 top-3 ${ctagCls}`} style={ctagStyle}>
                    {c.price}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-medium text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {c.short}
                  </p>
                  <span
                    className="mt-5 inline-flex items-center gap-2 font-display text-base italic transition-transform duration-500 ease-lux group-hover:translate-x-1.5"
                    style={gradText(GRAD_ACC)}
                  >
                    {c.cta} →
                  </span>
                  <span className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                    {ui.coursesPage.opensOnCoursePage}
                  </span>
                </div>
              </>
            );
            return (
              <RevealItem key={c.title}>
                {internal ? (
                  <Link href={localizedHref(c.href)} className={cardCls} style={{ background: CARD_BG }}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardCls}
                    style={{ background: CARD_BG }}
                  >
                    {inner}
                  </a>
                )}
              </RevealItem>
            );
          })}

          {EXTRA.map((c) => (
            <RevealItem key={c.title}>
              <Link
                href="#contact"
                className="group flex h-full flex-col justify-between rounded-[14px] border border-line/70 p-6 transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-gold/40"
                style={{ background: CARD_BG }}
              >
                <div>
                  <span className={`inline-flex ${ctagCls}`} style={ctagStyle}>
                    {c.price}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-medium text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.short}</p>
                </div>
                <span
                  className="mt-8 inline-flex items-center gap-2 font-display text-base italic transition-transform duration-500 ease-lux group-hover:translate-x-1.5"
                  style={gradText(GRAD_ACC)}
                >
                  {ui.coursesPage.learnMore}
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
