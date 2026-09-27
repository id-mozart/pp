"use client";

import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";
import { deckT, splitBold } from "@/lib/decks/i18n";
import { DIAGRAM_CSS, Diagram } from "@/components/deck/Diagrams";
import { FzCtx, FzSetCtx, fzAttrs, remapListFz, useFz } from "@/components/deck/fz";
import type { Deck, DeckPage } from "@/lib/decks/types";

/**
 * Рендер A4-сторінок деки у «кремовому» стилі Pan&Partners (той самий, що
 * в профайлах). Кожне текстове поле — contentEditable, зміни віддаються
 * через onChange(pageIndex, patch). У друці (@media print) — чисті сторінки.
 */

const DECK_CSS_BASE = `
  #deck-a4{ --sheet:#FCF8F1; --band:#F4ECDC; --ink:#2A2018; --muted:#5E4C36; --faint:#9C8B73;
    --line:rgba(140,116,82,.36); --acc:#C4621F; --amber:#D2701C; --gold:#C98A2B; --np:#5E2AC4;
    display:flex; flex-direction:column; align-items:center; gap:22px;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
    font-family:var(--font-inter),system-ui,sans-serif; color:var(--ink); }
  #deck-a4 *{ box-sizing:border-box; margin:0; padding:0; }
  #deck-a4 .sheet{ position:relative; width:297mm; height:210mm; overflow:hidden; background:var(--sheet);
    padding:11mm 16mm 9mm; display:flex; flex-direction:column; box-shadow:0 24px 70px rgba(60,40,15,.22); }
  #deck-a4 .serif{ font-family:var(--font-spectral),Georgia,serif; }
  #deck-a4 .mono{ font-family:var(--font-jetbrains),ui-monospace,monospace; }
  #deck-a4 [contenteditable]{ outline:none; border-radius:2px; transition:box-shadow .15s; min-width:2em; }
  #deck-a4 [contenteditable]:hover{ box-shadow:0 0 0 1px rgba(201,138,43,.45); }
  #deck-a4 [contenteditable]:focus{ box-shadow:0 0 0 2px rgba(201,138,43,.7); background:rgba(244,236,220,.6); }
  #deck-a4 [contenteditable]:empty::before{ content:attr(data-ph); color:var(--faint); font-style:italic; }

  /* runhead + foot */
  #deck-a4 .rh{ display:flex; align-items:center; gap:5.5mm; }
  #deck-a4 .rh .wm{ font-family:var(--font-playfair),Georgia,serif; font-size:13.5pt; font-weight:500; white-space:nowrap; }
  #deck-a4 .rh .wm em{ color:var(--amber); font-style:normal; }
  #deck-a4 .rh .fill{ flex:1; height:1px; background:var(--line); }
  #deck-a4 .rh .tag{ font-family:var(--font-jetbrains),monospace; font-size:7.8pt; letter-spacing:.16em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #deck-a4 .foot{ display:flex; align-items:flex-end; justify-content:space-between; border-top:1px solid var(--line); padding-top:3mm; margin-top:auto; }
  #deck-a4 .foot .pg{ font-family:var(--font-jetbrains),monospace; font-size:7.8pt; letter-spacing:.16em; color:var(--faint); }
  #deck-a4 .foot .tl{ font-family:var(--font-spectral),serif; font-style:italic; font-size:9.5pt; color:var(--muted); }
  #deck-a4 .foot .tl b{ color:var(--acc); font-weight:500; }
  /* колонтитул із назвою деки знизу: назва ліворуч, лаконічний номер праворуч */
  #deck-a4 .foot.frh .tag{ font-family:var(--font-jetbrains),monospace; font-size:7.8pt; letter-spacing:.16em; text-transform:uppercase; color:var(--faint); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #deck-a4 .foot.frh .pg{ font-size:8.5pt; color:var(--muted); }
  /* колонтитул знизу: зверху лише логотип, тож між ним і заголовком — гарантований відступ */
  #deck-a4.frh .sheet:not(.t-cover):not(.t-section):not(.t-closing):not(.t-about) > .pb{ padding-top:9mm; }
  #deck-a4.frh .sheet.t-about > .pb{ padding-top:2.5mm; }

  /* типографіка */
  #deck-a4 h1{ font-family:var(--font-spectral),Georgia,serif; font-size:calc(34pt * var(--kh,1)); font-weight:500; line-height:1.06; letter-spacing:-.005em; margin-top:7mm; }
  #deck-a4 h1 em, #deck-a4 h2 em{ color:var(--amber); font-style:italic; }
  #deck-a4 .lead{ font-family:var(--font-spectral),serif; font-size:calc(13.5pt * min(var(--k,1), 1.15)); line-height:1.5; color:var(--ink); margin-top:4mm; max-width:170mm; }
  #deck-a4 .lead:empty{ display:none; }
  #deck-a4 h1:has(> [contenteditable]:empty + em > [contenteditable]:empty){ display:none; }
  #deck-a4 .para{ font-size:calc(12.2pt * var(--k,1)); line-height:1.55; color:var(--ink); margin-top:4mm; max-width:175mm; }
  #deck-a4 .callout{ position:relative; margin-top:6mm; max-width:100%; background:var(--band); border-radius:4px; padding:4.5mm 7mm 4.5mm 9mm;
    font-family:var(--font-spectral),serif; font-size:calc(13pt * var(--k,1)); line-height:1.45; }
  #deck-a4 .callout::before{ content:""; position:absolute; left:0; top:0; bottom:0; width:3pt; background:var(--amber); border-radius:4px 0 0 4px; }
  #deck-a4 .callout:empty{ display:none; }
  #deck-a4 .lab{ font-family:var(--font-jetbrains),monospace; font-size:7.5pt; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); display:flex; align-items:center; gap:4mm; margin-top:8mm; }
  #deck-a4 .lab::after{ content:""; flex:1; height:1px; background:var(--line); }

  /* капс-заголовки (перемикач) */
  #deck-a4.caps h1{ text-transform:uppercase; letter-spacing:.035em; font-size:calc(24pt * var(--kh,1)); line-height:1.12; }
  #deck-a4.caps .t-cover h1{ font-size:38pt; letter-spacing:.03em; line-height:1.06; }
  #deck-a4.caps .t-cover h1 em{ font-size:22pt; letter-spacing:.04em; }
  #deck-a4.caps .t-section h1{ font-size:30pt; }
  #deck-a4.caps .t-section .withimg h1{ font-size:26pt; }
  #deck-a4.caps .t-about h1{ font-size:28pt; }
  #deck-a4.caps .t-closing h1{ font-size:32pt; }
  #deck-a4.caps .col h3, #deck-a4.caps .step .h{ text-transform:uppercase; letter-spacing:.06em; font-size:calc(10.5pt * var(--k,1)); font-style:normal; }
  /* кольорові маркери психотипів */
  #deck-a4 .chip{ display:inline-block; width:.62em; height:.62em; border-radius:99px; margin-right:.35em; vertical-align:baseline; transform:translateY(-.02em); }
  #deck-a4 .chip.red{ background:#D9342B; } #deck-a4 .chip.yellow{ background:#F2C230; } #deck-a4 .chip.blue{ background:#2F62C7; }
  #deck-a4 .t-gallery .lead{ font-size:calc(17pt * var(--k,1)); font-style:italic; color:var(--acc); }

  /* тіло сторінки */
  #deck-a4 .pb{ display:flex; flex-direction:column; flex:1; min-height:0; }
  /* нижній кліренс як елемент (не padding): переповнення у нього рахується автопідбором */
  #deck-a4 .sheet:not(.t-about):not(.t-cover):not(.t-section):not(.t-closing) .pb::after{ content:""; display:block; flex:none; height:7mm; }
  #deck-a4 .sheet[data-sparse] .pb{ justify-content:flex-start; padding-bottom:0; }
  #deck-a4 .t-cover .pb, #deck-a4 .t-section .pb, #deck-a4 .t-closing .pb{ display:contents; }

  /* bullets */
  #deck-a4 ul.bul{ list-style:none; margin-top:5mm; display:flex; flex-direction:column; gap:calc(2.6mm * var(--k,1)); max-width:180mm; }
  #deck-a4 ul.bul li{ position:relative; padding-left:6mm; font-size:calc(12.5pt * var(--k,1)); line-height:1.5; }
  #deck-a4 ul.bul li::before{ content:""; position:absolute; left:0; top:.55em; width:3.6pt; height:3.6pt; border-radius:99px; background:var(--amber); }
  #deck-a4 ul.bul li[data-num]{ padding-left:0; }
  #deck-a4 ul.bul li[data-num]::before{ display:none; }
  #deck-a4 ul.bul.sm li{ font-size:calc(10.8pt * var(--k,1)); line-height:1.45; }
  #deck-a4 ul.bul.sm{ gap:2mm; margin-top:3mm; }

  /* ілюстрація праворуч */
  #deck-a4 .withimg{ display:grid; grid-template-columns:1fr calc(84mm * var(--k,1)); column-gap:12mm; align-items:start; flex:1; min-height:0; }
  #deck-a4 .withimg .fig{ width:calc(84mm * var(--k,1)); height:100%; max-height:150mm; display:flex; align-items:center; justify-content:center; }
  #deck-a4 .withimg .fig img{ max-width:100%; max-height:150mm; object-fit:contain; display:block; mix-blend-mode:multiply; }
  #deck-a4 .body{ min-width:0; }
  #deck-a4 .sheet[data-sparse] .withimg{ align-items:start; }
  #deck-a4 .sheet[data-sparse] .withimg .fig{ max-height:none; height:auto; }
  #deck-a4 .sheet[data-sparse] .withimg .fig img{ max-height:150mm; }
  /* gallery */
  #deck-a4 .gal{ display:grid; grid-template-columns:repeat(3,1fr); gap:8mm; margin-top:7mm; }
  #deck-a4 .gal figure{ text-align:center; }
  #deck-a4 .gal img{ width:100%; height:100mm; object-fit:cover; display:block; border-radius:3px; border:.75pt solid var(--line); mix-blend-mode:multiply; }
  #deck-a4 .gal figcaption{ font-family:var(--font-spectral),serif; font-style:italic; font-size:15pt; color:var(--acc); margin-top:3mm; }
  #deck-a4 .t-section .withimg .fig img{ max-height:120mm; }
  #deck-a4 .t-closing .qr{ width:34mm; height:34mm; object-fit:contain; display:block; margin-top:6mm; border:0; padding:0; }
  /* twocol */
  #deck-a4 .cols{ display:grid; grid-template-columns:1fr 1fr; column-gap:10mm; row-gap:6mm; margin-top:6mm; }
  #deck-a4 .cols[data-n="3"]{ grid-template-columns:repeat(3,1fr); }
  #deck-a4 .cols[data-n="4"]{ grid-template-columns:repeat(4,1fr); column-gap:5mm; }
  #deck-a4 .cols[data-n="4"] .col{ padding:4mm 4.5mm 6mm; }
  #deck-a4 .col h3{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:calc(13.5pt * var(--k,1)); color:var(--acc); line-height:1.25; padding-bottom:2mm; border-bottom:1px solid var(--line); }

  /* steps */
  #deck-a4 .steps{ margin-top:5mm; display:flex; flex-direction:column; max-width:240mm; }
  #deck-a4 .step{ display:grid; grid-template-columns:60mm 1fr; gap:6mm; padding:calc(3.2mm * var(--k,1)) 0; border-top:1px solid var(--line); align-items:baseline; }
  #deck-a4 .step:first-child{ border-top:0; }
  #deck-a4 .step .h{ font-family:var(--font-spectral),serif; font-style:italic; font-size:calc(13.5pt * min(var(--k,1), 1.18)); color:var(--acc); line-height:1.3; }
  #deck-a4 .step .t{ font-size:calc(12.2pt * min(var(--k,1), 1.18)); line-height:1.5; white-space:pre-line; }

  /* table */
  #deck-a4 table{ width:100%; border-collapse:collapse; margin-top:6mm; font-size:calc(10.5pt * var(--k,1)); line-height:1.42; }
  #deck-a4 th{ text-align:left; vertical-align:bottom; font-family:var(--font-jetbrains),monospace; font-size:7.8pt; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); padding:0 6mm 2.4mm 0; border-bottom:1px solid var(--ink); font-weight:500; }
  #deck-a4 td{ white-space:pre-line; vertical-align:top; padding:calc(2.8mm * var(--k,1)) 3mm calc(2.8mm * var(--k,1)) 0; border-bottom:1px solid var(--line); }
  #deck-a4 td:first-child{ color:var(--acc); font-family:var(--font-spectral),serif; font-style:italic; font-size:calc(11pt * var(--k,1)); width:17%; }
  #deck-a4 table[data-num] td:first-child{ width:6%; white-space:nowrap; }
  #deck-a4 table[data-cols="4"]:not(.ws) td:nth-child(2){ width:34%; } #deck-a4 table[data-cols="4"]:not(.ws) td:nth-child(3){ width:22%; }
  #deck-a4 table[data-num][data-cols="3"] td:nth-child(3), #deck-a4 table[data-num][data-cols="3"] th:nth-child(3){ width:42%; }
  /* порожня клітинка в редакторі: лише мінімальна висота, без display:block — інакше таблиця розвалюється і автопідбір кегля в редакторі (а з ним PDF/PPTX) дає інший результат, ніж на показі */
  #deck-a4 td[contenteditable]:empty{ height:6mm; }

  /* cover */
  #deck-a4 .t-cover .rh .tag{ visibility:hidden; }
  #deck-a4 .t-cover .cv{ display:grid; grid-template-columns:1fr 118mm; gap:14mm; flex:1; min-height:0; margin-top:6mm; }
  #deck-a4 .t-cover .cv-l{ display:flex; flex-direction:column; padding-top:16mm; }
  #deck-a4 .t-cover .eyebrow{ font-family:var(--font-jetbrains),monospace; font-size:8.5pt; letter-spacing:.28em; text-transform:uppercase; color:var(--acc); }
  #deck-a4 .t-cover h1{ font-size:48pt; line-height:.98; margin-top:7mm; letter-spacing:-.012em; }
  #deck-a4 .t-cover h1 em{ display:block; font-size:30pt; line-height:1.1; margin-top:5mm; letter-spacing:0; }
  #deck-a4 .t-cover .sub{ font-family:var(--font-spectral),serif; font-size:16pt; line-height:1.4; color:var(--muted); margin-top:6mm; max-width:150mm; }
  #deck-a4 .t-cover .sub:empty{ display:none; }
  #deck-a4 .t-cover .who{ margin-top:auto; padding-top:8mm; font-size:11.5pt; line-height:1.6; color:var(--ink); border-top:1px solid var(--line); max-width:150mm; }
  #deck-a4 .t-cover .who .w{ font-family:var(--font-jetbrains),monospace; font-size:7.8pt; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); margin-top:1.5mm; }
  #deck-a4 .t-cover .cv-r{ position:relative; align-self:stretch; display:flex; flex-direction:column; align-items:flex-end; }
  #deck-a4 .t-cover .cv-r .np-big{ width:96mm; height:auto; display:block; margin-top:6mm; }
  #deck-a4 .t-cover .cv-r .ill{ flex:1; min-height:0; width:100%; object-fit:contain; object-position:right bottom; display:block; margin-top:4mm; max-height:96mm; filter:drop-shadow(0 14px 26px rgba(80,40,160,.18)); }
  /* без логотипа клієнта (фото замість 3D-ілюстрації): вище, без «фіолетової» тіні */
  #deck-a4 .t-cover .cv-r:not(:has(.np-big)) .ill{ max-height:none; height:100%; object-fit:cover; object-position:50% 20%; margin-top:0; border-radius:4mm; filter:none; box-shadow:0 12px 28px rgba(60,40,15,.16); }
  /* титул без фото: величезний амперсанд з логотипа праворуч, як фоновий елемент */
  #deck-a4 .t-cover .cv-r.amp{ position:static; }
  #deck-a4 .t-cover .cv-r .bigamp{ position:absolute; right:-14mm; bottom:-2mm; font-family:var(--font-playfair),Georgia,serif; font-weight:500; font-size:560pt; line-height:.8; color:var(--amber); opacity:.14; pointer-events:none; user-select:none; letter-spacing:0; }
  /* композиція титулу з амперсандом: широка колонка заголовка, більший логотип, аватар тренера */
  #deck-a4 .t-cover .cv.amp{ grid-template-columns:1fr 34mm; gap:8mm; }
  #deck-a4 .t-cover .cv.amp .cv-l{ padding-top:30mm; }
  #deck-a4 .t-cover .cv.amp h1{ font-size:62pt; line-height:.96; max-width:215mm; }
  #deck-a4 .t-cover .cv.amp h1 em{ font-size:36pt; margin-top:6mm; }
  #deck-a4 .t-cover .cv.amp .eyebrow{ position:absolute; right:16mm; top:13.5mm; margin:0; font-size:12pt; letter-spacing:.3em; text-align:right; }
  #deck-a4 .t-cover .cv.amp .sub, #deck-a4 .t-cover .cv.amp .who{ max-width:200mm; }
  #deck-a4 .t-cover:has(.cv.amp) .rh .wm{ font-size:29pt; }
  /* амперсанд-титул: без службових ліній і колонтитула — лише логотип, заголовок, підпис */
  #deck-a4 .t-cover:has(.cv.amp) .rh .fill{ display:none; }
  /* ко-брендинг на титулі: «Pan&Partners × логотип клієнта» */
  #deck-a4 .t-cover .rh .cox{ font-family:var(--font-spectral),serif; font-weight:300; font-size:20pt; line-height:1; color:var(--faint); margin:0 -1mm; }
  #deck-a4 .t-cover .rh .colg{ height:15.5mm; width:auto; display:block; }
  /* титул «фото»: та сама композиція, що й «амперсанд», але праворуч — фото на всю колонку */
  #deck-a4 .t-cover .cv.amp.photo{ grid-template-columns:1fr 108mm; gap:12mm; }
  #deck-a4 .t-cover .cv.amp.photo .cv-l{ padding-top:24mm; }
  #deck-a4 .t-cover .cv.amp.photo h1{ font-size:47pt; max-width:none; }
  #deck-a4 .t-cover .cv.amp.photo h1 em{ font-size:28pt; }
  #deck-a4 .t-cover .cv-r.phc{ position:relative; align-self:stretch; margin:8mm 0 22mm; }
  #deck-a4 .t-cover .cv-r.phc .phimg{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 30%; border-radius:4mm; box-shadow:0 14px 34px rgba(60,40,15,.18); display:block; }
  #deck-a4 .t-cover:has(.cv.amp) .eyebrow{ border:0; box-shadow:none; background:none; padding:0; }
  #deck-a4 .t-cover:has(.cv.amp) .eyebrow::before, #deck-a4 .t-cover:has(.cv.amp) .eyebrow::after{ display:none; }
  #deck-a4 .t-cover:has(.cv.amp) .who{ border-top:0; padding-bottom:6mm; }
  /* підпис під аватаром у два рядки: імʼя (перший рядок) крупніше, роль — під ним; дата — у правому нижньому куті */
  #deck-a4 .t-cover:has(.cv.amp) .who.av .wt > p:first-child{ white-space:pre-line; font-size:14.5pt; line-height:1.35; color:var(--muted); }
  #deck-a4 .t-cover:has(.cv.amp) .who.av .wt > p:first-child::first-line{ font-family:var(--font-spectral),serif; font-size:1.517em; font-weight:500; color:var(--ink); }
  #deck-a4 .t-cover:has(.cv.amp) .who .avatar{ width:24mm; height:24mm; }
  #deck-a4 .t-cover:has(.cv.amp) .who .w{ position:absolute; right:16mm; bottom:14mm; margin:0; font-size:11pt; }
  #deck-a4 .t-cover:has(.cv.amp) .foot{ display:none; }
  #deck-a4 .t-cover .who.av{ display:flex; align-items:center; gap:5.5mm; }
  #deck-a4 .t-cover .who .avatar{ position:relative; flex:none; width:19mm; height:19mm; border-radius:50%; overflow:hidden; box-shadow:0 0 0 1.6pt var(--amber), 0 0 0 4pt var(--sheet); }
  #deck-a4 .t-cover .who .avatar img{ width:100%; height:100%; object-fit:cover; object-position:50% 18%; display:block; }
  #deck-a4 .t-cover .who.av .wt p{ margin:0; }
  #deck-a4 .t-cover .who.two{ flex-direction:column; align-items:flex-start; gap:4.5mm; }
  #deck-a4 .t-cover .who.two .pp{ display:flex; align-items:center; gap:5.5mm; }
  #deck-a4 .t-cover:has(.cv.amp) .who.two .avatar{ width:21mm; height:21mm; }
  #deck-a4 .t-cover .who .avatar.ini{ display:flex; align-items:center; justify-content:center; background:var(--band); font-family:var(--font-spectral),serif; font-size:17pt; font-weight:500; color:var(--acc); letter-spacing:.02em; }
  #deck-a4 .t-cover .who.av > .wt > p:first-child{ font-size:13pt; }
  #deck-a4 .t-cover .foot{ margin-top:10mm; }
  #deck-a4 .t-cover .band{ position:absolute; left:0; right:0; bottom:0; height:5mm; background:linear-gradient(90deg,var(--amber),var(--gold)); }

  /* section */
  #deck-a4 .t-section{ background:var(--band); }
  #deck-a4 .t-section .secwrap{ display:grid; grid-template-columns:auto 1fr; column-gap:14mm; align-items:end; margin:auto 0; padding-bottom:14mm; }
  #deck-a4 .t-section .num{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:190pt; line-height:.78; color:var(--amber); }
  #deck-a4 .t-section .num:empty{ display:none; }
  #deck-a4 .t-section .num[contenteditable]{ min-width:.6em; }
  #deck-a4 .t-section .secwrap:has(> .num:empty){ grid-template-columns:1fr; }
  #deck-a4 .t-section .sec-t{ min-width:0; }
  #deck-a4 .t-section h1{ overflow-wrap:normal; word-break:normal; hyphens:none; }
  #deck-a4 .t-section .sec-t{ padding-bottom:6mm; }
  #deck-a4 .t-section .kicker{ font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.26em; text-transform:uppercase; color:var(--faint); margin-bottom:6mm; display:flex; align-items:center; gap:4mm; }
  #deck-a4 .t-section .kicker::after{ content:""; width:40mm; height:1px; background:var(--gold); }
  #deck-a4 .t-section h1{ font-size:38pt; margin-top:0; max-width:190mm; line-height:1.04; }
  #deck-a4 .t-section .sub{ font-family:var(--font-spectral),serif; font-style:italic; font-size:15pt; color:var(--muted); margin-top:5mm; max-width:170mm; }
  #deck-a4 .t-section .sub:empty{ display:none; }
  #deck-a4 .t-section .withimg{ align-items:center; }
  #deck-a4 .t-section .withimg .fig img{ max-height:130mm; }
  #deck-a4 .t-section .withimg .secwrap{ padding-bottom:0; margin:0; min-width:0; }
  #deck-a4 .t-section .secwrap .sec-t{ min-width:0; }
  #deck-a4 .t-section .withimg h1{ max-width:100%; font-size:32pt; }
  #deck-a4 .t-section .withimg .num{ font-size:150pt; }

  /* about */
  #deck-a4 .t-about .hero{ display:grid; grid-template-columns:1fr 74mm; gap:12mm; margin-top:3mm; align-items:start; }
  #deck-a4 .t-about h1{ margin-top:3mm; font-size:34pt; }
  #deck-a4 .t-about .role{ font-size:10.5pt; line-height:1.5; color:var(--muted); margin-top:3mm; max-width:170mm; }
  #deck-a4 .t-about .role:empty{ display:none; }
  #deck-a4 .t-about .quote{ position:relative; margin-top:5mm; background:var(--band); border-radius:4px; padding:3.5mm 6mm 3.5mm 8mm; font-family:var(--font-spectral),serif; font-size:11.2pt; line-height:1.45; }
  #deck-a4 .t-about .quote::before{ content:""; position:absolute; left:0; top:0; bottom:0; width:3pt; background:var(--amber); border-radius:4px 0 0 4px; }
  #deck-a4 .t-about .quote:empty{ display:none; }
  #deck-a4 .t-about .portrait{ position:relative; width:71mm; margin-top:4mm; }
  #deck-a4 .t-about .portrait img{ display:block; width:100%; height:92mm; object-fit:cover; object-position:center 10%; position:relative; z-index:1; filter:saturate(.9); }
  #deck-a4 .t-about .portrait .frame{ position:absolute; top:3mm; left:-3mm; right:3mm; bottom:-2.6mm; border:.75pt solid var(--gold); }
  #deck-a4 .t-about .stats{ display:grid; grid-template-columns:repeat(4,1fr); margin-top:6mm; }
  #deck-a4 .t-about .stat{ padding:0 5mm; border-left:1px solid var(--line); }
  #deck-a4 .t-about .stat:first-child{ border-left:0; padding-left:0; }
  #deck-a4 .t-about .stat .n{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:22pt; line-height:1; color:var(--acc); }
  #deck-a4 .t-about .stat .t{ font-size:9pt; line-height:1.45; color:var(--muted); margin-top:2mm; }
  #deck-a4 .t-about .bottom{ display:grid; grid-template-columns:1fr 1fr; column-gap:12mm; margin-top:3mm; align-items:start; }
  #deck-a4 .t-about .bottom ul.bul{ margin-top:3mm; gap:2mm; }
  #deck-a4 .t-about .bottom ul.bul li{ font-size:9.4pt; line-height:1.35; }
  #deck-a4 .t-about .note{ font-size:9.4pt; line-height:1.5; color:var(--ink); margin-top:3mm; }
  #deck-a4 .t-about .note:empty{ display:none; }
  #deck-a4 .t-about .logos{ display:block; width:100%; max-width:150mm; max-height:16mm; object-fit:contain; object-position:left; margin-top:6mm; }
  #deck-a4 .t-about .lab{ margin-top:2.5mm; }

  /* closing */
  #deck-a4 .t-closing .wrap{ display:grid; grid-template-columns:1fr 62mm; gap:14mm; margin-top:auto; margin-bottom:auto; align-items:center; }
  #deck-a4 .t-closing h1{ font-size:40pt; margin-top:0; }
  #deck-a4 .t-closing .sub{ font-family:var(--font-spectral),serif; font-size:13pt; color:var(--muted); margin-top:6mm; }
  #deck-a4 .t-closing ul.ct{ list-style:none; margin-top:8mm; display:flex; flex-direction:column; gap:1.5mm; font-family:var(--font-jetbrains),monospace; font-size:10pt; color:var(--acc); }
  #deck-a4 .t-closing .wrap > img{ width:62mm; height:78mm; object-fit:cover; object-position:center 10%; display:block; border:.75pt solid var(--gold); padding:3mm; background:#fff; }

  /* ── розділ: повнокадрове фото праворуч / смуга зверху / фіолетова панель ── */
  #deck-a4 .t-section .secimg{ position:absolute; top:0; right:0; bottom:0; width:118mm; overflow:hidden; background:#5E2AC4; z-index:0; }
  #deck-a4 .t-section .secimg img{ width:100%; height:100%; object-fit:cover; object-position:center 22%; display:block; }
  #deck-a4 .t-section .secimg.panel{ display:flex; align-items:center; justify-content:center; background:radial-gradient(120% 90% at 30% 20%,#7A45E6 0%,#5E2AC4 55%,#3F167F 100%); }
  #deck-a4 .t-section .secimg.panel img{ width:74%; height:auto; object-fit:contain; filter:drop-shadow(0 22px 34px rgba(20,0,60,.45)); }
  #deck-a4 .t-section.has-img .rh, #deck-a4 .t-section.has-img .foot{ margin-right:112mm; }
  #deck-a4 .t-section.has-img .secwrap{ padding-right:112mm; position:relative; z-index:1; align-items:start; }
  #deck-a4 .t-section.has-img .num{ margin-top:9mm; }
  #deck-a4 .t-section.is-step .num{ margin-top:10mm; }
  #deck-a4 .t-section.has-img .num{ font-size:120pt; }
  #deck-a4 .t-section.is-step .num{ font-size:88pt; }
  #deck-a4 .t-section.is-step h1{ font-size:26pt; }
  #deck-a4 .t-section.has-img h1{ font-size:28pt; }
  #deck-a4 .t-section.has-img .secwrap{ column-gap:10mm; }
  #deck-a4 .t-section.fit-top .secimg{ right:0; left:0; bottom:auto; width:auto; height:94mm; }
  #deck-a4 .t-section.fit-top .secimg::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg,rgba(20,12,6,.35),rgba(20,12,6,0) 45%); }
  #deck-a4 .t-section.fit-top .rh{ position:relative; z-index:1; margin-right:0; }
  #deck-a4 .t-section.fit-top .rh .wm, #deck-a4 .t-section.fit-top .rh .tag{ color:#fff; }
  #deck-a4 .t-section.fit-top .rh .wm em{ color:#F0B450; }
  #deck-a4 .t-section.fit-top .rh .fill{ background:rgba(255,255,255,.45); }
  #deck-a4 .t-section.fit-top .foot{ margin-right:0; }
  #deck-a4 .t-section.fit-top .pb{ display:flex; flex-direction:column; justify-content:center; flex:1; min-height:0; padding-top:80mm; }
  #deck-a4 .t-section.fit-top .secwrap{ padding:0 0 4mm; margin:0; align-items:end; }
  #deck-a4 .t-section.fit-top .num{ font-size:120pt; line-height:.8; }
  #deck-a4 .t-section.fit-top h1{ font-size:30pt; max-width:230mm; }

  /* ── картки (bullets variant=cards) ── */
  #deck-a4 .cards{ display:grid; grid-template-columns:repeat(3,1fr); gap:6mm; margin-top:7mm; }
  #deck-a4 .cards[data-n="2"], #deck-a4 .cards[data-n="4"]{ grid-template-columns:repeat(2,1fr); }
  #deck-a4 .cards[data-n="5"], #deck-a4 .cards[data-n="6"]{ grid-template-columns:repeat(3,1fr); }
  #deck-a4 .cards[data-n="7"], #deck-a4 .cards[data-n="8"]{ grid-template-columns:repeat(4,1fr); gap:4.5mm; }
  #deck-a4 .card{ background:var(--band); border-radius:5px; padding:5.5mm 6.5mm 6mm; border-top:2.5pt solid var(--amber); min-height:calc(28mm * var(--k,1)); display:flex; flex-direction:column; gap:2.5mm; }
  #deck-a4 .card .n{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:calc(20pt * var(--k,1)); line-height:1; color:var(--acc); }
  #deck-a4 .card .t{ font-size:calc(11.5pt * var(--k,1)); line-height:1.45; white-space:pre-line; }
  #deck-a4 .cards[data-n="7"] .card .t, #deck-a4 .cards[data-n="8"] .card .t{ font-size:calc(10.5pt * var(--k,1)); }

  /* ── репліки (bullets variant=bubbles) ── */
  #deck-a4 .bubbles{ display:flex; flex-direction:column; gap:calc(3mm * var(--k,1)); margin-top:6mm; max-width:215mm; padding-bottom:3mm; }
  #deck-a4 .bubble{ position:relative; align-self:flex-start; background:var(--band); border-radius:12px 12px 12px 3px; padding:3.2mm 6mm 3.2mm 9mm; font-family:var(--font-spectral),serif; font-style:italic; font-size:calc(12.5pt * var(--k,1)); line-height:1.4; max-width:190mm; }
  #deck-a4 .bubble::before{ content:"“"; position:absolute; left:3mm; top:1.2mm; font-family:var(--font-playfair),serif; font-size:calc(20pt * var(--k,1)); line-height:1; color:var(--amber); font-style:normal; }
  #deck-a4 .bubble:nth-child(even){ margin-left:0; }

  /* ── колонки як картки ── */
  #deck-a4 .col{ background:var(--band); border-radius:5px; padding:5mm 6mm 6mm; border-top:2.5pt solid var(--amber); display:grid; grid-template-rows:subgrid; grid-row:span 2; }
  #deck-a4 .cols{ grid-template-rows:auto 1fr; }
  #deck-a4 .col h3{ border-bottom:0; padding-bottom:1mm; display:flex; align-items:flex-start; align-self:start; flex-wrap:wrap; }
  #deck-a4 .cols{ align-items:stretch; }

  /* ── кроки як таймлайн ── */
  #deck-a4 .step{ grid-template-columns:8mm var(--lw,80mm) 1fr; column-gap:5mm; border-top:0; padding:calc(3.6mm * var(--k,1)) 0; align-items:start; }
  #deck-a4 .step::before{ content:""; position:absolute; left:2.9mm; top:0; bottom:0; width:1px; background:var(--line); }
  #deck-a4 .step{ position:relative; }
  #deck-a4 .step:first-child::before{ top:50%; }
  #deck-a4 .step:last-child::before{ bottom:50%; }
  #deck-a4 .step .dot{ width:6mm; height:6mm; border-radius:99px; background:var(--sheet); border:1.7pt solid var(--amber); position:relative; z-index:1; margin-top:.15em; box-shadow:0 0 0 2mm var(--sheet); }
  #deck-a4 .step .dot::after{ content:""; position:absolute; inset:1.5mm; border-radius:99px; background:var(--amber); }

  /* ── цитата на всю сторінку (text без заголовка, лише callout) ── */
  #deck-a4 .qp{ display:grid; grid-template-columns:1fr 128mm; gap:16mm; flex:1; align-items:center; min-height:0; margin-top:4mm; }
  #deck-a4 .qp .q{ font-family:var(--font-spectral),serif; font-style:italic; font-size:26pt; line-height:1.32; color:var(--ink); max-width:130mm; }
  #deck-a4 .qp .q::before{ content:"“"; display:block; font-family:var(--font-playfair),serif; font-style:normal; font-size:80pt; line-height:.55; color:var(--amber); margin-bottom:4mm; }
  #deck-a4 .qp .fig{ width:128mm; height:118mm; overflow:hidden; border-radius:0; box-shadow:none; }
  #deck-a4 .qp .fig img{ width:100%; height:100%; object-fit:cover; object-position:42% 28%; display:block; transform:scale(1.28); transform-origin:42% 28%; }

  /* ── галерея психотипів: кольорова смуга ── */
  #deck-a4 .gal[data-chip="red"] img{ border-top:5pt solid #D9342B; }
  #deck-a4 .gal[data-chip="yellow"] img{ border-top:5pt solid #F2C230; }
  #deck-a4 .gal[data-chip="blue"] img{ border-top:5pt solid #2F62C7; }
  #deck-a4 .gal img{ height:108mm; box-shadow:0 10px 26px rgba(60,40,15,.14); object-position:center 25%; }
  #deck-a4 .gal figure:has(figcaption:not(:empty)) img{ object-fit:cover; object-position:center; height:100mm; mix-blend-mode:multiply; border:0; }

  /* ── таблиці: зебра ── */
  #deck-a4 tbody tr:nth-child(even) td{ background:rgba(244,236,220,.55); }
  #deck-a4 td:first-child{ padding-left:2mm; }

  /* ── фінал/контакти ── */
  #deck-a4 .t-closing .wrap{ grid-template-columns:1fr 78mm; }
  #deck-a4 .t-closing .wrap > img{ width:78mm; height:98mm; }
  #deck-a4 .t-closing ul.ct{ font-size:12.5pt; gap:2.5mm; }

  /* ── робочі аркуші: порожні клітинки/картки з лінійками для письма ── */
  #deck-a4 .notes{ flex:1; min-height:0; display:flex; flex-direction:column; padding-top:6mm; }
  #deck-a4 .notes .lab{ margin-top:0; }
  #deck-a4 .notes .lines{ flex:1; min-height:0; background:linear-gradient(to top,var(--line) .25mm,transparent .25mm) left bottom / 100% 8.6mm repeat-y; margin-top:2mm; }
  #deck-a4 table.ws td{ height:calc(var(--rowh,18mm) * var(--k,1)); vertical-align:top; padding-top:3mm; }
  #deck-a4 table.ws td:empty{ background-image:linear-gradient(to top,var(--line) .25mm,transparent .25mm); background-size:100% 8.6mm; background-position:left bottom; background-repeat:repeat-y; background-origin:content-box; background-clip:content-box; }
  #deck-a4 table.ws.c3 th:first-child{ width:40%; } #deck-a4 table.ws.c3 th:nth-child(2){ width:18%; } #deck-a4 table.ws.c3 th:last-child{ width:42%; }
  #deck-a4 table.ws.c3[data-num] th:first-child{ width:6%; } #deck-a4 table.ws.c3[data-num] th:nth-child(2){ width:52%; }
  #deck-a4 table.ws.c4 th:nth-child(2), #deck-a4 table.ws.c4 th:nth-child(3){ width:35%; } #deck-a4 table.ws.c4 th:last-child{ width:20%; }
  #deck-a4 table.ws td:first-child{ width:auto; }
  #deck-a4 .card .t:empty{ flex:1; min-height:22mm; background:linear-gradient(to top,var(--line) .25mm,transparent .25mm) left bottom / 100% 8.6mm repeat-y; }
  /* ── таблиця психотипів після галереї: активний рядок ── */
  #deck-a4 table[data-hl] tr[data-chip]{ opacity:.74; }
  #deck-a4 table[data-hl] tbody tr td{ background:transparent; }
  #deck-a4 table[data-hl="red"] tr[data-chip="red"], #deck-a4 table[data-hl="yellow"] tr[data-chip="yellow"], #deck-a4 table[data-hl="blue"] tr[data-chip="blue"]{ opacity:1; }
  #deck-a4 table[data-hl="red"] tr[data-chip="red"] td, #deck-a4 table[data-hl="yellow"] tr[data-chip="yellow"] td, #deck-a4 table[data-hl="blue"] tr[data-chip="blue"] td{ background:var(--band) !important; }
  /* ── заголовки: без пробілу після дефіса, без розриву «5‑й» ── */
  #deck-a4 h1 .nosp{ display:none; }

  /* ── фінал/контакти: фото на повну висоту праворуч, як у розділах ── */
  #deck-a4 .t-closing .wrap{ display:block; margin:auto 0; padding-right:112mm; }
  #deck-a4 .t-closing .wrap > img{ position:absolute; top:0; right:0; bottom:0; width:118mm; height:100%; object-fit:cover; object-position:center 15%; border:0; padding:0; background:none; }
  #deck-a4 .t-closing .rh, #deck-a4 .t-closing .foot{ margin-right:112mm; }
  #deck-a4 .t-closing h1{ font-size:40pt; }
  #deck-a4 .t-closing .qr{ width:34mm; height:34mm; margin-top:9mm; }
  #deck-a4 table.ws tbody tr:nth-child(even) td{ background-color:transparent; }

  #deck-a4 .fullimg{ flex:1; min-height:0; display:flex; align-items:center; margin-top:8mm; }
  #deck-a4 .fullimg img{ width:100%; max-height:125mm; object-fit:contain; mix-blend-mode:multiply; display:block; }
  /* ── кнопки заміни ілюстрацій (лише в редакторі) ── */
  #deck-a4 .imgbtn{ position:absolute; z-index:5; top:3mm; right:3mm; display:inline-flex; align-items:center; gap:1.5mm; height:8mm; padding:0 3mm; border-radius:6px; border:1px solid rgba(201,138,43,.7); background:rgba(252,248,241,.96); color:#5E4C36; font:600 8.5pt var(--font-inter),system-ui,sans-serif; cursor:pointer; opacity:0; transition:opacity .15s; box-shadow:0 4px 14px rgba(60,40,15,.18); }
  #deck-a4 .sheet:hover .imgbtn, #deck-a4 .imgbtn:focus-visible{ opacity:1; }
  #deck-a4 .sheet[data-measuring] .imgbtn{ display:none; }
  #deck-a4 .imgbtn:hover{ border-color:#C4621F; color:#C4621F; }
  #deck-a4 .imgbtn.empty{ position:static; opacity:1; margin-top:4mm; align-self:flex-start; }
  #deck-a4 .withimg .fig, #deck-a4 .gal figure, #deck-a4 .fullimg, #deck-a4 .qp .fig, #deck-a4 .t-about .portrait, #deck-a4 .t-about .logowrap, #deck-a4 .t-cover .cv-r, #deck-a4 .t-closing .qrwrap{ position:relative; }
  #deck-a4 .t-about .logowrap{ display:block; }
  #deck-a4 .t-closing .qrwrap{ display:inline-block; }
  #deck-a4 .t-closing .photo{ position:absolute; top:0; right:0; bottom:0; width:118mm; }
  #deck-a4 .t-closing .photo img{ width:100%; height:100%; object-fit:cover; object-position:center 15%; display:block; }
  #deck-a4 .t-closing .wrap > img{ display:none; }
  /* ── режим показу: анімація появи елементів ── */
  @keyframes deckRise{ from{ opacity:0; transform:translateY(14px); } to{ opacity:1; transform:none; } }
  @keyframes deckFade{ from{ opacity:0; } to{ opacity:1; } }
  @keyframes deckPanel{ from{ opacity:0; transform:translateX(24px); } to{ opacity:1; transform:none; } }
  .present-mode #deck-a4 .anim-item{ animation:deckRise .6s cubic-bezier(.2,.7,.2,1) both; animation-delay:calc(var(--i,0) * 90ms); }
  .present-mode #deck-a4 .secimg.anim-item, .present-mode #deck-a4 .photo.anim-item{ animation-name:deckPanel; animation-duration:.8s; }
  .present-mode #deck-a4 .rh.anim-item, .present-mode #deck-a4 .foot.anim-item{ animation-name:deckFade; }
  .present-mode #deck-a4 .sheet{ box-shadow:none; }
  /* ── щільна верстка (deck.tight): менше повітря всередині таблиць і карток, вищий мінімальний кегль ── */
  #deck-a4.tight .sheet{ padding:9mm 12mm 7mm; }
  /* екранна версія без нотаток: розріджений вміст по вертикальному центру, картки трохи вищі */
  #deck-a4.tight .sheet[data-sparse]:not(.t-table) .pb{ justify-content:safe center; padding-bottom:10mm; }
  #deck-a4.tight .sheet[data-sparse] .card{ min-height:calc(34mm * min(var(--k,1), 1.6)); }
  #deck-a4.tight .sheet[data-sparse] .pb > h1:first-child, #deck-a4.tight .sheet[data-sparse] .body > h1:first-child{ margin-top:0; }
  #deck-a4.tight .sheet[data-sparse] .withimg{ align-items:center; }
  #deck-a4.tight .t-section.has-img .rh, #deck-a4.tight .t-section.has-img .foot, #deck-a4.tight .t-closing .rh, #deck-a4.tight .t-closing .foot{ margin-right:116mm; }
  #deck-a4.tight .t-section.has-img .secwrap{ padding-right:116mm; }
  #deck-a4.tight .t-closing .wrap{ padding-right:116mm; }
  #deck-a4.tight .withimg{ column-gap:9mm; }
  #deck-a4.tight table{ font-size:calc(11.2pt * var(--k,1)); line-height:1.3; margin-top:4mm; }
  #deck-a4.tight th{ font-size:8.4pt; padding:0 4mm 1.8mm 0; }
  #deck-a4.tight td{ padding:calc(1.9mm * var(--k,1)) 2.5mm calc(1.9mm * var(--k,1)) 0; }
  #deck-a4.tight td:first-child{ font-size:calc(11.2pt * var(--k,1)); }
  #deck-a4.tight .col{ padding:3.5mm 4.5mm 4mm; }
  #deck-a4.tight .cols{ column-gap:6mm; row-gap:4mm; margin-top:5mm; }
  #deck-a4.tight .cols[data-n="4"]{ column-gap:4mm; }
  #deck-a4.tight .cols[data-n="4"] .col{ padding:3mm 3.5mm 3.5mm; }
  #deck-a4.tight .col h3{ font-size:calc(12.5pt * var(--k,1)); padding-bottom:.5mm; min-height:0; }
  #deck-a4.tight ul.bul.sm{ gap:1.4mm; margin-top:2mm; }
  #deck-a4.tight ul.bul.sm li{ font-size:calc(11.6pt * var(--k,1)); line-height:1.32; padding-left:4.5mm; }
  #deck-a4.tight ul.bul li{ line-height:1.38; }
  #deck-a4.tight ul.bul{ gap:calc(2mm * var(--k,1)); }
  #deck-a4.tight .card{ padding:4mm 5mm 4.5mm; min-height:0; gap:1.8mm; }
  #deck-a4.tight .card .t{ font-size:calc(12.2pt * var(--k,1)); line-height:1.36; }
  #deck-a4.tight .cards{ gap:4.5mm; margin-top:5mm; }
  #deck-a4.tight .cards[data-n="7"] .card .t, #deck-a4.tight .cards[data-n="8"] .card .t{ font-size:calc(11.4pt * var(--k,1)); }
  #deck-a4.tight .step{ padding:calc(2.6mm * var(--k,1)) 0; }
  #deck-a4.tight .step .t{ font-size:calc(12.6pt * min(var(--k,1), 1.3)); line-height:1.38; }
  #deck-a4.tight .step .h{ font-size:calc(13.5pt * min(var(--k,1), 1.3)); }
  #deck-a4.tight .bubble{ padding:2.6mm 5mm 2.6mm 8mm; font-size:calc(13pt * var(--k,1)); line-height:1.32; }
  #deck-a4.tight .bubbles{ gap:calc(2.2mm * var(--k,1)); }
  #deck-a4.tight .para, #deck-a4.tight ul.bul li{ font-size:calc(12.8pt * var(--k,1)); }
  #deck-a4.tight .lead{ font-size:calc(14pt * min(var(--k,1), 1.2)); }
  #deck-a4.tight .callout{ padding:3.5mm 6mm 3.5mm 8mm; margin-top:4mm; }
  #deck-a4.tight h1{ margin-top:5mm; }
  #deck-a4.tight .rh .tag, #deck-a4.tight .foot .pg{ font-size:8.4pt; }
  #deck-a4.tight .t-about .stat .t{ font-size:9.6pt; }
  #deck-a4.tight .t-about .bottom ul.bul li{ font-size:10.2pt; line-height:1.32; }
  #deck-a4.tight .t-about .role{ font-size:11pt; }
  #deck-a4.tight .t-about .quote{ font-size:11.8pt; }
  @media print{
    @page{ size:297mm 210mm; margin:0; }
    html, body{ background:#fff !important; margin:0 !important; padding:0 !important; height:auto !important; }
    #deck-a4{ gap:0; padding:0; display:block; }
    #deck-a4 > div{ break-after:page; page-break-after:always; margin:0 auto; width:297mm; }
    #deck-a4 > div:last-child{ break-after:auto; page-break-after:auto; }
    #deck-a4 .sheet{ box-shadow:none; height:209.4mm; break-inside:avoid; page-break-inside:avoid; }
    #deck-a4 .sheet *{ break-inside:avoid; }
    #deck-a4 [contenteditable]:hover, #deck-a4 [contenteditable]:focus{ box-shadow:none; background:transparent; }
    #deck-a4 [contenteditable]:empty::before{ content:""; }
    #deck-a4 .imgbtn{ display:none !important; }
  }
  /* таблиця, у якій перша колонка — повноцінний текст (не назва рядка) */
  #deck-a4 table[data-fc="text"] td:first-child{ font-family:inherit; font-style:normal; color:var(--ink); font-size:inherit; width:auto; }
  /* «Великий друк» (Deck.big): крупніші шапки таблиць, підписи й колонтитули — для друкованих роздаткових матеріалів */
  #deck-a4.big th{ font-size:calc(8.2pt * min(max(var(--k,1), 1), 1.3)); letter-spacing:.08em; color:var(--muted); }
  #deck-a4.big td:first-child{ font-size:calc(11.5pt * var(--k,1)); }
  #deck-a4.big table[data-fc="text"] td:first-child{ font-size:inherit; }
  #deck-a4.big .foot.frh .tag, #deck-a4.big .foot.frh .pg{ font-size:8.5pt; }
  #deck-a4.big .t-about .facts li, #deck-a4.big .t-about .note{ font-size:calc(12pt * var(--k,1)); }
  /* баннер-розділ (фото зверху) у щільній верстці: шапка й футер на всю ширину (правило .tight для фото праворуч їх обрізало) */
  #deck-a4.big.tight .t-section.fit-top .rh, #deck-a4.big.tight .t-section.fit-top .foot{ margin-right:0; }
  #deck-a4.big.tight .t-section.fit-top .secwrap{ padding-right:0; }
  /* повнокадровий титул: фото на весь аркуш, затемнення зліва, світлий текст */
  #deck-a4 .t-cover .cvfull{ position:absolute; inset:0; z-index:0; }
  #deck-a4 .t-cover .cvfull img{ width:100%; height:100%; object-fit:cover; object-position:70% 30%; display:block; }
  #deck-a4 .t-cover .cvfull::after{ content:""; position:absolute; inset:0; background:linear-gradient(90deg,rgba(24,16,9,.92) 0%,rgba(24,16,9,.82) 38%,rgba(24,16,9,.35) 62%,rgba(24,16,9,0) 80%); }
  #deck-a4 .t-cover:has(.cvfull) .rh, #deck-a4 .t-cover .cv.full{ position:relative; z-index:1; }
  #deck-a4 .t-cover:has(.cvfull) .rh .wm, #deck-a4 .t-cover .cv.full h1, #deck-a4 .t-cover .cv.full .who, #deck-a4 .t-cover .cv.full .who .w{ color:#FCF8F1; }
  #deck-a4 .t-cover:has(.cvfull) .rh .wm em, #deck-a4 .t-cover .cv.full h1 em, #deck-a4 .t-cover .cv.full .eyebrow{ color:#F0B450; }
  #deck-a4 .t-cover:has(.cvfull) .rh .fill{ background:rgba(252,248,241,.35); }
  #deck-a4 .t-cover .cv.full{ grid-template-columns:150mm 1fr; }
  #deck-a4 .t-cover .cv.full .who{ border-top-color:rgba(252,248,241,.35); }
  #deck-a4 .t-cover:has(.cvfull) .band{ z-index:1; }

  /* ── «Великий друк» (Deck.big): роздаткові матеріали, текст максимально крупний ── */
  #deck-a4.big{ --faint:#6B5A45; }
  #deck-a4.big .lead, #deck-a4.big .para, #deck-a4.big ul.bul, #deck-a4.big .steps, #deck-a4.big .bubbles{ max-width:none; }
  #deck-a4.big .lead{ font-size:calc(12.6pt * var(--k,1)); }
  #deck-a4.big .sheet:not(.t-cover):not(.t-section):not(.t-closing) > .pb{ justify-content:flex-start; }
  #deck-a4.big .callout{ font-style:normal; }
  #deck-a4.big ul.bul li[data-num]{ padding-left:1.35em; text-indent:-1.35em; }
  #deck-a4.big ul.bul li[data-sub]{ margin-left:1.35em; }
  #deck-a4.big th{ font-family:var(--font-inter),sans-serif; font-weight:600; font-size:calc(9.6pt * min(max(var(--k,1), 1), 1.3)); letter-spacing:.01em; text-transform:none; color:var(--ink); }
  #deck-a4.big td:first-child{ font-family:var(--font-inter),sans-serif; font-style:normal; font-weight:600; color:#9A4A16; font-size:calc(10.5pt * var(--k,1)); }
  #deck-a4.big table[data-fc="text"] td:first-child{ font-weight:400; color:var(--ink); font-size:inherit; }
  #deck-a4.big td.wide{ font-weight:400 !important; color:var(--ink) !important; font-size:inherit !important; background:var(--band); padding:3mm 4mm !important; border-left:2.5pt solid var(--amber); }
  #deck-a4.big table:not(.ws)[data-cols="3"]{ table-layout:fixed; }
  #deck-a4.big table:not(.ws)[data-cols="3"] th:nth-child(1){ width:20%; } #deck-a4.big table:not(.ws)[data-cols="3"] th:nth-child(2){ width:34%; }
  #deck-a4.big table:not(.ws)[data-cols="2"]:not([data-fc="text"]){ table-layout:fixed; } #deck-a4.big table:not(.ws)[data-cols="2"]:not([data-fc="text"]) th:first-child{ width:24%; }
  #deck-a4.big table.ws td{ font-size:calc(11pt * var(--k,1)); }
  #deck-a4.big table.ws tr[data-filled] td{ height:auto; padding-bottom:3mm; }
  #deck-a4.big table.ws td:empty{ background-image:linear-gradient(to top,#B9AA92 .3mm,transparent .3mm); background-size:100% 10mm; }
  #deck-a4.big .foot.frh .tag, #deck-a4.big .foot.frh .pg{ font-size:9pt; color:var(--muted); }
  #deck-a4.big .t-section.fit-top .secimg::after{ background:linear-gradient(180deg,rgba(20,12,6,.62),rgba(20,12,6,0) 38%); }
  #deck-a4.big .t-closing ul.ct{ font-family:var(--font-inter),sans-serif; font-size:15pt; color:var(--ink); gap:2.5mm; }
  #deck-a4.big .t-closing .sub{ font-size:14pt; }
  #deck-a4.big .t-cover .who .w{ color:var(--muted); }
  #deck-a4.big ul.bul.c2{ display:block; columns:2; column-gap:12mm; }
  #deck-a4.big ul.bul.c2 li{ break-inside:avoid; margin-bottom:calc(2.2mm * var(--k,1)); }
  #deck-a4.big ul.bul li[data-sub]{ margin-top:calc(-1mm * var(--k,1)); }
  #deck-a4.big ul.bul.c2 li[data-sub]{ margin-top:0; margin-bottom:calc(1.2mm * var(--k,1)); }
  #deck-a4.big .lead, #deck-a4.big .callout{ white-space:pre-line; }
  #deck-a4.big table[data-cols="8"] th:first-child{ width:19%; }
  #deck-a4 .t-cover .cv.full .eyebrow{ position:static; text-align:left; margin-bottom:6mm; }
  #deck-a4 .t-cover .cv.full .who p{ white-space:pre-line; }
  #deck-a4.big .step .t{ font-size:calc(12.6pt * var(--k,1)); }
  #deck-a4.big .step .h{ font-size:calc(13.5pt * min(var(--k,1), 1.5)); }
  #deck-a4.big table:not(.ws) td{ padding-top:calc(1.9mm * var(--k,1)); padding-bottom:calc(1.9mm * var(--k,1)); }
  #deck-a4.big table{ line-height:1.36; }
  /* робочі аркуші у «великому друці»: висота рядків для запису не залежить від кегля — кегль не зменшується через них */
  #deck-a4.big table.ws td{ height:var(--rowh,18mm); }
  #deck-a4.big table.ws tr[data-filled] td{ height:auto; }
  /* раунд 3 аудиту: типографіка друку */
  #deck-a4.big p, #deck-a4.big li, #deck-a4.big td, #deck-a4.big .callout, #deck-a4.big .lead{ text-wrap:pretty; }
  #deck-a4.big ul.bul li[data-num]{ padding-left:1.12em; text-indent:-1.12em; }
  #deck-a4.big ul.bul li::before{ width:5.5pt; height:5.5pt; top:.5em; }
  #deck-a4.big ul.bul.has-sub > li:not([data-sub]) b{ font-weight:700; }
  #deck-a4.big .t-table .lead, #deck-a4.big .t-diagram .lead{ margin-top:2.5mm; }
  #deck-a4.big table{ margin-top:4mm; }
  #deck-a4.big table:not(.ws) td{ padding-top:calc(1.5mm * var(--k,1)); padding-bottom:calc(1.5mm * var(--k,1)); }
  #deck-a4.big table[data-num][data-cols="3"]{ table-layout:fixed; }
  #deck-a4.big table[data-num][data-cols="3"] td:nth-child(1){ width:8%; } #deck-a4.big table[data-num][data-cols="3"] td:nth-child(2){ width:50%; }
  #deck-a4.big table[data-cols="8"] th:first-child{ width:24%; }
  #deck-a4.big table[data-cols="8"] td:not(:first-child), #deck-a4.big table[data-cols="8"] th:not(:first-child){ text-align:right; font-variant-numeric:tabular-nums; }
  #deck-a4.big .withimg .fig{ justify-content:flex-end; width:calc(78mm * min(var(--k,1), 1.3)); }
  #deck-a4.big .withimg .callout{ margin-bottom:6mm; }
  #deck-a4.big .t-closing .photo img{ object-position:30% 12%; }
  #deck-a4.big .t-closing .qrwrap::after{ content:"Instagram"; display:block; font-family:var(--font-inter),sans-serif; font-size:10pt; color:var(--muted); margin-top:1.5mm; text-align:center; }
  #deck-a4 .t-cover:has(.cvfull) .who .w{ position:static !important; margin-top:2.5mm !important; color:#E8DCC8 !important; font-size:10pt !important; }
  #deck-a4 .t-cover .cv.full .who p{ font-size:13pt; }
  #deck-a4 .t-cover:has(.cvfull) .rh .colg:not(.light){ filter:brightness(0) invert(1); }
  #deck-a4 ul.bul li[data-head]{ padding-left:0; margin-top:calc(1.5mm * var(--k,1)); }
  #deck-a4 ul.bul li[data-head]::before{ display:none; }
  /* титул «фото-смуга»: фото на верхні ~52%, під ним кремове поле з назвою */
  #deck-a4 .t-cover .cvband{ position:absolute; left:0; right:0; top:27mm; height:44%; z-index:0; overflow:hidden; }
  #deck-a4 .t-cover .cvband img{ width:100%; height:100%; object-fit:cover; object-position:center 78%; display:block; }
  #deck-a4 .t-cover .cvband::after{ content:none; }
  #deck-a4 .t-cover:has(.cvband) .rh{ position:relative; z-index:1; }

  #deck-a4 .t-cover .cv.bnd{ position:relative; z-index:1; grid-template-columns:1fr; padding-top:92mm; }
  #deck-a4 .t-cover .cv.bnd .cv-l{ padding-top:0 !important; }
  #deck-a4 .t-cover .cv.bnd .eyebrow{ position:static !important; text-align:left !important; margin:0 0 4mm !important; color:var(--acc) !important; }
  #deck-a4 .t-cover .cv.bnd h1{ font-size:44pt; margin-top:0; }
  #deck-a4 .t-cover .cv.bnd h1 em{ display:inline; font-size:inherit; margin:0; }
  #deck-a4 .t-cover .cv.bnd .who{ margin-top:7mm; }
  #deck-a4 .t-cover .cv.bnd .who p{ white-space:pre-line; font-size:13pt; }
  #deck-a4 .t-cover .cv.bnd{ padding-top:98mm; }
  #deck-a4 .t-cover .cv.bnd .cv-r{ display:none; }
  /* логотип клієнта — оптично рівний нашому (висота великих літер) */
  #deck-a4.big .t-cover .rh .colg{ height:9.5mm !important; }
  #deck-a4.big .t-cover .rh .cox{ color:var(--muted); }
  #deck-a4 .t-cover:has(.cvfull) .rh .cox{ color:rgba(252,248,241,.7); }
  #deck-a4.big .t-cover:has(.cv.amp) .who .w{ margin-right:-.3em; }
  /* біо: фото до правого поля */
  #deck-a4.big .withimg{ grid-template-columns:1fr calc(92mm * min(var(--k,1), 1.3)); }
  #deck-a4.big .withimg .fig{ width:100%; }
  /* фінал: без чужого напису на фоні */
  #deck-a4.big .t-closing .photo{ overflow:hidden; }
  #deck-a4.big .t-closing .photo img{ object-position:50% 20%; }
  /* таблиці: перша колонка тим самим кеглем, темніший помаранчевий */
  #deck-a4.big td:first-child{ font-size:inherit; color:#8E4213; }
  /* раунд 4: заголовок на одній висоті на всіх сторінках; маркери пропорційні кеглю; «×» помітний */
  #deck-a4.big .sheet:not(.t-cover):not(.t-section):not(.t-closing) h1{ margin-top:0 !important; }
  #deck-a4.big ul.bul li::before, #deck-a4.big ul.bul.sm li::before{ width:calc(3.4pt * var(--k,1)); height:calc(3.4pt * var(--k,1)); top:.62em; }
  #deck-a4.big .t-cover .rh .cox{ font-size:22pt !important; font-weight:400 !important; color:var(--ink) !important; opacity:.55; margin:0 1.5mm !important; }
  #deck-a4 .t-cover:has(.cvfull) .rh .cox{ color:#FCF8F1 !important; opacity:.8; }
  #deck-a4.big table:not(.ws)[data-cols="3"] th:nth-child(1){ width:19%; } #deck-a4.big table:not(.ws)[data-cols="3"] th:nth-child(2){ width:32%; }
  /* раунд 5 */
  #deck-a4.big ul.bul li[data-caps]{ margin-top:calc(2.4mm * var(--k,1)); color:var(--ink); letter-spacing:.02em; }
  #deck-a4.big ul.bul li[data-caps]:first-child, #deck-a4.big ul.bul li[data-caps][style*="column"]{ margin-top:0; }
  #deck-a4.big table:not(.ws)[data-cols="3"] td{ padding-top:calc(1mm * var(--k,1)); padding-bottom:calc(1mm * var(--k,1)); line-height:1.3; }
  #deck-a4.big table[data-cols="8"] th:first-child{ width:30% !important; }
  #deck-a4.big table[data-cols="8"] th:first-child{ width:27%; }
  #deck-a4.big .withimg .callout{ font-size:calc(12.6pt * var(--k,1)); }
  #deck-a4.big td{ padding-right:3mm; hyphens:manual; }
  #deck-a4.big td:first-child{ overflow-wrap:normal; }
  #deck-a4 .t-cover .cv.bnd .who .w{ position:absolute !important; right:0 !important; bottom:14mm !important; }
  #deck-a4.big .t-table .callout{ font-size:calc(12.6pt * var(--k,1)); }
  #deck-a4.big table[data-cols="8"] td:last-child{ white-space:pre; }
  /* підібрані ширини колонок (data-opt): перший рядок задає ширини при table-layout:fixed */
  #deck-a4.big table[data-opt] th:nth-child(1), #deck-a4.big table[data-opt] thead[style*="none"] + tbody tr:first-child > td:not(.wide):nth-child(1){ width:var(--w1) !important; }
  #deck-a4.big table[data-opt][data-cols="3"] th:nth-child(2), #deck-a4.big table[data-opt][data-cols="3"] thead[style*="none"] + tbody tr:first-child > td:not(.wide):nth-child(2){ width:var(--w2) !important; }
  #deck-a4.big .sheet:not(.t-about):not(.t-cover):not(.t-section):not(.t-closing) .pb::after{ height:6mm; }
  /* дрібніші сторінки: трохи менше повітря над заголовком і над колонтитулом — на користь кегля */
  #deck-a4.big.frh .sheet:not(.t-cover):not(.t-section):not(.t-closing):not(.t-about) > .pb{ padding-top:6mm; }
  #deck-a4.big .sheet:not(.t-about):not(.t-cover):not(.t-section):not(.t-closing) .pb::after{ height:5mm; }
  #deck-a4.big .t-table table{ margin-top:2.5mm; }
`;
const DECK_CSS = DECK_CSS_BASE + DIAGRAM_CSS;

