"use client";

import type { Cert } from "@/lib/certs";

/**
 * Сертифікат A4 landscape у стилі Pan&Partners: кремовий лист, золоті
 * лінії, Spectral для заголовка, Inter для тексту, JetBrains Mono для
 * службових написів. Друк — через @media print (297×210 мм).
 */
export const CERT_CSS = `
  #cert-a4{ --sheet:#FCF8F1; --band:#F4ECDC; --ink:#2A2018; --muted:#5E4C36; --faint:#9C8B73;
    --line:rgba(140,116,82,.36); --acc:#C4621F; --amber:#D2701C; --gold:#C98A2B;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
    font-family:var(--font-inter),system-ui,sans-serif; color:var(--ink); }
  #cert-a4 *{ box-sizing:border-box; margin:0; padding:0; }
  #cert-a4 .sheet{ position:relative; width:297mm; height:210mm; overflow:hidden; background:var(--sheet);
    padding:16mm 18mm 14mm; display:flex; flex-direction:column; box-shadow:0 24px 70px rgba(60,40,15,.22); }
  #cert-a4 .edge{ position:absolute; inset:7mm; border:.75pt solid var(--gold); pointer-events:none; }
  #cert-a4 .edge2{ position:absolute; inset:9mm; border:.5pt solid rgba(201,138,43,.35); pointer-events:none; }
  #cert-a4 .wm{ position:absolute; right:-14mm; bottom:-26mm; font-family:var(--font-playfair),Georgia,serif; font-size:190mm; line-height:1; color:var(--amber); opacity:.05; pointer-events:none; user-select:none; }
  #cert-a4 .rh{ display:flex; align-items:center; gap:6mm; position:relative; z-index:1; }
  #cert-a4 .rh .brand{ font-family:var(--font-playfair),Georgia,serif; font-size:19pt; font-weight:500; white-space:nowrap; }
  #cert-a4 .rh .brand em{ color:var(--amber); font-style:normal; }
  #cert-a4 .rh .sub{ font-family:var(--font-jetbrains),monospace; font-size:7.2pt; letter-spacing:.3em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #cert-a4 .rh .fill{ flex:1; height:1px; background:var(--line); }
  #cert-a4 .rh .num{ font-family:var(--font-jetbrains),monospace; font-size:8.5pt; letter-spacing:.22em; color:var(--faint); white-space:nowrap; }
  #cert-a4 .body{ flex:1; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:1; padding:0 6mm; }
  #cert-a4 .kicker{ font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.34em; text-transform:uppercase; color:var(--acc); }
  #cert-a4 h1{ font-family:var(--font-spectral),Georgia,serif; font-weight:500; font-size:56pt; line-height:1; letter-spacing:.02em; margin-top:4mm; }
  #cert-a4 h1 em{ font-style:italic; color:var(--amber); }
  #cert-a4 .name{ font-family:var(--font-spectral),serif; font-size:32pt; line-height:1.1; margin-top:12mm; }
  #cert-a4 .verb{ font-family:var(--font-spectral),serif; font-style:italic; font-size:13pt; color:var(--muted); margin-top:4mm; }
  #cert-a4 .prog{ font-size:15.5pt; line-height:1.35; font-weight:500; margin-top:3mm; max-width:210mm; text-transform:uppercase; letter-spacing:.02em; }
  #cert-a4 .meta{ font-family:var(--font-jetbrains),monospace; font-size:8.5pt; letter-spacing:.14em; color:var(--faint); margin-top:4mm; text-transform:uppercase; }
  #cert-a4 .meta:empty{ display:none; }
  #cert-a4 .trainers{ display:flex; gap:12mm; margin-top:14mm; }
  #cert-a4 .tr{ padding-left:5mm; border-left:1.5pt solid var(--amber); }
  #cert-a4 .tr .n{ font-family:var(--font-spectral),serif; font-size:14pt; line-height:1.1; }
  #cert-a4 .tr .r{ font-size:9pt; color:var(--muted); margin-top:1.5mm; }
  #cert-a4 .foot{ display:flex; align-items:flex-end; justify-content:space-between; border-top:1px solid var(--line); padding-top:4mm; position:relative; z-index:1; }
  #cert-a4 .foot .pl{ font-family:var(--font-spectral),serif; font-style:italic; font-size:11pt; color:var(--muted); }
  #cert-a4 .foot .site{ font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.22em; color:var(--acc); }
  #cert-a4 .band{ position:absolute; left:0; right:0; bottom:0; height:4mm; background:linear-gradient(90deg,var(--amber),var(--gold)); }
  @media print{
    @page{ size:297mm 210mm; margin:0; }
    html, body{ background:#fff !important; margin:0 !important; padding:0 !important; height:auto !important; }
    #cert-a4 .sheet{ box-shadow:none; height:209.4mm; break-inside:avoid; }
  }
`;

export function Certificate({ c }: { c: Cert }) {
  return (
    <div id="cert-a4">
      <style dangerouslySetInnerHTML={{ __html: CERT_CSS }} />
      <section className="sheet">
        <div className="edge" />
        <div className="edge2" />
        <div className="wm">&amp;</div>
        <div className="rh">
          <span className="brand">Pan<em>&amp;</em>Partners</span>
          <span className="sub">Training and Consulting</span>
          <span className="fill" />
          <span className="num">№ {c.number || "—"}</span>
        </div>
        <div className="body">
          <div className="kicker">Pan&amp;Partners · {c.place || "Україна"} · {c.year}</div>
          <h1>Серти<em>фікат</em></h1>
          <div className="name">{c.name || "Ім'я Прізвище"}</div>
          <div className="verb">{c.verb || "завершив"} програму</div>
          <div className="prog">{c.program || "Назва програми"}</div>
          <div className="meta">{[c.hours, c.date].filter(Boolean).join(" · ")}</div>
          {c.trainers.length ? (
            <div className="trainers">
              {c.trainers.map((t, i) => (
                <div className="tr" key={i}>
                  <div className="n">{t.name}</div>
                  <div className="r">{t.role}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="foot">
          <span className="pl">{c.place || "Україна"}, {c.year}</span>
          <span className="site">pan-partners.agency</span>
        </div>
        <div className="band" />
      </section>
    </div>
  );
}
