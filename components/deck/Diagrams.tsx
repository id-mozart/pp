"use client";

import { useRef } from "react";

/**
 * Схеми для сторінок типу «diagram»: відтворені з pptx-джерел у фірмових кольорах деки.
 * Геометрія — CSS (clip-path, conic-gradient) + невеликі SVG-стрілки; підписи — HTML,
 * тому в редакторі вони редагуються прямо на схемі (contentEditable).
 */
export type DiagramKind = "pyramid" | "skills" | "circle3" | "blocks31" | "cycle" | "wedge";

export const DIAGRAM_LABELS: Record<DiagramKind, { label: string; hint: string; labels: string[]; lists?: string[][] }> = {
  pyramid: { label: "Піраміда цілей", hint: "Три рівні: підписи ліворуч, піраміда праворуч", labels: ["Стратегічна ціль", "Цілі компанії / ГД", "Цілі функцій / керівників відділів", "Цілі ТМ"] },
  skills: { label: "Навички за рівнями", hint: "Рівні керівників × hard / soft / strategic skills", labels: ["ТОП-менеджмент", "Керівники середньої ланки", "Лінійні керівники", "HARD SKILLS", "Спеціальні / технічні навички", "SOFT SKILLS", "STRATEGIC SKILLS", "Розробка стратегії / довгострокове планування"] },
  circle3: { label: "Коло з 3 секторів", hint: "Три чинники по колу зі стрілками", labels: ["Бізнес-результати", "Поведінкова дисципліна", "Розвиток / мотивація"] },
  blocks31: { label: "Блоки 3+1", hint: "Три блоки праворуч, бейдж і підсумкова смуга", labels: ["Користь програми 3+1", "1. Методологія + інструменти", "2. Практичні завдання", "3. Бізнес-симуляція", "Формування культури розвитку команди 10/20/70%"] },
  cycle: { label: "Цикл із 4 етапів", hint: "Чотири етапи по колу, центр і вхідна стрілка", labels: ["Постановка задач", "Виконання задач", "Контроль", "Аналіз та планування", "Зворотний зв'язок (ЗЗ)\nКоординація\nМотивація\nНавчання\nУправління конфліктами", "ЦІЛЬ"] },
  wedge: { label: "70 / 20 / 10", hint: "Спадний клин із трьома частками і списками під ними", labels: ["70 %", "Практичний досвід", "20 %", "Зворотний зв'язок та навчання на робочому місці", "10 %", "Навчання"], lists: [["Проекти усередині підрозділу", "Навчання колег"], ["Наставництво", "Коучинг"], ["Внутрішні тренінги", "Книги"]] },
};

