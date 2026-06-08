"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Full-bleed crossfading background slideshow (same cadence as the source
 * site: 5s hold, 2s fade). Pass theme-specific gradient overlays via `overlay`.
 */
export function HeroSlideshowBg({
  images,
  overlay,
  interval = 5000,
  fadeMs = 2000,
}: {
  images: string[];
  overlay?: ReactNode;
  interval?: number;
  fadeMs?: number;
}) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce || images.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [reduce, images.length, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
        />
      ))}
      {overlay}
    </div>
  );
}
