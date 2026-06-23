import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ArrowRight, Check } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import { localizedAlternates } from "@/lib/i18n/metadata";
import { getLocale } from "@/lib/i18n/server";

/* Лендинг курсу «Повідомлення, на які відповідають» — контент із
   tetianapan.weblium.site, оформлено в стилі сайту. Купівля — на платіжній
   сторінці курсу (CHECKOUT_URL). */

const CHECKOUT_URL =
  "https://tetianapan.weblium.site/?utm_source=panpartners&utm_medium=site&utm_campaign=course_messages";
const PRICE = "1100 грн";

const HERO_BULLETS = [
  "5 відео-уроків (~15 хв щодня)",
  "Q&A-сесія з розбором ваших кейсів",
  "Готові сценарії переписок",
  "Гарантія повернення коштів — 14 днів",
];

const INCLUDES = [
  {
    n: "01",
    t: "Відеоуроки щодня (~15 хвилин)",
    d: "Прості, живі й конкретні інструменти, які можна застосувати одразу після перегляду. Без складних термінів — тільки те, що дійсно працює.",
  },
  {
    n: "02",
    t: "Лайфхаки та підказки",
    d: "Покажу, як писати так, щоб людині хотілося відповісти. Навчишся зацікавлювати клієнта з перших слів — легко, без напруги.",
  },
  {
    n: "03",
    t: "Онлайн-зустріч зі мною",
    d: "Живе спілкування, відповіді на твої питання, підтримка й можливість поділитись результатами. Разом розберемо, що спрацювало найкраще саме в тебе.",
  },
  {
    n: "04",
    t: "Доступ до курсу на 3 місяці",
    d: "Можеш проходити у зручному темпі, повертатись і переглядати знову. А якщо захочеш — продовжиш доступ і далі тренуватимеш навички.",
  },
  {
    n: "05",
    t: "Бонус: готові шаблони + чек-лист",
    d: "Готові шаблони повідомлень і короткий щоденний чек-лист. Не вигадуй з нуля — бери, використовуй і бач результат уже цього тижня.",
  },
];

const BENEFITS = [
  ["Реальні відповіді", "Реальні відповіді від клієнтів — уже під час навчання."],
  ["Готові тексти", "Тексти перших повідомлень, які відкривають, читають і на які відповідають."],
  ["Уміння писати легко", "Природньо, без страху «щоб не послали» і без нав’язливості."],
  ["Впевненість у продажах", "Розуміння, що робити щодня, щоб мати стабільний потік клієнтів."],
  ["Задоволення від процесу", "Замість напруги — цікавість, діалог і результат."],
  ["Фінальна Q&A з Тетяною", "Розбір саме ваших діалогів (звичайна вартість — 300$, тут включено)."],
];

const MODULES = [
  {
    n: "Модуль 1",
    t: "Психологія клієнта: чому люди мовчать",
    points: [
      "Що відбувається в голові твоїх «мовчунів».",
      "Три причини відмов і як перетворити «не зараз» на «розкажіть детальніше».",
    ],
  },
  {
    n: "Модуль 2",
    t: "Перше повідомлення, яке хочеться відкрити",
    points: [
      "Формула з 4 кроків — писати без страху і без шаблонів.",
      "Людина читає й думає: «О, це про мене, мені цікаво!»",
    ],
  },
  {
    n: "Модуль 3",
    t: "Клієнт відповів — як перейти на наступний крок",
    points: [
      "Що писати далі, щоб не «злити» розмову.",
      "Як м’яко вести до дзвінка чи продажу — без тиску й «агресивного сейлу».",
    ],
  },
  {
    n: "Модуль 4",
    t: "Власні сценарії для різних ніш",
    points: [
      "Як підлаштувати тексти під твою сферу — від салону краси до B2B.",
      "Готові сценарії + приклади для використання «тут і зараз».",
    ],
  },
  {
    n: "Модуль 5",
    t: "Що робити з тими, хто не відповідає",
    points: [
      "Структура «нагадувань», після яких люди повертаються в діалог.",
      "Як писати так, щоб не виглядати настирливо, але отримувати відповіді.",
    ],
  },
];