export const DIAGRAM_CSS = `
  #deck-a4 .dg{ position:relative; width:100%; margin-top:6mm; flex:none; --dgf:calc(11pt * var(--k,1)); font-size:var(--dgf); line-height:1.25; color:var(--ink); }
  #deck-a4 .dg .lb{ position:absolute; display:flex; align-items:center; justify-content:center; text-align:center; padding:2mm 3mm; box-sizing:border-box; }
  #deck-a4 .dg .lb > span{ display:block; min-width:1.5em; white-space:pre-line; }
  #deck-a4 .dg .box{ background:var(--band); border-radius:4px; border-left:2.5pt solid var(--amber); }
  #deck-a4 .dg .box.dark{ background:#2A2018; color:#FCF8F1; border-left-color:var(--gold); }
  #deck-a4 .dg .box.acc{ background:var(--amber); color:#FFF8EE; border-left:0; font-weight:600; }
  #deck-a4 .dg .head{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; color:var(--amber); font-size:calc(13pt * var(--k,1)); }
  #deck-a4 .dg svg{ position:absolute; inset:0; width:100%; height:100%; overflow:visible; pointer-events:none; }
  #deck-a4 .dg svg text{ font-family:var(--font-inter),sans-serif; }
  /* pyramid */
  #deck-a4 .dg.pyramid{ aspect-ratio:2.35; }
  #deck-a4 .dg.pyramid .py{ position:absolute; left:52%; top:0; width:44%; height:100%; }
  #deck-a4 .dg.pyramid .py i{ position:absolute; left:0; width:100%; display:block; }
  #deck-a4 .dg.pyramid .py .b1{ top:0; height:34%; background:#2A2018; clip-path:polygon(50% 0, 67% 100%, 33% 100%); }
  #deck-a4 .dg.pyramid .py .b2{ top:34%; height:33%; background:var(--amber); clip-path:polygon(33% 0, 67% 0, 84% 100%, 16% 100%); }
  #deck-a4 .dg.pyramid .py .b3{ top:67%; height:33%; background:var(--gold); clip-path:polygon(16% 0, 84% 0, 100% 100%, 0 100%); }
  #deck-a4 .dg.pyramid .lb.l1{ left:0; top:2%; width:44%; height:28%; }
  #deck-a4 .dg.pyramid .lb.l2{ left:0; top:36%; width:44%; height:28%; }
  #deck-a4 .dg.pyramid .lb.l3{ left:0; top:70%; width:44%; height:28%; }
  #deck-a4 .dg.pyramid .lb.l1 > span{ line-height:1.3; }
  #deck-a4 .dg.pyramid .lb.l1 b{ display:block; font-weight:600; }
  /* skills */
  #deck-a4 .dg.skills{ aspect-ratio:2.2; }
  #deck-a4 .dg.skills .lv{ position:absolute; left:0; width:26%; height:30%; }
  #deck-a4 .dg.skills .lv.r1{ top:2%; } #deck-a4 .dg.skills .lv.r2{ top:35%; } #deck-a4 .dg.skills .lv.r3{ top:68%; }
  #deck-a4 .dg.skills .area{ position:absolute; left:29%; top:2%; width:71%; height:96%; border-radius:4px; overflow:hidden; background:var(--band); }
  #deck-a4 .dg.skills .area i{ position:absolute; inset:0; display:block; }
  #deck-a4 .dg.skills .area .hard{ background:#2A2018; clip-path:polygon(0 100%, 0 38%, 62% 100%); }
  #deck-a4 .dg.skills .area .strat{ background:var(--amber); clip-path:polygon(100% 0, 38% 0, 100% 62%); }
  #deck-a4 .dg.skills .lb.hard{ left:30%; top:68%; width:24%; height:28%; color:#FCF8F1; font-weight:700; letter-spacing:.06em; }
  #deck-a4 .dg.skills .lb.hardsub{ left:71%; top:76%; width:28%; height:22%; font-size:calc(9.5pt * var(--k,1)); text-align:left; justify-content:flex-start; align-items:flex-end; }
  #deck-a4 .dg.skills .lb.soft{ left:52%; top:36%; width:26%; height:26%; color:var(--amber); font-weight:700; letter-spacing:.06em; font-size:calc(13pt * var(--k,1)); }
  #deck-a4 .dg.skills .lb.strat{ left:74%; top:4%; width:25%; height:24%; color:#FFF8EE; font-weight:700; letter-spacing:.06em; }
  #deck-a4 .dg.skills .lb.stratsub{ left:31%; top:4%; width:26%; height:24%; font-size:calc(9.5pt * var(--k,1)); text-align:left; justify-content:flex-start; align-items:flex-start; }
  /* circle3 */
  #deck-a4 .dg.circle3{ aspect-ratio:2.35; }
  #deck-a4 .dg.circle3 .disc{ position:absolute; left:50%; top:50%; width:calc(100% / 2.35 * .78); aspect-ratio:1; transform:translate(-50%,-50%); border-radius:50%;
    background:conic-gradient(from -30deg, var(--band) 0 120deg, #EADFC8 120deg 240deg, var(--band) 240deg 360deg); box-shadow:inset 0 0 0 1px var(--line); }
  #deck-a4 .dg.circle3 .disc::before, #deck-a4 .dg.circle3 .disc::after, #deck-a4 .dg.circle3 .disc i{ content:""; position:absolute; left:50%; top:50%; width:50%; height:1.5px; background:#FCF8F1; transform-origin:0 50%; }
  #deck-a4 .dg.circle3 .disc::before{ transform:rotate(-120deg); } #deck-a4 .dg.circle3 .disc::after{ transform:rotate(0deg); } #deck-a4 .dg.circle3 .disc i{ transform:rotate(120deg); }
  #deck-a4 .dg.circle3 .lb{ width:20%; height:22%; font-weight:600; font-size:calc(10pt * var(--k,1)); line-height:1.2; }
  #deck-a4 .dg.circle3 .lb.s1{ left:47%; top:6%; } #deck-a4 .dg.circle3 .lb.s2{ left:47%; top:72%; } #deck-a4 .dg.circle3 .lb.s3{ left:23%; top:39%; }
  /* blocks31 */
  #deck-a4 .dg.blocks31{ aspect-ratio:2.35; }
  #deck-a4 .dg.blocks31 .badge{ left:4%; top:22%; width:26%; height:36%; border-radius:50% 50% 50% 8px; background:var(--amber); color:#FFF8EE; font-weight:600; font-family:var(--font-spectral),serif; font-style:italic; font-size:calc(13pt * var(--k,1)); }
  #deck-a4 .dg.blocks31 .bk{ left:44%; width:52%; height:20%; justify-content:flex-start; text-align:left; font-weight:500; }
  #deck-a4 .dg.blocks31 .bk.k1{ top:2%; } #deck-a4 .dg.blocks31 .bk.k2{ top:27%; } #deck-a4 .dg.blocks31 .bk.k3{ top:52%; }
  #deck-a4 .dg.blocks31 .bar{ left:4%; top:80%; width:92%; height:18%; }
  /* cycle */
  #deck-a4 .dg.cycle{ aspect-ratio:2.2; }
  #deck-a4 .dg.cycle .lb.c{ width:22%; height:20%; font-weight:600; }
  #deck-a4 .dg.cycle .lb.c1{ left:39%; top:0; } #deck-a4 .dg.cycle .lb.c2{ left:74%; top:40%; } #deck-a4 .dg.cycle .lb.c3{ left:39%; top:80%; } #deck-a4 .dg.cycle .lb.c4{ left:4%; top:40%; }
  #deck-a4 .dg.cycle .lb.mid{ left:36%; top:24%; width:28%; height:52%; font-size:calc(9.5pt * var(--k,1)); line-height:1.3; border-left:0; border-top:2.5pt solid var(--amber); }
  #deck-a4 .dg.cycle .lb.goal{ left:0; top:12%; width:12%; height:16%; }
  /* wedge */
  #deck-a4 .dg.wedge{ aspect-ratio:2.1; }
  #deck-a4 .dg.wedge .w{ position:absolute; left:0; top:0; width:100%; height:38%; background:var(--band); clip-path:polygon(0 0, 100% 62%, 100% 100%, 0 100%); }
  #deck-a4 .dg.wedge .w i{ position:absolute; top:0; bottom:0; display:block; width:33.33%; }
  #deck-a4 .dg.wedge .w .p1{ left:0; background:var(--amber); clip-path:polygon(0 0, 100% 21%, 100% 100%, 0 100%); }
  #deck-a4 .dg.wedge .w .p2{ left:33.33%; background:var(--gold); clip-path:polygon(0 21%, 100% 42%, 100% 100%, 0 100%); }
  #deck-a4 .dg.wedge .w .p3{ left:66.66%; background:#2A2018; clip-path:polygon(0 42%, 100% 62%, 100% 100%, 0 100%); }
  #deck-a4 .dg.wedge .lb.pct{ top:0; width:33.33%; height:40%; flex-direction:column; gap:1mm; color:#FFF8EE; justify-content:flex-end; padding-bottom:3mm; }
  #deck-a4 .dg.wedge .lb.pct b{ font-family:var(--font-spectral),serif; font-style:italic; font-weight:500; font-size:calc(18pt * var(--k,1)); line-height:1; }
  #deck-a4 .dg.wedge .lb.pct > span{ font-size:calc(9.5pt * var(--k,1)); font-weight:600; }
  #deck-a4 .dg.wedge .lb.pct.q1{ left:0; } #deck-a4 .dg.wedge .lb.pct.q2{ left:33.33%; } #deck-a4 .dg.wedge .lb.pct.q3{ left:66.66%; }
  #deck-a4 .dg.wedge .lists{ position:absolute; left:0; top:41%; width:100%; height:59%; display:grid; grid-template-columns:repeat(3,1fr); gap:0 4mm; }
  #deck-a4 .dg.wedge .lists ul{ margin:0; padding:2mm 0 0 4mm; font-size:calc(10pt * var(--k,1)); line-height:1.35; }
  #deck-a4 .dg.wedge .lists li{ margin:0 0 1.2mm; }
  #deck-a4 .dg.wedge .lists li::marker{ color:var(--amber); }
`;

