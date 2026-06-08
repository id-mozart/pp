"use client";

import { HeroConcept } from "@/components/sections/HeroConcept";
import { About } from "@/components/sections/About";
import { Requests } from "@/components/sections/Requests";
import { Phases } from "@/components/sections/Phases";
import { Formats } from "@/components/sections/Formats";
import { ClientsWall } from "@/components/sections/ClientsWall";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/sections/ContactForm";
import { system } from "@/lib/content";

/**
 * "Concept" — a copy of the first version (Ember) we now iterate in:
 *  · a crossfading hero slideshow (source photos)
 *  · the "система продажів" message as a Method-style 4-phase timeline
 *  · clients shown as a large logo grid (ClientsWall) instead of a marquee
 *  · light / dark switcher (see ModeToggle + globals.css)
 */
export function ConceptHome() {
  return (
    <>
      <HeroConcept />
      <About />
      <Requests />
      <Phases
        id="system"
        eyebrow={system.eyebrow}
        title={
          <>
            Продажі — це <span className="text-gradient-gold">система</span>, а не
            везіння
          </>
        }
        lead={system.intro}
        phases={system.phases}
      />
      <Formats />
      <ClientsWall />
      <Testimonials />
      <ContactForm />
    </>
  );
}
