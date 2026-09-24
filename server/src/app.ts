import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { pinoHttp } from "pino-http";
import { env, isProd } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { api } from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  // Di VPS berada di belakang nginx -> percaya X-Forwarded-* (IP asli untuk rate limit/log)
  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: [env.FRONTEND_URL, ...(isProd ? [] : ["http://localhost:3000", "http://127.0.0.1:3000"])],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignore: (req) => req.url?.startsWith("/api/uploads") ?? false },
      serializers: { req: (r) => ({ method: r.method, url: r.url }), res: (r) => ({ status: r.statusCode }) },
    }),
  );

  app.get("/api/health", (_req, res) => res.json({ ok: true, uptime: process.uptime(), ts: Date.now() }));

  // File upload (media library, thumbnail sosial). Cache lama: nama file unik per upload.
  app.use(
    env.UPLOAD_PUBLIC_PATH,
    express.static(path.resolve(env.UPLOAD_DIR), {
      maxAge: "30d",
      immutable: true,
      index: false,
      dotfiles: "deny",
    }),
  );

  app.use("/api/v1", api);

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
