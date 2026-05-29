"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useConcept } from "@/components/providers/ConceptProvider";
import { CONCEPTS } from "@/lib/concepts";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ConceptSwitcher() {
  const { concept, setConcept } = useConcept();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);

  // Gentle one-time discovery hint
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem("pp-switcher-seen") === "1";
    } catch {
      /* ignore */
    }
    if (!seen) {
      const t1 = setTimeout(() => setHint(true), 2600);
      const t2 = setTimeout(() => {
        setHint(false);
        try {
          localStorage.setItem("pp-switcher-seen", "1");
        } catch {
          /* ignore */
        }
      }, 8200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, []);

  // Keyboard: 1 / 2 / 3 switch concepts (ignored while typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const idx = ["1", "2", "3"].indexOf(e.key);
      if (idx > -1 && CONCEPTS[idx]) {
        setConcept(CONCEPTS[idx].id);
        setOpen(true);
        window.clearTimeout((onKey as any)._t);
        (onKey as any)._t = window.setTimeout(() => setOpen(false), 1600);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setConcept]);

  const active = CONCEPTS.find((c) => c.id === concept) ?? CONCEPTS[0];

  return (
    <div
      className="fixed bottom-5 right-5 z-[75] flex flex-col items-end"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="surface mb-3 w-72 overflow-hidden p-2 shadow-[var(--shadow-lux)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                Концепція дизайну
              </span>
              <span className="font-mono text-[0.62rem] text-faint">1 · 2 · 3</span>
            </div>
            {CONCEPTS.map((c) => {
              const isActive = c.id === concept;
              return (
                <button
                  key={c.id}
                  onClick={() => setConcept(c.id)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    isActive ? "bg-gold/10" : "hover:bg-ink/[0.04]"
                  }`}
                  aria-pressed={isActive}
                >
                  <Swatch swatch={c.swatch} active={isActive} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[0.62rem] text-faint">
                        {c.numeral}
                      </span>
                      <span
                        className={`truncate text-sm ${isActive ? "text-gold" : "text-ink"}`}
                      >
                        {c.name}
                      </span>
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {c.tagline}
                    </span>
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="concept-dot"
                      className="h-1.5 w-1.5 rounded-full bg-gold"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {hint && !open && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="surface absolute bottom-1 right-14 whitespace-nowrap rounded-full px-3 py-1.5 text-xs text-muted shadow-[var(--shadow-lux)]"
            >
              Спробуйте 3 дизайни →
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Перемкнути концепцію дизайну"
          aria-expanded={open}
          className="group flex items-center gap-2 rounded-full border border-line/70 bg-surface/80 px-3 py-2.5 shadow-[var(--shadow-lux)] backdrop-blur-xl transition-all duration-500 ease-lux hover:border-gold/50"
        >
          <span className="flex items-center gap-1.5">
            {CONCEPTS.map((c) => (
              <span
                key={c.id}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  background: c.swatch.gold,
                  outline: c.id === concept ? "2px solid rgb(var(--c-gold))" : "none",
                  outlineOffset: "2px",
                  opacity: c.id === concept ? 1 : 0.55,
                }}
              />
            ))}
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
            {active.numeral}
          </span>
        </button>
      </div>
    </div>
  );
}

function Swatch({
  swatch,
  active,
}: {
  swatch: { canvas: string; gold: string; ink: string };
  active: boolean;
}) {
  return (
    <span
      className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border"
      style={{
        background: swatch.canvas,
        borderColor: active ? swatch.gold : "rgb(var(--c-line))",
      }}
    >
      <span
        className="h-3.5 w-3.5 rounded-full"
        style={{ background: swatch.gold }}
      />
      <span
        className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full"
        style={{ background: swatch.ink }}
      />
    </span>
  );
}
