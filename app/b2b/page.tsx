import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { B2BExperience, B2BSolutions, B2BApproach } from "@/components/pages/b2b";
import { ContactForm } from "@/components/sections/ContactForm";
import { b2b } from "@/lib/content";

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
            B2B продажі та <span className="text-gradient-gold">переговори</span>
          </>
        }
        lead={b2b.hero.lead}
        image="/brand/tania-portrait.jpg"
        primary={{ label: "Хочу деталі", href: "#contact" }}
        secondary={{ label: "Наші рішення", href: "#solutions" }}
      />
      <B2BExperience />
      <section className="pb-4">
        <div className="container-shell">
          <div className="relative overflow-hidden rounded-[24px] border border-gold/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/Tania3.jpg"
              alt="Pan&Partners — B2B"
              className="aspect-[21/9] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas/40 to-transparent" />
          </div>
        </div>
      </section>
      <B2BSolutions />
      <B2BApproach />
      <ContactForm />
    </>
  );
}
