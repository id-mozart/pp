import { CourseVideo } from "@/components/course/CourseVideo";
import { CourseQuiz } from "@/components/course/CourseQuiz";
import { ArrowUpRight, Download, Check } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CARD_BG, gradText } from "@/lib/ember";
import { DAYS, QUIZ_HTML, VIDEO_BASE, type Block } from "@/lib/courses/messages";
import { PASS_MIN, QUIZ_MAX, QUIZ_SET, getQuiz, publicQuiz } from "@/lib/courses/quizzes";
import type { Progress, Student } from "@/lib/courseProgress";

const prose = "prose-course text-[1.02rem] leading-relaxed text-ink/90";

/** Стан учня з cookie — потрібен блокам «тест» і «бали». */
export type CourseCtx = { progress: Progress; student: Student | null; /** персональний код — імʼя/телефон з картки учня, не редагуються */ fixedStudent: boolean };

function Card({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className="relative rounded-[14px] border border-line/70 p-6 sm:p-7" style={{ background: CARD_BG }}>
      {accent && <span aria-hidden className="absolute left-6 top-0 h-[3px] w-12 -translate-y-1/2 rounded-full" style={{ background: GRAD_GOLD }} />}
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em]" style={gradText(GRAD_ACC)}>{children}</div>;
}

/** Що відкриває тест n: наступний розділ після дня n (для тесту 5 — фінал). */
function unlocksAfter(n: number) {
  const i = DAYS.findIndex((d) => d.slug === `day-${n}`);
  const next = i >= 0 ? DAYS[i + 1] : undefined;
  return next ? { label: next.n, slug: next.slug } : undefined;
}

export function CourseBlock({ b, ctx }: { b: Block; ctx: CourseCtx }) {
  switch (b.kind) {
    case "text":
      return <div className={prose} dangerouslySetInnerHTML={{ __html: b.html }} />;
    case "video":
      return <CourseVideo src={VIDEO_BASE ? `${VIDEO_BASE.replace(/\/$/, "")}/${b.file}` : ""} poster={`/courses/messages/posters/${b.file.replace(/\.mp4$/, "")}.jpg`} caption={b.caption} />;
    case "images":
      return (
        <figure>
          <div className={b.items.length > 1 ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : ""}>
            {b.items.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={im.src}
                src={im.src}
                alt={im.alt}
                loading="lazy"
                draggable={false}
                className={`w-full rounded-[12px] border border-line/60 select-none ${im.tall ? "mx-auto max-w-[420px]" : ""}`}
              />
            ))}
          </div>
          {b.caption && <figcaption className="mt-3 text-sm leading-relaxed text-muted">{b.caption}</figcaption>}
        </figure>
      );
    case "homework":
      return (
        <Card accent>
          <Label>Домашка</Label>
          <div className={prose} dangerouslySetInnerHTML={{ __html: b.html }} />
        </Card>
      );
    case "quiz": {
      const quiz = getQuiz(b.n);
      if (!quiz) return null;
      return (
        <Card accent>
          <Label>Перевір себе · до {QUIZ_MAX} балів</Label>
          <h3 className="font-display text-xl leading-tight text-ink">{b.label}</h3>
          <div className={`${prose} mt-3 mb-6`} dangerouslySetInnerHTML={{ __html: QUIZ_HTML }} />
          <CourseQuiz
            quiz={publicQuiz(quiz)}
            student={ctx.student}
            fixedStudent={ctx.fixedStudent}
            best={ctx.progress[b.n] ?? null}
            passMin={PASS_MIN}
            max={QUIZ_MAX}
            unlocks={unlocksAfter(b.n)}
          />
        </Card>
      );
    }
    case "scores": {
      const total = QUIZ_SET.reduce((s, q) => s + (ctx.progress[q.n] ?? 0), 0);
      return (
        <Card accent>
          <Label>Твої бали за тести</Label>
          <ul className="flex flex-col divide-y divide-line/50">
            {QUIZ_SET.map((q) => {
              const s = ctx.progress[q.n];
              return (
                <li key={q.n} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="text-ink/90">Урок {q.n}. {q.title}</span>
                  {s !== undefined ? (
                    <span className="flex shrink-0 items-center gap-1.5 font-mono text-gold"><Check className="h-4 w-4" />{s} з {QUIZ_MAX}</span>
                  ) : (
                    <a href={`#quiz-${q.n}`} className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint hover:text-gold">пройти →</a>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 flex items-baseline justify-between gap-4 border-t border-line/60 pt-4">
            <span className="text-sm text-muted">Разом за тести</span>
            <span className="font-display text-2xl text-ink">{total} <span className="text-base text-muted">з {QUIZ_SET.length * QUIZ_MAX}</span></span>
          </p>
          <p className="mt-3 text-xs text-faint">Бали за відгук в Instagram та за запрошених друзів авторка додає вручну — ми звʼяжемось з тобою.</p>
        </Card>
      );
    }
    case "link":
      return (
        <Card>
          {b.note && <p className={`${prose} mb-4`}>{b.note}</p>}
          <a href={b.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            {b.label} <ArrowUpRight className="h-4 w-4" />
          </a>
        </Card>
      );
    case "pdf":
      return (
        <Card accent>
          <Label>Бонус · PDF</Label>
          <h3 className="font-display text-xl leading-tight text-ink">{b.title}</h3>
          <div className={`${prose} mt-3`} dangerouslySetInnerHTML={{ __html: b.html }} />
          <a href={b.file} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">
            Відкрити PDF <Download className="h-4 w-4" />
          </a>
        </Card>
      );
    case "note":
      return (
        <div className="flex gap-3 rounded-[14px] border border-gold/30 bg-gold/[0.06] p-5 sm:p-6">
          <Check className="mt-1 h-5 w-5 shrink-0 text-gold" />
          <div className={prose} dangerouslySetInnerHTML={{ __html: b.html }} />
        </div>
      );
  }
}
