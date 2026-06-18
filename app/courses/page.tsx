import type { Metadata } from "next";
import { CoursesPageBody } from "@/components/pages/CoursesPageBody";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const { ui } = getDictionary(locale);
  return {
    title: ui.meta.courses.title,
    description: ui.meta.courses.description,
    alternates: localizedAlternates(locale, "/courses"),
  };
}

export default function CoursesPage() {
  return <CoursesPageBody />;
}
