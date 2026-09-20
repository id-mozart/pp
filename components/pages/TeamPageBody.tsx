"use client";

import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { CARD_BG, GRAD_ACC, GRAD_GOLD, gradText } from "@/lib/ember";
import { TEAM, TEAM_LEAD, type TeamMember } from "@/lib/team";

/** Сторінка «Команда»: засновниця великим блоком, далі тренери картками. Поки лише українською. */
export function TeamPageBody() {
  return (
    <>
      <PageHero
        eyebrow="Pan&Partners · Команда"
        title={
          <>
            Люди, які проводять{" "}
            <em className="italic text-gradient-gold">ваші тренінги</em>
          </>
        }
        lead="Практики з досвідом у продажах, управлінні та розвитку команд. Кожен проєкт веде тренер, який працював у вашій сфері — і знає її зсередини."
        image="/brand/profile-portrait.jpg"
        primary={{ label: "Обговорити навчання", href: "#contact" }}
        secondary={{ label: "Познайомитись із командою", href: "#people" }}
      />

      {/* Засновниця */}
      <section className="section-pad">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute left-8 top-0 z-10 h-[3px] w-16 -translate-y-1/2 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={TEAM_LEAD.photo}
                  alt={TEAM_LEAD.name}
                  className="aspect-[4/5] w-full rounded-[14px] border border-line/70 object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-7">
              <span className="eyebrow">Засновниця</span>
              <h2 className="mt-5 text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[1.08] text-ink">
                {TEAM_LEAD.name}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted">{TEAM_LEAD.role}</p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/90">{TEAM_LEAD.lead}</p>
              <ul className="mt-8 flex flex-col">
                {TEAM_LEAD.facts.map((fact, i) => (
                  <li key={i} className="flex gap-5 border-t border-line/50 py-5 last:border-b">
                    <span
                      className="font-mono text-sm font-medium tracking-[0.1em]"
                      style={gradText(GRAD_ACC)}
                    >
                      0{i + 1}
                    </span>
                    <p className="text-base leading-relaxed text-ink/90">{fact}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Тренери */}
      <section id="people" className="section-pad pt-0">
        <div className="container-shell">
          <Reveal>
            <span className="eyebrow">Тренери та консультанти</span>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.7rem,3.2vw,2.5rem)] leading-[1.1] text-ink">
              Команда, яка{" "}
              <em className="italic text-gradient-gold">підсилює проєкт</em>
            </h2>
            <span
              aria-hidden
              className="mt-5 block h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
          </Reveal>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2">
            {TEAM.map((m) => (
              <RevealItem key={m.slug}>
                <MemberCard member={m} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <ContactForm
        title={
          <>
            Підберемо тренера{" "}
            <em className="italic text-gradient-gold">під вашу задачу</em>
          </>
        }
      />
    </>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article
      className="flex h-full flex-col gap-6 rounded-[14px] border border-line/70 p-7 sm:p-8"
      style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
    >
      <div className="flex items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.photo}
          alt={member.name}
          className="h-20 w-20 flex-none rounded-full border border-line/70 object-cover"
          loading="lazy"
        />
        <div className="min-w-0">
          <h3 className="text-xl leading-tight text-ink">{member.name}</h3>
          <p className="mt-1.5 text-sm leading-snug text-muted">{member.role}</p>
        </div>
      </div>

      <p className="text-base leading-relaxed text-ink/90">{member.lead}</p>

      <div className="hairline" />

      <ul className="flex flex-col gap-3">
        {member.facts.map((fact, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink/80">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full" style={{ background: GRAD_ACC }} />
            {fact}
          </li>
        ))}
      </ul>
    </article>
  );
}
