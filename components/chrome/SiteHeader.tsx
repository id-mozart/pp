"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { nav, languages } from "@/lib/content";
import { Menu, Close, ChevronDown, ArrowUpRight } from "@/components/ui/icons";
import { ModeToggle } from "@/components/chrome/ModeToggle";

const EASE = [0.16, 1, 0.3, 1] as const;

function isLinkActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
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
            href="/"
            className="wordmark font-display text-xl tracking-tight text-ink transition-opacity hover:opacity-80"
            aria-label="Pan&Partners — на головну"
          >
            Pan<span className="italic text-gold">&amp;</span>Partners
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => {
              const active = isLinkActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-sm transition-colors ${
                    active ? "text-gold" : "text-ink/85 hover:text-gold"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <LanguageMenu open={langOpen} setOpen={setLangOpen} />
            <Link
              href="/consultation#book"
              className="btn btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex"
            >
              Написати нам
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Відкрити меню"
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
                Pan<span className="italic text-gold">&amp;</span>Partners
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Закрити меню"
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
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line/50 py-5 font-display text-3xl text-ink"
                  >
                    <span className="font-mono text-xs text-faint">
                      0{i + 1}
                    </span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/consultation#book"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary mt-8 w-full"
              >
                Написати нам <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LanguageMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const current = languages[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label="Обрати мову"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-line/70 px-2.5 py-2 text-xs text-ink/80 transition-colors hover:border-gold/50 hover:text-gold"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.flag} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />
        <span className="font-mono tracking-wide">{current.short}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="surface absolute right-0 top-full mt-2 w-44 overflow-hidden p-1.5"
          >
            {languages.map((l) => (
              <li key={l.code}>
                <a
                  href={l.code === "uk" ? "/" : `/?lang=${l.code}`}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    l.code === "uk"
                      ? "bg-gold/10 text-gold"
                      : "text-muted hover:bg-ink/[0.04] hover:text-ink"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.flag} alt="" className="h-3.5 w-5 rounded-[2px] object-cover" />
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
