"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@/components/ui/icons";

/** Mobile-only sticky CTA for /consultation — hides when #book is in view. */
export function StickyBookCta() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.querySelector("#book");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[65] p-3 sm:hidden">
      <a href="#book" className="btn btn-primary w-full shadow-[var(--shadow-lux)]">
        Забронювати консультацію <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
