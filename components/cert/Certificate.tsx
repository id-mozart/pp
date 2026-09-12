"use client";

import { useId } from "react";
import type { Cert } from "@/lib/certs";

/**
 * Сертифікат A4 landscape у стилі Pan&Partners. Пʼять варіантів верстки
 * (classic · band · ornament) на спільних токенах бренду:
 * кремовий лист, золоті лінії, Spectral / Inter / JetBrains Mono / Playfair.
 * Друк — через @media print (297×210 мм).
 */
export const CERT_CSS = `
  #cert-a4{ --sheet:#FFFFFF; --band:#F4ECDC; --ink:#2A2018; --muted:#5E4C36; --faint:#9C8B73;
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
  #cert-a4 .v-ornament .grid{ position:absolute; inset:9mm; pointer-events:none; overflow:hidden; display:grid; grid-template-columns:repeat(24,1fr); grid-auto-rows:19mm; align-content:center; }
  #cert-a4 .v-ornament .grid span{ grid-column:span 2; font-family:var(--font-playfair),Georgia,serif; font-size:11.5mm; line-height:19mm; text-align:center; color:#2A2018; opacity:.045; }
  #cert-a4 .v-ornament .grid i{ grid-column:span 1; }
  #cert-a4 .v-ornament .frame{ position:absolute; inset:7mm; border:.75pt solid var(--gold); pointer-events:none; }
  #cert-a4 .v-ornament .frame2{ position:absolute; inset:9mm; border:.4pt solid rgba(201,138,43,.45); pointer-events:none; }
  #cert-a4 .v-ornament .inner{ flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; padding:11mm 16mm 7mm; position:relative; z-index:1; }
  #cert-a4 .v-ornament .tag{ position:absolute; top:12.5mm; font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.22em; text-transform:uppercase; color:var(--faint); z-index:2; white-space:nowrap; }
  #cert-a4 .v-ornament .tag.l{ left:14mm; }
  #cert-a4 .v-ornament .tag.r{ right:14mm; }
  /* нижні кути: QR + адреса сайту зліва, печатка справа */
  #cert-a4 .v-ornament .qr{ position:absolute; left:14mm; bottom:11mm; display:flex; flex-direction:column; align-items:flex-start; gap:2mm; z-index:2; text-align:left; }
  #cert-a4 .v-ornament .qr img{ width:19mm; height:19mm; display:block; }
  #cert-a4 .v-ornament .qr .site{ font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.2em; text-transform:uppercase; color:var(--acc); white-space:nowrap; }
  #cert-a4 .v-ornament .qr .hint{ font-family:var(--font-spectral),serif; font-style:italic; font-size:8.5pt; color:var(--muted); margin-top:.8mm; white-space:nowrap; }
  #cert-a4 .v-ornament .seal{ position:absolute; right:13mm; bottom:9.5mm; width:34mm; height:34mm; z-index:2; }
  #cert-a4 .v-ornament .seal text{ font-family:var(--font-jetbrains),monospace; font-size:5.6px; letter-spacing:.32em; text-transform:uppercase; fill:var(--gold); }
  #cert-a4 .v-ornament .seal .amp{ font-family:var(--font-playfair),Georgia,serif; font-size:44px; letter-spacing:0; }
  #cert-a4 .v-ornament .orn.dbl{ margin-top:5mm; }
  #cert-a4 .v-ornament .orn.dbl i{ width:44mm; height:3px; border-top:1px solid var(--gold); border-bottom:1px solid var(--gold); background:none; opacity:.85; }
  #cert-a4 .v-ornament .orn.dbl b{ width:3mm; height:3mm; }
  #cert-a4 .v-ornament .orn.dbl b::after{ content:""; position:absolute; inset:.7mm; background:var(--gold); }
  #cert-a4 .v-ornament .orn b{ position:relative; }
  #cert-a4 .v-ornament .brand{ font-size:40pt; line-height:1; }
  #cert-a4 .v-ornament .brand-sub{ font-size:9pt; letter-spacing:.36em; margin-top:2.5mm; }
  #cert-a4 .v-ornament .brand-sub{ margin-top:1.5mm; }
  #cert-a4 .v-ornament .orn{ display:flex; align-items:center; gap:4mm; margin-top:7mm; color:var(--gold); }
  #cert-a4 .v-ornament .orn i{ display:block; width:36mm; height:1px; background:var(--gold); }
  #cert-a4 .v-ornament .orn b{ display:block; width:2.4mm; height:2.4mm; border:.6pt solid var(--gold); transform:rotate(45deg); }
  #cert-a4 .v-ornament h1{ font-size:54pt; margin-top:5mm; letter-spacing:.14em; text-transform:uppercase; font-weight:500; }
  #cert-a4 .v-ornament h1 em{ font-style:normal; }
  #cert-a4 .v-ornament .verb{ margin-top:7mm; }
  #cert-a4 .v-ornament .name + .verb{ margin-top:3.5mm; }
  #cert-a4 .v-ornament .name{ margin-top:2mm; width:100%; height:19mm; display:block; overflow:visible; }
  #cert-a4 .v-ornament .name text{ font-family:var(--font-spectral),serif; font-size:40pt; font-style:italic; }
  #cert-a4 .v-ornament .prog{ margin-top:3mm; max-width:230mm; padding:4mm 8mm; font-size:22pt; white-space:pre-line; }
  #cert-a4 .v-ornament .signs{ display:flex; gap:22mm; margin-top:auto; padding-top:6mm; }
  #cert-a4 .v-ornament .sg{ width:74mm; text-align:center; }
  #cert-a4 .v-ornament .sg .l{ display:block; width:100%; height:1.6mm; margin-bottom:2.5mm; }
  #cert-a4 .v-ornament .sg .n{ font-family:var(--font-spectral),serif; font-size:20pt; line-height:1.1; font-style:italic; color:var(--ink); opacity:.78; }
  #cert-a4 .v-ornament .sg .r{ font-size:11pt; color:var(--muted); margin-top:.4mm; }


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

export function Certificate({ c }: { c: Cert }) {
  const v = "ornament";
  // Унікальний id градієнта: однакові id у прихованих мініатюрах ламають заливку при друку.
  const gid = "g" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div id="cert-a4">
      <style dangerouslySetInnerHTML={{ __html: CERT_CSS }} />
      <section className={`sheet v-${v}`}>
        {v === "ornament" && (
          <>
            <div className="grid" aria-hidden>{Array.from({ length: 10 }).flatMap((_, r) => r % 2
              ? [<i key={`a${r}`} />, ...Array.from({ length: 11 }).map((_, k) => <span key={`${r}-${k}`}>&amp;</span>), <i key={`b${r}`} />]
              : Array.from({ length: 12 }).map((_, k) => <span key={`${r}-${k}`}>&amp;</span>))}</div>
            <div className="frame" /><div className="frame2" />
            <div className="tag l">{[c.place || "Україна", c.date || c.year].filter(Boolean).join(" · ")}</div>
            <div className="tag r">№ {c.number || "—"}</div>
            <div className="qr">
              <img src="/cert/qr-site.svg" alt="QR: pan-partners.agency" />
              <div><div className="site">pan-partners.agency</div><div className="hint">Скануй і дізнайся більше</div></div>
            </div>
            <svg className="seal" viewBox="0 0 100 100" aria-hidden>
              <defs>
                <path id={gid + "c"} d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
                <linearGradient id={gid + "s"} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D99A28" /><stop offset="1" stopColor="#C15612" /></linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="none" stroke="#C98A2B" strokeWidth="1" />
              <circle cx="50" cy="50" r="45.5" fill="none" stroke="#C98A2B" strokeWidth=".4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#C98A2B" strokeWidth=".6" />
              <text textLength="238" lengthAdjust="spacing"><textPath href={"#" + gid + "c"} textLength="238" lengthAdjust="spacing">Pan &amp; Partners · Training and Consulting ·</textPath></text>
              <text x="50" y="65" textAnchor="middle" className="amp" fill={`url(#${gid}s)`}>&amp;</text>
            </svg>
            <div className="inner">
              <div className="brand">Pan<em>&amp;</em>Partners</div>
              <div className="brand-sub">Training and Consulting</div>
              <div className="orn dbl"><i /><b /><i /></div>
              <h1>Сертифікат</h1>
              <div className="verb">засвідчує, що</div>
              <svg className="name" aria-label={c.name} role="img">
                <defs><linearGradient id={gid} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#D99A28" /><stop offset=".55" stopColor="#CE7A1A" /><stop offset="1" stopColor="#C15612" /></linearGradient></defs>
                <text x="50%" y="74%" textAnchor="middle" fill={`url(#${gid})`}>{c.name}</text>
              </svg>
              <div className="verb">{c.verb} програму</div>
              <div className="prog">{c.program}</div>
              <div className="meta">{c.hours}</div>
              <div className="signs">
                {c.trainers.map((t, i) => (
                  <div className="sg" key={i}><svg className="l"><line x1="2" y1="50%" x2="100%" y2="50%" stroke="#2A2018" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.01 6.8" /></svg><div className="n">{t.name}</div><div className="r">{t.role}</div></div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
