import type { Metadata } from "next";
import { courseAuthEnabled } from "@/lib/courseAuth";
import { GRAD_ACC, gradText } from "@/lib/ember";

export const metadata: Metadata = {
  title: "Вхід до курсу — Повідомлення, на які відповідають",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const ERR: Record<string, string> = {
  "1": "Код не підійшов. Перевір, будь ласка, і спробуй ще раз.",
  wait: "Забагато спроб. Зачекай 15 хвилин і спробуй знову.",
  off: "Доступ до курсу ще не відкрито. Напиши нам — допоможемо.",
};

export default function CourseLoginPage({ searchParams }: { searchParams?: { e?: string } }) {
  const err = searchParams?.e ? ERR[searchParams.e] : null;
  const configured = courseAuthEnabled();
  return (
    <section className="relative grain min-h-[70vh]">
      <div className="container-shell flex items-center justify-center py-28 lg:py-36">
        <div className="w-full max-w-md">
          <span className="eyebrow">Онлайн-курс · закритий розділ</span>
          <h1 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.5rem)] leading-[1.1] text-ink">
            Повідомлення, на які{" "}
            <em className="italic" style={gradText(GRAD_ACC)}>відповідають</em>
          </h1>
          <p className="mt-3 text-muted">
            Введи код доступу з листа після оплати, щоб відкрити уроки.
          </p>
          <form method="POST" action="/api/course/login" className="mt-8 flex flex-col gap-4 rounded-[14px] border border-line/60 bg-[#131210] p-6">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">Код доступу</span>
              <input
                name="code"
                type="text"
                inputMode="text"
                autoComplete="one-time-code"
                autoFocus
                required
                disabled={!configured}
                className="rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3 text-lg tracking-[0.12em] text-ink caret-[#E2A638] outline-none focus:border-gold/70"
              />
            </label>
            {err && <p className="text-sm text-[#E58A5A]">{err}</p>}
            <button type="submit" className="btn btn-primary justify-center" disabled={!configured}>
              Відкрити курс
            </button>
          </form>
          <p className="mt-5 text-sm text-faint">
            Немає коду? Напиши в Instagram{" "}
            <a href="https://www.instagram.com/tetiana_pan.sales" className="text-gold underline underline-offset-4" target="_blank" rel="noopener noreferrer">
              @tetiana_pan.sales
            </a>{" "}
            або на <a href="mailto:info@pan-partners.agency" className="text-gold underline underline-offset-4">info@pan-partners.agency</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
