/** Сертифікат учасника — модель даних і санітизація. */

export type CertVariant = "classic" | "band" | "minimal" | "ornament" | "dark";
export const CERT_VARIANTS: { id: CertVariant; label: string; desc: string }[] = [
  { id: "classic", label: "Класика", desc: "кремовий лист, подвійна золота рамка, великий «&» на фоні" },
  { id: "band", label: "Смуга", desc: "вертикальна золота смуга зліва, текст праворуч" },
  { id: "minimal", label: "Мінімал", desc: "багато повітря, велике імʼя курсивом, тонкі лінії" },
  { id: "ornament", label: "Урочистий", desc: "центрована композиція, широка рамка, лінії для підписів" },
  { id: "dark", label: "Темний", desc: "темний лист, кремовий текст, золоті акценти" },
];

export type Cert = {
  id?: string;
  variant: CertVariant;
  number: string; // напр. 00004158
  name: string; // ПІБ учасника
  verb: string; // завершив / завершила
  program: string; // назва програми
  trainers: { name: string; role: string }[];
  place: string; // Україна
  year: string; // 2026
  date: string; // необов'язково, напр. 12 вересня 2026
  hours: string; // необов'язково, напр. 16 годин
};

export const CERT_DEFAULT: Cert = {
  variant: "classic",
  number: "00004158",
  name: "Бабін Сергій",
  verb: "завершив",
  program: "Особиста ефективність менеджера в керуванні діяльністю та особистим життям",
  trainers: [{ name: "Тетяна Пан", role: "бізнес-тренерка" }, { name: "Валентин Кім", role: "бізнес-тренер" }],
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
    variant: (CERT_VARIANTS.some((v) => v.id === input?.variant) ? input.variant : "classic") as CertVariant,
    number: s(input?.number, 20),
    name: s(input?.name, 120),
    verb: s(input?.verb, 40) || "завершив",
    program: s(input?.program, 300),
    trainers: trainers.map((t: any) => ({ name: s(t?.name, 80), role: s(t?.role, 80) })).filter((t: any) => t.name),
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
