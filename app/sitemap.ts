import type { MetadataRoute } from "next";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";

const base =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://pan-partners-production.up.railway.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/b2b", priority: 0.9 },
    { path: "/consultation", priority: 0.9 },
    { path: "/courses", priority: 0.8 },
    { path: "/privacy", priority: 0.3 },
  ];

  // One entry per locale × route, each carrying hreflang alternates.
  return LOCALES.flatMap((locale) =>
    routes.map((r) => ({
      url: `${base}/${locale}${r.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: locale === DEFAULT_LOCALE ? r.priority : r.priority * 0.9,
      alternates: {
        languages: Object.fromEntries([
          ...LOCALES.map((l) => [l, `${base}/${l}${r.path}`]),
          ["x-default", `${base}/${DEFAULT_LOCALE}${r.path}`],
        ]),
      },
    })),
  );
}
