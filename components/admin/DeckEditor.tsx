"use client";

import { useState } from "react";
import Link from "next/link";
import { DeckPages } from "@/components/deck/DeckPages";
import { PAGE_TYPE_LABELS, blankPage, newId, type Deck, type DeckPage, type DeckPageType } from "@/lib/decks/types";

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
  @media print{ #deck-ui{ background:#fff; padding:0; } #deck-ui .bar, #deck-ui .ctl{ display:none !important; } #deck-ui .pages{ padding:0; } }
`;

export function DeckEditor({ initial, dbReady, only, bare }: { initial: Deck; dbReady: boolean; only?: number; bare?: boolean }) {
  const [deck, setDeck] = useState<Deck>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [addType, setAddType] = useState<DeckPageType>("bullets");

  function update(fn: (d: Deck) => Deck) {
    setDeck((d) => fn(d));
    setStatus("dirty");
  }
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
  const addPage = () => update((d) => ({ ...d, pages: [...d.pages, blankPage(addType)] }));

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }
  async function reset() {
    if (!confirm("Скинути до початкової версії? Усі правки буде втрачено.")) return;
    const res = await fetch(`/api/admin/deck?slug=${deck.slug}`, { method: "DELETE" });
    if (res.ok) location.reload();
  }

  const stText: Record<Status, string> = {
    idle: "без змін",
    dirty: "є незбережені зміни",
    saving: "зберігаю…",
    saved: "збережено",
    error: "помилка збереження",
  };

  return (
    <div id="deck-ui" className={bare ? "bare" : undefined}>
      <style dangerouslySetInnerHTML={{ __html: UI_CSS }} />
      {!bare && <div className="bar">
        <span className="name">
          {deck.name} <em>· A4 · {deck.pages.length} стор.</em>
        </span>
        <span className="st">{stText[status]}</span>
        <select value={addType} onChange={(e) => setAddType(e.target.value as DeckPageType)}>
          {(Object.keys(PAGE_TYPE_LABELS) as DeckPageType[]).map((t) => (
            <option key={t} value={t}>{PAGE_TYPE_LABELS[t]}</option>
          ))}
        </select>
        <button className="btn" onClick={addPage}>+ сторінка</button>
        <button className={"btn" + (deck.caps ? " on" : "")} onClick={() => update((d) => ({ ...d, caps: !d.caps }))} title="Заголовки великими літерами">{deck.caps ? "Aa → АБВ" : "АБВ → Aa"}</button>
        <button className="btn" onClick={() => window.print()}>Завантажити PDF</button>
        <button className="btn" onClick={reset}>Скинути</button>
        <button className="btn pri" onClick={save} disabled={status === "saving"}>Зберегти</button>
        <Link href="/admin" className="btn">← Панель</Link>
        <p className="hint">
          Клікніть на будь-який текст на сторінці й редагуйте прямо там. У списках Enter додає новий пункт.
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
          renderControls={bare ? undefined : (i) => (
            <div className="ctl">
              <button title="Вгору" onClick={() => move(i, -1)}>↑</button>
              <button title="Вниз" onClick={() => move(i, 1)}>↓</button>
              <button title="Дублювати" onClick={() => duplicate(i)}>⧉</button>
              <button title="Видалити" onClick={() => remove(i)}>✕</button>
              <span className="ty">{PAGE_TYPE_LABELS[deck.pages[i].type]}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
