"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DeckPages, type PickImage } from "@/components/deck/DeckPages";
import { DECK_LIBRARY } from "@/lib/decks/library";
import { PAGE_TYPE_LABELS, newId, type Deck, type DeckPage } from "@/lib/decks/types";
import { TemplatePicker } from "@/components/admin/TemplatePicker";
import { convertPage, type PageTemplate } from "@/lib/decks/templates";

type Status = "idle" | "saving" | "saved" | "error" | "dirty";

const UI_CSS = `
  body:has(#deck-ui) header, body:has(#deck-ui) footer, body:has(#deck-ui) main ~ div,
  body:has(#deck-ui) [class*="fixed"], body:has(#deck-ui) [class*="cookie"]{ display:none !important; }
  body:has(#deck-ui){ background:#E9E2D5 !important; }
  #deck-ui{ background:#E9E2D5; min-height:100vh; padding:0 0 60px; }
  #deck-ui .bar{ position:sticky; top:0; z-index:40; display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding:12px 24px;
    background:rgba(42,32,24,.96); color:#F5E9D7; backdrop-filter:blur(8px); box-shadow:0 8px 30px rgba(0,0,0,.25); }
  #deck-ui .bar .name{ font-family:var(--font-playfair),Georgia,serif; font-size:18px; margin-right:auto; }
  #deck-ui .bar .name em{ color:#E2A638; font-style:normal; }
  #deck-ui .bar .st{ font-family:var(--font-jetbrains),monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#B8A386; margin-right:8px; }
  #deck-ui .btn{ border:1px solid rgba(226,166,56,.45); border-radius:10px; padding:8px 14px; font-size:13px; color:#F5E9D7; background:transparent; cursor:pointer; }
  #deck-ui .btn:hover{ border-color:#E2A638; color:#E2A638; }
  #deck-ui .btn.on{ border-color:#E2A638; color:#E2A638; }
  #deck-ui .btn.pri{ background:linear-gradient(96deg,#E8AC3C,#CE651E); color:#241A10; border-color:transparent; font-weight:600; }
  #deck-ui .btn.pri:hover{ filter:brightness(1.05); color:#241A10; }
  #deck-ui select{ border:1px solid rgba(226,166,56,.45); border-radius:10px; padding:8px 10px; font-size:13px; color:#F5E9D7; background:#2A2018; }
  #deck-ui .hint{ width:100%; font-size:12px; color:#B8A386; }
  #deck-ui .pages{ padding:26px 0; }
  #deck-ui .ctl{ position:absolute; left:calc(100% + 10px); top:0; display:flex; flex-direction:column; gap:6px; z-index:5; }
  #deck-ui .ctl button{ width:34px; height:34px; border-radius:8px; border:1px solid rgba(140,116,82,.5); background:#FCF8F1; color:#5E4C36; cursor:pointer; font-size:14px; }
  #deck-ui .ctl button:hover{ border-color:#C4621F; color:#C4621F; }
  #deck-ui .ctl .ty{ font-family:var(--font-jetbrains),monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:#9C8B73; writing-mode:vertical-rl; margin-top:6px; }
  #deck-ui.bare{ padding:0; background:#fff; } #deck-ui.bare .pages{ padding:0; }
  #deck-ui .ctl .fs{ font-family:var(--font-jetbrains),monospace; font-size:9px; color:#C4621F; text-align:center; }
  #deck-ui .ctl .ins{ position:relative; }
  #deck-ui .ctl .ins select{ position:absolute; inset:0; opacity:0; width:100%; height:100%; cursor:pointer; }
  /* вибір зображення */
  #deck-ui .pick-bg{ position:fixed; inset:0; z-index:90; background:rgba(30,22,14,.55); display:flex; align-items:center; justify-content:center; padding:24px; }
  #deck-ui .pick{ width:min(980px,100%); max-height:88vh; overflow:auto; background:#FCF8F1; border-radius:16px; padding:22px 24px 26px; box-shadow:0 30px 80px rgba(0,0,0,.4); color:#2A2018; }
  #deck-ui .pick h3{ font-family:var(--font-spectral),serif; font-weight:500; font-size:22px; margin:0 0 6px; }
  #deck-ui .pick .row{ display:flex; flex-wrap:wrap; gap:10px; align-items:center; margin:10px 0 16px; }
  #deck-ui .pick .up{ border:1px dashed rgba(140,116,82,.6); border-radius:10px; padding:14px 18px; cursor:pointer; background:#fff; font-size:14px; color:#5E4C36; }
  #deck-ui .pick .up:hover{ border-color:#C4621F; color:#C4621F; }
  #deck-ui .pick .up input{ display:none; }
  #deck-ui .pick .lab{ font-family:var(--font-jetbrains),monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:#9C8B73; margin:14px 0 8px; }
  #deck-ui .pick .grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); gap:10px; }
  #deck-ui .pick .it{ border:2px solid transparent; border-radius:8px; background:#fff; padding:6px; cursor:pointer; text-align:left; }
  #deck-ui .pick .it:hover{ border-color:#C4621F; }
  #deck-ui .pick .it.on{ border-color:#C98A2B; }
  #deck-ui .pick .it img{ width:100%; height:80px; object-fit:cover; border-radius:4px; display:block; background:#EEE6D6; }
  #deck-ui .pick .it span{ display:block; font-size:10px; color:#7A6A54; margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  #deck-ui .pick .btns{ display:flex; gap:10px; justify-content:flex-end; margin-top:18px; }
  #deck-ui .pick .btn{ color:#5E4C36; border-color:rgba(140,116,82,.5); }
  #deck-ui .pick .btn.pri{ color:#241A10; }
  #deck-ui .pick .err{ color:#B3261E; font-size:13px; }
  /* вибір шаблону сторінки */
  #deck-ui .pick.tplpick{ width:min(1180px,100%); }
  #deck-ui .tplhint{ margin:0 0 6px; font-size:13px; color:#7A6A54; line-height:1.5; }
  #deck-ui .tplgrid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:12px; }
  #deck-ui .tpl{ border:2px solid transparent; border-radius:10px; background:#fff; padding:6px 6px 8px; cursor:pointer; text-align:left; display:block; width:100%; }
  #deck-ui .tpl:hover{ border-color:#C4621F; }
  #deck-ui .tpl.on{ border-color:#C98A2B; box-shadow:0 0 0 3px rgba(201,138,43,.18); }
  #deck-ui .tpl .th{ display:block; position:relative; width:100%; aspect-ratio:297/210; overflow:hidden; border-radius:5px; background:#FCF8F1; box-shadow:0 1px 0 rgba(0,0,0,.06), 0 4px 12px rgba(60,40,15,.1); }
  #deck-ui .tpl .sc{ position:absolute; left:0; top:0; width:297mm; height:210mm; transform:scale(var(--ts,.18)); transform-origin:0 0; pointer-events:none; }
  #deck-ui .tpl .sc #deck-a4{ gap:0; } #deck-ui .tpl .sc .sheet{ box-shadow:none !important; } #deck-ui .tpl .sc .imgbtn{ display:none !important; }
  #deck-ui .tpl .nm{ display:block; font-size:12.5px; color:#2A2018; margin-top:7px; }
  /* режим показу */
  #deck-ui .present{ position:fixed; inset:0; z-index:80; background:#0f0b08; display:flex; align-items:center; justify-content:center; cursor:none; }
  #deck-ui .present:hover{ cursor:default; }
  #deck-ui .present .stage{ width:297mm; height:210mm; transform:scale(var(--ps,1)); transform-origin:center; flex:none; }
  #deck-ui .present #deck-a4{ gap:0; }
  #deck-ui .present .hud{ position:fixed; left:0; right:0; bottom:0; display:flex; justify-content:space-between; align-items:center; padding:10px 18px; font-family:var(--font-jetbrains),monospace; font-size:12px; letter-spacing:.14em; color:rgba(245,233,215,.55); opacity:0; transition:opacity .25s; }
  #deck-ui .present:hover .hud{ opacity:1; }
  #deck-ui .present .hud button{ border:1px solid rgba(226,166,56,.45); border-radius:8px; padding:6px 12px; background:transparent; color:#F5E9D7; cursor:pointer; font:inherit; }
  #deck-ui .present .hud button:hover{ border-color:#E2A638; color:#E2A638; }
  @media print{ #deck-ui{ background:#fff; padding:0; } #deck-ui .bar, #deck-ui .ctl, #deck-ui .pick-bg, #deck-ui .present{ display:none !important; } #deck-ui .pages{ padding:0; } }
`;

