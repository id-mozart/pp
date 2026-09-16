import type { Metadata } from "next";
import Link from "next/link";
import { hasDb, listDecks } from "@/lib/db";
import { DECK_DEFAULTS } from "@/lib/decks/sanitize";

export const metadata: Metadata = {
  title: "Презентації — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const CSS = `
  #decks{ min-height:100vh; background:#E9E2D5; padding:28px 24px 60px; font-family:var(--font-inter),system-ui,sans-serif; color:#2A2018; }
  #decks .head{ max-width:1100px; margin:0 auto 18px; display:flex; align-items:baseline; justify-content:space-between; gap:16px; }
  #decks h1{ font-family:var(--font-spectral),serif; font-weight:500; font-size:30px; margin:0; }
  #decks h1 em{ color:#C4621F; font-style:italic; }
  #decks .back{ font-size:13px; color:#5E4C36; text-decoration:none; border:1px solid rgba(140,116,82,.45); border-radius:10px; padding:8px 14px; }
  #decks .grid{ max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; }
  #decks .card{ background:#FCF8F1; border-radius:16px; padding:20px 22px 18px; box-shadow:0 10px 30px rgba(60,40,15,.12); display:flex; flex-direction:column; gap:10px; }
  #decks .card .nm{ font-family:var(--font-spectral),serif; font-size:21px; line-height:1.2; }
  #decks .card .meta{ font-family:var(--font-jetbrains),monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#9C8B73; }
  #decks .card .meta b{ color:#C4621F; font-weight:500; }
  #decks .card .row{ display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
  #decks .btn{ border:1px solid rgba(140,116,82,.45); border-radius:10px; padding:8px 13px; font-size:13px; color:#2A2018; text-decoration:none; background:#fff; }
  #decks .btn:hover{ border-color:#C4621F; color:#C4621F; }
  #decks .btn.pri{ background:linear-gradient(96deg,#E8AC3C,#CE651E); color:#241A10; border-color:transparent; font-weight:600; }
  #decks .note{ max-width:1100px; margin:18px auto 0; font-size:13px; color:#7A6A54; line-height:1.5; }
`;

function fmt(iso: string) {
  try { return new Intl.DateTimeFormat("uk-UA", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Kyiv" }).format(new Date(iso)); } catch { return iso; }
}

export default async function DecksPage() {
  const res = hasDb() ? await listDecks() : { ok: true as const, items: [] };
  if (!res.ok) {
    return (
      <div id="decks"><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="head"><h1>Презентації</h1><Link href="/admin" className="back">← Панель</Link></div>
        <p className="note">База даних тимчасово недоступна — список не показуємо, щоб не ввести в оману. Оновіть сторінку через хвилину.</p>
      </div>
    );
  }
  // лише деки, для яких є шаблон-дефолт (інакше редактор не відкриється)
  const saved = res.items.filter((d) => DECK_DEFAULTS[d.slug]);
  const bySlug = new Map(saved.map((d) => [d.slug, d]));
  // Порядок: спочатку збережені (за часом), потім дефолтні, яких у базі ще немає
  const items = [
    ...saved.map((d) => ({ ...d, saved: true, name: d.name || DECK_DEFAULTS[d.slug]?.name || d.slug })),
    ...Object.entries(DECK_DEFAULTS).filter(([slug]) => !bySlug.has(slug)).map(([slug, d]) => ({ slug, name: d.name, pages: d.pages.length, updatedAt: "", saved: false })),
  ];
  return (
    <div id="decks">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="head">
        <h1>Презентації <em>· {items.length}</em></h1>
        <Link href="/admin" className="back">← Панель</Link>
      </div>
      <div className="grid">
        {items.map((d) => (
          <div className="card" key={d.slug}>
            <div className="nm">{d.name}</div>
            <div className="meta">
              <b>{d.pages} стор.</b> · A4 · {d.saved ? `оновлено ${fmt(d.updatedAt)}` : "ще не збережено (стандартна)"}
            </div>
            <div className="meta">/admin/deck/{d.slug}</div>
            <div className="row">
              <Link href={`/admin/deck/${d.slug}`} className="btn pri">Відкрити редактор</Link>
              <Link href={`/admin/deck/${d.slug}?present=1`} className="btn">▶ Показ</Link>
            </div>
          </div>
        ))}
      </div>
      <p className="note">PDF завантажується з редактора кнопкою «Завантажити PDF». Кожне збереження зберігає попередню версію в історії, тому будь-який стан можна відновити.</p>
    </div>
  );
}
