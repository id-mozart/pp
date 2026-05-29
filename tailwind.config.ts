import type { Config } from "tailwindcss";

/**
 * Colors are driven by CSS custom properties defined per-concept in globals.css.
 * Each token is stored as space-separated RGB channels (e.g. `--gold: 201 150 46`)
 * so Tailwind opacity modifiers (text-gold/60) keep working across all concepts.
 */
const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: rgb("--c-canvas"),
        surface: rgb("--c-surface"),
        raised: rgb("--c-raised"),
        line: rgb("--c-line"),
        ink: rgb("--c-ink"),
        muted: rgb("--c-muted"),
        faint: rgb("--c-faint"),
        gold: rgb("--c-gold"),
        "gold-soft": rgb("--c-gold-soft"),
        ember: rgb("--c-ember"),
        oncontrast: rgb("--c-oncontrast"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.22em",
      },
      maxWidth: {
        shell: "1320px",
        prose: "68ch",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "marquee-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee-x var(--marquee-dur, 42s) linear infinite",
        shimmer: "shimmer 6s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.16,1,0.3,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
