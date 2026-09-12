"use client";

import { useState } from "react";
import Link from "next/link";
import { Certificate } from "@/components/cert/Certificate";
import { CERT_DEFAULT, nextNumber, type Cert } from "@/lib/certs";

type Saved = Cert & { id: string; updated_at?: string };
type Status = "idle" | "dirty" | "saving" | "saved" | "error";

const CSS = `
  body:has(#cert-ui) header, body:has(#cert-ui) footer, body:has(#cert-ui) main ~ div,
  body:has(#cert-ui) [class*="fixed"], body:has(#cert-ui) [class*="cookie"]{ display:none !important; }
  body:has(#cert-ui){ background:#E9E2D5 !important; }
  #cert-ui{ min-height:100vh; background:#E9E2D5; padding-bottom:60px; }
  #cert-ui .bar{ position:sticky; top:0; z-index:40; display:flex; flex-wrap:wrap; align-items:center; gap:10px; padding:12px 24px;
    background:rgba(42,32,24,.96); color:#F5E9D7; box-shadow:0 8px 30px rgba(0,0,0,.25); }
  #cert-ui .bar .name{ font-family:var(--font-playfair),Georgia,serif; font-size:18px; margin-right:auto; }
  #cert-ui .bar .name em{ color:#E2A638; font-style:normal; }
  #cert-ui .st{ font-family:var(--font-jetbrains),monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#B8A386; margin-right:8px; }
  #cert-ui .btn{ border:1px solid rgba(226,166,56,.45); border-radius:10px; padding:8px 14px; font-size:13px; color:#F5E9D7; background:transparent; cursor:pointer; }
  #cert-ui .btn:hover{ border-color:#E2A638; color:#E2A638; }
  #cert-ui .btn.pri{ background:linear-gradient(96deg,#E8AC3C,#CE651E); color:#241A10; border-color:transparent; font-weight:600; }
  #cert-ui .wrap{ display:grid; grid-template-columns:380px 1fr; gap:24px; padding:24px; align-items:start; }
  #cert-ui .panel{ background:#FCF8F1; border-radius:14px; padding:18px; box-shadow:0 10px 30px rgba(60,40,15,.12); }
  #cert-ui .panel h2{ font-family:var(--font-spectral),serif; font-weight:500; font-size:20px; color:#2A2018; margin:0 0 12px; }
  #cert-ui label{ display:block; font-family:var(--font-jetbrains),monospace; font-size:10px; letter-spacing:.2em; text-transform:uppercase; color:#9C8B73; margin:12px 0 5px; }
  #cert-ui input, #cert-ui textarea, #cert-ui select{ width:100%; border:1px solid rgba(140,116,82,.4); border-radius:8px; padding:9px 11px; font:inherit; font-size:14px; color:#2A2018; background:#fff; }
  #cert-ui textarea{ min-height:74px; resize:vertical; }
  #cert-ui .row{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  #cert-ui .tr{ display:grid; grid-template-columns:1fr 1fr auto; gap:8px; align-items:end; margin-top:6px; }
  #cert-ui .tr button{ height:38px; border:1px solid rgba(140,116,82,.4); border-radius:8px; background:#fff; cursor:pointer; color:#5E4C36; padding:0 10px; }
  #cert-ui .small{ font-size:12px; color:#7A6A54; margin-top:8px; line-height:1.5; }
  #cert-ui .preview{ display:flex; flex-direction:column; align-items:center; gap:18px; }
  #cert-ui .list{ margin-top:18px; }
  #cert-ui .item{ display:flex; align-items:center; gap:10px; padding:9px 0; border-top:1px solid rgba(140,116,82,.25); font-size:13px; color:#2A2018; }
  #cert-ui .item:first-child{ border-top:0; }
  #cert-ui .item .n{ font-family:var(--font-jetbrains),monospace; font-size:11px; color:#C4621F; }
  #cert-ui .item .t{ flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  #cert-ui .item .t small{ display:block; color:#7A6A54; font-size:11px; }
  #cert-ui .item button{ border:1px solid rgba(140,116,82,.4); border-radius:7px; background:#fff; cursor:pointer; font-size:12px; padding:4px 8px; color:#5E4C36; }
  #cert-ui .item button:hover{ border-color:#C4621F; color:#C4621F; }
  @media print{ #cert-ui{ background:#fff; padding:0; } #cert-ui .bar, #cert-ui .panel{ display:none !important; }
    #cert-ui .wrap{ display:block; padding:0; } #cert-ui .preview{ display:block; } }
`;