function L({ value, onChange, editable, className, tag: Tag = "span" }: { value: string; onChange: (v: string) => void; editable: boolean; className?: string; tag?: "span" | "b" }) {
  const ref = useRef<HTMLElement>(null);
  const T = Tag as any;
  return (
    <T ref={ref} className={className} contentEditable={editable || undefined} suppressContentEditableWarning data-ph="…"
      onBlur={() => { const v = (ref.current?.innerText ?? "").replace(/ /g, " ").trim(); if (v !== value) onChange(v); }}>{value}</T>
  );
}

function Ul({ items, onChange, editable }: { items: string[]; onChange: (v: string[]) => void; editable: boolean }) {
  const ref = useRef<HTMLUListElement>(null);
  return (
    <ul ref={ref} contentEditable={editable || undefined} suppressContentEditableWarning
      onBlur={() => { const v = Array.from(ref.current?.querySelectorAll("li") ?? []).map((li) => li.innerText.replace(/ /g, " ").trim()).filter(Boolean); if (JSON.stringify(v) !== JSON.stringify(items)) onChange(v.length ? v : [""]); }}>
      {items.map((it, k) => <li key={k}>{it}</li>)}
    </ul>
  );
}

const Arrow = ({ d, id }: { d: string; id: string }) => (
  <>
    <defs><marker id={id} viewBox="0 0 8 8" markerWidth="2.6" markerHeight="2.6" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 z" fill="#C4621F" /></marker></defs>
    <path d={d} fill="none" stroke="#C4621F" strokeWidth="1.5" markerEnd={`url(#${id})`} vectorEffect="non-scaling-stroke" />
  </>
);

