import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil — Tetiana Pan · Pan&Partners (UZ)",
  robots: { index: false, follow: false },
};

/**
 * Профайл бизнес-тренера на узбекском (2×A4) — воссоздание «кремового» дизайна
 * (TRAINING AND CONSULTING / CONTACT INFORMATION) в редактируемом виде.
 * Шрифты бренда: Spectral / Inter / JetBrains / Playfair. Экспорт: печать в PDF (поля 0).
 */

const GRAD_G = "linear-gradient(100deg,#F0C26E 0%,#E2A638 55%,#C5631F 100%)";

const CSS = `
  body:has(#pp2) header, body:has(#pp2) footer, body:has(#pp2) main ~ div,
  body:has(#pp2) [class*="fixed"] { display:none !important; }
  body:has(#pp2){ background:#E9E2D5 !important; }

  #pp2{ --ink:#2A2015; --muted:#5E4C36; --faint:#9C8B73; --line:rgba(150,125,90,.34);
    --acc:#C4621F; --sheet:#FBF7F1; --band:#F4ECDC; --plate:#FFFDF8;
    display:flex; flex-direction:column; align-items:center; gap:22px; padding:26px 0;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
    font-family:var(--font-inter),system-ui,sans-serif; }
  #pp2 *{ box-sizing:border-box; margin:0; padding:0; }

  #pp2 .sheet{ position:relative; width:210mm; height:297mm; overflow:hidden;
    background:var(--sheet); color:var(--ink); padding:13mm 15mm 9mm;
    display:flex; flex-direction:column; box-shadow:0 24px 70px rgba(60,40,15,.22); }

  #pp2 .serif{ font-family:var(--font-spectral),Georgia,serif; }
  #pp2 .mono{ font-family:var(--font-jetbrains),ui-monospace,monospace; }
  #pp2 .logo{ font-family:var(--font-playfair),Georgia,serif; }
  #pp2 .grad{ color:var(--acc); }
  #pp2 .it{ font-style:italic; }

  #pp2 .runhead{ display:flex; align-items:center; gap:6mm; }
  #pp2 .runhead .wm{ font-size:14pt; letter-spacing:.01em; white-space:nowrap; }
  #pp2 .runhead .tag{ font-size:6.6pt; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #pp2 .runhead .fill{ flex:1; height:1px; background:linear-gradient(90deg,transparent,#C5872255 40%,#C5872255 60%,transparent); }
  #pp2 .eyebrow{ font-size:6.8pt; font-weight:500; letter-spacing:.26em; text-transform:uppercase; color:var(--faint); }
  #pp2 .lab{ font-size:6.8pt; font-weight:500; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); display:flex; align-items:center; gap:3mm; }
  #pp2 .lab::after{ content:""; flex:1; height:1px; background:var(--line); }
  #pp2 .body{ font-size:8.6pt; line-height:1.5; color:var(--muted); }

  /* hero */
  #pp2 .hero{ display:grid; grid-template-columns:1fr 52mm; gap:9mm; margin-top:8mm; }
  #pp2 h1{ font-size:31pt; font-weight:500; line-height:1.02; letter-spacing:-.01em; }
  #pp2 .role{ font-size:9pt; line-height:1.7; color:var(--muted); margin-top:3mm; }
  #pp2 .role b{ color:var(--ink); font-weight:600; }
  #pp2 .goldbar{ height:2px; width:15mm; border-radius:2px; background:${GRAD_G}; margin:4mm 0; }
  #pp2 .quote{ font-size:10pt; font-style:italic; line-height:1.55; color:var(--ink); }
  #pp2 .portrait{ position:relative; }
  #pp2 .portrait img{ display:block; width:100%; height:64mm; object-fit:cover; object-position:center 22%;
    border-radius:8px; border:1px solid var(--line); }
  #pp2 .portrait .brk{ position:absolute; right:-2mm; bottom:-2mm; width:14mm; height:14mm;
    border-right:2px solid #C5631F; border-bottom:2px solid #C5631F; border-radius:0 0 8px 0; }
  #pp2 .cap{ margin-top:3mm; font-size:6.6pt; letter-spacing:.2em; text-transform:uppercase; color:var(--faint); }

  /* statement */
  #pp2 .statement{ position:relative; margin-top:7mm; background:var(--band); border-radius:9px;
    padding:5mm 6mm 5mm 8mm; font-size:12pt; line-height:1.5; color:var(--ink); }
  #pp2 .statement::before{ content:""; position:absolute; left:0; top:5mm; bottom:5mm; width:3px; border-radius:2px; background:${GRAD_G}; }

  /* stats */
  #pp2 .stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin-top:7mm; }
  #pp2 .stat{ padding:0 5mm; border-left:1px solid var(--line); }
  #pp2 .stat:first-child{ border-left:0; padding-left:0; }
  #pp2 .stat .n{ font-size:24pt; line-height:1; color:var(--acc); }
  #pp2 .stat .t{ font-size:7.2pt; line-height:1.45; color:var(--muted); margin-top:2.4mm; }
  #pp2 .stat .u{ font-size:6.6pt; letter-spacing:.16em; text-transform:uppercase; color:var(--acc); margin-top:1.6mm; }

  /* two columns */
  #pp2 .twocol{ display:grid; grid-template-columns:1fr 1fr; column-gap:9mm; margin-top:7mm; }
  #pp2 .bullets{ margin-top:3mm; display:flex; flex-direction:column; gap:2.6mm; }
  #pp2 .bul{ display:flex; gap:3mm; align-items:baseline; }
  #pp2 .bul .dot{ flex:none; width:4px; height:4px; border-radius:99px; background:${GRAD_G}; transform:translateY(-1pt); }
  #pp2 .bul p{ font-size:8.6pt; line-height:1.42; }
  #pp2 .bul.serif p{ font-size:10pt; }

  /* geography */
  #pp2 .geo{ margin-top:6.5mm; }
  #pp2 .geo .places{ font-size:9pt; font-weight:600; color:var(--ink); margin-top:2.4mm; }
  #pp2 .geo .txt{ font-size:8pt; line-height:1.5; color:var(--muted); margin-top:1.6mm; }

  #pp2 .logos{ display:block; width:100%; margin-top:auto; filter:grayscale(1); opacity:.9; }

  #pp2 .foot{ display:flex; align-items:flex-end; justify-content:space-between;
    border-top:1px solid var(--line); padding-top:3mm; margin-top:6mm; }
  #pp2 .foot .pg{ font-size:7pt; letter-spacing:.22em; color:var(--faint); }

  /* page 2 */
  #pp2 .prog{ display:flex; gap:5mm; align-items:baseline; padding:2mm 0; border-top:1px solid var(--line); }
  #pp2 .prog:first-of-type{ border-top:0; }
  #pp2 .prog .no{ font-size:15pt; line-height:1; color:var(--acc); font-style:italic; flex:none; width:8mm; }
  #pp2 .prog .name{ font-size:9.6pt; font-style:italic; line-height:1.35; color:var(--acc); }
  #pp2 .prog .lead{ font-size:8.6pt; line-height:1.45; color:var(--muted); margin-top:.6mm; }

  #pp2 .band{ position:relative; margin-top:6mm; background:var(--band); border-radius:12px; padding:5mm 6mm;
    display:flex; align-items:center; justify-content:space-between; gap:4mm; }
  #pp2 .ci{ display:flex; align-items:center; gap:2.6mm; }
  #pp2 .ci .ic{ flex:none; width:8mm; height:8mm; border-radius:99px; border:1px solid rgba(197,99,31,.5);
    display:grid; place-items:center; color:var(--acc); }
  #pp2 .ci .k{ font-size:6.2pt; letter-spacing:.18em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #pp2 .ci .v{ font-size:7.5pt; color:var(--acc); margin-top:.8mm; white-space:nowrap; }

  #pp2 .foot2{ display:flex; align-items:flex-end; gap:5mm; margin-top:auto; padding-top:5mm; }
  #pp2 .qr{ flex:none; width:20mm; height:20mm; }
  #pp2 .foot2 .site{ font-size:10.5pt; color:var(--acc); letter-spacing:.02em; }
  #pp2 .foot2 .rule{ flex:1; height:1px; background:var(--line); margin:0 4mm 3mm; }
  #pp2 .foot2 .pg{ font-size:7pt; letter-spacing:.22em; color:var(--faint); white-space:nowrap; }

  #pp2 .noprint{ position:fixed; right:18px; top:14px; z-index:50; font-size:11px; letter-spacing:.1em;
    text-transform:uppercase; color:#C4621F; border:1px solid rgba(197,99,31,.4); border-radius:99px; padding:7px 14px; }
  @page{ size:A4; margin:0; }
  @media print{
    html,body{ background:var(--sheet,#FBF7F1) !important; }
    #pp2{ padding:0; gap:0; }
    #pp2 .noprint{ display:none !important; }
    #pp2 .sheet{ box-shadow:none; page-break-after:always; }
    #pp2 .sheet:last-child{ page-break-after:auto; }
  }
`;

