import { HomeRouter } from "@/components/compositions/HomeRouter";

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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeRouter />
    </>
  );
}
