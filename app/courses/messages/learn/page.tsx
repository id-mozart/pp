import type { Metadata } from "next";
import Link from "next/link";
import { CourseBlock } from "@/components/course/CourseBlocks";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import { DAYS } from "@/lib/courses/messages";

export const metadata: Metadata = {
  title: "Курс — Повідомлення, на які відповідають",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/**
 * Закритий розділ курсу: усі дні на одній сторінці з навігацією по якорях.
 * Доступ перевіряє middleware (cookie pp_course); тут лише контент.
 */
export default function CourseLearnPage() {
  return (
    <>
      <section className="relative grain overflow-hidden border-b border-line/50">
        <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(56vw 56vw at 84% -8%, rgb(226 166 56 / 0.13), transparent 60%)" }} />
        <div className="container-shell relative flex flex-col gap-5 pb-12 pt-28 lg:pb-16 lg:pt-36">
          <span className="eyebrow">Онлайн-курс · 5 днів</span>
          <h1 className="max-w-3xl font-display text-[clamp(2rem,4.2vw,3.3rem)] leading-[1.06] text-ink">
            Як писати повідомлення, щоб відповідали{" "}
            <em className="italic" style={gradText(GRAD_ACC)}>7 з 10</em> клієнтів
          </h1>
          <p className="max-w-xl text-muted">
            Натискай на день нижче, щоб перейти до уроку. Матеріали доступні 3 місяці — повертайся й переглядай знову.
          </p>
          <nav className="mt-2 flex flex-wrap gap-2" aria-label="Дні курсу">
            {DAYS.map((d) => (
              <a key={d.slug} href={`#${d.slug}`} className="rounded-full border border-line/70 px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink transition-colors hover:border-gold/60 hover:text-gold">
                {d.n}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {DAYS.map((d, i) => (
        <section key={d.slug} id={d.slug} className="relative grain scroll-mt-24 border-b border-line/50 section-pad">
          <div className="container-shell grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em]" style={gradText(GRAD_ACC)}>{d.n}</div>
                <h2 className="mt-3 font-display text-[clamp(1.6rem,2.8vw,2.2rem)] leading-tight text-ink">{d.title}</h2>
                <span aria-hidden className="mt-5 block h-[2px] w-16 rounded-full" style={{ background: GRAD_GOLD }} />
                {d.intro && <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{d.intro}</p>}
                {i < DAYS.length - 1 && (
                  <a href={`#${DAYS[i + 1].slug}`} className="mt-6 inline-block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint transition-colors hover:text-gold">
                    Далі: {DAYS[i + 1].n} ↓
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-8">
              {d.blocks.map((b, k) => <CourseBlock key={k} b={b} />)}
            </div>
          </div>
        </section>
      ))}

      <section className="relative grain section-pad">
        <div className="container-shell">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-[18px] border border-line/70 p-9 text-center" style={{ background: CARD_BG }}>
            <p className="font-display text-xl italic text-ink">Щедрих та драйвових клієнтів тобі! 🧡</p>
            <p className="text-sm text-faint">Питання по курсу — в Instagram @tetiana_pan.sales</p>
            <Link href="/courses/messages" className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint hover:text-gold">← На сторінку курсу</Link>
          </div>
        </div>
      </section>
    </>
  );
}
