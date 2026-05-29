import { clients } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Clients() {
  return (
    <section className="section-pad">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <span className="eyebrow">{clients.eyebrow}</span>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              {clients.title}
            </h2>
            <p className="mt-4 text-lg text-muted">{clients.subtitle}</p>
            <p className="mt-6 max-w-md text-pretty text-xl leading-snug text-ink">
              <span className="text-gradient-gold font-display">90%</span>{" "}
              клієнтів продовжують співпрацю з нами та рекомендують нас своїм
              партнерам.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line/60 bg-line/40">
              {clients.stats.map((s) => (
                <div key={s.label} className="bg-surface p-6 text-center">
                  <div className="stat-number text-4xl sm:text-5xl">{s.value}</div>
                  <div className="mt-2 text-xs leading-snug text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* Named clients — text wordmarks */}
      <div className="mt-14 overflow-hidden mask-fade-r">
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {[...clients.named, ...clients.named].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap pr-14 font-display text-2xl tracking-tight text-faint transition-colors hover:text-gold sm:text-3xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Logos marquee (opposite direction) */}
      <div className="mt-10 overflow-hidden mask-fade-r">
        <div
          className="flex w-max animate-marquee items-center [animation-direction:reverse] hover:[animation-play-state:paused]"
          style={{ ["--marquee-dur" as string]: "60s" }}
        >
          {[...clients.logos, ...clients.logos].map((src, i) => (
            <span
              key={`${src}-${i}`}
              className="mr-5 inline-flex h-16 shrink-0 items-center rounded-xl bg-white/95 px-7 shadow-sm ring-1 ring-black/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Логотипи клієнтів Pan&Partners"
                className="h-8 w-auto object-contain"
                loading="lazy"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="container-shell">
        <Reveal className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-pretty text-sm italic leading-relaxed text-muted">
            {clients.caption}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
