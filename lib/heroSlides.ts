/**
 * Hero slideshow config shared by the Concept and Система heroes.
 * Each source banner (1920×800) has Tania in a different spot, so every
 * slide gets its own object-position so she never slides off-screen:
 *  · Tania3    — studio portrait at the far left  → keep the left edge
 *  · Tania1-2  — on stage at ~35% of the width    → bias left of centre
 *  · Tania1-3  — at the flipchart, ~42% of width  → near centre
 */
export interface HeroSlide {
  src: string;
  /** CSS object-position for the full-bleed crop */
  position: string;
  /** Extra crop tweaks (e.g. desktop-only) via Tailwind classes */
  className?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { src: "/brand/Tania3.webp", position: "10% center" },
  { src: "/brand/Tania1-2.webp", position: "32% center" },
  {
    src: "/brand/Tania1-3.webp",
    position: "45% center",
    // crop the busy banner on the LEFT of the frame (desktop shows almost
    // the full 1920×800 banner, so we zoom slightly and pin to the right)
    className: "lg:scale-[1.1] lg:![object-position:92%_50%]",
  },
];

/** Calmer cadence: 9s hold (was 5s), 2.4s crossfade. */
export const HERO_SLIDE_INTERVAL = 9000;
export const HERO_SLIDE_FADE = 2400;
