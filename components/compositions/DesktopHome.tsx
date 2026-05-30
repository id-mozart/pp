"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { about, formats, testimonials, clients, contacts } from "@/lib/content";
import { ArrowRight, WhatsApp, Telegram, Close } from "@/components/ui/icons";

type AppId = "about" | "formats" | "cases" | "contact";

const APPS: { id: AppId; title: string; x: number; y: number; w: number }[] = [
  { id: "about", title: "Про.app", x: 48, y: 60, w: 360 },
  { id: "formats", title: "Формати.app", x: 470, y: 120, w: 380 },
  { id: "cases", title: "Кейси.app", x: 250, y: 330, w: 400 },
  { id: "contact", title: "Контакт.app", x: 800, y: 70, w: 320 },
];

function Content({ id }: { id: AppId }) {
  if (id === "about")
    return (
      <div className="space-y-2 text-sm leading-relaxed text-muted">
        <p className="font-display text-lg text-ink">Тетяна Пан</p>
        <p>{about.intro}</p>
        <p>• {about.credentials[0]}</p>
        <p className="text-ink">{about.manner}</p>
      </div>
    );
  if (id === "formats")
    return (
      <div className="divide-y divide-line/40">
        {formats.cards.map((c) => (
          <div key={c.number} className="py-2.5">
            <p className="text-base text-ink">
              <span className="text-gold">{c.number}</span> {c.title}
            </p>
            <p className="text-xs text-muted">{c.result}</p>
          </div>
        ))}
      </div>
    );
  if (id === "cases")
    return (
      <div className="space-y-3 text-sm">
        {testimonials.items.slice(0, 3).map((t) => (
          <div key={t.name}>
            <p className="leading-relaxed text-ink">“{t.quote}”</p>
            <p className="text-xs text-gold">{t.name}</p>
          </div>
        ))}
        <p className="pt-1 font-mono text-xs text-faint">
          {clients.named.join(" · ")}
        </p>
      </div>
    );
  return (
    <div className="space-y-3 text-sm">
      <a
        href={contacts.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-ink hover:text-gold"
      >
        <WhatsApp className="h-4 w-4 text-gold" /> {contacts.whatsapp.label}
      </a>
      <a
        href={contacts.telegram.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-ink hover:text-gold"
      >
        <Telegram className="h-4 w-4 text-gold" /> {contacts.telegram.label}
      </a>
      <Link href="/consultation#book" className="btn btn-primary mt-1 w-full !py-2 text-xs">
        Забронювати <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function DesktopHome() {
  const deskRef = useRef<HTMLDivElement>(null);
  const topRef = useRef(APPS.length);
  const [open, setOpen] = useState<Record<AppId, boolean>>({
    about: true,
    formats: true,
    cases: true,
    contact: true,
  });
  const [z, setZ] = useState<Record<AppId, number>>({
    about: 1,
    formats: 2,
    cases: 3,
    contact: 4,
  });

  const focus = (id: AppId) => {
    topRef.current += 1;
    setZ((s) => ({ ...s, [id]: topRef.current }));
  };
  const openApp = (id: AppId) => {
    setOpen((s) => ({ ...s, [id]: true }));
    focus(id);
  };

  return (
    <section
      ref={deskRef}
      className="relative h-[100svh] select-none overflow-hidden pt-[4.6rem]"
    >
      {APPS.map((app) => {
        if (!open[app.id]) return null;
        return (
          <motion.div
            key={app.id}
            drag
            dragConstraints={deskRef}
            dragMomentum={false}
            dragElastic={0}
            onPointerDown={() => focus(app.id)}
            initial={{ x: app.x, y: app.y, opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="surface absolute left-0 top-0 overflow-hidden shadow-[var(--shadow-lux)]"
            style={{ width: app.w, zIndex: z[app.id] }}
          >
            <div className="flex cursor-grab items-center gap-2 border-b border-line/60 bg-raised px-3 py-2 active:cursor-grabbing">
              <button
                onClick={() => setOpen((s) => ({ ...s, [app.id]: false }))}
                aria-label="Закрити"
                className="grid h-3 w-3 place-items-center rounded-full bg-ember/80 text-transparent hover:text-canvas"
              >
                <Close className="h-2 w-2" />
              </button>
              <span className="h-3 w-3 rounded-full bg-gold/70" />
              <span className="h-3 w-3 rounded-full bg-muted/40" />
              <span className="ml-2 font-mono text-xs text-muted">{app.title}</span>
            </div>
            <div className="p-5">
              <Content id={app.id} />
            </div>
          </motion.div>
        );
      })}

      {/* Dock */}
      <div className="absolute bottom-5 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-line/60 bg-surface/80 p-2 shadow-[var(--shadow-lux)] backdrop-blur-xl">
        {APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className={`rounded-xl px-3 py-2 text-xs transition-colors ${
              open[app.id] ? "bg-gold/15 text-gold" : "text-muted hover:bg-ink/[0.06]"
            }`}
          >
            {app.title.replace(".app", "")}
          </button>
        ))}
        <Link
          href="/consultation#book"
          className="rounded-xl bg-gold px-3 py-2 text-xs text-oncontrast"
        >
          Забронювати
        </Link>
      </div>

      <div className="pointer-events-none absolute right-5 top-[5.6rem] font-mono text-xs uppercase tracking-wider text-faint">
        перетягуйте вікна ↔
      </div>
    </section>
  );
}