type Patch = (patch: Record<string, unknown>) => void;

/** Типографічні заміни лише для показу (у дані повертаються звичайні пробіли/дефіси): «5‑й крок», прийменники не висять. */
function typo(v: string): string {
  return v
    .replace(/(\d)-(й|го|му|ша|ші|ім|ий|ої|ому)(?!\p{L})/gu, "$1\u2011$2")
    .replace(/(\d\u2011й)\s+(крок)/gu, "$1\u00A0$2")
    .replace(/(?<=^|[\s(«])([\p{L}]{1,2})\s+(?=\S)/gu, "$1\u00A0")
    .replace(/\s+—/g, "\u00A0—")
    .replace(/(^|[\s(«/])(\p{L}{1,6})-(?=\p{L})/gu, "$1$2\u2011")
    .replace(/(^|\s)(\d{1,3})\s+(?=\p{L})/gu, "$1$2\u00A0");
}

/* ───────── editable primitives ───────── */

/** Мова деки для службових підписів (Нотатки, Розділ, підпис у колонтитулі…). */
const LangCtx = createContext(deckT("uk"));

/** Показ тексту з **жирним**: шматки з розмітки, типографіка — в кожному. */
function rich(v: string) {
  const parts = splitBold(v);
  if (parts.length === 1 && !parts[0].b) return typo(v);
  return parts.map((x, i) => (x.b ? <b key={i}>{typo(x.t)}</b> : <span key={i}>{typo(x.t)}</span>));
}
/** Текст редагованого елемента назад у розмітку: <b>/<strong> (у т.ч. з ⌘B) → **…**. */
function readRich(el: HTMLElement | null): string {
  if (!el) return "";
  const marks: Text[] = [];
  el.querySelectorAll("b,strong").forEach((b) => { const a = document.createTextNode("**"), z = document.createTextNode("**"); b.prepend(a); b.append(z); marks.push(a, z); });
  const t = el.innerText;
  marks.forEach((m) => m.remove());
  return t.replace(/ /g, " ").replace(/‑/g, "-")
    .replace(/\*\*(\s*)\*\*/g, "$1")
    .replace(/\*\*(\s+)([^*]*?)\*\*/g, "$1**$2**")
    .replace(/\*\*([^*]*?)(\s+)\*\*/g, "**$1**$2")
    .trim();
}

function E({
  tag: Tag = "span",
  value,
  onChange,
  className,
  ph,
  editable,
  attrs,
  fk,
}: {
  tag?: keyof JSX.IntrinsicElements;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  ph?: string;
  editable: boolean;
  attrs?: Record<string, unknown>;
  fk?: string; // ключ поля для індивідуального розміру (page.fz)
}) {
  const ref = useRef<HTMLElement>(null);
  const T = Tag as any;
  const fz = useFz(fk);
  return (
    <T
      {...attrs}
      {...fz}
      ref={ref}
      className={className}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      data-ph={ph || "…"}
      key={value}
      onBlur={() => {
        const v = readRich(ref.current);
        if (v !== value) onChange(v);
      }}
    >
      {rich(value)}
    </T>
  );
}

/** Список із двох груп («3 основных:» … / «Дополнительные…:» …): індекс заголовка другої групи — перша група йде на всю ширину, друга у дві колонки. */
function twoGroups(items: string[]): number | undefined {
  const gh = items.map((t, j) => (/^\*\*[^*]+:\*\*$/.test(t.trim()) ? j : -1)).filter((j) => j > 0);
  return gh.length === 1 ? gh[0] : undefined;
}

function EList({
  items,
  onChange,
  className,
  editable,
  breakAt,
  spanTo,
  fk,
}: {
  fk?: string;
  items: string[];
  onChange: (v: string[]) => void;
  className?: string;
  editable: boolean;
  breakAt?: number;
  spanTo?: number; // пункти 0…spanTo (включно) — на всю ширину, решта — у дві колонки
}) {
  const ref = useRef<HTMLUListElement>(null);
  // Після кожного blur список перемонтовується (key), щоб нативно створені браузером <li>
  // (Enter у contentEditable) не лишались поруч із React-рендером і не дублювались.
  const [rev, setRev] = useState(0);
  const fzMap = useContext(FzCtx), setFz = useContext(FzSetCtx);
  return (
    <ul
      key={rev}
      ref={ref}
      className={className}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      onBlur={() => {
        const lis = Array.from(ref.current?.querySelectorAll("li") ?? []);
        const v = lis.map((li) => { const t = readRich(li); return t ? (li.dataset.sub ? "- " : "") + t : ""; }).filter(Boolean);
        if (JSON.stringify(v) !== JSON.stringify(items)) {
          const next = v.length ? v : [""];
          onChange(next);
          // розміри окремих пунктів ідуть за своїм текстом, коли пункти вставили чи видалили
          if (fk && setFz) { const re = remapListFz(fzMap, fk, items, next); if (re !== fzMap) setFz(re); }
        }
        setRev((r) => r + 1);
      }}
    >
      {items.map((it, i) => (
        <li key={i} {...fzAttrs(fzMap, fk ? `${fk}.${i}` : undefined)} style={spanTo !== undefined && i <= spanTo ? { columnSpan: "all" } : breakAt === i ? { breakBefore: "column" } : undefined} data-head={/^\*\*[^*]+\*\*$/.test(it.trim()) ? "1" : undefined} data-caps={!/^- /.test(it) && /\p{Lu}{3}/u.test(it) && !/\p{Ll}/u.test(it.replace(/\*\*/g, "")) ? "1" : undefined} data-num={/^\s*\d+\s*[.)]/.test(it) ? "1" : undefined} data-sub={/^- /.test(it) ? "1" : undefined}>{rich(it.replace(/^- /, ""))}</li>
      ))}
    </ul>
  );
}

function WithImg({ image, children, pick, onPick }: { image?: string; children: React.ReactNode; pick?: PickImage; onPick?: (v: string) => void }) {
  if (!image) return <>{children}{pick && onPick ? <ImgBtn pick={pick} optional onPick={onPick} empty /> : null}</>;
  return (
    <div className="withimg">
      <div className="body">{children}</div>
      <div className="fig"><img src={image} alt="" />{pick && onPick ? <ImgBtn pick={pick} current={image} optional onPick={onPick} /> : null}</div>
    </div>
  );
}

function chipFor(text: string): string | null {
  const t = text.trim().toLowerCase();
  if (t.startsWith("червон")) return "red";
  if (t.startsWith("жовт")) return "yellow";
  if (t.startsWith("син")) return "blue";
  return null;
}

function Title({ p, set, editable, className }: { p: { title: string; titleEm: string }; set: Patch; editable: boolean; className?: string }) {
  return (
    <h1 className={className}>
      <E fk="title" value={p.title} onChange={(v) => set({ title: v })} editable={editable} ph="Заголовок" />{/-$/.test(p.title.trim()) ? "" : " "}
      <em>
        <E fk="titleEm" value={p.titleEm} onChange={(v) => set({ titleEm: v })} editable={editable} ph="акцент" />
      </em>
    </h1>
  );
}

/* ───────── pages ───────── */

function textLen(p: DeckPage): number {
  const walk = (v: unknown): number =>
    typeof v === "string" ? v.length : Array.isArray(v) ? v.reduce((a: number, x) => a + walk(x), 0) : v && typeof v === "object" ? Object.entries(v).reduce((a, [k, x]) => (k === "id" || k === "type" || k === "image" || k === "logos" || k === "qr" || k === "src" ? a : a + walk(x)), 0) : 0;
  return walk(p);
}
function density(p: DeckPage): { k: number; kh: number } {
  if (p.type === "cover" || p.type === "section" || p.type === "closing" || p.type === "about") return { k: 1, kh: 1 };
  let n = textLen(p);
  if ("image" in p && p.image) n *= 1.6;
  if (p.type === "bullets" && p.variant === "cards") n *= 1.35;
  if (p.type === "table") n *= 1.4;
  const k = n < 220 ? 1.5 : n < 420 ? 1.32 : n < 700 ? 1.16 : n < 1100 ? 1.05 : 1;
  const cap = p.type === "table" ? 1.25 : 1.5;
  return { k: Math.min(k, cap), kh: Math.min(1.2, k) };
}

const ANIM_SEL = [".rh", ".secimg", ".photo", ".num", ".kicker", ".sec-t h1", ".sec-t .sub", ".cv-l > *", ".cv-r > img", ".cv-r .bigamp", ".cv-r .phimg", ".hero .lab", ".hero h1", ".hero .role", ".hero .quote", ".stat", ".portrait", ".bottom > *",
  ".pb > h1", ".pb > .lead", ".pb > .para", ".pb > .callout", ".body > h1", ".body > .lead", ".body > .para", ".body > .callout", ".fig", ".fullimg", ".qp > *", "ul.bul > li", ".card", ".bubble", ".col", ".step", "thead", "tbody tr", ".gal figure", ".notes", ".wrap > div > *", ".foot"].join(",");

function Sheet({ deck, i, cls, page, children, editable, onRunhead, animate }: { deck: Deck; i: number; cls?: string; page: DeckPage; children: React.ReactNode; editable: boolean; onRunhead: (v: string) => void; animate?: number }) {
  const t = useContext(LangCtx);
  const d = density(page);
  const ref = useRef<HTMLElement>(null);
  // Режим показу: пронумерувати елементи в порядку появи й перезапустити анімацію.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || animate === undefined) return;
    const seen = new Set<Element>();
    const items = Array.from(el.querySelectorAll<HTMLElement>(ANIM_SEL)).filter((x) => { if (seen.has(x)) return false; seen.add(x); return true; });
    items.forEach((x) => { x.classList.remove("anim-item"); });
    void el.offsetWidth; // перезапуск анімації при повторному показі тієї ж сторінки
    items.forEach((x, k) => { x.style.setProperty("--i", String(k)); x.classList.add("anim-item"); });
    return () => { items.forEach((x) => { x.classList.remove("anim-item"); x.style.removeProperty("--i"); }); };
  }, [animate, page]);
  const [k, setK] = useState(d.k);
  // Синхронно підбираємо масштаб: від розрахункового вниз, поки вміст не вміститься (детерміновано для друку).
  // Повторюємо після завантаження шрифтів і перед друком — метрики fallback-шрифтів інші.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const pb = el.querySelector<HTMLElement>(":scope > .pb");
      const notes = el.querySelector<HTMLElement>(".notes");
      if (notes) notes.style.display = "";
      el.setAttribute("data-measuring", "1"); // редакторські кнопки не беруть участі у вимірюванні
      const fits = () => !(el.scrollHeight > el.clientHeight + 2 || (pb ? pb.scrollHeight > pb.clientHeight + 2 : false));
      // «великий друк» (Deck.big): стартуємо з максимуму і зменшуємо, поки вміщається, — текст максимально крупний
      const fixedType = page.type === "cover" || page.type === "section" || page.type === "closing" || page.type === "about";
      let v = deck.big && !fixedType ? Math.round(1.9 * (page.fs ?? 1) * 100) / 100 : Math.round(d.k * (page.fs ?? 1) * (deck.fs ?? 1) * 100) / 100;
      const floor = Math.min(page.type === "table" ? 0.7 : 0.62, v);
      const apply = () => { el.style.setProperty("--k", String(v)); el.style.setProperty("--kh", String(v >= 1.1 ? 1.1 : v < 0.95 ? 0.9 : 1)); };
      apply();
      // розміри окремих полів (page.fz) під час підбору вимкнені: кегль сторінки рахується так, ніби їх немає,
      // тож зміна одного поля не зачіпає решту тексту сторінки
      el.querySelectorAll<HTMLElement>("[data-fzs]").forEach((n) => { n.style.removeProperty("font-size"); n.removeAttribute("data-fzs"); n.removeAttribute("data-fzb"); });
      // підібрані раніше ширини колонок скидаємо: кожен підбір починається зі стандартних (детерміновано)
      el.querySelectorAll<HTMLElement>("table[data-opt]").forEach((t) => { t.removeAttribute("data-opt"); t.style.removeProperty("--w1"); t.style.removeProperty("--w2"); });
      apply();
      const v0 = v;
      const st = deck.big ? 0.02 : 0.04; // «великий друк»: крок дрібніший — кегль ближче до максимуму
      for (let i = 0; i < 100 && !fits() && v > floor; i++) { v = Math.round((v - st) * 100) / 100; apply(); }
      // «великий друк», таблиці на 2–3 колонки: підбираємо ширини колонок, за яких кегль найбільший,
      // але так, щоб жодне слово не вилазило за межі клітинки (слова не розриваються)
      const tb = deck.big && page.type === "table" ? el.querySelector<HTMLTableElement>("table[data-cols]:not(.ws):not([data-num]):not([data-fc])") : null;
      const nc = tb ? Number(tb.dataset.cols) : 0;
      const headless = !!tb && tb.querySelector<HTMLElement>("thead")?.style.display === "none";
      const wideFirst = headless && !!tb!.querySelector("tbody tr:first-child > td.wide"); // ширини задає перший рядок — з об'єднаною клітинкою не задати
      if (tb && (nc === 2 || nc === 3) && v < v0 && !wideFirst) {
        const vFound = v; // кегль, знайдений зі стандартними ширинами
        const def = nc === 3 ? [19, 32] : [24];
        const setW = (w: number[]) => { tb.setAttribute("data-opt", w.join(",")); tb.style.setProperty("--w1", w[0] + "%"); if (w[1]) tb.style.setProperty("--w2", w[1] + "%"); };
        // «чисто»: жодне слово не заходить у правий відступ клітинки (інакше колонки злипаються: «АссортиментнаяПеречень»)
        const rng = document.createRange();
        const clean = () => !Array.from(tb.querySelectorAll<HTMLElement>("td,th")).some((c) => {
          if (c.scrollWidth > c.clientWidth + 1) return true;
          const lim = c.getBoundingClientRect().right - parseFloat(getComputedStyle(c).paddingRight || "0") + 0.5;
          rng.selectNodeContents(c);
          return Array.from(rng.getClientRects()).some((r) => r.width > 0 && r.right > lim);
        });
        const dist = (w: number[]) => w.reduce((a, x, j) => a + Math.abs(x - def[j]), 0);
        const cands = (nc === 3 ? [15, 17, 19, 21, 23, 25].flatMap((a) => [24, 27, 30, 32, 35, 38, 41].map((b) => [a, b])) : [16, 18, 20, 22, 24, 26, 28, 30, 33].map((a) => [a])).sort((x, y) => dist(x) - dist(y));
        setW(def); apply();
        let best = clean() ? v : 0, bw = def, bestH = tb.offsetHeight;
        for (const c of cands) {
          setW(c);
          const up = Math.round((Math.max(best, floor) + st) * 100) / 100;
          if (up <= v0 + 1e-9) {
            v = up; apply();
            if (fits() && clean()) {
              while (v + st <= v0 + 1e-9) { v = Math.round((v + st) * 100) / 100; apply(); if (!fits() || !clean()) { v = Math.round((v - st) * 100) / 100; break; } }
              apply(); best = v; bw = c; bestH = tb.offsetHeight; continue;
            }
          }
          // той самий кегль — беремо варіант із меншою кількістю рядків (менше переносів)
          if (best > 0) { v = best; apply(); if (fits() && clean() && tb.offsetHeight < bestH - 2) { bw = c; bestH = tb.offsetHeight; } }
        }
        if (best > 0) {
          setW(bw); v = best; apply();
          for (let i = 0; i < 80 && !fits() && v > floor; i++) { v = Math.round((v - st) * 100) / 100; apply(); }
        } else {
          // жоден варіант без розриву слів не знайшовся (довга адреса, число тощо) — лишаємо стандартні ширини і знайдений кегль
          tb.removeAttribute("data-opt"); tb.style.removeProperty("--w1"); tb.style.removeProperty("--w2");
          v = vFound; apply();
        }
      }
      // тепер — розмір окремих полів: ЛИШЕ кегль позначеного поля (і вкладених у нього елементів) = базовий × множник.
      // Спершу читаємо всі базові кеглі, потім записуємо (інакше вкладені успадкували б уже збільшений).
      const plan: { n: HTMLElement; px: number; b: number }[] = [];
      el.querySelectorAll<HTMLElement>("[data-fz]").forEach((f) => {
        const z = Number(f.dataset.fz);
        if (!(z > 0) || Math.abs(z - 1) < 0.001) return;
        [f, ...Array.from(f.querySelectorAll<HTMLElement>("*"))].forEach((n) => { if (n.closest(".imgbtn")) return; const b = parseFloat(getComputedStyle(n).fontSize); if (b > 0) plan.push({ n, px: b * z, b }); });
      });
      plan.forEach(({ n, px, b }) => { n.style.setProperty("font-size", px.toFixed(2) + "px", "important"); n.dataset.fzs = "1"; n.dataset.fzb = String(b); });
      // збільшене поле не вміщається — позначаємо аркуш (редактор покаже попередження), решту тексту не зменшуємо
      if (plan.length && !fits()) el.setAttribute("data-over", "1"); else el.removeAttribute("data-over");
      // поле «Нотатки» лишаємо тільки якщо на нього є хоча б 18 мм
      if (notes && notes.getBoundingClientRect().height < 98) { notes.style.display = "none"; }
      el.removeAttribute("data-measuring");
      setK(v);
    };
    fit();
    const fonts = (document as any).fonts;
    if (fonts?.ready) fonts.ready.then(fit);
    // (без beforeprint: у режимі друку метрики інші, і підбір «з'їжджає» до мінімуму)
    const t = window.setTimeout(fit, 600);
    return () => window.clearTimeout(t);
  }, [d.k, page, deck.fs, deck.big]);
  return (
    <section ref={ref} className={`sheet ${cls ?? ""}${page.type === "section" && page.image ? " has-img" + (page.fit === "top" ? " fit-top" : "") : ""}${page.type === "section" && /^\d+-й крок/i.test(page.title) ? " is-step" : ""}`} data-page={i + 1} data-sparse={k >= 1.32 ? "1" : undefined} style={{ ["--k" as any]: k, ["--kh" as any]: Math.min(1.2, k) }}>
      <div className="rh">
        <span className="wm">Pan<em>&amp;</em>Partners</span>
        {page.type === "cover" && (page.variant === "amp" || page.variant === "photo" || page.variant === "full" || page.variant === "band") && deck.logo ? (<><span className="cox" aria-hidden>×</span><img className={"colg" + (page.variant === "full" && deck.logoLight ? " light" : "")} src={page.variant === "full" && deck.logoLight ? deck.logoLight : deck.logo} alt="" /></>) : null}
        <span className="fill" />
        {deck.footRunhead ? null : <E value={deck.runhead} onChange={onRunhead} editable={editable} className="tag" ph="колонтитул" />}
      </div>
      <div className="pb">{children}</div>
      <div className={"foot" + (deck.footRunhead ? " frh" : "")}>
        {deck.footRunhead ? (
          <E value={deck.runhead} onChange={onRunhead} editable={editable} className="tag" ph="колонтитул" />
        ) : (
          <span className="tl">
            <b>{t.trainer}</b> · Pan&amp;Partners · pan-partners.agency
          </span>
        )}
        <span className="pg">
          {deck.footRunhead ? String(i + 1).padStart(2, "0") : `${String(i + 1).padStart(2, "0")} / ${String(deck.pages.length).padStart(2, "0")}`}
        </span>
      </div>
    </section>
  );
}

