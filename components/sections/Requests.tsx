"use client";

import { requests } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import {
  ArrowRight,
  TrendDown,
  Activity,
  CircleX,
  Percent,
  Users,
} from "@/components/ui/icons";

/* One meaningful icon per pain (order matches requests.items) */
const ICONS = [TrendDown, Activity, CircleX, Percent, Users];

export function Requests() {
  return (
    <section className="relative grain overflow-hidden border-y border-line/50 bg-surface section-pad">
      <div className="container-shell relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-5 lg:col-span-4">
            <span className="eyebrow">{requests.eyebrow}</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              {requests.title}
            </h2>
            <p className="text-lg leading-relaxed text-muted">{requests.intro}</p>
          </Reveal>

          <RevealGroup className="lg:col-span-8">
            <ul>
              {requests.items.map((item, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <RevealItem key={item}>
                    <li className="border-t border-line/50 last:border-b">
                      <a
                        href="#contact"
                        className="group flex items-center gap-5 py-5 transition-colors"
                        aria-label={`${item} — перейти до форми`}
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/10 text-gold transition-transform duration-500 ease-lux group-hover:scale-110">
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-xl text-ink transition-all duration-500 ease-lux group-hover:translate-x-1 group-hover:text-gold sm:text-2xl">
                          {item}
                        </span>
                        <span className="ml-auto flex items-center gap-3">
                          <ArrowRight className="h-4 w-4 -translate-x-1 text-gold opacity-0 transition-all duration-500 ease-lux group-hover:translate-x-0 group-hover:opacity-100" />
                          <span className="font-mono text-xs text-faint">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </span>
                      </a>
                    </li>
                  </RevealItem>
                );
              })}
            </ul>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
