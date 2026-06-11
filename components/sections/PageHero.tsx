import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";
import { GRAD_ACC, GRAD_GOLD, CTAG_BG, gradText } from "@/lib/ember";

interface CTA {
  label: string;
  href: string;
}

export function PageHero({
  pill,
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  finePrint,
  image,
  children,
}: {
  pill?: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  primary?: CTA;
  secondary?: CTA;
  finePrint?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative grain overflow-hidden pb-16 pt-36 lg:pt-44">
      {/* статичні янтарні переливи (як на Main) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52vw 52vw at 88% -8%, rgb(226 166 56 / 0.14), transparent 62%), radial-gradient(46vw 46vw at -6% 104%, rgb(214 106 44 / 0.1), transparent 62%)",
        }}
      />
      <div className="container-shell relative">
        <div className={image ? "grid items-center gap-12 lg:grid-cols-12" : ""}>
          <Reveal
            className={`flex flex-col gap-6 ${image ? "lg:col-span-7" : "max-w-3xl"}`}
          >
            {pill && (
              <span
                className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-line/70 px-3.5 py-2 font-mono text-[0.62rem] font-medium uppercase tracking-[0.1em] text-ink"
                style={{ background: CTAG_BG, borderLeft: "3px solid #E2A638" }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: GRAD_GOLD }}
                />
                {pill}
              </span>
            )}
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h1 className="text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.04] text-ink">
              {title}
            </h1>
            <span
              aria-hidden
              className="h-[2px] w-16 rounded-full"
              style={{ background: GRAD_GOLD }}
            />
            {lead && (
              <p className="max-w-2xl font-display text-lg italic leading-relaxed text-ink/85">
                {lead}
              </p>
            )}
            {(primary || secondary) && (
              <div className="mt-1 flex flex-wrap gap-3">
                {primary && (
                  <Link href={primary.href} className="btn btn-primary">
                    {primary.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {secondary && (
                  <Link href={secondary.href} className="btn btn-ghost">
                    {secondary.label}
                  </Link>
                )}
              </div>
            )}
            {finePrint && <p className="text-sm text-faint">{finePrint}</p>}
          </Reveal>
          {image && (
            <Reveal delay={0.1} className="lg:col-span-5">
              <div
                className="relative overflow-hidden rounded-[14px] border border-line/60"
                style={{ boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt=""
                  className="aspect-[4/5] w-full object-cover object-top"
                />
                <div
                  className="absolute inset-x-0 top-0 h-32"
                  style={{
                    background:
                      "linear-gradient(180deg,rgba(13,9,5,.82) 0%,rgba(13,9,5,.30) 55%,transparent 100%)",
                  }}
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-[45%]"
                  style={{
                    background:
                      "linear-gradient(0deg,rgba(11,7,4,.8) 0%,rgba(12,8,5,.25) 60%,transparent 100%)",
                  }}
                />
                <div className="grain absolute inset-0 opacity-20" />
                <div className="absolute left-6 right-6 top-5 flex items-center justify-between font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em]">
                  <span style={gradText(GRAD_ACC)}>Pan&amp;Partners</span>
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: GRAD_GOLD }}
                  />
                </div>
              </div>
            </Reveal>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
