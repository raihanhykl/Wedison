# Admin Dashboard & Backend (branch `feature/admin-dashboard`)

Panel admin di `/admin` (Next.js, tidak dilokalisasi) + backend **Express 5 + PostgreSQL + Prisma 7** di folder `server/`.

## Arsitektur singkat

```
browser ──/admin/*──▶ Next.js (:3000) ──rewrite /api/*──▶ Express API (:4000) ──▶ PostgreSQL
                     │  halaman publik (SSR/ISR, cache bertag)  ▲
                     └──────────── webhook /api/revalidate ◀────┘ (setelah admin ubah data)
```

- **Frontend admin**: `src/app/admin/**` (login, dashboard, CMS, SuperCharge, pengguna, log). Komponen: shadcn/ui + TanStack Table/Query + Tiptap (template resmi `simple-editor`).
- **Backend**: `server/src` — `modules/*` (auth, users, articles, taxonomy, press, social, media, stations, dashboard, activity), `lib/cache.ts` (LRU in-memory bertag), `lib/metadata.ts` (scraper OG), `middleware/auth.ts` (JWT cookie httpOnly, role).
- **Caching 3 lapis**:
  1. Backend: `cached(key, tags, fn)` (LRU, TTL `CACHE_TTL_PUBLIC`) + header `Cache-Control: s-maxage` di `/api/v1/public/*`.
  2. Next.js: `fetch(..., { next: { revalidate, tags } })` di `src/lib/cms/api.ts` (ISR).
  3. On-demand: setiap write admin → `invalidate(tags)` → `POST {FRONTEND_URL}/api/revalidate` → `revalidateTag`.
- **Halaman publik yang sudah memakai CMS**: `/media-center` (artikel, liputan pers, Instagram), `/media-center/news/[slug]`, `/media-center/artikel/[slug]` (baru), `/super-charge/lokasi`. Semua fail-soft ke data statis lama bila backend kosong/mati.

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
| `GET /public/articles/:slug?locale=` | `GET/POST/PATCH/DELETE /admin/topics` (alias `/admin/categories`), `/admin/tags` |
| `GET /public/press`, `GET /public/press/:slug` | `/admin/press` + `POST /admin/press/fetch-metadata`, `POST /admin/press/:id/refresh`, `POST /admin/press/reorder` |
| `GET /public/social?platform=` | `/admin/social` + `fetch-metadata`, `:id/refresh`, `reorder` |
| `GET /public/stations` (GeoJSON) | `/admin/stations` (CRUD) |
| `GET /public/categories` | `GET /admin/media`, `POST /admin/media/upload` (multipart `files[]`, `folder`), `PATCH/DELETE /admin/media/:id` |
| | `/auth/login|logout|me|change-password|profile`, `/admin/users` (SUPER_ADMIN), `/admin/activity`, `/admin/dashboard/stats` |

Role: `SUPER_ADMIN` (semua + kelola user) · `ADMIN` (semua konten, hapus permanen) · `EDITOR` (tulis/edit, tanpa hapus permanen).

## Deploy VPS (ringkas)

- Jalankan API dengan PM2 (`server/dist/index.js`, `NODE_ENV=production`, `COOKIE_SECURE=true`), Postgres lokal VPS.
- nginx: `location /api/ { proxy_pass http://127.0.0.1:4000; }` di depan Next (atau biarkan rewrite Next yang meneruskan). Folder `server/uploads` harus persisten (di luar folder rilis) dan writable.
- Set `FRONTEND_URL` = origin situs publik agar webhook revalidate sampai.

## Roadmap modul

- [x] CMS: artikel dwibahasa (Tiptap, cover + alt, topics, tag, jadwal otomatis tayang, sampah, aksi massal), liputan pers (scrape OG), sosial media (thumbnail lokal, urutan), media library (WebP otomatis), topics/tag.
- [x] SEO artikel: SEO title/meta description (+ preview snippet Google), keywords, canonical override, OG title/description + gambar share khusus, noindex, hreflang per locale tersedia, JSON-LD NewsArticle.
- [x] Scheduler: `server/src/lib/scheduler.ts` menayangkan artikel/liputan berstatus SCHEDULED tiap 60 detik (dan saat daftar admin dibuka).
- [x] UI admin berbahasa Inggris; "Kategori" ditampilkan sebagai **Topics** (model DB tetap `Category`, API tersedia di `/admin/topics` dan `/admin/categories`).
- [x] Sistem: login/role, pengguna, log aktivitas, akun saya, dashboard statistik.
- [ ] SuperCharge: form tambah/edit lokasi + pemilih koordinat di peta (API CRUD sudah siap; UI baru daftar/pencarian).
- [ ] Modul berikutnya (menyusul).
