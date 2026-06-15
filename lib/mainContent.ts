/**
 * Editable content for the **Main (M)** homepage — the surface the built-in
 * CMS at /admin/content edits. Defaults below are the source of truth; the
 * admin stores only overrides in the `content` table (key "main"), and the
 * server merges them on top of these defaults at request time.
 */

export type FaqItem = { q: string; a: string };

export type MainContent = {
  hero: {
    eyebrow: string;
    titleTop: string;
    titleEm: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  company: {
    eyebrow: string;
    headTop: string;
    headEm: string;
    headTail: string;
    para1: string;
    para2: string;
    cta: string;
  };
  architect: {
    eyebrow: string;
    nameTop: string;
    nameEm: string;
    para1: string;
    para2: string;
    quote: string;
    quoteAuthor: string;
    image: string;
  };
  mentoring: {
    eyebrow: string;
    headTop: string;
    headEm: string;
    lead: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
  };
  faq: FaqItem[];
};

export type MainContentOverride = {
  hero?: Partial<MainContent["hero"]>;
  company?: Partial<MainContent["company"]>;
  architect?: Partial<MainContent["architect"]>;
  mentoring?: Partial<MainContent["mentoring"]>;
  faq?: FaqItem[];
};

export const MAIN_CONTENT_DEFAULTS: MainContent = {
  hero: {
    eyebrow: "Pan&Partners · метод продажів",
    titleTop: "Продажі — це не талант.",
    titleEm: "Це система.",
    lead: "Метод, що перетворює переговори з B2B-клієнтами на результат, який можна передбачити — і повторити.",
    ctaPrimary: "Запустити систему",
    ctaSecondary: "Як це працює",
  },
  company: {
    eyebrow: "Pan&Partners · про компанію",
    headTop: "Будуємо",
    headEm: "системи продажів",
    headTail: ", а не разові тренінги",
    para1:
      "Pan&Partners — українська консалтингова компанія з продажів та переговорів. Ми вчимо команди продавати B2B-клієнтам і впевнено домовлятися, вибудовуємо процес і залишаємося поруч до вимірюваного результату — онлайн та офлайн.",
    para2:
      "Компанію заснувала Тетяна Пан — бізнес-тренерка та експертка з продажів: 25+ років власної практики («Олімп», Danone, Coca-Cola, власні магазини) і 17+ років навчання команд. Працюємо так, як зручно вам: корпоративні тренінги, онлайн-курси, наставництво.",
    cta: "Обрати спосіб роботи",
  },
  architect: {
    eyebrow: "Архітектор методу",
    nameTop: "Тетяна",
    nameEm: "Пан",
    para1:
      "Тетяна не вивчала продажі з книжок — вона пройшла цей шлях сама: продавчинею і керівницею з продажів у «Олімпі», Danone та Coca-Cola, згодом — у власних магазинах і власній консалтинговій компанії. Понад 25 років реальних угод, команд і переговорів.",
    para2:
      "А 17 років тому вона почала вчити цього інших. Так особистий досвід став методом Pan&Partners: чітким і структурованим, без тиску й маніпуляцій — щоб результат був очікуваним, а клієнти поверталися.",
    quote:
      "«Я не вчу тиснути й маніпулювати. Я вчу продавати так, щоб клієнт повертався — природно та легко, із задоволенням від результату».",
    quoteAuthor: "— Тетяна Пан, засновниця",
    image: "/brand/Tania4.webp",
  },
  mentoring: {
    eyebrow: "Особиста робота з Тетяною",
    headTop: "Бізнес-",
    headEm: "менторинг",
    lead: "Є питання, які не вирішує тренінг для команди: ціна, стратегія переговорів з ключовими клієнтами, ваша власна впевненість. Для них є менторинг: методологія Тетяни, ваші кейси, ваш темп.",
    ctaPrimary: "Записатися на менторинг",
    ctaSecondary: "поставити запитання →",
    image: "/brand/portrait.png",
  },
  faq: [
    {
      q: "З чого почати співпрацю?",
      a: "З онлайн-консультації 1:1. Одна фокусна година — і ви знаєте вузьке місце своїх продажів, маєте план наступних кроків і конкретні скрипти.",
    },
    {
      q: "Які формати роботи можливі?",
      a: "Корпоративні тренінги під ваш запит, готові онлайн-курси та наставництво — командне чи індивідуальне, у групах до 4 осіб. Онлайн або офлайн — як зручніше вам.",
    },
    {
      q: "Це підходить лише для B2B?",
      a: "Наша головна спеціалізація — B2B-продажі та переговори з великими клієнтами. Але та сама система працює і в B2C: будуємо простий продажний процес під вашу реальність.",
    },
    {
      q: "Який результат можна очікувати?",
      a: "Зростання продажів від +20% до ×5, конверсія з 5% до 20–30%. І показник, яким пишаємося найбільше: 90% клієнтів продовжують співпрацю та рекомендують нас партнерам.",
    },
    {
      q: "Чи є досвід у нашій галузі?",
      a: "25+ років практики в 6 галузях — від FMCG (Danone, Coca-Cola, «Олімп») до телекому та енергетики (Vodafone, Kyivstar, ДТЕК). Методологію будуємо під ваш бізнес, а не за шаблоном.",
    },
    {
      q: "Без тиску — це як?",
      a: "Ми не вчимо маніпуляціям і «дотисканню». Система спирається на структуру, підготовку та переговори, після яких клієнт повертається — природно та легко.",
    },
  ],
};

export function mergeMainContent(
  over?: MainContentOverride | null,
): MainContent {
  const d = MAIN_CONTENT_DEFAULTS;
  if (!over) return d;
  const faq =
    Array.isArray(over.faq) && over.faq.length
      ? over.faq
          .filter((x) => x && (x.q || x.a))
          .map((x) => ({ q: String(x.q ?? ""), a: String(x.a ?? "") }))
      : d.faq;
  return {
    hero: { ...d.hero, ...(over.hero ?? {}) },
    company: { ...d.company, ...(over.company ?? {}) },
    architect: { ...d.architect, ...(over.architect ?? {}) },
    mentoring: { ...d.mentoring, ...(over.mentoring ?? {}) },
    faq,
  };
}
