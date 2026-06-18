"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useContent, useUi, useLocale, useLocalizedHref } from "@/components/providers/LocaleProvider";
import { LOCALE_INTL } from "@/lib/i18n/config";
import type { UiStrings } from "@/lib/i18n/ui";
import { Reveal } from "@/components/ui/Reveal";
import { Check, Clock, ArrowRight } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, CTAG_BG, FIELD_CLS, gradText } from "@/lib/ember";
import { track } from "@/lib/analytics";
import Link from "next/link";

const HOURS = [10, 11, 12, 14, 15, 16, 17];
const pad = (n: number) => String(n).padStart(2, "0");

/* Найближчі 5 робочих днів, починаючи з завтра */
function nextBusinessDays(count: number): Date[] {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6) out.push(new Date(d));
  }
  return out;
}

const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function icsHref(date: Date, slot: string, summary: string, description: string) {
  const [h] = slot.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, 0, 0, 0);
  const end = new Date(start);
  end.setHours(h + 1);
  const f = (x: Date) =>
    x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function BookingCalendar({
  title,
  lead,
}: {
  /** Override the section heading (defaults to «Бронювання консультації»). */
  title?: ReactNode;
  lead?: string;
} = {}) {
  const { consultation } = useContent();
  const ui = useUi();
  const locale = useLocale();
  const localized = useLocalizedHref();
  const { booking } = consultation;
  const intlLocale = LOCALE_INTL[locale];
  const fmtLong = useMemo(
    () =>
      new Intl.DateTimeFormat(intlLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [intlLocale],
  );
  const fmtShort = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long" }),
    [intlLocale],
  );
  const monthFmt = useMemo(
    () => new Intl.DateTimeFormat(intlLocale, { month: "long", year: "numeric" }),
    [intlLocale],
  );
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [topic, setTopic] = useState("");

  // Префіл «Запиту» з кліку по болю/репліці (sessionStorage + подія)
  useEffect(() => {
    try {
      const t = sessionStorage.getItem("lead_topic");
      if (t) setTopic(t);
    } catch {
      /* ignore */
    }
    const onTopic = (e: Event) => {
      const d = (e as CustomEvent<string>).detail;
      if (d) setTopic(d);
    };
    window.addEventListener("pp:lead-topic", onTopic);
    return () => window.removeEventListener("pp:lead-topic", onTopic);
  }, []);

  const available = useMemo(() => nextBusinessDays(5), []);
  const availableIso = useMemo(() => new Set(available.map(iso)), [available]);

  /* Сітка місяця: показуємо місяць першого доступного дня */
  const anchor = available[0];
  const cells = useMemo(() => {
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    const firstWeekday = (new Date(y, m, 1).getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const arr: (Date | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(y, m, d));
    return arr;
  }, [anchor]);

  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const slots = HOURS.map((h) => ({ label: `${pad(h)}:00`, value: `${pad(h)}:00` }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!day || !slot) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          type: "Consultation",
          appt_date: iso(day),
          appt_time: slot,
        }),
      });
      if (!res.ok) throw new Error();
      track("submit_booking");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="book" className="section-pad">
      <div className="container-shell">
        <div className="relative">
          <span
            aria-hidden
            className="absolute left-10 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
            style={{ background: GRAD_GOLD }}
          />
          {status === "success" ? (
            <SuccessPanel
              text={booking.success}
              date={day ? fmtLong.format(day) : ""}
              slot={slot ?? ""}
              ics={
                day && slot
                  ? icsHref(day, slot, ui.booking.icsSummary, ui.booking.icsDescription)
                  : null
              }
              ui={ui}
            />
          ) : (
            <div className="overflow-hidden surface">
              <div className="grid lg:grid-cols-2">
                {/* Left — вибір дати й часу */}
                <div className="relative grain flex flex-col gap-7 border-b border-line/60 bg-raised p-6 sm:p-8 md:p-10 lg:border-b-0 lg:border-r">
                  <Reveal className="flex flex-col gap-2">
                    <span className="eyebrow">{ui.booking.eyebrow}</span>
                    <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.05] text-ink">
                      {title ?? (
                        <>
                          {ui.booking.titlePre}
                          <em className="italic" style={gradText(GRAD_ACC)}>
                            {ui.booking.titleEm}
                          </em>
                        </>
                      )}
                    </h2>
                  </Reveal>

                  {/* Календар */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg capitalize text-ink">
                        {monthFmt.format(anchor)}
                      </span>
                      <span className="flex items-center gap-1.5 text-[0.65rem] text-faint">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {ui.booking.free}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-0.5 text-center sm:gap-1.5">
                      {booking.weekdays.map((w) => (
                        <div
                          key={w}
                          className="pb-2 font-mono text-[0.7rem] uppercase tracking-wider text-faint"
                        >
                          {w}
                        </div>
                      ))}
                      {cells.map((d, i) => {
                        if (d === null) return <div key={`b${i}`} />;
                        const isAvail = availableIso.has(iso(d));
                        const selected = day !== null && iso(d) === iso(day);
                        return (
                          <button
                            key={iso(d)}
                            type="button"
                            disabled={!isAvail}
                            onClick={() => {
                              setDay(d);
                              setSlot(null);
                            }}
                            className={[
                              "relative aspect-square rounded-lg text-sm transition-all duration-300",
                              isAvail
                                ? "text-ink hover:bg-gold/10"
                                : "cursor-not-allowed text-faint/50",
                              selected ? "bg-gold/15 ring-1 ring-gold" : "",
                            ].join(" ")}
                          >
                            {d.getDate()}
                            {isAvail && (
                              <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Слоти часу */}
                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint">
                        {booking.slotsHeading}
                      </span>
                      <span
                        className="inline-flex items-center rounded-[10px] border border-line/70 px-3 py-1.5 font-mono text-[0.6rem] font-medium uppercase tracking-[0.1em] text-ink"
                        style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                      >
                        {day ? fmtShort.format(day) : booking.chooseDay}
                      </span>
                    </div>
                    {!day ? (
                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {booking.slotsPlaceholder}
                      </p>
                    ) : (
                      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {slots.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => setSlot(s.value)}
                            className={[
                              "flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-2.5 text-xs transition-all duration-300",
                              slot === s.value
                                ? "border-gold bg-gold/15 text-gold"
                                : "border-line/60 text-ink hover:border-gold/50",
                            ].join(" ")}
                          >
                            <Clock className="h-3 w-3" />
                            {s.value}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right — форма (як на головній) */}
                <div className="p-6 sm:p-8 md:p-12">
                  <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    {topic && (
                      <p
                        className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.18em]"
                        style={gradText(GRAD_ACC)}
                      >
                        {ui.booking.requestSaved}
                      </p>
                    )}
                    <input
                      type="text"
                      name="website_url"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                    />
                    {booking.fields.map((f) => (
                      <label
                        key={f.name === "message" ? `message-${topic}` : f.name}
                        className="flex flex-col gap-2"
                      >
                        {f.label && (
                          <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                            {f.label}
                            {f.required && <span className="text-gold"> *</span>}
                          </span>
                        )}
                        {f.type === "textarea" ? (
                          <textarea
                            name={f.name}
                            rows={4}
                            required={f.required}
                            placeholder={f.placeholder}
                            defaultValue={topic ? `${ui.booking.topicPrefix} ${topic} — ` : undefined}
                            className={`${FIELD_CLS} resize-none`}
                          />
                        ) : (
                          <input
                            type={f.type}
                            name={f.name}
                            required={f.required}
                            placeholder={f.placeholder}
                            className={FIELD_CLS}
                          />
                        )}
                      </label>
                    ))}
                    <p className="text-xs text-faint">
                      {slot && day
                        ? `${ui.booking.chosenPrefix} ${fmtShort.format(day)}, ${slot}`
                        : booking.pickSlotFirst}
                    </p>
                    <button
                      type="submit"
                      disabled={!day || !slot || status === "submitting"}
                      className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === "submitting" ? ui.booking.sending : booking.submit}
                      {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
                    </button>
                    {status === "error" && (
                      <p className="text-sm text-ember">{ui.booking.error}</p>
                    )}
                    <p className="text-xs leading-relaxed text-faint">{booking.note}</p>
                    <p className="text-xs leading-relaxed text-faint">
                      {ui.booking.finePre}
                      <Link href={localized("/privacy")} className="lux-link">
                        {ui.booking.fineLink}
                      </Link>
                      {ui.booking.finePost}
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SuccessPanel({
  text,
  date,
  slot,
  ics,
  ui,
}: {
  text: string;
  date: string;
  slot: string;
  ics: string | null;
  ui: UiStrings;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <span
        aria-hidden
        className="absolute left-10 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
        style={{ background: GRAD_GOLD }}
      />
      <div
        className="flex flex-col items-center gap-5 rounded-[14px] border border-line/70 px-6 py-16 text-center"
        style={{ background: CARD_BG }}
      >
        <span
          className="grid h-16 w-16 place-items-center rounded-full text-oncontrast shadow-[0_14px_30px_-12px_rgb(var(--c-gold)/0.7)]"
          style={{ background: GRAD_GOLD }}
        >
          <Check className="h-8 w-8" strokeWidth={2} />
        </span>
        <p className="max-w-md text-pretty font-display text-xl italic leading-snug text-ink">
          {text}
        </p>
        {date && (
          <span
            className="inline-flex items-center rounded-[10px] border border-line/70 px-4 py-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink"
            style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
          >
            {date} · {slot}
          </span>
        )}
        <div className="mt-2 max-w-md text-left">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-faint">
            {ui.booking.whatsNext}
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm text-muted">
            <li>{ui.booking.step1}</li>
            <li>{ui.booking.step2}</li>
            <li>{ui.booking.step3}</li>
          </ol>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {ics && (
            <a href={ics} download="consultation-panpartners.ics" className="btn btn-ghost !px-5 !py-2.5 text-sm">
              {ui.booking.addToCalendar}
            </a>
          )}
          <a
            href="https://t.me/+380504481411"
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-base italic"
            style={gradText(GRAD_ACC)}
          >
            {ui.booking.telegramReschedule}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
