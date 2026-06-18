import { DEFAULT_LOCALE, type Locale } from "../config";
import type { Dictionary } from "../types";
import { uk } from "./uk";
import { ru } from "./ru";
import { en } from "./en";
import { es } from "./es";
import { uz } from "./uz";

const DICTIONARIES: Record<Locale, Dictionary> = { uk, ru, en, es, uz };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
