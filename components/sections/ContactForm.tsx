"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contact, contacts } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import {
  ArrowRight,
  Check,
  WhatsApp,
  Telegram,
} from "@/components/ui/icons";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

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
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-pad">
      <div className="container-shell">
        <div className="overflow-hidden surface">
          <div className="grid lg:grid-cols-2">
            {/* Left — invitation */}
            <div className="relative grain flex flex-col justify-between gap-10 border-b border-line/60 bg-raised p-8 sm:p-12 lg:border-b-0 lg:border-r">
              <Reveal className="flex flex-col gap-5">
                <span className="eyebrow">{contact.eyebrow}</span>
                <h2 className="text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-ink">
                  {contact.title}
                </h2>
                <p className="max-w-md text-lg leading-relaxed text-muted">
                  {contact.body}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-faint">
                  Або напишіть напряму
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={contacts.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-full border border-line/70 px-4 py-2.5 text-sm text-ink transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <WhatsApp className="h-4 w-4 text-gold" /> {contacts.whatsapp.label}
                  </a>
                  <a
                    href={contacts.telegram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-full border border-line/70 px-4 py-2.5 text-sm text-ink transition-colors hover:border-gold/50 hover:text-gold"
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
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold">
                      <Check className="h-8 w-8" strokeWidth={2} />
                    </span>
                    <p className="max-w-sm text-pretty text-lg text-ink">
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
                    {contact.fields.map((f) => (
                      <Field key={f.name} {...f} />
                    ))}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {status === "submitting" ? "Надсилаю…" : contact.submit}
                      {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
                    </button>
                    {status === "error" && (
                      <p className="text-sm text-ember">
                        Сталася помилка. Спробуйте ще раз або напишіть у WhatsApp/Telegram.
                      </p>
                    )}
                  </motion.form>
                )}
              </AnimatePresence>
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
}: {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}) {
  const cls =
    "w-full rounded-xl border border-line/70 bg-canvas/40 px-4 py-3 text-ink placeholder:text-faint/70 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/60";
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-muted">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {type === "textarea" ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={cls}
        />
      )}
    </label>
  );
}
