import type { CSSProperties } from "react";

/* Фірмові градієнти «Ember» (Instagram-шаблон Pan&Partners) */
export const GRAD_ACC =
  "linear-gradient(95deg,#F7B658 0%,#EE8C2C 52%,#DC6716 100%)";
export const GRAD_GOLD =
  "linear-gradient(100deg,#F0C26E 0%,#E2A638 55%,#C5631F 100%)";
export const CARD_BG =
  "linear-gradient(160deg,rgba(33,21,10,.95),rgba(19,12,6,.96))";
export const CTAG_BG = "rgba(35,26,18,.84)";

/* Єдині класи полів форм (ContactForm + BookingCalendar) */
export const FIELD_CLS =
  "w-full rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3.5 text-ink caret-[#E2A638] placeholder:text-faint/60 transition-[border-color,background-color,box-shadow] duration-300 focus:border-gold/70 focus:bg-[rgba(35,26,18,.8)] focus:outline-none focus:ring-1 focus:ring-gold/40 focus:shadow-[0_10px_30px_-18px_rgba(226,166,56,.45)]";

export const gradText = (g: string): CSSProperties => ({
  background: g,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});
