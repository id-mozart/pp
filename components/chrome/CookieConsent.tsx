"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useContent } from "@/components/providers/LocaleProvider";

const KEY = "pp-cookie-consent";

export function CookieConsent() {
  const { cookie } = useContent();
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

  const pathname = usePathname() || "";
  if (pathname.includes("/admin/story_gen")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-3 right-3 z-[80] mx-auto max-w-md sm:left-6 sm:right-auto"
          role="dialog"
          aria-label={cookie.title}
        >
          <div
            className="relative overflow-hidden rounded-[14px] border border-line/70 p-5 shadow-[var(--shadow-lux)] backdrop-blur-xl"
            style={{
              background:
                "linear-gradient(160deg,rgba(33,21,10,.95),rgba(19,12,6,.96))",
            }}
          >
            <span
              aria-hidden
              className="absolute left-5 top-0 h-[3px] w-10 rounded-full"
              style={{
                background:
                  "linear-gradient(100deg,#F0C26E 0%,#E2A638 55%,#C5631F 100%)",
              }}
            />
            <div className="grain absolute inset-0" />
            <p className="relative font-display text-lg text-ink">{cookie.title}</p>
            <p className="relative mt-2 text-sm leading-relaxed text-muted">
              {cookie.body}
            </p>
            <div className="relative mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
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