function Runhead({ tag }: { tag: string }) {
  return (
    <div className="runhead">
      <span className="wm logo">
        Pan<em className="grad">&amp;</em>Partners
      </span>
      <span className="tag mono">{tag}</span>
      <span className="fill" />
      <span className="tag mono">PROFIL · 2026</span>
    </div>
  );
}

const STATS = [
  { n: "25+ yil", t: "savdoda — savdo menejeridan mintaqaviy direktorgacha (Danone, «Olimp» YoAJ)" },
  { n: "20+ yil", t: "jamoalarni boshqarish, standartlarni joriy etish va kompaniyani rivojlantirish" },
  { n: "17+ yil", t: "trening va konsaltingda — ichki trener va oʻquv boʻlimi rahbari (Coca-Cola, Reckitt Benckiser, «Olimp»)" },
  { n: "#2", t: "Ukraina savdo boʻyicha TOP-10 trenerlar reytingida", u: "UBA, 2023" },
];

const SPEC = [
  "Strategik sessiyalar hamda loyihalar va jarayonlarni yaratish va boshqarish boʻyicha sessiyalar.",
  "Rahbarlar va top-menejerlarni yetakchilik va jamoani boshqarishga oʻqitish.",
  "Savdo va muzokaralar boʻyicha treninglar, kalit mijozlarni boshqarish.",
];