export function CertEditor({ initial, saved: savedInit, dbReady }: { initial: Cert; saved: Saved[]; dbReady: boolean }) {
  const [c, setC] = useState<Cert>(initial);
  const [saved, setSaved] = useState<Saved[]>(savedInit);
  const [status, setStatus] = useState<Status>("idle");

  const set = (patch: Partial<Cert>) => { setC((x) => ({ ...x, ...patch })); setStatus("dirty"); };
  const setTrainer = (i: number, patch: Partial<Cert["trainers"][number]>) =>
    set({ trainers: c.trainers.map((t, k) => (k === i ? { ...t, ...patch } : t)) });

  async function reload() {
    const r = await fetch("/api/admin/certs").then((x) => x.json()).catch(() => null);
    if (r?.ok) setSaved(r.items);
    return r?.items as Saved[] | undefined;
  }
  async function save() {
    setStatus("saving");
    try {
      const r = await fetch("/api/admin/certs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error();
      setC((x) => ({ ...x, id: j.id }));
      setStatus("saved");
      await reload();
    } catch { setStatus("error"); }
  }
  function fresh() {
    const n = nextNumber(saved.map((s) => s.number));
    setC({ ...CERT_DEFAULT, number: n, trainers: c.trainers.length ? c.trainers : CERT_DEFAULT.trainers, year: c.year, place: c.place });
    setStatus("idle");
  }
  function open(s: Saved) { setC({ ...s }); setStatus("idle"); }
  async function remove(s: Saved) {
    if (!confirm(`Видалити сертифікат № ${s.number} (${s.name})?`)) return;
    await fetch(`/api/admin/certs?id=${s.id}`, { method: "DELETE" });
    await reload();
    if (c.id === s.id) fresh();
  }

  const stText: Record<Status, string> = { idle: "", dirty: "не збережено", saving: "зберігаю…", saved: "збережено", error: "помилка збереження" };

  return (
    <div id="cert-ui">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="bar">
        <span className="name">Сертифікати <em>· {c.number ? `№ ${c.number}` : ""}</em></span>
        <span className="st">{stText[status]}</span>
        <button className="btn" onClick={fresh}>+ новий</button>
        <button className="btn" onClick={() => window.print()}>Завантажити PDF</button>
        <button className="btn pri" onClick={save} disabled={status === "saving"}>Зберегти</button>
        <Link href="/admin" className="btn">← Панель</Link>
      </div>
      <div className="wrap">
        <div className="panel">
          <h2>Дані сертифіката</h2>
          <div className="row">
            <div><label>Номер</label><input value={c.number} onChange={(e) => set({ number: e.target.value })} /></div>
            <div><label>Дієслово</label>
              <select value={c.verb} onChange={(e) => set({ verb: e.target.value })}>
                <option value="завершив">завершив</option>
                <option value="завершила">завершила</option>
                <option value="пройшов">пройшов</option>
                <option value="пройшла">пройшла</option>
              </select>
            </div>
          </div>
          <label>Учасник / учасниця</label>
          <input value={c.name} onChange={(e) => set({ name: e.target.value })} placeholder="Прізвище Ім'я" />
          <label>Програма</label>
          <textarea value={c.program} onChange={(e) => set({ program: e.target.value })} />
          <div className="row">
            <div><label>Місце</label><input value={c.place} onChange={(e) => set({ place: e.target.value })} /></div>
            <div><label>Рік</label><input value={c.year} onChange={(e) => set({ year: e.target.value })} /></div>
          </div>
          <div className="row">
            <div><label>Дата (необов'язково)</label><input value={c.date} onChange={(e) => set({ date: e.target.value })} placeholder="12 вересня 2026" /></div>
            <div><label>Обсяг (необов'язково)</label><input value={c.hours} onChange={(e) => set({ hours: e.target.value })} placeholder="16 годин" /></div>
          </div>
          <label>Тренери</label>
          {c.trainers.map((t, i) => (
            <div className="tr" key={i}>
              <input value={t.name} onChange={(e) => setTrainer(i, { name: e.target.value })} placeholder="Ім'я" />
              <input value={t.role} onChange={(e) => setTrainer(i, { role: e.target.value })} placeholder="роль" />
              <button onClick={() => set({ trainers: c.trainers.filter((_, k) => k !== i) })} title="Прибрати">✕</button>
            </div>
          ))}
          {c.trainers.length < 3 && (
            <button className="btn" style={{ color: "#5E4C36", marginTop: 10 }} onClick={() => set({ trainers: [...c.trainers, { name: "", role: "бізнес-тренер" }] })}>+ тренер</button>
          )}
          <p className="small">
            «Завантажити PDF» відкриває друк: оберіть «Зберегти як PDF», формат A4 альбомний, поля «немає».
            {!dbReady && " База даних не підключена — збереження не працюватиме."}
          </p>

          <div className="list">
            <h2>Збережені · {saved.length}</h2>
            {saved.length === 0 && <p className="small">Ще нічого не збережено.</p>}
            {saved.map((s) => (
              <div className="item" key={s.id}>
                <span className="n">{s.number}</span>
                <span className="t">{s.name}<small>{s.program}</small></span>
                <button onClick={() => open(s)}>Відкрити</button>
                <button onClick={() => remove(s)}>✕</button>
              </div>
            ))}
          </div>
        </div>
        <div className="preview">
          <Certificate c={c} />
        </div>
      </div>
    </div>
  );
}
