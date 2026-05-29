import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHead({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
  titleClass = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClass?: string;
}) {
  return (
    <Reveal
      className={`flex flex-col gap-5 ${
        align === "center" ? "items-center text-center" : "items-start"
      } ${className}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={`text-[clamp(2rem,4vw,3.4rem)] leading-[1.05] text-ink ${
          align === "center" ? "max-w-3xl" : "max-w-2xl"
        } ${titleClass}`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`text-lg leading-relaxed text-muted ${
            align === "center" ? "max-w-2xl" : "max-w-xl"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
