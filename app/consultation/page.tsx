import type { Metadata } from "next";
import { Main5Home } from "@/components/compositions/Main5Home";
import { StickyBookCta } from "@/components/chrome/StickyBookCta";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const { ui } = getDictionary(locale);
  return {
    title: ui.meta.consultation.title,
    description: ui.meta.consultation.description,
    alternates: localizedAlternates(locale, "/consultation"),
  };
}

export default function ConsultationPage() {
  return (
    <>
      <Main5Home />
      <StickyBookCta />
    </>
  );
}
