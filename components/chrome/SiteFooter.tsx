import Link from "next/link";
import { brand, footer, contacts, nav } from "@/lib/content";
import { WhatsApp, Telegram, ArrowUpRight } from "@/components/ui/icons";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line/60 bg-surface">
      <div className="grain absolute inset-0" />
      <div className="container-shell relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="wordmark font-display text-2xl tracking-tight text-ink">
              Pan<span className="text-gold">&amp;</span>Partners
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {footer.tagline}
            </p>
          </div>

          {/* Link columns */}
          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="lux-link text-sm text-muted">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
              Прямий контакт
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
                {contacts.whatsapp.label}
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
                {contacts.telegram.label}
              </a>
            </div>
            <Link
              href="/#contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm text-gold lux-link"
            >
              Залишити заявку <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 hairline" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-faint sm:flex-row">
          <p>{footer.copyright}</p>
          <p className="font-mono uppercase tracking-[0.16em]">
            {brand.role}
          </p>
        </div>
      </div>
    </footer>
  );
}
