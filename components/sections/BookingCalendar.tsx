"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { consultation } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Check, Clock, ArrowRight } from "@/components/ui/icons";

const YEAR = 2026;
const MONTH = 4; // May (0-indexed)
const TODAY = 29;
const AVAILABLE = [29, 30, 31];
const HOURS = [10, 11, 12, 14, 15, 16, 17];

const pad = (n: number) => String(n).padStart(2, "0");

function slotsForDay(day: number) {
  return HOURS.map((h, i) => ({
    label: `${pad(h)}:00 → ${pad(h + 1)}:00`,
    value: `${pad(h)}:00`,
    taken: (day * 3 + i) % 4 === 0,
  }));
}

export function BookingCalendar() {
  const { booking } = consultation;
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  const cells = useMemo(() => {
    const firstWeekday = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();
    const arr: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, []);

  const slots = day ? slotsForDay(day) : [];

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
          appt_date: `${YEAR}-${pad(MONTH + 1)}-${pad(day)}`,
          appt_time: slot,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="book" className="relative border-t border-line/50 bg-surface section-pad">
      <div className="container-shell">
        <Reveal className="mb-10 flex flex-col gap-4">
          <span className="eyebrow">Бронювання</span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
            {booking.title}
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{booking.intro}</p>
        </Reveal>

        {status === "success" ? (
          <SuccessPanel
            text={booking.success}
            date={day ? `${pad(day)} травня ${YEAR}` : ""}
            slot={slot ?? ""}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Calendar */}
            <div className="surface p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-ink">{booking.monthLabel}</span>
                <Legend />
              </div>

              <div className="mt-6 grid grid-cols-7 gap-1.5 text-center">
                {booking.weekdays.map((w) => (
                  <div
                    key={w}
                    className="pb-2 font-mono text-[0.65rem] uppercase tracking-wider text-faint"
                  >
                    {w}
                  </div>
                ))}
                {cells.map((d, i) => {
                  if (d === null) return <div key={`b${i}`} />;
                  const available = AVAILABLE.includes(d);
                  const isToday = d === TODAY;
                  const selected = d === day;
                  return (
                    <button
                      key={d}
                      disabled={!available}
                      onClick={() => {
                        setDay(d);
                        setSlot(null);
                      }}
                      className={[
                        "relative aspect-square rounded-lg text-sm transition-all duration-300",
                        available
                          ? "text-ink hover:bg-gold/10"
                          : "cursor-not-allowed text-faint/50",
                        selected ? "bg-gold/15 ring-1 ring-gold" : "",
                        isToday && !selected ? "ring-1 ring-line" : "",
                      ].join(" ")}
                    >
                      {d}
                      {available && (
                        <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 text-xs text-faint">{booking.timezone}</p>
            </div>

            {/* Slots + form */}
            <div className="surface p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-ink">
                  {booking.slotsHeading}
                </span>
                <span className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">
                  {day ? `${pad(day)} травня` : booking.chooseDay}
                </span>
              </div>

              {!day ? (
                <p className="mt-6 text-sm leading-relaxed text-muted">
                  {booking.slotsPlaceholder}
                </p>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((s) => (
                    <button
                      key={s.value}
                      disabled={s.taken}
                      onClick={() => setSlot(s.value)}
                      className={[
                        "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs transition-all duration-300",
                        s.taken
                          ? "cursor-not-allowed border-line/40 text-faint/40 line-through"
                          : slot === s.value
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

              <div className="my-6 hairline" />

              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  {booking.formLabel}
                </p>
                <input
                  type="text"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                {booking.fields.map((f) =>
                  f.type === "textarea" ? (
                    <textarea
                      key={f.name}
                      name={f.name}
                      rows={3}
                      required={f.required}
                      placeholder={f.placeholder}
                      className="w-full resize-none rounded-xl border border-line/70 bg-canvas/40 px-4 py-3 text-sm text-ink placeholder:text-faint/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/60"
                    />
                  ) : (
                    <input
                      key={f.name}
                      type={f.type}
                      name={f.name}
                      required={f.required}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border border-line/70 bg-canvas/40 px-4 py-3 text-sm text-ink placeholder:text-faint/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/60"
                    />
                  ),
                )}
                <p className="text-xs text-faint">
                  {slot && day
                    ? `Обрано: ${pad(day)} травня, ${slot}`
                    : booking.pickSlotFirst}
                </p>
                <button
                  type="submit"
                  disabled={!day || !slot || status === "submitting"}
                  className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "submitting" ? "Надсилаю…" : booking.submit}
                  {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
                </button>
                {status === "error" && (
                  <p className="text-sm text-ember">
                    Сталася помилка. Спробуйте ще раз.
                  </p>
                )}
                <p className="text-xs leading-relaxed text-faint">{booking.note}</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Legend() {
  const items = [
    { c: "bg-gold", l: "вільно" },
    { c: "bg-faint/50", l: "зайнято" },
    { c: "bg-ember", l: "вихідний" },
  ];
  return (
    <div className="flex items-center gap-3">
      {items.map((it) => (
        <span key={it.l} className="flex items-center gap-1.5 text-[0.65rem] text-faint">
          <span className={`h-1.5 w-1.5 rounded-full ${it.c}`} />
          {it.l}
        </span>
      ))}
    </div>
  );
}

function SuccessPanel({ text, date, slot }: { text: string; date: string; slot: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface flex flex-col items-center gap-5 px-6 py-16 text-center"
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold">
        <Check className="h-8 w-8" strokeWidth={2} />
      </span>
      <p className="max-w-md text-pretty text-lg text-ink">{text}</p>
      {date && (
        <p className="rounded-full bg-gold/10 px-4 py-2 text-sm text-gold">
          {date} · {slot}
        </p>
      )}
    </motion.div>
  );
}
