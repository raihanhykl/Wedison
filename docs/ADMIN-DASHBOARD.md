# Admin Dashboard & Backend (branch `feature/admin-dashboard`)

Panel admin di `/admin` (Next.js, tidak dilokalisasi) + backend **Express 5 + PostgreSQL + Prisma 7** di folder `server/`.

## Arsitektur singkat

```
browser ──/admin/*──▶ Next.js (:3000) ──rewrite /api/*──▶ Express API (:4000) ──▶ PostgreSQL
                     │  halaman publik (SSR/ISR, cache bertag)  ▲
                     └──────────── webhook /api/revalidate ◀────┘ (setelah admin ubah data)
```

- **Frontend admin**: `src/app/admin/**` (login, dashboard, CMS, SuperCharge, Leads [booking showroom, pesan kontak, kalender, analytics — lihat docs/BOOKING-FORM.md], pengguna, log). Komponen: shadcn/ui + TanStack Table/Query + Tiptap (template resmi `simple-editor`).
- **Backend**: `server/src` — `modules/*` (auth, users, articles, taxonomy, press, social, media, stations, dashboard, activity, leads), `lib/cache.ts` (LRU in-memory bertag), `lib/metadata.ts` (scraper OG), `middleware/auth.ts` (JWT cookie httpOnly, izin per role).
- **Caching 3 lapis**:
  1. Backend: `cached(key, tags, fn)` (LRU, TTL `CACHE_TTL_PUBLIC`) + header `Cache-Control: s-maxage` di `/api/v1/public/*`.
  2. Next.js: `fetch(..., { next: { revalidate, tags } })` di `src/lib/cms/api.ts` (ISR).
  3. On-demand: setiap write admin → `invalidate(tags)` → `POST {FRONTEND_URL}/api/revalidate` → `revalidateTag`.
- **Modul SuperCharge (admin)**: `/admin/supercharge/stations` — tabel + filter (status, tier, provinsi, tampil/tersembunyi, pencarian), tambah/edit lewat sheet (`station-form.tsx`) dengan pemilih koordinat MapLibre (`station-map-picker.tsx`, style peta sama dengan halaman publik), fasilitas (kunci = kamus `supercharge.locator.amenity.*`), foto dari Media Library (folder `stations`), aksi baris & massal (ubah status, tampil/sembunyikan, hapus — hapus hanya ADMIN). Setiap perubahan meng-invalidate cache `stations` sehingga peta publik langsung segar.
- **Halaman publik yang sudah memakai CMS**: `/media-center` (artikel, liputan pers, Instagram), `/media-center/news/[slug]`, `/media-center/articles/[slug]` (baru), `/super-charge/locations`. Semua fail-soft ke data statis lama bila backend kosong/mati.

## Setup lokal (tanpa Docker)

1. **PostgreSQL 15 lokal** (sudah terpasang di `/Library/PostgreSQL/15`). Buat DB:
   ```bash
   /Library/PostgreSQL/15/bin/psql -U postgres -h localhost -c "CREATE DATABASE wedison_admin;"
   ```
2. **Env backend**: `cp server/.env.example server/.env`, isi `DATABASE_URL` (password postgres Anda), `JWT_SECRET` (`openssl rand -base64 48`), `REVALIDATE_SECRET`.
3. **Env frontend**: tambahkan ke `.env.local` (lihat `.env.example` bagian bawah): `API_INTERNAL_URL=http://127.0.0.1:4000`, `REVALIDATE_SECRET=<sama dengan server>`.
4. **Install & migrasi & seed**:
   ```bash
   npm install                 # frontend
   cd server && npm install    # backend
   npm run db:setup            # migrate deploy + seed (admin, kategori, 5 liputan, 6 IG, 85 lokasi)
   ```
