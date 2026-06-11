"use client";

import { requests } from "@/lib/content";
import { smoothScrollToEl } from "@/lib/smoothScroll";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GRAD_ACC, GRAD_GOLD, CTAG_BG, gradText } from "@/lib/ember";
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

function goToContact(e: React.MouseEvent) {
  const el = document.querySelector("#contact");
  if (!el) return;
  e.preventDefault();
  smoothScrollToEl(el);
  history.replaceState(null, "", "#contact");
}

export function Requests() {
  return (
    <section className="relative grain overflow-hidden border-y border-line/50 bg-surface section-pad">
      <div className="container-shell relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col gap-5 lg:col-span-4">
            <span className="eyebrow">{requests.eyebrow}</span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] text-ink">
              Пʼять{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                запитів
              </em>
              , з яких усе починається
            </h2>
            <span
              aria-hidden
              className="h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            <p className="font-display text-lg italic leading-relaxed text-muted">
              {requests.intro}
            </p>
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
                        onClick={goToContact}
                        className="group flex items-center gap-5 py-5 transition-colors"
                        aria-label={`${item} — перейти до форми`}
                      >
                        <span
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-line/70 text-gold transition-transform duration-500 ease-lux group-hover:scale-105"
                          style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-xl text-ink transition-all duration-500 ease-lux group-hover:translate-x-1 group-hover:text-gold sm:text-2xl">
                          {item}
                        </span>
                        <span className="ml-auto flex items-center gap-3">
                          <ArrowRight className="h-4 w-4 -translate-x-1 text-gold opacity-0 transition-all duration-500 ease-lux group-hover:translate-x-0 group-hover:opacity-100" />
                          <span className="font-mono text-xs text-faint transition-colors duration-500 group-hover:text-gold">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </span>
                      </a>
                    </li>
                  </RevealItem>
                );
              })}
            </ul>
            <a
              href="#contact"
              onClick={goToContact}
              className="mt-8 inline-block font-display text-lg font-medium italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
              style={gradText(GRAD_ACC)}
            >
              обговорімо вашу ситуацію →
            </a>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
