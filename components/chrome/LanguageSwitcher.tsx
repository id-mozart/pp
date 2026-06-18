"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LOCALES,
  LOCALE_NAMES,
  LOCALE_SHORT,
  type Locale,
} from "@/lib/i18n/config";
import {
  useLocale,
  useSwitchLocale,
  useUi,
} from "@/components/providers/LocaleProvider";
import { GRAD_ACC, gradText } from "@/lib/ember";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Compact, flag-free language switcher (UA / RU / EN / ES). */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const switchLocale = useSwitchLocale();
  const ui = useUi();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={ui.a11y.languageNav}
        className="flex h-10 items-center gap-1.5 rounded-full border border-line/70 px-3 font-mono text-xs tracking-[0.18em] text-ink transition-colors hover:border-gold/50 hover:text-gold"
      >
        {LOCALE_SHORT[locale]}
        <svg
          aria-hidden
          viewBox="0 0 10 6"
          className={`h-1.5 w-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute right-0 top-[calc(100%+0.5rem)] z-[80] min-w-[10rem] overflow-hidden rounded-2xl border border-line/70 bg-canvas/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            {LOCALES.map((l: Locale) => {
              const active = l === locale;
              return (
                <li key={l} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setOpen(false);
                      if (!active) switchLocale(l);
                    }}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      active ? "text-gold" : "text-ink/85 hover:bg-raised hover:text-gold"
                    }`}
                  >
                    <span>{LOCALE_NAMES[l]}</span>
                    <span
                      className="font-mono text-[0.62rem] tracking-[0.18em]"
                      style={active ? gradText(GRAD_ACC) : undefined}
                    >
                      {LOCALE_SHORT[l]}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
