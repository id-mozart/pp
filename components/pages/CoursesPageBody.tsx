"use client";

import { PageHero } from "@/components/sections/PageHero";
import { CoursesIntro, CoursesList } from "@/components/pages/courses";
import { ContactForm } from "@/components/sections/ContactForm";
import { useContent, useUi } from "@/components/providers/LocaleProvider";

/** Client body so the hero text re-renders instantly on a locale switch. */
export function CoursesPageBody() {
  const { courses } = useContent();
  const ui = useUi();
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
        image="/brand/format-courses.jpg"
        primary={{ label: ui.coursesPage.heroPrimary, href: "#catalog" }}
        secondary={{ label: ui.coursesPage.heroSecondary, href: "#contact" }}
      />
      <CoursesIntro />
      <CoursesList />
      <ContactForm />
    </>
  );
}
