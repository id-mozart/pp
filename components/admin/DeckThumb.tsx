"use client";

import { useEffect, useRef, useState } from "react";
import { DeckPages } from "@/components/deck/DeckPages";
import type { Deck } from "@/lib/decks/types";

/** Жива мініатюра першої сторінки деки: справжній рендер A4, зменшений під ширину картки. */
export function DeckThumb({ deck }: { deck: Deck }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.26);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setS(el.clientWidth / 1122.5); // 297mm у px при 96dpi
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="thumb" ref={ref}>
      <div className="scale" style={{ transform: `scale(${s})` }}>
        <DeckPages deck={deck} only={1} editable={false} />
      </div>
    </div>
  );
}
