"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useContent, useUi, useLocalizedHref } from "@/components/providers/LocaleProvider";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";

/**
 * Formats as three tall «cover-slide» cards in the Instagram-story style:
 * photo + scrims, mono gradient index, Spectral title with italic gradient
 * accent, gold rule, ctag plates and an italic CTA line.
 */
export function FormatsShowcase({ lean = false }: { lean?: boolean } = {}) {
  const { formats } = useContent();
  const ui = useUi();
  const localized = useLocalizedHref();

  /* Per-card presentation: photo, framed title with the italic accent, short result */
  const SHOWCASE: {
    kicker: string;
    title: ReactNode;
    photo: string;
    pos: string;
    result: string;
  }[] = [
    {
      kicker: ui.formats.kicker1,
      title: (
        <>
          {ui.formats.title1Pre}
          <em className="italic" style={gradText(GRAD_ACC)}>
            {ui.formats.title1Em}
          </em>
        </>
      ),
      photo: "/brand/format-trainings.jpg",
      pos: "center 55%",
      result: ui.formats.result1,
    },
    {
      kicker: ui.formats.kicker2,
      title: (
        <>
          {ui.formats.title2Pre}
          <em className="italic" style={gradText(GRAD_ACC)}>
            {ui.formats.title2Em}
          </em>
        </>
      ),
      photo: "/brand/format-courses.jpg",
      pos: "center 42%",
      result: ui.formats.result2,
    },
    {
      kicker: ui.formats.kicker3,
      title: (
        <>
          {ui.formats.title3Pre}
          <em className="italic" style={gradText(GRAD_ACC)}>
            {ui.formats.title3Em}
          </em>
        </>
      ),
      photo: "/brand/format-mentoring.jpg",
      pos: "center 42%",
      result: ui.formats.result3,
    },
  ];

  return (
    <section id="formats" className="relative grain section-pad">
      <div className="container-shell">
        <Reveal className="mb-12 flex flex-col gap-4">
          <span
            className="font-mono text-xs font-medium uppercase tracking-[0.32em]"
            style={gradText(GRAD_ACC)}
          >
            {formats.eyebrow}
          </span>
          {lean ? (
            /* lean: заголовок одним рядком на всю ширину, без підзаголовка */
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              {ui.formats.choosePre}
              <em className="italic" style={gradText(GRAD_ACC)}>
                {ui.formats.chooseEm}
              </em>
              {ui.formats.choosePost}
            </h2>
          ) : (
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
                {ui.formats.choosePre}
                <em className="italic" style={gradText(GRAD_ACC)}>
                  {ui.formats.chooseEm}
                </em>
                {ui.formats.choosePost}
              </h2>
              <p className="max-w-sm font-display text-lg italic leading-relaxed text-muted">
                {formats.subtitle}
              </p>
            </div>
          )}
        </Reveal>

        <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Порядок показу: тренінги → менторинг → курси (2-га і 3-тя послуги місцями) */}
          {[0, 2, 1].map((idx, pos) => {
            const card = formats.cards[idx];
            if (!card) return null;
            const s = SHOWCASE[idx];
            const number = String(pos + 1).padStart(2, "0");
            return (
              <RevealItem key={idx}>
                <Link
                  href={localized(card.href)}
                  className="group relative block overflow-hidden rounded-[14px] border border-line/60 transition-colors duration-500 hover:border-gold/50"
                  style={{ aspectRatio: "4 / 5.4", backgroundColor: "#0b0a09", boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
                >
                  {/* фото — притиснуте до верху; на вузьких екранах підняте вище,
                      нижній край розчиняється маскою в темну основу */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.photo}
                    alt=""
                    className="absolute inset-x-0 top-0 w-full origin-top -translate-y-[9%] transition-transform duration-700 ease-lux group-hover:scale-[1.04] xl:translate-y-0"
                    style={{
                      maskImage:
                        "linear-gradient(180deg,#000 46%,rgba(0,0,0,0.55) 66%,transparent 82%)",
                      WebkitMaskImage:
                        "linear-gradient(180deg,#000 46%,rgba(0,0,0,0.55) 66%,transparent 82%)",
                    }}
                    loading="lazy"
                  />
                  {/* верхній скрим під runhead */}
                  <div
                    className="absolute inset-x-0 top-0 h-28"
                    style={{
                      background:
                        "linear-gradient(180deg,rgba(13,9,5,.78) 0%,rgba(13,9,5,.22) 55%,transparent 100%)",
                    }}
                  />
                  {/* затемнення вниз — фото зливається у темну основу */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg,rgba(11,9,8,0) 26%,rgba(11,9,8,.6) 48%,#0b0a09 66%)",
                    }}
                  />

                  {/* runhead-індекс */}
                  <div className="absolute left-6 right-6 top-5 flex items-center justify-between font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em]">
                    <span style={gradText(GRAD_ACC)}>
                      {number} — {s.kicker}
                    </span>
                    <span className="h-2 w-2 rounded-full" style={{ background: GRAD_GOLD }} />
                  </div>

                  {/* нижня картка */}
                  <div
                    className="absolute inset-x-4 bottom-4 rounded-[14px] border border-line/70 p-6"
                    style={{ background: CARD_BG }}
                  >
                    <span
                      className="absolute left-6 top-0 h-[3px] w-16 -translate-y-1/2 rounded-full"
                      style={{ background: GRAD_GOLD }}
                    />
                    <h3 className="whitespace-nowrap font-display text-[1.3rem] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[1.05rem] lg:text-[clamp(1.1rem,1.7vw,1.5rem)]">
                      {s.title}
                    </h3>
                    <p className="mt-3 font-display text-[0.98rem] italic leading-snug text-muted">
                      {card.summary}
                    </p>

                    {!lean && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span
                          className="inline-flex items-center gap-2 rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                          style={{
                            background: "rgba(35,26,18,.84)",
                            borderLeft: "3px solid #E2A638",
                          }}
                        >
                          {ui.formats.resultBadge}{" "}
                          <b className="font-semibold" style={gradText(GRAD_ACC)}>
                            {s.result}
                          </b>
                        </span>
                      </div>
                    )}

                    <div className="mt-5 border-t border-line/60 pt-4">
                      <span className="font-display text-base italic text-muted">
                        {card.who}
                      </span>
                    </div>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
