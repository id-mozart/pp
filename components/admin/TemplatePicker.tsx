"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DeckPages } from "@/components/deck/DeckPages";
import type { Deck } from "@/lib/decks/types";
import { PAGE_TEMPLATES, TEMPLATE_GROUPS, type PageTemplate } from "@/lib/decks/templates";

/**
 * Вибір шаблону сторінки: мініатюри всіх композицій (справжній рендер A4 у масштабі),
 * згруповані. mode: append — у кінець, insert — після сторінки, replace — перекласти наявну.
 */
export function TemplatePicker({ deck, mode, onClose }: { deck: Deck; mode: "append" | "insert" | "replace"; onClose: (t: PageTemplate | null) => void }) {
  const [sel, setSel] = useState<string>("");
  const onCloseRef = useRef(onClose); onCloseRef.current = onClose;
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(null); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, []);
  // зразки рендеримо один раз: у кожного шаблону — власна одна сторінка з налаштуваннями цієї деки
  const samples = useMemo(() => PAGE_TEMPLATES.map((t) => ({ t, deck: { ...deck, notes: false, pages: [t.make()] } as Deck })), [deck.fs, deck.tight, deck.caps, deck.logo, deck.runhead]); // eslint-disable-line react-hooks/exhaustive-deps
  const title = mode === "replace" ? "Змінити композицію сторінки" : mode === "insert" ? "Вставити сторінку після цієї" : "Нова сторінка";
  const pick = PAGE_TEMPLATES.find((t) => t.id === sel) || null;
  // масштаб мініатюр: ширина картки / 297mm (1122.5px при 96dpi)
  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = gridRef.current; if (!el) return;
    const fit = () => { const th = el.querySelector<HTMLElement>(".tpl .th"); if (th) el.style.setProperty("--ts", String(th.clientWidth / 1122.5)); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, []);
  return (
    <div className="pick-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(null); }}>
      <div className="pick tplpick" role="dialog" aria-modal="true" aria-label={title} ref={gridRef}>
        <h3>{title}</h3>
        <p className="tplhint">{mode === "replace" ? "Тексти сторінки перенесуться в нову композицію (заголовок, лід, пункти, ілюстрація). Дію можна скасувати через ⌘Z." : "Оберіть композицію — сторінка створиться зі зразковим текстом, який ви замінюєте прямо на аркуші."}</p>
        {TEMPLATE_GROUPS.map((g) => (
          <div key={g}>
            <div className="lab">{g}</div>
            <div className="tplgrid">
              {samples.filter((s) => s.t.group === g).map(({ t, deck: d }) => (
                <button key={t.id} type="button" className={"tpl" + (sel === t.id ? " on" : "")} onClick={() => setSel(t.id)} onDoubleClick={() => onClose(t)} title={t.hint}>
                  <span className="th"><span className="sc"><DeckPages deck={d} only={1} editable={false} /></span></span>
                  <span className="nm">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="btns">
          <button ref={cancelRef} className="btn" onClick={() => onClose(null)}>Скасувати</button>
          <button className="btn pri" disabled={!pick} onClick={() => pick && onClose(pick)}>{mode === "replace" ? "Застосувати композицію" : "Додати сторінку"}</button>
        </div>
      </div>
    </div>
  );
}
