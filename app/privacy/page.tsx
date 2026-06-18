import type { Metadata } from "next";
import { PrivacyPageBody } from "@/components/pages/PrivacyPageBody";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const { ui } = getDictionary(locale);
  return {
    title: ui.meta.privacy.title,
    description: ui.meta.privacy.description,
    alternates: localizedAlternates(locale, "/privacy"),
    robots: { index: false },
  };
}

export default function PrivacyPage() {
  return <PrivacyPageBody />;
}
