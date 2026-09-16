"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { DIAGRAM_CSS, Diagram } from "@/components/deck/Diagrams";
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
  #deck-a4 .step .t{ font-size:calc(12.2pt * min(var(--k,1), 1.18)); line-height:1.5; }

  /* table */
  #deck-a4 table{ width:100%; border-collapse:collapse; margin-top:6mm; font-size:calc(10.5pt * var(--k,1)); line-height:1.42; }
  #deck-a4 th{ text-align:left; vertical-align:bottom; font-family:var(--font-jetbrains),monospace; font-size:7.8pt; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); padding:0 6mm 2.4mm 0; border-bottom:1px solid var(--ink); font-weight:500; }
  #deck-a4 td{ vertical-align:top; padding:calc(2.8mm * var(--k,1)) 3mm calc(2.8mm * var(--k,1)) 0; border-bottom:1px solid var(--line); }
  #deck-a4 td:first-child{ color:var(--acc); font-family:var(--font-spectral),serif; font-style:italic; font-size:calc(11pt * var(--k,1)); width:17%; }
  #deck-a4 table[data-num] td:first-child{ width:6%; white-space:nowrap; }
  #deck-a4 table[data-cols="4"]:not(.ws) td:nth-child(2){ width:34%; } #deck-a4 table[data-cols="4"]:not(.ws) td:nth-child(3){ width:22%; }
  #deck-a4 table[data-num][data-cols="3"] td:nth-child(3), #deck-a4 table[data-num][data-cols="3"] th:nth-child(3){ width:42%; }
  #deck-a4 td[contenteditable]:empty{ min-height:6mm; display:block; }

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
  #deck-a4 .t-cover .cv.amp .cv-l{ padding-top:14mm; }
  #deck-a4 .t-cover .cv.amp h1{ font-size:62pt; line-height:.96; max-width:215mm; }
  #deck-a4 .t-cover .cv.amp h1 em{ font-size:36pt; margin-top:6mm; }
  #deck-a4 .t-cover .cv.amp .eyebrow{ font-size:9.5pt; }
  #deck-a4 .t-cover .cv.amp .sub, #deck-a4 .t-cover .cv.amp .who{ max-width:200mm; }
  #deck-a4 .t-cover:has(.cv.amp) .rh .wm{ font-size:18.5pt; }
  /* амперсанд-титул: без службових ліній і колонтитула — лише логотип, заголовок, підпис */
  #deck-a4 .t-cover:has(.cv.amp) .rh .fill{ display:none; }
  #deck-a4 .t-cover:has(.cv.amp) .eyebrow{ border:0; box-shadow:none; background:none; padding:0; }
  #deck-a4 .t-cover:has(.cv.amp) .eyebrow::before, #deck-a4 .t-cover:has(.cv.amp) .eyebrow::after{ display:none; }
  #deck-a4 .t-cover:has(.cv.amp) .who{ border-top:0; padding-bottom:6mm; }
  #deck-a4 .t-cover:has(.cv.amp) .foot{ display:none; }
  #deck-a4 .t-cover .who.av{ display:flex; align-items:center; gap:5.5mm; }
  #deck-a4 .t-cover .who .avatar{ position:relative; flex:none; width:19mm; height:19mm; border-radius:50%; overflow:hidden; box-shadow:0 0 0 1.6pt var(--amber), 0 0 0 4pt var(--sheet); }
  #deck-a4 .t-cover .who .avatar img{ width:100%; height:100%; object-fit:cover; object-position:50% 18%; display:block; }
  #deck-a4 .t-cover .who.av .wt p{ margin:0; }
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
  #deck-a4 .card .t{ font-size:calc(11.5pt * var(--k,1)); line-height:1.45; }
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
`;
const DECK_CSS = DECK_CSS_BASE + DIAGRAM_CSS;

type Patch = (patch: Record<string, unknown>) => void;

/** Типографічні заміни лише для показу (у дані повертаються звичайні пробіли/дефіси): «5‑й крок», прийменники не висять. */
function typo(v: string): string {
  return v
    .replace(/(\d)-(й|го|му|ша|ші|ім|ий|ої|ому)(?!\p{L})/gu, "$1\u2011$2")
    .replace(/(\d\u2011й)\s+(крок)/gu, "$1\u00A0$2")
    .replace(/(?<=^|[\s(«])([\p{L}]{1,2})\s+(?=\S)/gu, "$1\u00A0")
    .replace(/\s+—/g, "\u00A0—");
}

/* ───────── editable primitives ───────── */

function E({
  tag: Tag = "span",
  value,
  onChange,
  className,
  ph,
  editable,
}: {
  tag?: keyof JSX.IntrinsicElements;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  ph?: string;
  editable: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const T = Tag as any;
  return (
    <T
      ref={ref}
      className={className}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      data-ph={ph || "…"}
      onBlur={() => {
        const v = (ref.current?.innerText ?? "").replace(/ /g, " ").replace(/\u2011/g, "-").trim();
        if (v !== value) onChange(v);
      }}
    >
      {typo(value)}
    </T>
  );
}

function EList({
  items,
  onChange,
  className,
  editable,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  className?: string;
  editable: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  // Після кожного blur список перемонтовується (key), щоб нативно створені браузером <li>
  // (Enter у contentEditable) не лишались поруч із React-рендером і не дублювались.
  const [rev, setRev] = useState(0);
  return (
    <ul
      key={rev}
      ref={ref}
      className={className}
      contentEditable={editable || undefined}
      suppressContentEditableWarning
      onBlur={() => {
        const lis = Array.from(ref.current?.querySelectorAll("li") ?? []);
        const v = lis.map((li) => li.innerText.replace(/\u00a0/g, " ").replace(/\u2011/g, "-").trim()).filter(Boolean);
        if (JSON.stringify(v) !== JSON.stringify(items)) onChange(v.length ? v : [""]);
        setRev((r) => r + 1);
      }}
    >
      {items.map((it, i) => (
        <li key={i} data-num={/^\s*\d+\s*[.)]/.test(it) ? "1" : undefined}>{typo(it)}</li>
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
      <E value={p.title} onChange={(v) => set({ title: v })} editable={editable} ph="Заголовок" />{/-$/.test(p.title.trim()) ? "" : " "}
      <em>
        <E value={p.titleEm} onChange={(v) => set({ titleEm: v })} editable={editable} ph="акцент" />
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

const ANIM_SEL = [".rh", ".secimg", ".photo", ".num", ".kicker", ".sec-t h1", ".sec-t .sub", ".cv-l > *", ".cv-r > img", ".cv-r .bigamp", ".hero .lab", ".hero h1", ".hero .role", ".hero .quote", ".stat", ".portrait", ".bottom > *",
  ".pb > h1", ".pb > .lead", ".pb > .para", ".pb > .callout", ".body > h1", ".body > .lead", ".body > .para", ".body > .callout", ".fig", ".fullimg", ".qp > *", "ul.bul > li", ".card", ".bubble", ".col", ".step", "thead", "tbody tr", ".gal figure", ".notes", ".wrap > div > *", ".foot"].join(",");

function Sheet({ deck, i, cls, page, children, editable, onRunhead, animate }: { deck: Deck; i: number; cls?: string; page: DeckPage; children: React.ReactNode; editable: boolean; onRunhead: (v: string) => void; animate?: number }) {
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
      let v = Math.round(d.k * (page.fs ?? 1) * (deck.fs ?? 1) * 100) / 100;
      const floor = Math.min(page.type === "table" ? 0.7 : 0.62, v);
      const apply = () => { el.style.setProperty("--k", String(v)); el.style.setProperty("--kh", String(v >= 1.1 ? 1.1 : v < 0.95 ? 0.9 : 1)); };
      apply();
      for (let i = 0; i < 80 && !fits() && v > floor; i++) { v = Math.round((v - 0.04) * 100) / 100; apply(); }
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
  }, [d.k, page, deck.fs]);
  return (
    <section ref={ref} className={`sheet ${cls ?? ""}${page.type === "section" && page.image ? " has-img" + (page.fit === "top" ? " fit-top" : "") : ""}${page.type === "section" && /^\d+-й крок/i.test(page.title) ? " is-step" : ""}`} data-page={i + 1} data-sparse={k >= 1.32 ? "1" : undefined} style={{ ["--k" as any]: k, ["--kh" as any]: Math.min(1.2, k) }}>
      <div className="rh">
        <span className="wm">Pan<em>&amp;</em>Partners</span>
        <span className="fill" />
        <E value={deck.runhead} onChange={onRunhead} editable={editable} className="tag" ph="колонтитул" />
      </div>
      <div className="pb">{children}</div>
      <div className="foot">
        <span className="tl">
          <b>Тетяна Пан</b> · Pan&amp;Partners · pan-partners.agency
        </span>
        <span className="pg">
          {String(i + 1).padStart(2, "0")} / {String(deck.pages.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
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
    <div id="deck-a4" className={[deck.caps ? "caps" : "", deck.tight ? "tight" : ""].filter(Boolean).join(" ") || undefined}>
      <style dangerouslySetInnerHTML={{ __html: DECK_CSS }} />
      {deck.pages.map((p, i) => {
        if (only && only !== i + 1) return null;
        const set: Patch = (patch) => onPatch?.(i, patch);
        return (
          <div key={p.id} style={{ position: "relative" }}>
            {renderControls?.(i)}
            <Sheet deck={deck} i={i} cls={"t-" + p.type} page={p} editable={editable} onRunhead={rh} animate={animate}>
              <PageBody p={p} set={set} editable={editable} prev={deck.pages[i - 1]} pick={editable ? pickImage : undefined} showNotes={deck.notes !== false} logo={deck.logo} />
            </Sheet>
          </div>
        );
      })}
    </div>
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

function PageBody({ p, set, editable, prev, pick, showNotes = true, logo }: { p: DeckPage; set: Patch; editable: boolean; prev?: DeckPage; pick?: PickImage; showNotes?: boolean; logo?: string }) {
  const e = editable;
  // Розріджені текстові сторінки — це роздатковий матеріал: знизу поле для нотаток (вимикається на рівні деки).
  const noImg = !("image" in p && p.image);
  const notes = showNotes && noImg && ((p.type === "bullets" && p.variant !== "bubbles") || p.type === "text" || p.type === "twocol" || p.type === "steps" || p.type === "table") ? (
    <div className="notes"><div className="lab">Нотатки</div><div className="lines" /></div>
  ) : null;
  switch (p.type) {
    case "cover":
      return (
        <>
          <div className={"cv" + (p.variant === "amp" ? " amp" : "")}>
            <div className="cv-l">
              <E tag="p" className="eyebrow" value={p.eyebrow} onChange={(v) => set({ eyebrow: v })} editable={e} ph="надзаголовок" />
              <Title p={p} set={set} editable={e} />
              <E tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="" />
              <div className={"who" + (p.avatar ? " av" : "")}>
                {p.avatar ? <span className="avatar"><img src={p.avatar} alt="" /><ImgBtn pick={pick} current={p.avatar} optional onPick={(v) => set({ avatar: v || undefined })} /></span> : null}
                <span className="wt">
                  <E tag="p" value={p.who} onChange={(v) => set({ who: v })} editable={e} ph="хто проводить" />
                  <E tag="p" className="w" value={p.when} onChange={(v) => set({ when: v })} editable={e} ph="де, коли" />
                </span>
              </div>
            </div>
            <div className={"cv-r" + (p.variant === "amp" ? " amp" : "")}>
              {p.variant === "amp" ? <span className="bigamp" aria-hidden>&amp;</span> : null}
              {logo && p.variant !== "amp" ? <img className="np-big" src={logo} alt="" /> : null}
              {p.variant !== "amp" && (p.image || logo) ? <img className="ill" src={p.image || "/deck/novapay/money.png"} alt="" /> : null}
              {p.variant !== "amp" ? <ImgBtn pick={pick} current={p.image || ""} optional onPick={(v) => set({ image: v || undefined })} /> : null}
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
              <div className="lab" style={{ marginTop: "4mm" }}>Тренерка</div>
              <Title p={p} set={set} editable={e} />
              <E tag="p" className="role" value={p.role ?? ""} onChange={(v) => set({ role: v })} editable={e} ph="" />
              <E tag="div" className="quote" value={p.quote ?? ""} onChange={(v) => set({ quote: v })} editable={e} ph="" />
              {p.stats && p.stats.length ? (
                <div className="stats">
                  {p.stats.map((st, k) => (
                    <div className="stat" key={k}>
                      <E tag="div" className="n" value={st.n} onChange={(v) => set({ stats: p.stats!.map((x, j) => (j === k ? { ...x, n: v } : x)) })} editable={e} ph="" />
                      <E tag="div" className="t" value={st.t} onChange={(v) => set({ stats: p.stats!.map((x, j) => (j === k ? { ...x, t: v } : x)) })} editable={e} ph="" />
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
              <div className="lab">Моя спеціалізація</div>
              <EList className="bul" items={p.facts} onChange={(v) => set({ facts: v })} editable={e} />
            </div>
            <div>
              <div className="lab">Географія проєктів</div>
              <E tag="p" className="note" value={p.note} onChange={(v) => set({ note: v })} editable={e} ph="" />
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
            <E tag="div" className="num serif" value={p.num} onChange={(v) => set({ num: v })} editable={e} ph="" />
            <div className="sec-t">
              <div className="kicker">{/^\d+-й крок/i.test(p.title) ? "Крок" : "Розділ"}</div>
              <h1>
                <E value={p.title} onChange={(v) => set({ title: v })} editable={e} ph="Назва розділу" />
              </h1>
              <E tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="" />
              {!p.image ? <ImgBtn pick={pick} optional onPick={(v) => set({ image: v || undefined })} empty /> : null}
            </div>
          </div>
        </>
      );
    case "text":
      if (!p.title && !p.titleEm && !p.lead && !p.paras.length && p.image) {
        return (
          <div className="qp">
            <E tag="div" className="q" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="цитата" />
            <div className="fig"><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional onPick={(v) => set({ image: v || undefined })} /></div>
          </div>
        );
      }
      if (!p.paras.length && !p.callout && p.image) {
        return (
          <>
            <Title p={p} set={set} editable={e} />
            <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
            <div className="fullimg"><img src={p.image} alt="" /><ImgBtn pick={pick} current={p.image} optional onPick={(v) => set({ image: v || undefined })} /></div>
          </>
        );
      }
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          {p.paras.map((t, k) => (
            <E
              key={k}
              tag="p"
              className="para"
              value={t}
              onChange={(v) => set({ paras: p.paras.map((x, j) => (j === k ? v : x)) })}
              editable={e}
              ph="абзац"
            />
          ))}
          <E tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
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
                  <E tag="div" className="t" value={t} onChange={(v) => set({ items: p.items.map((x, j) => (j === k ? (n ? `${n}. ${v}` : v) : x)) })} editable={e} ph="…" />
                </div>
              );
            })}
          </div>
        ) : p.variant === "bubbles" ? (
          <div className="bubbles">
            {p.items.map((it, k) => (
              <E key={k} tag="div" className="bubble" value={it} onChange={(v) => set({ items: p.items.map((x, j) => (j === k ? v : x)) })} editable={e} ph="…" />
            ))}
          </div>
        ) : (
          <EList className="bul" items={p.items} onChange={(v) => set({ items: v })} editable={e} />
        );
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          {body}
          <E tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
          {notes}
        </WithImg>
      );
    }
    case "twocol":
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <div className="cols" data-n={String(Math.min(4, Math.max(2, p.cols.length)))}>
            {p.cols.map((c, k) => (
              <div className="col" key={k}>
                <h3>
                  {chipFor(c.head) ? <span className={"chip " + chipFor(c.head)} /> : null}
                  <E value={c.head} onChange={(v) => set({ cols: p.cols.map((x, j) => (j === k ? { ...x, head: v } : x)) })} editable={e} ph="підзаголовок" />
                </h3>
                <EList className="bul sm" items={c.items} onChange={(v) => set({ cols: p.cols.map((x, j) => (j === k ? { ...x, items: v } : x)) })} editable={e} />
              </div>
            ))}
          </div>
          {notes}
        </WithImg>
      );
    case "diagram":
      return (
        <>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <Diagram kind={p.kind} labels={p.labels} lists={p.lists} editable={e} uid={p.id} onLabels={(v) => set({ labels: v })} onLists={(v) => set({ lists: v })} />
          {p.callout || e ? <E tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="виноска (необовʼязково)" /> : null}
          {notes}
        </>
      );
    case "steps":
      return (
        <WithImg image={p.image} pick={pick} onPick={(v) => set({ image: v || undefined })}>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <div className="steps" style={{ ["--lw" as any]: (() => { const m = Math.max(0, ...p.steps.map((x) => x.head.length)); return m <= 16 ? "58mm" : m <= 34 ? "80mm" : "100mm"; })() } as any}>
            {p.steps.map((st, k) => (
              <div className="step" key={k}>
                <span className="dot" />
                <E tag="div" className="h" value={st.head} onChange={(v) => set({ steps: p.steps.map((x, j) => (j === k ? { ...x, head: v } : x)) })} editable={e} ph="крок" />
                <E tag="div" className="t" value={st.text} onChange={(v) => set({ steps: p.steps.map((x, j) => (j === k ? { ...x, text: v } : x)) })} editable={e} ph="опис" />
              </div>
            ))}
          </div>
          {notes}
        </WithImg>
      );
    case "table": {
      const cells = p.rows.flatMap((r) => r.slice(1));
      const emptyRatio = cells.length ? cells.filter((c) => !c.trim()).length / cells.length : 0;
      const ws = emptyRatio >= 0.4;
      const hl = prev && prev.type === "gallery" ? chipFor(prev.lead) : null;
      const numbered = p.head[0] === "#" || p.rows.every((r) => /^\d+\.?$/.test((r[0] ?? "").trim()));
      const rowh = ws ? `${Math.max(11, Math.min(38, Math.floor(118 / Math.max(1, p.rows.length))))}mm` : undefined;
      return (
        <>
          <Title p={p} set={set} editable={e} />
          <E tag="p" className="lead" value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          <table className={ws ? `ws c${p.head.length}` : undefined} data-hl={hl ?? undefined} data-num={numbered ? "1" : undefined} data-cols={String(p.head.length)} style={rowh ? ({ ["--rowh" as any]: rowh } as any) : undefined}>
            <thead>
              <tr>
                {p.head.map((h, k) => (
                  <th key={k}>
                    <E value={h} onChange={(v) => set({ head: p.head.map((x, j) => (j === k ? v : x)) })} editable={e} ph="—" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.rows.map((r, ri) => (
                <tr key={ri} data-chip={chipFor(r[0] ?? "") ?? undefined}>
                  {p.head.map((_, ci) => (
                    ci === 0 && chipFor(r[0] ?? "") ? (
                      <td key={ci}>
                        <span className={"chip " + chipFor(r[0] ?? "")} />
                        <E value={r[0] ?? ""} onChange={(v) => set({ rows: p.rows.map((row, j) => (j === ri ? p.head.map((__, c) => (c === 0 ? v : row[c] ?? "")) : row)) })} editable={e} ph="" />
                      </td>
                    ) : (
                    <E
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
          <E tag="div" className="callout" value={p.callout} onChange={(v) => set({ callout: v })} editable={e} ph="" />
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
            <E value={p.lead} onChange={(v) => set({ lead: v })} editable={e} ph="лід" />
          </p>
          <div className="gal" data-chip={chipFor(p.lead) ?? undefined}>
            {p.images.map((im, k) => (
              <figure key={k}>
                <img src={im.src} alt="" />
                <ImgBtn pick={pick} current={im.src} optional={false} onPick={(v) => set({ images: p.images.map((x, j) => (j === k ? { ...x, src: v } : x)) })} />
                <E tag="figcaption" value={im.cap} onChange={(v) => set({ images: p.images.map((x, j) => (j === k ? { ...x, cap: v } : x)) })} editable={e} ph="" />
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
            <E tag="p" className="sub" value={p.sub} onChange={(v) => set({ sub: v })} editable={e} ph="підпис" />
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
