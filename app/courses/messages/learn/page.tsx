import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CourseBlock, type CourseCtx } from "@/components/course/CourseBlocks";
import { Lock } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import { DAYS, type Day } from "@/lib/courses/messages";
import { PASS_MIN, QUIZ_MAX, QUIZ_SET } from "@/lib/courses/quizzes";
import { PROGRESS_COOKIE, STUDENT_COOKIE, parseProgress, parseStudent } from "@/lib/courseProgress";
import { COURSE_COOKIE, courseSession } from "@/lib/courseAuth";
import { getCourseUser, touchCourseUser, userQuizProgress } from "@/lib/db";

export const metadata: Metadata = {
  title: "Курс — Повідомлення, на які відповідають",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** Який тест треба скласти, щоб відкрити розділ: день k — тест k−1, фінал — тест 5; старт і день 1 відкриті. */
function requiredQuiz(d: Day): number | null {
  const m = /^day-(\d+)$/.exec(d.slug);
  if (m) return Number(m[1]) > 1 ? Number(m[1]) - 1 : null;
  if (d.slug === "qa") return QUIZ_SET.length;
  return null;
}

/**
 * Закритий розділ курсу: усі дні на одній сторінці з навігацією по якорях.
 * Доступ перевіряє middleware (cookie pp_course); прогрес (складені тести) — cookie
 * pp_course_progress. Заблоковані дні рендеряться без контенту — лише замок.
 */
export default async function CourseLearnPage() {
  const jar = cookies();
  const session = await courseSession(jar.get(COURSE_COOKIE)?.value);
  let ctx: CourseCtx;
  if (session?.kind === "user") {
    // Персональний код: картка і прогрес — у БД; відкликаний або видалений — на вхід.
    const user = await getCourseUser(session.id);
    if (!user || user.revoked_at) redirect("/courses/messages/learn/login?e=revoked");
    await touchCourseUser(user.id);
    ctx = { progress: await userQuizProgress("messages", user.id), student: { name: user.name, phone: user.phone }, fixedStudent: true };
  } else {
    ctx = {
      progress: await parseProgress(jar.get(PROGRESS_COOKIE)?.value),
      student: parseStudent(jar.get(STUDENT_COOKIE)?.value),
      fixedStudent: false,
    };
  }
  const isOpen = (d: Day) => {
    const req = requiredQuiz(d);
    return req === null || (ctx.progress[req] ?? -1) >= PASS_MIN;
  };
  const total = QUIZ_SET.reduce((s, q) => s + (ctx.progress[q.n] ?? 0), 0);
  const passedCount = QUIZ_SET.filter((q) => (ctx.progress[q.n] ?? -1) >= PASS_MIN).length;

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
            Натискай на день нижче, щоб перейти до уроку. Кожен наступний день відкривається після тесту попереднього. Матеріали доступні 3 місяці — повертайся й переглядай знову.
          </p>
          <nav className="mt-2 flex flex-wrap gap-2" aria-label="Дні курсу">
            {DAYS.map((d) => {
              const open = isOpen(d);
              return (
                <a
                  key={d.slug}
                  href={`#${d.slug}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-colors ${open ? "border-line/70 text-ink hover:border-gold/60 hover:text-gold" : "border-line/40 text-faint hover:text-muted"}`}
                >
                  {!open && <Lock className="h-3 w-3" />}
                  {d.n}
                </a>
              );
            })}
          </nav>
          {ctx.student && (
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint">
              {ctx.student.name} · тестів складено {passedCount} з {QUIZ_SET.length} · балів {total} з {QUIZ_SET.length * QUIZ_MAX}
            </p>
          )}
        </div>
      </section>

      {DAYS.map((d, i) => {
        const open = isOpen(d);
        const req = requiredQuiz(d);
        const reqDay = req !== null ? DAYS.find((x) => x.slug === `day-${req}`) : undefined;
        return (
          <section key={d.slug} id={d.slug} className="relative grain scroll-mt-24 border-b border-line/50 section-pad">
            <div className="container-shell grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em]" style={gradText(GRAD_ACC)}>
                    {d.n}
                    {!open && <Lock className="h-3.5 w-3.5 text-faint" />}
                  </div>
                  <h2 className={`mt-3 font-display text-[clamp(1.6rem,2.8vw,2.2rem)] leading-tight ${open ? "text-ink" : "text-muted"}`}>{d.title}</h2>
                  <span aria-hidden className="mt-5 block h-[2px] w-16 rounded-full" style={{ background: open ? GRAD_GOLD : "rgb(255 255 255 / 0.12)" }} />
                  {open && d.intro && <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{d.intro}</p>}
                  {open && i < DAYS.length - 1 && (
                    <a href={`#${DAYS[i + 1].slug}`} className="mt-6 inline-block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint transition-colors hover:text-gold">
                      Далі: {DAYS[i + 1].n} ↓
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6 lg:col-span-8">
                {open ? (
                  d.blocks.map((b, k) => <CourseBlock key={k} b={b} ctx={ctx} />)
                ) : (
                  <div className="flex flex-col items-start gap-4 rounded-[14px] border border-line/60 p-7 sm:p-9" style={{ background: CARD_BG }}>
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-line/70 text-faint">
                      <Lock className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl text-ink">Розділ відкриється після тесту «{reqDay?.n ?? `День ${req}`}»</h3>
                    <p className="text-sm leading-relaxed text-muted">
                      Пройди опитувальник уроку {req} щонайменше на {PASS_MIN} з {QUIZ_MAX} балів — і цей день одразу стане доступним.
                    </p>
                    <a href={`#quiz-${req}`} className="btn btn-ghost">До тесту уроку {req} ↑</a>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

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
