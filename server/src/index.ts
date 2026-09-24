import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const app = createApp();
const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(`Wedison Admin API siap di http://${env.HOST}:${env.PORT} (${env.NODE_ENV})`);
});

async function shutdown(signal: string) {
  logger.info({ signal }, "mematikan server...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
