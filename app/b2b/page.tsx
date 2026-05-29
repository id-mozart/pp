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
        primary={{ label: "Хочу деталі", href: "#contact" }}
        secondary={{ label: "Мої рішення", href: "#solutions" }}
      />
      <B2BExperience />
      <B2BSolutions />
      <B2BApproach />
      <ContactForm />
    </>
  );
}
