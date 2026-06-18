/**
 * i18n core config — edge-safe (no Node APIs), imported by middleware.
 * Site supports 4 languages with prefixed URLs: /uk, /ru, /en, /es.
 */

export const LOCALES = ["uk", "ru", "en", "es", "uz"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uk";

/** Native language name shown in the switcher (no flags). */
export const LOCALE_NAMES: Record<Locale, string> = {
  uk: "Українська",
  ru: "Русский",
  en: "English",
  es: "Español",
  uz: "Oʻzbekcha",
};

/** Short 2-letter marker for the compact switcher trigger. */
export const LOCALE_SHORT: Record<Locale, string> = {
  uk: "UA",
  ru: "RU",
  en: "EN",
  es: "ES",
  uz: "UZ",
};

/** <html lang> value. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  uk: "uk",
  ru: "ru",
  en: "en",
  es: "es",
  uz: "uz",
};

/** BCP-47 tag for Intl.* (dates, numbers). */
export const LOCALE_INTL: Record<Locale, string> = {
  uk: "uk-UA",
  ru: "ru-RU",
  en: "en-US",
  es: "es-ES",
  uz: "uz-UZ",
};

/** OpenGraph locale. */
export const LOCALE_OG: Record<Locale, string> = {
  uk: "uk_UA",
  ru: "ru_RU",
  en: "en_US",
  es: "es_ES",
  uz: "uz_UZ",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";
/** Request header middleware sets on the rewritten request so server code can read the active locale. */
export const LOCALE_HEADER = "x-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** First path segment if it is a valid locale, else null. */
export function localeFromPathname(pathname: string): Locale | null {
  const seg = pathname.split("/")[1];
  return isLocale(seg) ? seg : null;
}

/** Remove a leading locale segment: "/ru/b2b" → "/b2b", "/ru" → "/". */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (isLocale(seg)) {
    const rest = pathname.slice(`/${seg}`.length);
    return rest === "" ? "/" : rest;
  }
  return pathname;
}

/**
 * Prefix an internal app path with a locale.
 * Leaves external URLs, mailto/tel, and bare hashes untouched.
 * Preserves any "#hash" or "?query" suffix on internal paths.
 */
export function withLocale(href: string, locale: Locale): string {
  if (!href) return href;
  // External / protocol / mail / tel / bare anchors → unchanged.
  if (/^([a-z]+:)?\/\//i.test(href) || /^(mailto:|tel:|#)/i.test(href)) return href;
  if (!href.startsWith("/")) return href;
  const bare = stripLocale(href);
  if (bare === "/") return `/${locale}`;
  return `/${locale}${bare}`;
}

/** Negotiate a locale from an Accept-Language header. Falls back to default. */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const parts = acceptLanguage
    .split(",")
    .map((p) => {
      const [tag, q] = p.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of parts) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}
