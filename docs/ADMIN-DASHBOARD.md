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

`POST /public/leads/contacts` adalah sumber kebenaran: form `/corporate/contact` menunggu respons ini sebelum menampilkan "terkirim"; notifikasi email via EmailJS dikirim setelahnya secara best-effort (gagal hanya dicatat di console). Server memverifikasi reCAPTCHA (bila `RECAPTCHA_SECRET_KEY` diset) dan **idempoten**: email + isi pesan yang sama dalam 15 menit mengembalikan id yang sama (`duplicate: true`) sehingga klik ganda/kirim ulang tidak menggandakan pesan di admin. Tombol **Reply by email** membuka mailto berisi sapaan, topik, slot balasan, dan kutipan pesan asli (bahasa mengikuti locale form) — `src/lib/admin/contact-reply.ts`.

## Editor artikel: impor dokumen & toolbar melayang

**Impor dokumen (Word/PDF)** — tombol **Import document** di sebelah tab bahasa pada form artikel (`src/components/admin/import-document-dialog.tsx`). Mengisi *body* locale yang aktif saja; judul, slug, dan SEO tetap manual.

- Backend: `server/src/lib/doc-import/` — `docx.ts` (mammoth: heading Word 1–6 → h1–h6, list, tabel, bold/italic/underline, link, gambar inline), `pdf.ts` (pdfjs-dist, *best-effort*: paragraf dari jarak baris, heading dari ukuran font relatif, bold/italic dari nama font, bullet/nomor → list, gambar raster via operator list, header/footer & nomor halaman dibuang, maks 60 halaman). `.doc` lama ditolak (minta simpan ulang sebagai .docx). PDF hasil scan tanpa teks → peringatan, tanpa OCR.
- Gambar diekstrak lalu disimpan ke Media Library (`storeImageBuffer()` di `media.routes.ts`, folder `articles/import`, otomatis WebP) sehingga HTML hanya berisi URL, bukan base64.
- Output selalu lewat `sanitizeArticleHtml` (whitelist sama dengan editor). Response memuat `warnings` (mis. heading hasil tebakan) dan `stats` (kata, paragraf, heading, list, tabel, gambar, halaman).
- Dialog: drag-and-drop/browse → **Convert** (progress upload + konversi) → ringkasan + peringatan → **Replace body** / **Append to body** (replace minta konfirmasi bila body sudah berisi; semua bisa di-Undo). Konten dimasukkan ke editor via `onReady(editor)` tanpa remount.
- Setelah impor, penulis tetap memeriksa level heading (H1 di body → H2), alt text gambar, dan link.

**Toolbar melayang** — toolbar utama Tiptap kini benar-benar *sticky* tepat di bawah header admin (`.simple-editor-wrapper` tidak lagi `overflow:auto`; `top: 3.5rem`). Saat teks diseleksi muncul *bubble menu* ringkas (`src/components/tiptap-ui/selection-bubble-menu/`): heading, list, bold/italic/underline/strike/code, highlight, link; disembunyikan di layar ≤480px (toolbar mobile sudah menempel di keyboard), pada gambar dan code block.

**Tabel** — `@tiptap/extension-table` (TableKit, kolom bisa di-resize) + dropdown **Table** di toolbar (`src/components/tiptap-ui/table-dropdown-menu/`): sisip 3×3, tambah/hapus baris & kolom, header row, merge/split, hapus tabel. Dibutuhkan agar tabel dari Word tidak hilang saat diimpor.

## Roadmap modul

- [x] CMS: artikel dwibahasa (Tiptap, cover + alt, topics, tag, jadwal otomatis tayang, sampah, aksi massal), liputan pers (scrape OG), sosial media (thumbnail lokal, urutan), media library (WebP otomatis), topics/tag.
- [x] SEO artikel: SEO title/meta description (+ preview snippet Google), keywords, canonical override, OG title/description + gambar share khusus, noindex, hreflang per locale tersedia, JSON-LD NewsArticle.
- [x] Scheduler: `server/src/lib/scheduler.ts` menayangkan artikel/liputan berstatus SCHEDULED tiap 60 detik (dan saat daftar admin dibuka).
- [x] UI admin berbahasa Inggris; "Kategori" ditampilkan sebagai **Topics** (model DB tetap `Category`, API tersedia di `/admin/topics` dan `/admin/categories`).
- [x] Sistem: login, pengguna + **role kustom berbasis izin** (anti-lockout, tes vitest/supertest), log aktivitas, akun saya, dashboard statistik.
- [x] Editor artikel: impor Word/PDF ke body, toolbar sticky + bubble menu seleksi, tabel.
- [ ] SuperCharge: form tambah/edit lokasi + pemilih koordinat di peta (API CRUD sudah siap; UI baru daftar/pencarian).
- [ ] Modul berikutnya (menyusul).
