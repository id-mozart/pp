import type { Metadata } from "next";

/** Закритий розділ курсу: не індексується, у меню та sitemap не виводиться. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
