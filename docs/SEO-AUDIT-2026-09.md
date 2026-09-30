# Audit SEO · Page Speed · GEO/AEO · Keamanan — wedison.co (build SSR)

Tanggal: 30 September 2026 · Branch: `fix/seo-audit-2026-09` · Alur rilis: PR → `staging` (ssr.wedison.tech) → `main` (wedison.co)

Sumber: ekspor Screaming Frog "Issues Overview" (ssr.wedison.tech, 37 baris isu), dua dokumen audit
sebelumnya (audit SSR & komparasi vs wedison-bali.com), **crawl ulang sendiri** ke ssr.wedison.tech
(44 URL sitemap × 2 user-agent), pembacaan seluruh kode (`src/`, `next.config.ts`, `deploy/`,
workflow CI/CD), build lokal Next 15.5 (`next build --debug`), Lighthouse 13 (mobile) terhadap
server standalone lokal, dan uji browser (Playwright) untuk pelanggaran CSP/console error.

## 1. Ringkasan eksekutif

Situs SSR secara desain sudah punya fondasi SEO yang benar (title/description/canonical/hreflang per
locale, sitemap, robots, JSON-LD artikel), **tetapi satu bug kecil membatalkan hampir semuanya**:
`src/app/not-found.tsx` (404 root) memanggil `headers()`. Komponen itu ikut dirender saat prerender
*setiap* halaman, sehingga Next menandai **seluruh halaman `[locale]` sebagai dinamis** (bukan SSG).
Akibat berantai:

1. Metadata Next 15 di-*stream* — `<title>`, meta description, canonical, hreflang, OG mendarat di
   `<body>` untuk browser, Googlebot, crawler AI (GPTBot, ClaudeBot, PerplexityBot), dan tool SEO
   (temuan Screaming Frog "outside `<head>`" 95% halaman + "canonical missing" 96%). Hanya bot di
   daftar bawaan Next (Bingbot, facebookexternalhit, …) yang mendapat metadata di `<head>`.
   Lighthouse SEO pun menilai "Document does not have a meta description".
2. Setiap request merender ulang halaman di server (TTFB lebih lambat, CPU VPS terpakai) padahal
   konten statis; `Cache-Control: private, no-cache, no-store` di semua HTML.

Temuan besar lain yang **tidak ada** di audit sebelumnya:

- **Staging ssr.wedison.tech dapat diindeks** (robots.txt `Allow: /`, tanpa meta robots, tanpa
  `X-Robots-Tag`). Dokumen audit lama menyebut "staging sends noindex" — itu tidak benar. Setelah
  cutover, staging akan bersaing dengan wedison.co (duplicate content).
- **Gambar Open Graph 404** di 7 halaman (`/default-og.jpg`, `/athena-product-hero.webp`,
  `/about-us.webp`, `/contact-us.webp`, …): tautan yang dibagikan ke WhatsApp/Meta/LinkedIn tampil
  tanpa gambar.
- **Halaman FAQ hanya merender 1 jawaban** ke HTML (accordion Radix melepas konten tertutup; tab
  lain tidak dirender) → ~47 tanya-jawab tidak terbaca mesin pencari/AI. Judul H1 "FAQ" dan
  paragraf pengantar berbahasa Inggris di versi Indonesia.
- Halaman `/super-charge/locations`: **TBT 4,3 s** di mobile (MapLibre 1 MB / 272 kB gzip dievaluasi
  saat load) dan tanpa landmark `<main>`.
- Tautan internal tanpa prefix locale/trailing slash di landing, footer, FAQ, About, kamus, Ojol,
  kartu berita → tiap klik/crawl lewat 1–2 redirect (307 + 308) — sumber "Internal redirection (3xx)".
- Tanpa Organization/WebSite/Product/LocalBusiness/FAQPage/Breadcrumb schema, tanpa `llms.txt`,
  tanpa manifest/ikon Apple, `X-Powered-By: Next.js` bocor, tanpa CSP/X-Frame-Options/Permissions-Policy.