const FAQ = [
  ["Чи можна цей курс для клієнтів B2B?", "Так. Маю понад 20 років досвіду у B2B-продажах і розумію, як мислить замовник. Покажу, що для нього справді цінно, щоб він захотів спілкуватись, а не «загубився після першого листа»."],
  ["А підходить, якщо я в B2C — салони, клініки, послуги?", "Так. Усі інструменти адаптовані під живе спілкування з кінцевим клієнтом: коротко, природньо, щоб людині хотілося відповісти."],
  ["Корисно, якщо я вже маю досвід (5+ років)?", "Так. Курс освіжає комунікацію й повертає результат. Багато досвідчених продавців кажуть: «Я ніби знову зловив драйв від продажів»."],
  ["А якщо я новачок?", "Підійде ідеально. Усе подано просто — короткі відео, зрозумілі приклади. Застосуєш інструменти вже з першого дня."],
  ["Як довго доступ до матеріалів?", "Три місяці, щоб переглядати, повертатись і закріплювати навички. За бажанням — можна продовжити."],
  ["А якщо ніша специфічна (медицина, освіта, виробництво)?", "Так. Завдяки досвіду в різних сферах допоможу адаптувати сценарії саме під твою нішу."],
  ["Чи допоможе «розговорити мовчунів»?", "Так, це одна з головних цілей курсу. Зрозумієш, чому клієнти мовчать, і навчишся писати так, щоб вони самі хотіли відповісти."],
  ["Чи буде зворотний зв’язок?", "Так. Після курсу — онлайн-зустріч, де відповім на запитання, підкажу, як покращити повідомлення, і поділюсь додатковими лайфхаками."],
  ["Реально отримати клієнтів за 5 днів?", "Так, якщо діяти. Інструменти прості, перші відповіді можна отримати вже на 2–3 день."],
  ["А якщо я не отримаю результат?", "Я впевнена в курсі. Якщо після проходження не побачите змін — поверну гроші. Чесно, такого ще не було."],
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  return {
    title: "Курс «Повідомлення, на які відповідають» — Тетяна Пан",
    description:
      "5-денний практичний мінікурс: як писати повідомлення, на які відповідають 7 з 10 клієнтів. Відеоуроки, готові сценарії, Q&A-сесія з Тетяною Пан.",
    alternates: localizedAlternates(locale, "/courses/messages"),
  };
}

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-primary ${className}`}
    >
      Хочу курс <ArrowRight className="h-4 w-4" />
    </a>
  );
}

export default function CourseMessagesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative grain overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(56vw 56vw at 84% -8%, rgb(226 166 56 / 0.13), transparent 60%), radial-gradient(44vw 44vw at -8% 110%, rgb(214 106 44 / 0.10), transparent 60%)",
          }}
        />
        <div className="container-shell relative grid items-center gap-12 pb-16 pt-32 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-40">
          <Reveal className="flex flex-col gap-6 lg:col-span-7">
            <span className="eyebrow">Онлайн-курс · 5 днів · мінікурс</span>
            <h1 className="font-display text-[clamp(2.2rem,4.6vw,3.7rem)] leading-[1.06] text-ink">
              Як писати повідомлення, на які відповідають{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                7 з 10
              </em>{" "}
              клієнтів
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted">
              Практичний мінікурс від Тетяни Пан — експертки з продажів. Прості
              інструменти, готові сценарії та жива Q&amp;A-сесія. Перші відповіді
              від клієнтів можна отримати вже на 2–3 день.
            </p>
            <ul className="flex flex-col gap-2.5">
              {HERO_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-ink/90">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-gold" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-3">
              <CtaButton />
              <a href="#program" className="btn btn-ghost">
                Дізнатися більше
              </a>
              <span className="font-display text-2xl italic" style={gradText(GRAD_GOLD)}>
                {PRICE}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div
              className="relative rounded-[16px] border border-line/60 p-7 sm:p-9"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <span
                aria-hidden
                className="absolute left-8 top-0 h-[3px] w-20 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <p className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.22em] text-faint">
                Втрачаєш клієнтів, які не відповідають?
              </p>
              <p className="mt-4 font-display text-2xl italic leading-snug text-ink">
                Без структури немає відповідей. Без відповідей{" "}
                <em className="not-italic" style={gradText(GRAD_ACC)}>
                  немає продажів
                </em>
                .
              </p>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-muted">
                Неважливо, що ти продаєш — важливо, за якою структурою ти ведеш
                клієнта до рішення. Я покажу, як писати так, щоб люди самі хотіли
                відповісти.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* З ЧОГО СКЛАДАЄТЬСЯ */}
      <section className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="mb-12 flex flex-col gap-3">
            <span className="eyebrow">З чого складається курс</span>
            <h2 className="max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.08] text-ink">
              Усе, щоб почати отримувати{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                відповіді
              </em>
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {INCLUDES.map((it) => (
              <RevealItem key={it.n}>
                <div
                  className="relative h-full rounded-[14px] border border-line/70 p-6"
                  style={{ background: CARD_BG }}
                >
                  <span
                    aria-hidden
                    className="absolute left-6 top-0 h-[3px] w-12 -translate-y-1/2 rounded-full"
                    style={{ background: GRAD_GOLD }}
                  />
                  <div className="font-mono text-sm font-semibold tracking-[0.18em]" style={gradText(GRAD_ACC)}>
                    {it.n}
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-tight text-ink">{it.t}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{it.d}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ЩО ОТРИМУЄШ */}
      <section className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="mb-12 flex flex-col gap-3">
            <span className="eyebrow">Що ти отримуєш</span>
            <h2 className="max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.08] text-ink">
              Результат, який видно{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                вже цього тижня
              </em>
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(([t, d]) => (
              <RevealItem key={t}>
                <div className="flex h-full gap-3 rounded-[14px] border border-line/60 p-5">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h3 className="font-display text-lg leading-tight text-ink">{t}</h3>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{d}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ПРОГРАМА */}
      <section id="program" className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="mb-12 flex flex-col gap-3">
            <span className="eyebrow">Програма курсу</span>
            <h2 className="max-w-2xl font-display text-[clamp(1.8rem,3.4vw,2.7rem)] leading-[1.08] text-ink">
              П’ять модулів — від{" "}
              <em className="italic" style={gradText(GRAD_ACC)}>
                «чому мовчать»
              </em>{" "}
              до стабільних відповідей
            </h2>
          </Reveal>
          <RevealGroup className="flex flex-col gap-4">
            {MODULES.map((m) => (
              <RevealItem key={m.n}>
                <div
                  className="relative grid gap-4 rounded-[14px] border border-line/70 p-6 sm:grid-cols-[10rem_1fr] sm:p-7"
                  style={{ background: CARD_BG }}
                >
                  <div>
                    <div className="font-mono text-xs font-semibold uppercase tracking-[0.18em]" style={gradText(GRAD_ACC)}>
                      {m.n}
                    </div>
                    <h3 className="mt-2 font-display text-xl leading-tight text-ink">{m.t}</h3>
                  </div>
                  <ul className="flex flex-col gap-2 self-center">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[0.96rem] leading-relaxed text-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: GRAD_GOLD }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* АВТОР */}
      <section className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/portrait.png"
                alt="Тетяна Пан — авторка курсу"
                className="mx-auto block w-[70%] max-w-[300px]"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-7">
            <span className="eyebrow">Авторка курсу</span>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight text-ink">
              Тетяна <em className="italic" style={gradText(GRAD_ACC)}>Пан</em>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
              Експертка з продажів і переговорів. 25+ років у продажах і 17+ років
              навчаю команди та підприємців продавати впевнено й природньо.
            </p>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">
              У мене вчились Coca-Cola, ДТЕК, Київстар, ПриватБанк, Моршинська,
              Synevo та 500+ підприємців. Понад 15 000 учнів застосовують мою
              технологію продажів і збільшують продажі у 2–5 разів. У 2023 —
              №2 серед ТОП-тренерів з продажів України (UBA).
            </p>
          </Reveal>
        </div>
      </section>

      {/* ЦІНА / CTA */}
      <section className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal>
            <div
              className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[18px] border border-line/70 p-9 text-center sm:p-12"
              style={{ background: CARD_BG, boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <span
                aria-hidden
                className="absolute left-10 top-0 h-[3px] w-24 -translate-y-1/2 rounded-full"
                style={{ background: GRAD_GOLD }}
              />
              <span className="eyebrow">Чому така ціна</span>
              <p className="max-w-2xl font-display text-2xl italic leading-snug text-ink">
                Хочу, щоб ти почав(-ла) заробляти вже зараз. Це{" "}
                <em className="not-italic" style={gradText(GRAD_ACC)}>
                  повноцінний курс
                </em>
                , який поверне вкладене новими клієнтами.
              </p>
              <div className="font-display text-5xl" style={gradText(GRAD_GOLD)}>
                {PRICE}
              </div>
              <CtaButton className="!px-8 !py-3.5 text-base" />
              <p className="text-sm text-faint">
                Гарантія повернення коштів — 14 днів, якщо курс вам не підійде.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative grain border-t border-line/50 section-pad">
        <div className="container-shell">
          <Reveal className="mb-10 flex flex-col gap-3">
            <span className="eyebrow">Питання · відповіді</span>
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.7rem)] leading-tight text-ink">
              Часті <em className="italic" style={gradText(GRAD_ACC)}>питання</em>
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl divide-y divide-line/50">
            {FAQ.map(([q, a], i) => (
              <details key={i} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="font-display text-lg text-ink">{q}</span>
                  <span className="mt-1 shrink-0 font-mono text-gold transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>

          <Reveal className="mt-14 text-center">
            <h3 className="font-display text-2xl italic text-ink">
              Хочеш, щоб клієнти{" "}
              <em className="not-italic" style={gradText(GRAD_ACC)}>
                відповідали
              </em>
              ?
            </h3>
            <p className="mt-2 text-muted">5 днів — і ти побачиш результат.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <CtaButton className="!px-8 !py-3.5 text-base" />
              <Link href="/#contact" className="btn btn-ghost">
                Поставити запитання
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
