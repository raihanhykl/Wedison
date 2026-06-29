# Rencana Migrasi: SSG → SSR + Multi-Locale Routing (/id, /en) + VPS

> Status: **DRAFT / planning** — dibuat 2026-06-29. Belum ada kode yang diubah.
> Target: Next.js 15 App Router, pindah dari static export (FTP ke shared hosting) ke
> SSR (Node) di VPS sendiri, dengan routing `/id` & `/en`, dan pintu terbuka untuk
> full-stack (backend + DB, order, admin) di masa depan.

---

## 1. Ringkasan kelayakan

**Do-able: ya.** **Rombak: sedang–besar, tapi terkendali dan bertahap.**

Kabar baiknya dari investigasi kode: **menghapus `output:"export"` nyaris tanpa blocker di level komponen** — semua 36 pemakaian `window`/`localStorage`/`document`/`navigator` sudah berada di dalam `useEffect`/event handler pada komponen `"use client"`, jadi sudah aman untuk SSR. `next/image` semua sumbernya lokal atau host yang sudah di-whitelist. Jadi "menyalakan SSR" itu bagian termudah.

Pekerjaan beratnya ada di 4 hal:
1. **Restrukturisasi `[locale]`** — pindahkan seluruh route ke `src/app/[locale]/`.
2. **i18n dari localStorage → URL** — sumber bahasa jadi URL, bukan `localStorage`.
3. **Infra VPS** — PM2 + nginx + TLS + env + CI/CD baru (bukan FTP lagi).
4. **Cutover SEO + DNS** — 301 dari URL lama, repoint DNS, decommission shared hosting.

Yang **TIDAK** perlu dirombak: 24 file pemakai `useLanguage()` tetap dipakai apa adanya (API `useLanguage()`/`t()` dipertahankan), dan `translations.tsx` tetap client-only (tidak perlu dipecah di fase awal).

---

## 2. Temuan kunci dari kode (fakta, bukan asumsi)

| # | Temuan | Implikasi |
|---|--------|-----------|
| 1 | `next.config.ts`: `output:"export"` + `trailingSlash:true` + `images.unoptimized:true` | `export` & `standalone` mutually exclusive. Selama `export` ada → tidak ada `server.js`. |
| 2 | Deploy = FTP `out/` ke Hostinger shared hosting (`ci-cd.yml`, `staging.yml`) | SSR tidak punya `out/`. **Kedua workflow FTP harus ditulis ulang.** |
| 3 | i18n 100% client-side: `language-context.tsx` (`useState("id")` + localStorage), 24 consumer via `useLanguage()` | API `t()`/`useLanguage()` bisa dipertahankan → churn minimal di 24 file. |
| 4 | `translations.tsx` ~170KB / 2942 baris, **import `next/link` + AlertDialog, embed JSX di ~24 value** | **Harus tetap client-only.** `t()` sebenarnya return `ReactNode`, bukan `string` (ada cast `as unknown as ...` yang menyembunyikan ini). Metadata SEO TIDAK boleh ambil string dari sini. |
| 5 | 14 route `page.tsx` + 1 dynamic `media-center/news/[slug]` (`generateStaticParams` + `dynamicParams=false`) | Semua pindah ke `[locale]/`. `[slug]` generateStaticParams jadi **cross-product locale × slug**. |
| 6 | Banyak import relatif `../lib/...` (13 file) + `[slug]` page pakai `../../../../../public/...` (5 level) | Pindah folder = import relatif patah 1 segmen. **Ganti ke alias `@/app/lib` DULU** sebelum pindah. |
| 7 | `navbar.tsx`, `footer.tsx`, dll. hardcode `href="/bees/"` dsb; `whitePage` pakai `route === "/corporate/about/"` (exact match) | Semua href harus di-prefix locale; perbandingan exact-match **diam-diam rusak** dengan prefix `/id`. |
| 8 | `seo1.ts` punya scaffolding `alternates.languages` tapi **dead code + buggy** (`url.replace("/id","")` padahal url tak pernah ada `/id`, tak ada `x-default`) | Tulis ulang `getSEOMetadata(locale, path)`. |
| 9 | `sharp` ada di **devDependencies** | Jika image optimization dinyalakan, `npm ci --omit=dev` di VPS tidak install sharp → runtime error. Pindah ke `dependencies`. |
| 10 | `NEXT_PUBLIC_*` (EmailJS, reCAPTCHA) di-inline saat **build** | Harus ada saat build di CI/VPS, BUKAN runtime. Secret server (DB/auth nanti) butuh mekanisme non-public di env VPS. |
| 11 | `fetchPreview.ts` scraping situs pihak ketiga (timeout 15s + try/catch sudah ada), `cache:"force-cache"` | Pertahankan build-time (aman). Jika jadi request-time, upstream lambat = response lambat. |

