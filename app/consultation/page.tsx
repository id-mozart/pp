import type { Metadata } from "next";
import { Main5Home } from "@/components/compositions/Main5Home";
import { StickyBookCta } from "@/components/chrome/StickyBookCta";

export const metadata: Metadata = {
  title: "Консультація — онлайн 1:1 з продажів",
  description:
    "Одна година — і у ваших продажів є план. Онлайн 1:1 консультація з Тетяною Пан: діагностика вузького місця, розбір вашої ситуації, план дій і конкретні скрипти.",
  alternates: { canonical: "/consultation" },
};

export default function ConsultationPage() {
  return (
    <>
      <Main5Home />
      <StickyBookCta />
    </>
  );
}