export function DeckEditor({ initial, dbReady, only, bare, loadedAt, fromDb, presentOnLoad, pdfOnLoad }: { initial: Deck; dbReady: boolean; only?: number; bare?: boolean; loadedAt?: string | null; fromDb?: boolean; presentOnLoad?: boolean; pdfOnLoad?: boolean }) {
  const [deck, setDeck] = useState<Deck>(initial);
  const [status, setStatus] = useState<Status | "conflict">("idle");
  const [baseAt, setBaseAt] = useState<string | null>(loadedAt ?? null);
  const [errText, setErrText] = useState("");
  const editsRef = useRef(0); // лічильник правок: правки під час збереження не мають губитись
  const inFlightRef = useRef(false); // одне збереження за раз
  const [saving, setSaving] = useState(false);
  // Захист від закриття вкладки, поки правки не збережені (dirty, error, conflict, saving)
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (skipGuardRef.current) return; if (status !== "idle" && status !== "saved") { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [status]);
  // вибір шаблону сторінки: у кінець, після сторінки i, або перекласти сторінку i в іншу композицію
  const [tplMode, setTplMode] = useState<{ mode: "append" } | { mode: "insert"; i: number } | { mode: "replace"; i: number } | null>(null);

  /* ── скасування / повтор дій ── */
  const undoRef = useRef<Deck[]>([]);
  const redoRef = useRef<Deck[]>([]);
  const [hist, setHist] = useState({ undo: 0, redo: 0 });
  const deckRef = useRef(deck); deckRef.current = deck;
  function update(fn: (d: Deck) => Deck) {
    const before = deckRef.current;
    const next = fn(before);
    if (next === before) return; // дія нічого не змінила (межа діапазону тощо)
    undoRef.current.push(before); if (undoRef.current.length > 100) undoRef.current.shift();
    redoRef.current = [];
    setHist({ undo: undoRef.current.length, redo: 0 });
    deckRef.current = next;
    setDeck(next);
    editsRef.current += 1;
    setStatus("dirty");
  }
  const undo = useCallback(() => {
    const prev = undoRef.current.pop(); if (!prev) return;
    redoRef.current.push(deckRef.current);
    setHist({ undo: undoRef.current.length, redo: redoRef.current.length });
    setDeck(prev); editsRef.current += 1; setStatus("dirty");
  }, []);
  const redo = useCallback(() => {
    const next = redoRef.current.pop(); if (!next) return;
    undoRef.current.push(deckRef.current);
    setHist({ undo: undoRef.current.length, redo: redoRef.current.length });
    setDeck(next); editsRef.current += 1; setStatus("dirty");
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || (e.code !== "KeyZ" && e.code !== "KeyY")) return; // за фізичною клавішею — працює в будь-якій розкладці
      if (presentIdxRef.current !== null || document.querySelector("#deck-ui .pick-bg")) return; // не в показі й не в модалці
      // усередині редагованого тексту працює вбудоване скасування браузера
      const ae = document.activeElement as HTMLElement | null;
      if (ae && (ae.isContentEditable || ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.tagName === "SELECT")) return;
      e.preventDefault();
      if (e.code === "KeyY" || e.shiftKey) redo(); else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  /* ── автозбереження (перемикач памʼятається в браузері для кожної деки) ── */
  const [autosave, setAutosave] = useState(false);
  useEffect(() => { try { setAutosave(localStorage.getItem("deck-autosave:" + initial.slug) === "1"); } catch {} }, [initial.slug]);
  const toggleAutosave = () => { setAutosave((v) => { const n = !v; try { localStorage.setItem("deck-autosave:" + initial.slug, n ? "1" : "0"); } catch {} return n; }); };
  const patchPage = (i: number, patch: Record<string, unknown>) =>
    update((d) => ({ ...d, pages: d.pages.map((p, k) => (k === i ? ({ ...p, ...patch } as DeckPage) : p)) }));
  const move = (i: number, dir: -1 | 1) =>
    update((d) => {
      const j = i + dir;
      if (j < 0 || j >= d.pages.length) return d;
      const pages = [...d.pages];
      [pages[i], pages[j]] = [pages[j], pages[i]];
      return { ...d, pages };
    });
  const remove = (i: number) => {
    if (!confirm("Видалити цю сторінку?")) return;
    update((d) => ({ ...d, pages: d.pages.filter((_, k) => k !== i) }));
  };
  const duplicate = (i: number) =>
    update((d) => {
      const pages = [...d.pages];
      pages.splice(i + 1, 0, { ...d.pages[i], id: newId() } as DeckPage);
      return { ...d, pages };
    });
  const applyTemplate = (t: PageTemplate | null) => {
    const m = tplMode; setTplMode(null);
    if (!t || !m) return;
    if (m.mode === "append") update((d) => ({ ...d, pages: [...d.pages, t.make()] }));
    else if (m.mode === "insert") update((d) => { const pages = [...d.pages]; pages.splice(m.i + 1, 0, t.make()); return { ...d, pages }; });
    else update((d) => ({ ...d, pages: d.pages.map((p, k) => (k === m.i ? convertPage(p, t) : p)) }));
  };
  const bumpFs = (i: number, dir: -1 | 1) =>
    update((d) => ({ ...d, pages: d.pages.map((p, k) => {
      if (k !== i) return p;
      const cur = p.fs ?? 1;
      const next = Math.round(Math.min(2.4, Math.max(0.5, cur + dir * 0.1)) * 100) / 100;
      const { fs: _drop, ...rest } = p;
      return (Math.abs(next - 1) < 0.001 ? rest : { ...rest, fs: next }) as DeckPage;
    }) }));
  const bumpDeckFs = (dir: -1 | 1) =>
    update((d) => { const next = Math.round(Math.min(1.8, Math.max(0.6, (d.fs ?? 1) + dir * 0.1)) * 100) / 100; return { ...d, fs: next }; });

  /* ── режим показу (повний екран, Space/→ далі, ←/Backspace назад, Esc вихід) ── */
  const [present, setPresent] = useState<number | null>(null);
  const presentIdxRef = useRef<number | null>(null); presentIdxRef.current = present;
  const [tick, setTick] = useState(0); // перезапуск анімації при зміні сторінки
  const presentRef = useRef<HTMLDivElement>(null);
  const goTo = useCallback((k: number) => { setPresent((cur) => { if (cur === null) return cur; const n = Math.min(deck.pages.length - 1, Math.max(0, k)); return n; }); setTick((t) => t + 1); }, [deck.pages.length]);
  const startPresent = (from = 0) => {
    (document.activeElement as HTMLElement | null)?.blur?.(); // інакше Space повторно натисне кнопку
    setPresent(from); setTick((t) => t + 1);
    document.documentElement.requestFullscreen?.().catch(() => {});
    setTimeout(() => presentRef.current?.focus(), 50);
  };
  const stopPresent = useCallback(() => { setPresent(null); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); }, []);
  useEffect(() => {
    if (present === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space" || e.key === "Spacebar" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === "Enter") { e.preventDefault(); goTo(present + 1); }
      else if (e.key === "ArrowLeft" || e.key === "Backspace" || e.key === "PageUp") { e.preventDefault(); goTo(present - 1); }
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(deck.pages.length - 1);
      else if (e.key === "Escape") stopPresent();
    };
    const onFs = () => { if (!document.fullscreenElement) setPresent(null); };
    const fit = () => { const el = presentRef.current; if (!el) return; const s = Math.min(innerWidth / 1123, innerHeight / 794) * 0.98; el.style.setProperty("--ps", String(s)); };
    fit();
    window.addEventListener("keydown", onKey); document.addEventListener("fullscreenchange", onFs); window.addEventListener("resize", fit);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("fullscreenchange", onFs); window.removeEventListener("resize", fit); };
  }, [present, goTo, stopPresent, deck.pages.length]);

  /* ── вибір/завантаження зображення ── */
  const [picker, setPicker] = useState<{ current?: string; optional: boolean; resolve: (v: string | null) => void } | null>(null);
  const pickImage: PickImage = (current, optional) => new Promise((resolve) => setPicker({ current, optional, resolve }));
  const closePicker = (v: string | null) => { picker?.resolve(v); setPicker(null); };

  async function save(opts: { auto?: boolean; force?: boolean } = {}) {
    if (inFlightRef.current) { if (opts.auto) pendingAutoRef.current = true; return; } // попередній запит ще летить
    if (opts.auto && (!dbReady || baseAt === null)) return; // автозбереження лише для деки, що вже є в базі
    if (!opts.auto && dbReady && !fromDb && baseAt === null && !confirm("У базі ще немає збереженої версії цієї деки. Створити її з поточної (стандартної)?")) return;
    inFlightRef.current = true; setSaving(true); setErrText("");
    setStatus("saving");
    const snapshot = editsRef.current;
    try {
      let base = baseAt;
      if (opts.force) {
        // «Зберегти поверх»: беремо актуальну версію з бази як основу; попередня версія лишається в історії
        const gr = await fetch(`/api/admin/deck?slug=${deckRef.current.slug}`);
        if (gr.status === 401) { setErrText("сесія завершилась — увійдіть у адмінку знову"); setStatus("error"); return; }
        const g = await gr.json().catch(() => null);
        if (!g?.ok) throw new Error("db");
        base = g.updatedAt ?? null;
      }
      const res = await fetch("/api/admin/deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...deckRef.current, baseUpdatedAt: base, auto: !!opts.auto }),
      });
      const j = await res.json().catch(() => null);
      if (res.status === 409) { conflictAtRef.current = j?.currentUpdatedAt ?? null; setStatus("conflict"); autoFailRef.current = Date.now(); return; }
      if (res.status === 401) { setErrText("сесія завершилась — увійдіть у адмінку знову"); setStatus("error"); autoFailRef.current = Date.now(); return; }
      if (!res.ok || !j?.ok) {
        const m: Record<string, string> = { no_db: "база даних не підключена", db: "база тимчасово недоступна — спробуйте за хвилину", no_base: "застаріла версія сторінки — оновіть її й повторіть", empty: "дека без сторінок не зберігається", pages_mismatch: "частина сторінок не пройшла перевірку — оновіть сторінку", too_many_pages: "забагато сторінок (понад 200)", invalid: "некоректний запит" };
        setErrText(m[j?.error] || "невідома помилка"); setStatus("error"); autoFailRef.current = Date.now(); return;
      }
      if (j.updatedAt) setBaseAt(j.updatedAt);
      autoFailRef.current = 0;
      setStatus(editsRef.current === snapshot ? "saved" : "dirty");
    } catch {
      setErrText("немає звʼязку з сервером"); setStatus("error"); autoFailRef.current = Date.now();
    } finally {
      inFlightRef.current = false; setSaving(false);
      // правки, що прийшли під час збереження: зберегти ще раз
      if (pendingAutoRef.current) { pendingAutoRef.current = false; if (editsRef.current !== snapshot) setTimeout(() => save({ auto: true }), 300); }
    }
  }
  const autoFailRef = useRef(0);
  const pendingAutoRef = useRef(false);
  const conflictAtRef = useRef<string | null>(null);
  const skipGuardRef = useRef(false);
  // автозбереження: через 1,5 с після останньої дії; після невдачі — пауза 15 с
  useEffect(() => {
    if (!autosave) return;
    if (status !== "dirty" && status !== "error") return; // після помилки — повторна спроба; конфлікт вирішує людина
    const wait = status === "error" || (autoFailRef.current && Date.now() - autoFailRef.current < 15000) ? 15000 : 1500;
    const t = window.setTimeout(() => { save({ auto: true }); }, wait);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, autosave, status]);
  // показ одразу з URL (?present=1)
  useEffect(() => { if (presentOnLoad && !bare) { setPresent(0); setTick((t) => t + 1); } }, [presentOnLoad, bare]);
  // PDF: діалог друку з назвою деки як імʼям файлу (заголовок вкладки повертаємо після друку)
  const printPdf = useCallback(() => {
    const prev = document.title;
    document.title = deck.name || prev;
    const restore = () => { document.title = prev; window.removeEventListener("afterprint", restore); };
    window.addEventListener("afterprint", restore);
    window.print();
  }, [deck.name]);
  // PDF одразу з URL (?pdf=1, кнопка на картці в розділі «Презентації»): чекаємо шрифти й автопідбір кегля
  useEffect(() => {
    if (!pdfOnLoad || bare) return;
    let cancelled = false;
    const ready = (document as any).fonts?.ready ?? Promise.resolve();
    ready.then(() => new Promise((r) => setTimeout(r, 900))).then(() => { if (!cancelled) printPdf(); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfOnLoad, bare]);

  const stText: Record<Status | "conflict", string> = {
    idle: "без змін",
    dirty: "є незбережені зміни",
    saving: "зберігаю…",
    saved: "збережено",
    error: "не збережено",
    conflict: "деку змінено в іншому вікні",
  };

  return (
    <div id="deck-ui" className={bare ? "bare" : undefined}>
      <style dangerouslySetInnerHTML={{ __html: UI_CSS }} />
      {!bare && <div className="bar">
        <span className="name">
          {deck.name} <em>· A4 · {deck.pages.length} стор.</em>
        </span>
        <span className="st">{stText[status]}{status === "error" && errText ? `: ${errText}` : ""}</span>
        {status === "conflict" && (
          <>
            <button className="btn" onClick={() => { if (confirm("Взяти версію з бази? Ваші незбережені правки буде втрачено.")) { skipGuardRef.current = true; location.reload(); } }}>Оновити сторінку</button>
            <button className="btn pri" onClick={() => { const at = conflictAtRef.current ? new Date(conflictAtRef.current).toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" }) : "невідомий час"; if (confirm(`У базі є версія від ${at}. Записати вашу поверх неї? Попередня версія лишиться в історії.`)) save({ force: true }); }}>Зберегти поверх</button>
          </>
        )}
        <button className="btn" onClick={undo} disabled={!hist.undo} title="Скасувати дію (⌘Z / Ctrl+Z)">↶ {hist.undo || ""}</button>
        <button className="btn" onClick={redo} disabled={!hist.redo} title="Повторити дію (⌘⇧Z / Ctrl+Y)">↷ {hist.redo || ""}</button>
        <button className={"btn" + (autosave ? " on" : "")} onClick={toggleAutosave} disabled={!dbReady || baseAt === null} title={!dbReady || baseAt === null ? "Спочатку збережіть деку вручну" : "Автоматично зберігати через 1,5 с після кожної дії"}>{autosave ? "Автозбереження: увімк." : "Автозбереження: вимк."}</button>
        <button className="btn" onClick={() => setTplMode({ mode: "append" })} title="Нова сторінка з набору типових композицій">＋ Сторінка…</button>
        <button className={"btn" + (deck.caps ? " on" : "")} onClick={() => update((d) => ({ ...d, caps: !d.caps }))} title="Заголовки великими літерами">{deck.caps ? "Aa → АБВ" : "АБВ → Aa"}</button>
        <button className={"btn" + (deck.notes !== false ? " on" : "")} onClick={() => update((d) => ({ ...d, notes: d.notes === false ? true : false }))} title="Поле «Нотатки» на розріджених сторінках (для роздрукованої версії)">{deck.notes !== false ? "Нотатки: є" : "Нотатки: немає"}</button>
        <button className={"btn" + (deck.footRunhead ? " on" : "")} onClick={() => update((d) => ({ ...d, footRunhead: !d.footRunhead }))} title="Назва деки в нижньому колонтитулі (зверху лише логотип), номер сторінки без «/ 22»">{deck.footRunhead ? "Колонтитул: знизу" : "Колонтитул: зверху"}</button>
        <button className={"btn" + (deck.tight ? " on" : "")} onClick={() => update((d) => ({ ...d, tight: !d.tight }))} title="Щільна верстка: менші відступи в таблицях і картках, тому текст на щільних сторінках більший">{deck.tight ? "Щільно: так" : "Щільно: ні"}</button>
        <button className="btn" onClick={() => bumpDeckFs(-1)} title="Кегль усієї деки менше">A−</button>
        <span className="st" title="Множник кегля деки">×{(deck.fs ?? 1).toFixed(2)}</span>
        <button className="btn" onClick={() => bumpDeckFs(1)} title="Кегль усієї деки більше">A+</button>
        <button className="btn" onClick={() => startPresent(0)} title="Повноекранний показ: Space / → далі, ← назад, Esc вихід">▶ Показ</button>
        <button className="btn" onClick={printPdf}>Завантажити PDF</button>
        <button className="btn pri" onClick={() => save()} disabled={saving}>Зберегти</button>
        <Link href="/admin/decks" className="btn" onClick={(e) => { if (status !== "idle" && status !== "saved" && !confirm("Є незбережені правки. Вийти без збереження?")) e.preventDefault(); }}>← Презентації</Link>
        <p className="hint">
          ⌘Z / Ctrl+Z скасовує дію, ⌘⇧Z повторює. «Автозбереження» зберігає через 1,5 с після кожної дії. «▶ Показ» — повноекранний режим з анімацією: Space або → наступна сторінка, ← попередня, Esc вихід. Клікніть на будь-який текст на сторінці й редагуйте прямо там. У списках Enter додає новий пункт. Наведіть на сторінку — біля ілюстрацій зʼявиться «Замінити»; кнопки A−/A+ біля сторінки змінюють її кегль, ＋ вставляє нову сторінку одразу після неї (з вибором композиції), ▤ перекладає сторінку в іншу композицію зі збереженням текстів.
          «Завантажити PDF» відкриває друк — оберіть «Зберегти як PDF», формат A4, поля «немає».
          {!dbReady && " База даних не підключена: правки не збережуться після перезавантаження."}
        </p>
      </div>}
      <div className="pages">
        <DeckPages
          deck={deck}
          only={only}
          editable={!bare}
          onPatch={patchPage}
          onRunhead={(v) => update((d) => ({ ...d, runhead: v }))}
          pickImage={bare ? undefined : pickImage}
          renderControls={bare ? undefined : (i) => (
            <div className="ctl">
              <button title="Показ з цієї сторінки" onClick={() => startPresent(i)}>▶</button>
              <button title="Вгору" onClick={() => move(i, -1)}>↑</button>
              <button title="Вниз" onClick={() => move(i, 1)}>↓</button>
              <button title="Дублювати" onClick={() => duplicate(i)}>⧉</button>
              <button title="Вставити сторінку після цієї (вибір композиції)" onClick={() => setTplMode({ mode: "insert", i })}>＋</button>
              <button title="Змінити композицію цієї сторінки (тексти перенесуться)" onClick={() => setTplMode({ mode: "replace", i })}>▤</button>
              <button title="Видалити" onClick={() => remove(i)}>✕</button>
              <button title="Кегль сторінки менше" onClick={() => bumpFs(i, -1)}>A−</button>
              <span className="fs">{deck.pages[i].fs ? `×${deck.pages[i].fs!.toFixed(1)}` : "×1"}</span>
              <button title="Кегль сторінки більше" onClick={() => bumpFs(i, 1)}>A+</button>
              {deck.pages[i].type === "cover" && (
                <button title="Титул: звичайний → амперсанд → фото праворуч" onClick={() => { const cur = (deck.pages[i] as any).variant; patchPage(i, { variant: cur === "amp" ? "photo" : cur === "photo" ? undefined : "amp" }); }}>◫</button>
              )}
              {deck.pages[i].type === "bullets" && (
                <button title="Вигляд списку: список → картки → репліки" onClick={() => {
                  const cur = (deck.pages[i] as any).variant ?? "list";
                  const next = cur === "list" ? "cards" : cur === "cards" ? "bubbles" : "list";
                  patchPage(i, { variant: next }); // явне "list" зберігається як вибір користувача
                }}>◫</button>
              )}
              <span className="ty">{PAGE_TYPE_LABELS[deck.pages[i].type]}</span>
            </div>
          )}
        />
      </div>
      {picker && <ImagePicker current={picker.current} optional={picker.optional} onClose={closePicker} />}
      {tplMode && <TemplatePicker deck={deck} mode={tplMode.mode} onClose={applyTemplate} />}
      {present !== null && (
        <div className="present present-mode" ref={presentRef} tabIndex={-1} style={{ outline: "none" }} onClick={(e) => { if ((e.target as HTMLElement).closest(".hud")) return; goTo(present + 1); }} onContextMenu={(e) => { e.preventDefault(); goTo(present - 1); }}>
          <div className="stage">
            <DeckPages deck={deck} only={present + 1} editable={false} animate={tick} />
          </div>
          <div className="hud">
            <span>{String(present + 1).padStart(2, "0")} / {String(deck.pages.length).padStart(2, "0")} · Space / → далі · ← назад · Esc вихід</span>
            <span><button onClick={() => goTo(present - 1)}>←</button> <button onClick={() => goTo(present + 1)}>→</button> <button onClick={stopPresent}>✕ Вийти</button></span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── вибір / завантаження зображення ───────── */

const MAX_SIDE = 2200;
let mediaCache: { url: string; label: string }[] | null = null; // список завантажених — раз на сесію

/** Зменшує зображення до 2200 px по більшій стороні; PNG з прозорістю лишається PNG, решта — JPEG. */
async function downscale(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
  const k = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  if (k === 1 && file.size < 1.5 * 1024 * 1024) return file;
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  // PNG і WebP зберігають прозорість у своєму форматі, решта — JPEG
  const out = file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
  return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob"))), out, 0.88));
}

function ImagePicker({ current, optional, onClose }: { current?: string; optional: boolean; onClose: (v: string | null) => void }) {
  const [uploaded, setUploaded] = useState<{ url: string; label: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sel, setSel] = useState<string | undefined>(current);
  const fileRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose); onCloseRef.current = onClose;
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    if (mediaCache) setUploaded(mediaCache);
    else fetch("/api/admin/media").then((r) => r.json()).then((j) => { if (j?.ok) { mediaCache = (j.items as any[]).map((m) => ({ url: m.url, label: "завантажене" })); setUploaded(mediaCache); } }).catch(() => {});
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(null); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); prevFocus?.focus?.(); };
  }, []);

  async function upload(file: File) {
    setErr(""); setBusy(true);
    try {
      const blob = await downscale(file);
      const fd = new FormData();
      fd.append("file", new File([blob], file.name.replace(/\.[^.]+$/, "") + (blob.type === "image/png" ? ".png" : blob.type === "image/webp" ? ".webp" : ".jpg"), { type: blob.type }));
      const r = await fetch("/api/admin/media", { method: "POST", body: fd });
      const j = await r.json().catch(() => null);
      if (r.status === 401) throw new Error("auth");
      if (!r.ok || !j?.ok) throw new Error(j?.error || "upload");
      mediaCache = null; // список змінився — перечитати наступного разу
      onClose(j.url as string);
    } catch (e: any) {
      const m: Record<string, string> = { no_db: "База даних не підключена — завантаження недоступне.", too_large: "Файл завеликий (до 6 МБ).", bad_type: "Підтримуються PNG, JPEG, WebP, AVIF.", auth: "Сесія завершилась — увійдіть у адмінку знову." };
      setErr(m[e?.message] || "Не вдалося завантажити зображення.");
      setBusy(false);
    }
  }

  return (
    <div className="pick-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(null); }}>
      <div className="pick" role="dialog" aria-modal="true" aria-label="Вибір зображення">
        <h3>Ілюстрація</h3>
        <div className="row">
          <label className="up">
            {busy ? "Завантажую…" : "Завантажити з компʼютера (PNG, JPEG, WebP, AVIF; до 6 МБ)"}
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          </label>
          {err && <span className="err">{err}</span>}
        </div>
        {uploaded.length > 0 && (
          <>
            <div className="lab">Завантажені</div>
            <div className="grid">
              {uploaded.map((it) => (
                <button key={it.url} className={"it" + (sel === it.url ? " on" : "")} onClick={() => setSel(it.url)} onDoubleClick={() => onClose(it.url)}>
                  <img src={it.url} alt="" loading="lazy" decoding="async" /><span>{it.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
        <div className="lab">Бібліотека деки</div>
        <div className="grid">
          {DECK_LIBRARY.map((it) => (
            <button key={it.src} className={"it" + (sel === it.src ? " on" : "")} onClick={() => setSel(it.src)} onDoubleClick={() => onClose(it.src)}>
              <img src={it.src} alt="" loading="lazy" decoding="async" /><span>{it.label}</span>
            </button>
          ))}
        </div>
        <div className="btns">
          {optional && current ? <button className="btn" onClick={() => onClose("")}>Прибрати ілюстрацію</button> : null}
          <button ref={cancelRef} className="btn" onClick={() => onClose(null)}>Скасувати</button>
          <button className="btn pri" disabled={!sel || sel === current} onClick={() => sel && onClose(sel)}>Застосувати</button>
        </div>
      </div>
    </div>
  );
}
