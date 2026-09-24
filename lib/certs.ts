/** Сертифікат учасника — модель даних і санітизація. */

export type CertVariant = "ornament";
export const CERT_VARIANTS: { id: CertVariant; label: string; desc: string }[] = [
  { id: "ornament", label: "Урочистий", desc: "центрована композиція, сітка з амперсандів на фоні, лінії для підписів" },
];

export type CertLang = "uk" | "en" | "ru";
export const CERT_LANGS: { id: CertLang; label: string }[] = [
  { id: "uk", label: "Українська" },
  { id: "en", label: "English" },
  { id: "ru", label: "Русский" },
];

/** Фіксовані написи сертифіката за мовою: заголовок, «засвідчує, що», «програму». */
export const CERT_T: Record<CertLang, { title: string; certifies: string; program: string; file: string; number: string }> = {
  uk: { title: "Сертифікат", certifies: "засвідчує, що", program: "програму", file: "Сертифікат", number: "№" },
  en: { title: "Certificate", certifies: "certifies that", program: "the program", file: "Certificate", number: "No." },
  ru: { title: "Сертификат", certifies: "удостоверяет, что", program: "программу", file: "Сертификат", number: "№" },
};

/** Варіанти дієслова, ролі тренерів і місця за мовою — для селектів редактора і перемикання мови. */
export const CERT_L10N: Record<CertLang, { verbs: string[]; roles: { f: string; m: string }; place: string }> = {
  uk: { verbs: ["завершив", "завершила", "пройшов", "пройшла"], roles: { f: "бізнес-тренерка", m: "бізнес-тренер" }, place: "Україна" },
  en: { verbs: ["has completed", "has successfully completed"], roles: { f: "business trainer", m: "business trainer" }, place: "Ukraine" },
  ru: { verbs: ["завершил", "завершила", "прошёл", "прошла"], roles: { f: "бизнес-тренер", m: "бизнес-тренер" }, place: "Украина" },
};

export type Cert = {
  id?: string;
  variant: CertVariant;
  lang: CertLang; // мова фіксованих написів: uk / en / ru
  number: string; // напр. 00004158
  name: string; // ПІБ учасника
  verb: string; // завершив / завершила
  program: string; // назва програми
  trainers: { name: string; role: string; fem?: boolean }[]; // fem — тренерка (для перекладу ролі між мовами)
  place: string; // Україна
  year: string; // 2026
  date: string; // необов'язково, напр. 12 вересня 2026
  hours: string; // необов'язково, напр. 16 годин
};

export const CERT_DEFAULT: Cert = {
  variant: "ornament",
  lang: "uk",
  number: "00004158",
  name: "Бабін Сергій",
  verb: "завершив",
  program: "Особиста ефективність менеджера в керуванні діяльністю\nта особистим життям",
  trainers: [{ name: "Тетяна Пан", role: "бізнес-тренерка", fem: true }, { name: "Валентин Кім", role: "бізнес-тренер", fem: false }],
  place: "Україна",
  year: String(new Date().getFullYear()),
  date: "",
  hours: "",
};

const s = (v: unknown, max = 500) => String(v ?? "").slice(0, max).trim();

export function sanitizeCert(input: any): Cert {
  const trainers = Array.isArray(input?.trainers) ? input.trainers.slice(0, 4) : [];
  return {
    id: input?.id ? s(input.id, 40) : undefined,
    variant: (CERT_VARIANTS.some((v) => v.id === input?.variant) ? input.variant : "ornament") as CertVariant,
    lang: (CERT_LANGS.some((l) => l.id === input?.lang) ? input.lang : "uk") as CertLang,
    number: s(input?.number, 20),
    name: s(input?.name, 120),
    verb: s(input?.verb, 40) || "завершив",
    program: s(input?.program, 300),
    trainers: trainers.map((t: any) => ({ name: s(t?.name, 80), role: s(t?.role, 80), ...(typeof t?.fem === "boolean" ? { fem: t.fem } : {}) })).filter((t: any) => t.name),
    place: s(input?.place, 60),
    year: s(input?.year, 10),
    date: s(input?.date, 60),
    hours: s(input?.hours, 40),
  };
}

/** Наступний номер: максимум серед збережених + 1, з нулями до 8 знаків. */
export function nextNumber(numbers: (string | null)[]): string {
  const max = numbers.reduce((m, n) => Math.max(m, parseInt((n ?? "").replace(/\D/g, "") || "0", 10)), 4157);
  return String(max + 1).padStart(8, "0");
}
