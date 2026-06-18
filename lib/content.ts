/**
 * Single source of truth for all site copy.
 * Text is taken faithfully from the original tetianapansales.com (Ukrainian, ?lang=uk),
 * cleaned of the original's stray English strings and localization bugs.
 */

export const brand = {
  company: "Pan&Partners",
  person: "Тетяна Пан",
  role: "Консалтингова компанія · системи продажів та переговорів",
  logo: "/brand/logo.webp",
  copyright: "© 2026 Tetiana Pan. Усі права захищені.",
  email: "hello@panpartners.com",
};

export const contacts = {
  whatsapp: { href: "https://wa.me/34621209334", label: "+34 621 20 93 34" },
  telegram: { href: "https://t.me/+380504481411", label: "+380 50 448 14 11" },
};

export interface NavItem {
  label: string;
  href: string;
}

export const nav: NavItem[] = [
  { label: "Головна", href: "/" },
  { label: "B2B", href: "/b2b" },
  { label: "Консультація", href: "/consultation" },
  { label: "Курси", href: "/courses" },
  { label: "Контакти", href: "/#contact" },
];

export interface Language {
  code: string;
  label: string;
  short: string;
  flag: string;
}

export const languages: Language[] = [
  { code: "uk", label: "Українська", short: "UA", flag: "/brand/flag-ua.png" },
  { code: "en", label: "English", short: "EN", flag: "/brand/flag-en.png" },
  { code: "ru", label: "Русский", short: "RU", flag: "/brand/flag-ru.png" },
  { code: "es", label: "Español", short: "ES", flag: "/brand/flag-es.png" },
  { code: "ca", label: "Català", short: "CA", flag: "/brand/flag-ca.png" },
];

