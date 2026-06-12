import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профайл бизнес-тренера — Татьяна Пан · Pan&Partners",
  robots: { index: false, follow: false },
};

/**
 * Печатный профайл бизнес-тренера (2 × A4) в фирменной стилистике сайта:
 * обсидиан + янтарное золото, Spectral/Inter/JetBrains, золотые линейки,
 * ctag-плашки — сдержанно, без сеток и зерна. Палитра и шрифты захардкожены
 * (не зависят от выбранного концепта). Экспорт: печать в PDF (поля = 0).
 */

const GOLD = "#E2A638";
const GRAD = "linear-gradient(95deg,#F7B658 0%,#EE8C2C 52%,#DC6716 100%)";
const GRAD_G = "linear-gradient(100deg,#F0C26E 0%,#E2A638 55%,#C5631F 100%)";

const CSS = `
  /* — скрываем хром сайта на этом маршруте — */
  body:has(#pp-profile) header,
  body:has(#pp-profile) footer,
  body:has(#pp-profile) main ~ div,
  body:has(#pp-profile) [class*="fixed"] { display: none !important; }
  body:has(#pp-profile) { background: #060605 !important; }

  #pp-profile { --ink:#F4E6CC; --muted:#CDBb9b; --faint:#94835f; --line:rgba(96,80,58,.5);
    --acc:#E8A93C; --sheet:#0B0A09; --plate:linear-gradient(160deg,rgba(33,21,10,.95),rgba(19,12,6,.96));
    --ctagbg:rgba(35,26,18,.84); --logoplate:#F2EDE4;
    display:flex; flex-direction:column; align-items:center; gap:24px; padding:32px 0;
    -webkit-print-color-adjust:exact; print-color-adjust:exact;
    font-family:var(--font-inter),system-ui,sans-serif; }
  #pp-profile * { box-sizing:border-box; margin:0; }

  /* светлая тема — тёплая слоновая кость, акценты глубже для контраста */
  #pp-profile.light { --ink:#261C11; --muted:#5E4D38; --faint:#8A7355; --line:rgba(140,115,80,.42);
    --acc:#BD5E14; --sheet:#FBF6EC; --plate:linear-gradient(160deg,#FFFEFA,#F4EBD9);
    --ctagbg:rgba(226,166,56,.12); --logoplate:#FFFFFF; }
  #pp-profile.light .rule { background:linear-gradient(90deg,#C5872288,#C5872226 55%,transparent); }
  #pp-profile.light .glow { background:radial-gradient(48% 34% at 88% -6%, rgba(226,166,56,.22), transparent 70%); }
  #pp-profile.light .sheet { box-shadow:0 30px 80px rgba(40,28,12,.25); }

  #pp-profile .sheet { position:relative; width:210mm; height:297mm; overflow:hidden;
    background:var(--sheet); color:var(--ink); padding:12mm 14mm 9mm;
    display:flex; flex-direction:column;
    box-shadow:0 30px 80px rgba(0,0,0,.6); }
  #pp-profile .glow { position:absolute; inset:0; pointer-events:none;
    background:radial-gradient(48% 34% at 88% -6%, rgba(226,166,56,.13), transparent 70%); }

  #pp-profile .serif { font-family:var(--font-spectral),Georgia,serif; }
  #pp-profile .mono { font-family:var(--font-jetbrains),ui-monospace,monospace; }
  #pp-profile .hand { font-family:var(--font-caveat),cursive; }
  #pp-profile .logo { font-family:var(--font-playfair),Georgia,serif; }
  /* печать: background-clip:text даёт рамки-артефакты в Chrome print — золото сплошным цветом */
  #pp-profile .grad { color:var(--acc); }

  #pp-profile .runhead { display:flex; align-items:baseline; justify-content:space-between; }
  #pp-profile .runhead .lg { font-size:15pt; letter-spacing:.01em; }
  #pp-profile .runhead .tag { font-size:7pt; letter-spacing:.26em; text-transform:uppercase; color:var(--faint); }
  #pp-profile .rule { height:1px; background:linear-gradient(90deg,${GOLD}66,${GOLD}22 55%,transparent); margin:5mm 0 0; }
  #pp-profile .goldbar { height:2px; width:16mm; border-radius:2px; background:${GRAD_G}; }

  #pp-profile .eyebrow { font-size:7pt; font-weight:500; letter-spacing:.28em; text-transform:uppercase;
    width:fit-content; color:var(--acc); }
  #pp-profile h1 { font-size:30pt; font-weight:500; line-height:1.04; letter-spacing:-.01em; }
  #pp-profile h2 { font-size:15pt; font-weight:500; line-height:1.15; }
  #pp-profile .body { font-size:9pt; line-height:1.6; color:var(--muted); }
  #pp-profile .lead { font-size:10.5pt; line-height:1.55; font-style:italic; color:var(--ink); }

  #pp-profile .ctag { display:inline-flex; align-items:baseline; gap:4px;
    border:1px solid var(--line); border-left:3px solid ${GOLD}; border-radius:7px;
    background:var(--ctagbg); padding:5px 9px;
    font-size:7pt; font-weight:500; letter-spacing:.1em; text-transform:uppercase; color:var(--ink); }

  #pp-profile .plate { position:relative; border:1px solid var(--line); border-radius:9px;
    background:var(--plate); }
  #pp-profile .plate .bar { position:absolute; left:6mm; top:-1px; height:2px; width:12mm;
    border-radius:2px; background:${GRAD_G}; }

  #pp-profile .num { font-size:7.5pt; font-weight:500; letter-spacing:.18em; color:var(--acc); }
  #pp-profile .footrow { display:flex; align-items:flex-end; justify-content:space-between;
    border-top:1px solid var(--line); padding-top:3mm; margin-top:auto; }

  #pp-profile .no-print { position:fixed; right:18px; top:14px; z-index:50;
    font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:#E8A93C;
    border:1px solid rgba(226,166,56,.4); border-radius:99px; padding:7px 14px; text-decoration:none; }

  @page { size:A4; margin:0; }
  @media print {
    html, body { background:var(--sheet,#0B0A09) !important; }
    #pp-profile .no-print { display:none !important; }
    #pp-profile { padding:0; gap:0; }
    #pp-profile .sheet { box-shadow:none; page-break-after:always; }
    #pp-profile .sheet:last-child { page-break-after:auto; }
  }
`;