/** Ініціали з першого рядка «Імʼя Прізвище» — заглушка аватара, поки фото не додано. */
function initials(who: string) {
  return (who.split("\n")[0] || "").trim().split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

export type PickImage = (current: string | undefined, optional: boolean) => Promise<string | null>;

export function DeckPages({
  deck,
  editable = false,
  onPatch,
  onRunhead,
  renderControls,
  only,
  pickImage,
  animate,
}: {
  deck: Deck;
  only?: number;
  editable?: boolean;
  onPatch?: (index: number, patch: Record<string, unknown>) => void;
  onRunhead?: (v: string) => void;
  renderControls?: (index: number) => React.ReactNode;
  /** Редактор: відкрити вибір зображення. Повертає новий src, "" — прибрати, null — скасовано. */
  pickImage?: PickImage;
  /** Режим показу: елементи сторінки зʼявляються з анімацією (ключ перезапускає її). */
  animate?: number;
}) {
  const rh = onRunhead ?? (() => {});
  return (
    <LangCtx.Provider value={deckT(deck.lang)}>
    <div id="deck-a4" className={[deck.caps ? "caps" : "", deck.tight ? "tight" : "", deck.footRunhead ? "frh" : "", deck.big ? "big" : ""].filter(Boolean).join(" ") || undefined}>
      <style dangerouslySetInnerHTML={{ __html: DECK_CSS }} />
      {deck.pages.map((p, i) => {
        if (only && only !== i + 1) return null;
        const set: Patch = (patch) => onPatch?.(i, patch);
        return (
          <div key={p.id} style={{ position: "relative" }}>
            {renderControls?.(i)}
            <Sheet deck={deck} i={i} cls={"t-" + p.type} page={p} editable={editable} onRunhead={rh} animate={animate}>
              <FzCtx.Provider value={p.fz}><FzSetCtx.Provider value={(next) => set({ fz: next })}>
                <PageBody p={p} set={set} editable={editable} prev={deck.pages[i - 1]} pick={editable ? pickImage : undefined} showNotes={deck.notes !== false} logo={deck.logo} big={deck.big} />
              </FzSetCtx.Provider></FzCtx.Provider>
            </Sheet>
          </div>
        );
      })}
    </div>
    </LangCtx.Provider>
  );
}

/** Кнопка «Замінити/Додати ілюстрацію» біля зображення (лише в редакторі). */
function ImgBtn({ pick, current, optional, onPick, empty }: { pick?: PickImage; current?: string; optional: boolean; onPick: (v: string) => void; empty?: boolean }) {
  if (!pick) return null;
  return (
    <button
      type="button"
      className={"imgbtn" + (empty ? " empty" : "")}
      contentEditable={false}
      title={current ? "Замінити ілюстрацію" : "Додати ілюстрацію"}
      onClick={async (ev) => { ev.preventDefault(); ev.stopPropagation(); const v = await pick(current, optional); if (v !== null) onPick(v); }}
    >
      🖼 {current ? "Замінити" : "Додати ілюстрацію"}
    </button>
  );
}

function PageBody({ p, set, editable, prev, pick, showNotes = true, logo, big }: { p: DeckPage; set: Patch; editable: boolean; prev?: DeckPage; pick?: PickImage; showNotes?: boolean; logo?: string; big?: boolean }) {
  const t = useContext(LangCtx);
  const e = editable;
  // Розріджені текстові сторінки — це роздатковий матеріал: знизу поле для нотаток (вимикається на рівні деки).
  const noImg = !("image" in p && p.image);
  const notes = showNotes && noImg && ((p.type === "bullets" && p.variant !== "bubbles") || p.type === "text" || p.type === "twocol" || p.type === "steps" || p.type === "table") ? (
    <div className="notes"><div className="lab">{t.notes}</div><div className="lines" /></div>
  ) : null;
  switch (p.type) {
    case "cover":
      return (
        <>
          {p.variant === "band" && p.image ? <div className="cvband"><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional onPick={(v) => set({ image: v || undefined })} /></div> : null}
          {p.variant === "full" && p.image ? <div className="cvfull"><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional onPick={(v) => set({ image: v || undefined })} /></div> : null}
          <div className={"cv" + (p.variant === "amp" ? " amp" : p.variant === "photo" ? " amp photo" : p.variant === "full" ? " amp full" : p.variant === "band" ? " amp bnd" : "")}>
            <div className="cv-l">
              <E fk="eyebrow" tag="p" className="eyebrow" value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} editable={e} ph="надзаголовок" />
              <Title p={p} set={set} editable={e} />
              <E fk="sub" tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="" />
              {p.who2 !== undefined && (e || p.who2.trim()) ? (
                // два тренери: кожен — фото (або ініціали, поки фото немає) + імʼя і роль, один під одним
                <div className="who av two">
                  <span className="pp">
                    {p.avatar ? <span className="avatar"><img src={p.avatar} alt="" /><ImgBtn pick={pick} current={p.avatar} optional onPick={(v) => set({ avatar: v || undefined })} /></span> : null}
                    <span className="wt">
                      <E fk="who" tag="p" value={p.who} onChange={(v) => set({ who: v })} editable={e} ph="хто проводить" />
                      <E fk="when" tag="p" className="w" value={p.when} onChange={(v) => set({ when: v })} editable={e} ph="де, коли" />
                    </span>
                  </span>
                  <span className="pp">
                    <span className={"avatar" + (p.avatar2 ? "" : " ini")}>
                      {p.avatar2 ? <img src={p.avatar2} alt="" /> : initials(p.who2)}
                      <ImgBtn pick={pick} current={p.avatar2} optional onPick={(v) => set({ avatar2: v || "" })} />
                    </span>
                    <span className="wt">
                      <E fk="who2" tag="p" value={p.who2} onChange={(v) => set({ who2: v })} editable={e} ph="другий тренер" />
                    </span>
                  </span>
                </div>
              ) : (
              <div className={"who" + (p.avatar ? " av" : "")}>
                {p.avatar ? <span className="avatar"><img src={p.avatar} alt="" /><ImgBtn pick={pick} current={p.avatar} optional onPick={(v) => set({ avatar: v || undefined })} /></span> : null}
                <span className="wt">
                  <E fk="who" tag="p" value={p.who} onChange={(v) => set({ who: v })} editable={e} ph="хто проводить" />
                  <E fk="when" tag="p" className="w" value={p.when} onChange={(v) => set({ when: v })} editable={e} ph="де, коли" />
                </span>
              </div>
              )}
            </div>
            <div className={"cv-r" + (p.variant === "amp" ? " amp" : p.variant === "photo" ? " phc" : p.variant === "full" ? " fl" : "")}>
              {p.variant === "amp" ? <span className="bigamp" aria-hidden>&amp;</span> : null}
              {p.variant === "photo" && p.image ? <img className="phimg" src={p.image} alt="" /> : null}
              {logo && !p.variant ? <img className="np-big" src={logo} alt="" /> : null}
              {!p.variant && (p.image || logo) ? <img className="ill" src={p.image || "/deck/novapay/money.png"} alt="" /> : null}
              {p.variant !== "amp" && p.variant !== "full" && p.variant !== "band" ? <ImgBtn pick={pick} current={p.image || ""} optional onPick={(v) => set({ image: v || undefined })} /> : null}
            </div>
          </div>
          <div className="band" />
        </>
      );
    case "about":
      return (
        <>
          <div className="hero">
            <div>
              <div className="lab" style={{ marginTop: "4mm" }}>{t.trainerLab}</div>
              <Title p={p} set={set} editable={e} />
              <E fk="role" tag="p" className="role" value={p.role ?? ""} onChange={(v) => set({ role: v })} editable={e} ph="" />
              <E fk="quote" tag="div" className="quote" value={p.quote ?? ""} onChange={(v) => set({ quote: v })} editable={e} ph="" />
              {p.stats && p.stats.length ? (
                <div className="stats">
                  {p.stats.map((st, k) => (
                    <div className="stat" key={k}>
                      <E fk={`stats.${k}.n`} tag="div" className="n" value={st.n} onChange={(v) => set({ stats: p.stats!.map((x, j) => (j === k ? { ...x, n: v } : x)) })} editable={e} ph="" />
                      <E fk={`stats.${k}.t`} tag="div" className="t" value={st.t} onChange={(v) => set({ stats: p.stats!.map((x, j) => (j === k ? { ...x, t: v } : x)) })} editable={e} ph="" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="portrait">
              <img src={p.image} alt="" />
              <div className="frame" />
              <ImgBtn pick={pick} current={p.image} optional={false} onPick={(v) => set({ image: v })} />
            </div>
          </div>
          <div className="bottom">
            <div>
              <div className="lab">{t.spec}</div>
              <EList fk="facts" className="bul" items={p.facts} onChange={(v) => set({ facts: v })} editable={e} />
            </div>
            <div>
              <div className="lab">{t.geo}</div>
              <E fk="note" tag="p" className="note" value={p.note} onChange={(v) => set({ note: v })} editable={e} ph="" />
              <span className="logowrap">
                {p.logos ? <img className="logos" src={p.logos} alt="" /> : null}
                <ImgBtn pick={pick} current={p.logos || undefined} optional onPick={(v) => set({ logos: v })} empty={!p.logos} />
              </span>
            </div>
          </div>
        </>
      );
    case "section":
      return (
        <>
          {p.image ? <div className={"secimg" + (p.panel ? " panel" : "")}><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional onPick={(v) => set({ image: v || undefined })} /></div> : null}
          <div className="secwrap">
            <E fk="num" tag="div" className="num serif" value={p.num} onChange={(v) => set({ num: v })} editable={e} ph="" />
            <div className="sec-t">
              {big ? null : <div className="kicker">{/^\d+-й крок/i.test(p.title) ? t.step : t.section}</div>}
              <h1>
                <E fk="title" value={p.title} onChange={(v) => set({ title: v })} editable={e} ph="Назва розділу" />
              </h1>
              <E fk="sub" tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="" />
              {!p.image ? <ImgBtn pick={pick} optional onPick={(v) => set({ image: v || undefined })} empty /> : null}
            </div>
          </div>
        </>
      );
    case "text":
      if (!p.title && !p.titleEm && !p.lead && !p.paras.length && p.image) {
        return (
          <div className="qp">
            <E fk="callout" tag="div" className="q" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="цитата" />
            <div className="fig"><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional onPick={(v) => set({ image: v || undefined })} /></div>
          </div>
        );
      }
      if (!p.paras.length && !p.callout && p.image) {
        return (
          <>
            <Title p={p} set={set} editable={e} />
            <E fk="lead" tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
            <div className="fullimg"><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional onPick={(v) => set({ image: v || undefined })} /></div>
          </>
        );
      }
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E fk="lead" tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          {p.paras.map((t, k) => (
            <E fk={`paras.${k}`}
              key={k}
              tag="p"
              className="para"
              value={t}
              onChange={(v) => set({ paras: p.paras.map((x, j) => (j === k ? v : x)) })}
              editable={e}
              ph="абзац"
            />
          ))}
          <E fk="callout" tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
          {notes}
        </WithImg>
      );
    case "bullets": {
      const split = (t: string) => { const m = t.match(/^\s*(\d+)\s*[.)]\s*(.*)$/s); return m ? { n: m[1], t: m[2] } : { n: "", t }; };
      const body =
        p.variant === "cards" ? (
          <div className="cards" data-n={String(Math.min(8, Math.max(2, p.items.length)))}>
            {p.items.map((it, k) => {
              const { n, t } = split(it);
              return (
                <div className="card" key={k}>
                  <div className="n">{(n || String(k + 1)).padStart(2, "0")}</div>
                  <E fk={`items.${k}`} tag="div" className="t" value={t} onChange={(v) => set({ items: p.items.map((x, j) => (j === k ? (n ? `${n}. ${v}` : v) : x)) })} editable={e} ph="…" />
                </div>
              );
            })}
          </div>
        ) : p.variant === "bubbles" ? (
          <div className="bubbles">
            {p.items.map((it, k) => (
              <E fk={`items.${k}`} key={k} tag="div" className="bubble" value={it} onChange={(v) => set({ items: p.items.map((x, j) => (j === k ? v : x)) })} editable={e} ph="…" />
            ))}
          </div>
        ) : (
          <EList fk="items" className={"bul" + (big && !p.image && p.items.length >= 10 ? " c2" : "") + (p.items.some((t) => /^- /.test(t)) ? " has-sub" : "")} items={p.items} onChange={(v) => set({ items: v })} editable={e}
            breakAt={big && !p.image && p.items.length >= 10 ? (() => {
              // розрив колонки там, де обсяг тексту ділиться навпіл; не одразу після заголовка групи і не всередині підпунктів, якщо є кращий варіант
              if (twoGroups(p.items) !== undefined) return undefined; // див. spanTo
              const L = p.items.map((t) => t.replace(/\*\*/g, "").length + 40), tot = L.reduce((a, b) => a + b, 0);
              const isHead = (t: string) => /^\*\*[^*]+:\*\*$/.test(t.trim()) || (!/^- /.test(t) && p.items.some((x) => /^- /.test(x)));
              let best = Math.ceil(p.items.length / 2), bestD = Infinity, acc = 0;
              for (let j = 1; j < p.items.length; j++) {
                acc += L[j - 1];
                if (isHead(p.items[j - 1])) continue;
                const d = Math.abs(acc - tot / 2) + (/^- /.test(p.items[j]) && !isHead(p.items[j]) ? tot * 0.04 : 0);
                if (d < bestD) { bestD = d; best = j; }
              }
              return best;
            })() : undefined}
            spanTo={big && !p.image && p.items.length >= 10 ? twoGroups(p.items) : undefined} />
        );
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E fk="lead" tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          {body}
          <E fk="callout" tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
          {notes}
        </WithImg>
      );
    }
    case "twocol":
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E fk="lead" tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <div className="cols" data-n={String(Math.min(4, Math.max(2, p.cols.length)))} style={big && p.cols.length === 2 ? (() => { const L = p.cols.map((c) => c.items.join(" ").length + c.head.length + 40); const r = Math.min(1.5, Math.max(1 / 1.5, L[0] / L[1])); return { gridTemplateColumns: `${r.toFixed(2)}fr 1fr` }; })() : undefined}>
            {p.cols.map((c, k) => (
              <div className="col" key={k}>
                {!e && p.cols.every((x) => !x.head) ? null : <h3>
                  {chipFor(c.head) ? <span className={"chip " + chipFor(c.head)} /> : null}
                  <E fk={`cols.${k}.h`} value={c.head} onChange={(v) => set({ cols: p.cols.map((x, j) => (j === k ? { ...x, head: v } : x)) })} editable={e} ph="підзаголовок" />
                </h3>}
                <EList fk={`cols.${k}.i`} className="bul sm" items={c.items} onChange={(v) => set({ cols: p.cols.map((x, j) => (j === k ? { ...x, items: v } : x)) })} editable={e} />
              </div>
            ))}
          </div>
          {p.callout ? <E fk="callout" tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" /> : null}
          {notes}
        </WithImg>
      );
    case "diagram":
      return (
        <>
          <Title p={p} set={set} editable={e} />
          <E fk="lead" tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <Diagram kind={p.kind} labels={p.labels} lists={p.lists} hi={p.hi} v2={big} editable={e} uid={p.id} onLabels={(v) => set({ labels: v })} onLists={(v) => set({ lists: v })} />
          {p.callout || e ? <E fk="callout" tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="виноска (необовʼязково)" /> : null}
          {notes}
        </>
      );
    case "steps":
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E fk="lead" tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <div className="steps" style={{ ["--lw" as any]: (() => { const m = Math.max(0, ...p.steps.map((x) => x.head.length)); return big && m <= 2 ? "14mm" : big && m <= 8 ? "28mm" : m <= 16 ? "58mm" : m <= 34 ? "80mm" : "100mm"; })() } as any}>
            {p.steps.map((st, k) => (
              <div className="step" key={k}>
                <span className="dot" />
                <E fk={`steps.${k}.h`} tag="div" className="h" value={st.head} onChange={(v) => set({ steps: p.steps.map((x, j) => (j === k ? { ...x, head: v } : x)) })} editable={e} ph="крок" />
                <E fk={`steps.${k}.t`} tag="div" className="t" value={st.text} onChange={(v) => set({ steps: p.steps.map((x, j) => (j === k ? { ...x, text: v } : x)) })} editable={e} ph="опис" />
              </div>
            ))}
          </div>
          {notes}
        </WithImg>
      );
    case "table": {
      const isWide = (r: string[]) => (r[0] ?? "").length > 60 && r.slice(1).every((c) => !c.trim()) && p.head.length > 1;
      const cells = p.rows.filter((r) => !isWide(r)).flatMap((r) => r.slice(1));
      const emptyRatio = cells.length ? cells.filter((c) => !c.trim()).length / cells.length : 0;
      // робочий аркуш: багато порожніх клітинок; у «великому друці» — також якщо є хоча б один повністю порожній рядок для запису
      const ws = emptyRatio >= 0.4 || (!!big && p.rows.some((r) => !isWide(r) && r.slice(1).every((c) => !c.trim())));
      const hl = prev && prev.type === "gallery" ? chipFor(prev.lead) : null;
      const numbered = p.head[0] === "#" || p.rows.every((r) => /^\d+\.?$/.test((r[0] ?? "").trim()));
      const fcText = !numbered && p.rows.length > 0 && p.rows.reduce((a, r) => a + (r[0] ?? "").length, 0) / p.rows.length > 45;
      // висота порожніх рядків для запису: «великий друк» — ділимо вільну висоту лише між порожніми рядками
      const blankRows = p.rows.filter((r) => !isWide(r) && r.slice(1).every((c) => !c.trim())).length;
      const rowh = ws ? (big ? `${Math.max(14, Math.min(40, Math.floor((p.lead ? 104 : 116) / Math.max(1, blankRows) - (p.rows.length - blankRows) * 12 / Math.max(1, blankRows))))}mm` : `${Math.max(11, Math.min(38, Math.floor(118 / Math.max(1, p.rows.length))))}mm`) : undefined;
      return (
        <>
          <Title p={p} set={set} editable={e} />
          <E fk="lead" tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <table className={ws ? `ws c${p.head.length}` : undefined} data-hl={hl ?? undefined} data-num={numbered ? "1" : undefined} data-fc={fcText ? "text" : undefined} data-cols={String(p.head.length)} style={rowh ? ({ ["--rowh" as any]: rowh } as any) : undefined}>
            <thead style={!e && p.head.every((h) => !h.trim()) ? { display: "none" } : undefined}>
              <tr>
                {p.head.map((h, k) => (
                  <th key={k}>
                    <E fk={`head.${k}`} value={h} onChange={(v) => set({ head: p.head.map((x, j) => (j === k ? v : x)) })} editable={e} ph="—" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.rows.map((r, ri) => (
                <tr key={ri} data-chip={chipFor(r[0] ?? "") ?? undefined} data-filled={ws && r.slice(1).some((c) => c.trim()) ? "1" : undefined}>
                  {isWide(r) ? (
                    <E fk={`rows.${ri}.0`} tag="td" value={r[0] ?? ""} onChange={(v) => set({ rows: p.rows.map((row, j) => (j === ri ? p.head.map((__, c) => (c === 0 ? v : row[c] ?? "")) : row)) })} editable={e} ph="" className="wide" attrs={{ colSpan: p.head.length }} />
                  ) : p.head.map((_, ci) => (
                    ci === 0 && chipFor(r[0] ?? "") ? (
                      <td key={ci}>
                        <span className={"chip " + chipFor(r[0] ?? "")} />
                        <E fk={`rows.${ri}.0`} value={r[0] ?? ""} onChange={(v) => set({ rows: p.rows.map((row, j) => (j === ri ? p.head.map((__, c) => (c === 0 ? v : row[c] ?? "")) : row)) })} editable={e} ph="" />
                      </td>
                    ) : (
                    <E fk={`rows.${ri}.${ci}`}
                      key={ci}
                      tag="td"
                      value={r[ci] ?? ""}
                      onChange={(v) => set({ rows: p.rows.map((row, j) => (j === ri ? p.head.map((__, c) => (c === ci ? v : row[c] ?? "")) : row)) })}
                      editable={e}
                      ph=""
                    />
                    )
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <E fk="callout" tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
          {ws ? null : notes}
        </>
      );
    }
    case "gallery":
      return (
        <>
          <Title p={p} set={set} editable={e} />
          <p className="lead" style={{ display: p.lead ? undefined : "none" }}>
            {chipFor(p.lead) ? <span className={"chip " + chipFor(p.lead)} /> : null}
            <E fk="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          </p>
          <div className="gal" data-chip={chipFor(p.lead) ?? undefined}>
            {p.images.map((im, k) => (
              <figure key={k}>
                <img src={im.src} alt="" />
                <ImgBtn pick={pick} current={im.src} optional={false} onPick={(v) => set({ images: p.images.map((x, j) => (j === k ? { ...x, src: v } : x)) })} />
                <E fk={`cap.${k}`} tag="figcaption" value={im.cap} onChange={(v) => set({ images: p.images.map((x, j) => (j === k ? { ...x, cap: v } : x)) })} editable={e} ph="" />
              </figure>
            ))}
          </div>
        </>
      );
    case "closing":
      return (
        <div className="wrap">
          <div>
            <Title p={p} set={set} editable={e} />
            <E fk="sub" tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="підпис" />
            <EList className="ct" items={p.contacts} onChange={(v) => set({ contacts: v })} editable={e} />
            <span className="qrwrap">
              {p.qr ? <img className="qr" src={p.qr} alt="" /> : null}
              <ImgBtn pick={pick} current={p.qr} optional onPick={(v) => set({ qr: v || undefined })} empty={!p.qr} />
            </span>
          </div>
          <div className="photo"><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional={false} onPick={(v) => set({ image: v })} /></div>
        </div>
      );
  }
}
