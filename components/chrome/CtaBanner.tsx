"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { GRAD_ACC, gradText } from "@/lib/ember";

/**
 * Липкий CTA-банер, що випливає знизу під час прокрутки і ховається, коли
 * видно фінальну форму (#contact). Не рендериться на /admin і на /consultation
 * (там свій StickyBookCta). Прихований на /admin також через globals CSS.
 */
export function CtaBanner() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [atForm, setAtForm] = useState(false);

  const disabled =
    pathname.startsWith("/admin") || pathname.startsWith("/consultation");

  useEffect(() => {
    if (disabled) return;
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.querySelector("#contact");
    let io: IntersectionObserver | undefined;
    if (target) {
      io = new IntersectionObserver(
        ([entry]) => setAtForm(entry.isIntersecting),
        { rootMargin: "0px 0px -15% 0px" },
      );
      io.observe(target);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, [disabled, pathname]);

  if (disabled) return null;
  const show = scrolled && !atForm;

  return (
    <div
      data-cta-band
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-[55] border-t border-line/60 bg-canvas/85 backdrop-blur-xl transition-[transform,opacity] duration-500 ease-lux ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: GRAD_ACC, opacity: 0.5 }}
      />
      <div className="container-shell flex items-center justify-between gap-4 py-3 sm:py-3.5 lg:pr-24">
        <p className="hidden font-display text-base italic leading-snug text-ink sm:block">
          Готові посилити{" "}
          <em className="not-italic" style={gradText(GRAD_ACC)}>
            свої продажі
          </em>
          ?
        </p>
        <Link
          href="/consultation#book"
          className="btn btn-primary w-full justify-center sm:w-auto"
          tabIndex={show ? 0 : -1}
        >
          Залишити заявку <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