5. **Jalankan** (dua terminal): `npm run dev:api` dan `npm run dev`. Buka http://localhost:3000/admin.
   - Login awal: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` dari `server/.env` (default `admin@wedison.co` / `Wedison2026!`). **Ganti setelah login** (Akun Saya).

Perintah lain: `npm run db:migrate` (buat migrasi baru saat schema berubah), `npm --prefix server run db:studio` (Prisma Studio), `npm run typecheck` (FE + BE).

## Endpoint utama (`/api/v1`)

| Publik (cache) | Admin (cookie JWT) |
|---|---|
| `GET /public/articles?locale=&page=&category=&tag=` | `GET/POST /admin/articles`, `PUT/DELETE /admin/articles/:id`, `PATCH /admin/articles/:id/status`, `POST /admin/articles/bulk` |
| `GET /public/articles/:slug?locale=` | `POST /admin/articles/import` (multipart `file` .docx/.pdf, maks 20 MB, rate limit 30/10 mnt) → `{ html, warnings, stats }` |
| | `GET/POST/PATCH/DELETE /admin/topics` (alias `/admin/categories`), `/admin/tags` |
| `GET /public/press`, `GET /public/press/:slug` | `/admin/press` + `POST /admin/press/fetch-metadata`, `POST /admin/press/:id/refresh`, `POST /admin/press/reorder` |
| `GET /public/social?platform=` | `/admin/social` + `fetch-metadata`, `:id/refresh`, `reorder` |
| `GET /public/stations` (GeoJSON) | `/admin/stations` (CRUD), `GET /admin/stations/meta` (provinsi/kota/jumlah per status), `POST /admin/stations/bulk` (`status` / `activate` / `deactivate` / `delete`) |
| `GET /public/pricing` (snapshot harga: wilayah, skema publik, baris harga, S&K, tarif SuperCharge, referral) | `GET /admin/pricing` (semua), `POST/PATCH/DELETE /admin/pricing/regions[/:id]`, `.../schemes[/:id]`, `PUT /admin/pricing/entries` (upsert massal per wilayah × skema), `DELETE /admin/pricing/entries/:id`, `PUT /admin/pricing/terms`, `GET/PUT /admin/pricing/settings` |
| `GET /public/categories` | `GET /admin/media`, `POST /admin/media/upload` (multipart `files[]`, `folder`), `PATCH/DELETE /admin/media/:id` |
| | `/auth/login|logout|me|change-password|profile`, `/admin/users` + `/admin/roles` (izin `users.manage`), `/admin/activity`, `/admin/dashboard/stats` |

Hak akses: role kustom berbasis izin (lihat bagian **Role kustom**). `GET/POST/PATCH/DELETE /admin/roles`, `GET /admin/roles/catalog`, `POST /admin/roles/:id/duplicate` (semua butuh izin `users.manage`).

## Deploy VPS (ssr.wedison.tech)

Otomatis lewat `.github/workflows/deploy-ssr.yml` saat push ke `ssr-version`:

1. CI build Next standalone (`API_INTERNAL_URL=http://127.0.0.1:4002` wajib saat build karena rewrite dibaca waktu build) → rsync ke VPS.
2. rsync source `server/` + `ecosystem.config.js` (tanpa `node_modules`, `dist`, `.env`, `uploads`, `.seeded`).
3. Di VPS: `npm ci` → `npm run build` → `prisma migrate deploy` → seed **sekali** (penanda `server/.seeded`).
4. `pm2 startOrReload ecosystem.config.js --update-env` (app `wedison-landing` :3002 + `wedison-api` :4002).
5. Health check API + `POST /api/revalidate/` agar halaman publik langsung memakai data DB.

Kondisi VPS (disiapkan manual, sekali):

| Item | Nilai |
|---|---|
| Env backend | `/home/wedison/wedison-landing/server/.env` (chmod 600, tidak pernah di-rsync). `PORT=4002`, `FRONTEND_URL=http://127.0.0.1:3002`, `COOKIE_SECURE=true`. Password di `DATABASE_URL` harus URL-encoded; `JWT_SECRET` ≥ 32 karakter. |
| Database | PostgreSQL lokal VPS, DB `wedison_admin`, owner `wedison_app` |
| Upload | `UPLOAD_DIR=/home/wedison/wedison-data/uploads` (di luar folder deploy → aman dari `rsync --delete`) |
| nginx | `/api/v1/` dan `/api/uploads/` → `127.0.0.1:4002`; sisanya (termasuk `/api/revalidate`) → Next :3002. Lihat `deploy/nginx/ssr.wedison.tech.conf`. |
| PM2 boot | service `pm2-wedison` (enabled); jalankan `pm2 save` setelah perubahan proses. |

Backup yang disarankan (cron harian): `pg_dump wedison_admin` + folder `wedison-data/uploads`.

## Indikator SEO · AEO · GEO (early detection)

