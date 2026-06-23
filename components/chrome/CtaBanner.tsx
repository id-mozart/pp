"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { stripLocale } from "@/lib/i18n/config";
import { useUi, useLocalizedHref } from "@/components/providers/LocaleProvider";
import { GRAD_ACC, GRAD_GOLD, gradText } from "@/lib/ember";

/**
 * Липкий CTA-банер, що випливає знизу під час прокрутки і ховається, коли
 * видно фінальну форму (#contact). Не рендериться на /admin, /consultation
 * (там свій StickyBookCta) і на сторінці курсу /courses/messages (там власні
 * CTA). Прихований на /admin також через globals CSS.
 */
export function CtaBanner() {
  const ui = useUi();
  const localized = useLocalizedHref();
  const pathname = usePathname();
  const path = stripLocale(pathname || "/");
  const [scrolled, setScrolled] = useState(false);
  const [atForm, setAtForm] = useState(false);

  const disabled =
    path.startsWith("/admin") ||
    path.startsWith("/consultation") ||
    path.startsWith("/courses/messages");

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
      className={`fixed inset-x-0 bottom-4 z-[55] px-4 transition-[transform,opacity] duration-500 ease-lux sm:bottom-6 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[140%] opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div
        className="relative mx-auto flex max-w-2xl items-center justify-between gap-4 rounded-[14px] border border-line/70 px-5 py-3.5 backdrop-blur-2xl sm:px-6"
        style={{
          background:
            "linear-gradient(160deg,rgba(40,27,14,.58),rgba(20,13,7,.62))",
          boxShadow: "0 24px 60px rgba(0,0,0,.5)",
        }}
      >
        <span
          aria-hidden
          className="absolute left-6 top-0 h-[3px] w-16 -translate-y-1/2 rounded-full"
          style={{ background: GRAD_GOLD }}
        />
        <p className="hidden font-display text-lg italic leading-snug text-ink sm:block lg:text-xl">
          {ui.cta.bannerPre}
          <em className="not-italic" style={gradText(GRAD_ACC)}>
            {ui.cta.bannerEm}
          </em>
          {ui.cta.bannerPost}
        </p>
        <Link
          href={localized("/consultation#book")}
          className="btn btn-primary w-full justify-center sm:w-auto"
          tabIndex={show ? 0 : -1}
        >
          {ui.cta.button} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
