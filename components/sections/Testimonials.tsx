"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useContent, useUi } from "@/components/providers/LocaleProvider";
import { Reveal } from "@/components/ui/Reveal";
import { Play, Close } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import type { Testimonial } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Логотипи компаній для текстових відгуків — за позицією в items[]
    (порядок однаковий у всіх мовах). Автори без компанії лишаються з ініціалами. */
const ITEM_LOGOS: (string | undefined)[] = [
  "/brand/clients/vodafone.png", // Литвиненко · Vodafone
  "/brand/clients/ids-ukraine.png", // Дзюба · ІДС Аква Сервіс
  "/brand/clients/synevo.png", // Чуніхіна · Synevo
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

export function Testimonials({
  stats,
}: {
  /** Override the 3 credibility marks with custom stat tiles (proof-band style). */
  stats?: { v: string; l: string }[];
} = {}) {
  const { testimonials, credibility, about } = useContent();
  const ui = useUi();
  const [active, setActive] = useState<Testimonial | null>(null);
  const close = useCallback(() => setActive(null), []);
  return (
    <>
      <section
        id="cases"
        className="relative grain overflow-hidden border-y border-line/50 bg-surface section-pad"
      >
        <div className="container-shell relative">
          {/* Header */}
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
            <span className="eyebrow">{testimonials.eyebrow}</span>
            <h2 className="text-[clamp(2rem,3.4vw,2.8rem)] leading-[1.05] text-ink">
              {ui.testimonials.titlePre}
              <em className="italic" style={gradText(GRAD_ACC)}>
                {ui.testimonials.titleEm}
              </em>
            </h2>
            <p className="max-w-2xl font-display text-lg italic leading-relaxed text-muted">
              {testimonials.intro}
            </p>
          </Reveal>

          {/* Credibility marks */}
          {stats ? (
            <Reveal delay={0.05}>
              <div
                className="relative mt-12 grid grid-cols-2 divide-x divide-line/40 rounded-[14px] border border-line/60 lg:grid-cols-4"
                style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
              >
                <span
                  aria-hidden
                  className="absolute left-8 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                {stats.map((s) => (
                  <div key={s.l} className="h-full p-6 text-center">
                    <div className="stat-number text-3xl sm:text-4xl">{s.v}</div>
                    <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] leading-snug text-muted">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.05}>
              <div
                className="relative mx-auto mt-12 grid max-w-4xl grid-cols-1 divide-y divide-line/40 rounded-[14px] border border-line/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
                style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
              >
                <span
                  aria-hidden
                  className="absolute left-8 top-0 z-10 h-[3px] w-20 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                {credibility.marks.map((m) => (
                  <div key={m.label} className="p-6 text-center">
                    <div className="stat-number text-4xl sm:text-5xl">{m.value}</div>
                    <div className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] leading-snug text-muted">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {/* Manifesto pull-quote */}
          <Reveal delay={0.1}>
            <figure className="mx-auto mt-16 max-w-3xl text-center">
              <span
                aria-hidden
                className="mx-auto block h-[2px] w-16 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <blockquote className="mt-6 text-pretty font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-snug text-ink">
                {ui.testimonials.pullPre}
                <em className="italic" style={gradText(GRAD_ACC)}>
                  {ui.testimonials.pullEm}
                </em>
              </blockquote>
              <figcaption className="mt-5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                — {about.name}{ui.testimonials.captionSuffix}
              </figcaption>
            </figure>
          </Reveal>

          {/* Testimonial wall (masonry) */}
          <div className="mt-14 [column-gap:1.5rem] sm:columns-2 lg:columns-3">
            {testimonials.videos.map((t) => (
              <VideoCard key={t.name} t={t} onOpen={setActive} />
            ))}
            {testimonials.items.map((t, i) => (
              <TextCard key={t.name} t={t} logo={ITEM_LOGOS[i]} />
            ))}
          </div>
        </div>
      </section>

      <VideoLightbox active={active} onClose={close} />
    </>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/12 font-display text-sm text-gold ring-1 ring-gold/20">
      {initials(name)}
    </span>
  );
}

/** Лого-плашка замість аватара — для авторів із впізнаваною компанією. */
function BrandPlate({ src }: { src: string }) {
  return (
    <span className="grid h-11 w-fit shrink-0 place-items-center rounded-[12px] bg-gold/10 px-4 ring-1 ring-gold/20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="max-h-[18px] w-auto max-w-[64px] object-contain opacity-90" />
    </span>
  );
}

function Meta({ t }: { t: Testimonial }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-medium text-ink">{t.name}</p>
      <p className="text-xs leading-snug text-muted">{t.role}</p>
      {t.date && <p className="mt-0.5 text-[0.7rem] text-faint">{t.date}</p>}
    </div>
  );
}

