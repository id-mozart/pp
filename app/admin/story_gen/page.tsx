import type { Metadata } from "next";
import { CarouselStudio } from "@/components/admin/CarouselStudio";

/* Внутрішня копія студії каруселі у світлій нейтральній темі, без хедера/футера
   (див. .studio-neutral у globals.css і guard у SiteHeader/SiteFooter). */

export const metadata: Metadata = {
  title: "Генератор — внутрішнє (light)",
  robots: { index: false, follow: false },
};

export default function StoryGenPage() {
  return (
    <div className="studio-neutral">
      <CarouselStudio />
    </div>
  );
}
