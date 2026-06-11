"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GRAD_ACC, gradText } from "@/lib/ember";

/** «залишити заявку →» — веде на найближчу форму поточної сторінки. */
export function FooterLeadLink() {
  const pathname = usePathname();
  const href =
    pathname === "/consultation"
      ? "#book"
      : pathname === "/b2b" || pathname === "/courses"
        ? "#contact"
        : "/#contact";
  return (
    <Link
      href={href}
      className="mt-5 inline-block font-display text-base italic transition-transform duration-500 ease-lux hover:translate-x-1.5"
      style={gradText(GRAD_ACC)}
    >
      залишити заявку →
    </Link>
  );
}
