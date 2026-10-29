import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmForm } from "@/components/admin/ConfirmForm";
import { courseSecret, personalCodesEnabled, sharedCodeEnabled } from "@/lib/courseAuth";
import { DAYS, VIDEO_BASE } from "@/lib/courses/messages";
import { PASS_MIN, QUIZ_MAX, QUIZ_SET } from "@/lib/courses/quizzes";
import { hasDb, listCourseUsers, listQuizResults, type CourseUser, type QuizResult } from "@/lib/db";

export const metadata: Metadata = {
  title: "Онлайн-курс — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://pan-partners.agency";
const COURSE = "messages";

async function videoStatus(files: string[]): Promise<Record<string, string>> {
  if (!VIDEO_BASE) return {};
  const base = VIDEO_BASE.replace(/\/$/, "");
  const out: Record<string, string> = {};
  await Promise.all(
    files.map(async (f) => {
      try {
        const r = await fetch(`${base}/${f}`, { method: "HEAD", cache: "no-store" });
        const mb = Number(r.headers.get("content-length") || 0) / 1e6;
        out[f] = r.ok ? `✓ ${mb.toFixed(0)} МБ` : `✗ ${r.status}`;
      } catch {
        out[f] = "✗ немає звʼязку";
      }
    }),
  );
  return out;
}

type Stats = { best: Record<number, number>; attempts: number; last: string | null };
const emptyStats = (): Stats => ({ best: {}, attempts: 0, last: null });

/** Найкращий складений бал за кожен тест, кількість спроб, остання дата — по ключу (учень або телефон). */
function statsBy(rows: QuizResult[], key: (r: QuizResult) => string | null): Map<string, Stats> {
  const map = new Map<string, Stats>();
  for (const r of rows) {
    const k = key(r);
    if (!k) continue;
    const cur = map.get(k) ?? emptyStats();
    cur.attempts++;
    if (!cur.last || r.created_at > cur.last) cur.last = r.created_at;
    if (r.passed) cur.best[r.quiz] = Math.max(cur.best[r.quiz] ?? 0, r.score);
    map.set(k, cur);
  }
  return map;
}

const total = (s: Stats | undefined) => QUIZ_SET.reduce((a, q) => a + (s?.best[q.n] ?? 0), 0);
const passedCount = (s: Stats | undefined) => QUIZ_SET.filter((q) => (s?.best[q.n] ?? -1) >= PASS_MIN).length;
const day = (iso: string | null) => (iso ? iso.slice(0, 10) : "—");

const ERR: Record<string, string> = {
  nodb: "База даних не підключена — учнів зберігати ніде.",
  name: "Вкажіть імʼя учня (від 2 символів).",
  db: "Не вдалося зберегти — спробуйте ще раз.",
  id: "Невідомий учень.",
};

/** Службова сторінка курсу: учні та персональні коди, стан доступу, відео, посилання. */
export default async function AdminCoursePage({ searchParams }: { searchParams?: { new?: string; err?: string } }) {
  const videos = DAYS.flatMap((d) => d.blocks.filter((b) => b.kind === "video").map((b) => (b as { file: string; caption?: string }).file));
  const [status, users, results] = await Promise.all([
    videoStatus(videos),
    hasDb() ? listCourseUsers(COURSE) : Promise.resolve([] as CourseUser[]),
    hasDb() ? listQuizResults(COURSE) : Promise.resolve([] as QuizResult[]),
  ]);
  const byUser = statsBy(results, (r) => r.user_id);
  const shared = results.filter((r) => !r.user_id);
  const byPhone = statsBy(shared, (r) => r.phone.replace(/\D/g, "") || null);
  const sharedNames = new Map<string, { name: string; phone: string }>();
  for (const r of shared) { const k = r.phone.replace(/\D/g, ""); if (k && !sharedNames.has(k)) sharedNames.set(k, { name: r.name, phone: r.phone }); }
  const err = searchParams?.err ? ERR[searchParams.err] ?? ERR.db : null;
  const newId = searchParams?.new;
  const newUser = users.find((u) => u.id === newId);
  const active = users.filter((u) => !u.revoked_at).length;

  return (
    <div id="pp-admin" className="min-h-screen bg-[#0B0A09] px-6 py-10 text-ink">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint hover:text-gold">← адмін</Link>
        <h1 className="mt-4 font-display text-3xl text-ink">Онлайн-курс «Повідомлення, на які відповідають»</h1>
        <p className="mt-2 text-sm text-muted">Закритий розділ для учнів. У меню сайту не виводиться, пошуковики не індексують.</p>

        {/* ───── Учні та персональні коди ───── */}
        <section id="students" className="mt-8 scroll-mt-6 rounded-xl border border-line/60 bg-[#131210] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-lg text-ink">Учні та коди доступу</h2>
            <span className="font-mono text-xs text-faint">{active} активних · {users.length} усього</span>
          </div>
          <p className="mt-2 text-sm text-muted">
            Кожному учню — свій код. Надішліть його після оплати разом з посиланням на вхід. Прогрес і бали рахуються по учню на будь-якому пристрої.
          </p>

          {!personalCodesEnabled() ? (
            <p className="mt-4 rounded-[10px] border border-[#d98a72]/50 bg-[#d98a72]/10 px-4 py-3 text-sm text-ink">
              Персональні коди вимкнені: {!hasDb() ? "немає бази даних (DATABASE_URL)" : "не задано ключ підпису (COURSE_SECRET або ADMIN_PASSWORD)"}.
            </p>
          ) : (
            <form method="POST" action="/api/admin/course/users" className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_1.4fr_auto]">
              <input type="hidden" name="action" value="create" />
              <input name="name" required minLength={2} placeholder="Імʼя учня" className={input} />
              <input name="phone" inputMode="tel" placeholder="Телефон (Telegram)" className={input} />
              <input name="note" placeholder="Нотатка: оплата, звідки, email…" className={input} />
              <button type="submit" className="rounded-[10px] bg-gold px-5 py-3 text-sm font-semibold text-[#0B0A09] transition-opacity hover:opacity-90">Створити код</button>
            </form>
          )}
          {err && <p className="mt-3 text-sm text-[#E58A5A]">{err}</p>}

          {newUser && (
            <div className="mt-5 rounded-[12px] border border-gold/50 bg-gold/[0.08] p-5">
              <p className="text-sm text-muted">Код для <span className="text-ink">{newUser.name}</span> — скопіюйте й надішліть учню:</p>
              <p className="mt-2 select-all font-mono text-2xl tracking-[0.14em] text-gold">{newUser.code}</p>
              <p className="mt-3 select-all text-xs text-faint">
                Вхід: {SITE}/courses/messages/learn/login · код: {newUser.code}
              </p>
            </div>
          )}

          {users.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                  <tr>
                    <th className="py-2 pr-4 font-normal">Учень</th>
                    <th className="py-2 pr-4 font-normal">Код</th>
                    <th className="py-2 pr-4 font-normal">Прогрес</th>
                    {QUIZ_SET.map((q) => <th key={q.n} className="py-2 pr-2 text-center font-normal">Т{q.n}</th>)}
                    <th className="py-2 pr-3 text-right font-normal">Бали</th>
                    <th className="py-2 pr-4 font-normal">Був</th>
                    <th className="py-2 font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {users.map((u) => {
                    const s = byUser.get(u.id);
                    const revoked = !!u.revoked_at;
                    return (
                      <tr key={u.id} className={`${revoked ? "opacity-50" : ""} ${u.id === newId ? "bg-gold/[0.06]" : ""}`}>
                        <td className="py-2.5 pr-4 align-top">
                          <div className="text-ink">{u.name}</div>
                          <div className="font-mono text-xs text-muted">{u.phone || "—"}</div>
                          {u.note && <div className="mt-0.5 text-xs text-faint">{u.note}</div>}
                        </td>
                        <td className="py-2.5 pr-4 align-top">
                          <span className={`select-all font-mono tracking-[0.1em] ${revoked ? "line-through" : "text-gold"}`}>{u.code}</span>
                          {revoked && <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[#d98a72]">закрито {day(u.revoked_at)}</div>}
                        </td>
                        <td className="py-2.5 pr-4 align-top font-mono text-xs text-muted">{passedCount(s)} з {QUIZ_SET.length}</td>
                        {QUIZ_SET.map((q) => (
                          <td key={q.n} className={`py-2.5 pr-2 text-center align-top font-mono ${s?.best[q.n] !== undefined ? "text-gold" : "text-faint"}`}>{s?.best[q.n] ?? "–"}</td>
                        ))}
                        <td className="py-2.5 pr-3 text-right align-top font-mono text-ink">{total(s)}</td>
                        <td className="py-2.5 pr-4 align-top font-mono text-xs text-faint">{day(u.last_seen_at)}</td>
                        <td className="py-2.5 align-top">
                          <div className="flex gap-2">
                            <form method="POST" action="/api/admin/course/users">
                              <input type="hidden" name="id" value={u.id} />
                              <input type="hidden" name="action" value={revoked ? "restore" : "revoke"} />
                              <button className={btn}>{revoked ? "Відновити" : "Закрити"}</button>
                            </form>
                            <ConfirmForm action="/api/admin/course/users" message={`Видалити учня «${u.name}» разом з результатами тестів?`}>
                              <input type="hidden" name="id" value={u.id} />
                              <input type="hidden" name="action" value="delete" />
                              <button className={`${btn} hover:border-[#d98a72]/60 hover:text-[#d98a72]`}>Видалити</button>
                            </ConfirmForm>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-4 text-xs text-faint">
            «Закрити» — код перестає діяти одразу, результати лишаються. Тести: {QUIZ_SET.length} по {QUIZ_MAX} балів; наступний день відкривається від {PASS_MIN}.
          </p>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card title="Спільний код" ok={sharedCodeEnabled()}>
            {sharedCodeEnabled() ? (
              <>
                <p className="text-sm text-muted">Змінна <code className="text-gold">COURSE_ACCESS_CODE</code> ще задана — цей код теж пускає, але без картки учня (імʼя й телефон питаємо в тесті, прогрес — на пристрої):</p>
                <p className="mt-2 select-all rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3 font-mono text-xl tracking-[0.14em] text-gold">{process.env.COURSE_ACCESS_CODE}</p>
                <p className="mt-3 text-xs text-faint">Щоб лишити тільки персональні коди — приберіть змінну в Railway (і задайте <code className="text-gold">COURSE_SECRET</code>, інакше ключем підпису стане пароль адмінки). Увага: після зміни ключа всі учні входять заново.</p>
              </>
            ) : (
              <p className="text-sm text-muted">Вимкнено — пускають лише персональні коди. Ключ підпису: {process.env.COURSE_SECRET ? "COURSE_SECRET" : courseSecret() ? "ADMIN_PASSWORD" : "не задано"}.</p>
            )}
          </Card>
          <Card title="Відео-уроки" ok={!!VIDEO_BASE}>
            {VIDEO_BASE ? (
              <p className="text-sm text-muted">Хостинг (Cloudflare R2, бакет pp-course): <code className="break-all text-gold">{VIDEO_BASE}</code></p>
            ) : (
              <p className="text-sm text-muted">Відео ще не викладено — на сторінці показуються плейсхолдери з постерами. Після завантаження на хостинг задайте <code className="text-gold">NEXT_PUBLIC_COURSE_VIDEO_BASE</code> (адреса теки з файлами).</p>
            )}
            <ul className="mt-3 flex flex-col gap-1 font-mono text-xs text-faint">
              {videos.map((v) => (
                <li key={v} className="flex justify-between gap-4">
                  <span>{v}</span>
                  {status[v] && <span className={status[v].startsWith("✓") ? "text-gold" : "text-[#d98a72]"}>{status[v]}</span>}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {byPhone.size > 0 && (
          <div className="mt-6 rounded-xl border border-line/60 bg-[#131210] p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-lg text-ink">Результати за спільним кодом</h2>
              <span className="font-mono text-xs text-faint">{byPhone.size} учнів · {shared.length} спроб</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
                  <tr>
                    <th className="py-2 pr-4 font-normal">Учень</th>
                    <th className="py-2 pr-4 font-normal">Телефон</th>
                    {QUIZ_SET.map((q) => <th key={q.n} className="py-2 pr-3 text-center font-normal">Т{q.n}</th>)}
                    <th className="py-2 pr-3 text-right font-normal">Разом</th>
                    <th className="py-2 pr-3 text-right font-normal">Спроб</th>
                    <th className="py-2 font-normal">Остання</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {[...byPhone.entries()].map(([k, s]) => (
                    <tr key={k}>
                      <td className="py-2 pr-4 text-ink">{sharedNames.get(k)?.name}</td>
                      <td className="py-2 pr-4 font-mono text-xs text-muted">{sharedNames.get(k)?.phone}</td>
                      {QUIZ_SET.map((q) => (
                        <td key={q.n} className={`py-2 pr-3 text-center font-mono ${s.best[q.n] !== undefined ? "text-gold" : "text-faint"}`}>{s.best[q.n] ?? "–"}</td>
                      ))}
                      <td className="py-2 pr-3 text-right font-mono text-ink">{total(s)}</td>
                      <td className="py-2 pr-3 text-right font-mono text-muted">{s.attempts}</td>
                      <td className="py-2 font-mono text-xs text-faint">{day(s.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl border border-line/60 bg-[#131210] p-6">
          <h2 className="font-display text-lg text-ink">Посилання</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><span className="text-muted">Вхід для учнів:</span> <a className="text-gold underline underline-offset-4" href="/courses/messages/learn/login" target="_blank">{SITE}/courses/messages/learn/login</a></li>
            <li><span className="text-muted">Розділ курсу:</span> <a className="text-gold underline underline-offset-4" href="/courses/messages/learn" target="_blank">{SITE}/courses/messages/learn</a></li>
            <li><span className="text-muted">Лендинг (публічний):</span> <a className="text-gold underline underline-offset-4" href="/courses/messages" target="_blank">{SITE}/courses/messages</a></li>
          </ul>
          <p className="mt-4 text-xs text-faint">Програма: {DAYS.length} розділів — {DAYS.map((d) => d.n).join(" · ")}. Тексти й файли — у коді (lib/courses/messages.ts, public/courses/messages); ключі тестів — lib/courses/quizzes.ts.</p>
        </div>
      </div>
    </div>
  );
}

const input = "rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3 text-sm text-ink caret-[#E2A638] outline-none focus:border-gold/70";
const btn = "rounded-[8px] border border-line/60 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-gold/50 hover:text-gold";

function Card({ title, ok, children }: { title: string; ok: boolean; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line/60 bg-[#131210] p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-lg text-ink">{title}</h2>
        <span className="h-2 w-2 rounded-full" style={{ background: ok ? "#E2A638" : "#d98a72" }} />
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
