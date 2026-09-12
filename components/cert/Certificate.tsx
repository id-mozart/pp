"use client";

import type { Cert } from "@/lib/certs";

/**
 * Сертифікат A4 landscape у стилі Pan&Partners. Пʼять варіантів верстки
 * (classic · band · ornament) на спільних токенах бренду:
 * кремовий лист, золоті лінії, Spectral / Inter / JetBrains Mono / Playfair.
 * Друк — через @media print (297×210 мм).
 */
export const CERT_CSS = `
  #cert-a4{ --sheet:#FCF8F1; --band:#F4ECDC; --ink:#2A2018; --muted:#5E4C36; --faint:#9C8B73;
    --line:rgba(140,116,82,.36); --acc:#C4621F; --amber:#D2701C; --gold:#C98A2B;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
    font-family:var(--font-inter),system-ui,sans-serif; color:var(--ink); }
  #cert-a4 *{ box-sizing:border-box; margin:0; padding:0; }
  #cert-a4 .sheet{ position:relative; width:297mm; height:210mm; overflow:hidden; background:var(--sheet);
    padding:16mm 18mm 14mm; display:flex; flex-direction:column; box-shadow:0 24px 70px rgba(60,40,15,.22); }
  #cert-a4 .serif{ font-family:var(--font-spectral),Georgia,serif; }
  #cert-a4 .mono{ font-family:var(--font-jetbrains),monospace; letter-spacing:.24em; text-transform:uppercase; }
  #cert-a4 .brand{ font-family:var(--font-playfair),Georgia,serif; font-size:23pt; font-weight:500; white-space:nowrap; }
  #cert-a4 .brand em{ color:var(--amber); font-style:normal; }
  #cert-a4 .brand-sub{ font-family:var(--font-jetbrains),monospace; font-size:7.2pt; letter-spacing:.3em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #cert-a4 .fill{ flex:1; height:1px; background:var(--line); }
  #cert-a4 .num{ font-family:var(--font-jetbrains),monospace; font-size:8.5pt; letter-spacing:.22em; color:var(--faint); white-space:nowrap; }
  #cert-a4 .kicker{ font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.34em; text-transform:uppercase; color:var(--acc); }
  #cert-a4 h1{ font-family:var(--font-spectral),Georgia,serif; font-weight:500; font-size:64pt; line-height:1; letter-spacing:.02em; margin-top:4mm; }
  #cert-a4 h1 em{ font-style:normal; color:inherit; }
  #cert-a4 .name{ font-family:var(--font-spectral),serif; font-size:32pt; line-height:1.1; margin-top:12mm; }
  #cert-a4 .verb{ font-family:var(--font-spectral),serif; font-style:italic; font-size:13pt; color:var(--muted); margin-top:4mm; }
  #cert-a4 .prog{ font-family:var(--font-spectral),serif; font-size:19pt; line-height:1.3; font-weight:500; margin-top:4mm; max-width:210mm; padding:4mm 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
  #cert-a4 .meta{ font-family:var(--font-jetbrains),monospace; font-size:8.5pt; letter-spacing:.14em; color:var(--faint); margin-top:4mm; text-transform:uppercase; }
  #cert-a4 .meta:empty{ display:none; }
  #cert-a4 .trainers{ display:flex; gap:12mm; margin-top:14mm; }
  #cert-a4 .tr{ padding-left:5mm; border-left:1.5pt solid var(--amber); }
  #cert-a4 .tr .n{ font-family:var(--font-spectral),serif; font-size:14pt; line-height:1.1; }
  #cert-a4 .tr .r{ font-size:9pt; color:var(--muted); margin-top:1.5mm; }
  #cert-a4 .foot{ display:flex; align-items:flex-end; justify-content:space-between; border-top:1px solid var(--line); padding-top:4mm; position:relative; z-index:1; }
  #cert-a4 .foot .pl{ font-family:var(--font-spectral),serif; font-style:italic; font-size:11pt; color:var(--muted); }
  #cert-a4 .foot .site{ font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.22em; color:var(--acc); }
  #cert-a4 .band-b{ position:absolute; left:0; right:0; bottom:0; height:4mm; background:linear-gradient(90deg,var(--amber),var(--gold)); }

  /* ── ornament ── */
  #cert-a4 .v-ornament{ padding:14mm; }
  #cert-a4 .v-ornament .grid{ position:absolute; inset:9mm; pointer-events:none; overflow:hidden; display:grid; grid-template-columns:repeat(12,1fr); grid-auto-rows:19mm; align-content:center; justify-items:center; }
  #cert-a4 .v-ornament .grid span{ font-family:var(--font-playfair),Georgia,serif; font-size:11.5mm; line-height:19mm; color:#2A2018; opacity:.07; }
  #cert-a4 .v-ornament .grid span.o{ transform:translateX(100%); }
  #cert-a4 .v-ornament .frame{ position:absolute; inset:7mm; border:1pt solid var(--gold); pointer-events:none; }
  #cert-a4 .v-ornament .frame2{ position:absolute; inset:8.6mm; border:.4pt solid rgba(201,138,43,.5); pointer-events:none; }
  #cert-a4 .v-ornament .cn{ position:absolute; width:16mm; height:16mm; pointer-events:none; border:0 solid var(--gold); border-top-width:2pt; border-left-width:2pt; }
  #cert-a4 .v-ornament .cn::after{ content:""; position:absolute; left:-2.2mm; top:-2.2mm; width:2.6mm; height:2.6mm; background:var(--sheet); border:.8pt solid var(--gold); transform:rotate(45deg); }
  #cert-a4 .v-ornament .cn.tl{ left:5.6mm; top:5.6mm; }
  #cert-a4 .v-ornament .cn.tr{ right:5.6mm; top:5.6mm; transform:scaleX(-1); }
  #cert-a4 .v-ornament .cn.bl{ left:5.6mm; bottom:5.6mm; transform:scaleY(-1); }
  #cert-a4 .v-ornament .cn.br{ right:5.6mm; bottom:5.6mm; transform:scale(-1); }
  #cert-a4 .v-ornament .inner{ flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; padding:6mm 16mm 4mm; position:relative; z-index:1; }
  #cert-a4 .v-ornament .brand{ font-size:40pt; line-height:1; }
  #cert-a4 .v-ornament .brand-sub{ font-size:9pt; letter-spacing:.36em; margin-top:2.5mm; }
  #cert-a4 .v-ornament .brand-sub{ margin-top:1.5mm; }
  #cert-a4 .v-ornament .orn{ display:flex; align-items:center; gap:4mm; margin-top:7mm; color:var(--gold); }
  #cert-a4 .v-ornament .orn i{ display:block; width:36mm; height:1px; background:var(--gold); }
  #cert-a4 .v-ornament .orn b{ display:block; width:2.4mm; height:2.4mm; border:.6pt solid var(--gold); transform:rotate(45deg); }
  #cert-a4 .v-ornament h1{ font-size:54pt; margin-top:5mm; letter-spacing:.14em; text-transform:uppercase; font-weight:500; }
  #cert-a4 .v-ornament h1 em{ font-style:normal; }
  #cert-a4 .v-ornament .verb{ margin-top:7mm; }
  #cert-a4 .v-ornament .name{ margin-top:2mm; font-size:40pt; font-style:italic; background:linear-gradient(96deg,#D99A28 0%,#CE7A1A 55%,#C15612 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent; padding:0 2mm; }
  #cert-a4 .v-ornament .prog{ margin-top:5mm; max-width:230mm; padding:4mm 8mm; font-size:22pt; white-space:pre-line; }
  #cert-a4 .v-ornament .signs{ display:flex; gap:22mm; margin-top:auto; padding-top:10mm; }
  #cert-a4 .v-ornament .sg{ width:74mm; text-align:center; }
  #cert-a4 .v-ornament .sg .l{ height:0; border-top:1.4pt dotted var(--ink); opacity:.55; margin-bottom:2.5mm; }
  #cert-a4 .v-ornament .sg .n{ font-family:var(--font-spectral),serif; font-size:25pt; line-height:1.1; }
  #cert-a4 .v-ornament .sg .r{ font-size:11pt; color:var(--muted); margin-top:.4mm; }
  #cert-a4 .v-ornament .bottom{ display:flex; justify-content:space-between; width:100%; margin-top:6mm; font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.22em; text-transform:uppercase; color:var(--faint); }


  @media print{
    @page{ size:297mm 210mm; margin:0; }
    html, body{ background:#fff !important; margin:0 !important; padding:0 !important; height:auto !important; }
    #cert-a4 .sheet{ box-shadow:none; height:209.4mm; break-inside:avoid; }
  }
`;

