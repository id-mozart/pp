import type { Metadata } from "next";
import Link from "next/link";
import { getContentStrict, hasDb, listDecks } from "@/lib/db";
import { DECK_DEFAULTS, sanitizeDeck } from "@/lib/decks/sanitize";
import type { Deck } from "@/lib/decks/types";
import { DecksList, type DeckItem } from "@/components/admin/DecksList";

export const metadata: Metadata = {
  title: "Презентації — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const CSS = `
  /* ховаємо маркетинговий хром сайту й темний відступ під фіксованим хедером */
  body:has(#decks) header, body:has(#decks) footer, body:has(#decks) main ~ div,
  body:has(#decks) [data-cta-band], body:has(#decks) [class*="fixed"], body:has(#decks) [class*="cookie"]{ display:none !important; }
  html:has(#decks){ background:#0B0A09 !important; }
  body:has(#decks){ background:#0B0A09 !important; color-scheme:dark; }
  body:has(#decks) #main{ padding-top:0 !important; margin-top:0 !important; }

  #decks{
    --d-bg:#0B0A09; --d-card:#141211; --d-card-hi:#1A1715; --d-line:rgba(154,130,90,.22);
    --d-ink:#F2ECE2; --d-muted:#AFA493; --d-faint:#7B7264; --d-gold:#E2A638; --d-amber:#C4621F; --d-danger:#E08272;
    min-height:100vh; background:
      radial-gradient(1100px 420px at 50% -260px, rgba(196,98,31,.16), transparent 70%),
      var(--d-bg);
    padding:34px 28px 64px; font-family:var(--font-inter),system-ui,sans-serif; color:var(--d-ink);
    -webkit-font-smoothing:antialiased;
  }
  #decks *{ box-sizing:border-box; }
  #decks :focus-visible{ outline:2px solid var(--d-gold); outline-offset:2px; border-radius:8px; }

  /* ── шапка ───────────────────────────────────────────── */
  #decks .head{ max-width:1180px; margin:0 auto 24px; display:flex; align-items:center; justify-content:space-between; gap:16px 20px; flex-wrap:wrap; }
  #decks .head .ttl{ display:flex; align-items:baseline; gap:12px; min-width:0; }
  #decks h1{ font-family:var(--font-spectral),serif; font-weight:500; font-size:30px; line-height:1.1; margin:0; letter-spacing:.01em; }
  #decks .count{ font-family:var(--font-jetbrains),monospace; font-size:11px; color:var(--d-muted);
    border:1px solid var(--d-line); border-radius:999px; padding:3px 9px; background:rgba(255,255,255,.02); }
  #decks .acts{ display:flex; gap:10px; align-items:center; }

  /* ── кнопки ──────────────────────────────────────────── */
  #decks .btn{ display:inline-flex; align-items:center; justify-content:center; gap:6px; white-space:nowrap;
    border:1px solid var(--d-line); border-radius:10px; padding:8px 13px; font-size:13px; line-height:1.15;
    color:var(--d-ink); text-decoration:none; background:rgba(255,255,255,.03); font-family:inherit; cursor:pointer;
    transition:border-color .15s, color .15s, background .15s, transform .15s; }
  #decks .btn:hover{ border-color:rgba(226,166,56,.5); color:var(--d-gold); background:rgba(226,166,56,.07); }
  #decks .btn.pri{ background:linear-gradient(96deg,#E8AC3C,#CE651E); color:#231708; border-color:transparent; font-weight:600; }
  #decks .btn.pri:hover{ color:#231708; filter:brightness(1.06); background:linear-gradient(96deg,#E8AC3C,#CE651E); }
  #decks .btn.sm{ padding:7px 11px; font-size:12.5px; }
  #decks .btn.ghost{ background:transparent; color:var(--d-muted); }
  #decks .btn.danger{ color:var(--d-danger); }
  #decks .btn.danger:hover{ border-color:rgba(224,130,114,.55); color:var(--d-danger); background:rgba(224,130,114,.1); }
  #decks button.btn:disabled{ opacity:.5; cursor:default; }
  #decks .btn.back{ color:var(--d-muted); background:transparent; }

  /* ── сітка й картка ──────────────────────────────────── */
  #decks .grid{ max-width:1180px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(304px,1fr)); gap:18px; align-items:stretch; }
  #decks .card{ position:relative; display:flex; flex-direction:column; background:var(--d-card);
    border:1px solid var(--d-line); border-radius:16px;
    box-shadow:0 18px 40px -28px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.03);
    transition:border-color .18s, box-shadow .18s, background .18s; }
  /* без transform на :hover — інакше картка стає контейнером для position:fixed діалогів */
  #decks .card:hover{ border-color:rgba(226,166,56,.34); background:var(--d-card-hi);
    box-shadow:0 26px 52px -26px rgba(0,0,0,1), inset 0 1px 0 rgba(255,255,255,.05); }

  /* мініатюра — герой картки, на всю ширину зверху */
  #decks .thumbwrap{ position:relative; display:block; border-radius:15px 15px 0 0; overflow:hidden; background:#0E0C0B; }
  #decks .thumbwrap::after{ content:""; position:absolute; inset:0; pointer-events:none; border-radius:inherit;
    box-shadow:inset 0 0 0 1px rgba(0,0,0,.35), inset 0 -1px 0 rgba(226,166,56,.18); }
  #decks .thumb{ position:relative; width:100%; aspect-ratio:297/210; overflow:hidden; background:#FCF8F1; }
  #decks .thumb .scale{ position:absolute; left:0; top:0; width:297mm; height:210mm; transform-origin:0 0; pointer-events:none; }
  #decks .thumb #deck-a4{ gap:0; }
  #decks .thumb .sheet{ box-shadow:none !important; }
  #decks .thumb.ph{ display:flex; align-items:center; justify-content:center; background:#17140F;
    font-family:var(--font-jetbrains),monospace; font-size:11px; color:var(--d-faint); }

  /* тіло картки */
  #decks .body{ flex:1; display:flex; flex-direction:column; gap:8px; padding:14px 16px 4px; min-width:0; }
  #decks .nm{ font-family:var(--font-spectral),serif; font-size:19px; line-height:1.28; color:var(--d-ink); margin:0;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:2.56em; }
  #decks .slug{ font-family:var(--font-jetbrains),monospace; font-size:10.5px; color:var(--d-faint);
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #decks .meta{ display:flex; flex-wrap:wrap; align-items:center; gap:6px 8px; font-size:12.5px; color:var(--d-muted); }
  #decks .pill{ font-family:var(--font-jetbrains),monospace; font-size:11px; color:var(--d-gold);
    border:1px solid rgba(226,166,56,.3); background:rgba(226,166,56,.08); border-radius:999px; padding:2px 8px; white-space:nowrap; }
  #decks .badge{ font-size:11px; color:var(--d-muted); border:1px solid var(--d-line); background:rgba(255,255,255,.03);
    border-radius:999px; padding:2px 8px; white-space:nowrap; }
  #decks .when{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

  /* дії */
  #decks .row{ display:flex; align-items:center; gap:7px; padding:12px 16px 14px; margin-top:auto;
    border-top:1px solid rgba(154,130,90,.14); }
  #decks .row .more{ margin-left:auto; }

  /* меню «⋯» */
  #decks .menuwrap{ position:relative; }
  #decks .iconbtn{ width:32px; height:32px; padding:0; font-size:15px; line-height:1; }
  #decks .menu{ position:absolute; right:0; bottom:calc(100% + 8px); z-index:30; min-width:190px; padding:6px;
    background:#1C1917; border:1px solid rgba(154,130,90,.3); border-radius:12px;
    box-shadow:0 22px 50px -18px rgba(0,0,0,.95); display:flex; flex-direction:column; gap:2px; }
  #decks .menu button{ display:flex; align-items:center; gap:9px; width:100%; text-align:left; background:none; border:0;
    border-radius:8px; padding:8px 10px; font:13px/1.2 var(--font-inter),system-ui,sans-serif; color:var(--d-ink); cursor:pointer; }
  #decks .menu button:hover{ background:rgba(226,166,56,.1); color:var(--d-gold); }
  #decks .menu button:disabled{ opacity:.5; cursor:default; }
  #decks .menu button.danger{ color:var(--d-danger); }
  #decks .menu button.danger:hover{ background:rgba(224,130,114,.12); color:var(--d-danger); }
  #decks .menu .ic{ width:14px; text-align:center; opacity:.8; font-size:12px; }
  #decks .menu .sep{ height:1px; margin:4px 2px; background:rgba(154,130,90,.2); }

  /* ── модальні вікна ──────────────────────────────────── */
  #decks .modal{ position:fixed; inset:0; z-index:60; display:flex; align-items:center; justify-content:center; padding:20px;
    background:rgba(8,6,5,.66); backdrop-filter:blur(3px); }
  #decks .dlg{ width:min(460px,100%); display:flex; flex-direction:column; gap:14px; padding:24px 26px;
    background:#17140F; border:1px solid rgba(154,130,90,.3); border-radius:18px; box-shadow:0 40px 80px -30px rgba(0,0,0,1); }
  #decks .dlg h2{ font-family:var(--font-spectral),serif; font-weight:500; font-size:22px; line-height:1.2; margin:0; color:var(--d-ink); }
  #decks .dlg p.hint{ margin:0; font-size:13px; line-height:1.5; color:var(--d-muted); }
  #decks .dlg p.hint code{ font-family:var(--font-jetbrains),monospace; font-size:12px; color:var(--d-gold); }
  #decks .dlg label{ display:flex; flex-direction:column; gap:7px; font-family:var(--font-jetbrains),monospace;
    font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--d-faint); }
  #decks .dlg input, #decks .dlg select{ font:15px/1.3 var(--font-inter),system-ui,sans-serif; padding:10px 12px;
    border:1px solid rgba(154,130,90,.3); border-radius:10px; background:#0F0D0B; color:var(--d-ink); }
  #decks .dlg input::placeholder{ color:#6A6155; }
  #decks .dlg input:focus, #decks .dlg select:focus{ outline:none; border-color:rgba(226,166,56,.6); box-shadow:0 0 0 3px rgba(226,166,56,.14); }
  #decks .dlg .err{ margin:0; font-size:13px; color:var(--d-danger); }
  #decks .dlg .row{ display:flex; gap:9px; padding:0; margin:2px 0 0; border:0; }

  /* ── перемикач вигляду ───────────────────────────────── */
  #decks .seg{ display:inline-flex; padding:3px; gap:2px; border:1px solid var(--d-line); border-radius:11px; background:rgba(255,255,255,.03); }
  #decks .seg button{ display:inline-flex; align-items:center; gap:6px; border:0; border-radius:8px; padding:6px 11px; background:transparent;
    font:12.5px/1.15 var(--font-inter),system-ui,sans-serif; color:var(--d-muted); cursor:pointer; white-space:nowrap; transition:background .15s, color .15s; }
  #decks .seg button:hover{ color:var(--d-ink); }
  #decks .seg button.on{ background:rgba(226,166,56,.14); color:var(--d-gold); }
  #decks .seg .ic{ font-size:12px; opacity:.85; }

  /* ── таблиця ─────────────────────────────────────────── */
  #decks .tablewrap{ max-width:1180px; margin:0 auto; overflow-x:auto; background:var(--d-card); border:1px solid var(--d-line); border-radius:16px;
    box-shadow:0 18px 40px -28px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.03); }
  #decks .table{ width:100%; border-collapse:collapse; font-size:13.5px; }
  #decks .table th{ text-align:left; font-family:var(--font-jetbrains),monospace; font-weight:400; font-size:10.5px; letter-spacing:.08em; text-transform:uppercase;
    color:var(--d-faint); padding:12px 14px; border-bottom:1px solid var(--d-line); white-space:nowrap; }
  #decks .table td{ padding:10px 14px; border-bottom:1px solid rgba(154,130,90,.12); vertical-align:middle; }
  #decks .table tr:last-child td{ border-bottom:0; }
  #decks .table tbody tr:hover td{ background:rgba(226,166,56,.04); }
  #decks .table .c-th{ width:112px; padding-right:4px; }
  #decks .table .mini{ display:block; width:96px; border-radius:6px; overflow:hidden; box-shadow:0 0 0 1px rgba(0,0,0,.4), 0 6px 14px -8px rgba(0,0,0,.9); }
  #decks .table .mini .thumb{ border-radius:0; }
  #decks .table .mini .thumb.ph{ aspect-ratio:297/210; }
  #decks .table .tnm{ font-family:var(--font-spectral),serif; font-size:17px; line-height:1.25; color:var(--d-ink); text-decoration:none; display:block; }
  #decks .table .tnm:hover{ color:var(--d-gold); }
  #decks .table .c-name{ min-width:240px; }
  #decks .table .c-name .slug{ margin-top:3px; }
  #decks .table .c-num{ width:70px; text-align:center; }
  #decks .table .c-when{ width:170px; color:var(--d-muted); white-space:nowrap; }
  #decks .table .c-acts{ width:1%; }
  #decks .table .row{ padding:0; border:0; margin:0; justify-content:flex-end; }
  #decks .table .row .more{ margin-left:2px; }
  #decks .table .menu{ bottom:auto; top:calc(100% + 8px); }
  #decks .table tr:nth-last-child(-n+2) .menu{ top:auto; bottom:calc(100% + 8px); }

  #decks .note{ max-width:1180px; margin:26px auto 0; font-size:12.5px; line-height:1.6; color:var(--d-faint); }
  #decks .empty{ max-width:1180px; margin:0 auto; padding:40px 22px; text-align:center; color:var(--d-muted);
    border:1px dashed var(--d-line); border-radius:16px; font-size:14px; }

  @media (max-width:560px){
    #decks{ padding:22px 16px 48px; }
    #decks h1{ font-size:25px; }
    #decks .grid{ grid-template-columns:1fr; gap:16px; }
    #decks .nm{ min-height:0; }
    #decks .head{ align-items:flex-start; }
    #decks .head .acts{ width:100%; flex-wrap:wrap; }
    #decks .head .acts .btn.pri{ flex:1; }
    #decks .table .c-when{ width:auto; }
  }
