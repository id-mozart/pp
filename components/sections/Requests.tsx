"use client";

import { requests } from "@/lib/content";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Asterisk } from "@/components/ui/icons";

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
              {requests.items.map((item, i) => (
                <RevealItem key={item}>
                  <li className="group flex items-center gap-5 border-t border-line/50 py-5 transition-colors last:border-b hover:text-gold">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/10 text-gold transition-transform duration-500 ease-lux group-hover:rotate-90">
                      <Asterisk className="h-4 w-4" />
                    </span>
                    <span className="text-xl text-ink transition-all duration-500 ease-lux group-hover:translate-x-1 group-hover:text-gold sm:text-2xl">
                      {item}
                    </span>
                    <span className="ml-auto font-mono text-xs text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </li>
                </RevealItem>
              ))}
            </ul>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