Dua level, satu skala (0–100; ≥80 baik, 55–79 perlu perbaikan, <55 buruk). Setiap cek membawa
catatan singkat *apa yang harus diperbaiki* untuk editor, bukan untuk engineer.

**Artikel** — `server/src/lib/content-score.ts` (pure function).
- Dihitung live di editor (`POST /admin/seo/analyze`, debounce 0,9 s) dan disimpan saat simpan
  (`ArticleTranslation.contentScore`, migrasi `article_content_score`). Daftar artikel menampilkan pil S/A/G.
- SEO: panjang title/meta description, focus keyword (judul, paragraf awal, subjudul, slug, densitas),
  cover + alt, alt gambar inline, struktur H2/H3 (tanpa H1 di isi, urutan level), panjang artikel,
  link internal, panjang paragraf, topik, tag, gambar share, canonical, noindex.
- AEO: jawaban langsung di paragraf pembuka, subjudul berbentuk pertanyaan, blok FAQ (otomatis jadi
  `FAQPage` JSON-LD di halaman publik — `src/lib/seo/article-faq.ts`), list/tabel, panjang kalimat,
  excerpt, ringkasan/kesimpulan, definisi istilah, langkah bernomor untuk artikel cara.
- GEO: sumber eksternal yang dikutip, angka/statistik, kutipan beratribusi, penulis, penyebutan
  entitas Wedison di awal, kedalaman, bahasa bukti ("menurut data …"), gambar orisinal, kesegaran,
  keywords, structured data.
- `POST /admin/seo/rescore` menghitung ulang semua artikel (jalankan setelah aturan skor berubah).

**Website** — `server/src/lib/site-audit.ts`, halaman admin **SEO & AI Readiness** (`/admin/seo`).
- `POST /admin/seo/site/run` meng-crawl semua URL di `sitemap.xml` (dipetakan ke `SITE_AUDIT_URL`,
  default `FRONTEND_URL`; di VPS `http://127.0.0.1:3002`) + `robots.txt`, `llms.txt`, manifest.
  Hasil disimpan di tabel `Setting` (`site_audit`) dan ditampilkan di dashboard.
- SEO situs: status 200, metadata di `<head>`, panjang title/description, canonical, hreflang, satu H1,
  H2, alt gambar, og:image, link internal tanpa redirect, landmark `<main>`, robots, sitemap.
- AEO situs: `FAQPage` schema, subjudul bertanya, `BreadcrumbList`, description layak jawaban,
  `llms.txt`, rata-rata skor AEO artikel.
- GEO situs: `Organization`/`WebSite`, `Product`, `LocalBusiness`, crawler AI diizinkan di robots.txt,
  `llms.txt`, jumlah & kesegaran artikel, rata-rata skor GEO artikel, penulis, JSON-LD valid.
- Jalankan audit setelah setiap rilis; temuan halaman statis diperbaiki tim dev, temuan artikel di editor.

## Modul HR · Karier

Lowongan kerja di halaman `/career` kini dikelola tim HR dari admin (`/admin/hr`), menggantikan
data hardcode `src/app/[locale]/career/data-job.tsx` (tetap dipakai sebagai fallback bila API mati).

**Hak akses (otorisasi)** — berbasis izin (permission) per role, lihat bagian "Role kustom" di bawah. Role bawaan HR: **HR Manager** (semua aksi HR) dan **HR Staff** (tulis & edit draf, ajukan review).

- Backend: `requireModule(modul)` di setiap router admin, `requireWrite(modul)` / `requireDelete(modul)` untuk ubah & hapus permanen, `requireHr(action)` untuk aksi HR, `requirePermission(key)` untuk izin tunggal. Semuanya membaca `req.user.permissions`.
- Frontend: menu sidebar difilter per modul, halaman yang tidak boleh dibuka menampilkan "No access", akun tanpa dashboard diarahkan ke modul pertamanya setelah login (HR → `/admin/hr`, SuperCharge → `/admin/supercharge/stations`).

