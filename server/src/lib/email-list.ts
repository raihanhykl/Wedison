import { z } from "zod";

/** Max recipients per list (To or CC). Mail clients and mailto URLs get unreliable beyond this. */
export const MAX_EMAILS = 10;

const one = z.string().trim().toLowerCase().email("Invalid email address").max(254);

/**
 * A list of email addresses: trimmed, lower-cased, de-duplicated (order kept). Also accepts a
 * legacy single string or a comma/semicolon separated string so old payloads keep working.
 */
export function emailList(opts: { min?: number; label: string }) {
  return z
    .preprocess((v) => {
      if (v == null || v === "") return [];
      if (typeof v === "string") return v.split(/[\s,;]+/).filter(Boolean);
      return v;
    }, z.array(one).max(MAX_EMAILS, `${opts.label}: at most ${MAX_EMAILS} addresses`))
    .transform((list) => [...new Set(list)])
    .refine((list) => list.length >= (opts.min ?? 0), { message: `${opts.label}: add at least ${opts.min} address${(opts.min ?? 0) > 1 ? "es" : ""}` });
}

/** Addresses that appear in both lists (an address should be either To or CC, not both). */
export function overlap(to: readonly string[], cc: readonly string[]) {
  const set = new Set(to);
  return cc.filter((e) => set.has(e));
}