function Trainers({ c }: { c: Cert }) {
  if (!c.trainers.length) return null;
  return (
    <div className="trainers">
      {c.trainers.map((t, i) => (
        <div className="tr" key={i}>
          <div className="n">{t.name}</div>
          <div className="r">{t.role}</div>
        </div>
      ))}
    </div>
  );
}

const meta = (c: Cert) => [c.hours, c.date].filter(Boolean).join(" · ");

export function Certificate({ c }: { c: Cert }) {
  const v = "ornament";
  return (
    <div id="cert-a4">
      <style dangerouslySetInnerHTML={{ __html: CERT_CSS }} />
      <section className={`sheet v-${v}`}>
        {v === "ornament" && (
          <>
            <div className="grid" aria-hidden>{Array.from({ length: 12 * 12 }).map((_, i) => <span key={i} className={Math.floor(i / 12) % 2 ? "o" : undefined}>&amp;</span>)}</div>
            <div className="frame" /><div className="frame2" /><div className="cn tl" /><div className="cn tr" /><div className="cn bl" /><div className="cn br" />
            <div className="inner">
              <div className="brand">Pan<em>&amp;</em>Partners</div>
              <div className="brand-sub">Training and Consulting</div>
              <div className="orn"><i /><b /><i /></div>
              <h1>Сертифікат</h1>
              <div className="verb">засвідчує, що</div>
              <div className="name">{c.name}</div>
              <div className="verb">{c.verb} програму</div>
              <div className="prog">{c.program}</div>
              <div className="meta">{meta(c)}</div>
              <div className="signs">
                {c.trainers.map((t, i) => (
                  <div className="sg" key={i}><div className="l" /><div className="n">{t.name}</div><div className="r">{t.role}</div></div>
                ))}
              </div>
              <div className="bottom"><span>{c.place || "Україна"} · {c.year}</span><span>№ {c.number || "—"}</span></div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
