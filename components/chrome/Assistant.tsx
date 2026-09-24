"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ASSISTANT_GREETING } from "@/lib/assistant";
import { GRAD_ACC, gradText } from "@/lib/ember";

type Msg = { role: "user" | "assistant"; content: string };

const ERR: Record<string, string> = {
  not_configured: "Асистент ще не підключений. Напишіть нам через форму внизу сторінки.",
  rate_limited: "Забагато повідомлень поспіль. Зачекайте кілька хвилин.",
  busy: "Асистент зараз зайнятий. Спробуйте за хвилину.",
  api: "Не вдалося отримати відповідь. Спробуйте ще раз.",
};

/**
 * AI-асистент сайту. Поки що відкривається лише з непомітного посилання у футері
 * (подія `pp:assistant`) або з адреси #assistant; без власної кнопки на сторінці.
 */
export function Assistant() {
  const pathname = usePathname() || "/";
  const locale = (pathname.split("/")[1] || "uk") as keyof typeof ASSISTANT_GREETING;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("pp:assistant", onOpen);
    if (location.hash === "#assistant") setOpen(true);
    return () => window.removeEventListener("pp:assistant", onOpen);
  }, []);
  useEffect(() => {
    if (!open) return;
    if (!msgs.length) setMsgs([{ role: "assistant", content: ASSISTANT_GREETING[locale] ?? ASSISTANT_GREETING.uk }]);
    setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setErr(""); setInput("");
    const history = [...msgs.filter((m, i) => !(i === 0 && m.role === "assistant")), { role: "user" as const, content: text }];
    setMsgs((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setBusy(true);
    try {
      const r = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-20) }) });
      if (!r.ok || !r.body) {
        const j = await r.json().catch(() => ({}));
        setErr(ERR[j?.error] || ERR.api);
        setMsgs((m) => m.slice(0, -1));
        return;
      }
      const reader = r.body.getReader(); const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
      }
    } catch {
      setErr(ERR.api); setMsgs((m) => m.slice(0, -1));
    } finally { setBusy(false); }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-end p-3 sm:p-5" role="dialog" aria-modal="true" aria-label="AI-асистент Pan&Partners">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <div className="relative flex h-[min(680px,calc(100dvh-24px))] w-full max-w-[440px] flex-col overflow-hidden rounded-[18px] border border-line/70 bg-canvas shadow-[0_30px_80px_rgba(0,0,0,.45)]">
        <div className="flex items-center gap-3 border-b border-line/60 px-5 py-3.5">
          <span className="font-display text-lg text-ink">Pan<em className="not-italic" style={gradText(GRAD_ACC)}>&amp;</em>Partners</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">AI-асистент · beta</span>
          <button type="button" onClick={() => setOpen(false)} className="ml-auto rounded-full p-1.5 text-muted hover:text-ink" aria-label="Закрити">✕</button>
        </div>
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={"max-w-[85%] whitespace-pre-wrap rounded-[14px] px-4 py-2.5 text-[15px] leading-relaxed " + (m.role === "user" ? "bg-gold/15 text-ink" : "border border-line/60 bg-surface text-ink/90")}>
                {m.content || (busy && i === msgs.length - 1 ? <span className="inline-block animate-pulse text-muted">…</span> : "")}
              </div>
            </div>
          ))}
          {err && <p className="text-sm text-ember">{err}</p>}
        </div>
        <form className="flex items-end gap-2 border-t border-line/60 p-3" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
            maxLength={4000}
            placeholder="Напишіть, що зараз із продажами…"
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-[12px] border border-line/70 bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none placeholder:text-faint focus:border-gold/60"
          />
          <button type="submit" disabled={busy || !input.trim()} className="btn btn-primary h-11 px-4 disabled:opacity-50">→</button>
        </form>
        <p className="px-4 pb-3 text-[11px] leading-snug text-faint">Відповіді генерує ШІ і вони можуть містити неточності. Ціни й умови підтверджує Тетяна особисто.</p>
      </div>
    </div>
  );
}

/** Непомітне посилання у футері: відкриває асистента. */
export function AssistantLink() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("pp:assistant"))}
      className="text-faint/50 transition-colors hover:text-gold"
      aria-label="AI-асистент"
      title="AI-асистент"
    >
      ·
    </button>
  );
}