const RESULTS = [
  "Oʻz ishini va jamoa ishini tahlil qilish.",
  "Natijaga olib boradigan harakatlar rejasini tuzish.",
  "Samarali ishning koʻrsatkichlarini boshqarish.",
];

const PROGRAMS: { lead: string; name?: string }[] = [
  { lead: "Jamoa natijadorligini boshqarish — maqsaddan joriy etish va biznes-natijalargacha." },
  { lead: "Top-rahbarlar uchun strategik va fasilitatsion sessiyalar." },
  {
    name: "«Tarmoqlar bilan muzokaralar: marjani himoya qilish va yetkazib beruvchining kuchli pozitsiyasi»",
    lead: "KAM va tijorat jamoalari uchun — foydali shartlar boʻyicha muzokara va kompaniya maqsadlariga erishish.",
  },
  {
    name: "«Raqamlar orqali xaridlar: kategoriya iqtisodiyoti va muzokara kuchi»",
    lead: "Xaridorlar va kategoriya menejerlari uchun — ROI, aylanma va rentabellik orqali qaror qabul qilish, barqaror va oʻzaro foydali hamkorliklar qurish.",
  },
  {
    name: "«Tizimli B2B savdo: birinchi aloqadan shartnoma va mijozni rivojlantirishgacha»",
    lead: "B2B savdo jamoalari uchun — yangi mijozlarni jalb qilish, uzoq muddatli hamkorlikni rivojlantirish va natijani tuzilma, masʼuliyat va tadbirkorlik tafakkuri orqali boshqarish.",
  },
  { lead: "Muzokara amaliyotlari — biznes-oʻyinlar, muzokara duellari va rolli oʻyinlar." },
];

const DRIVES = [
  "Rahbar va biznes egasi sifatidagi shaxsiy muvaffaqiyatli tajribam (xalqaro kompaniyalarda ish va 10 yillik muvaffaqiyatli biznes).",
  "Doimiy oʻqish va mijozlar uchun oʻquv dasturlariga innovatsiyalarni joriy etish.",
  "Psixologik taʼlim — mijoz ehtiyojlarini chuqur tushunish va tailor-made tamoyili boʻyicha dasturlar yaratish.",
];

const EDU = [
  "Iqtisodiyot universiteti qoshidagi ixtisoslashtirilgan kurs — «Menejment va korxona iqtisodiyoti», Odessa, Ukraina.",
  "Biznes-taʼlim va muntazam malaka oshirish (Ukraina, Avstriya, AQSh, Ispaniya).",
  "Sertifikatlangan kouch (Coca-Cola University, ICF).",
  "Sertifikatlangan fasilitator va strategik sessiyalar moderatori.",
  "Psixoterapevt (European Association for Gestalt Therapy, EAGT).",
  "Musiqa bilim yurti, fortepiano oʻqituvchisi, Buxoro, Oʻzbekiston.",
];

const IconPhone = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>
);
const IconMail = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
);
const IconFb = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17.5V.3C17.1.2 16 .1 14.9.1 12.4.1 10.7 1.6 10.7 4.3V6H8v3h2.7v8h3.3V9Z"/></svg>
);
const IconIg = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>
);

function CI({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="ci">
      <span className="ic">{icon}</span>
      <div>
        <div className="k mono">{k}</div>
        <div className="v mono">{v}</div>
      </div>
    </div>
  );
}

