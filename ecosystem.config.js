// PM2 untuk wedison-landing (SSR). Mengikuti konvensi rto-apps:
// jalankan Next via `next start` (fork mode). PORT 3002 karena 3000/3001/3100
// sudah dipakai app lain di VPS. cwd = __dirname agar portabel (path repo).
module.exports = {
  apps: [
    {
      name: "wedison-landing",
      cwd: __dirname,
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
      },
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