Semua item di atas **sudah diperbaiki di branch ini** (lihat §3), diverifikasi dengan build produksi
lokal + skrip `scripts/seo-check.mjs` yang kini juga berjalan di CI untuk tiap PR (§5).

## 2. Temuan lengkap (status: ✅ diperbaiki · ⚠️ sebagian · ⏳ tindak lanjut · ℹ️ bukan masalah)

### 2.1 Technical SEO

| # | Temuan | Bukti | Status |
|---|---|---|---|
| T1 | Title/description/canonical/hreflang di `<body>` (38 hal.), canonical "missing" (46) | curl UA browser/Googlebot/GPTBot/Screaming Frog ke staging & lokal: posisi `<title>` > `</head>`; Bingbot: di `<head>` | ✅ akar masalah `headers()` di `not-found.tsx` dihapus → semua halaman kembali SSG/ISR, metadata dirender bloking di `<head>` untuk semua UA. Tambahan: `htmlLimitedBots` diperluas (Googlebot, crawler AI, tool SEO) untuk halaman dinamis (artikel/berita CMS) |
| T2 | Staging dapat diindeks | `robots.txt` staging `Allow: /`, tanpa meta robots | ✅ noindex otomatis bila `NEXT_PUBLIC_SITE_URL` ≠ wedison.co (+ `NEXT_PUBLIC_ROBOTS_NOINDEX` eksplisit di `deploy-ssr.yml`): meta robots, `X-Robots-Tag`, `robots.txt Disallow: /` |
| T3 | Internal redirect (12) | link `/products/athena/` (tanpa locale) → 307; `/id/showroom` (tanpa slash) → 308 | ✅ semua link internal `/{locale}/…/`; komponen `LocaleLink` untuk kamus & komponen client; dicek otomatis oleh `seo-check` |
| T4 | Duplicate title/meta (6) & H1 (18) | `/en/media-center/news/*` = salinan persis `/id/…` (liputan pers berbahasa Indonesia) | ✅ versi `/en` di-canonical-kan ke `/id`, hreflang hanya `id`, sitemap hanya `/id`; H1 produk = nama model (sah, hreflang membedakan bahasa); H1 FAQ dilokalkan |
| T5 | Multiple H1 (2) | landing: 3 slide hero masing-masing `<h1>` | ✅ slide 1 `<h1>`, slide lain `<h2>` |
| T6 | Title > 60 (11) / < 30 (3), description > 155 (25) / < 70 (2) | crawl: 13 title > 60, 25 desc > 155 | ✅ semua title 41–60 karakter, description 120–155, klaim angka disamakan dengan kamus spesifikasi (`seo-strings.ts`); judul liputan pers dipotong otomatis |
| T7 | H2 missing (10 hal. berita), H2 non-sequential | halaman news tanpa `<h2>` | ✅ h2 "Ringkasan liputan"; struktur h1→h2→h3 di FAQ |
| T8 | Gambar OG 404 | 7 path tidak ada di `public/` | ✅ 11 gambar OG 1200×630 (`public/og/*.jpg`, 33–123 kB) dibuat dari aset resmi; peta path di `seo-strings.ts` |
| T9 | Alt kosong/salah (20) | `alt="Edmax Hero"` di kartu produk semua model; hero dekoratif `alt=""` | ⚠️ alt kartu produk dari kamus; hero background & ikon dekoratif sengaja `alt=""` (benar untuk aksesibilitas — Screaming Frog tetap menghitungnya) |
| T10 | Sitemap | statis saja, tanpa artikel CMS, tanpa lastmod, `/en` berita ikut | ✅ async: artikel CMS (kedua locale, hanya yang indexable), liputan `/id` saja, `lastmod`, prioritas & frekuensi per halaman, revalidate 1 jam + webhook |
| T11 | robots.txt | tanpa Disallow admin/api, `Host:` non-standar | ✅ `Disallow: /admin, /api` (kecuali `/api/uploads/`), crawler AI diizinkan (GEO) |
| T12 | 404 | root `not-found.tsx` bergantung `headers()` (penyebab T1/P1) | ✅ root 404 statis dwibahasa (prerender `_not-found.html`, tanpa JS) untuk URL yang tak cocok rute; `[locale]/not-found.tsx` (navbar + bahasa) untuk `notFound()` saat navigasi klien. Dicoba pola catch-all `[...rest]` → dibatalkan: di Next 15.5 `notFound()` dari halaman selalu menghasilkan shell 404 yang diisi klien (perilaku sama dengan build lama untuk artikel/berita), jadi 404 statis root lebih baik |
| T13 | Redirect legacy `/athena/` | 2 lompatan (301 + 307 locale) | ℹ️ dipertahankan (sudah teruji saat cutover); `/products/athena/` langsung 1 lompatan |
| T14 | `X-Powered-By: Next.js` | header respons | ✅ `poweredByHeader: false` |

