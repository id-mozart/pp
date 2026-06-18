import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { B2BSolutions, B2BApproach } from "@/components/pages/b2b";
import { ClientsWall } from "@/components/sections/ClientsWall";
import { ContactForm } from "@/components/sections/ContactForm";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const { ui } = getDictionary(locale);
  return {
    title: ui.meta.b2b.title,
    description: ui.meta.b2b.description,
    alternates: localizedAlternates(locale, "/b2b"),
  };
}

export default function B2BPage() {
  const locale = getLocale();
  const { content, ui } = getDictionary(locale);
  const { b2b } = content;
  return (
    <>
      <PageHero
        eyebrow={b2b.hero.eyebrow}
        title={
          <>
            {ui.b2bPage.heroTitlePre}
            <em className="italic text-gradient-gold">{ui.b2bPage.heroTitleEm}</em>
          </>
        }
        lead={b2b.hero.lead}
        image="/brand/tania-portrait.jpg"
        primary={{ label: ui.b2bPage.heroPrimary, href: "#contact" }}
        secondary={{ label: ui.b2bPage.heroSecondary, href: "#solutions" }}
      />
      <B2BSolutions />
      <B2BApproach />
      <ClientsWall logoWall lean />
      <ContactForm
        title={
          <>
            {ui.b2bPage.contactTitlePre}
            <em className="italic text-gradient-gold">{ui.b2bPage.contactTitleEm}</em>
          </>
        }
      />
    </>
  );
}
