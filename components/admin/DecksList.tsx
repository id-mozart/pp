"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Deck } from "@/lib/decks/types";
import { DeckThumb } from "@/components/admin/DeckThumb";
import { DeckCardActions, NewDeckButton } from "@/components/admin/DecksManager";

export type DeckItem = {
  slug: string;
  name: string;
  pages: number;
  /** «16 вер., 07:06» (Київ) або "" для стандартної, ще не збереженої */
  when: string;
  saved: boolean;
  deletable: boolean;
  deck?: Deck;
};

type View = "grid" | "table";
const KEY = "decks-view";

/** Список презентацій: плитка або таблиця, вибір запамʼятовується в браузері. */
export function DecksList({ items }: { items: DeckItem[] }) {
  const [view, setView] = useState<View>("grid");
  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v === "table" || v === "grid") setView(v); } catch {}
  }, []);
  const pick = (v: View) => { setView(v); try { localStorage.setItem(KEY, v); } catch {} };

  return (
    <>
      <div className="head">
        <div className="ttl">
          <h1>Презентації</h1>
          <span className="count">{items.length}</span>
        </div>
        <div className="acts">
          <div className="seg" role="radiogroup" aria-label="Вигляд списку">
            <button type="button" role="radio" aria-checked={view === "grid"} className={view === "grid" ? "on" : ""} onClick={() => pick("grid")} title="Плитка">
              <span className="ic" aria-hidden>▦</span> Плитка
            </button>
            <button type="button" role="radio" aria-checked={view === "table"} className={view === "table" ? "on" : ""} onClick={() => pick("table")} title="Таблиця">
              <span className="ic" aria-hidden>☰</span> Таблиця
            </button>
          </div>
          <NewDeckButton items={items.map((d) => ({ slug: d.slug, name: d.name }))} />
          <Link href="/admin" className="btn back">← Панель</Link>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid">
          {items.map((d) => (
            <article className="card" key={d.slug}>
              <Link href={`/admin/deck/${d.slug}`} className="thumbwrap" aria-label={`Відкрити «${d.name}»`} title={`/admin/deck/${d.slug}`}>
                {d.deck ? <DeckThumb deck={d.deck} /> : <div className="thumb ph">без мініатюри</div>}
              </Link>
              <div className="body">
                <h2 className="nm" title={d.name}>{d.name}</h2>
                <div className="meta">
                  <span className="pill">{d.pages} стор.</span>
                  {d.saved ? <span className="when">оновлено {d.when}</span> : <span className="badge">стандартна</span>}
                </div>
                <div className="slug" title={`/admin/deck/${d.slug}`}>/{d.slug}</div>
              </div>
              <div className="row">
                <Actions d={d} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                <th className="c-th"></th>
                <th>Назва</th>
                <th className="c-num">Стор.</th>
                <th className="c-when">Оновлено</th>
                <th className="c-acts">Дії</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d) => (
                <tr key={d.slug}>
                  <td className="c-th">
                    <Link href={`/admin/deck/${d.slug}`} className="mini" aria-label={`Відкрити «${d.name}»`} title={`/admin/deck/${d.slug}`}>
                      {d.deck ? <DeckThumb deck={d.deck} /> : <div className="thumb ph" />}
                    </Link>
                  </td>
                  <td className="c-name">
                    <Link href={`/admin/deck/${d.slug}`} className="tnm" title={d.name}>{d.name}</Link>
                    <div className="slug" title={`/admin/deck/${d.slug}`}>/{d.slug}</div>
                  </td>
                  <td className="c-num"><span className="pill">{d.pages}</span></td>
                  <td className="c-when">{d.saved ? d.when : <span className="badge">стандартна</span>}</td>
                  <td className="c-acts"><div className="row"><Actions d={d} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Actions({ d }: { d: DeckItem }) {
  return (
    <>
      <Link href={`/admin/deck/${d.slug}`} className="btn pri sm">Відкрити</Link>
      <Link href={`/admin/deck/${d.slug}?present=1`} className="btn sm" title="Режим показу">Показ</Link>
      <a href={`/admin/deck/${d.slug}?pdf=1`} target="_blank" rel="noopener" className="btn sm" title="Завантажити PDF">PDF</a>
      <DeckCardActions slug={d.slug} name={d.name} deletable={d.deletable} />
    </>
  );
}
