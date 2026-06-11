import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOURS = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/* Naive in-memory rate limit (per instance): 5 requests / 10 min per IP. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 5;
}

/**
 * Lead intake endpoint. Accepts contact / consultation / booking submissions.
 * Honeypot field `website_url` silently absorbs bots.
 * Delivery: Telegram Bot API when TG_BOT_TOKEN + TG_CHAT_ID are set
 * (Railway envs); falls back to console logging until then.
 */
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot — pretend success so bots don't retry.
  if (typeof data.website_url === "string" && data.website_url.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const name = clip(data.name ?? data.full_name, 200);
  const email = clip(data.email, 200);
  const phone = clip(data.phone, 100);
  const company = clip(data.company, 200);
  const message = clip(data.message ?? data.description, 2000);
  const topic = clip(data.topic, 200);
  const type = clip(data.type, 50) || "Contact";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // Booking slots must be in the future and on the published grid.
  let appt: string | null = null;
  if (data.appt_date) {
    const d = clip(data.appt_date, 10);
    const t = clip(data.appt_time, 5);
    const today = new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || d < today || !HOURS.includes(t)) {
      return NextResponse.json({ ok: false, error: "bad_slot" }, { status: 422 });
    }
    appt = `${d} ${t}`;
  }

  const lines = [
    `🟡 Нова заявка · ${type}`,
    `Імʼя: ${name}`,
    `Email: ${email}`,
    phone && `Телефон: ${phone}`,
    company && `Компанія: ${company}`,
    appt && `Слот: ${appt}`,
    topic && `Тема: ${topic}`,
    message && `Повідомлення: ${message}`,
  ].filter(Boolean);
  const text = lines.join("\n");

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      if (!res.ok) throw new Error(`tg ${res.status}`);
    } catch (e) {
      console.error("[lead] delivery failed", e, text);
      // Front-end shows the error branch with the messenger fallback.
      return NextResponse.json({ ok: false, error: "delivery" }, { status: 502 });
    }
  } else {
    // No provider wired yet — keep observability so leads aren't silent.
    console.log("[lead]", { type, name, email, phone, company, appt, topic, message, at: new Date().toISOString() });
  }

  return NextResponse.json({ ok: true });
}
