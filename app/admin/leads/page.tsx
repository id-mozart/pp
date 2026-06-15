import type { Metadata } from "next";
import Link from "next/link";
import { hasDb, listLeads, type Lead } from "@/lib/db";

export const metadata: Metadata = {
  title: "Заявки — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("uk-UA", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function reach(l: Lead) {
  return [l.contact, l.email, l.phone].filter(Boolean).join(" · ") || "—";
}

export default async function LeadsPage() {
  const db = hasDb();
  const leads = db ? await listLeads() : [];

  return (
    <div id="pp-admin" className="min-h-screen bg-[#0B0A09] px-6 py-10 text-ink sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-ink">
            Заявки {db && <span className="text-faint">· {leads.length}</span>}
          </h1>
          <Link href="/admin" className="rounded-[10px] border border-line/60 px-4 py-2 text-sm text-muted hover:border-gold/50 hover:text-gold">
            ← Панель
          </Link>
        </div>

        {!db ? (
          <div className="mt-8 rounded-xl border border-line/60 bg-[#131210] p-6 text-sm leading-relaxed text-muted">
            База даних не підключена. Додайте сервіс{" "}
            <span className="text-gold">Postgres</span> у Railway — він
            автоматично передасть <code className="text-gold">DATABASE_URL</code>,
            і заявки почнуть зберігатися тут.
          </div>
        ) : leads.length === 0 ? (
          <p className="mt-8 text-sm text-muted">Поки що заявок немає.</p>
        ) : (
          <div className="mt-8 flex flex-col gap-3">
            {leads.map((l) => (
              <article
                key={l.id}
                className="rounded-xl border border-line/60 bg-[#131210] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-ink">{l.name || "—"}</span>
                    <span
                      className="rounded-full border border-line/70 px-2.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-gold"
                      style={{ background: "rgba(35,26,18,.6)" }}
                    >
                      {l.type}
                    </span>
                  </div>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">
                    {fmt.format(new Date(l.created_at))}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/90">{reach(l)}</p>
                {l.appt && (
                  <p className="mt-1 text-sm text-gold">Слот: {l.appt}</p>
                )}
                {l.topic && (
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-faint">
                    Тема: {l.topic}
                  </p>
                )}
                {l.message && (
                  <p className="mt-2 text-sm leading-relaxed text-muted">{l.message}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
