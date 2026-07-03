import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil — Tetiana Pan · Pan&Partners (UZ)",
  robots: { index: false, follow: false },
};

/**
 * Профайл на узбекском — точная копия «кремового» дизайна (TRAINING AND
 * CONSULTING / CONTACT INFORMATION). Размеры/цвета/позиции сняты 1-в-1 из
 * оригинального PDF. Шрифты бренда: Spectral / Inter / JetBrains / Playfair.
 * Экспорт: печать в PDF (A4, поля 0).
 */

const CSS = `
  body:has(#pp2) header, body:has(#pp2) footer, body:has(#pp2) main ~ div,
  body:has(#pp2) [class*="fixed"] { display:none !important; }
  body:has(#pp2){ background:#E9E2D5 !important; }

  #pp2{ --sheet:#FCF8F1; --band:#F4ECDC; --ink:#2A2018; --muted:#5E4C36; --faint:#9C8B73;
    --line:rgba(140,116,82,.36); --acc:#C4621F; --amber:#D2701C; --gold:#C98A2B;
    display:flex; flex-direction:column; align-items:center; gap:22px; padding:26px 0;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
    font-family:var(--font-inter),system-ui,sans-serif; color:var(--ink); }
  #pp2 *{ box-sizing:border-box; margin:0; padding:0; }

  #pp2 .sheet{ position:relative; width:210mm; height:297mm; overflow:hidden;
    background:var(--sheet); padding:13mm 16mm 9mm; display:flex; flex-direction:column;
    box-shadow:0 24px 70px rgba(60,40,15,.22); }

  #pp2 .serif{ font-family:var(--font-spectral),Georgia,serif; }
  #pp2 .mono{ font-family:var(--font-jetbrains),ui-monospace,monospace; }
  #pp2 .logo{ font-family:var(--font-playfair),Georgia,serif; }
  #pp2 .it{ font-style:italic; }

  /* runhead */
  #pp2 .rh{ display:flex; align-items:center; gap:5.5mm; }
  #pp2 .rh .wm{ font-size:13.5pt; font-weight:500; letter-spacing:.005em; white-space:nowrap; }
  #pp2 .rh .wm em{ color:var(--amber); font-style:normal; }
  #pp2 .rh .tag{ font-size:7.1pt; letter-spacing:.26em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #pp2 .rh .fill{ flex:1; height:1px; background:var(--line); }

  /* hero */
  #pp2 .hero{ display:grid; grid-template-columns:1fr 70mm; gap:4mm; margin-top:4.2mm; align-items:start; }
  #pp2 .hero-l{ padding-top:17.7mm; }
  #pp2 h1{ font-size:40.5pt; font-weight:500; line-height:1.0; letter-spacing:-.005em; }
  #pp2 h1 em{ color:var(--amber); font-style:italic; }
  #pp2 .role{ font-size:9.5pt; line-height:1.62; margin-top:5mm; color:var(--muted); }
  #pp2 .role .a{ color:var(--acc); font-weight:600; }
  #pp2 .role b{ color:var(--ink); font-weight:600; }
  #pp2 .hair{ height:1px; background:var(--line); margin:4.5mm 0; }
  #pp2 .quote{ font-size:10.9pt; font-style:italic; line-height:1.5; color:var(--ink); }

  #pp2 .portrait{ position:relative; width:70mm; }
  #pp2 .portrait img{ display:block; width:100%; height:84.5mm; object-fit:cover; object-position:center 18%;
    position:relative; z-index:1; }
  #pp2 .portrait .frame{ position:absolute; top:3mm; left:3mm; right:-2.6mm; bottom:-2.3mm;
    border:.75pt solid var(--gold); z-index:0; }

  /* statement */
  #pp2 .stmt{ position:relative; margin-top:4.6mm; background:var(--band); border-radius:4px;
    padding:4mm 7mm 4mm 8.6mm; font-family:var(--font-spectral),Georgia,serif;
    font-size:12.8pt; line-height:1.46; color:var(--ink); }
  #pp2 .stmt::before{ content:""; position:absolute; left:0; top:0; bottom:0; width:3pt; background:var(--amber); border-radius:4px 0 0 4px; }

  /* stats */
  #pp2 .stats{ display:grid; grid-template-columns:repeat(4,1fr); margin-top:8.6mm; }
  #pp2 .stat{ padding:0 5mm; border-left:1px solid var(--line); }
  #pp2 .stat:first-child{ border-left:0; padding-left:0; }
  #pp2 .stat .n{ font-family:var(--font-spectral),Georgia,serif; font-style:italic; font-weight:500; color:var(--acc); line-height:1; }
  #pp2 .stat .n .big{ font-size:30pt; }
  #pp2 .stat .n .u{ font-size:19.5pt; }
  #pp2 .stat .t{ font-size:7.6pt; line-height:1.48; color:var(--muted); margin-top:2.6mm; }
  #pp2 .stat .uba{ font-size:8.2pt; letter-spacing:.06em; color:var(--acc); margin-top:1.8mm; }

  /* label + bullets */
  #pp2 .lab{ font-family:var(--font-jetbrains),monospace; font-size:7.5pt; letter-spacing:.24em; text-transform:uppercase; color:var(--faint); display:flex; align-items:center; gap:4mm; }
  #pp2 .lab::after{ content:""; flex:1; height:1px; background:var(--line); }
  #pp2 .twocol{ display:grid; grid-template-columns:1fr 1fr; column-gap:9mm; margin-top:6.5mm; }
  #pp2 .bullets{ margin-top:3mm; display:flex; flex-direction:column; gap:2.4mm; }
  #pp2 .bul{ display:flex; gap:3mm; align-items:baseline; }
  #pp2 .bul .dot{ flex:none; width:3.4pt; height:3.4pt; border-radius:99px; background:var(--amber); transform:translateY(-1pt); }
  #pp2 .bul p{ font-size:8.9pt; line-height:1.42; color:var(--ink); }
  #pp2 .bul p b{ font-weight:600; }
  #pp2 .bullets.lg{ gap:3.2mm; }
  #pp2 .bullets.lg .bul p{ font-size:10.5pt; line-height:1.45; }

  #pp2 .geo{ margin-top:6mm; }
  #pp2 .geo .p{ font-size:8.9pt; line-height:1.5; margin-top:3mm; color:var(--ink); }
  #pp2 .geo .p b{ font-weight:600; }

  #pp2 .logos{ display:block; width:497pt; max-width:100%; margin-top:auto; }

  #pp2 .foot{ display:flex; align-items:flex-end; justify-content:space-between;
    border-top:1px solid var(--line); padding-top:3mm; margin-top:3.9mm; }
  #pp2 .foot .pg{ font-family:var(--font-jetbrains),monospace; font-size:7.1pt; letter-spacing:.22em; color:var(--faint); }
  #pp2 .foot .tl{ font-family:var(--font-spectral),serif; font-style:italic; font-size:10pt; }
  #pp2 .foot .tl .a{ color:var(--acc); }
  #pp2 .foot .tl .m{ color:var(--muted); }

  /* page 2 */
  #pp2 h2{ font-family:var(--font-spectral),serif; font-size:25.5pt; font-weight:500; line-height:1; margin-top:9.2mm; }
  #pp2 h2 em{ color:var(--amber); font-style:italic; }
  #pp2 .prog{ display:flex; gap:5mm; align-items:baseline; padding:2mm 0; border-top:1px solid var(--line); }
  #pp2 .prog:first-of-type{ border-top:0; }
  #pp2 .prog .no{ font-family:var(--font-spectral),serif; font-style:italic; font-size:15pt; line-height:1; color:var(--acc); flex:none; width:8mm; }
  #pp2 .prog .nm{ font-family:var(--font-spectral),serif; font-style:italic; font-size:9.6pt; line-height:1.35; color:var(--acc); }
  #pp2 .prog .ld{ font-size:8.6pt; line-height:1.45; color:var(--muted); margin-top:.6mm; }

  #pp2 .band{ position:relative; margin-top:6mm; background:var(--band); border-radius:12px; padding:5mm 6mm;
    display:flex; align-items:center; justify-content:space-between; gap:4mm; }
  #pp2 .ci{ display:flex; align-items:center; gap:2.6mm; }
  #pp2 .ci .ic{ flex:none; width:8mm; height:8mm; border-radius:99px; border:1px solid rgba(196,98,31,.5); display:grid; place-items:center; color:var(--acc); }
  #pp2 .ci .k{ font-family:var(--font-jetbrains),monospace; font-size:6.2pt; letter-spacing:.18em; text-transform:uppercase; color:var(--faint); white-space:nowrap; }
  #pp2 .ci .v{ font-family:var(--font-jetbrains),monospace; font-size:7.5pt; color:var(--acc); margin-top:.8mm; white-space:nowrap; }

  #pp2 .foot2{ display:flex; align-items:flex-end; gap:5mm; margin-top:3.8mm; padding-top:5mm; }
  #pp2 .qr{ flex:none; width:44pt; height:44pt; }
  #pp2 .foot2 .site{ font-family:var(--font-jetbrains),monospace; font-size:10.5pt; color:var(--acc); }
  #pp2 .foot2 .rule{ flex:1; height:1px; background:var(--line); margin:0 4mm 3mm; }
  #pp2 .foot2 .pg{ font-family:var(--font-jetbrains),monospace; font-size:7.1pt; letter-spacing:.22em; color:var(--faint); white-space:nowrap; }

  #pp2 .noprint{ position:fixed; right:18px; top:14px; z-index:50; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:#C4621F; border:1px solid rgba(196,98,31,.4); border-radius:99px; padding:7px 14px; }
  @page{ size:A4; margin:0; }
  @media print{ html,body{ background:var(--sheet) !important; }
    #pp2{ padding:0; gap:0; } #pp2 .noprint{ display:none !important; }
    #pp2 .sheet{ box-shadow:none; page-break-after:always; }
    #pp2 .sheet:last-child{ page-break-after:auto; } }
`;