`;

/** «16 вер., 07:06» — без великих літер і без розрідження. */
function fmt(iso: string) {
  try {
    const d = new Date(iso);
    const day = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short", timeZone: "Europe/Kyiv" }).format(d);
    const time = new Intl.DateTimeFormat("uk-UA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Kyiv" }).format(d);
    const year = new Intl.DateTimeFormat("uk-UA", { year: "numeric", timeZone: "Europe/Kyiv" }).format(d);
    const now = new Intl.DateTimeFormat("uk-UA", { year: "numeric", timeZone: "Europe/Kyiv" }).format(new Date());
    return `${day}${year === now ? "" : ` ${year}`}, ${time}`;
  } catch { return iso; }
}

export default async function DecksPage() {
  const res = hasDb() ? await listDecks() : { ok: true as const, items: [] };
  if (!res.ok) {
    return (
      <div id="decks"><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="head">
          <div className="ttl"><h1>Презентації</h1></div>
          <div className="acts"><Link href="/admin" className="btn back">← Панель</Link></div>
        </div>
        <p className="empty">База даних тимчасово недоступна — список не показуємо, щоб не ввести в оману. Оновіть сторінку через хвилину.</p>
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
  const list: DeckItem[] = items.map((d) => ({
    slug: d.slug, name: d.name, pages: d.pages, saved: d.saved, when: d.saved ? fmt(d.updatedAt) : "",
    deletable: !DECK_DEFAULTS[d.slug], deck: full.get(d.slug) ?? (!d.saved ? DECK_DEFAULTS[d.slug] : undefined),
  }));
  return (
    <div id="decks">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <DecksList items={list} />
      <p className="note">Кожне збереження лишає попередню версію в історії; стандартні деки (з шаблоном у коді) не видаляються.</p>
    </div>
  );
}