---

## 3. Strategi branch (sesuai permintaan Anda)

```
main ──────────────────────────────────────────────► (deploy prod di VPS, paling akhir)
  └─ staging ───────────────────────────────────────► (validasi pra-prod)
       └─ ssr-version  ◄── INTEGRATION BRANCH ────────► deploy ke ssr.wedison.co (VPS :3001) untuk testing
            ├─ feat/ssr-enable          (Fase 1)
            ├─ refactor/alias-imports   (Fase 2)
            ├─ feat/locale-routing      (Fase 3)
            ├─ feat/i18n-seo            (Fase 4)
            └─ chore/vps-deploy         (Fase 5)
```

- Buat `ssr-version` dari `main` (branch integrasi).
- Tiap fase = 1 feature branch → PR/merge ke `ssr-version`.
- `ssr-version` auto-deploy ke **ssr.wedison.co** (instance VPS terpisah :3001). Ini tempat Anda testing.
- Setelah stabil: `ssr-version` → `staging` → `main`. Baru deploy `main` ke prod VPS (:3000) & repoint DNS.
- Shared hosting Hostinger di-take down **setelah** DNS propagasi penuh & prod VPS terbukti jalan.

Mapping environment di SATU VPS:
| Branch | PM2 app | Port | Domain | nginx block |
|--------|---------|------|--------|-------------|
| `ssr-version` | `wedison-ssr` | 3001 | ssr.wedison.co | block A |
| `staging` (opsional) | `wedison-staging` | 3002 | staging.wedison.co | block B |
| `main` | `wedison-prod` | 3000 | wedison.co | block C |

---

## 4. Roadmap berfase

### Fase 0 — Setup branch & baseline
- Buat `ssr-version` dari `main`. Belum ada perubahan kode.
- Catat baseline: `npm run build` saat ini hijau, daftar route, screenshot tampilan untuk perbandingan visual nanti.

---

### Fase 1 — Aktifkan SSR (lokal) · branch `feat/ssr-enable` · effort: LOW
**Tujuan:** app jalan via Node server lokal, semua route 200.

Langkah:
1. `next.config.ts`: hapus `output:"export"`, tambah `output:"standalone"`, **pertahankan `trailingSlash:true`**.
2. Image: **[KEPUTUSAN: tunda]** — biarkan `images.unoptimized:true` dulu supaya deploy pertama tidak bergantung sharp. Aktifkan optimization di fase terpisah setelah VPS stabil. (`sharp` tetap dipindah ke `dependencies` sekarang agar siap pakai nanti.)
3. `package.json`: pindah `sharp` ke `dependencies`; tambah `engines.node: ">=20"`.
4. Smoke test lokal: `next build` lalu `node .next/standalone/server.js` (ingat: copy manual `public/` + `.next/static` ke `.next/standalone/` saat test). Cek semua route, form kontak, dan `/media-center/news/[slug]`.

**Verifikasi sebelum merge:** semua route 200 di `next start`; form kontak kirim; news route render.

> ⚠️ Trap #1: `export` + `standalone` mutually exclusive — kalau `export` masih ada, build diam-diam tetap bikin `out/` dan SSR jadi no-op.
> ⚠️ Trap #2: `standalone` TIDAK auto-copy `public/` & `.next/static` → wajib di-rsync bareng saat deploy, kalau tidak halaman tanpa CSS & aset 404.

---

