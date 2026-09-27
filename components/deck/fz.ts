"use client";

import { createContext, useContext } from "react";

/**
 * Індивідуальний розмір шрифту кожного текстового поля сторінки (page.fz: ключ поля → множник).
 * Поле позначається data-fk (ключ) і data-fz (множник). Змінюється ЛИШЕ кегль цього поля:
 * автопідбір сторінки рахується без цих множників (інші поля не змінюються), а потім кожному
 * позначеному полю (і його вкладеним елементам) виставляється font-size = базовий × множник.
 */
export const FzCtx = createContext<Record<string, number> | undefined>(undefined);
/** Запис нової мапи розмірів сторінки (для перенумерації пунктів списку після вставки/видалення). */
export const FzSetCtx = createContext<((next: Record<string, number> | undefined) => void) | undefined>(undefined);

export const FZ_MIN = 0.6;
export const FZ_MAX = 2.2;

export function fzAttrs(map: Record<string, number> | undefined, fk?: string): Record<string, string> {
  if (!fk) return {};
  const z = map?.[fk];
  return z && Math.abs(z - 1) > 0.001 ? { "data-fk": fk, "data-fz": String(z) } : { "data-fk": fk };
}

/** Атрибути для редагованого поля: data-fk і, якщо задано, data-fz. */
export function useFz(fk?: string): Record<string, string> {
  return fzAttrs(useContext(FzCtx), fk);
}

/**
 * Список змінив довжину (вставили/видалили пункти) — переносимо розміри пунктів «base.N» за їхнім текстом:
 * спільний початок і спільний кінець списку зберігають свої розміри, змінена середина — без розміру.
 */
export function remapListFz(map: Record<string, number> | undefined, base: string, before: string[], after: string[]): Record<string, number> | undefined {
  if (!map) return map;
  const pre = base + ".";
  const keys = Object.keys(map).filter((k) => k.startsWith(pre) && /^\d+$/.test(k.slice(pre.length)));
  if (!keys.length || before.length === after.length) return map;
  let p = 0; while (p < before.length && p < after.length && before[p] === after[p]) p++;
  let s = 0; while (s < before.length - p && s < after.length - p && before[before.length - 1 - s] === after[after.length - 1 - s]) s++;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(map)) {
    if (!keys.includes(k)) { out[k] = v; continue; }
    const i = Number(k.slice(pre.length));
    if (i < p) out[k] = v;
    else if (i >= before.length - s) out[pre + (i + after.length - before.length)] = v;
  }
  return Object.keys(out).length ? out : undefined;
}
