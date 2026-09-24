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
  body:has(#deck-ui) header:not(.top), body:has(#deck-ui) footer, body:has(#deck-ui) main ~ div,
  body:has(#deck-ui) [class*="fixed"], body:has(#deck-ui) [class*="cookie"]{ display:none !important; }
  body:has(#deck-ui){ background:#E9E2D5 !important; }
  #deck-ui{ --bar:#FBF7F0; --edge:#E3D9C8; --ink:#2A2018; --mut:#7A6A54; --fnt:#9C8B73; --acc:#C4621F; --hov:#F1EAE0;
    background:#E9E2D5; min-height:100vh; color:var(--ink); }
  #deck-ui .top{ position:sticky; top:0; z-index:40; height:54px; display:flex; align-items:center; gap:6px; padding:0 14px 0 10px;
    background:var(--bar); border-bottom:1px solid var(--edge); box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 6px 24px rgba(60,40,15,.06); }
  #deck-ui .top .ttl{ display:flex; flex-direction:column; min-width:0; margin-right:auto; line-height:1.2; padding-left:4px; }
  #deck-ui .top .name{ font-family:var(--font-playfair),Georgia,serif; font-size:17px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #deck-ui .top .meta{ display:flex; align-items:center; gap:6px; font-family:var(--font-jetbrains),monospace; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--fnt); white-space:nowrap; margin-top:2px; }
  #deck-ui .dot{ width:6px; height:6px; border-radius:50%; background:#B8A386; flex:none; }
  #deck-ui .dot.dirty{ background:#E2A638; } #deck-ui .dot.saved{ background:#6FA85F; } #deck-ui .dot.error, #deck-ui .dot.conflict{ background:#D9534F; }
  #deck-ui .dot.saving{ background:#E2A638; animation:deck-pulse 1s infinite; } @keyframes deck-pulse{ 50%{ opacity:.3; } }
  #deck-ui .grp{ display:flex; align-items:center; gap:2px; }
  #deck-ui .sep{ width:1px; height:22px; background:var(--edge); margin:0 6px; flex:none; }
  /* кнопки панелі: іконка (ib), текстова (tb), головна (btn.pri) */
  #deck-ui .ib{ width:34px; height:34px; display:inline-flex; align-items:center; justify-content:center; border:0; border-radius:9px; background:transparent; color:var(--ink); cursor:pointer; text-decoration:none; }
  #deck-ui .tb{ height:34px; display:inline-flex; align-items:center; gap:7px; padding:0 12px; border:0; border-radius:9px; background:transparent; color:var(--ink); font:inherit; font-size:13.5px; cursor:pointer; white-space:nowrap; }
  #deck-ui .tb.sm{ height:28px; padding:0 9px; font-size:12.5px; border:1px solid var(--edge); }
  #deck-ui .ib:hover, #deck-ui .tb:hover{ background:var(--hov); }
  #deck-ui .ib:disabled, #deck-ui .tb:disabled{ opacity:.35; cursor:default; background:transparent; }
  #deck-ui .tb.busy{ color:var(--acc); }
  #deck-ui .tb .car{ display:inline-flex; opacity:.55; margin-left:-2px; }
  #deck-ui .menu.open > .ib, #deck-ui .menu.open > .tb{ background:var(--hov); }
  #deck-ui .btn{ height:34px; padding:0 14px; border:1px solid var(--edge); border-radius:9px; font:inherit; font-size:13.5px; color:var(--ink); background:#fff; cursor:pointer; white-space:nowrap; display:inline-flex; align-items:center; gap:6px; }
  #deck-ui .btn:hover{ border-color:#C9BBA3; }
  #deck-ui .btn:disabled{ opacity:.45; cursor:default; }
  #deck-ui .btn.pri{ background:linear-gradient(96deg,#E8AC3C,#CE651E); color:#241A10; border-color:transparent; font-weight:600; padding:0 18px; box-shadow:0 4px 14px rgba(206,101,30,.25); }
  #deck-ui .btn.pri:hover{ filter:brightness(1.04); }
  /* перемикач автозбереження */
  #deck-ui .sw{ display:inline-flex; align-items:center; gap:8px; font-size:13px; color:var(--mut); cursor:pointer; user-select:none; margin-right:6px; }
  #deck-ui .sw.off{ opacity:.45; cursor:default; }
  #deck-ui .sw input{ position:absolute; opacity:0; width:0; height:0; }
  #deck-ui .sw i{ width:32px; height:19px; border-radius:10px; background:#D9CDB9; position:relative; transition:background .15s; flex:none; }
  #deck-ui .sw i::after{ content:""; position:absolute; top:2px; left:2px; width:15px; height:15px; border-radius:50%; background:#fff; box-shadow:0 1px 2px rgba(0,0,0,.2); transition:transform .15s; }
  #deck-ui .sw input:checked + i{ background:#D2701C; } #deck-ui .sw input:checked + i::after{ transform:translateX(13px); }
  #deck-ui .sw input:focus-visible + i{ outline:2px solid #E2A638; outline-offset:2px; }
  #deck-ui .alert{ position:sticky; top:54px; z-index:39; display:flex; align-items:center; gap:10px; padding:8px 16px; background:#FBE9E7; border-bottom:1px solid #EFC4BF; font-size:13px; }
  #deck-ui .alert span{ margin-right:auto; }
  /* випадні меню */
  #deck-ui .menu{ position:relative; }
  #deck-ui .dd{ position:absolute; top:calc(100% + 6px); left:0; min-width:300px; background:#fff; color:var(--ink); border:1px solid var(--edge); border-radius:12px; padding:6px; box-shadow:0 18px 50px rgba(60,40,15,.18); z-index:50; }
  #deck-ui .dd.r{ left:auto; right:0; }
  #deck-ui .dd .hd{ font-family:var(--font-jetbrains),monospace; font-size:9.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--fnt); padding:8px 10px 6px; }
  #deck-ui .dd .row-fs{ display:flex; align-items:center; gap:8px; padding:2px 10px 8px; font-family:var(--font-jetbrains),monospace; font-size:12px; color:var(--acc); }
  #deck-ui .dd .row-fs span{ min-width:52px; text-align:center; }
  #deck-ui .mi{ display:flex; align-items:flex-start; gap:10px; width:100%; text-align:left; border:0; background:transparent; padding:9px 10px; border-radius:8px; font:inherit; font-size:13.5px; color:var(--ink); cursor:pointer; line-height:1.3; }
  #deck-ui .mi:hover{ background:var(--hov); } #deck-ui .mi:disabled{ opacity:.5; cursor:default; }
  #deck-ui .mi .lb{ flex:1; } #deck-ui .mi small{ display:block; font-size:11.5px; color:var(--mut); margin-top:2px; }
  #deck-ui .mi .ck{ width:16px; height:16px; margin-top:1px; border:1.5px solid #B8A386; border-radius:4px; display:inline-flex; align-items:center; justify-content:center; font-size:11px; flex:none; }
  #deck-ui .mi[aria-checked="true"] .ck{ background:var(--acc); border-color:var(--acc); color:#fff; }
  #deck-ui .help .dd{ min-width:420px; padding:10px 14px 12px; font-size:13px; line-height:1.5; }
  #deck-ui .help .dd .hd{ padding-left:0; }
  #deck-ui .help .dd p{ margin:0 0 8px; } #deck-ui .help .dd p:last-child{ margin:0; }
  #deck-ui .help kbd{ font-family:var(--font-jetbrains),monospace; font-size:11px; background:#F4ECDC; border:1px solid #D9CDB9; border-radius:4px; padding:1px 5px; }
  #deck-ui select{ border:1px solid var(--edge); border-radius:10px; padding:8px 10px; font-size:13px; color:var(--ink); background:#fff; }
  /* робоча область: навігатор зліва + сторінки */
  #deck-ui .work{ display:flex; align-items:flex-start; }
  #deck-ui .rail{ position:sticky; top:54px; flex:none; width:210px; height:calc(100vh - 54px); display:flex; flex-direction:column; background:var(--bar); border-right:1px solid var(--edge); }
  #deck-ui .rail-h{ padding:14px 16px 8px; font-family:var(--font-jetbrains),monospace; font-size:9.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--fnt); }
  #deck-ui .rail-h b{ font-weight:500; color:var(--mut); margin-left:4px; }
  #deck-ui .rail-list{ flex:1; overflow:auto; padding:0 8px 8px; }
  #deck-ui .pg{ display:flex; gap:10px; align-items:flex-start; width:100%; text-align:left; border:0; background:transparent; border-radius:9px; padding:7px 8px; cursor:pointer; color:var(--ink); font:inherit; }
  #deck-ui .pg:hover{ background:var(--hov); }
  #deck-ui .pg.on{ background:#fff; box-shadow:0 1px 0 rgba(255,255,255,.8) inset, 0 4px 14px rgba(60,40,15,.08); }
  #deck-ui .pg .pn{ font-family:var(--font-jetbrains),monospace; font-size:10px; color:var(--fnt); padding-top:3px; flex:none; width:18px; }
  #deck-ui .pg.on .pn{ color:var(--acc); }
  #deck-ui .pg .pt{ min-width:0; display:flex; flex-direction:column; gap:1px; }
  #deck-ui .pg .pt b{ font-weight:500; font-size:12.5px; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  #deck-ui .pg .pt small{ font-size:10.5px; color:var(--fnt); }
  #deck-ui .rail-add{ margin:8px; height:36px; display:flex; align-items:center; justify-content:center; gap:6px; border:1px dashed #C9BBA3; border-radius:9px; background:transparent; color:var(--mut); font:inherit; font-size:13px; cursor:pointer; }
  #deck-ui .rail-add:hover{ border-color:var(--acc); color:var(--acc); background:#fff; }
  #deck-ui .pages{ flex:1; min-width:0; padding:28px 70px 80px 24px; overflow-x:auto; }
  #deck-ui .pages .sheet{ scroll-margin-top:78px; }
  /* дії сторінки: одна вертикальна панель праворуч від аркуша, помітніша при наведенні */
  #deck-ui .ctl{ position:absolute; left:calc(100% + 12px); top:0; z-index:5; display:flex; flex-direction:column; align-items:center; gap:1px; padding:6px 4px; width:40px;
    background:#fff; border:1px solid var(--edge); border-radius:11px; box-shadow:0 6px 20px rgba(60,40,15,.08); opacity:.55; transition:opacity .15s; }
  #deck-ui .pages > #deck-a4 > div:hover > .ctl, #deck-ui .ctl:focus-within{ opacity:1; }
  #deck-ui .ctl button{ width:30px; height:30px; border-radius:7px; border:0; background:transparent; color:var(--ink); cursor:pointer; display:inline-flex; align-items:center; justify-content:center; font:inherit; font-size:11.5px; }
  #deck-ui .ctl button:hover{ background:var(--hov); color:var(--acc); }
  #deck-ui .ctl button:disabled{ opacity:.3; cursor:default; background:transparent; color:var(--ink); }
  #deck-ui .ctl button.del:hover{ background:#FBE9E7; color:#C0392B; }
  #deck-ui .ctl .dv{ width:20px; height:1px; background:var(--edge); margin:3px 0; }
  #deck-ui .ctl .ty{ font-family:var(--font-jetbrains),monospace; font-size:8px; letter-spacing:.1em; text-transform:uppercase; color:var(--fnt); writing-mode:vertical-rl; transform:rotate(180deg); margin:2px 0 6px; max-height:96px; overflow:hidden; }
  #deck-ui .ctl .fs{ font-family:var(--font-jetbrains),monospace; font-size:9px; color:var(--acc); text-align:center; }
  #deck-ui.bare{ padding:0; background:#fff; } #deck-ui.bare .pages{ padding:0; overflow:visible; }
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
  @media print{ #deck-ui{ background:#fff; padding:0; } #deck-ui .top, #deck-ui .rail, #deck-ui .alert, #deck-ui .ctl, #deck-ui .pick-bg, #deck-ui .present{ display:none !important; } #deck-ui .pages{ padding:0; overflow:visible; } }
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
  // PPTX: нативні слайди; схеми знімаємо з екрана (html-to-image) з DOM редактора
  const [pptxBusy, setPptxBusy] = useState("");
  // поточна сторінка (для навігатора зліва): та, що найбільше у вікні
  const [cur, setCur] = useState(0);
  useEffect(() => {
    if (bare) return;
    const sheets = Array.from(document.querySelectorAll<HTMLElement>("#deck-ui .pages .sheet"));
    if (!sheets.length) return;
    const ratio = new Map<Element, number>();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => ratio.set(e.target, e.intersectionRatio));
      let best = 0, bi = 0; sheets.forEach((el, i) => { const r = ratio.get(el) ?? 0; if (r > best) { best = r; bi = i; } });
      setCur(bi);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    sheets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [deck.pages.length, bare]);
  // навігатор прокручується до поточної сторінки
  useEffect(() => { document.querySelector<HTMLElement>("#deck-ui .rail .pg.on")?.scrollIntoView({ block: "nearest" }); }, [cur]);
  const goPage = useCallback((i: number) => { document.querySelectorAll<HTMLElement>("#deck-ui .pages .sheet")[i]?.scrollIntoView({ behavior: "smooth", block: "start" }); }, []);
  const exportPptx = useCallback(async () => {
    if (pptxBusy) return;
    setPptxBusy("готую…");
    try {
      const [{ exportDeckPptx }, { toPng, getFontEmbedCSS }] = await Promise.all([import("@/lib/decks/pptx"), import("html-to-image")]);
      const withTimeout = <T,>(pr: Promise<T>, ms: number): Promise<T | null> => Promise.race([pr, new Promise<null>((r) => setTimeout(() => r(null), ms))]);
      // на свіжозавантаженій сторінці ще довантажуються ілюстрації і шрифти — перший знімок інакше не встигає
      await withTimeout((document as any).fonts?.ready ?? Promise.resolve(), 5000);
      await withTimeout(Promise.all(Array.from(document.images).filter((im) => !im.complete).map((im) => new Promise<void>((r) => { im.onload = im.onerror = () => r(); }))), 10000);
      // шрифти для знімків: збираємо один раз (з таймаутом); якщо не вдалось — знімаємо без вбудованих шрифтів
      const firstDg = document.querySelector<HTMLElement>("#deck-ui .pages .sheet .dg");
      const fontEmbedCSS = firstDg ? (await withTimeout(getFontEmbedCSS(firstDg).catch((e) => { console.warn("[pptx] fonts", e); return null; }), 8000)) ?? undefined : undefined;
      const snap = async (i: number, sel: string) => {
        const sheet = document.querySelectorAll<HTMLElement>("#deck-ui .pages .sheet")[i];
        const el = sheet?.querySelector<HTMLElement>(sel);
        if (!el) return null;
        const filter = (n: HTMLElement) => !(n instanceof HTMLElement && n.classList.contains("imgbtn"));
        const attempt = (o: object, ms: number) => withTimeout(toPng(el, { pixelRatio: 2, backgroundColor: "#FCF8F1", filter, ...o } as any).catch((e) => { console.warn("[pptx] snap", i, e); return null; }), ms);
        // друга спроба — без вбудованих шрифтів: краще схема системним шрифтом, ніж список замість схеми
        const data = (await attempt(fontEmbedCSS ? { fontEmbedCSS } : { skipFonts: true }, 30000)) ?? (await attempt({ skipFonts: true }, 20000));
        if (!data) console.warn("[pptx] snap failed", i, sel);
        return data ? { data, w: el.offsetWidth, h: el.offsetHeight } : null;
      };
      // html-to-image чекає requestAnimationFrame після декодування картинки, а у прихованій вкладці він не настає —
      // експорт «зависав би», якщо користувач перемкнеться на іншу вкладку. У прихованому стані підміняємо таймером.
      const rafOrig = window.requestAnimationFrame;
      window.requestAnimationFrame = (cb: FrameRequestCallback) => (document.hidden ? (window.setTimeout(() => cb(performance.now()), 16) as unknown as number) : rafOrig.call(window, cb));
      try {
        // масштаб кегля кожної сторінки — той, що підібрав сайт (--k на аркуші)
        const scale = (i: number) => { const v = parseFloat(document.querySelectorAll<HTMLElement>("#deck-ui .pages .sheet")[i]?.style.getPropertyValue("--k") || ""); return Number.isFinite(v) ? v : undefined; };
        await exportDeckPptx(deck, { snap, scale, onProgress: (i, n) => setPptxBusy(`${i} / ${n}`) });
      } finally { window.requestAnimationFrame = rafOrig; }
    } catch (e) {
      console.error(e);
      alert("Не вдалося зібрати PPTX. Спробуйте ще раз.");
    } finally { setPptxBusy(""); }
  }, [deck, pptxBusy]);
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
      {!bare && <header className="top">
        <Link href="/admin/decks" className="ib" title="До списку презентацій" onClick={(e) => { if (status !== "idle" && status !== "saved" && !confirm("Є незбережені правки. Вийти без збереження?")) e.preventDefault(); }}><Ic d={IC.back} /></Link>
        <div className="ttl">
          <span className="name" title={deck.name}>{deck.name}</span>
          <span className="meta"><i className={"dot " + status} />{stText[status]}{status === "error" && errText ? `: ${errText}` : ""}{!dbReady && " · база не підключена"}</span>
        </div>
        <div className="grp">
          <button className="ib" onClick={undo} disabled={!hist.undo} title={"Скасувати (⌘Z)" + (hist.undo ? ` · ${hist.undo}` : "")}><Ic d={IC.undo} /></button>
          <button className="ib" onClick={redo} disabled={!hist.redo} title={"Повторити (⌘⇧Z)" + (hist.redo ? ` · ${hist.redo}` : "")}><Ic d={IC.redo} /></button>
        </div>
        <span className="sep" />
        <button className="tb" onClick={() => startPresent(cur)} title="Повноекранний показ з поточної сторінки: Space / → далі, ← назад, Esc вихід"><Ic d={IC.play} fill /> Показ</button>
        <Menu label="Вигляд" icon={IC.sliders}>
          <div className="hd">Кегль деки</div>
          <div className="row-fs">
            <button type="button" className="tb sm" onClick={() => bumpDeckFs(-1)} title="Менше">A−</button>
            <span>×{(deck.fs ?? 1).toFixed(2)}</span>
            <button type="button" className="tb sm" onClick={() => bumpDeckFs(1)} title="Більше">A+</button>
          </div>
          <div className="hd">Оформлення</div>
          <MenuCheck on={!!deck.caps} onClick={() => update((d) => ({ ...d, caps: !d.caps }))} hint="АБВ замість Абв у всіх заголовках">Заголовки великими літерами</MenuCheck>
          <MenuCheck on={!!deck.tight} onClick={() => update((d) => ({ ...d, tight: !d.tight }))} hint="Менші відступи в таблицях і картках — текст на щільних сторінках більший">Щільна верстка</MenuCheck>
          <MenuCheck on={deck.notes !== false} onClick={() => update((d) => ({ ...d, notes: d.notes === false ? true : false }))} hint="Поле для нотаток на розріджених сторінках (для роздрукованої версії)">Поле «Нотатки»</MenuCheck>
          <MenuCheck on={!!deck.footRunhead} onClick={() => update((d) => ({ ...d, footRunhead: !d.footRunhead }))} hint="Назва деки внизу сторінки, зверху лише логотип; номер без «/ 22»">Назва деки в нижньому колонтитулі</MenuCheck>
        </Menu>
        <Menu label={pptxBusy ? `PPTX ${pptxBusy}` : "Експорт"} icon={IC.download} busy={!!pptxBusy}>
          <MenuItem onClick={printPdf} hint="Відкриється друк: оберіть «Зберегти як PDF», формат A4, поля «немає»">PDF</MenuItem>
          <MenuItem onClick={exportPptx} disabled={!!pptxBusy} hint="Слайди A4 з редагованим текстом і картинками; схеми — як зображення">{pptxBusy ? `PowerPoint · ${pptxBusy}` : "PowerPoint (PPTX)"}</MenuItem>
        </Menu>
        <Menu label="" icon={IC.help} cls="help" right title="Підказки">
          <div className="hd">Як працювати</div>
          <p>Клікніть на будь-який текст на сторінці й редагуйте прямо там. У списках <kbd>Enter</kbd> додає новий пункт.</p>
          <p>Наведіть на сторінку — праворуч зʼявляться дії сторінки: показ звідси, порядок, дублювати, вставити після, інша композиція зі збереженням текстів, варіант оформлення, кегль сторінки, видалити. Біля ілюстрацій — «Замінити».</p>
          <p><kbd>⌘Z</kbd> скасувати, <kbd>⌘⇧Z</kbd> повторити. У показі: <kbd>Space</kbd> / <kbd>→</kbd> далі, <kbd>←</kbd> назад, <kbd>Esc</kbd> вихід.</p>
          <p>«Автозбереження» пише в базу через 1,5 с після кожної дії; попередні версії лишаються в історії.</p>
        </Menu>
        <span className="sep" />
        <label className={"sw" + (!dbReady || baseAt === null ? " off" : "")} title={!dbReady || baseAt === null ? "Спочатку збережіть деку вручну" : "Зберігати автоматично через 1,5 с після кожної дії"}>
          <input type="checkbox" checked={autosave} onChange={toggleAutosave} disabled={!dbReady || baseAt === null} />
          <i /><span>Автозбереження</span>
        </label>
        <button className="btn pri" onClick={() => save()} disabled={saving}>{saving ? "Зберігаю…" : "Зберегти"}</button>
      </header>}
      {!bare && status === "conflict" && (
        <div className="alert">
          <span>Цю деку змінено в іншому вікні.</span>
          <button className="tb" onClick={() => { if (confirm("Взяти версію з бази? Ваші незбережені правки буде втрачено.")) { skipGuardRef.current = true; location.reload(); } }}>Оновити сторінку</button>
          <button className="btn pri" onClick={() => { const at = conflictAtRef.current ? new Date(conflictAtRef.current).toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" }) : "невідомий час"; if (confirm(`У базі є версія від ${at}. Записати вашу поверх неї? Попередня версія лишиться в історії.`)) save({ force: true }); }}>Зберегти поверх</button>
        </div>
      )}
      <div className="work">
      {!bare && <aside className="rail" aria-label="Сторінки">
        <div className="rail-h">Сторінки <b>{deck.pages.length}</b></div>
        <div className="rail-list">
          {deck.pages.map((pg, i) => (
            <button key={pg.id} type="button" className={"pg" + (cur === i ? " on" : "")} onClick={() => goPage(i)} title={PAGE_TYPE_LABELS[pg.type]}>
              <span className="pn">{String(i + 1).padStart(2, "0")}</span>
              <span className="pt"><b>{pageTitle(pg)}</b><small>{PAGE_TYPE_LABELS[pg.type]}</small></span>
            </button>
          ))}
        </div>
        <button type="button" className="rail-add" onClick={() => setTplMode({ mode: "append" })}><Ic d={IC.plus} /> Сторінка</button>
      </aside>}
      <div className="pages">
        <DeckPages
          deck={deck}
          only={only}
          editable={!bare}
          onPatch={patchPage}
          onRunhead={(v) => update((d) => ({ ...d, runhead: v }))}
          pickImage={bare ? undefined : pickImage}
          renderControls={bare ? undefined : (i) => (
            <div className="ctl" role="toolbar" aria-label={`Сторінка ${i + 1}`}>
              <span className="ty">{PAGE_TYPE_LABELS[deck.pages[i].type]}</span>
              <button title="Показ з цієї сторінки" onClick={() => startPresent(i)}><Ic d={IC.play} fill /></button>
              <i className="dv" />
              <button title="Вгору" onClick={() => move(i, -1)} disabled={i === 0}><Ic d={IC.up} /></button>
              <button title="Вниз" onClick={() => move(i, 1)} disabled={i === deck.pages.length - 1}><Ic d={IC.down} /></button>
              <i className="dv" />
              <button title="Дублювати" onClick={() => duplicate(i)}><Ic d={IC.copy} /></button>
              <button title="Вставити сторінку після цієї (вибір композиції)" onClick={() => setTplMode({ mode: "insert", i })}><Ic d={IC.plus} /></button>
              <button title="Змінити композицію цієї сторінки (тексти перенесуться)" onClick={() => setTplMode({ mode: "replace", i })}><Ic d={IC.layout} /></button>
              {deck.pages[i].type === "cover" && (
                <button title="Титул: звичайний → амперсанд → фото праворуч" onClick={() => { const c = (deck.pages[i] as any).variant; patchPage(i, { variant: c === "amp" ? "photo" : c === "photo" ? undefined : "amp" }); }}><Ic d={IC.variant} /></button>
              )}
              {deck.pages[i].type === "bullets" && (
                <button title="Вигляд списку: список → картки → репліки" onClick={() => {
                  const c = (deck.pages[i] as any).variant ?? "list";
                  patchPage(i, { variant: c === "list" ? "cards" : c === "cards" ? "bubbles" : "list" }); // явне "list" зберігається як вибір користувача
                }}><Ic d={IC.variant} /></button>
              )}
              <i className="dv" />
              <button title="Кегль сторінки менше" onClick={() => bumpFs(i, -1)} className="tx">A−</button>
              <span className="fs">{deck.pages[i].fs ? `×${deck.pages[i].fs!.toFixed(1)}` : "×1"}</span>
              <button title="Кегль сторінки більше" onClick={() => bumpFs(i, 1)} className="tx">A+</button>
              <i className="dv" />
              <button title="Видалити сторінку" onClick={() => remove(i)} className="del"><Ic d={IC.trash} /></button>
            </div>
          )}
        />
      </div>
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

/* ───────── іконки панелі (інлайн-SVG, 24×24) ───────── */

const IC = {
  back: "M15 18l-6-6 6-6",
  undo: "M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  redo: "M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3",
  play: "M7 4l13 8-13 8z",
  download: "M12 3v12M7 10l5 5 5-5M4 20h16",
  sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
  help: "M12 17h.01M9.4 9.4a2.6 2.6 0 1 1 3.7 2.4c-.7.4-1.1 1-1.1 1.7",
  plus: "M12 5v14M5 12h14",
  up: "M12 19V5M5 12l7-7 7 7",
  down: "M12 5v14M5 12l7 7 7-7",
  copy: "M9 9h11v11H9zM15 9V4H4v11h5",
  layout: "M4 4h16v16H4zM4 11h16M11 11v9",
  variant: "M4 4h16v16H4zM12 4v16",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  chevron: "M6 9l6 6 6-6",
};
function Ic({ d, fill, size = 16 }: { d: string; fill?: boolean; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth={fill ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
}
/** Підпис сторінки для навігатора: заголовок, або номер розділу, або тип. */
function pageTitle(p: DeckPage): string {
  const t = [("title" in p ? p.title : ""), ("titleEm" in p ? (p as any).titleEm : "")].filter(Boolean).join(" ").trim();
  if (t) return t;
  if (p.type === "section" && p.num) return `Розділ ${p.num}`;
  if (p.type === "text" && p.callout) return p.callout;
  if (p.type === "bullets" && p.items[0]) return p.items[0];
  if (p.type === "diagram" && p.labels[0]) return p.labels[0];
  return PAGE_TYPE_LABELS[p.type];
}

/* ───────── випадні меню панелі ───────── */

function Menu({ label, children, cls, right, title, busy, icon }: { label: string; children: React.ReactNode; cls?: string; right?: boolean; title?: string; busy?: boolean; icon?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); window.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className={"menu" + (open ? " open" : "") + (cls ? " " + cls : "")} ref={ref}>
      <button type="button" className={(cls === "help" ? "ib" : "tb") + (busy ? " busy" : "")} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} title={title}>
        {icon && <Ic d={icon} />}{label}{cls !== "help" && <span className="car"><Ic d={IC.chevron} size={12} /></span>}
      </button>
      {open && <div className={"dd" + (right ? " r" : "")} role="menu" onClick={(e) => { if ((e.target as HTMLElement).closest("[data-close]")) setOpen(false); }}>{children}</div>}
    </div>
  );
}
function MenuItem({ children, hint, onClick, disabled }: { children: React.ReactNode; hint?: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" role="menuitem" className="mi" onClick={onClick} disabled={disabled} data-close><span className="lb">{children}{hint && <small>{hint}</small>}</span></button>;
}
function MenuCheck({ children, hint, on, onClick }: { children: React.ReactNode; hint?: string; on: boolean; onClick: () => void }) {
  return <button type="button" role="menuitemcheckbox" aria-checked={on} className="mi" onClick={onClick}><span className="ck">{on ? "✓" : ""}</span><span className="lb">{children}{hint && <small>{hint}</small>}</span></button>;
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