### Fase 2 — Hardening import (pra-pindah) · branch `refactor/alias-imports` · effort: LOW
**Tujuan:** bikin pemindahan folder ke `[locale]` jadi tahan-kedalaman (depth-independent). Pure refactor, zero perubahan perilaku.

Langkah:
1. Ganti semua import relatif `../lib/...` → alias `@/app/lib/...` (13 file route/client).
2. Ganti `[slug]` page `../../../../../public/data/press-urls` → alias / modul data level-src.

**Verifikasi:** build hijau, tidak ada perubahan tampilan. Aman di-merge sendiri.

> Ini meng-mitigasi risiko terbesar dari Fase 3 (import patah saat pindah folder).

---

### Fase 3 — `[locale]` routing + i18n URL-binding · branch `feat/locale-routing` · effort: HIGH
**Tujuan:** `/id` & `/en` jadi URL fisik, bahasa bersumber dari URL. **Ini fase terbesar.**

> Catatan dependency: routing & i18n-binding **harus bareng**. Kalau routing duluan tanpa i18n-binding, `/en` akan menyajikan konten Indonesia (default localStorage `"id"`) — regresi senyap.

Langkah:
1. **Pindah route:** `git mv` 14 folder route + `page.tsx` + `[slug]` ke `src/app/[locale]/`. **Biarkan** `_home`, `_product`, `lib`, `types`, dan `src/components` di luar `[locale]` (shared, tidak dilokalisasi).
2. **Split layout:**
   - `src/app/layout.tsx` → shell tipis: `<html>`/`<body>` + fonts + globals + Toaster (locale-agnostic).
   - `src/app/[locale]/layout.tsx` (BARU): `await params`, validasi `locale ∈ ['id','en']` (else `notFound()`), set `<html lang={locale}>`, render `LanguageProvider(locale)` + Navbar + Footer, `generateStaticParams` → `[{locale:'id'},{locale:'en'}]`.
3. **Refactor `language-context.tsx`:** terima prop `locale`, `useState(locale)`, **hapus** useEffect baca localStorage sebagai sumber kebenaran (sisakan hanya sebagai cookie/hint), pertahankan API `useLanguage()`/`t()` identik. **Perbaiki tipe `t()` → `React.ReactNode`** dan buang cast `as unknown as Record<string,string>`.
4. **Nested params:** `[locale]/media-center/news/[slug]` → `generateStaticParams` return **cross-product** `locale × slug`; tipe params `{locale, slug}`; `dynamicParams=false` tetap.
5. **`middleware.ts` (BARU):** **[KEPUTUSAN: deteksi Accept-Language/geo]** redirect `/` & path tanpa-locale ke locale hasil deteksi (urutan: **cookie pilihan eksplisit user → `Accept-Language` header → fallback `id`**). Pasang cookie (mis. `NEXT_LOCALE`) saat user menekan toggle, supaya deteksi hanya jalan di kunjungan pertama dan pilihan manual selalu menang. Matcher exclude `/_next`, `/api`, aset, file ber-ekstensi.
   - ⚠️ **Nuansa "geo":** di VPS bare-metal **tanpa CDN**, `request.geo` Next TIDAK terisi. Deteksi realistis = **`Accept-Language` header** (tersedia di mana saja). IP-geo sungguhan butuh sumber tambahan (MaxMind GeoLite2, atau header dari Cloudflare/CDN di depan nginx) — bisa ditambah belakangan tanpa ubah arsitektur. Untuk fase awal: Accept-Language sudah cukup.
   - ⚠️ **SEO:** jangan redirect Googlebot dengan cara yang menghalangi crawl versi lain. Pola aman: deteksi+redirect HANYA di `/` telanjang; `/id` & `/en` tetap langsung crawlable; pakai `x-default` → `/id`.
