import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamProfileBody } from "@/components/pages/TeamProfileBody";
import { TEAM_PROFILES, profileBySlug } from "@/lib/teamProfiles";

/** Сторінки профайлів /team/<slug> — поза меню й поза індексацією, як і сама сторінка «Команда». */
export function generateStaticParams() {
  return TEAM_PROFILES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = profileBySlug(params.slug);
  if (!p) return { title: "Профайл", robots: { index: false, follow: false } };
  return {
    title: `${p.name} — профайл`,
    description: p.role,
    robots: { index: false, follow: false },
  };
}

export default function TeamProfilePage({ params }: { params: { slug: string } }) {
  const p = profileBySlug(params.slug);
  if (!p) notFound();
  return <TeamProfileBody p={p} />;
}
