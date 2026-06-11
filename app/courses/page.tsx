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
            <em className="italic text-gradient-gold">продажів</em>
          </>
        }
        lead={courses.hero.lead}
        image="/brand/ph/p6.jpg"
        primary={{ label: "До каталогу курсів", href: "#catalog" }}
        secondary={{ label: "Поставити запитання", href: "#contact" }}
      />
      <CoursesIntro />
      <CoursesList />
      <ContactForm />
    </>
  );
}