6. **Link jadi locale-aware:** `navbar.tsx` (navItems, corporateLinks, discoverLinks, logo), `navbar-dropdown.tsx`, `footer.tsx`, `app-download-teaser.tsx`, `not-found.tsx`, `_home/landing.tsx`, `faq/structure.tsx`, `ojol/client.tsx` — prefix semua href internal dengan locale aktif.
7. **Perbaiki perbandingan path** `whitePage` di `navbar.tsx` & `language-toggle2.tsx`: strip prefix `/[locale]` sebelum membandingkan dengan `"/corporate/about/"` dll.
8. **`language-toggle2.tsx`:** `toggleLanguage` → tukar segmen locale di `usePathname()` lalu `router.push` (pertahankan sisa path + trailing slash), bukan flip localStorage.
9. **Href di dalam `translations.tsx`:** ada `<Link href="/...">` di dalam value terjemahan — putuskan: prefix locale saat render, atau andalkan middleware redirect. (Rekomendasi: andalkan middleware untuk fase awal, rapikan kemudian.)
10. **404:** buat `[locale]/not-found.tsx` (butuh LanguageProvider) untuk 404 terlokalisasi; sisakan root `not-found.tsx` locale-less untuk path tak-cocok.

**Verifikasi:** `/id` & `/en` render bahasa yang benar; toggle pindah URL; link internal mempertahankan locale; news route build (locale × slug); navbar theming benar di halaman about/contact/showroom.

> Bila terasa terlalu besar untuk satu PR, boleh dipecah jadi `3a` (pindah folder + split layout) dan `3b` (i18n binding + link/nav), asal **3a & 3b di-merge bersamaan** ke `ssr-version`.

---

### Fase 4 — SEO multi-locale · branch `feat/i18n-seo` · effort: MEDIUM
**Tujuan:** hreflang/canonical benar per locale + sitemap dua bahasa + 301 dari URL lama.

> Dependency: butuh sumber **string biasa** per locale untuk title/description (JANGAN dari `translations.tsx` yang ber-JSX). **[KEPUTUSAN: string EN disediakan Claude di fase ini]** — dibuat sebagai modul plain-string `seo-strings.ts` (id + en) terpisah dari `translations.tsx`.
>
> Catatan: user juga merencanakan **audit + perbaikan SEO on-page & metadata menyeluruh di SESSION TERPISAH nanti** — di luar lingkup migrasi ini. Fase 4 hanya membuat metadata locale-aware (hreflang/canonical/sitemap), bukan optimasi SEO menyeluruh.

Langkah:
1. Tulis ulang `seo1.ts` `getSEOMetadata(locale, path)`: `canonical=${SITE}/${locale}${path}`, `alternates.languages={id, en, 'x-default'}`, `openGraph.locale` (id_ID/en_US) + `alternateLocale`. Baca `SITE` dari `process.env.NEXT_PUBLIC_SITE_URL` (agar domain temp/staging tidak bocor jadi canonical). Buang `url.replace("/id","")` & param `alternateUrl`.
2. Konversi semua `export const metadata = getSEOMetadata(...)` → `export async function generateMetadata({params})` (root/[locale] layout + 12 page + news `[slug]`); `<html lang={locale}>` dinamis.
3. Buat sumber string title/description per locale (id + **en baru**) untuk metadata.
4. **Sitemap & robots:** ganti `next-sitemap` dengan in-app `src/app/sitemap.ts` (emit tiap path untuk id & en + `alternates.languages`) + `src/app/robots.ts`. Hapus `&& next-sitemap` dari build script & dependency. **Hapus artefak basi** `public/sitemap.xml`, `public/sitemap-0.xml`, `public/robots.txt`.
5. **Redirect 301** URL lama tanpa-locale → `/id/...` di middleware/next.config (`permanent:true`). **Wajib 301, bukan 302** (kalau 302, Google anggap URL lama tetap canonical → split ranking).
6. `x-default` arahkan ke `/id`; pastikan sitemap & `<head>` alternates konsisten.

**Verifikasi:** view-source tiap locale menampilkan hreflang/canonical benar; sitemap memuat /id & /en; URL lama 301 ke /id.

---

### Fase 5 — Provisioning VPS + CI/CD baru + deploy domain testing · branch `chore/vps-deploy` · effort: HIGH
**Tujuan:** push ke `ssr-version` → auto-deploy ke **ssr.wedison.co** (HTTPS), jadi instance testing utama Anda.

