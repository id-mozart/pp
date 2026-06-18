"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_HTML_LANG,
  localeFromPathname,
  withLocale,
  type Locale,
} from "@/lib/i18n/config";
import type { Dictionary, SiteContent, UiStrings } from "@/lib/i18n/types";
import type { MainContent } from "@/lib/mainContent";

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  /** Prefix an internal href with the active locale. */
  href: (path: string) => string;
  /** Switch to another locale, staying on the current page. */
  switchLocale: (next: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Load a locale's dictionary on the client. Each locale is a separate chunk,
 * fetched on demand only when the visitor switches — keeps the initial bundle lean.
 */
async function loadClientDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case "ru":
      return (await import("@/lib/i18n/dictionaries/ru")).ru;
    case "en":
      return (await import("@/lib/i18n/dictionaries/en")).en;
    case "es":
      return (await import("@/lib/i18n/dictionaries/es")).es;
    case "uz":
      return (await import("@/lib/i18n/dictionaries/uz")).uz;
    case "uk":
    default:
      return (await import("@/lib/i18n/dictionaries/uk")).uk;
  }
}

export function LocaleProvider({
  locale: serverLocale,
  dict: serverDict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // Active locale/dict live in client state so a language switch (or back/forward)
  // updates the whole tree instantly — the root layout is preserved across
  // client navigations and would otherwise keep serving the old language.
  const [state, setState] = useState<{ locale: Locale; dict: Dictionary }>({
    locale: serverLocale,
    dict: serverDict,
  });
  const { locale, dict } = state;

  // Keep the active locale in sync with the URL (covers browser back/forward
  // and any link that changes the locale prefix).
  useEffect(() => {
    const urlLocale = localeFromPathname(pathname || "");
    if (!urlLocale || urlLocale === locale) return;
    let active = true;
    loadClientDictionary(urlLocale).then((d) => {
      if (active) setState({ locale: urlLocale, dict: d });
    });
    return () => {
      active = false;
    };
  }, [pathname, locale]);

  // Keep <html lang> in sync on switch (server only set the initial value).
  useEffect(() => {
    try {
      document.documentElement.lang = LOCALE_HTML_LANG[locale];
    } catch {
      /* ignore */
    }
  }, [locale]);

  const href = useCallback((path: string) => withLocale(path, locale), [locale]);

  const switchLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      try {
        document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
      } catch {
        /* ignore */
      }
      // Swap content instantly (all display is client-reactive) and update the URL
      // without a full reload. The rewrite-based locale routing makes Next treat the
      // locales as the same route, so server components don't re-render on switch —
      // hence every locale-dependent piece reads from this context.
      loadClientDictionary(next).then((d) => {
        setState({ locale: next, dict: d });
        router.push(withLocale(pathname || "/", next));
      });
    },
    [locale, pathname, router],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dict, href, switchLocale }),
    [locale, dict, href, switchLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale* must be used within LocaleProvider");
  return ctx;
}

export function useLocale(): Locale {
  return useLocaleContext().locale;
}
export function useDict(): Dictionary {
  return useLocaleContext().dict;
}
export function useContent(): SiteContent {
  return useLocaleContext().dict.content;
}
export function useUi(): UiStrings {
  return useLocaleContext().dict.ui;
}
export function useMainContent(): MainContent {
  return useLocaleContext().dict.main;
}
/** Prefix an internal href with the active locale. */
export function useLocalizedHref(): (path: string) => string {
  return useLocaleContext().href;
}
/** Switch language, staying on the current page. */
export function useSwitchLocale(): (next: Locale) => void {
  return useLocaleContext().switchLocale;
}
