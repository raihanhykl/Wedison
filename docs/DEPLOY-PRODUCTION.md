# Deploy & Operasional Produksi (wedison.co di VPS)

Runbook produksi setelah migrasi dari Hostinger shared hosting (SSG) ke VPS (SSR + backend).
VPS: `76.13.22.124`, user app `wedison`, butuh root untuk nginx/certbot.
(VPS punya IPv6 `2a02:4780:59:d60f::1`, tetapi per 2026-09-29 tidak bisa dijangkau dari luar → wedison.co **tanpa AAAA**.)

## Branch & environment

| Branch | Deploy ke | Workflow |
|---|---|---|
| `main` | **Produksi** wedison.co → VPS `/home/wedison/wedison-prod` (web :3003 + cadangan :3013, API :4003, DB `wedison_prod`) | `ci-cd.yml` |
| `staging` | Pra-produksi ssr.wedison.tech → VPS `/home/wedison/wedison-landing` (web :3002, API :4002, DB `wedison_admin`) | `deploy-ssr.yml` |
| `legacy-static` | Situs statis LAMA → Hostinger FTP + salinan fallback di VPS `/var/www/wedison-legacy` | `legacy-static.yml`, `legacy-acme.yml` |
| PR ke main/staging | build check | `pr-check.yml` |

Alur rilis: `feature/*` → PR ke `staging` (cek di ssr.wedison.tech) → PR `staging` → `main`.
`ssr-version` sudah pensiun (histori saja). Tag `static-final` = commit terakhir situs lama di `main`.

## Layout produksi di VPS

```
/home/wedison/wedison-prod/
  current -> releases/<sha>        # rilis aktif
  releases/<sha>/web/              # .next/standalone (server.js, public, .next/static)
  releases/<sha>/server/           # backend Express (dist, node_modules), .env -> shared/server.env
  releases.log                     # riwayat deploy/rollback
  ecosystem.prod.config.js         # PM2: wedison-prod-web, wedison-prod-web-b, wedison-prod-api
  bin/                             # deploy-release.sh, rollback.sh, backup-db.sh (dari deploy/prod/bin)
  shared/server.env                # SECRET produksi (mode 600, tidak di-commit)
  shared/uploads/                  # Media Library
  shared/backups/                  # dump DB: harian 02:30 + sebelum tiap migrasi (14 hari)
/var/www/wedison-legacy/           # salinan public_html situs lama
/etc/nginx/sites-available/wedison.co.{app,legacy}   # sites-enabled/wedison.co -> salah satu
/usr/local/sbin/wedison-site       # ganti mode nginx: app | legacy | status
```

nginx mode `app` juga menyajikan file lama yang tidak ada di app (PDF, file verifikasi Google,
chunk `_next` lama) dari `/var/www/wedison-legacy` bila app membalas 404.

## SEO, indeksasi, dan header keamanan (audit 2026-09)

Ringkasan temuan & perbaikan: `docs/SEO-AUDIT-2026-09.md`. Yang perlu diketahui saat operasional:

- **Indeksasi per environment** ditentukan saat build oleh `NEXT_PUBLIC_SITE_URL` (+ override
  `NEXT_PUBLIC_ROBOTS_NOINDEX`): hanya `https://wedison.co` yang indexable. Staging
  (`ssr.wedison.tech`) otomatis mengirim `<meta name="robots" content="noindex, nofollow">`,
  header `X-Robots-Tag`, dan `robots.txt` `Disallow: /`. Jangan pernah mem-build produksi dengan
  `NEXT_PUBLIC_ROBOTS_NOINDEX=true`.
- **Audit crawl staging sementara** (Screaming Frog versi gratis tidak bisa mengabaikan
  robots/nofollow): GitHub → Actions → "Deploy staging -> VPS" → **Run workflow** → branch
  `staging`, `robots_mode = audit`. Hasilnya: `robots.txt` hanya mengizinkan
  "Screaming Frog SEO Spider" (crawler lain tetap `Disallow: /`), tanpa noindex/nofollow.
  **Tutup kembali** dengan Run workflow `robots_mode = noindex`; deploy staging berikutnya
  (push/merge) juga otomatis menutupnya. Cek: `curl -s https://ssr.wedison.tech/robots.txt`.
- **Header keamanan** (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy)
  dikirim oleh aplikasi Next untuk semua respons (`next.config.ts` → `headers()`); Express memakai
  helmet. nginx hanya menambahkan **HSTS** lewat snippet bersama yang harus dipasang sekali (root):
  ```bash
  sudo install -m 644 deploy/nginx/snippets/wedison-security-headers.conf /etc/nginx/snippets/
  sudo cp deploy/nginx/wedison.co.app.conf /etc/nginx/sites-available/wedison.co.app
  sudo cp deploy/nginx/ssr.wedison.tech.conf /etc/nginx/sites-available/ssr.wedison.tech  # sesuaikan blok certbot
  sudo nginx -t && sudo systemctl reload nginx
  ```
  Snippet di-`include` di level server **dan** di `location /_next/static/` (add_header di
  location membatalkan pewarisan header level server — penyebab HSTS hilang di aset statis).
- **Menambah tag pihak ketiga di GTM** (mis. TikTok Pixel): tambahkan origin-nya ke CSP di
  `next.config.ts` (`script-src`/`connect-src`/`img-src`), build, lalu cek console browser di
  staging. Origin yang tidak ada di daftar akan diblokir browser tanpa error di GTM.
- **Pemeriksaan otomatis**: `npm run seo:check -- http://127.0.0.1:3003` (atau
  `https://ssr.wedison.tech --expect-noindex`) memeriksa metadata di `<head>`, satu `<h1>`,
  header keamanan, link internal tanpa redirect, robots/sitemap/llms.txt, JSON-LD, dan 404.
  Skrip yang sama berjalan di `pr-check.yml` untuk setiap PR.