**Fitur**
- Lowongan: judul & isi dwibahasa (minimal satu bahasa; bahasa lain memakai fallback), ringkasan, tanggung jawab, kualifikasi, nilai tambah, benefit (satu poin per baris).
- Klasifikasi: divisi, beberapa lokasi (kota/provinsi/negara), tipe kerja (penuh waktu, kontrak, magang, …), on-site/hybrid/remote, level, jumlah posisi, rentang gaji (tampil opsional), label "Dibutuhkan segera".
- Alur status: Draft → Pending review → Published → Closed → Archived. Tanggal tutup otomatis menutup lowongan (scheduler tiap menit).
- Melamar: email (per lowongan atau default HR, subjek otomatis dengan `{title}`/`{department}`, CC opsional) dan tautan portal (JobStreet, LinkedIn, Glints, Kalibrr, …).
- Duplikat lowongan, metrik views & klik "lamar" per kanal (30 hari) di HR Overview, daftar "perlu perhatian" (menunggu review, tutup ≤ 7 hari).
- Pengaturan HR: nama & email kontak, CC, telepon/WhatsApp, template subjek email ID/EN, catatan untuk pelamar, lamaran umum (talent pool), profil perusahaan di portal lowongan.
- Publik: `/[locale]/career` (filter divisi, negara, lokasi, tipe; pencarian), `/[locale]/career/[slug]` dengan JSON-LD `JobPosting` (Google for Jobs) untuk lowongan yang dibuka; lowongan tertutup tetap bisa dibuka (noindex, tanpa JobPosting). Lowongan masuk sitemap.

**Data & deploy** — migrasi `hr_jobs` (enum role HR_MANAGER/HR_STAFF, tabel Job/JobTranslation/JobDepartment/JobLocation/JobApplyClick).
Seed `npm run db:seed:hr` (8 divisi, 4 lokasi, 10 lowongan lama, kontak HR default) hanya berjalan sekali per database
(penanda Setting `hr_seeded`) dan otomatis dijalankan di deploy staging & produksi.

## Role kustom (System › Users & Roles)

Sejak migrasi `custom_roles` (2026-10-09) kolom enum `User.role` diganti relasi `User.roleId → Role`. Role = nama, key (slug tetap), deskripsi, warna badge, dan daftar **permission key**. Role dibuat/diubah dari tab **Roles** di `/admin/users` (kartu per role + editor matriks izin di panel samping). Role bawaan hasil migrasi: `super_admin` (sistem, izin `*`, tidak bisa diubah/dihapus), `admin`, `editor`, `marketing`, `supercharge`, `hr_manager`, `hr_staff` (semua bisa diedit/dihapus).

**Katalog izin** (`server/src/lib/permissions.ts`, dikirim ke UI lewat `GET /admin/roles/catalog`):

| Modul | Izin | Catatan |
|---|---|---|
| Dashboard | `dashboard.view` | |
| CMS | `cms.view`, `cms.write`, `cms.delete` | write ⇒ view, delete ⇒ write |
| SuperCharge | `supercharge.view/write/delete` | idem |
| Leads | `leads.view`, `leads.write` (ubah status/catatan/handled/sinkron kalender), `leads.delete` | idem; `leads.write` baru — sebelumnya semua yang bisa buka Leads boleh mengubah |
| HR | `hr.view`, `hr.jobs.write`, `hr.jobs.publish`, `hr.jobs.delete`, `hr.taxonomy.write`, `hr.settings.write` | publish/delete ⇒ jobs.write ⇒ view |
| Users & Roles | `users.manage` | kelola user dan role |
| Activity Log | `activity.view` | |
| Cookie Consent | `consent.view` | |

**Aturan yang dijaga server** (`server/src/lib/roles.ts`, diuji di `server/test/roles.api.test.ts`):
- izin diverifikasi terhadap katalog, izin turunan (`implies`) ditambahkan otomatis saat simpan; `*` hanya untuk role sistem;
- `key` tidak bisa diubah setelah dibuat, unik tanpa memandang huruf besar/kecil; nama juga unik tanpa memandang huruf;
- role sistem tidak bisa diubah/dihapus; role yang masih punya anggota tidak bisa dihapus (409);
- user tidak bisa mengubah role sendiri, menonaktifkan, atau menghapus akunnya sendiri;
- **anti-lockout**: setiap perubahan (izin role, ganti role user, nonaktif, hapus) berjalan dalam transaksi dan dibatalkan bila tidak tersisa satu pun user aktif ber-izin `users.manage`/`*`;
- izin dibaca ulang dari DB di setiap request (`requireAuth`), jadi perubahan langsung berlaku tanpa login ulang; JWT hanya memuat `sub`.

