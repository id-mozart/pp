import { headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_HEADER, isLocale, type Locale } from "./config";
import { getDictionary } from "./dictionaries";

/** Active locale for the current request (set by middleware via x-locale header). */
export function getLocale(): Locale {
  const value = headers().get(LOCALE_HEADER);
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Convenience: dictionary for the active request locale. */
export function getRequestDictionary() {
  return getDictionary(getLocale());
}
