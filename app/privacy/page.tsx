import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { brand, contacts } from "@/lib/content";
import { GRAD_ACC, gradText } from "@/lib/ember";

export const metadata: Metadata = {
  title: "Політика конфіденційності",
  description: "Як Pan&Partners обробляє та захищає ваші персональні дані.",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

const sections = [
  {
    h: "Які дані ми збираємо",
    p: "Ми збираємо лише ті дані, які ви добровільно надаєте через форми на сайті: ім'я, email, телефон, назву компанії та текст повідомлення. Додатково ми використовуємо знеособлену аналітику відвідувань.",
  },
  {
    h: "Як ми використовуємо дані",
    p: "Надані вами дані використовуються виключно для звʼязку з вами, відповіді на запит та організації консультацій і навчання. Ми не продаємо та не передаємо ваші дані третім сторонам.",
  },
  {
    h: "Файли cookie",
    p: "Сайт використовує файли cookie для покращення досвіду та аналітики трафіку. Ви можете прийняти або відхилити необовʼязкові cookie у банері згоди.",
  },
  {
    h: "Зберігання та захист",
    p: "Ми зберігаємо ваші дані не довше, ніж це потрібно для зазначених цілей, та вживаємо розумних технічних і організаційних заходів для їх захисту.",
  },
  {
    h: "Ваші права",
    p: "Ви маєте право запросити доступ до своїх даних, їх виправлення або видалення. Для цього напишіть нам у WhatsApp або Telegram.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Правова інформація"
        title="Політика конфіденційності"
        lead="Ми поважаємо вашу приватність. Нижче — коротко про те, які дані ми збираємо та як їх використовуємо."
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
                  <p className="mt-3 leading-relaxed text-muted">{s.p}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-line/50 py-7 text-sm text-faint">
              <p>{brand.copyright}</p>
              <p className="mt-1">
                Контакти: {contacts.whatsapp.label} · {contacts.telegram.label}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
