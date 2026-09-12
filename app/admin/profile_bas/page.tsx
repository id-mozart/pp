import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профайл бізнес-тренера — Юрій Бас · Pan&Partners",
  robots: { index: false, follow: false },
};

/**
 * Профайл бізнес-тренера Юрія Баса — «кремовий» дизайн профайлу Тетяни
 * (TRAINING AND CONSULTING). Експорт: друк у PDF (A4, поля 0).
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
  #pp2 .hero-l{ padding-top:5mm; }
  #pp2 h1{ font-size:40.5pt; font-weight:500; line-height:1.0; letter-spacing:-.005em; }
  #pp2 h1 em{ color:var(--amber); font-style:italic; }
  #pp2 .role{ font-size:9.5pt; line-height:1.62; margin-top:5mm; color:var(--muted); }
  #pp2 .role .a{ color:var(--acc); font-weight:600; }
  #pp2 .role b{ color:var(--ink); font-weight:600; }
  #pp2 .hair{ height:1px; background:var(--line); margin:4.5mm 0; }
  #pp2 .quote{ font-size:10.9pt; font-style:italic; line-height:1.5; color:var(--ink); }

  #pp2 .portrait{ position:relative; width:70mm; }
  #pp2 .portrait img{ display:block; width:100%; height:84.5mm; object-fit:cover; object-position:center 12%;
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
  #pp2 .prog .nm{ font-family:var(--font-spectral),serif; font-style:italic; font-size:12pt; line-height:1.3; color:var(--acc); }
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

function Runhead() {
  return (
    <div className="rh">
      <span className="wm logo">Pan<em>&amp;</em>Partners</span>
      <span className="tag mono">TRAINING AND CONSULTING</span>
      <span className="fill" />
      <span className="tag mono">ПРОФАЙЛ · 2026</span>
    </div>
  );
}

const STATS = [
  { big: "18+", u: "років", t: "у продажах Japan Tobacco International — від молодшого торгового представника до національного менеджера" },
  { big: "13+", u: "років", t: "на управлінських посадах: територіальний, регіональний і національний рівень" },
  { big: "5+", u: "років", t: "корпоративний тренер: оцінка персоналу, тренінгові програми, польовий супровід" },
  { big: "ECF", u: "", t: "сертифікований коуч; випускник міжнародної школи бізнес-тренерів", uba: "ICBT · ECF" },
];
const SPEC = [
  "Продажі та переговори: власний досвід угод із національними мережами.",
  "Публічні виступи та ефективна комунікація.",
  "Базові навички управлінця; зворотний зв'язок у роботі з командою.",
];
const CERTS = [
  ["ICBT", " — міжнародна школа бізнес-тренерів."],
  ["ECF", " — школа бізнес-коучингу Наталії Романенко."],
  ["Microlearning", " — навчання за допомогою діджитал‑інструментів."],
  ["«Чорний квадрат»", " — театральна школа-студія."],
];
const PROGRAMS: { lead: string; name?: string }[] = [
  {
    name: "«Продажі»",
    lead: "Тренінгові програми на власному досвіді продажів національним і локальним мережам.",
  },
  {
    name: "«Переговори»",
    lead: "Підготовка і ведення переговорів: «Сільпо», METRO, «Білла», «Еко Маркет», «Мега Маркет», «Лоток».",
  },
  {
    name: "«Публічні виступи»",
    lead: "Впевнена подача, структура виступу і робота з аудиторією — з досвідом театральної школи.",
  },
  { lead: "Ефективна комунікація в команді та з клієнтами." },
  { lead: "Базові навички управлінця: постановка задач, контроль, розвиток співробітників." },
  { lead: "Зворотний зв'язок як інструмент розвитку команди." },
];
const DRIVES = [
  "Власний досвід успішних продажів і переговорів з національними та локальними мережами.",
  "Запуск нової дистрибуційної моделі компанії JTI та управління системою дистрибуції на національному рівні.",
  "Комплексний підхід: від аналізу ситуації та мети навчання до обов'язкового польового посттренінгового супроводу.",
];
const PROJECTS = [
  "Московський державний університет економіки, статистики та інформатики, Київська філія (2004–⁠2007).",
  "Київський промислово-економічний коледж (1991–⁠1995).",
  "Міжнародна школа бізнес-тренерів (ICBT).",
  "Школа бізнес-коучингу Наталії Романенко — сертифікат ECF.",
  "Microlearning — навчання за допомогою діджитал‑інструментів.",
  "Театральна школа-студія «Чорний квадрат». Англійська мова — Intermediate.",
];

const IconPhone = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg>);
const IconMail = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>);
const IconFb = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.5-3H14V4.5c0-.9.3-1.5 1.6-1.5H17.5V.3C17.1.2 16 .1 14.9.1 12.4.1 10.7 1.6 10.7 4.3V6H8v3h2.7v8h3.3V9Z"/></svg>);
const IconIg = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>);

export default function ProfileBasPage() {
  return (
    <div id="pp2">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="noprint mono" href="/admin/profile_bas">Бас · профайл</a>

      {/* ─────────── СТОРІНКА 1 ─────────── */}
      <section className="sheet">
        <Runhead />

        <div className="hero">
          <div className="hero-l">
            <h1 className="serif">Юрій<br /><em>Бас</em></h1>
            <p className="role">
              <span className="a">Бізнес-тренер, коуч,</span>
              <br />
              експерт з продажів, переговорів і публічних виступів,
              <br />
              бізнес-тренер команди <b>Pan&amp;Partners</b>
            </p>
            <div className="hair" />
            <p className="quote serif">
              Шановні партнери, радий знайомству. Вісімнадцять років у продажах
              Japan Tobacco International: від молодшого торгового представника
              до національного менеджера з розвитку дистриб&#8217;юторів.
            </p>
          </div>
          <div className="portrait">
            <span className="frame" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/profile-bas-portrait.jpg" alt="Юрій Бас" style={{ objectPosition: "center 24%" }} />
          </div>
        </div>

        <div className="stmt">
          Створюю тренінгові програми під індивідуальний запит і специфіку
          бізнесу: від аналізу поточної ситуації та мети навчання до
          обов&#8217;язкового польового посттренінгового супроводу — щоб досвід
          став стійкими навичками учасників.
        </div>

        <div className="stats">
          {STATS.map((s) => (
            <div key={s.big} className="stat">
              <div className="n"><span className="big">{s.big}</span>{s.u && <span className="u"> {s.u}</span>}</div>
              <div className="t">{s.t}</div>
              {"uba" in s && s.uba && <div className="uba">{s.uba}</div>}
            </div>
          ))}
        </div>

        <div className="twocol">
          <div>
            <div className="lab">Моя спеціалізація</div>
            <div className="bullets">{SPEC.map((s) => (<div key={s} className="bul"><span className="dot" /><p>{s}</p></div>))}</div>
          </div>
          <div>
            <div className="lab">Курси та сертифікації</div>
            <div className="bullets">
              {CERTS.map(([b, rest]) => (
                <div key={b} className="bul"><span className="dot" /><p><b>{b}</b>{rest}</p></div>
              ))}
            </div>
          </div>
        </div>

        <div className="geo">
          <div className="lab">Ринки та клієнти</div>
          <p className="p">
            <b>FMCG, дистрибуція, рітейл, B2B.</b>{" "}
            Досвід переговорів із мережами «Сільпо», METRO, «Білла»,
            «Еко Маркет», «Мега Маркет», «Лоток»; серед клієнтів — JTI, BIC,
            «Агро Прайд», Storm Group, «Сона Фарм», ZMIST, ab soft та інші.
          </p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="logos" src="/brand/profile-bas-logos.png" alt="Клієнти" />

        <div className="foot">
          <span className="tl"><span className="a">Досвід продажів із перших рук.</span> <span className="m">Навички, що лишаються з командою.</span></span>
        </div>
      </section>

      {/* ─────────── СТОРІНКА 2 ─────────── */}
      <section className="sheet">
        <Runhead />

        <h2 className="serif">Ключові <em>програми</em></h2>

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
            <div className="lab">Що дає максимальний результат</div>
            <div className="bullets">{DRIVES.map((s) => (<div key={s} className="bul"><span className="dot" /><p>{s}</p></div>))}</div>
          </div>
          <div>
            <div className="lab">Освіта та сертифікації</div>
            <div className="bullets" style={{ gap: "1.6mm" }}>
              {PROJECTS.map((s) => (
                <div key={s} className="bul"><span className="dot" /><p style={{ fontSize: "7.9pt" }}>{s}</p></div>
              ))}
            </div>
          </div>
        </div>


        <div className="foot2" style={{ marginTop: "auto" }}>
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
