import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny, z } from "zod";
import { badRequest } from "../lib/errors.js";

type Source = "body" | "query" | "params";

/**
 * Validasi + parse dengan zod. Hasil parse ditaruh di `req.validated[source]`
 * (Express 5: req.query read-only, jadi tidak ditimpa).
 */
export function validate<T extends ZodTypeAny>(schema: T, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      }));
      return next(badRequest("Validation failed", details));
    }
    (req as Request & { validated: Record<Source, unknown> }).validated ??= {
      body: undefined,
      query: undefined,
      params: undefined,
    };
    (req as Request & { validated: Record<Source, unknown> }).validated[source] = result.data;
    next();
  };
}

export function getValidated<T extends ZodTypeAny>(req: Request, source: Source = "body") {
  return (req as Request & { validated?: Record<Source, unknown> }).validated?.[source] as z.infer<T>;
}
