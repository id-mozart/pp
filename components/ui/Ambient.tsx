"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Ambient({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute -right-[10%] -top-[25%] h-[55vw] w-[55vw] rounded-full blur-[110px]"
        style={{ background: "var(--glow-a)" }}
        animate={reduce ? {} : { scale: [1, 1.12, 1], x: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[30%] -left-[10%] h-[48vw] w-[48vw] rounded-full blur-[120px]"
        style={{ background: "var(--glow-b)" }}
        animate={reduce ? {} : { scale: [1, 1.18, 1], y: [0, -28, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}
