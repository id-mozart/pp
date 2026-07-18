import type { Metadata } from "next";
import { BrandBook } from "@/components/brand/BrandBook";

export const metadata: Metadata = {
  title: "Бренд — кольори, шрифти, логотип",
  description:
    "Фірмовий стиль Pan&Partners: палітра, типографіка та архіви з логотипом і шрифтами.",
  robots: { index: false },
};

/** Службова сторінка брендбука — для дизайнерів і підрядників. */
export default function BrandPage() {
  return <BrandBook />;
}