**Tes**: `cd server && npm test` (vitest). `test/permissions.unit.test.ts` (katalog, normalisasi, helper) dan `test/roles.api.test.ts` (supertest ke app Express nyata dengan DB lokal dari `server/.env`; membuat data berawalan id run lalu menghapusnya). Butuh user seed super admin.

**Frontend**: `AuthUser` = `{ role: { id, key, name, color, isSystem }, permissions: string[] }`; helper di `src/lib/admin/permissions.ts` (`hasPermission`, `canAccess`, `canWrite`, `canDelete`, `homeFor`) dan hook `useCan(modul)` (`write`, `deleteHard`, `manageUsers`, `viewActivity`, `has(key)`).

## Form kontak (Leads › Contact Messages)

`POST /public/leads/contacts` adalah sumber kebenaran: form `/corporate/contact` menunggu respons ini sebelum menampilkan "terkirim"; notifikasi email via EmailJS dikirim setelahnya secara best-effort (gagal hanya dicatat di console). Server **idempoten**: email + isi pesan yang sama dalam 15 menit mengembalikan id yang sama (`duplicate: true`) sehingga klik ganda/kirim ulang tidak menggandakan pesan di admin. Tombol **Reply by email** membuka mailto berisi sapaan, topik, slot balasan, dan kutipan pesan asli (bahasa mengikuti locale form) — `src/lib/admin/contact-reply.ts`.

## Editor artikel: impor dokumen & toolbar melayang

**Impor dokumen (Word/PDF)** — tombol **Import document** di sebelah tab bahasa pada form artikel (`src/components/admin/import-document-dialog.tsx`). Mengisi *body* locale yang aktif saja; judul, slug, dan SEO tetap manual.

- Backend: `server/src/lib/doc-import/` — `docx.ts` (mammoth: heading Word 1–6 → h1–h6, list, tabel, bold/italic/underline, link, gambar inline), `pdf.ts` (pdfjs-dist, *best-effort*: paragraf dari jarak baris, heading dari ukuran font relatif, bold/italic dari nama font, bullet/nomor → list, gambar raster via operator list, header/footer & nomor halaman dibuang, maks 60 halaman). `.doc` lama ditolak (minta simpan ulang sebagai .docx). PDF hasil scan tanpa teks → peringatan, tanpa OCR.
- Gambar diekstrak lalu disimpan ke Media Library (`storeImageBuffer()` di `media.routes.ts`, folder `articles/import`, otomatis WebP) sehingga HTML hanya berisi URL, bukan base64.
- Output selalu lewat `sanitizeArticleHtml` (whitelist sama dengan editor). Response memuat `warnings` (mis. heading hasil tebakan) dan `stats` (kata, paragraf, heading, list, tabel, gambar, halaman).
- Dialog: drag-and-drop/browse → **Convert** (progress upload + konversi) → ringkasan + peringatan → **Replace body** / **Append to body** (replace minta konfirmasi bila body sudah berisi; semua bisa di-Undo). Konten dimasukkan ke editor via `onReady(editor)` tanpa remount.
- Setelah impor, penulis tetap memeriksa level heading (H1 di body → H2), alt text gambar, dan link.

**Toolbar melayang** — toolbar utama Tiptap kini benar-benar *sticky* tepat di bawah header admin (`.simple-editor-wrapper` tidak lagi `overflow:auto`; `top: 3.5rem`). Saat teks diseleksi muncul *bubble menu* ringkas (`src/components/tiptap-ui/selection-bubble-menu/`): heading, list, bold/italic/underline/strike/code, highlight, link; disembunyikan di layar ≤480px (toolbar mobile sudah menempel di keyboard), pada gambar dan code block.

**Tabel** — `@tiptap/extension-table` (TableKit, kolom bisa di-resize) + dropdown **Table** di toolbar (`src/components/tiptap-ui/table-dropdown-menu/`): sisip 3×3, tambah/hapus baris & kolom, header row, merge/split, hapus tabel. Dibutuhkan agar tabel dari Word tidak hilang saat diimpor.

## Modul Pricing (Prices & Schemes)

Satu sumber kebenaran harga publik, dikelola di **/admin/pricing** (izin `pricing.view|write|delete`; role `admin` dapat semuanya, `editor`/`marketing` view+write). Tidak ada angka harga yang hardcode di frontend.

