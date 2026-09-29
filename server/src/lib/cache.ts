import { LRUCache } from "lru-cache";
import { env } from "../config/env.js";
import { logger } from "./logger.js";
import { revalidateFrontend } from "./revalidate.js";

/**
 * Cache in-memory berbasis tag.
 * - `cached(key, tags, fn, ttl)` -> hasil fn disimpan, dipakai ulang sampai TTL/invalidasi.
 * - `invalidate(tags)` -> buang semua entri dengan tag tsb + minta Next.js revalidate ISR.
 * Cukup untuk 1 instance VPS. Kalau nanti multi-instance, ganti store ini dengan Redis
 * tanpa mengubah pemanggil (API tetap sama).
 */
type Entry = { value: unknown; tags: string[] };

const store = new LRUCache<string, Entry>({
  max: 2000,
  ttl: env.CACHE_TTL_PUBLIC * 1000,
});

const tagIndex = new Map<string, Set<string>>();

export const CacheTags = {
  articles: "articles",
  categories: "categories",
  tags: "tags",
  press: "press",
  social: "social",
  media: "media",
  stations: "stations",
  dashboard: "dashboard",
} as const;
export type CacheTag = (typeof CacheTags)[keyof typeof CacheTags];

function index(key: string, tags: string[]) {
  for (const t of tags) {
    if (!tagIndex.has(t)) tagIndex.set(t, new Set());
    tagIndex.get(t)!.add(key);
  }
}

export async function cached<T>(
  key: string,
  tags: CacheTag[],
  fn: () => Promise<T>,
  ttlSeconds?: number,
): Promise<T> {
  const hit = store.get(key);
  if (hit) return hit.value as T;
  const value = await fn();
  store.set(key, { value, tags }, ttlSeconds ? { ttl: ttlSeconds * 1000 } : undefined);
  index(key, tags);
  return value;
}

export function invalidate(tags: CacheTag[], opts: { notifyFrontend?: boolean } = {}) {
  let n = 0;
  for (const t of tags) {
    const keys = tagIndex.get(t);
    if (!keys) continue;
    for (const k of keys) {
      store.delete(k);
      n++;
    }
    tagIndex.delete(t);
  }
  logger.debug({ tags, entries: n }, "cache invalidated");
  if (opts.notifyFrontend !== false) void revalidateFrontend(tags);
}

export function cacheStats() {
  return { size: store.size, tags: [...tagIndex.keys()] };
}
