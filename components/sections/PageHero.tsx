import Link from "next/link";
import type { ReactNode } from "react";
import { Ambient } from "@/components/ui/Ambient";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/icons";

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
      <Ambient />
      <div className="container-shell relative">
        <div className={image ? "grid items-center gap-12 lg:grid-cols-12" : ""}>
        <Reveal className={`flex flex-col gap-6 ${image ? "lg:col-span-7" : "max-w-3xl"}`}>
          {pill && (
            <span className="inline-flex items-center gap-2.5 self-start rounded-full border border-gold/30 px-4 py-2 text-sm text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {pill}
            </span>
          )}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.04] text-ink">
            {title}
          </h1>
          {lead && (
            <p className="max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>
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
            <div className="relative overflow-hidden rounded-[28px] border border-gold/20 shadow-[var(--shadow-lux)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                className="aspect-[4/5] w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/40 to-transparent" />
            </div>
          </Reveal>
        )}
        </div>
        {children}
      </div>
    </section>
  );
}
