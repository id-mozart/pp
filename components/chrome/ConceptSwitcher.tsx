"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useConcept } from "@/components/providers/ConceptProvider";
import { VISIBLE_CONCEPTS as CONCEPTS } from "@/lib/concepts";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ConceptSwitcher() {
  const { concept, setConcept, cycle, cyclePrev } = useConcept();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [toast, setToast] = useState(false);
  const firstRender = useRef(true);

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
      if (e.key === "[") {
        cyclePrev();
        return;
      }
      if (e.key === "]") {
        cycle();
        return;
      }
      let idx = -1;
      if (e.key === "0") idx = 9;
      else if (e.key.length === 1) {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= 9) idx = n - 1;
      }
      if (idx > -1 && CONCEPTS[idx]) {
        setConcept(CONCEPTS[idx].id);
        setOpen(true);
        window.clearTimeout((onKey as any)._t);
        (onKey as any)._t = window.setTimeout(() => setOpen(false), 1600);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setConcept, cycle, cyclePrev]);

  // Brief toast announcing the active concept on switch (great for live demos)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setToast(true);
    const t = setTimeout(() => setToast(false), 1500);
    return () => clearTimeout(t);
  }, [concept]);

  const active = CONCEPTS.find((c) => c.id === concept) ?? CONCEPTS[0];

  return (
    <div
      className="fixed bottom-5 right-5 z-[75] flex flex-col items-end"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 18, x: "-50%" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="surface fixed bottom-6 left-1/2 flex items-center gap-3 rounded-full px-5 py-3 shadow-[var(--shadow-lux)] backdrop-blur-xl"
          >
            <span
              className="grid h-6 w-6 place-items-center rounded-[5px] border"
              style={{ background: active.swatch.canvas, borderColor: active.swatch.gold }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: active.swatch.gold }}
              />
            </span>
            <span className="font-mono text-xs text-faint">{active.numeral}</span>
            <span className="text-sm text-ink">{active.name}</span>
            <span className="hidden text-xs text-muted sm:inline">{active.tagline}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="surface mb-3 max-h-[74vh] w-72 overflow-y-auto p-2 shadow-[var(--shadow-lux)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                Концепція дизайну
              </span>
              <span className="font-mono text-[0.62rem] text-faint">
                {CONCEPTS.length > 9
                  ? "клавіші 1–9 · 0"
                  : `клавіші 1–${CONCEPTS.length}`}
              </span>
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
              {CONCEPTS.length} дизайнів — спробуйте →
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Перемкнути концепцію дизайну"
          aria-expanded={open}
          className="group flex items-center gap-2 rounded-full border border-line/70 bg-surface/80 px-3 py-2.5 shadow-[var(--shadow-lux)] backdrop-blur-xl transition-all duration-500 ease-lux hover:border-gold/50"
        >
          <span
            className="grid h-4 w-4 place-items-center overflow-hidden rounded-[4px] border transition-colors duration-300"
            style={{ background: active.swatch.canvas, borderColor: active.swatch.gold }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: active.swatch.gold }}
            />
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
