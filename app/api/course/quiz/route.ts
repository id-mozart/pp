import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COURSE_COOKIE, courseSession } from "@/lib/courseAuth";
import { PASS_MIN, QUIZ_MAX, getQuiz, grade } from "@/lib/courses/quizzes";
import {
  COOKIE_MAX_AGE,
  PROGRESS_COOKIE,
  STUDENT_COOKIE,
  normalizePhone,
  parseProgress,
  parseStudent,
  serializeProgress,
  serializeStudent,
} from "@/lib/courseProgress";
import { getCourseUser, insertQuizResult, touchCourseUser, userQuizProgress } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COURSE = "messages";

/**
 * Перевірка опитувальника: оцінює відповіді на сервері (ключі не потрапляють у браузер),
 * пише спробу в Postgres і, якщо набрано PASS_MIN, відмічає тест складеним — це відкриває
 * наступний день. Персональний код: учень і прогрес — з БД (працює на будь-якому пристрої);
 * спільний код: імʼя/телефон з форми, прогрес — у підписаній cookie.
 */
export async function POST(req: Request) {
  const jar = cookies();
  const session = await courseSession(jar.get(COURSE_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { n?: unknown; name?: unknown; phone?: unknown; answers?: unknown } | null;
  const n = Number(body?.n);
  const quiz = getQuiz(n);
  if (!quiz) return NextResponse.json({ ok: false, error: "quiz" }, { status: 400 });

  // Учень: з картки в БД (персональний код) або з форми / cookie (спільний код).
  const user = session.kind === "user" ? await getCourseUser(session.id) : null;
  if (session.kind === "user" && (!user || user.revoked_at)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const fromCookie = parseStudent(jar.get(STUDENT_COOKIE)?.value);
  const name = (user?.name ?? String(body?.name ?? fromCookie?.name ?? "")).trim().slice(0, 120);
  const phone = (user ? user.phone : normalizePhone(String(body?.phone ?? fromCookie?.phone ?? ""))).slice(0, 32);
  if (!user && (name.length < 2 || phone.replace(/\D/g, "").length < 10)) {
    return NextResponse.json({ ok: false, error: "student" }, { status: 400 });
  }

  const answers = Array.isArray(body?.answers) ? (body!.answers as unknown[]).slice(0, quiz.questions.length) : [];
  if (answers.length !== quiz.questions.length) {
    return NextResponse.json({ ok: false, error: "answers" }, { status: 400 });
  }

  const { score, wrong } = grade(quiz, answers);
  const passed = score >= PASS_MIN;

  await insertQuizResult({ course: COURSE, user_id: user?.id ?? null, quiz: n, name, phone, score, max: QUIZ_MAX, passed, answers });

  let progress: Record<number, number>;
  if (user) {
    await touchCourseUser(user.id);
    progress = await userQuizProgress(COURSE, user.id);
  } else {
    progress = await parseProgress(jar.get(PROGRESS_COOKIE)?.value);
    if (passed) progress[n] = Math.max(progress[n] ?? 0, score);
  }

  const res = NextResponse.json({
    ok: true,
    score,
    max: QUIZ_MAX,
    passMin: PASS_MIN,
    passed,
    wrong,
    best: progress[n] ?? null,
    // Правильні відповіді показуємо лише після складання — щоб не підбирали наосліп.
    correct: passed ? quiz.questions.map((q) => q.correct) : undefined,
  });
  if (!user) {
    const opts = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: COOKIE_MAX_AGE };
    res.cookies.set(PROGRESS_COOKIE, await serializeProgress(progress), opts);
    res.cookies.set(STUDENT_COOKIE, serializeStudent({ name, phone }), opts);
  }
  return res;
}
