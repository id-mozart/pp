"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Item = { slug: string; name: string };

async function call(body: Record<string, unknown>): Promise<{ ok: boolean; slug?: string; error?: string }> {
  try {
    const r = await fetch("/api/admin/decks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    return { ok: r.ok && j?.ok === true, slug: j?.slug, error: j?.error || (r.ok ? undefined : String(r.status)) };
  } catch (e: any) {
    return { ok: false, error: e?.message || "network" };
  }
}

const ERR: Record<string, string> = {
  db: "База даних не відповіла. Нічого не змінено — спробуйте ще раз.",
  no_db: "База даних не налаштована.",
  not_found: "Джерело не знайдено.",
  protected: "Стандартні презентації не видаляються.",
  busy: "Одночасно щось змінювали — спробуйте ще раз.",
  confirm: "Підтвердження не збіглося.",
  invalid: "Некоректні дані.",
  "401": "Сесія завершилась — увійдіть знову.",
};
const msg = (e?: string) => ERR[e || ""] || `Не вдалося (${e || "помилка"}).`;

/** Esc закриває вікно (поки не триває запит). */
function useEsc(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [active, onClose]);
}

/** Кнопка «Нова презентація» з формою: назва + джерело (порожня або копія існуючої). */
export function NewDeckButton({ items }: { items: Item[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEsc(open, () => { if (!busy) setOpen(false); });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setErr("");
    const r = await call({ action: "create", name: name.trim() || "Нова презентація", from: from || undefined });
    setBusy(false);
    if (!r.ok || !r.slug) { setErr(msg(r.error)); return; }
    setOpen(false);
    router.push(`/admin/deck/${r.slug}`);
  }
  return (
    <>
      <button type="button" className="btn pri" onClick={() => { setOpen(true); setErr(""); }}>＋ Нова презентація</button>
      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="nd-title" onClick={(e) => { if (e.target === e.currentTarget && !busy) setOpen(false); }}>
          <form className="dlg" onSubmit={submit}>
            <h2 id="nd-title">Нова презентація</h2>
            <label>Назва
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Напр. Клієнт · Назва тренінгу" maxLength={200} />
            </label>
            <label>Джерело
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                <option value="">Порожня (титул + контакти)</option>
                {items.map((d) => <option key={d.slug} value={d.slug}>Копія: {d.name}</option>)}
              </select>
            </label>
            {err && <p className="err" role="alert">{err}</p>}
            <div className="row">
              <button type="submit" className="btn pri" disabled={busy}>{busy ? "Створюємо…" : "Створити й відкрити"}</button>
              <button type="button" className="btn" onClick={() => setOpen(false)} disabled={busy}>Скасувати</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

type Dlg = "" | "copy" | "rename" | "delete";

/** Дії на картці: копіювати, перейменувати, видалити (лише для дек без шаблону в коді). */
export function DeckCardActions({ slug, name, deletable }: { slug: string; name: string; deletable: boolean }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [dlg, setDlg] = useState<Dlg>("");
  const [val, setVal] = useState("");
  const [busy, setBusy] = useState<"" | "copy" | "rename" | "delete">("");
  const [err, setErr] = useState("");
  const wrap = useRef<HTMLDivElement>(null);

  useEsc(menu, () => setMenu(false));
  useEsc(!!dlg, () => { if (!busy) setDlg(""); });
  useEffect(() => {
    if (!menu) return;
    const h = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menu]);

  function openDlg(kind: Exclude<Dlg, "">) {
    setMenu(false); setErr("");
    setVal(kind === "copy" ? `${name} · копія` : kind === "rename" ? name : "");
    setDlg(kind);
  }

  async function copy() {
    const n = val;
    setBusy("copy"); setErr("");
    const r = await call({ action: "copy", from: slug, name: n.trim() || `${name} · копія` });
    setBusy("");
    if (!r.ok || !r.slug) { setErr(msg(r.error)); return; }
    setDlg("");
    router.push(`/admin/deck/${r.slug}`);
  }
  async function rename() {
    const n = val;
    if (!n.trim() || n.trim() === name) { setDlg(""); return; }
    setBusy("rename"); setErr("");
    const r = await call({ action: "rename", slug, name: n.trim() });
    setBusy("");
    if (!r.ok) { setErr(msg(r.error)); return; }
    setDlg("");
    router.refresh();
  }
  async function del() {
    const c = val;
    if (c.trim() !== slug) { setErr("Підтвердження не збіглося — нічого не видалено."); return; }
    setBusy("delete"); setErr("");
    const r = await call({ action: "delete", slug, confirm: c.trim() });
    setBusy("");
    if (!r.ok) { setErr(msg(r.error)); return; }
    setDlg("");
    router.refresh();
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (dlg === "copy") void copy();
    else if (dlg === "rename") void rename();
    else if (dlg === "delete") void del();
  }

  const titles: Record<Exclude<Dlg, "">, string> = {
    copy: "Копія презентації",
    rename: "Перейменувати презентацію",
    delete: "Видалити презентацію",
  };

  return (
    <div className="menuwrap more" ref={wrap}>
      <button
        type="button"
        className="btn sm iconbtn"
        aria-haspopup="menu"
        aria-expanded={menu}
        aria-label="Інші дії"
        title="Інші дії"
        disabled={!!busy}
        onClick={() => setMenu((v) => !v)}
      >
        {busy ? "…" : "⋯"}
      </button>
      {menu && (
        <div className="menu" role="menu">
          <button type="button" role="menuitem" onClick={() => openDlg("copy")}><span className="ic">⧉</span>Копіювати</button>
          <button type="button" role="menuitem" onClick={() => openDlg("rename")}><span className="ic">✎</span>Перейменувати</button>
          {deletable && <>
            <div className="sep" />
            <button type="button" role="menuitem" className="danger" onClick={() => openDlg("delete")}><span className="ic">✕</span>Видалити</button>
          </>}
        </div>
      )}
      {dlg && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={titles[dlg]} onClick={(e) => { if (e.target === e.currentTarget && !busy) setDlg(""); }}>
          <form className="dlg" onSubmit={submit}>
            <h2>{titles[dlg]}</h2>
            {dlg === "delete" ? (
              <>
                <p className="hint">
                  Презентацію «{name}» буде прибрано зі списку. Попередня версія залишиться в історії збережень.
                  Для підтвердження введіть її адресу: <code>{slug}</code>
                </p>
                <label>Адреса презентації
                  <input autoFocus value={val} onChange={(e) => { setVal(e.target.value); setErr(""); }} placeholder={slug} spellCheck={false} />
                </label>
              </>
            ) : (
              <label>{dlg === "copy" ? "Назва копії" : "Нова назва"}
                <input autoFocus value={val} onChange={(e) => { setVal(e.target.value); setErr(""); }} maxLength={200} />
              </label>
            )}
            {err && <p className="err" role="alert">{err}</p>}
            <div className="row">
              <button type="submit" className={dlg === "delete" ? "btn danger" : "btn pri"} disabled={!!busy || (dlg === "delete" && val.trim() !== slug)}>
                {busy ? "Виконуємо…" : dlg === "copy" ? "Створити копію" : dlg === "rename" ? "Зберегти назву" : "Видалити"}
              </button>
              <button type="button" className="btn" onClick={() => setDlg("")} disabled={!!busy}>Скасувати</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
