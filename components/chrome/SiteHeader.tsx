"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Close, ArrowUpRight, WhatsApp, Telegram } from "@/components/ui/icons";
import { ModeToggle } from "@/components/chrome/ModeToggle";
import { LanguageSwitcher } from "@/components/chrome/LanguageSwitcher";
import {
  useContent,
  useUi,
  useLocalizedHref,
} from "@/components/providers/LocaleProvider";
import { stripLocale } from "@/lib/i18n/config";
import { GRAD_ACC, GRAD_GOLD, gradText } from "@/lib/ember";

const EASE = [0.16, 1, 0.3, 1] as const;

function isLinkActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const { nav, contacts } = useContent();
  const ui = useUi();
  const localized = useLocalizedHref();
  const rawPath = usePathname();
  const pathname = stripLocale(rawPath || "/");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ease-lux ${
          scrolled
            ? "border-b border-line/60 bg-canvas/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-shell flex h-[4.6rem] items-center justify-between gap-6">
          {/* Wordmark */}
          <Link
            href={localized("/")}
            className="wordmark font-display text-xl tracking-tight text-ink transition-opacity hover:opacity-80"
            aria-label={ui.a11y.wordmarkHome}
          >
            Pan<em className="italic" style={gradText(GRAD_ACC)}>&amp;</em>Partners
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => {
              const active = isLinkActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={localized(item.href)}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-sm transition-colors ${
                    active ? "text-gold" : "text-ink/85 hover:text-gold"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full" style={{ background: GRAD_GOLD }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right controls — акуратні контакти замість кнопки */}
          <div className="flex items-center gap-2.5">
            <ModeToggle />
            <LanguageSwitcher />
            <a
              href={contacts.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${contacts.whatsapp.label}`}
              title={`WhatsApp · ${contacts.whatsapp.label}`}
              className="hidden h-10 w-10 place-items-center rounded-full border border-line/70 text-ink transition-colors hover:border-gold/50 hover:text-gold sm:grid"
            >
              <WhatsApp className="h-[1.05rem] w-[1.05rem]" />
            </a>
            <a
              href={contacts.telegram.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Telegram ${contacts.telegram.label}`}
              title={`Telegram · ${contacts.telegram.label}`}
              className="hidden h-10 w-10 place-items-center rounded-full border border-line/70 text-ink transition-colors hover:border-gold/50 hover:text-gold sm:grid"
            >
              <Telegram className="h-[1.05rem] w-[1.05rem]" />
            </a>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label={ui.a11y.openMenu}
              className="grid h-10 w-10 place-items-center rounded-full border border-line/70 text-ink lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-canvas/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-shell flex h-[4.6rem] items-center justify-between">
              <span className="wordmark font-display text-xl tracking-tight text-ink">
                Pan<em className="italic" style={gradText(GRAD_ACC)}>&amp;</em>Partners
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label={ui.a11y.closeMenu}
                className="grid h-10 w-10 place-items-center rounded-full border border-line/70 text-ink"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            <motion.nav
              className="container-shell mt-6 flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
            >
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                  }}
                >
                  <Link
                    href={localized(item.href)}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line/50 py-5 font-display text-3xl text-ink"
                  >
                    <span className="font-mono text-xs" style={gradText(GRAD_ACC)}>
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={localized("/consultation#book")}
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary mt-8 w-full"
              >
                {ui.header.cta} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={contacts.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-ink/85 transition-colors hover:text-gold"
                >
                  <WhatsApp className="h-5 w-5 text-gold" /> {contacts.whatsapp.label}
                </a>
                <a
                  href={contacts.telegram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-ink/85 transition-colors hover:text-gold"
                >
                  <Telegram className="h-5 w-5 text-gold" /> {contacts.telegram.label}
                </a>
              </div>
              <div className="mt-6">
                <LanguageSwitcher />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

