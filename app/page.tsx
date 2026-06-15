import { HomeRouter } from "@/components/compositions/HomeRouter";
import { getContent } from "@/lib/db";
import { mergeMainContent, type MainContentOverride } from "@/lib/mainContent";

// CMS-правки версії M читаються з БД на кожен запит.
export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Pan&Partners",
  founder: { "@type": "Person", name: "Тетяна Пан" },
  description:
    "Корпоративні тренінги, онлайн-курси та консультації з B2B-продажів і переговорів.",
  areaServed: "UA",
  knowsAbout: ["B2B продажі", "Переговори", "Управління продажами"],
  slogan: "Продавайте впевнено та з очікуваним результатом.",
};

export default async function HomePage() {
  const override = await getContent<MainContentOverride>("main");
  const mainContent = mergeMainContent(override);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeRouter mainContent={mainContent} />
    </>
  );
}
