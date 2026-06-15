import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { GRAD_ACC, gradText } from "@/lib/ember";

/**
 * Наскрізний горизонтальний CTA-банер над футером — головна точка конверсії
 * замість кнопки в шапці. Прихований на /admin (globals: body:has(#pp-admin)).
 */
export function CtaBanner() {
  return (
    <section
      data-cta-band
      className="relative grain overflow-hidden border-t border-line/50 bg-surface"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 120% at 50% 0%, rgba(226,166,56,.12), transparent 70%)",
        }}
      />
      <div className="container-shell relative flex flex-col items-center gap-7 py-12 text-center sm:flex-row sm:justify-between sm:gap-10 sm:py-14 sm:text-left">
        <div>
          <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.1] text-ink">
            Готові посилити{" "}
            <em className="italic" style={gradText(GRAD_ACC)}>
              свої продажі
            </em>
            ?
          </h2>
          <p className="mt-2 max-w-xl text-pretty text-base leading-relaxed text-muted">
            Розкажіть про свою ситуацію — відповімо протягом робочого дня. Без
            тиску й дзвінків без попередження.
          </p>
        </div>
        <Link href="/consultation#book" className="btn btn-primary shrink-0">
          Залишити заявку <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
