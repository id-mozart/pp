"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CircleX } from "@/components/ui/icons";
import type { PublicQuiz } from "@/lib/courses/quizzes";
import type { Student } from "@/lib/courseProgress";

type Result = { score: number; max: number; passMin: number; passed: boolean; wrong: number[]; best: number | null; correct?: (number | null)[] };

/**
 * Опитувальник уроку прямо на сайті (замість Google Forms). Відповіді перевіряє
 * /api/course/quiz; після складання (≥ passMin балів) сервер відмічає прогрес у cookie,
 * і router.refresh() перемальовує сторінку вже з відкритим наступним днем.
 * Імʼя і телефон просимо один раз — далі вони в cookie.
 */
export function CourseQuiz({ quiz, student, best, passMin, max, unlocks }: {
  quiz: PublicQuiz;
  student: Student | null;
  best: number | null;
  passMin: number;
  max: number;
  unlocks?: { label: string; slug: string };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(best === null);
  const [name, setName] = useState(student?.name ?? "");
  const [phone, setPhone] = useState(student?.phone ?? "");
  const [editStudent, setEditStudent] = useState(!student);
  const [answers, setAnswers] = useState<(number | null)[]>(() => quiz.questions.map(() => null));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const complete = answers.every((a) => a !== null);
  const studentOk = name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 10;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!complete || !studentOk || busy) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/course/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ n: quiz.n, name, phone, answers }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok || !data?.ok) {
        setErr(r.status === 401 ? "Сесія закінчилась — увійди до курсу ще раз." : "Не вдалося надіслати відповіді. Спробуй ще раз.");
        return;
      }
      setResult(data as Result);
      setEditStudent(false);
      if (data.passed) router.refresh();
    } catch {
      setErr("Немає звʼязку. Перевір інтернет і спробуй ще раз.");
    } finally {
      setBusy(false);
    }
  }

  function retry() {
    // Лишаємо правильні відповіді, скидаємо лише помилкові.
    if (result) setAnswers((prev) => prev.map((a, i) => (result.wrong.includes(i) ? null : a)));
    setResult(null);
    setErr(null);
  }

  const bestShown = result?.best ?? best;

  return (
    <div id={`quiz-${quiz.n}`} className="scroll-mt-24">
      {bestShown !== null && !result && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-gold/40 bg-gold/[0.08] px-5 py-4">
          <p className="flex items-center gap-2 text-sm text-ink">
            <Check className="h-4 w-4 text-gold" />
            Тест складено — найкращий результат <strong className="font-semibold">{bestShown} з {max}</strong>
          </p>
          <button type="button" onClick={() => setOpen((v) => !v)} className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint hover:text-gold">
            {open ? "Згорнути" : "Пройти ще раз"}
          </button>
        </div>
      )}

      {open && (
        <form onSubmit={submit} className="flex flex-col gap-6">
          {editStudent ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Ваше імʼя</span>
                <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className={input} placeholder="Імʼя" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Телефон, привʼязаний до Telegram</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" autoComplete="tel" className={input} placeholder="+38 ..." />
              </label>
              <p className="text-xs text-faint sm:col-span-2">Імʼя і телефон потрібні, щоб авторка нарахувала твої бали та передала подарунок.</p>
            </div>
          ) : (
            <p className="text-xs text-faint">
              Відповідає: <span className="text-ink">{name}</span> · {phone}{" "}
              <button type="button" onClick={() => setEditStudent(true)} className="ml-2 text-gold underline underline-offset-4">змінити</button>
            </p>
          )}

          <ol className="flex flex-col gap-5">
            {quiz.questions.map((it, i) => {
              const chosen = answers[i];
              const isWrong = !!result && result.wrong.includes(i);
              const correct = result?.correct?.[i];
              return (
                <li key={i} className={`rounded-[12px] border p-4 sm:p-5 ${isWrong ? "border-[#d98a72]/60" : "border-line/60"}`}>
                  <p className="mb-3 text-[0.98rem] leading-snug text-ink">
                    <span className="mr-2 font-mono text-[0.7rem] text-gold">{i + 1}.</span>
                    {it.q}
                  </p>
                  <div className="flex flex-col gap-2">
                    {it.options.map((opt, k) => {
                      const sel = chosen === k;
                      const showCorrect = result?.passed && (correct === k || correct === null);
                      const cls = showCorrect
                        ? "border-gold bg-gold/[0.1]"
                        : sel && isWrong
                          ? "border-[#d98a72] bg-[#d98a72]/10"
                          : sel
                            ? "border-gold/70 bg-[rgba(35,26,18,.6)]"
                            : "border-line/50 hover:border-gold/50";
                      return (
                        <label key={k} className={`flex cursor-pointer items-start gap-3 rounded-[10px] border px-4 py-3 text-sm text-ink/90 transition-colors ${cls} ${result ? "cursor-default" : ""}`}>
                          <input
                            type="radio"
                            name={`q${quiz.n}-${i}`}
                            checked={sel}
                            disabled={!!result}
                            onChange={() => setAnswers((prev) => prev.map((a, j) => (j === i ? k : a)))}
                            className="mt-1 h-3.5 w-3.5 shrink-0 accent-[#E2A638]"
                          />
                          <span>{opt}</span>
                          {showCorrect && <Check className="ml-auto h-4 w-4 shrink-0 text-gold" />}
                          {sel && isWrong && !showCorrect && <CircleX className="ml-auto h-4 w-4 shrink-0 text-[#d98a72]" />}
                        </label>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>

          {err && <p className="text-sm text-[#E58A5A]">{err}</p>}

          {!result ? (
            <button type="submit" disabled={!complete || !studentOk || busy} className="btn btn-primary self-start disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? "Перевіряємо…" : "Перевірити відповіді"}
            </button>
          ) : result.passed ? (
            <div className="rounded-[12px] border border-gold/50 bg-gold/[0.1] p-5">
              <p className="font-display text-xl text-ink">
                {result.score} з {result.max} балів — тест складено! 🧡
              </p>
              <p className="mt-2 text-sm text-muted">
                {unlocks ? `«${unlocks.label}» відкрито.` : "Молодець!"} Правильні відповіді позначено золотим.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {unlocks && (
                  <a href={`#${unlocks.slug}`} className="btn btn-primary">Перейти до «{unlocks.label}» ↓</a>
                )}
                <button type="button" onClick={retry} className="btn btn-ghost">Пройти ще раз</button>
              </div>
            </div>
          ) : (
            <div className="rounded-[12px] border border-[#d98a72]/50 bg-[#d98a72]/10 p-5">
              <p className="font-display text-xl text-ink">
                {result.score} з {result.max} балів
              </p>
              <p className="mt-2 text-sm text-muted">
                Щоб відкрити наступний урок, потрібно щонайменше {passMin}. Переглянь урок ще раз — помилкові відповіді позначено — і спробуй знову.
              </p>
              <button type="button" onClick={retry} className="btn btn-primary mt-4">Спробувати ще раз</button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

const input = "rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3 text-ink caret-[#E2A638] outline-none focus:border-gold/70";
