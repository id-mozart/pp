import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { B2BExperience, B2BSolutions, B2BApproach } from "@/components/pages/b2b";
import { ContactForm } from "@/components/sections/ContactForm";
import { b2b } from "@/lib/content";
import { GRAD_ACC, GRAD_GOLD, CTAG_BG, gradText } from "@/lib/ember";

export const metadata: Metadata = {
  title: "B2B продажі та переговори",
  description:
    "Структура продажів, переговори та вихід на великих клієнтів — адаптовано під цілі вашого бізнесу. Досвід роботи з Vodafone, Kyivstar, ДТЕК.",
  alternates: { canonical: "/b2b" },
};

export default function B2BPage() {
  return (
    <>
      <PageHero
        eyebrow={b2b.hero.eyebrow}
        title={
          <>
            B2B продажі та <em className="italic text-gradient-gold">переговори</em>
          </>
        }
        lead={b2b.hero.lead}
        image="/brand/tania-portrait.jpg"
        primary={{ label: "Обговорити навчання команди", href: "#contact" }}
        secondary={{ label: "Наші рішення", href: "#solutions" }}
      />
      <B2BExperience />
      <section className="pb-4">
        <div className="container-shell">
          <div
            className="relative overflow-hidden rounded-[14px] border border-line/60"
            style={{ boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/Tania3.jpg"
              alt="Pan&Partners — B2B"
              className="aspect-[21/9] w-full object-cover"
            />
            <div
              className="absolute inset-x-0 top-0 h-24"
              style={{
                background:
                  "linear-gradient(180deg,rgba(13,9,5,.8) 0%,rgba(13,9,5,.25) 55%,transparent 100%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-[55%]"
              style={{
                background:
                  "linear-gradient(0deg,rgba(11,7,4,.85) 0%,rgba(12,8,5,.25) 60%,transparent 100%)",
              }}
            />
            <div className="grain absolute inset-0 opacity-20" />
            <div className="absolute left-6 right-6 top-4 flex items-center justify-between font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em]">
              <span style={gradText(GRAD_ACC)}>Pan&amp;Partners · B2B</span>
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
            </div>
            <span
              className="absolute bottom-4 left-6 inline-flex items-center rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
              style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
            >
              Vodafone · Kyivstar · ДТЕК
            </span>
          </div>
        </div>
      </section>
      <B2BSolutions />
      <B2BApproach />
      <ContactForm />
    </>
  );
}