/* ------------------------------------------------------------------ */
/* HOME                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: "Pan&Partners · Продажі — це система",
  title: "Навчимо вашу команду продавати та вести переговори з B2B-клієнтами",
  lead: "Продавайте впевнено й з очікуваним результатом: прості дієві інструменти, реальні кейси та детальний розбір вашої ситуації — для зростання продажів і прибутку компанії.",
  bullets: [
    "Прості та дієві інструменти",
    "Практичні кейси",
    "Детальний розбір вашої ситуації",
  ],
  formats:
    "Формати роботи онлайн та офлайн — корпоративні тренінги, онлайн-курси, наставництво (командне та індивідуальне).",
  primaryCta: { label: "Обговорити навчання команди", href: "#contact" },
  secondaryCta: { label: "Формати роботи", href: "#formats" },
  trust: "Практичні інструменти, реальні кейси, вимірюваний прогрес.",
  image: "/brand/Tania1-3.webp",
};

export const about = {
  eyebrow: "Про експерта",
  greeting: "Привіт",
  name: "Тетяна Пан",
  intro:
    "Власниця компанії Pan&Partners, бізнес-тренерка, експертка з продажів та переговорів.",
  credentials: [
    "25+ років власного досвіду в продажах та керівником з продажів — «Олімп» (горілчана компанія), Danone, Coca-Cola, власні магазини та власна консалтингова компанія.",
    "17+ років навчаємо продавати та вести переговори.",
  ],
  helpIntro:
    "Допомагаємо власникам бізнесів та командам з продажів продавати й вести переговори:",
  helpPoints: ["чітко та структуровано", "впевнено", "з очікуваним результатом"],
  manner: "Без тиску. Без маніпуляцій. Природно та легко.",
  mission:
    "Наша місія — допомогти вам відчувати задоволення від отриманого результату.",
  image: "/brand/Tania4.webp",
  portrait: "/brand/tania-portrait.jpg",
};

export const requests = {
  eyebrow: "З чим приходять",
  title: "Пʼять запитів, з якими до нас звертаються найчастіше",
  intro:
    "Впізнали щось своє? Натисніть на свій пункт — і поговоримо, як ми розвʼязуємо це разом.",
  items: [
    "Низькі продажі або падіння продажів",
    "Нестабільні продажі",
    "80–90% відмов від B2B-клієнтів",
    "Клієнти відмовляють або вимагають знижки",
    "Команда не дає стабільного результату",
  ],
};

export const system = {
  eyebrow: "Наш підхід · Система продажів",
  title: "Продажі — це система, а не везіння",
  intro:
    "Ми не вчимо «прийомам». Ми будуємо систему продажів, що дає передбачуваний, повторюваний результат — крок за кроком, під ваш бізнес.",
  phases: [
    { n: "01", t: "Діагностика", d: "Знаходимо, що саме блокує продажі: меседж, офер, переговори чи процес." },
    { n: "02", t: "Структура", d: "Будуємо процес, скрипти та методологію продажів під ваш бізнес — не шаблон." },
    { n: "03", t: "Переговори", d: "Тренуємо команду на реальних кейсах — чітко, впевнено, без тиску й маніпуляцій." },
    { n: "04", t: "Впровадження", d: "Супровід до результату: воронка стає прозорою, продажі — керованими." },
  ],
  portrait: "/brand/Tania2.jpg",
  gainsTitle: "Що ви отримаєте",
};

export interface FormatCard {
  number: string;
  title: string;
  summary: string;
  who: string;
  result: string;
  how: string;
  href: string;
  cta: string;
}

export const formats = {
  eyebrow: "Pan&Partners · формати роботи",
  title: "Оберіть спосіб роботи, який відповідає вашій цілі та темпу",
  subtitle: "Один метод — три глибини занурення.",
  cards: [
    {
      number: "01",
      title: "Корпоративні тренінги",
      summary: "Тренінг під ваш запит — не з полиці, а на ваших реальних кейсах і цілях.",
      who: "Керівники та команди продажів",
      result: "Зростання продажів від +20% до ×5, конверсія до ×2",
      how: "Створення методології та формування навичок, які дають результат",
      href: "/b2b",
      cta: "Дізнатися більше",
    },
    {
      number: "02",
      title: "Онлайн-курси",
      summary: "Готові онлайн-курси з продажів — застосовуєте на практиці вже сьогодні.",
      who: "Власники, менеджери, керівники",
      result: "Зростання конверсії з 5% до 20–30%",
      how: "Відео, матеріали та домашні завдання для швидкого впровадження",
      href: "/courses",
      cta: "Дізнатися більше",
    },
    {
      number: "03",
      title: "Менторинг та коучинг",
      summary: "Індивідуально або в групах до 4 осіб — навчання та розбір ваших кейсів.",
      who: "Власники та керівники",
      result: "Зростання продажів від +20% до ×2",
      how: "Методологія продажів, розбір бізнес-кейсів, підтримка між зустрічами",
      href: "/consultation",
      cta: "Почати з консультації",
    },
  ] as FormatCard[],
};

export interface Stat {
  value: string;
  label: string;
}

export const clients = {
  eyebrow: "Нам довіряють · Україна та світ",
  title: "Наші клієнти",
  subtitle: "Бренди, які ви знаєте, — і результати, які можна виміряти.",
  retention:
    "90% клієнтів продовжують співпрацю з нами та рекомендують нас своїм партнерам.",
  named: [
    "Vodafone",
    "Kyivstar",
    "ДТЕК",
    "Danone",
    "Coca-Cola",
    "Олімп",
    "Energum",
    "ІДС Аква Сервіс",
  ],
  logos: [
    "/brand/customers_car_1.png",
    "/brand/customers_car_2.png",
    "/brand/customers_car_3.png",
    "/brand/customers_car_4.png",
    "/brand/customers_car_5.png",
  ],
  // Реальні клієнти Pan&Partners — логотипи витягнуто з фірмового профайлу
  // (монохромна стіна логотипів, сторінка 2). Файли: /public/brand/clients.
  logoTiles: [
    { name: "Coca-Cola", src: "/brand/clients/coca-cola.png" },
    { name: "Vodafone", src: "/brand/clients/vodafone.png" },
    { name: "Puratos", src: "/brand/clients/puratos.png" },
    { name: "ДТЕК", src: "/brand/clients/dtek.png" },
    { name: "PrivatBank", src: "/brand/clients/privatbank.png" },
    { name: "Ашан", src: "/brand/clients/auchan.png" },
    { name: "DoMyTax", src: "/brand/clients/domytax.png" },
    { name: "RedHead", src: "/brand/clients/redhead.png" },
    { name: "Takeda", src: "/brand/clients/takeda.png" },
    { name: "Kernel", src: "/brand/clients/kernel.png" },
    { name: "Yasno", src: "/brand/clients/yasno.png" },
    { name: "Pfizer", src: "/brand/clients/pfizer.png" },
    { name: "IDS Ukraine", src: "/brand/clients/ids-ukraine.png" },
    { name: "Synevo", src: "/brand/clients/synevo.png" },
    { name: "KLO", src: "/brand/clients/klo.png" },
    { name: "Київстар", src: "/brand/clients/kyivstar.png" },
    { name: "Добробут", src: "/brand/clients/dobrobut.png" },
    { name: "Campari", src: "/brand/clients/campari.png" },
    { name: "Suziria", src: "/brand/clients/suziria.png" },
    { name: "Сільпо", src: "/brand/clients/silpo.png" },
    { name: "SCM", src: "/brand/clients/scm.png" },
    { name: "Continental", src: "/brand/clients/continental.png" },
    { name: "OTP Bank", src: "/brand/clients/otp-bank.png" },
    { name: "Щедро", src: "/brand/clients/schedro.png" },
    { name: "Дія", src: "/brand/clients/diia.png" },
  ],
  stats: [
    { value: "25+", label: "років реального досвіду продажів" },
    { value: "17+", label: "років навчання B2B та B2C" },
    { value: "90%", label: "клієнтів продовжують співпрацю" },
  ] as Stat[],
  caption:
    "Працюємо з лідерами своїх галузей — від FMCG і телекому до енергетики та B2B-послуг.",
};

export const cases = {
  eyebrow: "Відгуки та кейси",
  title: "Відгуки клієнтів і кейси",
  body: "Наші клієнти — експерти та бізнеси, які після спільної роботи продають упевнено, досягають цілей у переговорах і отримують стабільні результати.",
  pullquote: "Без тиску. Без маніпуляцій. Природно та легко.",
  cta: { label: "Подивитися кейси", href: "#contact" },
};

export const credibility = {
  marks: [
    { value: "15 000+", label: "учнів застосовують технологію продажів" },
    { value: "№2", label: "у ТОП тренерів України — UBA 2023" },
    { value: "90%", label: "клієнтів продовжують співпрацю" },
  ] as Stat[],
};

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  date?: string;
  videoId?: string;
}

export const testimonials = {
  eyebrow: "Відгуки та кейси",
  title: "Що кажуть клієнти після спільної роботи",
  intro:
    "Власники, керівники та команди продажів — своїми словами: про результати, переговори та впевненість, яка залишається надовго.",
  videoLabel: "Дивитися відеовідгук",
  items: [
    {
      name: "Юлія Литвиненко",
      role: "Керівниця мережі (Vodafone, 8 років) · бізнес-тренерка, коуч",
      quote:
        "Вже понад рік я працюю у партнерстві з Тетяною Пан і вважаю це великою удачею.",
    },
    {
      name: "Юлія Дзюба",
      role: "Директорка компанії «ІДС Аква Сервіс»",
      quote:
        "Щиро дякую за навчання команди перемовників нашої компанії — результат відчутний.",
      date: "Січень 2025",
    },
    {
      name: "Чуніхіна Ірина",
      role: "Директорка з продажів",
      quote:
        "З перших зустрічей було досягнуто професійного взаєморозуміння та чіткого плану дій.",
      date: "Вересень 2025",
    },
    {
      name: "Сергій Лотохов",
      role: "Комерційний директор ТОВ «ЕНЕРГУМ»",
      quote:
        "Висловлюю подяку за проведення курсу тренінгів з продажів для нашої команди.",
      date: "Липень 2025",
    },
    {
      name: "Олександр Мігіцко",
      role: "Персональний фітнес-тренер",
      quote:
        "Звернувся до Тетяни з питанням ціноутворення — і отримав чіткі, робочі рішення.",
      date: "Жовтень 2025",
    },
  ] as Testimonial[],
  videos: [
    {
      name: "Альона Коврига",
      role: "Співвласниця сімейного бізнесу",
      quote: "Відеовідгук про спільну роботу та результати у продажах.",
      videoId: "2clA1fQaWjo",
    },
    {
      name: "Катерина Єрмолова",
      role: "Project Manager · сейлз-менеджерка",
      quote: "Відеовідгук про навчання продажів і переговорів.",
      videoId: "DEpjsnZPy4s",
    },
  ] as Testimonial[],
};

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
}

export const contact = {
  eyebrow: "Контакти",
  title: "Поговорімо про ваші продажі",
  body: "Напишіть, що зараз із вашими продажами, — і Тетяна особисто підкаже, з чого почати.",
  fields: [
    { name: "name", label: "Ім'я", type: "text", placeholder: "Олена Коваленко", required: true },
    { name: "contact", label: "Email або телефон / месенджер", type: "text", placeholder: "mail@example.com · +380 … · @telegram", required: true },
    { name: "message", label: "", type: "textarea", placeholder: "Коротко опишіть вашу ситуацію та ціль" },
  ] as FormField[],
  submit: "Надіслати заявку",
  success: "Дякуємо! Заявку отримано — ми звʼяжемося з вами найближчим часом.",
};

export const footer = {
  tagline:
    "Навчаємо команди продавати та вести переговори з B2B-клієнтами — чітко, впевнено, з вимірюваним результатом.",
  copyright: "© 2026 Tetiana Pan. Усі права захищені.",
  columns: [
    {
      title: "Навігація",
      links: [
        { label: "Головна", href: "/" },
        { label: "B2B", href: "/b2b" },
        { label: "Консультація", href: "/consultation" },
        { label: "Курси", href: "/courses" },
      ],
    },
    {
      title: "Компанія",
      links: [
        { label: "Контакти", href: "/#contact" },
        { label: "Політика конфіденційності", href: "/privacy" },
      ],
    },
  ],
};

export const cookie = {
  title: "Ми використовуємо файли cookie",
  body: "Ми використовуємо cookie, щоб покращити ваш досвід та аналізувати трафік. Натискаючи «Прийняти всі», ви погоджуєтеся на використання файлів cookie.",
  accept: "Прийняти всі",
  decline: "Відхилити",
};

/* ------------------------------------------------------------------ */
/* B2B                                                                 */
/* ------------------------------------------------------------------ */

