import { getMedia } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = (params.id || "").replace(/[^a-f0-9]/gi, "").slice(0, 64);
  const m = await getMedia(id);
  if (!m) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(m.bytes), {
    headers: {
      "Content-Type": m.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
