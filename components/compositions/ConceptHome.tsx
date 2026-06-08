"use client";

import { HeroConcept } from "@/components/sections/HeroConcept";
import { About } from "@/components/sections/About";
import { Requests } from "@/components/sections/Requests";
import { System } from "@/components/sections/System";
import { Formats } from "@/components/sections/Formats";
import { ClientsWall } from "@/components/sections/ClientsWall";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/sections/ContactForm";

/**
 * "Concept" — a copy of the first version (Ember) we now iterate in:
 *  · a crossfading hero slideshow (source photos)
 *  · clients shown as a large logo grid (ClientsWall) instead of a marquee
 *  · light / dark switcher (see ModeToggle + globals.css)
 */
export function ConceptHome() {
  return (
    <>
      <HeroConcept />
      <About />
      <Requests />
      <System />
      <Formats />
      <ClientsWall />
      <Testimonials />
      <ContactForm />
    </>
  );
}
