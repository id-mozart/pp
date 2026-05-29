# Pan&Partners — premium B2B sales & negotiation consulting

A world-class redesign of [tetianapansales.com](https://tetianapansales.com/?lang=uk) for
**Тетяна Пан / Pan&Partners** — B2B sales & negotiation consulting. Ukrainian content,
luxury orange-gold art direction.

## ✦ Three switchable design concepts

A discreet switcher (bottom-right, or keys **1 / 2 / 3**) flips the entire art direction —
palette, typography, layout personality and motion — while keeping the same content. Choice
is persisted to `localStorage` with no flash of the wrong theme.

| # | Concept | Mood | Palette | Type |
|---|---------|------|---------|------|
| I | **Ember Atelier** *(default)* | Dark, cinematic, gold-as-metal | `#0E0B09` · gold `#C9962E` · ivory | Spectral + Inter |
| II | **Champagne Study** | Light, editorial "white-paper" | `#F4EDE1` · antique gold `#9A7322` · espresso | Playfair Display + Source Sans |
| III | **Bronze Editorial** | Slate, modern Swiss, data-forward | `#1E2229` · champagne `#C9A86A` · copper | Manrope + JetBrains Mono |

## Stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS** · **Framer Motion**
- Concept theming via CSS custom properties (RGB channel tokens) swapped by a `data-concept`
  attribute — see [`app/globals.css`](app/globals.css) and [`lib/concepts.ts`](lib/concepts.ts).
- All copy lives in [`lib/content.ts`](lib/content.ts) (single source of truth, lifted from the
  original site and cleaned of its stray English strings / localization bugs).
- Lead + booking submissions post to [`app/api/lead/route.ts`](app/api/lead/route.ts)
  (validates, honeypot-guarded; wire an email/CRM provider there to deliver leads).

## Pages

`/` home · `/b2b` · `/consultation` (live booking calendar) · `/courses` · `/privacy`

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Deployment (Railway)

Auto-detected by Nixpacks (`npm run build` → `npm run start`). The start script binds
`$PORT`. Optional env var `NEXT_PUBLIC_SITE_URL` sets canonical/OG URLs.

---

Accessibility: WCAG-AA-targeted contrast in every concept, `prefers-reduced-motion`
respected, keyboard-navigable, skip link, semantic landmarks.
