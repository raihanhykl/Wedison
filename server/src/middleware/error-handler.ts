import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib/errors.js";
import { logger } from "../lib/logger.js";
import { isProd } from "../config/env.js";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ ok: false, code: "NOT_FOUND", message: "Endpoint not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res
      .status(err.status)
      .json({ ok: false, code: err.code, message: err.message, details: err.details });
  }
  const e = err as { code?: string; message?: string; meta?: unknown; name?: string };
  // Prisma: unique constraint
  if (e?.code === "P2002") {
    return res.status(409).json({
      ok: false,
      code: "CONFLICT",
      message: "A record with the same unique value already exists",
      details: e.meta,
    });
  }
  if (e?.code === "P2025") {
    return res.status(404).json({ ok: false, code: "NOT_FOUND", message: "Not found" });
  }
  if (e?.name === "MulterError") {
    return res.status(400).json({ ok: false, code: "UPLOAD_ERROR", message: e.message });
  }
  logger.error({ err, url: req.originalUrl }, "unhandled error");
  res.status(500).json({
    ok: false,
    code: "INTERNAL",
    message: isProd ? "Internal server error" : (e?.message ?? "Internal error"),
  });
}