**Model data** (`server/prisma/schema.prisma`):
- `PriceRegion` — wilayah (Jabodetabek, Bali, Bandung Raya, …): nama ID/EN, label harga ("Harga OTR Jabodetabek"), cakupan kota, WA sales, `isDefault` (dipakai untuk "mulai dari" di landing), `isActive`, urutan. Wilayah **tanpa baris harga** tampil sebagai panel "Hubungi Sales {wilayah}".
- `PricingScheme` — skema dengan `kind`: `PURCHASE` ("Cash": OTR, diskon, net), `RENT_TO_OWN` / `RENTAL` (biaya harian, DP, masa kontrak), `B2B_CREDIT` (angsuran 24/36 bln), `BAAS` (harga unit + langganan baterai). `audience` (ALL/OJOL/B2B) jadi label kecil; `isPublic=false` = tersimpan tapi tidak tampil (default untuk B2B Bali).
- `PriceEntry` — baris harga unik per wilayah × skema × model (`BEES|ATHENA|VICTORY|EDPOWER`) × varian (`SINGLE|REGULAR|EXTENDED`). Beli putus divalidasi `net = OTR − diskon`.
- `PricingTerms` — per wilayah × skema: "Setiap unit termasuk", S&K, mitra pembiayaan, masa berlaku, catatan (ID/EN).
- `Setting` key `pricing_settings` — disclaimer, tarif SuperCharge per model + satuan + catatan, program referral (nominal, wilayah, deskripsi).

**Konsumen di situs** (semua lewat `getPricing()` di `src/lib/cms/api.ts`, ISR 300 dtk + tag `pricing`, fallback `src/data/pricing-fallback.ts`):
- Halaman produk: section **Harga & Skema** (`src/app/_product/pricing-section.tsx`) + JSON-LD `AggregateOffer` (`src/lib/seo/product-page.ts`).
- Landing dan `/products`: harga "Mulai Rp … (OTR wilayah default)".
- `/baas`: model & paket dari skema `baas` (`baasModelsFrom()` di `src/app/[locale]/baas/data.ts`).
- `/ojol`: isi dialog Sewa Milik/Sewa Harian dari skema `rent-to-own`/`rental` (`src/app/[locale]/ojol/programs.ts`).
- `/super-charge`: baris tarif SuperCharge. `llms.txt`: bagian "Pricing" lengkap untuk AI crawler.

Setiap simpan di admin mem-bust cache API (tag `pricing`) dan memanggil webhook `/api/revalidate` Next, jadi perubahan tampil dalam hitungan detik. Seed awal: `server/prisma/seed-data/pricing.json` (sumber: knowledge source Dion v4, 25 Sep 2026; BaaS dari kampanye Sep 2026), dijalankan `npm run db:seed` (idempoten, tidak menimpa perubahan admin). Snapshot statis dibuat ulang dengan `node server/prisma/pricing-sync.mjs --fallback`.

**Mengisi/menyinkronkan DB yang sudah berjalan (staging/produksi)** dari `seed-data/pricing.json` tanpa menyentuh tabel lain:
```bash
node server/prisma/pricing-sync.mjs > /tmp/pricing-sync.sql     # tinjau dulu isinya
# di VPS: backup lalu jalankan (satu transaksi, aman diulang)
~/wedison-prod/bin/backup-db.sh pre-pricing-sync
psql "${DATABASE_URL%%\?*}" -v ON_ERROR_STOP=1 -f /tmp/pricing-sync.sql
```
Nilai di seed menimpa baris dengan kunci yang sama (slug wilayah/skema, wilayah × skema × model × varian); baris tambahan dari admin dibiarkan. Cache API publik habis dalam `CACHE_TTL_PUBLIC` (300 dtk), lalu panggil `/api/revalidate` dengan tag `pricing` atau tunggu ISR. Tes: `server/test/pricing.api.test.ts`.

## Modul Showroom Locations (Showrooms › Locations)

Satu sumber data cabang di **/admin/showrooms** (tabel `Showroom`). Dipakai: form booking (daftar cabang, jam slot, WA cabang), halaman `/showroom` (peta, kartu, status buka/tutup, kartu "Segera hadir"), halaman Kontak, JSON-LD `MotorcycleDealer` (jam buka + `specialOpeningHoursSpecification` untuk tanggal tutup), `llms.txt`, FAQ showroom (fasilitas & jam), label cabang di admin Leads, Google Calendar (nama/alamat/zona waktu), dan Opening Teasers.

