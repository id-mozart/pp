import type { Metadata } from "next";
import { B2BPageBody } from "@/components/pages/B2BPageBody";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const { ui } = getDictionary(locale);
  return {
    title: ui.meta.b2b.title,
    description: ui.meta.b2b.description,
    alternates: localizedAlternates(locale, "/b2b"),
  };
}

export default function B2BPage() {
  return <B2BPageBody />;
}
