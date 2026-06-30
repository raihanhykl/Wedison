// PM2 untuk wedison-landing (SSR).
// next.config pakai output:"standalone" -> WAJIB jalankan server mandiri
// (.next/standalone/server.js), BUKAN `next start`. Aset static+public disalin
// ke folder standalone oleh script `postbuild`.
// PORT 3002 karena 3000/3001/3100 sudah dipakai app lain di VPS.
// HOSTNAME 127.0.0.1 -> bind localhost saja (diakses via nginx). cwd=__dirname portabel.
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
      },
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
