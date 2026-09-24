import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

// Webhook dari backend Express: setelah admin mengubah konten, backend memanggil endpoint ini
// agar cache ISR halaman publik langsung segar (tanpa menunggu interval revalidate).
// Body: { tags?: string[], paths?: string[] }  Header: x-revalidate-secret
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ ok: false, message: "unauthorized" }, { status: 401 });
  }
  let body: { tags?: string[]; paths?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    /* body kosong = revalidate semua tag konten */
  }
  const tags = body.tags?.length ? body.tags : ["articles", "press", "social", "stations", "categories"];
  for (const t of tags) revalidateTag(t);
  for (const p of body.paths ?? []) revalidatePath(p);
  return NextResponse.json({ ok: true, tags, paths: body.paths ?? [], at: Date.now() });
}
