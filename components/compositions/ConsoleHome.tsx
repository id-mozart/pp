"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { about, formats, clients, testimonials, contacts } from "@/lib/content";

type Line = { role: "sys" | "cmd" | "out"; node: ReactNode };

const COMMANDS = [
  "help",
  "про",
  "формати",
  "кейси",
  "клієнти",
  "контакт",
  "забронювати",
  "clear",
];

export function ConsoleHome() {
  const [history, setHistory] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHistory([
      {
        role: "sys",
        node: (
          <>
            <span className="text-gold">Pan&amp;Partners</span> — консоль
            продажів та переговорів · v2026
          </>
        ),
      },
      {
        role: "sys",
        node: (
          <>
            Введіть <b className="text-gold">help</b> або клікніть команду нижче.
          </>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [history]);

  function resp(cmd: string): ReactNode {
    switch (cmd) {
      case "help":
        return (
          <>
            доступні команди:{" "}
            {COMMANDS.map((c) => (
              <span key={c} className="text-gold">
                {c}{" "}
              </span>
            ))}
          </>
        );
      case "про":
      case "about":
        return (
          <>
            {about.intro}
            <br />• {about.credentials[0]}
            <br />• {about.credentials[1]}
          </>
        );
      case "формати":
      case "formats":
        return (
          <div>
            {formats.cards.map((c) => (
              <div key={c.number}>
                [{c.number}] <span className="text-ink">{c.title}</span> —{" "}
                {c.result}
              </div>
            ))}
          </div>
        );
      case "кейси":
      case "відгуки":
        return (
          <div>
            {testimonials.items.map((t) => (
              <div key={t.name}>
                “{t.quote}” — <span className="text-gold">{t.name}</span>
              </div>
            ))}
          </div>
        );
      case "клієнти":
        return (
          <>
            {clients.named.join(" · ")}
            <br />
            25+ років · 17+ навчання · 90% утримання · 6 галузей
          </>
        );
      case "контакт":
        return (
          <>
            WhatsApp:{" "}
            <a
              className="text-gold underline"
              href={contacts.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contacts.whatsapp.label}
            </a>{" "}
            · Telegram:{" "}
            <a
              className="text-gold underline"
              href={contacts.telegram.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contacts.telegram.label}
            </a>
          </>
        );
      case "забронювати":
      case "book":
        return (
          <>
            відкрити бронювання →{" "}
            <Link className="text-gold underline" href="/consultation#book">
              /consultation#book
            </Link>
          </>
        );
      default:
        return (
          <span className="text-ember">
            команда «{cmd}» не знайдена. спробуйте: help
          </span>
        );
    }
  }

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }
    setHistory((h) => [
      ...h,
      { role: "cmd", node: raw.trim() },
      { role: "out", node: resp(cmd) },
    ]);
    setInput("");
  }

  return (
    <section className="container-shell pb-16 pt-28 font-mono sm:pt-32">
      <div className="surface overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line/60 bg-raised px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-ember" />
          <span className="h-3 w-3 rounded-full bg-gold" />
          <span className="h-3 w-3 rounded-full bg-muted/40" />
          <span className="ml-3 text-xs text-muted">
            гість@pan&amp;partners — sales console
          </span>
        </div>
        <div
          className="h-[58vh] overflow-y-auto p-5 text-sm leading-relaxed sm:text-base"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {l.role === "cmd" ? (
                <span>
                  <span className="text-gold">$</span> {l.node}
                </span>
              ) : (
                <span className="text-muted">{l.node}</span>
              )}
            </div>
          ))}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-gold">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") run(input);
              }}
              className="flex-1 bg-transparent text-ink caret-gold outline-none"
              placeholder="введіть команду…"
              spellCheck={false}
              aria-label="Команда"
            />
          </div>
          <div ref={endRef} />
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line/60 p-4">
          {COMMANDS.map((c) => (
            <button
              key={c}
              onClick={() => run(c)}
              className="rounded-[3px] border border-gold/40 px-3 py-1 text-xs text-gold transition-colors hover:bg-gold/10"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
