import type { Metadata } from "next";
import Link from "next/link";
import { courseAuthEnabled } from "@/lib/courseAuth";
import { DAYS, VIDEO_BASE } from "@/lib/courses/messages";
import { PASS_MIN, QUIZ_MAX, QUIZ_SET } from "@/lib/courses/quizzes";
import { hasDb, listQuizResults } from "@/lib/db";

export const metadata: Metadata = {
  title: "Онлайн-курс — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://pan-partners.agency";

/** Службова сторінка курсу: стан доступу, відео та посилання для учнів. Код і адреса відео задаються змінними Railway. */
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

type StudentRow = { name: string; phone: string; best: Record<number, number>; attempts: number; last: string };

/** Групуємо спроби по телефону: найкращий бал за кожен тест, кількість спроб, остання дата. */
function groupStudents(rows: Awaited<ReturnType<typeof listQuizResults>>): StudentRow[] {
  const map = new Map<string, StudentRow>();
  for (const r of rows) {
    const key = r.phone.replace(/\D/g, "");
    const cur = map.get(key) ?? { name: r.name, phone: r.phone, best: {}, attempts: 0, last: r.created_at };
    cur.attempts++;
    if (r.created_at > cur.last) { cur.last = r.created_at; cur.name = r.name; }
    if (r.passed) cur.best[r.quiz] = Math.max(cur.best[r.quiz] ?? 0, r.score);
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => (a.last < b.last ? 1 : -1));
}

export default async function AdminCoursePage() {
  const code = process.env.COURSE_ACCESS_CODE || "";
  const results = hasDb() ? await listQuizResults("messages") : [];
  const students = groupStudents(results);
  const videos = DAYS.flatMap((d) => d.blocks.filter((b) => b.kind === "video").map((b) => (b as { file: string; caption?: string }).file));
  const status = await videoStatus(videos);
  return (
    <div id="pp-admin" className="min-h-screen bg-[#0B0A09] px-6 py-10 text-ink">
      <div className="mx-auto max-w-3xl">
        <Link href="/admin" className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-faint hover:text-gold">← адмін</Link>
        <h1 className="mt-4 font-display text-3xl text-ink">Онлайн-курс «Повідомлення, на які відповідають»</h1>
        <p className="mt-2 text-sm text-muted">Закритий розділ для учнів. У меню сайту не виводиться, пошуковики не індексують.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card title="Доступ для учнів" ok={courseAuthEnabled()}>
            {courseAuthEnabled() ? (
              <>
                <p className="text-sm text-muted">Код доступу (надсилайте після оплати):</p>
                <p className="mt-2 select-all rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3 font-mono text-xl tracking-[0.14em] text-gold">{code}</p>
                <p className="mt-3 text-xs text-faint">Змінити: Railway → Variables → <code className="text-gold">COURSE_ACCESS_CODE</code>. Старий код і всі сесії учнів одразу перестануть діяти.</p>
              </>
            ) : (
              <p className="text-sm text-muted">Задайте змінну <code className="text-gold">COURSE_ACCESS_CODE</code> у Railway — до того розділ закритий для всіх.</p>
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

        <div className="mt-6 rounded-xl border border-line/60 bg-[#131210] p-6">
          <h2 className="font-display text-lg text-ink">Посилання</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><span className="text-muted">Вхід для учнів:</span> <a className="text-gold underline underline-offset-4" href="/courses/messages/learn/login" target="_blank">{SITE}/courses/messages/learn/login</a></li>
            <li><span className="text-muted">Розділ курсу:</span> <a className="text-gold underline underline-offset-4" href="/courses/messages/learn" target="_blank">{SITE}/courses/messages/learn</a></li>
            <li><span className="text-muted">Лендинг (публічний):</span> <a className="text-gold underline underline-offset-4" href="/courses/messages" target="_blank">{SITE}/courses/messages</a></li>
          </ul>
          <p className="mt-4 text-xs text-faint">Тести — на сайті (без Google Forms): {QUIZ_SET.length} опитувальників по {QUIZ_MAX} балів; наступний день відкривається від {PASS_MIN} балів. Ключі відповідей — lib/courses/quizzes.ts.</p>
          <p className="mt-2 text-xs text-faint">Програма: {DAYS.length} розділів — {DAYS.map((d) => d.n).join(" · ")}. Тексти й файли — у коді (lib/courses/messages.ts, public/courses/messages).</p>
        </div>

        <div className="mt-6 rounded-xl border border-line/60 bg-[#131210] p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-lg text-ink">Результати тестів</h2>
            <span className="font-mono text-xs text-faint">{students.length} учнів · {results.length} спроб</span>
          </div>
          {!hasDb() ? (
            <p className="mt-3 text-sm text-muted">База даних не підключена — спроби не зберігаються.</p>
          ) : students.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Поки ніхто не проходив тести.</p>
          ) : (
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
                  {students.map((s) => {
                    const total = QUIZ_SET.reduce((a, q) => a + (s.best[q.n] ?? 0), 0);
                    return (
                      <tr key={s.phone}>
                        <td className="py-2 pr-4 text-ink">{s.name}</td>
                        <td className="py-2 pr-4 font-mono text-xs text-muted">{s.phone}</td>
                        {QUIZ_SET.map((q) => (
                          <td key={q.n} className={`py-2 pr-3 text-center font-mono ${s.best[q.n] !== undefined ? "text-gold" : "text-faint"}`}>{s.best[q.n] ?? "–"}</td>
                        ))}
                        <td className="py-2 pr-3 text-right font-mono text-ink">{total}</td>
                        <td className="py-2 pr-3 text-right font-mono text-muted">{s.attempts}</td>
                        <td className="py-2 font-mono text-xs text-faint">{s.last.slice(0, 10)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
