"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsApp, Telegram, Plus } from "@/components/ui/icons";
import { useContent, useUi } from "@/components/providers/LocaleProvider";
import { GRAD_GOLD, CTAG_BG } from "@/lib/ember";
import { track } from "@/lib/analytics";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FloatingContacts() {
  const { contacts } = useContent();
  const ui = useUi();
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "";
  // Внутрішній генератор — без плаваючих контактів.
  if (pathname.includes("/admin/story_gen")) return null;

  return (
    <div className="fixed bottom-20 right-5 z-[70] hidden flex-col items-end gap-3 sm:bottom-5 sm:flex">
      <AnimatePresence>
        {open && (
          <motion.div
            className="flex flex-col gap-3"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={{
              hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
            <ContactPill
              href={contacts.whatsapp.href}
              label={`WhatsApp · ${contacts.whatsapp.label}`}
              icon={<WhatsApp className="h-5 w-5" />}
            />
            <ContactPill
              href={contacts.telegram.href}
              label={`Telegram · ${contacts.telegram.label}`}
              icon={<Telegram className="h-5 w-5" />}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? ui.a11y.hideContacts : ui.a11y.showContacts}
        style={{ background: GRAD_GOLD }}
        className="group relative grid h-12 w-12 place-items-center rounded-full text-oncontrast shadow-[0_14px_30px_-12px_rgb(var(--c-gold)/0.7)] transition-transform duration-500 ease-lux hover:scale-105"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-gold/40 animate-pulse-ring" />
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease: EASE }}>
          <Plus className="h-6 w-6" strokeWidth={1.8} />
        </motion.span>
      </button>
    </div>
  );
}

function ContactPill({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("click_messenger")}
      variants={{
        hidden: { opacity: 0, x: 12, scale: 0.9 },
        show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: EASE } },
      }}
      style={{ background: CTAG_BG }}
      className="flex items-center gap-3 rounded-full border border-line/70 py-2 pl-3 pr-4 text-sm text-ink shadow-[var(--shadow-lux)] transition-colors hover:text-gold"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full bg-gold/12 text-gold">
        {icon}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </motion.a>
  );
}
