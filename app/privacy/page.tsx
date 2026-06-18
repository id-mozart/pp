import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { GRAD_ACC, gradText } from "@/lib/ember";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const { ui } = getDictionary(locale);
  return {
    title: ui.meta.privacy.title,
    description: ui.meta.privacy.description,
    alternates: localizedAlternates(locale, "/privacy"),
    robots: { index: false },
  };
}

export default function PrivacyPage() {
  const locale = getLocale();
  const { content, ui } = getDictionary(locale);
  const { brand, contacts } = content;
  const sections = ui.privacy.sections;
  return (
    <>
      <PageHero
        eyebrow={ui.privacy.eyebrow}
        title={ui.privacy.title}
        lead={ui.privacy.lead}
      />
      <section className="pb-24">
        <div className="container-shell">
          <div className="mx-auto max-w-prose">
            {sections.map((s, i) => (
              <div
                key={s.h}
                className="grid grid-cols-[2rem_1fr] border-t border-line/50 py-7 sm:grid-cols-[2.6rem_1fr]"
              >
                <span
                  className="font-mono text-[0.7rem] font-medium tracking-[0.2em]"
                  style={gradText(GRAD_ACC)}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-xl text-ink">{s.h}</h2>
                  <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-line/50 py-7 text-sm text-faint">
              <p>{brand.copyright}</p>
              <p className="mt-1">
                {ui.privacy.contactsLabel}
                {contacts.whatsapp.label} · {contacts.telegram.label}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
