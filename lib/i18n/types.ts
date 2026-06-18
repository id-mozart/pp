import type { MainContent } from "@/lib/mainContent";
import type { uk } from "./dictionaries/uk";

/** Structural shape of the content.ts bundle (Ukrainian is the canonical source). */
export type SiteContent = typeof uk.content;
export type UiStrings = typeof uk.ui;

export interface Dictionary {
  content: SiteContent;
  main: MainContent;
  ui: UiStrings;
}
