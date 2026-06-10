"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  HERO_SLIDE_FADE,
  HERO_SLIDE_INTERVAL,
  type HeroSlide,
} from "@/lib/heroSlides";

/**
 * Full-bleed crossfading background slideshow with a per-image crop
 * (object-position), so the subject never drifts off-screen. Pass
 * theme-specific gradient overlays via `overlay`.
 */
export function HeroSlideshowBg({
  images,
  overlay,
  interval = HERO_SLIDE_INTERVAL,
  fadeMs = HERO_SLIDE_FADE,
}: {
  images: HeroSlide[];
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
      {images.map((img, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={img.src}
          src={img.src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: img.position,
            opacity: i === idx ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
          }}
        />
      ))}
      {overlay}
    </div>
  );
}