VPS base:
1. Ubuntu LTS, Node 20 (samakan dengan CI `NODE_VERSION:20`), user `deploy` non-root + SSH key, install `nginx`, `certbot`, `pm2 -g`.
2. `ecosystem.config.js` (BARU, di-commit): app `wedison-ssr` (:3001), `instances:2`, `exec_mode:cluster`, `env_file` per env, `cwd` → dir standalone ter-deploy.
3. **nginx**: server block `ssr.wedison.co` → `proxy_pass http://127.0.0.1:3001` (set `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`, `proxy_http_version 1.1`); location `/_next/static` → `Cache-Control: public,max-age=31536000,immutable`.
4. **TLS**: `certbot --nginx -d ssr.wedison.co` (DNS A record harus live & port 80 reachable dulu).
5. **Env**: secret server-only di `/etc/wedison/ssr.env` (mode 600), di-load via PM2 `env_file`. `NEXT_PUBLIC_*` tetap di-inline saat build di Actions.
6. **DNS**: A record `ssr.wedison.co` → IP VPS (bisa via Hostinger DNS MCP).

CI/CD baru (repurpose `staging.yml`):
7. Trigger on push `ssr-version`: **build standalone di GitHub Actions** (hindari OOM di VPS), tar `.next/standalone` + `.next/static` + `public`, `rsync` via SSH ke `/var/www/wedison/ssr/releases/<sha>`, symlink `current` → release, lalu `pm2 reload ecosystem.config.js --only wedison-ssr --update-env`.
8. **Zero-downtime**: pakai `pm2 reload` (cluster, instances≥2), BUKAN `restart`. Jalankan `pm2 save` + `pm2 startup` sekali (kalau lupa, app tak bangkit setelah reboot).
9. **Rollback**: pola releases-dir + symlink → arahkan `current` ke release sebelumnya + `pm2 reload`.

**Verifikasi:** push ke `ssr-version` → CI hijau → ssr.wedison.co serve SSR HTTPS, semua route + form jalan, hreflang benar, 301 jalan. **Ini fondasi testing Anda sebelum naik ke prod.**

> ⚠️ Build di CI, bukan di VPS: `translations.tsx` 170KB di-import banyak bundle → `next build` bisa OOM di VPS kecil. Kalau terpaksa build di VPS, set `NODE_OPTIONS=--max-old-space-size=...`.
> ⚠️ Jangan rsync `node_modules` repo menimpa standalone (bisa tarik binary salah-arch; `@tailwindcss/oxide-linux-x64-gnu` itu build-time only).
> ⚠️ Deploy SSH key di GitHub Secrets = shell ke VPS. Batasi user `deploy` (tanpa sudo, terbatas ke release dir + `pm2 reload`).

---

### Fase 6 — Cutover produksi (setelah ssr-version tervalidasi → staging → main)
**Tujuan:** wedison.co dilayani prod VPS, shared hosting pensiun, tanpa kehilangan SEO.

Langkah berurutan (urutan ini load-bearing):
1. Merge `ssr-version` → `staging` → `main`.
2. Repurpose `ci-cd.yml` → deploy `main` ke `wedison-prod` (:3000) + nginx block `wedison.co` + cert.
3. **Pra-lower TTL** DNS `wedison.co` (mis. ke 300s) ~24–48 jam sebelum cutover.
4. Deploy `main` ke VPS; validasi via host-entry/IP langsung sebelum repoint.
5. Pastikan **301 map** & sitemap sudah live di prod VPS pada saat cutover.
6. **Repoint A record** `wedison.co`: Hostinger shared → IP VPS. **Biarkan shared hosting tetap hidup** selama propagasi (jendela overlap); bila perlu pasang `noindex`/canonical di shared host agar tak jadi duplicate content.
7. Submit ulang sitemap ke Google Search Console; pantau error/404 & ranking.
8. Setelah propagasi penuh & prod stabil beberapa hari: **decommission shared hosting + hapus secret FTP** (`HOSTINGER_FTP_*`).

**Rollback cutover:** balikkan A record ke IP shared hosting (masih hidup di jendela overlap). Untuk app: symlink ke release sebelumnya + `pm2 reload`.

---

## 5. Risiko lintas-fase (wajib diingat)