export const b2b = {
  hero: {
    eyebrow: "Pan&Partners · B2B",
    title: "B2B продажі та переговори",
    lead: "Структура продажів, переговори та вихід на великих клієнтів — адаптовано під цілі вашого бізнесу, а не стандартний тренінг.",
    cta: { label: "Обговорити навчання команди", href: "#contact" },
  },
  experience: {
    eyebrow: "Мій досвід у B2B",
    title: "Досвід, що відкриває двері у великі компанії",
    items: [
      "25+ років у продажах та роботі з B2B-клієнтами.",
      "Робота з корпоративними клієнтами — Vodafone, Kyivstar, ДТЕК — та з малим і середнім бізнесом з оборотом €500–700K+ на місяць.",
      "Досвід переведення компаній з B2C у B2B та укладання великих угод із довгим циклом продажу.",
    ],
  },
  solutions: {
    eyebrow: "Наші рішення",
    title: "Чотири напрями, що дають результат",
    cards: [
      {
        number: "01",
        title: "Система продажів",
        points: [
          "Структурування продажів для отримання чітких, прогнозованих результатів",
          "Робота з керівником відділу продажів та навчання команди на реальних кейсах компанії",
          "Супровід під час впровадження та досягнення результатів",
        ],
      },
      {
        number: "02",
        title: "Переговори для закупівель",
        points: [
          "Чіткі схеми переговорів та сильна підготовка позицій",
          "Робота з тиском, аргументами та пропозиціями постачальників",
          "Практика на основі реальних кейсів та складних ситуацій",
        ],
      },
      {
        number: "03",
        title: "Переговори для постачальників (KAM)",
        points: [
          "Побудова сильної позиції у переговорах із клієнтами",
          "Захист ціни та комерційних умов",
          "Симуляція переговорів та практика кейсів",
        ],
      },
      {
        number: "04",
        title: "Вихід у B2B",
        points: [
          "Як знайти нових B2B-клієнтів",
          "Як підходити та працювати з великими компаніями",
          "Як побудувати структуровану систему продажів B2B",
        ],
      },
    ],
  },
  approach: {
    eyebrow: "Мій підхід",
    title: "Три принципи, на яких тримається робота",
    pillars: [
      { label: "Target", body: "Робота адаптована до бізнес-цілей компанії, а не стандартний тренінг." },
      { label: "Practice", body: "Практика на основі реальних бізнес-ситуацій." },
      { label: "Results", body: "Фокус на впровадженні та реальних результатах." },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* CONSULTATION                                                        */
/* ------------------------------------------------------------------ */

export const consultation = {
  hero: {
    pill: "Онлайн 1:1 консультація з продажів",
    title: "Чіткий план для ваших продажів — за одну фокусну годину",
    lead: "Для підприємців, експертів і компаній, які хочуть впевненіших комунікацій, кращої конверсії та структури продажів, що реально працює.",
    primaryCta: { label: "Забронювати персональну консультацію", href: "#book" },
    secondaryCta: { label: "Подивитися, з чим працюємо", href: "#what" },
    finePrint: "Тільки онлайн · 60 хвилин · бронювання слотами по 1 годині",
    cards: [
      {
        title: "Діагностика реального вузького місця",
        body: "Знаходимо, що саме блокує продажі зараз: меседж, офер, переговори чи процес.",
      },
      { title: "План наступних кроків", body: "Ви виходите з простим планом, який можна виконувати одразу." },
      { title: "Конкретні скрипти", body: "Фрази, структура і відповіді під ваші реальні кейси (без «води»)." },
    ],
  },
  what: {
    eyebrow: "З чим працюємо",
    title: "Підбираємо фокус під вашу роль",
    audiences: [
      {
        kicker: "Для",
        title: "Індивідуально — експерти, фриланс, ФОП",
        body: "Ціна, впевненість, заперечення, комунікація з клієнтами, конверсія з чатів у оплату, переговори без стресу.",
      },
      {
        kicker: "Для",
        title: "Компанії — 1:1 для власника або керівника продажів",
        body: "Структура продажів, прозорість воронки, стратегія переговорів з ключовими клієнтами, конверсія, практичні кроки для команди.",
      },
    ],
    youWillGet: [
      { title: "Ясність", body: "Що робити в першу чергу (і що перестати робити).", image: "/brand/youwill1.webp" },
      { title: "Структуру", body: "Простий продажний процес під вашу реальність (B2B або B2C).", image: "/brand/youwill2.webp" },
      { title: "Інструменти", body: "Конкретні дії та скрипти, які можна застосувати в той самий день.", image: "/brand/youwill3.webp" },
    ],
    howItWorks: {
      title: "Як це працює",
      body: "Ви обираєте вільний слот на 60 хвилин, коротко пишете запит, і ми працюємо онлайн наживо. Після дзвінка у вас будуть чіткі наступні дії.",
      cta: { label: "Забронювати персональну консультацію", href: "#book" },
    },
  },
  booking: {
    title: "Бронювання консультації",
    intro: "Оберіть день, потім час.",
    monthLabel: "",
    weekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
    timezone: "Час показано за вашим часовим поясом.",
    slotsHeading: "Доступний час",
    chooseDay: "Оберіть день",
    slotsPlaceholder: "Натисніть на день у календарі, щоб побачити доступні слоти по 1 годині.",
    noSlots: "На цей день немає вільних слотів.",
    pickSlotFirst: "Спочатку оберіть слот часу.",
    formLabel: "Ваші дані",
    fields: [
      { name: "full_name", label: "Ім'я", type: "text", placeholder: "Олена Коваленко", required: true },
      { name: "contact", label: "Email або телефон / месенджер", type: "text", placeholder: "mail@example.com · +380 … · @telegram", required: true },
      { name: "message", label: "", type: "textarea", placeholder: "Коротко опишіть вашу ситуацію та ціль" },
    ] as FormField[],
    submit: "Підтвердити запит на бронювання",
    note: "Після запиту ми підтверджуємо час особисто — у відповідь на email або в месенджері.",
    success: "Запит отримано! Тетяна звʼяжеться з вами протягом робочого дня, щоб підтвердити час.",
  },
};

/* ------------------------------------------------------------------ */
/* COURSES                                                             */
/* ------------------------------------------------------------------ */

export interface CourseCard {
  title: string;
  short: string;
  price: string;
  image: string;
  href: string;
  cta: string;
}

export const courses = {
  hero: {
    eyebrow: "Готові рішення",
    title: "Готові рішення для ваших продажів",
    items: [
      { n: "01", title: "Продажі та переговори", sub: "Онлайн-курси" },
      { n: "02", title: "Чек-листи для продажів", sub: "Готові до впровадження" },
      { n: "03", title: "Скрипти повідомлень", sub: "Для нових клієнтів" },
    ],
    lead: "Тут ви знайдете готові рішення, щоб швидко посилити свої продажі та чітко зрозуміти, що потребує покращення у вашій системі продажів.",
    features: [
      {
        title: "Швидкі результати",
        points: ["Купуйте та впроваджуйте одразу", "Без складних процесів та довгого налаштування"],
      },
      {
        title: "Доступність",
        points: ["Зрозумілі, прості у використанні інструменти", "Економічно вигідні рішення"],
      },
    ],
  },
  list: {
    title: "Поточні курси",
    subtitle: "Обирайте програму, яка відповідає вашим цілям та рівню.",
    cards: [
      {
        title: "Продажі та переговори — базовий курс",
        short: "Стартовий онлайн-курс: прості інструменти продажів і переговорів, які можна застосувати вже сьогодні.",
        price: "120 €",
        image: "/brand/course1.png",
        href: "https://tetianapan.weblium.site/?utm_source=panpartners&utm_medium=site&utm_campaign=course_basic",
        cta: "Приєднатися",
      },
    ] as CourseCard[],
  },
};
