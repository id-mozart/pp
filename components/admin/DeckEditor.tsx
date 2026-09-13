"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DeckPages, type PickImage } from "@/components/deck/DeckPages";
import { DECK_LIBRARY } from "@/lib/decks/library";
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
  @media print{ #deck-ui{ background:#fff; padding:0; } #deck-ui .bar, #deck-ui .ctl, #deck-ui .pick-bg{ display:none !important; } #deck-ui .pages{ padding:0; } }
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
  const insertAfter = (i: number, type: DeckPageType) =>
    update((d) => { const pages = [...d.pages]; pages.splice(i + 1, 0, blankPage(type)); return { ...d, pages }; });
  const bumpFs = (i: number, dir: -1 | 1) =>
    update((d) => ({ ...d, pages: d.pages.map((p, k) => {
      if (k !== i) return p;
      const cur = p.fs ?? 1;
      const next = Math.round(Math.min(1.6, Math.max(0.6, cur + dir * 0.1)) * 100) / 100;
      const { fs: _drop, ...rest } = p;
      return (Math.abs(next - 1) < 0.001 ? rest : { ...rest, fs: next }) as DeckPage;
    }) }));
  const bumpDeckFs = (dir: -1 | 1) =>
    update((d) => { const next = Math.round(Math.min(1.3, Math.max(0.7, (d.fs ?? 1) + dir * 0.05)) * 100) / 100; return { ...d, fs: next }; });

  /* ── вибір/завантаження зображення ── */
  const [picker, setPicker] = useState<{ current?: string; optional: boolean; resolve: (v: string | null) => void } | null>(null);
  const pickImage: PickImage = (current, optional) => new Promise((resolve) => setPicker({ current, optional, resolve }));
  const closePicker = (v: string | null) => { picker?.resolve(v); setPicker(null); };

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
        <button className="btn" onClick={() => bumpDeckFs(-1)} title="Кегль усієї деки менше">A−</button>
        <span className="st" title="Множник кегля деки">×{(deck.fs ?? 1).toFixed(2)}</span>
        <button className="btn" onClick={() => bumpDeckFs(1)} title="Кегль усієї деки більше">A+</button>
        <button className="btn" onClick={() => window.print()}>Завантажити PDF</button>
        <button className="btn" onClick={reset}>Скинути</button>
        <button className="btn pri" onClick={save} disabled={status === "saving"}>Зберегти</button>
        <Link href="/admin" className="btn">← Панель</Link>
        <p className="hint">
          Клікніть на будь-який текст на сторінці й редагуйте прямо там. У списках Enter додає новий пункт. Наведіть на сторінку — біля ілюстрацій зʼявиться «Замінити»; кнопки A−/A+ біля сторінки змінюють її кегль, ＋ вставляє нову сторінку одразу після неї.
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
              <button title="Вгору" onClick={() => move(i, -1)}>↑</button>
              <button title="Вниз" onClick={() => move(i, 1)}>↓</button>
              <button title="Дублювати" onClick={() => duplicate(i)}>⧉</button>
              <span className="ins">
                <button type="button" aria-hidden tabIndex={-1}>＋</button>
                <select aria-label="Тип нової сторінки" value="" onChange={(e) => { if (e.target.value) insertAfter(i, e.target.value as DeckPageType); e.target.value = ""; }}>
                  <option value="">Вставити після…</option>
                  {(Object.keys(PAGE_TYPE_LABELS) as DeckPageType[]).map((t) => (<option key={t} value={t}>{PAGE_TYPE_LABELS[t]}</option>))}
                </select>
              </span>
              <button title="Видалити" onClick={() => remove(i)}>✕</button>
              <button title="Кегль сторінки менше" onClick={() => bumpFs(i, -1)}>A−</button>
              <span className="fs">{deck.pages[i].fs ? `×${deck.pages[i].fs!.toFixed(1)}` : "×1"}</span>
              <button title="Кегль сторінки більше" onClick={() => bumpFs(i, 1)}>A+</button>
              {deck.pages[i].type === "bullets" && (
                <button title="Вигляд списку: список → картки → репліки" onClick={() => {
                  const cur = (deck.pages[i] as any).variant ?? "list";
                  const next = cur === "list" ? "cards" : cur === "cards" ? "bubbles" : "list";
                  patchPage(i, { variant: next === "list" ? undefined : next });
                }}>◫</button>
              )}
              <span className="ty">{PAGE_TYPE_LABELS[deck.pages[i].type]}</span>
            </div>
          )}
        />
      </div>
      {picker && <ImagePicker current={picker.current} optional={picker.optional} onClose={closePicker} />}
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
