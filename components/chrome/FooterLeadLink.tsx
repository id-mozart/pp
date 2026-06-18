"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/lib/i18n/config";
import { useUi, useLocalizedHref } from "@/components/providers/LocaleProvider";
import { GRAD_ACC, gradText } from "@/lib/ember";

/** «залишити заявку →» — веде на найближчу форму поточної сторінки. */
export function FooterLeadLink() {
  const ui = useUi();
  const localized = useLocalizedHref();
  const path = stripLocale(usePathname() || "/");
  const href =
    path === "/consultation"
      ? "#book"
      : path === "/b2b" || path === "/courses"
        ? "#contact"
        : localized("/#contact");
  return (
    <Link
      href={href}
      className="mt-5 inline-block font-display text-base italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
      style={gradText(GRAD_ACC)}
    >
      {ui.footerLeadLink}
    </Link>
  );
}