1. **Transisi localStorage → URL untuk user lama.** Visitor dengan `localStorage.language="en"` mendarat di `/id` → server render "id", client flash ke "en" = hydration mismatch (bug yang HANYA muncul di prod, bukan dev incognito). **Aturan:** URL menang; localStorage/cookie hanya untuk redirect dari `/` telanjang. Set cookie saat toggle.
2. **Hydration mismatch umum.** SSR memunculkan divergensi server-vs-client di mana pun kode baca `window`/`localStorage` saat render. Provider awal "id" vs localStorage "en" akan mismatch — diselesaikan oleh URL-binding (Fase 3).
3. **Blast radius import & `"use client"`.** 24 file pakai `useLanguage()`; banyak page `"use client"`. Aliasing (Fase 2) meng-mitigasi, tapi tetap refactor mekanis besar (hitung multi-hari, bukan one-liner).
4. **`fetchPreview` di request-time.** Aman sebagai build step; sebagai SSR request, upstream down = halaman lambat/error. Pertahankan build-time atau cap timeout + cache.
5. **VPS = single point of failure baru.** Shared hosting hampir zero-ops; Node server butuh monitoring, healthcheck, restart, patch OS, capacity planning. Tambahkan uptime check + `pm2` logrotate.
6. **`sharp` runtime.** Harus di `dependencies` & ada di VPS SEBELUM image optimizer dinyalakan (kalau tidak, gambar rusak hanya ketahuan di prod).
7. **OOM build** karena `translations.tsx` 170KB → build di CI.

---

## 6. Masa depan: full-stack (terpisah, JANGAN dikerjakan saat migrasi)

Migrasi ini sudah membuka semua kapabilitas backend. Yang perlu "disiapkan pintunya" sekarang (konvensi folder saja, bukan implementasi):
- **Reservasi `src/app/api/`** untuk Route Handlers + Server Actions.
- **Batas auth/session** terpisah; admin sebagai route group `(admin)` atau segmen tersendiri.
- **DB**: Postgres di VPS yang sama; ORM **Prisma** **[KEPUTUSAN]**. Connection layer (Prisma Client singleton) di modul server-only; `schema.prisma` + migrations; `DATABASE_URL` lewat env VPS.
- **Secret server-only** lewat env VPS (bukan `NEXT_PUBLIC_`, bukan inline build).
- **Docker + compose** menjadi worthwhile begitu backend+DB datang (orkestrasi web + api + postgres di satu box). `output:"standalone"` sudah containerize dengan mudah → ganti jalur deploy ke registry itu drop-in nanti.

---

## 7. Keputusan

### Sudah diputuskan (2026-06-29)
1. ✅ **Default locale:** deteksi `Accept-Language`/geo (lihat Fase 3 §5 untuk nuansa geo di VPS). Tombol toggle juga berfungsi switch locale `/id` ↔ `/en` (sudah masuk Fase 3 §8).
2. ✅ **Image optimization:** tunda — `images.unoptimized:true` dulu; `sharp` tetap dipindah ke `dependencies`.
3. ✅ **String metadata EN:** disediakan Claude di Fase 4 (modul `seo-strings.ts`, id + en).
4. ✅ **ORM (full-stack nanti):** Prisma.

### Masih terbuka (ada rekomendasi, non-blocking)
5. **`trailingSlash`:** pertahankan `true` (rekomendasi, kontinuitas SEO) atau pindah ke `false`?
6. **Domain testing:** asumsi `ssr.wedison.co` — setuju atau mau domain lain?
7. **Deploy:** bare-metal (rsync + PM2 + nginx) sekarang, Docker nanti saat backend? (Rekomendasi: ya.)
8. **`staging`:** instance VPS sendiri (:3002) atau pakai ulang instance ssr-version?

### Di luar lingkup migrasi ini (sesi terpisah nanti)
- **Audit + perbaikan SEO on-page & metadata menyeluruh** — diminta user untuk dikerjakan di session baru, bukan sekarang. Fase 4 di sini hanya membuat metadata *locale-aware*, bukan optimasi SEO penuh.

---

_Catatan: rencana ini hasil investigasi paralel 6-dimensi atas kode aktual + audit kelengkapan. Path file yang disebut sudah diverifikasi ada di repo per 2026-06-29._
