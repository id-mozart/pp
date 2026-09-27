"use client";

import { createContext, useContext } from "react";

/**
 * Індивідуальний розмір тексту кожного поля сторінки (page.fz: ключ поля → множник).
 * Поле позначається data-fk, множник застосовується як CSS zoom — масштабує кегль разом
 * із міжрядковим інтервалом і маркерами, а автопідбір кегля сторінки враховує це під час вимірювання.
 */
export const FzCtx = createContext<Record<string, number> | undefined>(undefined);

export const FZ_MIN = 0.6;
export const FZ_MAX = 2.2;

/** Атрибути для редагованого елемента: data-fk і zoom, якщо множник заданий. */
export function useFz(fk?: string): { "data-fk"?: string; style?: React.CSSProperties } {
  const map = useContext(FzCtx);
  if (!fk) return {};
  const z = map?.[fk];
  return { "data-fk": fk, style: z && Math.abs(z - 1) > 0.001 ? ({ zoom: z } as React.CSSProperties) : undefined };
}
