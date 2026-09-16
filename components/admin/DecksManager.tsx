"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

/** Кнопка «Нова презентація» з формою: назва + джерело (порожня або копія існуючої). */
export function NewDeckButton({ items }: { items: Item[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
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

/** Дії на картці: копіювати, перейменувати, видалити (лише для дек без шаблону в коді). */
export function DeckCardActions({ slug, name, deletable }: { slug: string; name: string; deletable: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"" | "copy" | "rename" | "delete">("");
  async function copy() {
    const n = window.prompt("Назва копії:", `${name} · копія`);
    if (n === null) return;
    setBusy("copy");
    const r = await call({ action: "copy", from: slug, name: n.trim() || `${name} · копія` });
    setBusy("");
    if (!r.ok || !r.slug) { window.alert(msg(r.error)); return; }
    router.push(`/admin/deck/${r.slug}`);
  }
  async function rename() {
    const n = window.prompt("Нова назва:", name);
    if (n === null || !n.trim() || n.trim() === name) return;
    setBusy("rename");
    const r = await call({ action: "rename", slug, name: n.trim() });
    setBusy("");
    if (!r.ok) { window.alert(msg(r.error)); return; }
    router.refresh();
  }
  async function del() {
    const c = window.prompt(`Видалити презентацію «${name}»?\nПопередня версія залишиться в історії збережень.\n\nДля підтвердження введіть її адресу: ${slug}`, "");
    if (c === null) return;
    if (c.trim() !== slug) { window.alert("Підтвердження не збіглося — нічого не видалено."); return; }
    setBusy("delete");
    const r = await call({ action: "delete", slug, confirm: c.trim() });
    setBusy("");
    if (!r.ok) { window.alert(msg(r.error)); return; }
    router.refresh();
  }
  return (
    <>
      <button type="button" className="btn" onClick={copy} disabled={!!busy}>{busy === "copy" ? "Копіюємо…" : "⧉ Копіювати"}</button>
      <button type="button" className="btn" onClick={rename} disabled={!!busy}>{busy === "rename" ? "…" : "✎ Назва"}</button>
      {deletable && <button type="button" className="btn danger" onClick={del} disabled={!!busy}>{busy === "delete" ? "…" : "✕ Видалити"}</button>}
    </>
  );
}