export default function ProfileUzPage() {
  return (
    <div id="pp2">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="noprint mono" href="/admin/profile_uz">UZ · profil</a>

      {/* ─────────── СТРАНИЦА 1 ─────────── */}
      <section className="sheet">
        <Runhead tag="TRENING VA KONSALTING" />

        <div className="hero">
          <div>
            <h1 className="serif">
              Tetiana <em className="grad it">Pan</em>
            </h1>
            <p className="role">
              <span className="grad" style={{ fontWeight: 600 }}>
                Biznes-trener, fasilitator, kouch, mentor,
              </span>
              <br />
              jamoalar va rahbarlarni oʻqitish va rivojlantirish boʻyicha ekspert,
              <br />
              <b>Pan&amp;Partners</b> asoschisi
            </p>
            <div className="goldbar" />
            <p className="serif quote">
              Hurmatli hamkorlar, keling, tanishamiz. Tajriba va bilimlarim bilan
              boʻlishishdan mamnun boʻlaman — birgalikda jamoangizning boshqaruv
              kompetensiyalari, jamoaviy ish va tijorat natijalarini kuchaytiramiz.
            </p>
          </div>
          <div>
            <div className="portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/profile2-portrait.png" alt="Tetiana Pan" />
              <span className="brk" />
            </div>
            <p className="cap mono">Pan&amp;Partners asoschisi</p>
          </div>
        </div>

        <div className="statement serif">
          Men jamoalarni jamoani boshqarish, biznes-jarayonlarni qurish va tijorat
          natijadorligini boshqarish koʻnikmalarini tizimli qoʻllashga oʻrgataman —
          kompaniyaning biznes-maqsadlariga erishish uchun. Xalqaro va milliy
          bizneslar ichida ishlaganman — tizim ichdan qanday ishlashini tushunaman.
        </div>

        <div className="stats">
          {STATS.map((s) => (
            <div key={s.n} className="stat">
              <div className="n serif it">{s.n}</div>
              <div className="t">{s.t}</div>
              {s.u && <div className="u mono">{s.u}</div>}
            </div>
          ))}
        </div>

        <div className="twocol">
          <div>
            <div className="lab mono">Mening ixtisosligim</div>
            <div className="bullets">
              {SPEC.map((s) => (
                <div key={s} className="bul">
                  <span className="dot" />
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="lab mono">Natijada jamoalar qodir</div>
            <div className="bullets">
              {RESULTS.map((s) => (
                <div key={s} className="bul">
                  <span className="dot" />
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="geo">
          <div className="lab mono">Loyihalarimiz geografiyasi</div>
          <p className="places">
            Ukraina · Qozogʻiston · Oʻzbekiston · Turkmaniston · Yevropa (Chexiya,
            Ispaniya, Polsha) · AQSh · Xitoy
          </p>
          <p className="txt">
            Turli bozorlarda ishlash xalqaro tendensiyalar va har bir mamlakat
            biznes-xususiyatlarini hisobga olish imkonini beradi. Amalga oshirilgan
            loyihalar orasida — B2B va B2C boʻyicha savdo va muzokaralar boʻyicha
            1 500+ oʻquv dasturi.
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logos" src="/brand/profile2-logos.png" alt="Mijozlar" />

        <div className="foot">
          <span className="grad serif it" style={{ fontSize: "10pt" }}>
            Bosimsiz. Manipulyatsiyasiz. Tabiiy va oʻlchanadigan natija bilan.
          </span>
          <span className="pg mono">01 / 02</span>
        </div>
      </section>

      {/* ─────────── СТРАНИЦА 2 ─────────── */}
      <section className="sheet">
        <Runhead tag="ASOSIY DASTURLAR · TAʼLIM" />

        <h1 className="serif" style={{ marginTop: "7mm", fontSize: "26pt" }}>
          Asosiy <em className="grad it">dasturlar</em>
        </h1>

        <div style={{ marginTop: "4mm" }}>
          {PROGRAMS.map((p, i) => (
            <div key={p.lead} className="prog">
              <span className="no serif">{i + 1}</span>
              <div>
                {p.name && <p className="name serif">{p.name}</p>}
                <p className="lead">{p.lead}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="twocol" style={{ marginTop: "6mm" }}>
          <div>
            <div className="lab mono">Maksimal natijani nima beradi</div>
            <div className="bullets">
              {DRIVES.map((s) => (
                <div key={s} className="bul">
                  <span className="dot" />
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="lab mono">Taʼlim va sertifikatlar</div>
            <div className="bullets">
              {EDU.map((s) => (
                <div key={s} className="bul">
                  <span className="dot" />
                  <p>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lab mono" style={{ marginTop: "auto" }}>
          Aloqa maʼlumotlari
        </div>
        <div className="band" style={{ marginTop: "3mm" }}>
          <CI icon={<IconPhone />} k="Telefon" v="+380 50 448-14-11" />
          <CI icon={<IconMail />} k="Email" v="tatiana.g.pan@gmail.com" />
          <CI icon={<IconFb />} k="Facebook" v="PanandPartners" />
          <CI icon={<IconIg />} k="Instagram" v="tetiana_pan.sales" />
        </div>

        <div className="foot2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="qr" src="/brand/qr-site.svg" alt="QR — pan-partners.agency" />
          <span className="site mono">pan-partners.agency</span>
          <span className="rule" />
          <span className="pg mono">02 / 02</span>
        </div>
      </section>
    </div>
  );
}
