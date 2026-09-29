// PM2 untuk PRODUKSI (wedison.co) di VPS. Terpisah dari ecosystem.config.js (staging/testing
// di ssr.wedison.tech, port 3002/4002) supaya nama proses, port, env, dan DB tidak bercampur.
//
// Layout di VPS (lihat docs/DEPLOY-PRODUCTION.md):
//   /home/wedison/wedison-prod/
//     current -> releases/<sha>      # symlink rilis aktif (rollback = pindah symlink + reload)
//     releases/<sha>/web/            # isi .next/standalone (server.js + public + .next/static)
//     releases/<sha>/server/         # backend Express (dist + node_modules), .env -> shared
//     shared/server.env              # secret prod (dibuat manual, mode 600, tidak di-commit)
//     shared/uploads/                # Media Library (persisten lintas rilis)
//
// Web jalan 2 instance: utama :3003 + cadangan :3013. nginx memakai cadangan HANYA saat utama
// mati (upstream `backup`), jadi deploy me-reload bergantian = tanpa downtime, sementara traffic
// normal tetap ke satu proses (cache tag ISR tidak terpecah). Webhook revalidate memanggil
// keduanya (REVALIDATE_URL di shared/server.env).
//
// Pakai: pm2 startOrReload ecosystem.prod.config.js --update-env && pm2 save
const fs = require("fs");
const path = require("path");

const ROOT = process.env.WEDISON_PROD_ROOT || "/home/wedison/wedison-prod";

function readEnv(file) {
  const out = {};
  try {
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch {
    /* shared/server.env belum ada -> pakai default */
  }
  return out;
}

const apiEnv = readEnv(path.join(ROOT, "shared", "server.env"));
const API_PORT = apiEnv.PORT || "4003";

function web(name, port) {
  return {
    name,
    cwd: path.join(ROOT, "current", "web"),
    script: "server.js",
    env: {
      NODE_ENV: "production",
      PORT: port,
      HOSTNAME: "127.0.0.1",
      API_INTERNAL_URL: `http://127.0.0.1:${API_PORT}`,
      REVALIDATE_SECRET: apiEnv.REVALIDATE_SECRET || "",
      CMS_REVALIDATE_SECONDS: 300,
    },
    restart_delay: 3000,
    max_restarts: 10,
    max_memory_restart: "700M",
  };
}

module.exports = {
  apps: [
    web("wedison-prod-web", 3003),
    web("wedison-prod-web-b", 3013),
    {
      name: "wedison-prod-api",
      cwd: path.join(ROOT, "current", "server"),
      script: "dist/src/index.js",
      // DATABASE_URL, JWT_SECRET, dst. dimuat dotenv dari server/.env (symlink ke shared/server.env).
      env: {
        NODE_ENV: "production",
      },
      restart_delay: 3000,
      max_restarts: 10,
      max_memory_restart: "400M",
    },
  ],
};