function Runhead({ tag }: { tag: string }) {
  return (
    <>
      <div className="runhead">
        <span className="lg logo">
          Pan<em className="grad">&amp;</em>Partners
        </span>
        <span className="tag mono">{tag}</span>
      </div>
      <div className="rule" />
    </>
  );
}

const STATS = [
  { v: "20+", l: "лет — управление командами, внедрение стандартов и развитие компании" },
  { v: "25+", l: "лет в продажах: от менеджера до регионального директора (Danone, ЗАО «Олимп»)" },
  { v: "17+", l: "лет в обучении и консалтинге — внутренний тренер и руководитель обучения: Coca-Cola, Reckitt Benckiser, «Олимп»; далее — Pan&Partners" },
];

const SPEC = [
  "Проведение стратегических сессий и сессий по работе с проектами и процессами.",
  "Обучение руководителей и топ-менеджеров лидерству и управлению командами.",
  "Обучение продажам и переговорам, управление ключевыми клиентами.",
];

const PROGRAMS: { lead: string; name?: string }[] = [
  { lead: "Управление результативностью команды — от цели до внедрения и получения бизнес-результатов." },
  { lead: "Проведение стратегических и фасилитационных сессий для топ-руководителей." },
  {
    lead: "Для KAM и коммерческих команд — переговоры, выгодные условия и достижение целей компании:",
    name: "«Переговоры с сетями: защита маржи и сильная позиция поставщика»",
  },
  {
    lead: "Для закупщиков и категорийных менеджеров — решения через ROI, оборачиваемость и прибыльность, устойчивые и выгодные партнёрства:",
    name: "«Закупки через цифры: экономика категории и переговорная сила»",
  },
  {
    lead: "Для команд B2B-продаж — новые клиенты, долгосрочное партнёрство и управление результатом через структуру, ответственность и предпринимательское мышление:",
    name: "«Системные B2B-продажи: от первого контакта до контракта и развития клиента»",
  },
  { lead: "Переговорные практикумы — бизнес-игры, переговорные поединки, ролевые игры." },
];

