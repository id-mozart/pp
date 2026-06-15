import type { Metadata } from "next";
import { authEnabled } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "Вхід — адмін",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { e?: string; next?: string };
}) {
  const err = searchParams?.e === "1";
  const next = searchParams?.next ?? "/admin";
  const configured = authEnabled();

  return (
    <div
      id="pp-admin"
      className="grid min-h-screen place-items-center bg-[#0B0A09] px-6 text-ink"
    >
      <div className="w-full max-w-sm">
        <p className="logo text-center font-display text-2xl text-ink" style={{ fontFamily: "var(--font-playfair)" }}>
          Pan<em className="not-italic text-gold">&amp;</em>Partners
        </p>
        <p className="mt-1 text-center font-mono text-[0.62rem] uppercase tracking-[0.28em] text-faint">
          Панель адміністратора
        </p>

        {!configured ? (
          <div className="mt-8 rounded-xl border border-line/60 bg-[#131210] p-6 text-sm leading-relaxed text-muted">
            Пароль ще не налаштовано. Додайте змінну{" "}
            <code className="text-gold">ADMIN_PASSWORD</code> у Railway, щоб
            захистити панель. Поки можна{" "}
            <a href={next} className="text-gold underline">
              увійти без пароля →
            </a>
          </div>
        ) : (
          <form
            method="POST"
            action="/api/admin/login"
            className="mt-8 flex flex-col gap-4 rounded-xl border border-line/60 bg-[#131210] p-6"
          >
            <input type="hidden" name="next" value={next} />
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
                Пароль
              </span>
              <input
                name="password"
                type="password"
                autoFocus
                required
                className="rounded-[10px] border border-line/60 bg-[rgba(35,26,18,.55)] px-4 py-3 text-ink caret-[#E2A638] outline-none focus:border-gold/70"
              />
            </label>
            {err && (
              <p className="text-sm text-ember">Невірний пароль. Спробуйте ще раз.</p>
            )}
            <button type="submit" className="btn btn-primary w-full">
              Увійти
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
