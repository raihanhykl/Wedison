import "server-only";
import { cookies } from "next/headers";
import type { AuthUser } from "./types";

const API = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:4000";
const COOKIE = process.env.ADMIN_COOKIE_NAME ?? "wd_admin_token";

/** Verifikasi sesi admin di server (layout). null = belum login / token tidak valid. */
export async function getSessionUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API}/api/v1/auth/me`, {
      headers: { cookie: `${COOKIE}=${token}`, accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok: boolean; data: AuthUser };
    return json.ok ? json.data : null;
  } catch {
    return null;
  }
}