### 2.2 Structured data, GEO (Generative Engine Optimization) & AEO (Answer Engine Optimization)

| # | Temuan | Status |
|---|---|---|
| G1 | Tidak ada JSON-LD selain NewsArticle | ✅ `Organization` (+sameAs, contactPoint, alamat HQ) & `WebSite` di layout; `Product`+`Motorcycle` (spesifikasi dari kamus, tanpa harga → tanpa Offer palsu) di 4 halaman produk; `ItemList` di /products; `MotorcycleDealer/LocalBusiness` ×4 cabang (alamat terstruktur, geo, jam buka, WhatsApp) di /showroom; `FAQPage` (seluruh 47 Q&A) di /faq; `BreadcrumbList` di semua halaman dalam; `NewsArticle` artikel CMS memakai builder yang sama |
| G2 | FAQ tidak terbaca tanpa JS (1 jawaban di HTML) | ✅ semua kategori & jawaban ada di HTML (tab/accordion menyembunyikan lewat `hidden`, bukan melepas DOM); pola WAI-ARIA tabs |
| G3 | Tidak ada `llms.txt` | ✅ `/llms.txt` (spesifikasi llmstxt.org): ringkasan perusahaan, fakta kunci (garansi, SuperCharge 15 menit, showroom, kontak), tautan halaman ID/EN |
| G4 | Crawler AI diblokir? | ℹ️ tidak diblokir; sekarang eksplisit: robots.txt mengizinkan, `htmlLimitedBots` memastikan mereka mendapat metadata di `<head>` |
| G5 | Konsistensi NAP (nama, alamat, telepon) | ✅ satu sumber `src/lib/seo/showrooms.ts` dipakai halaman showroom (peta) dan schema; telepon/email di kontak jadi tautan `tel:`/`mailto:` |
| G6 | Konten pengantar FAQ bahasa Inggris di versi ID | ✅ dilokalkan (kunci kamus `faq.page.*`) |

### 2.3 Page speed / Core Web Vitals

| # | Temuan | Status |
|---|---|---|
| P1 | Semua halaman dirender per-request (bukan SSG) | ✅ (T1) — halaman statis kini dilayani dari cache prerender |
| P2 | `/super-charge/locations` TBT 4,3 s, LCP 6,7 s (mobile, lokal) | ✅ peta MapLibre ditunda sampai kontainer terlihat + browser idle (`requestIdleCallback`), daftar lokasi SSR tampil dulu |
| P3 | Hero produk: gambar mobile/desktop ditukar lewat state JS setelah hydration (LCP dobel) | ✅ `<picture>` + `getImageProps` (art direction di parser HTML, `fetchpriority=high`), state `isDesktop` dihapus |
| P4 | 76 gambar tanpa width/height (Screaming Frog) | ℹ️ semuanya `next/image fill` di kontainer beraspek tetap — CLS terukur 0 di ketiga halaman uji; false positive |
| P5 | 32 gambar > 100 kB | ⚠️ optimizer Next (AVIF/WebP, `sizes`) aktif; sisa yang besar = hero full-bleed (wajar). Sumber terbesar (`ojol/wedison-hero-sewa-harian.webp` 868 kB, `edpower-product-overview.webp` 660 kB, `new-looks/test image.webp` 612 kB) bisa dikompres ulang oleh tim desain (⏳) |
| P6 | Cache HTML | ✅ cookie `NEXT_LOCALE` hanya ditulis bila berubah → respons statis tanpa `Set-Cookie` bisa di-cache |
| P7 | Touch target kecil (dot carousel hero) | ⏳ ukuran dot 8×8 px (a11y "target size") — perlu keputusan desain |

