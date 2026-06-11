import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ConsultCards, ConsultWhat } from "@/components/pages/consultation";
import { BookingCalendar } from "@/components/sections/BookingCalendar";
import { StickyBookCta } from "@/components/chrome/StickyBookCta";
import { consultation } from "@/lib/content";

export const metadata: Metadata = {
  title: "Консультація — онлайн 1:1 з продажів",
  description:
    "Чіткий план для ваших продажів за одну фокусну годину. Онлайн 1:1 консультація: діагностика вузького місця, план наступних кроків і конкретні скрипти.",
  alternates: { canonical: "/consultation" },
};

export default function ConsultationPage() {
  return (
    <>
      <PageHero
        pill={consultation.hero.pill}
        title={
          <>
            Чіткий план для ваших продажів —{" "}
            <em className="italic text-gradient-gold">за одну фокусну годину</em>
          </>
        }
        lead={consultation.hero.lead}
        image="/brand/Tania4.webp"
        primary={consultation.hero.primaryCta}
        secondary={consultation.hero.secondaryCta}
        finePrint={consultation.hero.finePrint}
      />
      <ConsultCards />
      <ConsultWhat />
      <BookingCalendar />
      <StickyBookCta />
    </>
  );
}