- Setelah cutover: submit `https://wedison.co/sitemap.xml` di Search Console, uji
  `https://wedison.co/id/products/athena/` dengan **URL Inspection → View crawled page** (title,
  canonical, hreflang harus di `<head>`), dan uji Rich Results (Product, FAQ, Breadcrumb,
  Organization, LocalBusiness).

## Deploy

Merge ke `main` → Actions build → rsync ke `releases/<sha>` → `bin/deploy-release.sh`:
`npm ci` + build backend → **backup DB** → `prisma migrate deploy` → pindah symlink `current` →
reload API, web utama, web cadangan bergantian (nginx memakai cadangan saat utama restart,
jadi tanpa downtime) → health check. **Health check gagal = otomatis kembali ke rilis sebelumnya.**

## Rollback (dari yang paling ringan)

1. **App ke rilis sebelumnya** (~20 detik, tanpa build):
   ```bash
   ssh wedison@76.13.22.124 'wedison-prod/bin/rollback.sh'          # rilis sebelumnya
   ssh wedison@76.13.22.124 'wedison-prod/bin/rollback.sh --list'   # daftar rilis
   ssh wedison@76.13.22.124 'wedison-prod/bin/rollback.sh <sha>'
   ```
   Kode di `main` tidak ikut mundur → segera revert commit bermasalah di `main`.
2. **Database** (hanya bila migrasi merusak data): hentikan API, restore dump pra-deploy:
   ```bash
   pm2 stop wedison-prod-api
   URL=$(grep ^DATABASE_URL= ~/wedison-prod/shared/server.env | cut -d= -f2- | sed 's/?.*//')
   gunzip -c ~/wedison-prod/shared/backups/<waktu>-pre-<sha7>.sql.gz > /tmp/restore.sql
   psql "$URL" -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;' && psql "$URL" -f /tmp/restore.sql
   ~/wedison-prod/bin/rollback.sh <sha-sebelum-migrasi>
   ```
3. **Kembali ke situs lama TANPA ubah DNS** (root, instan):
   ```bash
   sudo wedison-site legacy     # nginx menyajikan salinan situs statis lama
   sudo wedison-site app        # kembali ke versi baru
   ```
   Admin/CMS & form booking baru tidak tersedia di mode ini.
4. **Kembali ke Hostinger lewat DNS** (butuh tim DNS; hosting lama masih hidup sampai dipensiunkan):
   A `wedison.co` → `147.93.80.85`, AAAA → `2a02:4780:6:1966:0:2895:3f69:2`.

## Cutover DNS (dikerjakan tim DNS)

Semua sudah siap sebelum DNS pindah: app jalan, sertifikat Let's Encrypt `wedison.co` +
`www.wedison.co` sudah terbit (validasi lewat Hostinger), nginx mode `app` aktif.

Permintaan ke tim DNS (zona `wedison.co`, nameserver Hostinger `ns1/ns2.dns-parking.com`):

| Record | Nilai lama | Nilai baru |
|---|---|---|
| `wedison.co` A | `147.93.80.85` | `76.13.22.124` |
| `wedison.co` AAAA | `2a02:4780:6:1966:0:2895:3f69:2` | **hapus** (IPv6 VPS belum bisa diakses dari luar) |
| `www.wedison.co` CNAME | `wedison.co.` | tetap |
| MX / TXT / subdomain lain | — | **jangan diubah** |

Opsional: turunkan TTL A/AAAA ke 300 detik ~1 jam sebelumnya agar perpindahan & rollback cepat.

Otomatis setelah DNS pindah: cron `/etc/cron.d/wedison-cert-cutover` (tiap 15 menit) mendeteksi
domain sudah dilayani VPS (IPv4 & IPv6), menerbitkan ulang sertifikat via webroot agar renew
otomatis, lalu menghapus dirinya. Log: `/var/log/wedison-cert-cutover.log`.

Cek pasca-cutover:
```bash
dig +short A wedison.co @1.1.1.1; dig +short AAAA wedison.co @1.1.1.1   # A = 76.13.22.124, AAAA kosong
curl -sI https://wedison.co/id/ | head -3         # server: nginx
sudo certbot certificates --cert-name wedison.co   # setelah cron: authenticator webroot
```
Lalu: submit ulang `https://wedison.co/sitemap.xml` di Google Search Console, pantau 404/coverage.

## Setelah stabil (± 2 minggu)

- **Sebelum** mematikan hosting Hostinger, pindahkan/putuskan subdomain yang masih dilayani di sana
  (`147.93.80.85`): minimal `promo-awal-tahun.wedison.co` (microsite kampanye, aktif) dan
  `staging.wedison.co` (situs staging lama). Minta daftar lengkap record zona ke tim DNS.
- Pensiunkan hosting Hostinger; hapus secret `HOSTINGER_*` dan branch/workflow `legacy-static`
  (salinan `/var/www/wedison-legacy` tetap sebagai arsip fallback).
- Naikkan kembali TTL DNS.

## Operasional

```bash
ssh wedison@76.13.22.124
pm2 ls | grep wedison-prod
pm2 logs wedison-prod-web --lines 100
pm2 logs wedison-prod-api --lines 100
tail -f ~/wedison-prod/releases.log
ls -lh ~/wedison-prod/shared/backups/
```
Ubah secret produksi: edit `~/wedison-prod/shared/server.env` lalu
`cd ~/wedison-prod && pm2 startOrReload ecosystem.prod.config.js --update-env`.