function TextCard({ t, logo }: { t: Testimonial; logo?: string }) {
  return (
    <figure
      className="mb-6 break-inside-avoid rounded-[14px] border border-line/60 p-6"
      style={{
        background: CARD_BG,
        borderLeft: "3px solid #E2A638",
        boxShadow: "0 18px 44px rgba(0,0,0,.4)",
      }}
    >
      <span
        aria-hidden
        className="block font-display text-5xl leading-[0.55] text-gold/40"
      >
        “
      </span>
      <blockquote className="mt-4 text-pretty font-display text-xl italic leading-snug text-ink">
        {t.quote}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-line/50 pt-4">
        {logo ? <BrandPlate src={logo} /> : <Avatar name={t.name} />}
        <Meta t={t} />
      </figcaption>
    </figure>
  );
}

function VideoCard({
  t,
  onOpen,
}: {
  t: Testimonial;
  onOpen: (t: Testimonial) => void;
}) {
  const ui = useUi();
  return (
    <button
      type="button"
      onClick={() => onOpen(t)}
      aria-label={`${t.name} — ${ui.testimonials.watchReview}`}
      className="group mb-6 block w-full break-inside-avoid overflow-hidden rounded-[14px] border border-line/60 text-left transition-all duration-500 ease-lux hover:-translate-y-1 hover:border-gold/40"
      style={{ background: CARD_BG, boxShadow: "0 18px 44px rgba(0,0,0,.4)" }}
    >
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${t.videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
        />
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg,rgba(11,7,4,.78) 0%,rgba(12,8,5,.18) 55%,rgba(13,9,5,.35) 100%)",
          }}
        />
        <span
          className="relative grid h-16 w-16 place-items-center rounded-full text-oncontrast shadow-[0_14px_30px_-12px_rgb(var(--c-gold)/0.7)] transition-transform duration-500 ease-lux group-hover:scale-110"
          style={{ background: GRAD_GOLD }}
        >
          <Play className="h-6 w-6 translate-x-0.5" />
        </span>
        <span
          className="absolute bottom-3 right-4 font-display text-sm italic"
          style={gradText(GRAD_ACC)}
        >
          {ui.testimonials.watchReview}
        </span>
      </div>
      <div className="flex items-center gap-3 p-5">
        <Avatar name={t.name} />
        <Meta t={t} />
      </div>
    </button>
  );
}

/** Lightbox для відеовідгуків — вилітає поверх сторінки з вбудованим плеєром.
    Esc / клік по тлу / хрестик закривають; скрол body блокується; відео
    ставиться на паузу одразу при закритті; шанує prefers-reduced-motion. */
function VideoLightbox({
  active,
  onClose,
}: {
  active: Testimonial | null;
  onClose: () => void;
}) {
  const ui = useUi();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  // Пауза плеєра в мить закриття — щоб звук не тягнувся крізь анімацію виходу.
  const handleClose = useCallback(() => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*",
      );
    } catch {
      /* ignore */
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!active) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [active, handleClose]);

  // Запобіжник: повернути скрол, якщо компонент демонтується з відкритим вікном.
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  if (!mounted) return null;

  const panel = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.15, ease: EASE } },
      }
    : {
        initial: { opacity: 0, scale: 0.94, y: 18 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: {
          opacity: 0,
          scale: 0.97,
          y: 8,
          transition: { duration: 0.25, ease: EASE },
        },
      };

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
        prevFocus.current?.focus?.();
      }}
    >
      {active && (
        <motion.div
          key="video-backdrop"
          className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6"
          style={{
            background: "rgba(7,5,3,.86)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            willChange: "opacity",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: EASE } }}
          transition={{ duration: 0.28, ease: EASE }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={active.name}
            className="relative w-full max-w-4xl"
            initial={panel.initial}
            animate={panel.animate}
            exit={panel.exit}
            transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Золота волосина поверх верхнього краю — поза overflow-hidden картки. */}
            <span
              aria-hidden
              className="absolute left-6 top-0 z-30 h-[3px] w-16 -translate-y-1/2 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <div
              className="relative flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-[16px] border border-line/70 shadow-[var(--shadow-lux)] sm:max-h-[calc(100dvh-3rem)]"
              style={{
                background:
                  "linear-gradient(160deg,rgba(26,17,9,.97),rgba(15,10,6,.98))",
              }}
            >
              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                aria-label={ui.testimonials.closeVideo}
                className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full border border-line/60 bg-black/55 text-ink backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-gold"
              >
                <Close className="h-5 w-5" />
              </button>
              <div className="relative aspect-video max-h-[calc(100dvh-9rem)] w-full shrink-0 overflow-hidden bg-black">
                <iframe
                  ref={iframeRef}
                  src={`https://www.youtube-nocookie.com/embed/${active.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
                  title={active.name}
                  loading="lazy"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              <div className="grain relative flex shrink-0 items-center gap-3 p-5 sm:p-6">
                <Avatar name={active.name} />
                <Meta t={active} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
