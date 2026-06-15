"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MAIN_CONTENT_DEFAULTS,
  type MainContent,
} from "@/lib/mainContent";

type Status = "idle" | "saving" | "saved" | "error";

export function ContentEditor({
  initial,
  dbReady,
}: {
  initial: MainContent;
  dbReady: boolean;
}) {
  const [data, setData] = useState<MainContent>(initial);
  const [status, setStatus] = useState<Status>("idle");

  function set<K extends keyof MainContent>(section: K, patch: Partial<MainContent[K]>) {
    setData((d) => ({ ...d, [section]: { ...d[section], ...patch } }));
    setStatus("idle");
  }
  function setFaq(faq: MainContent["faq"]) {
    setData((d) => ({ ...d, faq }));
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div id="pp-admin" className="min-h-screen bg-[#0B0A09] px-6 py-10 text-ink sm:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display text-2xl text-ink">Контент · версія M</h1>
          <Link href="/admin" className="rounded-[10px] border border-line/60 px-4 py-2 text-sm text-muted hover:border-gold/50 hover:text-gold">
            ← Панель
          </Link>
        </div>

        {!dbReady && (
          <div className="mt-6 rounded-xl border border-line/60 bg-[#131210] p-4 text-sm leading-relaxed text-muted">
            База даних не підключена — зміни нема де зберігати. Додайте Postgres
            у Railway, тоді кнопка «Зберегти» запрацює.
          </div>
        )}

        {/* HERO */}
        <Section title="Перший екран (hero)">
          <Field label="Надзаголовок" value={data.hero.eyebrow} onChange={(v) => set("hero", { eyebrow: v })} />
          <Field label="Заголовок · рядок 1" value={data.hero.titleTop} onChange={(v) => set("hero", { titleTop: v })} />
          <Field label="Заголовок · акцент (золотий)" value={data.hero.titleEm} onChange={(v) => set("hero", { titleEm: v })} />
          <Area label="Підзаголовок" value={data.hero.lead} onChange={(v) => set("hero", { lead: v })} />
          <Row>
            <Field label="Кнопка 1" value={data.hero.ctaPrimary} onChange={(v) => set("hero", { ctaPrimary: v })} />
            <Field label="Кнопка 2" value={data.hero.ctaSecondary} onChange={(v) => set("hero", { ctaSecondary: v })} />
          </Row>
        </Section>

        {/* COMPANY */}
        <Section title="Про компанію">
          <Field label="Надзаголовок" value={data.company.eyebrow} onChange={(v) => set("company", { eyebrow: v })} />
          <Row>
            <Field label="Заголовок · початок" value={data.company.headTop} onChange={(v) => set("company", { headTop: v })} />
            <Field label="Акцент" value={data.company.headEm} onChange={(v) => set("company", { headEm: v })} />
          </Row>
          <Field label="Заголовок · хвіст" value={data.company.headTail} onChange={(v) => set("company", { headTail: v })} />
          <Area label="Абзац 1" value={data.company.para1} onChange={(v) => set("company", { para1: v })} />
          <Area label="Абзац 2" value={data.company.para2} onChange={(v) => set("company", { para2: v })} />
          <Field label="Кнопка" value={data.company.cta} onChange={(v) => set("company", { cta: v })} />
        </Section>

        {/* ARCHITECT */}
        <Section title="Архітектор методу (Тетяна)">
          <Field label="Надзаголовок" value={data.architect.eyebrow} onChange={(v) => set("architect", { eyebrow: v })} />
          <Row>
            <Field label="Ім'я" value={data.architect.nameTop} onChange={(v) => set("architect", { nameTop: v })} />
            <Field label="Прізвище (акцент)" value={data.architect.nameEm} onChange={(v) => set("architect", { nameEm: v })} />
          </Row>
          <Area label="Абзац 1" value={data.architect.para1} onChange={(v) => set("architect", { para1: v })} />
          <Area label="Абзац 2" value={data.architect.para2} onChange={(v) => set("architect", { para2: v })} />
          <Area label="Цитата" value={data.architect.quote} onChange={(v) => set("architect", { quote: v })} />
          <Field label="Підпис під цитатою" value={data.architect.quoteAuthor} onChange={(v) => set("architect", { quoteAuthor: v })} />
          <ImageField label="Фото" value={data.architect.image} onChange={(v) => set("architect", { image: v })} />
        </Section>

        {/* MENTORING */}
        <Section title="Менторинг">
          <Field label="Надзаголовок" value={data.mentoring.eyebrow} onChange={(v) => set("mentoring", { eyebrow: v })} />
          <Row>
            <Field label="Заголовок · початок" value={data.mentoring.headTop} onChange={(v) => set("mentoring", { headTop: v })} />
            <Field label="Акцент" value={data.mentoring.headEm} onChange={(v) => set("mentoring", { headEm: v })} />
          </Row>
          <Area label="Опис" value={data.mentoring.lead} onChange={(v) => set("mentoring", { lead: v })} />
          <Row>
            <Field label="Кнопка 1" value={data.mentoring.ctaPrimary} onChange={(v) => set("mentoring", { ctaPrimary: v })} />
            <Field label="Кнопка 2 (текст-лінк)" value={data.mentoring.ctaSecondary} onChange={(v) => set("mentoring", { ctaSecondary: v })} />
          </Row>
          <ImageField label="Фото" value={data.mentoring.image} onChange={(v) => set("mentoring", { image: v })} />
        </Section>

        {/* FAQ */}
        <Section title="Часті питання">
          {data.faq.map((f, i) => (
            <div key={i} className="rounded-xl border border-line/50 bg-[rgba(35,26,18,.35)] p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">№ {i + 1}</span>
                <button
                  type="button"
                  onClick={() => setFaq(data.faq.filter((_, j) => j !== i))}
                  className="text-xs text-ember hover:underline"
                >
                  видалити
                </button>
              </div>
              <Field label="Питання" value={f.q} onChange={(v) => setFaq(data.faq.map((x, j) => (j === i ? { ...x, q: v } : x)))} />
              <Area label="Відповідь" value={f.a} onChange={(v) => setFaq(data.faq.map((x, j) => (j === i ? { ...x, a: v } : x)))} />
            </div>
          ))}
          {data.faq.length < 12 && (
            <button
              type="button"
              onClick={() => setFaq([...data.faq, { q: "", a: "" }])}
              className="rounded-[10px] border border-dashed border-line/60 px-4 py-2 text-sm text-muted hover:border-gold/50 hover:text-gold"
            >
              + додати питання
            </button>
          )}
        </Section>

        {/* actions */}
        <div className="sticky bottom-0 z-10 mt-8 flex items-center gap-4 border-t border-line/50 bg-[#0B0A09]/90 py-4 backdrop-blur">
          <button onClick={save} disabled={status === "saving" || !dbReady} className="btn btn-primary disabled:opacity-50">
            {status === "saving" ? "Зберігаю…" : "Зберегти"}
          </button>
          <button
            type="button"
            onClick={() => { setData(structuredClone(MAIN_CONTENT_DEFAULTS)); setStatus("idle"); }}
            className="text-sm text-muted hover:text-gold"
          >
            Скинути до стандартних
          </button>
          {status === "saved" && <span className="text-sm text-gold">Збережено ✓ Оновіть головну.</span>}
          {status === "error" && <span className="text-sm text-ember">Не вдалося зберегти.</span>}
        </div>
      </div>
    </div>
  );
}

/* ───── building blocks ───── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-gold">{title}</h2>
      <div className="flex flex-col gap-3 rounded-2xl border border-line/60 bg-[#131210] p-5">{children}</div>
    </section>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
const inputCls =
  "w-full rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-3 py-2.5 text-sm text-ink caret-[#E2A638] outline-none focus:border-gold/70";
const labelCls = "font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted";

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      <textarea className={`${inputCls} resize-y`} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function upload(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const j = await res.json();
      if (j?.url) onChange(j.url);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <span className={labelCls}>{label}</span>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="h-16 w-16 rounded-[8px] border border-line/60 object-cover" />
        <div className="flex flex-1 flex-col gap-2">
          <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
          <label className="w-fit cursor-pointer rounded-[10px] border border-line/60 px-3 py-1.5 text-xs text-muted hover:border-gold/50 hover:text-gold">
            {busy ? "Завантаження…" : "Завантажити фото"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