function Runhead({ tag }: { tag: string }) {
  return (
    <div className="rh">
      <span className="wm logo">Pan<em>&amp;</em>Partners</span>
      <span className="tag mono">{tag}</span>
      <span className="fill" />
      <span className="tag mono">PROFIL · 2026</span>
    </div>
  );
}

const STATS = [
  { big: "25+", u: "yil", t: "savdoda — savdo menejeridan mintaqaviy direktorgacha (Danone, «Olimp» YoAJ)" },
  { big: "20+", u: "yil", t: "jamoalarni boshqarish, standartlarni joriy etish va kompaniyani rivojlantirish" },
  { big: "17+", u: "yil", t: "trening va konsaltingda — ichki trener va oʻquv boʻlimi rahbari (Coca-Cola, Reckitt Benckiser, «Olimp»)" },
  { big: "#2", u: "", t: "Ukraina savdo boʻyicha TOP-10 trenerlar reytingida", uba: "UBA, 2023" },
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
  { name: "«Tarmoqlar bilan muzokaralar: marjani himoya qilish va yetkazib beruvchining kuchli pozitsiyasi»", lead: "KAM va tijorat jamoalari uchun — foydali shartlar boʻyicha muzokara va kompaniya maqsadlariga erishish." },
  { name: "«Raqamlar orqali xaridlar: kategoriya iqtisodiyoti va muzokara kuchi»", lead: "Xaridorlar va kategoriya menejerlari uchun — ROI, aylanma va rentabellik orqali qaror qabul qilish, barqaror va oʻzaro foydali hamkorliklar qurish." },
  { name: "«Tizimli B2B savdo: birinchi aloqadan shartnoma va mijozni rivojlantirishgacha»", lead: "B2B savdo jamoalari uchun — yangi mijozlarni jalb qilish, uzoq muddatli hamkorlikni rivojlantirish va natijani tuzilma, masʼuliyat va tadbirkorlik tafakkuri orqali boshqarish." },
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

const IconPhone = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>);
const IconMail = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>);
const IconFb = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17.5V.3C17.1.2 16 .1 14.9.1 12.4.1 10.7 1.6 10.7 4.3V6H8v3h2.7v8h3.3V9Z"/></svg>);
const IconIg = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>);

