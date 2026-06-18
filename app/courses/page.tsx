import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CoursesIntro, CoursesList } from "@/components/pages/courses";
import { ContactForm } from "@/components/sections/ContactForm";
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
  const { content, ui } = getDictionary(getLocale());
  const { courses } = content;
  return (
    <>
      <PageHero
        eyebrow={courses.hero.eyebrow}
        title={
          <>
            {ui.coursesPage.heroTitlePre}
            <em className="italic text-gradient-gold">{ui.coursesPage.heroTitleEm}</em>
          </>
        }
        lead={courses.hero.lead}
        image="/brand/ph/p6.jpg"
        primary={{ label: ui.coursesPage.heroPrimary, href: "#catalog" }}
        secondary={{ label: ui.coursesPage.heroSecondary, href: "#contact" }}
      />
      <CoursesIntro />
      <CoursesList />
      <ContactForm />
    </>
  );
}
