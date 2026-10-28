import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin/server";
import { canAccess } from "@/lib/admin/permissions";

// Location relatif: di balik nginx req.url berisi host internal (localhost:3002), jadi URL absolut
// dari req.url akan bocor ke pengunjung.
const go = (path: string) => new NextResponse(null, { status: 307, headers: { Location: path, "Cache-Control": "no-store" } });

// Masuk draft mode untuk melihat teaser (draf/arsip) persis seperti di situs publik.
// Hanya untuk pengguna admin yang punya akses modul Showroom Teasers.
// GET /api/preview/teaser/?slug=surabaya&locale=id
export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") ?? "";
  const locale = url.searchParams.get("locale") === "en" ? "en" : "id";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return NextResponse.json({ ok: false, message: "invalid slug" }, { status: 400 });

  const user = await getSessionUser();
  if (!user) return go(`/admin/login/?next=${encodeURIComponent("/admin/teasers")}`);
  if (!canAccess(user, "teasers")) return NextResponse.json({ ok: false, message: "forbidden" }, { status: 403 });

  (await draftMode()).enable();
  return go(`/${locale}/showroom/${slug}/`);
}
