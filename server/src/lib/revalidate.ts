import { env } from "../config/env.js";
import { logger } from "./logger.js";

const targets = (env.REVALIDATE_URL || env.FRONTEND_URL)
  .split(",")
  .map((u) => u.trim().replace(/\/+$/, ""))
  .filter(Boolean);

/**
 * Webhook ke Next.js: `POST {REVALIDATE_URL|FRONTEND_URL}/api/revalidate` -> revalidateTag(tag).
 * Dipanggil setelah write di admin agar halaman publik (ISR) langsung segar tanpa
 * menunggu revalidate interval. Tiap instance Next punya cache tag sendiri -> panggil semua.
 * Gagal = hanya log (jangan gagalkan request admin).
 */
export async function revalidateFrontend(tags: string[]) {
  if (!env.REVALIDATE_SECRET) return;
  await Promise.all(
    targets.map(async (base) => {
      try {
        const res = await fetch(`${base}/api/revalidate/`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-revalidate-secret": env.REVALIDATE_SECRET!,
          },
          body: JSON.stringify({ tags }),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) logger.warn({ base, status: res.status, tags }, "revalidate frontend gagal");
      } catch (err) {
        logger.warn({ base, err: (err as Error).message, tags }, "revalidate frontend tidak terjangkau");
      }
    }),
  );
}
