"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cookie } from "@/lib/content";

const KEY = "pp-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let v: string | null = null;
    try {
      v = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (!v) {
      const t = setTimeout(() => setShow(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[80] mx-auto max-w-md sm:left-6 sm:right-auto"
          role="dialog"
          aria-label={cookie.title}
        >
          <div className="surface relative overflow-hidden p-5 shadow-[var(--shadow-lux)] backdrop-blur-xl">
            <div className="grain absolute inset-0" />
            <p className="relative font-display text-lg text-ink">{cookie.title}</p>
            <p className="relative mt-2 text-sm leading-relaxed text-muted">
              {cookie.body}
            </p>
            <div className="relative mt-4 flex gap-3">
              <button className="btn btn-primary flex-1 !py-2.5 text-sm" onClick={() => choose("granted")}>
                {cookie.accept}
              </button>
              <button className="btn btn-ghost flex-1 !py-2.5 text-sm" onClick={() => choose("denied")}>
                {cookie.decline}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
