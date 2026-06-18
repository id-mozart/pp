import type { Metadata } from "next";
import { LOCALES, LOCALE_OG, DEFAULT_LOCALE, type Locale } from "./config";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://pan-partners-production.up.railway.app";

/** hreflang map for a locale-less path ("/", "/b2b", …). */
export function altLanguages(path: string): Record<string, string> {
  const clean = path === "/" ? "" : path;
  const langs: Record<string, string> = {};
  for (const l of LOCALES) langs[l] = `${SITE}/${l}${clean}`;
  langs["x-default"] = `${SITE}/${DEFAULT_LOCALE}${clean}`;
  return langs;
}

/** canonical + hreflang alternates for a given locale and locale-less path. */
export function localizedAlternates(
  locale: Locale,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const clean = path === "/" ? "" : path;
  return {
    canonical: `${SITE}/${locale}${clean}`,
    languages: altLanguages(path),
  };
}

export function ogLocale(locale: Locale): string {
  return LOCALE_OG[locale];
}
