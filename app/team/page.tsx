import type { Metadata } from "next";
import { TeamPageBody } from "@/components/pages/TeamPageBody";

/**
 * Сторінка «Команда» — поки поза меню й поза індексацією (перший варіант на погодження).
 * Тексти лише українською: коли сторінку затвердять, перенесемо їх у словники lib/i18n.
 */
export const metadata: Metadata = {
  title: "Команда",
  description:
    "Тренери та консультанти Pan&Partners: Тетяна Пан, В'ячеслав Ковальов, Юлія Литвиненко, Юрій Бас, Тарас Башинський.",
  robots: { index: false, follow: false },
};

export default function TeamPage() {
  return <TeamPageBody />;
}
