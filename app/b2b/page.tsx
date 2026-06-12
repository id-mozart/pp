import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { B2BSolutions, B2BApproach } from "@/components/pages/b2b";
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
            B2B продажі та <em className="italic text-gradient-gold">переговори</em>
          </>
        }
        lead={b2b.hero.lead}
        image="/brand/tania-portrait.jpg"
        primary={{ label: "Обговорити навчання команди", href: "#contact" }}
        secondary={{ label: "Наші рішення", href: "#solutions" }}
      />
      <B2BSolutions />
      <B2BApproach />
      <ContactForm />
    </>
  );
}
