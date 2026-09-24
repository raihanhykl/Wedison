import { env } from "../config/env.js";
import { logger } from "./logger.js";

/**
 * Webhook ke Next.js: `POST {FRONTEND_URL}/api/revalidate` -> revalidateTag(tag).
 * Dipanggil setelah write di admin agar halaman publik (ISR) langsung segar tanpa
 * menunggu revalidate interval. Gagal = hanya log (jangan gagalkan request admin).
 */
export async function revalidateFrontend(tags: string[]) {
  if (!env.REVALIDATE_SECRET) return;
  try {
    const res = await fetch(`${env.FRONTEND_URL}/api/revalidate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": env.REVALIDATE_SECRET,
      },
      body: JSON.stringify({ tags }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) logger.warn({ status: res.status, tags }, "revalidate frontend gagal");
  } catch (err) {
    logger.warn({ err: (err as Error).message, tags }, "revalidate frontend tidak terjangkau");
  }
}
