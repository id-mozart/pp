"use client";

import type { Cert } from "@/lib/certs";

/**
 * Сертифікат A4 landscape у стилі Pan&Partners. Пʼять варіантів верстки
 * (classic · band · minimal · ornament · dark) на спільних токенах бренду:
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
  #cert-a4 .brand{ font-family:var(--font-playfair),Georgia,serif; font-size:19pt; font-weight:500; white-space:nowrap; }
  #cert-a4 .brand em{ color:var(--amber); font-style:normal; }
  #cert-a4 .brand-sub{ font-family:var(--font-jetbrains),monospace; font-size:7.2pt; letter-spacing:.3em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #cert-a4 .fill{ flex:1; height:1px; background:var(--line); }
  #cert-a4 .num{ font-family:var(--font-jetbrains),monospace; font-size:8.5pt; letter-spacing:.22em; color:var(--faint); white-space:nowrap; }
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
  #cert-a4 .band-b{ position:absolute; left:0; right:0; bottom:0; height:4mm; background:linear-gradient(90deg,var(--amber),var(--gold)); }

  /* ── classic ── */
  #cert-a4 .v-classic .edge{ position:absolute; inset:7mm; border:.75pt solid var(--gold); pointer-events:none; }
  #cert-a4 .v-classic .edge2{ position:absolute; inset:9mm; border:.5pt solid rgba(201,138,43,.35); pointer-events:none; }
  #cert-a4 .v-classic .wm{ position:absolute; right:-14mm; bottom:-26mm; font-family:var(--font-playfair),Georgia,serif; font-size:190mm; line-height:1; color:var(--amber); opacity:.05; pointer-events:none; user-select:none; }
  #cert-a4 .v-classic .rh{ display:flex; align-items:center; gap:6mm; position:relative; z-index:1; }
  #cert-a4 .v-classic .body{ flex:1; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:1; padding:0 6mm; }

  /* ── band ── */
  #cert-a4 .v-band{ padding:0; flex-direction:row; }
  #cert-a4 .v-band .side{ width:58mm; background:linear-gradient(180deg,#D2701C,#C98A2B); color:#FCF8F1; padding:14mm 9mm; display:flex; flex-direction:column; position:relative; }
  #cert-a4 .v-band .side .brand{ color:#FCF8F1; font-size:17pt; line-height:1.1; }
  #cert-a4 .v-band .side .brand em{ color:#2A2018; }
  #cert-a4 .v-band .side .brand-sub{ color:rgba(252,248,241,.8); margin-top:2mm; letter-spacing:.24em; }
  #cert-a4 .v-band .side .big{ margin-top:auto; font-family:var(--font-playfair),serif; font-size:120mm; line-height:.8; color:rgba(252,248,241,.18); margin-left:-4mm; }
  #cert-a4 .v-band .side .num{ color:rgba(252,248,241,.85); margin-top:6mm; }
  #cert-a4 .v-band .main{ flex:1; padding:16mm 18mm 14mm 16mm; display:flex; flex-direction:column; }
  #cert-a4 .v-band .main .body{ flex:1; display:flex; flex-direction:column; justify-content:center; }
  #cert-a4 .v-band h1{ font-size:48pt; }
  #cert-a4 .v-band .name{ margin-top:10mm; }

  /* ── minimal ── */
  #cert-a4 .v-minimal{ background:#FFFDF9; padding:14mm 20mm 14mm; }
  #cert-a4 .v-minimal .rh{ display:flex; align-items:center; gap:6mm; }
  #cert-a4 .v-minimal .body{ flex:1; display:flex; flex-direction:column; justify-content:center; }
  #cert-a4 .v-minimal .title{ font-family:var(--font-jetbrains),monospace; font-size:10pt; letter-spacing:.5em; text-transform:uppercase; color:var(--acc); }
  #cert-a4 .v-minimal .name{ font-style:italic; font-size:58pt; line-height:1; margin-top:8mm; letter-spacing:-.01em; }
  #cert-a4 .v-minimal .verb{ margin-top:8mm; font-style:normal; font-size:12pt; }
  #cert-a4 .v-minimal .prog{ text-transform:none; font-family:var(--font-spectral),serif; font-weight:500; font-size:19pt; letter-spacing:0; line-height:1.3; max-width:230mm; }
  #cert-a4 .v-minimal .trainers{ margin-top:auto; padding-top:10mm; border-top:1px solid var(--line); gap:16mm; }
  #cert-a4 .v-minimal .tr{ border:0; padding:0; }
  #cert-a4 .v-minimal .foot{ border:0; padding-top:5mm; }

  /* ── ornament ── */
  #cert-a4 .v-ornament{ padding:14mm; }
  #cert-a4 .v-ornament .frame{ position:absolute; inset:6mm; border:3pt solid var(--amber); pointer-events:none; }
  #cert-a4 .v-ornament .frame2{ position:absolute; inset:9mm; border:.6pt solid var(--gold); pointer-events:none; }
  #cert-a4 .v-ornament .inner{ flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; padding:8mm 16mm 4mm; position:relative; z-index:1; }
  #cert-a4 .v-ornament .brand{ font-size:21pt; }
  #cert-a4 .v-ornament .brand-sub{ margin-top:1.5mm; }
  #cert-a4 .v-ornament .orn{ display:flex; align-items:center; gap:4mm; margin-top:7mm; color:var(--gold); }
  #cert-a4 .v-ornament .orn i{ display:block; width:36mm; height:1px; background:var(--gold); }
  #cert-a4 .v-ornament .orn b{ display:block; width:2.4mm; height:2.4mm; border:.6pt solid var(--gold); transform:rotate(45deg); }
  #cert-a4 .v-ornament h1{ font-size:44pt; margin-top:5mm; letter-spacing:.14em; text-transform:uppercase; font-weight:500; }
  #cert-a4 .v-ornament h1 em{ font-style:normal; }
  #cert-a4 .v-ornament .verb{ margin-top:7mm; }
  #cert-a4 .v-ornament .name{ margin-top:2mm; font-size:34pt; }
  #cert-a4 .v-ornament .prog{ margin-top:5mm; max-width:220mm; }
  #cert-a4 .v-ornament .signs{ display:flex; gap:22mm; margin-top:auto; padding-top:10mm; }
  #cert-a4 .v-ornament .sg{ width:64mm; text-align:center; }
  #cert-a4 .v-ornament .sg .l{ height:1px; background:var(--ink); opacity:.5; margin-bottom:2.5mm; }
  #cert-a4 .v-ornament .sg .n{ font-family:var(--font-spectral),serif; font-size:12.5pt; }
  #cert-a4 .v-ornament .sg .r{ font-size:8.5pt; color:var(--muted); margin-top:1mm; }
  #cert-a4 .v-ornament .bottom{ display:flex; justify-content:space-between; width:100%; margin-top:6mm; font-family:var(--font-jetbrains),monospace; font-size:8pt; letter-spacing:.22em; text-transform:uppercase; color:var(--faint); }

  /* ── dark ── */
  #cert-a4 .v-dark{ background:#1A1410; color:#F5E9D7; --line:rgba(245,233,215,.22); --muted:#C9B79A; --faint:#9C8B73; }
  #cert-a4 .v-dark .glow{ position:absolute; right:-40mm; top:-40mm; width:170mm; height:170mm; border-radius:50%; background:radial-gradient(circle, rgba(210,112,28,.28) 0%, rgba(210,112,28,0) 65%); pointer-events:none; }
  #cert-a4 .v-dark .edge{ position:absolute; inset:7mm; border:.75pt solid rgba(226,166,56,.55); pointer-events:none; }
  #cert-a4 .v-dark .rh{ display:flex; align-items:center; gap:6mm; position:relative; z-index:1; }
  #cert-a4 .v-dark .brand{ color:#F5E9D7; }
  #cert-a4 .v-dark .body{ flex:1; display:flex; flex-direction:column; justify-content:center; position:relative; z-index:1; padding:0 6mm; }
  #cert-a4 .v-dark h1{ color:#F5E9D7; }
  #cert-a4 .v-dark h1 em{ color:#E2A638; }
  #cert-a4 .v-dark .kicker{ color:#E2A638; }
  #cert-a4 .v-dark .prog{ color:#F5E9D7; }
  #cert-a4 .v-dark .tr{ border-left-color:#E2A638; }
  #cert-a4 .v-dark .foot .site{ color:#E2A638; }
  #cert-a4 .v-dark .band-b{ background:linear-gradient(90deg,#E8AC3C,#CE651E); }

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
  const v = c.variant || "classic";
  return (
    <div id="cert-a4">
      <style dangerouslySetInnerHTML={{ __html: CERT_CSS }} />
      <section className={`sheet v-${v}`}>
        {v === "classic" && (
          <>
            <div className="edge" /><div className="edge2" /><div className="wm">&amp;</div>
            <div className="rh">
              <span className="brand">Pan<em>&amp;</em>Partners</span><span className="brand-sub">Training and Consulting</span>
              <span className="fill" /><span className="num">№ {c.number || "—"}</span>
            </div>
            <div className="body">
              <div className="kicker">Pan&amp;Partners · {c.place || "Україна"} · {c.year}</div>
              <h1>Серти<em>фікат</em></h1>
              <div className="name">{c.name}</div>
              <div className="verb">{c.verb} програму</div>
              <div className="prog">{c.program}</div>
              <div className="meta">{meta(c)}</div>
              <Trainers c={c} />
            </div>
            <div className="foot"><span className="pl">{c.place || "Україна"}, {c.year}</span><span className="site">pan-partners.agency</span></div>
            <div className="band-b" />
          </>
        )}
        {v === "band" && (
          <>
            <div className="side">
              <div className="brand">Pan<em>&amp;</em>Partners</div>
              <div className="brand-sub">Training and Consulting</div>
              <div className="big">&amp;</div>
              <div className="num">№ {c.number || "—"}</div>
            </div>
            <div className="main">
              <div className="rh" style={{ display: "flex", alignItems: "center", gap: "6mm" }}>
                <span className="kicker">{c.place || "Україна"} · {c.year}</span><span className="fill" />
                <span className="num">pan-partners.agency</span>
              </div>
              <div className="body">
                <h1>Серти<em>фікат</em></h1>
                <div className="name">{c.name}</div>
                <div className="verb">{c.verb} програму</div>
                <div className="prog">{c.program}</div>
                <div className="meta">{meta(c)}</div>
                <Trainers c={c} />
              </div>
              <div className="foot"><span className="pl">Підтверджує участь та завершення програми</span><span className="site">{c.place || "Україна"}, {c.year}</span></div>
            </div>
          </>
        )}
        {v === "minimal" && (
          <>
            <div className="rh">
              <span className="brand">Pan<em>&amp;</em>Partners</span><span className="brand-sub">Training and Consulting</span>
              <span className="fill" /><span className="num">№ {c.number || "—"}</span>
            </div>
            <div className="body">
              <div className="title">Сертифікат</div>
              <div className="name">{c.name}</div>
              <div className="verb">{c.verb} програму</div>
              <div className="prog">{c.program}</div>
              <div className="meta">{meta(c)}</div>
            </div>
            <Trainers c={c} />
            <div className="foot"><span className="pl">{c.place || "Україна"}, {c.year}</span><span className="site">pan-partners.agency</span></div>
          </>
        )}
        {v === "ornament" && (
          <>
            <div className="frame" /><div className="frame2" />
            <div className="inner">
              <div className="brand">Pan<em>&amp;</em>Partners</div>
              <div className="brand-sub">Training and Consulting</div>
              <div className="orn"><i /><b /><i /></div>
              <h1>Серти<em>фікат</em></h1>
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
        {v === "dark" && (
          <>
            <div className="glow" /><div className="edge" />
            <div className="rh">
              <span className="brand">Pan<em>&amp;</em>Partners</span><span className="brand-sub">Training and Consulting</span>
              <span className="fill" /><span className="num">№ {c.number || "—"}</span>
            </div>
            <div className="body">
              <div className="kicker">{c.place || "Україна"} · {c.year}</div>
              <h1>Серти<em>фікат</em></h1>
              <div className="name">{c.name}</div>
              <div className="verb">{c.verb} програму</div>
              <div className="prog">{c.program}</div>
              <div className="meta">{meta(c)}</div>
              <Trainers c={c} />
            </div>
            <div className="foot"><span className="pl">{c.place || "Україна"}, {c.year}</span><span className="site">pan-partners.agency</span></div>
            <div className="band-b" />
          </>
        )}
      </section>
    </div>
  );
}
