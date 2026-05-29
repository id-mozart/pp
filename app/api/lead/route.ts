import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lead intake endpoint. Accepts contact / consultation / booking submissions.
 * Honeypot field `website_url` silently absorbs bots. Wire an email provider
 * (Resend/SMTP) or CRM here later — for now it validates and acknowledges.
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

  const name = String(data.name ?? data.full_name ?? "").trim();
  const email = String(data.email ?? "").trim();

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // Lightweight observability until a provider is connected.
  console.log("[lead]", {
    type: data.type ?? "Contact",
    name,
    email,
    phone: data.phone ?? null,
    company: data.company ?? null,
    appt: data.appt_date ? `${data.appt_date} ${data.appt_time ?? ""}`.trim() : null,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
