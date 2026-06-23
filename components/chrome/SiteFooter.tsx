"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsApp, Telegram } from "@/components/ui/icons";
import { GRAD_ACC, gradText } from "@/lib/ember";
import { FooterLeadLink } from "@/components/chrome/FooterLeadLink";
import { stripLocale } from "@/lib/i18n/config";
import {
  useContent,
  useUi,
  useLocalizedHref,
} from "@/components/providers/LocaleProvider";

export function SiteFooter() {
  const { brand, footer, contacts } = useContent();
  const ui = useUi();
  const localized = useLocalizedHref();
  // Внутрішній генератор — без сайтового футера.
  const pathname = stripLocale(usePathname() || "/");
  if (pathname.startsWith("/admin/story_gen")) return null;
  return (
    <footer className="relative overflow-hidden bg-surface">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="grain absolute inset-0" />
      <div className="container-shell relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href={localized("/")} className="wordmark font-display text-2xl tracking-tight text-ink">
              Pan<span className="italic text-gold">&amp;</span>Partners
            </Link>
            <p className="mt-4 max-w-xs font-display text-base italic leading-relaxed text-muted">
              {footer.tagline}
            </p>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={localized(l.href)} className="lux-link text-sm text-muted">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint">
              {ui.footer.directContact}
            </p>
            <div className="mt-4 space-y-3">
              <a
                href={contacts.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/12 text-gold">
                  <WhatsApp className="h-4 w-4" />
                </span>
                WhatsApp
              </a>
              <a
                href={contacts.telegram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/12 text-gold">
                  <Telegram className="h-4 w-4" />
                </span>
                Telegram
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="group flex items-center gap-3 text-sm text-muted transition-colors hover:text-gold"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/12 font-mono text-[0.7rem] text-gold">
                  @
                </span>
                {brand.email}
              </a>
            </div>
            <FooterLeadLink />
          </div>
        </div>

        <div className="mt-14 hairline" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-faint lg:flex-row">
          <p>{footer.copyright}</p>
          <p className="font-display text-sm italic" style={gradText(GRAD_ACC)}>
            {ui.footer.manner}
          </p>
          <p className="font-mono uppercase tracking-[0.16em]">{brand.role}</p>
        </div>
      </div>
    </footer>
  );
}