### 2.4 Keamanan (header respons)

| # | Temuan | Status |
|---|---|---|
| S1 | X-Frame-Options hilang 94% URL, CSP hilang 51%, HSTS/nosniff/Referrer-Policy hilang 26% (aset `/_next/static`) | ✅ Next mengirim untuk semua respons: CSP (allowlist GTM/GA4/Ads/Meta/reCAPTCHA/EmailJS/OpenFreeMap/Maps embed), `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`; nginx: HSTS lewat snippet yang di-include ulang di `location /_next/static/` (add_header location membatalkan pewarisan) |
| S2 | CSP `'unsafe-inline'` script | ⏳ diperlukan GTM + script inline Next tanpa nonce (halaman statis). Migrasi nonce = pekerjaan lanjutan |

### 2.5 Konten & marketing (untuk tim non-teknis)

| # | Temuan | Status |
|---|---|---|
| C1 | Landing "Keunggulan Wedison" memakai 4 foto **placeholder Unsplash** (komentar di kode: "GANTI dengan aset final") | ⏳ butuh foto resmi dari tim desain (di produksi akan tampil foto stok) |
| C2 | Halaman SuperCharge: angka "100 titik / 25 kota" + marker kota = placeholder (`network.tsx` TODO) | ⏳ ganti dengan data jaringan asli (bisa dihitung dari tabel Station admin) |
| C3 | Locator: data lokasi dari admin (85 titik seed) — bukan "12 mock sites" seperti disebut audit lama | ℹ️ pastikan status tiap stasiun akurat sebelum cutover |
| C4 | Tidak ada harga di situs → tidak bisa memakai rich result Product dengan Offer | ⏳ keputusan bisnis (tampilkan OTR seperti situs Bali?) |
| C5 | Anchor "Pelajari Lebih Lanjut/Learn More" | ℹ️ selalu di dalam kartu bersama nama model → konteks cukup |
| C6 | Readability (Flesch) | ℹ️ tidak relevan untuk Bahasa Indonesia |
| C7 | Salinan footer "© 2025" | ⏳ perbarui tahun (kamus `footer.copyright`) |

## 3. Perubahan di branch ini (peta file)

