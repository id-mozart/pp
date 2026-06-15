import { NextResponse } from "next/server";
import { insertMedia } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const MAX = 6 * 1024 * 1024; // 6 MB

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "no_file" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "bad_type" }, { status: 415 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const id = await insertMedia(bytes, file.type);
  if (!id) {
    return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });
  }
  return NextResponse.json({ ok: true, url: `/api/media/${id}` });
}
