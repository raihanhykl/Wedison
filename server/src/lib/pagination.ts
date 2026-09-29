import { z } from "zod";

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().max(200).optional(),
  sort: z.string().max(50).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});
export type PaginationQuery = z.infer<typeof paginationQuery>;

export function paginate<T>(items: T[], total: number, q: { page: number; limit: number }) {
  return {
    items,
    meta: {
      page: q.page,
      limit: q.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / q.limit)),
    },
  };
}

export const skipTake = (q: { page: number; limit: number }) => ({
  skip: (q.page - 1) * q.limit,
  take: q.limit,
});
