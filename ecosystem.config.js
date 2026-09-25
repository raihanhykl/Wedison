// PM2 untuk wedison-landing (Next.js SSR) + wedison-api (backend Express admin/CMS).
//
// wedison-landing: next.config pakai output:"standalone" -> WAJIB jalankan server mandiri
// (.next/standalone/server.js), BUKAN `next start`. Aset static+public disalin ke folder
// standalone oleh script `postbuild`. PORT 3002 karena 3000/3001/3100 dipakai app lain.
//
// wedison-api: server/dist/src/index.js. PORT & secret dibaca dari server/.env (VPS: 4002).
// server/.env dibuat manual di VPS dan TIDAK di-commit; REVALIDATE_SECRET untuk Next juga
// diambil dari file itu di sini supaya secret tidak pernah masuk ke repo.
//
// HOSTNAME/HOST 127.0.0.1 -> bind localhost saja (diakses via nginx). cwd=__dirname portabel.
// Pakai: pm2 startOrReload ecosystem.config.js --update-env && pm2 save
const fs = require("fs");
const path = require("path");

function readEnv(file) {
  const out = {};
  try {
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch {
    /* server/.env belum ada (mis. dev lokal) -> pakai default */
  }
  return out;
}

const apiEnv = readEnv(path.join(__dirname, "server", ".env"));
const API_PORT = apiEnv.PORT || "4002";

module.exports = {
  apps: [
    {
      name: "wedison-landing",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        HOSTNAME: "127.0.0.1",
        // Next memanggil backend server-side (SSR/ISR) lewat localhost.
        API_INTERNAL_URL: `http://127.0.0.1:${API_PORT}`,
        // Harus sama dengan server/.env (webhook revalidate) -> dibaca dari sana.
        REVALIDATE_SECRET: apiEnv.REVALIDATE_SECRET || "",
        CMS_REVALIDATE_SECONDS: 300,
      },
      restart_delay: 5000,
      max_restarts: 10,
    },
    {
      name: "wedison-api",
      cwd: path.join(__dirname, "server"),
      script: "dist/src/index.js",
      // DATABASE_URL, JWT_SECRET, dst. dimuat dari server/.env oleh dotenv (cwd = server/).
      env: {
        NODE_ENV: "production",
      },
      restart_delay: 5000,
      max_restarts: 10,
      max_memory_restart: "400M",
    },
  ],
};