- **Izin**: `showrooms.view` (lihat), `showrooms.write` (tambah/ubah, aksi cepat), `showrooms.delete` (hapus showroom tanpa booking). Role bawaan via migrasi `20261028080000_showrooms`: `admin` semua, `marketing` view+write, `sales` view. Admin Leads mendapat label cabang lewat `GET /admin/leads/showrooms`, editor teaser lewat `GET /admin/teasers/showroom-options` (tanpa izin modul Showrooms).
- **Status**: `OPEN` (tampil + bisa di-booking bila "Accept bookings"), `COMING_SOON` (default tersembunyi; bila "Show on the site" aktif hanya kartu kota "Segera hadir"), `TEMPORARILY_CLOSED` (tetap tampil berlabel, tidak bisa di-booking), `CLOSED` (hilang dari situs, riwayat booking tetap). Showroom yang ditampilkan sebagai lokasi wajib punya alamat, kota, dan titik peta; yang OPEN wajib punya minimal satu hari buka (divalidasi server & editor).
- **Kode** (`id`, mis. `jakarta`) tetap selamanya karena disimpan di `Booking.showroom`. Showroom yang punya riwayat booking tidak bisa dihapus (409) — ubah ke `CLOSED`.
- **Jam buka** per hari (Senin–Minggu, null = tutup) + jam libur nasional (hanya tampilan) di zona waktu cabang; **tanggal tutup khusus** (rentang + catatan) menghapus slot booking dan tampil di kartu ("Tutup 2–3 Nov · Renovasi"). Editor memperingatkan bila tanggal tutup bentrok dengan booking aktif.
- **Opening Teasers**: teaser bisa ditautkan ke showroom; nama, alamat, Maps, WA, email, dan zona waktu disalin dari showroom saat disimpan dan disinkronkan otomatis setiap showroom diubah. Saat status berubah `COMING_SOON → OPEN`, editor menawarkan mengarsipkan teaser yang masih tayang (URL-nya lalu 308 ke `/showroom/`).
- **Data publik**: `GET /public/showrooms` (cache tag `showrooms`, revalidate webhook). Next mengambilnya sekali di layout locale (`getShowrooms()` → `ShowroomsProvider`); backend tidak terjangkau → snapshot `src/data/showrooms-fallback.ts`.
- **API admin**: `GET|POST /admin/showrooms`, `GET|PUT|PATCH|DELETE /admin/showrooms/:id` (PATCH = aksi cepat status/tampil/booking, divalidasi ulang dengan aturan lengkap), `GET /admin/showrooms/check-id`. Tes: `server/test/showrooms.api.test.ts`.

## Modul Opening Teasers (landing pembukaan showroom)

Landing page teaser pembukaan cabang baru dikelola di **/admin/teasers** (menu *Showrooms › Opening Teasers*); halaman publiknya `/{id|en}/showroom/{slug}/`. **Desain tetap di kode** (`src/app/[locale]/showroom/[slug]/`); admin hanya mengatur wording ID/EN, jadwal + hitung mundur, 7 slot gambar, alamat, dan titik kontak (WhatsApp, email, Google Maps). Tidak perlu developer untuk kota berikutnya.

