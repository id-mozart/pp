import type { Metadata } from "next";
import { CarouselStudio } from "@/components/admin/CarouselStudio";

export const metadata: Metadata = {
  title: "Студія Instagram-каруселі — адмін",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <CarouselStudio />;
}
