import * as C from "@/lib/content";
import { MAIN_CONTENT_DEFAULTS } from "@/lib/mainContent";
import { uiUk } from "../ui";

/** The full set of translatable content.ts exports, bundled per locale. */
export const ukContent = {
  brand: C.brand,
  contacts: C.contacts,
  nav: C.nav,
  hero: C.hero,
  about: C.about,
  requests: C.requests,
  system: C.system,
  formats: C.formats,
  clients: C.clients,
  cases: C.cases,
  credibility: C.credibility,
  testimonials: C.testimonials,
  contact: C.contact,
  footer: C.footer,
  cookie: C.cookie,
  b2b: C.b2b,
  consultation: C.consultation,
  courses: C.courses,
};

export const uk = {
  content: ukContent,
  main: MAIN_CONTENT_DEFAULTS,
  ui: uiUk,
};
