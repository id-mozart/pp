import Link from "next/link";
import { courses } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Check, ArrowUpRight, ArrowRight } from "@/components/ui/icons";

export function CoursesIntro() {
  const { hero } = courses;
  return (
    <section className="pb-4">
      <div className="container-shell">
        {/* numbered solutions */}
        <RevealGroup className="grid gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/40 sm:grid-cols-3">
          {hero.items.map((it) => (
            <RevealItem key={it.n}>
              <div className="h-full bg-surface p-7">
                <span className="font-display text-3xl text-gradient-gold">{it.n}</span>
                <h3 className="mt-3 text-lg text-ink">{it.title}</h3>
                <p className="mt-1 text-sm text-muted">{it.sub}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* features */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {hero.features.map((f) => (
            <Reveal key={f.title} className="surface p-7">
              <h3 className="text-xl text-ink">{f.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-muted">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                      <Check className="h-3 w-3" strokeWidth={2.4} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const EXTRA = [
  {
    title: "Чек-листи для продажів",
    short:
      "Готові чек-листи, щоб швидко перевірити та підсилити вашу систему продажів.",
    price: "За запитом",
  },
  {
    title: "Скрипти повідомлень",
    short:
      "Скрипти перших повідомлень для нових B2B-клієнтів — щоб заходити в діалог упевнено.",
    price: "За запитом",
  },
];

export function CoursesList() {
  const { list } = courses;
  return (
    <section className="section-pad">
      <div className="container-shell">
        <Reveal className="mb-10 flex flex-col gap-4">
          <span className="eyebrow">Каталог</span>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
            {list.title}
          </h2>
          <p className="max-w-xl text-lg text-muted">{list.subtitle}</p>
        </Reveal>

        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.cards.map((c) => (
            <RevealItem key={c.title}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden surface transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-gold/40"
              >
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-lux group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-canvas/80 px-3 py-1 text-sm text-gold backdrop-blur-md">
                    {c.price}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl text-ink">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {c.short}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-gold">
                    {c.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </a>
            </RevealItem>
          ))}

          {EXTRA.map((c) => (
            <RevealItem key={c.title}>
              <Link
                href="#contact"
                className="group flex h-full flex-col justify-between surface p-6 transition-all duration-500 ease-lux hover:-translate-y-1.5 hover:border-gold/40"
              >
                <div>
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">
                    {c.price}
                  </span>
                  <h3 className="mt-5 text-xl text-ink">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.short}</p>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm text-gold">
                  Дізнатися
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-lux group-hover:translate-x-1.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
