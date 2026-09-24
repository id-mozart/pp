import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { ASSISTANT_SYSTEM } from "@/lib/assistant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Простий ліміт: 20 повідомлень на IP за 10 хвилин (у памʼяті інстанса). */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (arr.length >= 20) return true;
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return false;
}

type InMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const raw: unknown = body?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 40) return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const messages: Anthropic.MessageParam[] = (raw as InMsg[])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  if (!messages.length || messages[0].role !== "user") return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });

  const client = new Anthropic();
  try {
    const stream = client.messages.stream({
      model: "claude-opus-5",
      max_tokens: 1200,
      output_config: { effort: "low" }, // чат на сайті: короткі відповіді, без довгих роздумів
      system: [{ type: "text", text: ASSISTANT_SYSTEM, cache_control: { type: "ephemeral" } }],
      messages,
    });
    const enc = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const ev of stream) {
            if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") controller.enqueue(enc.encode(ev.delta.text));
          }
          const final = await stream.finalMessage();
          if (final.stop_reason === "refusal") controller.enqueue(enc.encode("\n\nНа це запитання я не можу відповісти. Напишіть Тетяні напряму — контакти внизу сторінки."));
        } catch (e) {
          controller.enqueue(enc.encode("\n\n[помилка відповіді — спробуйте ще раз]"));
        } finally { controller.close(); }
      },
    });
    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } });
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return NextResponse.json({ ok: false, error: "busy" }, { status: 429 });
    if (e instanceof Anthropic.AuthenticationError) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
    console.error("[assistant]", e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e);
    return NextResponse.json({ ok: false, error: "api" }, { status: 502 });
  }
}
