import { NextResponse } from "next/server";
import { deleteCertificate, listCertificates, saveCertificate } from "@/lib/db";
import { sanitizeCert } from "@/lib/certs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await listCertificates();
  return NextResponse.json({ ok: true, items: rows.map((r) => ({ ...sanitizeCert(r.data), id: r.id, number: r.number ?? "", updated_at: r.updated_at })) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  const cert = sanitizeCert(body);
  if (!cert.name || !cert.program) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  const id = await saveCertificate({ id: cert.id, number: cert.number, data: { ...cert, id: undefined } });
  if (!id) return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") || "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ ok: false, error: "bad_id" }, { status: 400 });
  const ok = await deleteCertificate(id);
  return NextResponse.json({ ok });
}
