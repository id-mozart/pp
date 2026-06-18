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
    headEm: "систему B2B продажів",
    headTail: ", а не просто навчаємо!",
    para1:
      "Pan&Partners — міжнародна консалтингова компанія з продажів та переговорів. Ми вчимо продавати B2B-клієнтам — від першого контакту до підписання контракту, формуємо алгоритм і сценарії продажів на всіх етапах воронки (онлайн та офлайн).",
    para2:
      "Компанію заснувала Тетяна Пан — бізнес-тренерка та експертка з продажів: 25+ років власного досвіду («Олімп», Danone, Coca-Cola, власні магазини) і 17+ років навчання команд. Працюємо з фокусом на результат, у форматах: корпоративні тренінги, онлайн-курси, наставництво.",
    cta: "Обрати спосіб роботи",
  },
  architect: {
    eyebrow: "Архітектор методу",
    nameTop: "Тетяна",
    nameEm: "Пан",
    para1:
      "Тетяна не вивчала продажі з книжок — вона пройшла цей шлях сама: від менеджерки і керівниці з продажів у «Олімпі», Danone та Coca-Cola, згодом — у власній консалтинговій компанії. Понад 25 років переговорів і реальних угод, виконання планів продажів і успішних торгових команд.",
    para2:
      "А 17 років тому вона почала вчити цього інших. Так особистий досвід став методом Pan&Partners: чітким, структурованим і природним — щоб результат був очікуваним, а клієнти поверталися.",
    quote:
      "«Я не вчу тиснути й маніпулювати. Я вчу продавати так, щоб клієнт купував із задоволенням і хотів до вас повертатися!».",
    quoteAuthor: "— Тетяна Пан, засновниця",
    image: "/brand/Tania4.webp",
  },
  mentoring: {
    eyebrow: "Особиста робота з Тетяною",
    headTop: "Бізнес-",
    headEm: "менторинг",
    lead: "Є питання, які не вирішує тренінг для команди: стратегічні цілі, специфічні переговори (з ключовим клієнтом, партнером), ваші особисті цілі та сумніви, які не обговорюються назагал. Для них є менторинг — це тільки для вас і про вас: глибоко, безпечно, конфіденційно.",
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
      a: "Корпоративні тренінги під ваш запит, готові онлайн-курси та наставництво (1–4 особи). Онлайн або офлайн — як зручніше вам.",
    },
    {
      q: "Це підходить лише для B2B?",
      a: "Наша головна спеціалізація — B2B-продажі та переговори з великими клієнтами. Але в нас є досвід роботи в B2C: будуємо простий процес продажів під ваш запит.",
    },
    {
      q: "Який результат можна очікувати?",
      a: "Зростання продажів від +10% до ×5, конверсія з 5% до 20–30%. І показник, який показує довіру: 90% клієнтів продовжують співпрацю та рекомендують нас партнерам.",
    },
    {
      q: "Чи є досвід у нашій галузі?",
      a: "25+ років практики в 6 галузях — від FMCG (Danone, Coca-Cola, «Олімп») до телекому й енергетики (Vodafone, Kyivstar, ДТЕК) та АГРО (МХП, CFG). Методологію будуємо під специфіку вашого бізнесу, а не за шаблоном.",
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
