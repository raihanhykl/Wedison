import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

// Keluar draft mode. `redirect` hanya path internal (cegah open redirect).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("redirect") ?? "/";
  const safe = target.startsWith("/") && !target.startsWith("//") ? target : "/";
  (await draftMode()).disable();
  // Location relatif (lihat /api/preview/teaser): jangan bangun URL absolut dari req.url.
  return new NextResponse(null, { status: 307, headers: { Location: safe, "Cache-Control": "no-store" } });
}
