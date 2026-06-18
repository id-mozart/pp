"use client";

import { PageHero } from "@/components/sections/PageHero";
import { B2BSolutions, B2BApproach } from "@/components/pages/b2b";
import { ClientsWall } from "@/components/sections/ClientsWall";
import { ContactForm } from "@/components/sections/ContactForm";
import { useContent, useUi } from "@/components/providers/LocaleProvider";

/** Client body so the hero/form text re-render instantly on a locale switch. */
export function B2BPageBody() {
  const { b2b } = useContent();
  const ui = useUi();
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
