import type { Metadata } from "next";
import Link from "next/link";
import { courseAuthEnabled } from "@/lib/courseAuth";
import { DAYS, VIDEO_BASE } from "@/lib/courses/messages";

export const metadata: Metadata = {
  title: "Онлайн-курс — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://pan-partners.agency";

/** Службова сторінка курсу: стан доступу, відео та посилання для учнів. Код і адреса відео задаються змінними Railway. */
export default function AdminCoursePage() {
  const code = process.env.COURSE_ACCESS_CODE || "";
  const videos = DAYS.flatMap((d) => d.blocks.filter((b) => b.kind === "video").map((b) => (b as { file: string; caption?: string }).file));
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
              <p className="text-sm text-muted">Хостинг: <code className="break-all text-gold">{VIDEO_BASE}</code></p>
            ) : (
              <p className="text-sm text-muted">Відео ще не викладено — на сторінці показуються плейсхолдери з постерами. Після завантаження на хостинг задайте <code className="text-gold">NEXT_PUBLIC_COURSE_VIDEO_BASE</code> (адреса теки з файлами).</p>
            )}
            <ul className="mt-3 flex flex-col gap-1 font-mono text-xs text-faint">
              {videos.map((v) => <li key={v}>{v}</li>)}
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
          <p className="mt-4 text-xs text-faint">Програма: {DAYS.length} розділів — {DAYS.map((d) => d.n).join(" · ")}. Тексти й файли — у коді (lib/courses/messages.ts, public/courses/messages).</p>
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