- **Metadata & indeksasi**: `src/lib/seo/site.ts` (origin, NOINDEX, kontak, alamat HQ), `src/app/lib/seo1.ts` (robots, canonicalLocale, OG), `src/app/lib/seo-strings.ts` (copy baru + gambar OG + prioritas sitemap), `src/app/layout.tsx` (robots, viewport/theme-color), `next.config.ts` (`htmlLimitedBots`, `headers()`, `poweredByHeader`).
- **Prerender**: `src/app/not-found.tsx` (statis), `src/app/[locale]/not-found.tsx`, `src/app/[locale]/[...rest]/page.tsx`, `src/middleware.ts` (cookie hanya bila berubah, `Vary`).
- **Structured data**: `src/lib/seo/schema.ts`, `src/lib/seo/product-page.ts`, `src/lib/seo/showrooms.ts`, `src/lib/seo/dictionary.ts`, `src/components/seo/json-ld.tsx`, JSON-LD di `page.tsx` produk/products/showroom/faq/compare/career/locations/about/contact/ojol/media-center/news/articles, Organization+WebSite di `src/app/[locale]/layout.tsx`.
- **Discovery**: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/llms.txt/route.ts`, `src/app/manifest.ts`, `src/app/apple-icon.png`, `public/icons/icon-*.png`, `public/og/*.jpg`.
- **Halaman**: landing (H1, link), footer (trailing slash), FAQ (`structure.tsx`, `dropdownFAQ.tsx`, `questions.tsx`, kamus `faq.page.*`), berita (`news/[slug]`), kontak (tel/mailto), about, showroom (data dari `showrooms.ts`), produk (`_product/structure.tsx` picture hero, `product-data.tsx` alt), ojol & kamus (`LocaleLink`), `newsCard.tsx`, locator (`map-client.tsx` lazy map), landmark `<main>` tunggal di layout.
- **Infra & proses**: `deploy/nginx/snippets/wedison-security-headers.conf`, vhost nginx (include snippet), `.github/workflows/deploy-ssr.yml` (noindex staging), `.github/workflows/pr-check.yml` + `scripts/seo-check.mjs` (`npm run seo:check`), `.env.example`, `docs/DEPLOY-PRODUCTION.md`.

## 4. Hasil verifikasi (build produksi lokal, `next build` + server standalone)

| Pemeriksaan | Sebelum | Sesudah |
|---|---|---|
| Halaman `[locale]` di-prerender (SSG/ISR) | 0 dari 34 (semua dinamis; `prerender-manifest` kosong) | 34 dari 34 (+ `_not-found`, robots, sitemap, llms, manifest) |
| `<title>`/description/canonical/hreflang di `<head>` — UA browser, Googlebot, GPTBot, Screaming Frog | hanya UA di daftar bawaan Next (Bingbot, facebookexternalhit) | semua UA, semua halaman (termasuk halaman dinamis artikel/berita) |
| `Cache-Control` HTML | `private, no-cache, no-store` | `s-maxage=31536000` (+ `x-nextjs-cache: HIT`), tanpa `Set-Cookie` bila cookie locale sudah ada |
| `scripts/seo-check.mjs` (15 halaman × 4 UA + statis/redirect) | — | **363/363 lulus** |
| Header keamanan (CSP, XFO, nosniff, Referrer-Policy, Permissions-Policy) | tidak ada (XFO/CSP) atau hilang di aset | semua respons, termasuk `/_next/static` dan `/icons/*` |
| `X-Powered-By` | `Next.js` | tidak ada |
| Gambar OG | 7 URL 404 | 11 gambar 1200×630, semua 200 |
| JSON-LD | NewsArticle saja (artikel CMS) | Organization+WebSite (semua halaman), Product×4, ItemList, MotorcycleDealer×4, FAQPage (47 Q&A), BreadcrumbList (semua halaman dalam), NewsArticle |
| FAQ di HTML | 1 jawaban | 47 pertanyaan + 47 jawaban (7 panel, 6 `hidden`), tab & accordion berfungsi |
| Link internal tanpa locale/trailing slash di 15 halaman uji | ada (landing, footer, FAQ, about, ojol, kartu berita) | 0 |
| Title > 60 / description > 155 (halaman statis) | 13 / 25 | 0 / 0 (semua 41–60 dan 120–155 karakter) |
| Lighthouse mobile (lokal, mesin idle, cache gambar hangat; 2 kali jalan) — SEO | 92 / 92 / 100 (home, athena, locations) | 100 / 100 / 100 |
| Lighthouse — Best Practices | 100 / 96 / 100 | 100 / 100 / 100 (rasio ikon Tokopedia diperbaiki) |
| Lighthouse — Accessibility | 96 / 100 / 99 | 96 / 100 / 100 (sisa: ukuran dot indikator hero di home, lihat P7) |
| Lighthouse — Performance | 74 / 90 / 46 | 86–87 / 86 / 59–66 |
| Home: LCP · Speed Index · TBT | 5,5 s · 6,0 s · 90 ms | 3,9–4,0 s · 1,5–1,9 s · 60–160 ms |
| Athena: LCP · Speed Index · TBT | 3,5 s · 1,8 s · 80 ms | 4,1–4,2 s · 1,4 s · 70 ms (LCP ±0,6 s lebih lambat = varian gambar mobile via `<picture>`; sebelumnya LCP diukur dari gambar desktop yang lalu ditukar setelah hydration) |
| Locations: LCP · Speed Index · TBT | 6,7 s · 3,2 s · 4.330 ms | 4,6–4,9 s · 2,0–2,6 s · 650–1.210 ms |
| Uji browser (Playwright, build produksi): home + terima cookie (GTM & Consent Mode), locator (peta MapLibre 85 marker + tile OpenFreeMap), kontak (reCAPTCHA + Google Maps embed), FAQ, produk (hero `<picture>` memilih sumber mobile) | — | 0 error/peringatan console, 0 pelanggaran CSP (satu-satunya error lokal = `POST /api/v1/consent` 500 karena backend tidak dijalankan) |

Catatan pengukuran performa: angka Lighthouse lokal berfluktuasi besar (mesin bersama, optimizer gambar
dingin, tanpa nginx/HTTP2). Yang konsisten dan dapat diandalkan adalah perubahan struktural: TTFB
halaman statis dari cache, LCP hero produk memakai `<picture>` + `fetchpriority=high` + preload
responsif, MapLibre ditunda sampai peta terlihat & browser idle (TBT locator turun dari 4,3 s ke
±1,7 s pada pengukuran dalam kondisi sama). Ukur ulang dengan PageSpeed Insights setelah rilis di
staging/produksi untuk angka lapangan.

## 5. Pencegahan regresi

- `scripts/seo-check.mjs` (dipakai `pr-check.yml`): metadata di `<head>` untuk 4 user-agent (browser,
  Googlebot, GPTBot, Screaming Frog), panjang title/description, satu `<h1>`, `<h2>`, satu `<main>`,
  JSON-LD valid, OG image 200, link internal tanpa redirect, header keamanan, robots/sitemap/llms/manifest,
  404 benar, canonical berita `/en`→`/id`, header aset statis. Mode `--expect-noindex` untuk staging.
- Aturan kode: link internal selalu `/{locale}/…/` (pakai `LocaleLink` bila komponen tidak tahu locale);
  jangan pakai `headers()/cookies()` di root `not-found.tsx`; halaman tidak merender `<main>` sendiri;
  copy SEO hanya di `seo-strings.ts` dengan batas panjang; origin pihak ketiga baru → CSP `next.config.ts`.

## 6. Rencana & tindak lanjut (prioritas)

1. **Sebelum cutover DNS** — merge PR ini ke `staging`, verifikasi di ssr.wedison.tech dengan
   `npm run seo:check -- https://ssr.wedison.tech --expect-noindex`, cek console browser (CSP) pada
   alur: terima cookie (GTM+GA4+Pixel), booking test ride, form kontak (reCAPTCHA+EmailJS), locator
   (peta OpenFreeMap), compare. Pasang snippet nginx di VPS (root). Lalu PR `staging` → `main`.
2. **Hari cutover** — `npm run seo:check -- https://wedison.co` (mode indexable), submit
   `sitemap.xml` di Search Console, URL Inspection 3 halaman (home, produk, FAQ), Rich Results Test,
   verifikasi GTM/Pixel tag firing dengan Tag Assistant.
3. **Minggu 1–2** — ganti foto placeholder Unsplash (C1) & angka jaringan (C2); kompres 3 gambar sumber
   terbesar (P5); tahun footer (C7); pantau laporan "Page indexing" & "Enhancements" di Search Console.
4. **Bulan 1** — konten GEO/AEO: artikel CMS untuk kueri "harga motor listrik 2026", "subsidi motor
   listrik", "cara charging motor listrik", "motor listrik vs bensin", masing-masing menaut ke halaman
   produk; pertimbangkan harga OTR + Offer schema (C4); CSP berbasis nonce (S2).