export function Diagram({ kind, labels, lists, editable, onLabels, onLists, uid }: { kind: DiagramKind; labels: string[]; lists?: string[][]; editable: boolean; onLabels: (v: string[]) => void; onLists?: (v: string[][]) => void; uid: string }) {
  const def = DIAGRAM_LABELS[kind];
  const lb = (i: number) => labels[i] ?? def.labels[i] ?? "";
  const setL = (i: number) => (v: string) => { const n = [...labels]; while (n.length < def.labels.length) n.push(def.labels[n.length]); n[i] = v; onLabels(n); };
  const e = editable;
  switch (kind) {
    case "pyramid":
      return (
        <div className={"dg " + kind}>
          <div className="lb box l1"><span><L tag="b" value={lb(0)} onChange={setL(0)} editable={e} /><L value={lb(1)} onChange={setL(1)} editable={e} /></span></div>
          <div className="lb box l2"><span><L value={lb(2)} onChange={setL(2)} editable={e} /></span></div>
          <div className="lb box l3"><span><L value={lb(3)} onChange={setL(3)} editable={e} /></span></div>
          <div className="py"><i className="b1" /><i className="b2" /><i className="b3" /></div>
          <svg viewBox="0 0 100 42.5" preserveAspectRatio="none">
            <Arrow id={uid + "a1"} d="M44 7 L50 9" /><Arrow id={uid + "a2"} d="M44 21 L50 21" /><Arrow id={uid + "a3"} d="M44 35 L50 34" />
          </svg>
        </div>
      );
    case "skills":
      return (
        <div className={"dg " + kind}>
          <div className="lb box dark lv r1"><span><L value={lb(0)} onChange={setL(0)} editable={e} /></span></div>
          <div className="lb box dark lv r2"><span><L value={lb(1)} onChange={setL(1)} editable={e} /></span></div>
          <div className="lb box dark lv r3"><span><L value={lb(2)} onChange={setL(2)} editable={e} /></span></div>
          <div className="area"><i className="hard" /><i className="strat" /></div>
          <div className="lb hard"><span><L value={lb(3)} onChange={setL(3)} editable={e} /></span></div>
          <div className="lb hardsub"><span><L value={lb(4)} onChange={setL(4)} editable={e} /></span></div>
          <div className="lb soft"><span><L value={lb(5)} onChange={setL(5)} editable={e} /></span></div>
          <div className="lb strat"><span><L value={lb(6)} onChange={setL(6)} editable={e} /></span></div>
          <div className="lb stratsub"><span><L value={lb(7)} onChange={setL(7)} editable={e} /></span></div>
        </div>
      );
    case "circle3":
      return (
        <div className={"dg " + kind}>
          <div className="disc"><i /></div>
          <svg viewBox="0 0 100 42.5" preserveAspectRatio="none">
            <Arrow id={uid + "r1"} d="M 43.5 3.4 A 19 19 0 0 1 68.7 17.9" /><Arrow id={uid + "r2"} d="M 68.7 24.6 A 19 19 0 0 1 43.5 39.1" /><Arrow id={uid + "r3"} d="M 37.8 35.8 A 19 19 0 0 1 37.8 6.7" />
          </svg>
          <div className="lb s3"><span><L value={lb(0)} onChange={setL(0)} editable={e} /></span></div>
          <div className="lb s1"><span><L value={lb(1)} onChange={setL(1)} editable={e} /></span></div>
          <div className="lb s2"><span><L value={lb(2)} onChange={setL(2)} editable={e} /></span></div>
        </div>
      );
    case "blocks31":
      return (
        <div className={"dg " + kind}>
          <div className="lb badge"><span><L value={lb(0)} onChange={setL(0)} editable={e} /></span></div>
          <div className="lb box bk k1"><span><L value={lb(1)} onChange={setL(1)} editable={e} /></span></div>
          <div className="lb box bk k2"><span><L value={lb(2)} onChange={setL(2)} editable={e} /></span></div>
          <div className="lb box bk k3"><span><L value={lb(3)} onChange={setL(3)} editable={e} /></span></div>
          <svg viewBox="0 0 100 42.5" preserveAspectRatio="none">
            <Arrow id={uid + "b1"} d="M31 17 L42.5 5" /><Arrow id={uid + "b2"} d="M31 17 L42.5 15.5" /><Arrow id={uid + "b3"} d="M31 17 L42.5 26" /><Arrow id={uid + "b4"} d="M70 31.5 L70 33.5" />
          </svg>
          <div className="lb box acc bar"><span><L value={lb(4)} onChange={setL(4)} editable={e} /></span></div>
        </div>
      );
    case "cycle":
      return (
        <div className={"dg " + kind}>
          <svg viewBox="0 0 100 45.5" preserveAspectRatio="none">
            <Arrow id={uid + "c1"} d="M 62 6 A 32 22 0 0 1 80 17" /><Arrow id={uid + "c2"} d="M 82 30 A 32 22 0 0 1 62 40.5" /><Arrow id={uid + "c3"} d="M 38 40.5 A 32 22 0 0 1 20 30" /><Arrow id={uid + "c4"} d="M 18 17 A 32 22 0 0 1 38 6" />
            <Arrow id={uid + "c5"} d="M 12 12 L 12 18" />
          </svg>
          <div className="lb box acc goal"><span><L value={lb(5)} onChange={setL(5)} editable={e} /></span></div>
          <div className="lb box c c1"><span><L value={lb(0)} onChange={setL(0)} editable={e} /></span></div>
          <div className="lb box c c2"><span><L value={lb(1)} onChange={setL(1)} editable={e} /></span></div>
          <div className="lb box c c3"><span><L value={lb(2)} onChange={setL(2)} editable={e} /></span></div>
          <div className="lb box c c4"><span><L value={lb(3)} onChange={setL(3)} editable={e} /></span></div>
          <div className="lb box mid"><span><L value={lb(4)} onChange={setL(4)} editable={e} /></span></div>
        </div>
      );
    case "wedge": {
      const ls = lists && lists.length ? lists : def.lists ?? [[], [], []];
      const setList = (i: number) => (v: string[]) => { const n = [ls[0] ?? [], ls[1] ?? [], ls[2] ?? []]; n[i] = v; onLists?.(n); };
      return (
        <div className={"dg " + kind}>
          <div className="w"><i className="p1" /><i className="p2" /><i className="p3" /></div>
          <div className="lb pct q1"><L tag="b" value={lb(0)} onChange={setL(0)} editable={e} /><span><L value={lb(1)} onChange={setL(1)} editable={e} /></span></div>
          <div className="lb pct q2"><L tag="b" value={lb(2)} onChange={setL(2)} editable={e} /><span><L value={lb(3)} onChange={setL(3)} editable={e} /></span></div>
          <div className="lb pct q3"><L tag="b" value={lb(4)} onChange={setL(4)} editable={e} /><span><L value={lb(5)} onChange={setL(5)} editable={e} /></span></div>
          <div className="lists">
            <Ul items={ls[0] ?? []} onChange={setList(0)} editable={e} /><Ul items={ls[1] ?? []} onChange={setList(1)} editable={e} /><Ul items={ls[2] ?? []} onChange={setList(2)} editable={e} />
          </div>
        </div>
      );
    }
  }
}
