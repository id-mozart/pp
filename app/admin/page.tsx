import type { Metadata } from "next";
import Link from "next/link";
import { hasDb, countLeads } from "@/lib/db";
import { authEnabled } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Адмін — Pan&Partners",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const CARDS = [
  { href: "/admin/leads", title: "Заявки", desc: "Вхідні з усіх форм сайту" },
  { href: "/admin/content", title: "Контент · версія M", desc: "Тексти й фото головної (M)" },
  { href: "/admin/story", title: "Студія сторіз", desc: "Генератор Instagram-каруселі" },
  { href: "/admin/profile", title: "Профайл", desc: "Друкований профайл тренера (PDF)" },
];

export default async function AdminDashboard() {
  const db = hasDb();
  const leads = db ? await countLeads() : 0;

  return (
    <div id="pp-admin" className="min-h-screen bg-[#0B0A09] px-6 py-10 text-ink sm:px-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-ink" style={{ fontFamily: "var(--font-playfair)" }}>
              Pan<em className="not-italic text-gold">&amp;</em>Partners
            </p>
            <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-faint">
              Панель адміністратора
            </p>
          </div>
          <form method="POST" action="/api/admin/logout">
            <button className="rounded-[10px] border border-line/60 px-4 py-2 text-sm text-muted transition-colors hover:border-gold/50 hover:text-gold">
              Вийти
            </button>
          </form>
        </div>

        {/* статуси */}
        <div className="mt-8 flex flex-wrap gap-3 text-[0.7rem]">
          <StatusPill ok={db} okText={`База даних · підключено · ${leads} заявок`} offText="База даних · не підключено (додайте Railway Postgres)" />
          <StatusPill ok={authEnabled()} okText="Доступ · захищено паролем" offText="Доступ · відкритий (задайте ADMIN_PASSWORD)" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-line/60 bg-[#131210] p-6 transition-colors hover:border-gold/50"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-ink">{card.title}</h2>
                <span className="text-gold transition-transform group-hover:translate-x-1">→</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{card.desc}</p>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-faint">
          <Link href="/" className="hover:text-gold">← на сайт</Link>
        </p>
      </div>
    </div>
  );
}

function StatusPill({ ok, okText, offText }: { ok: boolean; okText: string; offText: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono uppercase tracking-[0.12em]"
      style={{
        borderColor: ok ? "rgba(226,166,56,.4)" : "rgba(170,80,60,.5)",
        color: ok ? "#E2A638" : "#d98a72",
        background: "rgba(35,26,18,.5)",
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: ok ? "#E2A638" : "#d98a72" }} />
      {ok ? okText : offText}
    </span>
  );
}
