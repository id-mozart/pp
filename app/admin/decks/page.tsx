import type { Metadata } from "next";
import Link from "next/link";
import { getContentStrict, hasDb, listDecks } from "@/lib/db";
import { DECK_DEFAULTS, sanitizeDeck } from "@/lib/decks/sanitize";
import type { Deck } from "@/lib/decks/types";
import { DeckThumb } from "@/components/admin/DeckThumb";
import { DeckCardActions, NewDeckButton } from "@/components/admin/DecksManager";

export const metadata: Metadata = {
  title: "Презентації — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const CSS = `
  body:has(#decks) header, body:has(#decks) footer, body:has(#decks) main ~ div,
  body:has(#decks) [class*="fixed"], body:has(#decks) [class*="cookie"]{ display:none !important; }
  body:has(#decks){ background:#E9E2D5 !important; }
  #decks{ min-height:100vh; background:#E9E2D5; padding:28px 24px 60px; font-family:var(--font-inter),system-ui,sans-serif; color:#2A2018; }
  #decks .thumb{ position:relative; width:100%; aspect-ratio:297/210; overflow:hidden; border-radius:10px; background:#FCF8F1; box-shadow:0 6px 20px rgba(60,40,15,.14); }
  #decks .thumb .scale{ position:absolute; left:0; top:0; width:297mm; height:210mm; transform-origin:0 0; pointer-events:none; }
  #decks .thumb #deck-a4{ gap:0; }
  #decks .thumb .sheet{ box-shadow:none !important; }
  #decks .grid{ grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); }
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
  #decks .head .acts{ display:flex; gap:10px; align-items:center; }
  #decks button.btn{ cursor:pointer; font-family:inherit; }
  #decks button.btn:disabled{ opacity:.55; cursor:default; }
  #decks .btn.danger:hover{ border-color:#B33A2B; color:#B33A2B; }
  #decks .modal{ position:fixed; inset:0; background:rgba(40,28,14,.45); display:flex; align-items:center; justify-content:center; padding:20px; z-index:50; }
  #decks .dlg{ background:#FCF8F1; border-radius:16px; padding:24px 26px; width:min(460px,100%); box-shadow:0 20px 60px rgba(40,28,14,.3); display:flex; flex-direction:column; gap:14px; }
  #decks .dlg h2{ font-family:var(--font-spectral),serif; font-weight:500; font-size:22px; margin:0; }
  #decks .dlg label{ display:flex; flex-direction:column; gap:6px; font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#9C8B73; }
  #decks .dlg input, #decks .dlg select{ font:15px/1.3 var(--font-inter),system-ui,sans-serif; padding:10px 12px; border:1px solid rgba(140,116,82,.45); border-radius:10px; background:#fff; color:#2A2018; }
  #decks .dlg .err{ margin:0; font-size:13px; color:#B33A2B; }
  #decks .dlg .row{ margin-top:4px; }
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
  // усі збережені деки: зі шаблоном у коді або створені в цьому розділі (живуть лише в базі)
  const saved = res.items;
  const bySlug = new Map(saved.map((d) => [d.slug, d]));
  // повні дані для мініатюр (читання суворе; при збої — без мініатюри, а не дефолт)
  const full = new Map<string, Deck>();
  for (const d of saved) {
    const r = await getContentStrict<Deck>(`deck:${d.slug}`);
    if (r.ok && r.data && Array.isArray(r.data.pages) && r.data.pages.length) {
      const clean = sanitizeDeck(r.data, d.slug, { fallbackToDefault: false });
      if (clean.pages.length) full.set(d.slug, clean);
    }
  }
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
        <div className="acts">
          <NewDeckButton items={items.map((d) => ({ slug: d.slug, name: d.name }))} />
          <Link href="/admin" className="back">← Панель</Link>
        </div>
      </div>
      <div className="grid">
        {items.map((d) => (
          <div className="card" key={d.slug}>
            {(full.get(d.slug) ?? (!d.saved ? DECK_DEFAULTS[d.slug] : undefined)) ? <DeckThumb deck={(full.get(d.slug) ?? DECK_DEFAULTS[d.slug])!} /> : null}
            <div className="nm">{d.name}</div>
            <div className="meta">
              <b>{d.pages} стор.</b> · A4 · {d.saved ? `оновлено ${fmt(d.updatedAt)}` : "ще не збережено (стандартна)"}
            </div>
            <div className="meta">/admin/deck/{d.slug}</div>
            <div className="row">
              <Link href={`/admin/deck/${d.slug}`} className="btn pri">Відкрити редактор</Link>
              <Link href={`/admin/deck/${d.slug}?present=1`} className="btn">▶ Показ</Link>
              <DeckCardActions slug={d.slug} name={d.name} deletable={!DECK_DEFAULTS[d.slug]} />
            </div>
          </div>
        ))}
      </div>
      <p className="note">«Нова презентація» створює порожню деку або копію будь-якої існуючої під новою адресою; «Копіювати» — те саме з картки. Стандартні презентації (з шаблоном у коді) не видаляються. PDF завантажується з редактора кнопкою «Завантажити PDF». Кожне збереження зберігає попередню версію в історії, тому будь-який стан можна відновити.</p>
    </div>
  );
}
