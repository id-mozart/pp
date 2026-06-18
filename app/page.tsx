import type { Metadata } from "next";
import { HomeRouter } from "@/components/compositions/HomeRouter";
import { getContent } from "@/lib/db";
import { mergeMainContent, type MainContentOverride } from "@/lib/mainContent";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedAlternates } from "@/lib/i18n/metadata";

// CMS-правки версії M читаються з БД на кожен запит.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  return {
    alternates: localizedAlternates(locale, "/"),
  };
}

export default async function HomePage() {
  const locale = getLocale();
  const dict = getDictionary(locale);
  const override = await getContent<MainContentOverride>("main");
  const mainContent = locale === "uk" ? mergeMainContent(override) : dict.main;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: dict.content.brand.company,
    founder: { "@type": "Person", name: dict.content.brand.person },
    description: dict.ui.jsonld.description,
    areaServed: "UA",
    knowsAbout: dict.ui.jsonld.knowsAbout,
    slogan: dict.ui.jsonld.slogan,
  };

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
