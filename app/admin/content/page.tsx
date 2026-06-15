import type { Metadata } from "next";
import { getContent, hasDb } from "@/lib/db";
import { mergeMainContent, type MainContentOverride } from "@/lib/mainContent";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const metadata: Metadata = {
  title: "Контент M — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const data = mergeMainContent(await getContent<MainContentOverride>("main"));
  return <ContentEditor initial={data} dbReady={hasDb()} />;
}