- **Izin** (`server/src/lib/permissions.ts`): `teasers.view` (lihat + preview), `teasers.write` (buat/ubah draf, duplikat, upload media), `teasers.publish` (publish/unpublish/arsip + mengubah teaser yang sedang tayang), `teasers.delete` (hapus teaser yang tidak tayang). Pemegang `teasers.view/write` juga boleh membuka/mengunggah ke Media Library (ubah/hapus media tetap khusus CMS). Role bawaan (migrasi `20261028020100_teaser_role_permissions`): `admin` semua, `marketing` view+write+publish, `editor` view+write.
- **Status**: `DRAFT` (404 publik, hanya preview) → `PUBLISHED` → `ARCHIVED` (URL lama 308 ke `/showroom/`). Publish ditolak server selama checklist belum beres (`teaserIssues()` di `server/src/modules/teasers/teaser.schema.ts`, mirror `src/lib/teasers/issues.ts`): alamat, minimal satu model & promo, judul tiap section di kedua bahasa, dan tidak ada teks `[placeholder]` sisa template. Teaser yang sedang tayang juga harus tetap lengkap saat disimpan.
- **Template**: teaser baru terisi wording standar (`src/lib/teasers/template.ts`) dengan token `{city}` `{showroom}` `{date}` `{time}` `{address}` yang diisi otomatis saat tampil; tiap section bisa di-reset ke template.
- **Jadwal**: disimpan UTC (`startAt`/`endAt`), diedit dalam zona waktu showroom (WIB/WITA/WIT), bukan zona browser admin.
- **Gambar**: slot kosong memakai foto default (tidak pernah kotak kosong); editor menampilkan rasio/ukuran ideal dan memperingatkan bila rasio/resolusi tidak cocok. Spesifikasi di `IMAGE_SLOT_SPEC` (`src/lib/teasers/teaser.ts`).
- **Preview draf**: tombol Preview → `/api/preview/teaser/?slug=…&locale=…` (cek sesi admin + izin) → Next **draft mode** → halaman dirender dengan data admin, bilah "Preview", `noindex`, form tidak mengirim apa pun. Keluar: `/api/preview/exit/`.
- **Inquiry**: form di halaman memakai komponen form kontak yang sama, `source = teaser-{id}` (stabil walau slug diganti). Muncul di *Leads › Contact Messages* dengan Source "Teaser: {kota}" (filter dinamis dari `GET /admin/leads/contacts/sources`); jumlahnya tampil di daftar teaser. Event GTM: `contact_submit_success` (`contact_source`, `contact_topic`, `contact_locale`). Semua elemen halaman ber-ID awalan `teaser-` untuk trigger GTM.
- **SEO**: title/description/keywords per bahasa, opsi "Hide from search engines", JSON-LD BreadcrumbList + Event + FAQPage, masuk `sitemap.xml` bila tayang dan tidak noindex. Simpan/publish mem-bust cache API (tag `teasers`) dan memanggil webhook `/api/revalidate`.
- **API**: admin `GET|POST /admin/teasers`, `GET|PUT|DELETE /admin/teasers/:id`, `POST /admin/teasers/:id/transition` (`publish|unpublish|archive|restore`), `POST /admin/teasers/:id/duplicate`, `GET /admin/teasers/check-slug`, `GET /admin/teasers/by-slug/:slug` (preview); publik `GET /public/teasers` dan `GET /public/teasers/:slug`. Tes: `server/test/teasers.api.test.ts`.

## Roadmap modul

- [x] CMS: artikel dwibahasa (Tiptap, cover + alt, topics, tag, jadwal otomatis tayang, sampah, aksi massal), liputan pers (scrape OG), sosial media (thumbnail lokal, urutan), media library (WebP otomatis), topics/tag.
- [x] SEO artikel: SEO title/meta description (+ preview snippet Google), keywords, canonical override, OG title/description + gambar share khusus, noindex, hreflang per locale tersedia, JSON-LD NewsArticle.
- [x] Scheduler: `server/src/lib/scheduler.ts` menayangkan artikel/liputan berstatus SCHEDULED tiap 60 detik (dan saat daftar admin dibuka).
- [x] UI admin berbahasa Inggris; "Kategori" ditampilkan sebagai **Topics** (model DB tetap `Category`, API tersedia di `/admin/topics` dan `/admin/categories`).
- [x] Sistem: login, pengguna + **role kustom berbasis izin** (anti-lockout, tes vitest/supertest), log aktivitas, akun saya, dashboard statistik.
- [x] Editor artikel: impor Word/PDF ke body, toolbar sticky + bubble menu seleksi, tabel.
- [x] SuperCharge: form tambah/edit lokasi + pemilih koordinat di peta + aksi massal.
- [x] Pricing: wilayah × skema × model × varian, S&K, tarif SuperCharge, referral; section harga di produk, landing, BaaS, ojol; JSON-LD Offer; llms.txt.
- [x] Showroom Locations: CRUD cabang (status, jam buka per hari, tanggal tutup, titik peta, kontak, foto) sebagai sumber tunggal booking, halaman Showroom/Kontak, JSON-LD, llms.txt, dan teaser.
- [x] Opening Teasers: landing pembukaan showroom dari admin (template + token, checklist publish, preview draft mode, inquiry ke Leads).
- [ ] Modul berikutnya (menyusul).