const MAXIMUM = [
  "Собственный успешный опыт руководителя и собственника компании: работа в международных компаниях и 10 лет успешного бизнеса.",
  "Постоянное обучение и внедрение инноваций в обучающие программы для клиентов.",
  "Психологическое образование — глубокое понимание потребностей заказчика и создание программ по принципу tailor-made.",
];

const EDUCATION = [
  "«Менеджмент и экономика предприятий» — специализированный курс при университете экономики (Одесса).",
  "Бизнес-образование и регулярное повышение квалификации: Украина, Австрия, США, Испания.",
  "Сертифицированный коуч (Coca-Cola University, ICF).",
  "Сертифицированный фасилитатор и модератор стратегических сессий.",
  "Психотерапевт (European Association for Gestalt Therapy, EAGT).",
  "Музыкальное училище, преподаватель фортепиано — Бухара, Узбекистан.",
];

export default function ProfilePage({
  searchParams,
}: {
  searchParams?: { theme?: string };
}) {
  const light = searchParams?.theme === "light";
  return (
    <div id="pp-profile" className={light ? "light" : undefined}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a className="no-print mono" href={light ? "/admin/profile" : "/admin/profile?theme=light"}>
        {light ? "тёмная версия" : "светлая версия"}
      </a>

      {/* ───────────────────────── СТРАНИЦА 1 ───────────────────────── */}
      <section className="sheet">
        <div className="glow" />
        <Runhead tag="Профайл · Бизнес-тренер · Фасилитатор · Коуч — 2026" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 62mm", gap: "9mm", marginTop: "6mm" }}>
          {/* левая колонка — имя и позиционирование */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3.6mm" }}>
            <span className="eyebrow mono">Информация о бизнес-тренере</span>
            <h1 className="serif">
              Татьяна <em className="grad" style={{ fontStyle: "italic" }}>Пан</em>
            </h1>
            <p className="mono" style={{ fontSize: "7.6pt", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted)", lineHeight: 1.8 }}>
              Бизнес-тренер · эксперт по обучению и развитию команд и&nbsp;руководителей
              <br />
              основатель Pan&amp;Partners
            </p>
            <div className="goldbar" />
            <p className="serif lead">
              Уважаемые партнёры, давайте знакомиться. Буду рада поделиться
              опытом и экспертизой, чтобы вместе усилить управленческие
              компетенции, работу в команде и коммерческие результаты ваших
              команд.
            </p>
            <p className="body">
              Обучаю команды системно использовать навыки управления командой,
              построения бизнес-процессов и управления коммерческими
              результатами — для достижения бизнес-целей компании.
            </p>
            <p className="body">
              В результате команды умеют: анализировать свою работу и работу
              команды, создавать план действий, который приведёт к результату,
              и управлять показателями эффективной работы.
            </p>
            <div style={{ marginTop: "1mm" }}>
              <p className="mono" style={{ fontSize: "6.8pt", letterSpacing: ".24em", textTransform: "uppercase", color: "var(--faint)" }}>
                Мои клиенты
              </p>
              <p className="serif" style={{ fontSize: "10pt", fontStyle: "italic", lineHeight: 1.7, marginTop: "1.6mm", color: "var(--ink)" }}>
                Coca-Cola · Auchan · Vodafone · Kyivstar · GlobalLogic · EPAM ·
                DTEK · Pfizer <span style={{ color: "var(--faint)" }}>и другие</span>
              </p>
            </div>
          </div>

          {/* правая колонка — портрет */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3.5mm" }}>
            <div className="plate" style={{ overflow: "hidden" }}>
              <span className="bar" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/profile-portrait.jpg"
                alt="Татьяна Пан"
                style={{ display: "block", width: "100%", height: "72mm", objectFit: "cover", objectPosition: "center 20%" }}
              />
              <div
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "3mm 4mm", borderTop: `1px solid var(--line)`,
                }}
              >
                <span className="mono" style={{ fontSize: "6.8pt", letterSpacing: ".2em", textTransform: "uppercase" }}>
                  <span className="grad">Основатель Pan&Partners</span>
                </span>
                <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: 99, background: GRAD_G }} />
              </div>
            </div>
            <span className="ctag mono" style={{ display: "block", lineHeight: 1.6 }}>
              <b className="grad" style={{ fontWeight: 600 }}>№&nbsp;2 в топ-10 тренеров по продажам Украины</b> · UBA&nbsp;2023
            </span>
            <p className="body" style={{ fontSize: "7.6pt", lineHeight: 1.55 }}>
              UBA — Ukrainian Business Awards. Работала внутри международного и
              национального бизнеса — понимаю, как работает система изнутри.
            </p>
          </div>
        </div>

        {/* стат-плиты опыта */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4mm", marginTop: "5mm" }}>
          {STATS.map((s) => (
            <div key={s.v} className="plate" style={{ padding: "4.5mm 5mm" }}>
              <span className="bar" />
              <div className="serif grad" style={{ fontSize: "17pt", lineHeight: 1 }}>{s.v}</div>
              <p className="body" style={{ fontSize: "7.4pt", lineHeight: 1.5, marginTop: "2mm" }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* специализация */}
        <div style={{ marginTop: "5.5mm" }}>
          <span className="eyebrow mono">Моя специализация</span>
          <div style={{ marginTop: "3mm" }}>
            {SPEC.map((s, i) => (
              <div
                key={s}
                style={{
                  display: "flex", gap: "4mm", alignItems: "baseline",
                  padding: "2.6mm 0", borderTop: "1px solid var(--line)",
                }}
              >
                <span className="num mono">0{i + 1}</span>
                <p className="serif" style={{ fontSize: "10.5pt", lineHeight: 1.45 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* что даёт максимальный результат */}
        <div style={{ marginTop: "4.5mm" }}>
          <span className="eyebrow mono">Что даёт максимальный результат обучения</span>
          <div style={{ marginTop: "3mm", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4mm" }}>
            {MAXIMUM.map((m, i) => (
              <div key={m} style={{ display: "flex", gap: "3mm", alignItems: "baseline" }}>
                <span className="num mono">0{i + 1}</span>
                <p className="body" style={{ fontSize: "7.9pt" }}>{m}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="footrow">
          <p className="serif" style={{ fontSize: "10pt", fontStyle: "italic" }}>
            <span className="grad">Без давления. Без манипуляций.</span>{" "}
            <span style={{ color: "var(--muted)" }}>Системно — и с измеримым результатом.</span>
          </p>
          <span className="mono" style={{ fontSize: "7pt", letterSpacing: ".22em", color: "var(--faint)" }}>1 — 2</span>
        </div>
      </section>

      {/* ───────────────────────── СТРАНИЦА 2 ───────────────────────── */}
      <section className="sheet">
        <div className="glow" />
        <Runhead tag="Ключевые программы · Образование · Проекты" />

        {/* программы */}
        <div style={{ marginTop: "5.5mm" }}>
          <span className="eyebrow mono">Специализация и ключевые программы</span>
          <div style={{ marginTop: "2.5mm" }}>
            {PROGRAMS.map((p, i) => (
              <div
                key={p.lead}
                style={{
                  display: "flex", gap: "4mm", alignItems: "baseline",
                  padding: "2mm 0", borderTop: "1px solid var(--line)",
                }}
              >
                <span className="num mono">0{i + 1}</span>
                <div>
                  <p className="body" style={{ fontSize: "8.6pt", lineHeight: 1.5 }}>{p.lead}</p>
                  {p.name && (
                    <p className="serif grad" style={{ fontSize: "9.6pt", fontStyle: "italic", lineHeight: 1.4, marginTop: "0.8mm" }}>
                      {p.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* образование */}
        <div style={{ marginTop: "4.5mm" }}>
          <span className="eyebrow mono">Образование и сертификации</span>
          <div style={{ marginTop: "2.5mm", display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "8mm", rowGap: "1.7mm" }}>
            {EDUCATION.map((e) => (
              <div key={e} style={{ display: "flex", gap: "2.6mm", alignItems: "baseline" }}>
                <span style={{ flex: "none", width: 4, height: 4, borderRadius: 99, background: GRAD_G, transform: "translateY(-1pt)" }} />
                <p className="body" style={{ fontSize: "7.9pt" }}>{e}</p>
              </div>
            ))}
          </div>
        </div>

        {/* география */}
        <div style={{ marginTop: "3.5mm", borderTop: "1px solid var(--line)", paddingTop: "2.6mm" }}>
          <span className="eyebrow mono">География проектов</span>
          <p className="serif" style={{ fontSize: "10pt", fontStyle: "italic", marginTop: "2mm" }}>
            Украина · Казахстан · Узбекистан · Туркменистан · Европа (Чехия,
            Испания, Польша) · США · Китай
          </p>
          <p className="body" style={{ fontSize: "7.6pt", marginTop: "1.4mm" }}>
            Опыт работы с разными рынками позволяет учитывать международные
            тренды и специфику бизнеса каждой страны.
          </p>
        </div>

        {/* проекты + лого */}
        <div style={{ marginTop: "3.5mm" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "4mm" }}>
            <span className="serif grad" style={{ fontSize: "20pt", lineHeight: 1 }}>1500+</span>
            <p className="body" style={{ fontSize: "8.2pt" }}>
              обучающих программ по продажам и переговорам. Среди
              реализованных проектов в сфере B2B и B2C:
            </p>
          </div>
          <div
            style={{
              marginTop: "3mm",
              width: "121mm", borderRadius: "9px", border: "1px solid var(--line)",
              background: "var(--logoplate)", padding: "3.5mm 4.5mm",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/profile-logos.png"
              alt="Клиенты Pan&Partners"
              style={{ display: "block", width: "100%", filter: "grayscale(1)", mixBlendMode: "multiply" }}
            />
          </div>
        </div>

        <div className="footrow">
          <div>
            <p className="mono" style={{ fontSize: "7pt", letterSpacing: ".14em", color: "var(--ink)" }}>
              +38 050 448 14 11&nbsp;&nbsp;·&nbsp;&nbsp;tatiana.g.pan@gmail.com
            </p>
            <p className="mono" style={{ fontSize: "7pt", letterSpacing: ".14em", color: "var(--faint)", marginTop: "1.4mm" }}>
              FB&nbsp;facebook.com/PanandPartners&nbsp;&nbsp;·&nbsp;&nbsp;IG&nbsp;instagram.com/tetiana_pan.sales
            </p>
            <p className="body" style={{ fontSize: "7.6pt", marginTop: "1.6mm" }}>
              С уважением, Татьяна Пан и команда Pan&amp;Partners
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="hand" style={{ fontSize: "20pt", color: "var(--acc)", lineHeight: 1 }}>Татьяна Пан</span>
            <p className="mono" style={{ fontSize: "6.8pt", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--faint)", marginTop: "1mm" }}>
              основатель Pan&amp;Partners&nbsp;&nbsp;·&nbsp;&nbsp;2 — 2
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
