"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import { type MainContent } from "@/lib/mainContent";
import { useMainContent, useUi, useLocale } from "@/components/providers/LocaleProvider";

/** Профайл Тетяни у PDF — 4 мови. Файли лежать у /public/profiles. */
const PROFILE_PDFS = [
  { lang: "uk", name: "Українська", file: "/profiles/tetiana-pan-uk.pdf", dl: "Tetiana Pan — Profile (UA).pdf" },
  { lang: "ru", name: "Русский", file: "/profiles/tetiana-pan-ru.pdf", dl: "Tetiana Pan — Profile (RU).pdf" },
  { lang: "en", name: "English", file: "/profiles/tetiana-pan-en.pdf", dl: "Tetiana Pan — Profile (EN).pdf" },
  { lang: "uz", name: "Oʻzbekcha", file: "/profiles/tetiana-pan-uz.pdf", dl: "Tetiana Pan — Profile (UZ).pdf" },
];
const PROFILE_HEADING: Record<string, string> = {
  uk: "Профайл Тетяни · PDF",
  ru: "Профайл Татьяны · PDF",
  en: "Tetiana’s profile · PDF",
  es: "Perfil de Tetiana · PDF",
  uz: "Tetiana profili · PDF",
};

/**
 * «Архітектор методу» — фігура у м'якому світлі + біо + цитата засновниці +
 * таймлайн шляху + три факти. Спільний блок для головної (M) і сторінки
 * консультації, тож контент про Тетяну скрізь однаковий.
 */
export function ArchitectSection({
  architect,
  id,
}: {
  architect?: MainContent["architect"];
  id?: string;
}) {
  const m = useMainContent();
  const a = architect ?? m.architect;
  const ui = useUi();
  const locale = useLocale();
  const JOURNEY = ui.architect.journey;
  const FACTS = ui.architect.facts;
  return (
    <section id={id} className="relative grain border-t border-line/50 section-pad">
      <div className="container-shell grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative">
            {/* м'яке світло за фігурою — без жорстких країв */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(55% 52% at 50% 46%, rgba(226,166,56,.13), transparent 70%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.image}
              alt={ui.architect.portraitAlt}
              className="relative z-[1] mx-auto block w-[72%] max-w-[320px]"
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-x-10 -bottom-2 h-10"
              style={{
                background:
                  "radial-gradient(50% 100% at 50% 100%, rgba(226,166,56,.18), transparent 70%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-x-16 bottom-0 h-8"
              style={{
                background:
                  "radial-gradient(50% 100% at 50% 100%, rgba(0,0,0,.55), transparent 70%)",
              }}
            />
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal className="flex flex-col gap-4">
            <span className="eyebrow">{a.eyebrow}</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              {a.nameTop}{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                {a.nameEm}
              </em>
            </h2>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
              {a.para1}
            </p>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
              {a.para2}
            </p>
          </Reveal>

          {/* Цитата засновниці */}
          <Reveal delay={0.08} className="mt-10">
            <figure className="relative max-w-2xl pl-4 sm:pl-7">
              <span
                className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <blockquote
                className="text-pretty font-display text-[clamp(1.45rem,2.4vw,1.95rem)] font-medium italic leading-[1.3]"
                style={gradText(GRAD_ACC)}
              >
                {a.quote}
              </blockquote>
              <figcaption className="mt-4 font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">
                {a.quoteAuthor}
              </figcaption>
            </figure>
          </Reveal>

          {/* Таймлайн «Шлях» */}
          <RevealGroup className="mt-12">
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-16 rounded-full" style={{ background: GRAD_GOLD }} />
              <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
                {ui.architect.journeyLabel}
              </span>
            </div>
            <div className="mt-7 flex flex-col sm:flex-row">
              {JOURNEY.map((s) => (
                <RevealItem key={s.t} className="flex-1">
                  <div className="relative border-l border-line/60 pb-6 pl-5 sm:border-l-0 sm:border-t sm:pb-0 sm:pl-0 sm:pr-5 sm:pt-5">
                    <span
                      className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full sm:-top-[4.5px] sm:left-0"
                      style={{ background: s.now ? GRAD_GOLD : "rgba(82,68,52,.9)" }}
                    />
                    <div
                      className={`font-display text-[1.05rem] leading-tight ${s.now ? "" : "text-ink"}`}
                      style={s.now ? gradText(GRAD_ACC) : undefined}
                    >
                      {s.t}
                    </div>
                    <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
                      {s.d}
                    </div>
                  </div>
                </RevealItem>
              ))}
            </div>
          </RevealGroup>

          {/* Три живих факти */}
          <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-3">
            {FACTS.map((f) => (
              <RevealItem key={f.l}>
                <div
                  className="relative h-full rounded-[14px] border border-line/70 p-5"
                  style={{ background: CARD_BG }}
                >
                  <span
                    className="absolute left-5 top-0 h-[3px] w-10 -translate-y-1/2 rounded-full"
                    style={{ background: GRAD_GOLD }}
                  />
                  <div className="font-display text-[1.7rem] leading-none" style={gradText(GRAD_ACC)}>
                    {f.v}
                  </div>
                  <p className="mt-2 text-sm leading-snug text-muted">{f.l}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Профайл у PDF — 4 мови (можна дати пряме посилання) */}
          <Reveal delay={0.12} className="mt-12">
            <div className="flex items-center gap-4">
              <span className="h-[2px] w-16 rounded-full" style={{ background: GRAD_GOLD }} />
              <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.22em] text-faint">
                {PROFILE_HEADING[locale] ?? PROFILE_HEADING.en}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {PROFILE_PDFS.map((p) => (
                <a
                  key={p.lang}
                  href={p.file}
                  download={p.dl}
                  className="group inline-flex items-center gap-2 rounded-full border border-line/70 px-4 py-2 text-sm text-ink transition-colors duration-300 hover:border-gold/50 hover:text-gold"
                >
                  {p.name}
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-faint transition-colors group-hover:text-gold"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16" />
                  </svg>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
