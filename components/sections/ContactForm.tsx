"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { contact, contacts } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { GRAD_ACC, GRAD_GOLD, CTAG_BG, gradText } from "@/lib/ember";
import { track } from "@/lib/analytics";
import {
  ArrowRight,
  Check,
  WhatsApp,
  Telegram,
} from "@/components/ui/icons";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [topic, setTopic] = useState("");

  // Префіл із кліку по «болю» (Requests кладе тему в sessionStorage)
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, type: "Contact" }),
      });
      if (!res.ok) throw new Error("bad response");
      track("submit_lead");
      setStatus("success");
      form.reset();
      try {
        sessionStorage.removeItem("lead_topic");
      } catch {
        /* ignore */
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-pad">
      <div className="container-shell">
        <div className="relative">
          <span
            aria-hidden
            className="absolute left-10 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
            style={{ background: GRAD_GOLD }}
          />
          <div className="overflow-hidden surface">
            <div className="grid lg:grid-cols-2">
              {/* Left — invitation */}
              <div className="relative grain flex flex-col justify-between gap-10 border-b border-line/60 bg-raised p-8 sm:p-12 lg:border-b-0 lg:border-r">
                <Reveal className="flex flex-col gap-5">
                  <span className="eyebrow">{contact.eyebrow}</span>
                  <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-ink">
                    Поговорімо про{" "}
                    <em className="italic" style={gradText(GRAD_ACC)}>
                      ваші продажі
                    </em>
                  </h2>
                  <p className="max-w-md font-display text-lg italic leading-relaxed text-muted">
                    {contact.body}
                  </p>
                  <span
                    className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                    style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                  >
                    <b className="font-semibold" style={gradText(GRAD_ACC)}>
                      90%
                    </b>{" "}
                    клієнтів продовжують співпрацю
                  </span>
                </Reveal>

                <Reveal delay={0.1} className="flex flex-col gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint">
                    Або напишіть напряму
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={contacts.whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-[10px] border border-line/70 px-4 py-2.5 text-sm text-ink transition-colors hover:border-gold/50 hover:text-gold"
                      style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                    >
                      <WhatsApp className="h-4 w-4 text-gold" /> {contacts.whatsapp.label}
                    </a>
                    <a
                      href={contacts.telegram.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-[10px] border border-line/70 px-4 py-2.5 text-sm text-ink transition-colors hover:border-gold/50 hover:text-gold"
                      style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                    >
                      <Telegram className="h-4 w-4 text-gold" /> {contacts.telegram.label}
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Right — form */}
              <div className="p-8 sm:p-12">
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-5 text-center"
                    >
                      <span
                        className="grid h-16 w-16 place-items-center rounded-full text-oncontrast shadow-[0_14px_30px_-12px_rgb(var(--c-gold)/0.7)]"
                        style={{ background: GRAD_GOLD }}
                      >
                        <Check className="h-8 w-8" strokeWidth={2} />
                      </span>
                      <p className="max-w-sm text-pretty font-display text-xl italic leading-snug text-ink">
                        {contact.success}
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="text-sm text-gold lux-link"
                      >
                        Надіслати ще одну заявку
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={onSubmit}
                      className="flex flex-col gap-5"
                    >
                      {/* honeypot */}
                      <input
                        type="text"
                        name="website_url"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                      />
                      <input type="hidden" name="topic" value={topic} />
                      {contact.fields.map((f) => (
                        <Field
                          key={f.name === "message" ? `message-${topic}` : f.name}
                          {...f}
                          defaultValue={
                            f.name === "message" && topic
                              ? `Запит: ${topic} — `
                              : undefined
                          }
                        />
                      ))}
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="btn btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {status === "submitting" ? "Надсилаю…" : contact.submit}
                        {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
                      </button>
                      <p className="text-xs leading-relaxed text-faint">
                        Відповідаємо протягом робочого дня. Без дзвінків без
                        попередження. Надсилаючи форму, ви погоджуєтеся з{" "}
                        <Link href="/privacy" className="lux-link">
                          політикою конфіденційності
                        </Link>
                        .
                      </p>
                      {status === "error" && (
                        <p className="text-sm text-ember">
                          Щось пішло не так. Спробуйте ще раз — або напишіть нам
                          напряму у WhatsApp чи Telegram.
                        </p>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type,
  placeholder,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  const cls =
    "w-full rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3.5 text-ink caret-[#E2A638] placeholder:text-faint/60 transition-[border-color,background-color,box-shadow] duration-300 focus:border-gold/70 focus:bg-[rgba(35,26,18,.8)] focus:outline-none focus:ring-1 focus:ring-gold/40 focus:shadow-[0_10px_30px_-18px_rgba(226,166,56,.45)]";
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">
          {label}
          {required && <span className="text-gold"> *</span>}
        </span>
      )}
      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={4}
          defaultValue={defaultValue}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          className={cls}
        />
      )}
    </label>
  );
}