export default function ProfileUzPage() {
  return (
    <div id="pp2">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="noprint mono" href="/admin/profile_uz">UZ · profil</a>

      {/* ─────────── СТРАНИЦА 1 ─────────── */}
      <section className="sheet">
        <Runhead tag="TRENING VA KONSALTING" />

        <div className="hero">
          <div className="hero-l">
            <h1 className="serif">Tetiana <em>Pan</em></h1>
            <p className="role">
              <span className="a">Biznes-trener, fasilitator, kouch, mentor,</span>
              <br />
              jamoalar va rahbarlarni oʻqitish va rivojlantirish boʻyicha ekspert,
              <br />
              <b>Pan&amp;Partners</b> asoschisi
            </p>
            <div className="hair" />
            <p className="quote serif">
              Hurmatli hamkorlar, keling, tanishamiz. Tajriba va bilimlarim bilan
              boʻlishishdan mamnun boʻlaman — birgalikda jamoangizning boshqaruv
              kompetensiyalari, jamoaviy ish va tijorat natijalarini kuchaytiramiz.
            </p>
          </div>
          <div className="portrait">
            <span className="frame" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/profile2-portrait.png" alt="Tetiana Pan" />
          </div>
        </div>

        <div className="stmt">
          Men jamoalarni jamoani boshqarish, biznes-jarayonlarni qurish va tijorat
          natijadorligini boshqarish koʻnikmalarini tizimli qoʻllashga oʻrgataman —
          kompaniyaning biznes-maqsadlariga erishish uchun. Xalqaro va milliy
          bizneslar ichida ishlaganman — tizim ichdan qanday ishlashini tushunaman.
        </div>

        <div className="stats">
          {STATS.map((s) => (
            <div key={s.big} className="stat">
              <div className="n"><span className="big">{s.big}</span>{s.u && <span className="u"> {s.u}</span>}</div>
              <div className="t">{s.t}</div>
              {s.uba && <div className="uba">{s.uba}</div>}
            </div>
          ))}
        </div>

        <div className="twocol">
          <div>
            <div className="lab">Mening ixtisosligim</div>
            <div className="bullets">{SPEC.map((s) => (<div key={s} className="bul"><span className="dot" /><p>{s}</p></div>))}</div>
          </div>
          <div>
            <div className="lab">Natijada jamoalar qodir</div>
            <div className="bullets">
              <div className="bul"><span className="dot" /><p>Oʻz ishi va jamoa ishini <b>tahlil qilish</b>.</p></div>
              <div className="bul"><span className="dot" /><p>Natijaga olib keladigan <b>harakat rejasini tuzish</b>.</p></div>
              <div className="bul"><span className="dot" /><p>Samarali ishning <b>koʻrsatkichlarini boshqarish</b>.</p></div>
            </div>
          </div>
        </div>

        <div className="geo">
          <div className="lab">Loyihalarimiz geografiyasi</div>
          <p className="p">
            <b>Ukraina, Qozogʻiston, Oʻzbekiston, Turkmaniston, Yevropa (Chexiya, Ispaniya, Polsha), AQSh, Xitoy.</b>{" "}
            Turli bozorlarda ishlash xalqaro tendensiyalar va har bir mamlakat biznes-xususiyatlarini hisobga olish imkonini beradi.
            Amalga oshirilgan loyihalar orasida — B2B va B2C boʻyicha savdo va muzokaralar boʻyicha 1 500+ oʻquv dasturi.
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logos" src="/brand/profile2-logos.png" alt="Mijozlar" />

        <div className="foot">
          <span className="tl"><span className="a">Bosimsiz. Manipulyatsiyasiz.</span> <span className="m">Tabiiy va oʻlchanadigan natija bilan.</span></span>
          <span className="pg">01 / 02</span>
        </div>
      </section>

      {/* ─────────── СТРАНИЦА 2 ─────────── */}
      <section className="sheet">
        <Runhead tag="TRENING VA KONSALTING" />

        <h2 className="serif">Asosiy <em>dasturlar</em></h2>

        <div style={{ marginTop: "4mm" }}>
          {PROGRAMS.map((p, i) => (
            <div key={p.lead} className="prog">
              <span className="no">{i + 1}</span>
              <div>
                {p.name && <p className="nm">{p.name}</p>}
                <p className="ld">{p.lead}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="twocol">
          <div>
            <div className="lab">Maksimal natijani nima beradi</div>
            <div className="bullets lg">{DRIVES.map((s) => (<div key={s} className="bul"><span className="dot" /><p>{s}</p></div>))}</div>
          </div>
          <div>
            <div className="lab">Taʼlim va sertifikatlar</div>
            <div className="bullets">{EDU.map((s) => (<div key={s} className="bul"><span className="dot" /><p>{s}</p></div>))}</div>
          </div>
        </div>

        <div className="lab" style={{ marginTop: "auto" }}>Aloqa maʼlumotlari</div>
        <div className="band" style={{ marginTop: "3mm" }}>
          <div className="ci"><span className="ic"><IconPhone /></span><div><div className="k">Telefon</div><div className="v">+380 50 448-14-11</div></div></div>
          <div className="ci"><span className="ic"><IconMail /></span><div><div className="k">Email</div><div className="v">tatiana.g.pan@gmail.com</div></div></div>
          <div className="ci"><span className="ic"><IconFb /></span><div><div className="k">Facebook</div><div className="v">PanandPartners</div></div></div>
          <div className="ci"><span className="ic"><IconIg /></span><div><div className="k">Instagram</div><div className="v">tetiana_pan.sales</div></div></div>
        </div>

        <div className="foot2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="qr" src="/brand/qr-site.svg" alt="QR — pan-partners.agency" />
          <span className="site">pan-partners.agency</span>
          <span className="rule" />
          <span className="pg">02 / 02</span>
        </div>
      </section>
    </div>
  );
}
