/**
 * "Who" auditing for every admin-managed model.
 *
 * - A per-request AsyncLocalStorage store holds the signed-in user's id (set by requireAuth).
 * - A Prisma client extension stamps `createdById` / `updatedById` on writes to AUDITED_MODELS
 *   when a user is in context. Explicit values in `data` always win. No user in context
 *   (public site, scheduler, seeds, tests) means nothing is stamped.
 * - `asSystem()` runs work without a user, for automatic jobs triggered inside an admin
 *   request (auto-publish, auto-close) so they are not attributed to whoever opened the page.
 * - `attachAuditUsers` resolves those ids to `{ id, name, email, avatarUrl, deleted }` on admin
 *   JSON responses (createdBy / updatedBy / deletedBy), in one query per response.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client.js";

type Store = { userId: string | null };
const als = new AsyncLocalStorage<Store>();

/** Models that carry createdById / updatedById (Prisma model names). Job stamps its own (relation). */
export const AUDITED_MODELS = new Set([
  "Role", "User", "Category", "Tag", "Article", "PressCoverage", "SocialPost", "Media", "Station",
  "PriceRegion", "PricingScheme", "PriceEntry", "PricingTerms", "Booking", "ContactSubmission",
  "JobDepartment", "JobLocation", "Showroom", "ShowroomTeaser", "Setting",
]);

export function currentAuditUser(): string | null {
  return als.getStore()?.userId ?? null;
}

/** Express middleware: give each request its own (initially anonymous) audit store. */
export function auditContext(_req: Request, _res: Response, next: NextFunction) {
  als.run({ userId: null }, () => next());
}

/**
 * Record the signed-in user for the rest of the request. Uses enterWith as well as mutating the
 * request store so it survives middleware (e.g. multer/busboy) that resumes on another async path.
 */
export function setAuditUser(userId: string) {
  const s = als.getStore();
  if (s) s.userId = userId;
  else als.enterWith({ userId });
}

/** Re-enter the request's audit context (use after stream-parsing middleware such as multer). */
export function keepAuditUser(req: Request, _res: Response, next: NextFunction) {
  const id = req.user?.id ?? null;
  if (!id || currentAuditUser() === id) return next();
  als.run({ userId: id }, () => next());
}

/**
 * Run `fn` with no user in context (automatic/system work). Awaited inside the context because
 * Prisma queries are lazy: a query returned un-awaited would otherwise run in the caller's context.
 */
export function asSystem<T>(fn: () => PromiseLike<T>): Promise<T> {
  return als.run({ userId: null }, async () => await fn());
}

type Data = Record<string, unknown>;
const stampCreate = (uid: string, d: unknown): unknown =>
  d && typeof d === "object" && !Array.isArray(d) ? { createdById: uid, updatedById: uid, ...(d as Data) } : d;
const stampUpdate = (uid: string, d: unknown): unknown =>
  d && typeof d === "object" && !Array.isArray(d) && !("updatedById" in (d as Data)) ? { ...(d as Data), updatedById: uid } : d;

export const auditExtension = Prisma.defineExtension({
  name: "audit-who",
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const uid = currentAuditUser();
        if (!uid || !model || !AUDITED_MODELS.has(model)) return query(args);
        const a = args as Data;
        switch (operation) {
          case "create":
            a.data = stampCreate(uid, a.data);
            break;
          case "createMany":
          case "createManyAndReturn":
            a.data = Array.isArray(a.data) ? a.data.map((d) => stampCreate(uid, d)) : stampCreate(uid, a.data);
            break;
          case "update":
          case "updateMany":
          case "updateManyAndReturn":
            a.data = stampUpdate(uid, a.data);
            break;
          case "upsert":
            a.create = stampCreate(uid, a.create);
            a.update = stampUpdate(uid, a.update);
            break;
        }
        return query(a as typeof args);
      },
    },
  },
});

// ── Response enrichment ────────────────────────────────────────────────────────

const ID_KEYS = [["createdById", "createdBy"], ["updatedById", "updatedBy"], ["deletedById", "deletedBy"]] as const;
const MAX_NODES = 20_000;
export type AuditUser = { id: string; name: string; email: string; avatarUrl: string | null; deleted: boolean };

function walk(node: unknown, visit: (o: Data) => void, budget = { n: 0 }, depth = 0) {
  if (!node || typeof node !== "object" || depth > 6 || budget.n++ > MAX_NODES) return;
  if (Array.isArray(node)) {
    for (const x of node) walk(x, visit, budget, depth + 1);
    return;
  }
  if (Object.getPrototypeOf(node) !== Object.prototype) return; // Date, Buffer, Decimal …
  visit(node as Data);
  for (const v of Object.values(node as Data)) if (v && typeof v === "object") walk(v, visit, budget, depth + 1);
}

/**
 * Wrap res.json on admin routes: every plain object with createdById / updatedById / deletedById
 * gets createdBy / updatedBy / deletedBy (unless it already has one). Never blocks the response
 * on failure.
 */
export function attachAuditUsers(lookup: (ids: string[]) => Promise<AuditUser[]>) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const original = res.json.bind(res);
    res.json = ((body: unknown) => {
      const ids = new Set<string>();
      walk(body, (o) => {
        for (const [k, rel] of ID_KEYS) if (typeof o[k] === "string" && !(rel in o)) ids.add(o[k] as string);
      });
      if (!ids.size) return original(body);
      lookup([...ids])
        .then((users) => {
          const map = new Map(users.map((u) => [u.id, u]));
          walk(body, (o) => {
            for (const [k, rel] of ID_KEYS) {
              if (rel in o) continue;
              if (typeof o[k] === "string") o[rel] = map.get(o[k] as string) ?? null;
              else if (k in o && o[k] === null) o[rel] = null;
            }
          });
        })
        .catch(() => undefined)
        .finally(() => original(body));
      return res;
    }) as Response["json"];
    next();
  };
}

/** Run `fn` as if `userId` were signed in (scripts, seeds, tests). */
export function runAsUser<T>(userId: string, fn: () => PromiseLike<T>): Promise<T> {
  return als.run({ userId }, async () => await fn());
}
