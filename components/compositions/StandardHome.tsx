"use client";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Requests } from "@/components/sections/Requests";
import { Formats } from "@/components/sections/Formats";
import { Clients } from "@/components/sections/Clients";
import { Testimonials } from "@/components/sections/Testimonials";
import { ContactForm } from "@/components/sections/ContactForm";

/** The default composition used by all style-only concepts. */
export function StandardHome() {
  return (
    <>
      <Hero />
      <About />
      <Requests />
      <Formats />
      <Clients />
      <Testimonials />
      <ContactForm />
    </>
  );
}
