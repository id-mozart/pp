import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CoursesIntro, CoursesList } from "@/components/pages/courses";
import { ContactForm } from "@/components/sections/ContactForm";
import { courses } from "@/lib/content";

export const metadata: Metadata = {
  title: "Курси та готові рішення з продажів",
  description:
    "Готові рішення, щоб швидко посилити продажі: онлайн-курси, чек-листи та скрипти повідомлень для нових B2B-клієнтів.",
  alternates: { canonical: "/courses" },
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow={courses.hero.eyebrow}
        title={
          <>
            Готові рішення для ваших{" "}
            <span className="text-gradient-gold">продажів</span>
          </>
        }
        lead={courses.hero.lead}
        image="/brand/ph/p6.jpg"
      />
      <CoursesIntro />
      <CoursesList />
      <ContactForm />
    </>
  );
}
