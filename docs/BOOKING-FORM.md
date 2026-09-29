# Booking Form & Leads (branch `feature/booking-form`)

Modal booking untuk tombol **Test Ride** (navbar desktop, sheet mobile, hero landing) dan **Booking Kunjungan / Book a Visit** (kartu showroom di `/[locale]/showroom`), plus modul **Leads** di admin dashboard (`/admin/leads`) yang menampung booking, pesan form kontak, kalender, dan analytics.

## Alur end-to-end

1. User klik tombol -> `openBooking({ showroom?, purpose?, source })` dari `useBooking()` (`src/components/booking/`).
   - **Test Ride** -> `purpose: "testRide"` terisi, showroom dipilih user.
   - **Book a Visit** di kartu showroom -> `showroom` terisi (mis. `bekasi`), tujuan dipilih user.
2. Form (react-hook-form + zod, `src/lib/booking/schema.ts`): showroom, tujuan, nama, no. HP, email (opsional), tanggal, waktu, catatan (opsional), honeypot, reCAPTCHA (bila site key ada).
   - Slot waktu (`src/lib/booking/slots.ts`): Sen-Jum 10:00-19:00, Sab-Min 10:00-17:00, tiap 30 menit, sesi 60 menit, hari ini minimal 60 menit dari sekarang, maksimal 60 hari ke depan. Bali memakai WITA.
3. Submit -> `POST /api/v1/public/leads/bookings/` (Next me-rewrite `/api/v1/*` ke backend Express `server/`):
   - validasi ulang + cek slot (`server/src/modules/leads/booking-rules.ts`, cermin dari lib client), honeypot, rate limit 5 / 10 menit / IP, reCAPTCHA v2 (hanya bila `RECAPTCHA_SECRET_KEY` di-set),
   - **simpan ke tabel `Booking`** (status `NEW`),
   - **sinkron ke Google Calendar** cabang (`server/src/modules/leads/google-calendar.ts`, service account). Hasil dicatat di `calendarStatus` (`SAVED | FAILED | SKIPPED`), event ID & link disimpan. Gagal/belum dikonfigurasi TIDAK menggagalkan booking.
4. Setelah sukses, di browser:
   1. **Tampilan "Terima kasih"** di dalam modal + push `dataLayer` event `booking_success` (GTM).
   2. **Tab WhatsApp** `wa.me/<nomor cabang>` dengan pesan prefilled (`src/lib/booking/whatsapp.ts`). Tab dibuka saat klik submit (anti popup-blocker) lalu diarahkan setelah server menjawab; ada tombol cadangan "Buka WhatsApp".
5. Form kontak (`/[locale]/corporate/contact`, `src/components/contact3.tsx`) kini juga mengirim salinan ke `POST /api/v1/public/leads/contacts/` (fail-soft, tidak memblokir EmailJS) -> tabel `ContactSubmission`.

Nomor WhatsApp per cabang (`src/lib/booking/showrooms.ts` dan `server/src/modules/leads/booking-rules.ts`, **ubah di keduanya**):

| Cabang | Nomor |
|---|---|
| Jakarta, Bekasi | 6285286126550 |
| Bandung | 6285286126558 |
| Bali | 6285801011969 |

## Modul Leads di admin (`/admin/leads`)

| Halaman | Isi |
|---|---|
| **Overview** `/admin/leads` | Kartu: booking dalam rentang, kunjungan 7 hari ke depan, booking status New, pesan kontak (+ belum ditangani). Chart: booking per hari, pesan per hari, per tujuan, per showroom, per titik masuk (tombol mana), pipeline status, topik kontak. Daftar kunjungan mendatang, pesan terbaru, booking terbaru. Filter rentang 7/30/90/365 hari. Export CSV. |
| **Bookings** `/admin/leads/bookings` | Tabel + filter (cari nama/HP/email, showroom, tujuan, status, rentang tanggal kunjungan, "Upcoming only"). Aksi: detail (sheet), WhatsApp/email customer, ubah status (`NEW -> CONTACTED -> CONFIRMED -> COMPLETED`, `CANCELLED`, `NO_SHOW`), sync ke kalender, catatan internal, hapus (ADMIN). Status `CANCELLED` otomatis menghapus event kalender. Export CSV mengikuti filter. |
| **Contact Messages** `/admin/leads/contacts` | Tabel pesan form kontak, filter handled/unhandled, detail, balas via email/WA, tandai handled, catatan internal, hapus (ADMIN). |
| **Calendar** `/admin/leads/calendar` | Embed Google Calendar "Booking Showroom" (Month/Week/Agenda, zona waktu WIB/WITA) + daftar kunjungan berikutnya dari DB + tombol buka di Google Calendar. Calendar ID di `src/lib/admin/calendar.ts` (override: `NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_ID`). Catatan: embed hanya menampilkan event bila akun Google yang login punya akses ke kalender (atau kalender dibuat publik). |

Dashboard utama (`/admin`) menampilkan kartu "Booking requests" (total, baru, kunjungan 7 hari, pesan belum ditangani).

## Endpoint backend (`/api/v1`)

| Publik (rate limit) | Admin (cookie JWT) |
|---|---|
| `POST /public/leads/bookings` | `GET /admin/leads/stats?from&to` |
| `POST /public/leads/contacts` | `GET /admin/leads/bookings?q&showroom&purpose&status&from&to&upcoming&page&limit&sort&order` |
| | `GET /admin/leads/bookings/export` (CSV, filter sama) |
| | `GET/PATCH/DELETE /admin/leads/bookings/:id` (PATCH: `status`, `adminNote`) |
| | `POST /admin/leads/bookings/:id/calendar-sync` |
| | `GET /admin/leads/contacts?q&handled&from&to`, `PATCH/DELETE /admin/leads/contacts/:id` (PATCH: `isHandled`, `adminNote`) |

Semua role bisa melihat & mengubah status; hapus permanen hanya `ADMIN`/`SUPER_ADMIN`.

## Event GTM (dataLayer)

| Event | Kapan | Parameter |
|---|---|---|
| `booking_open` | modal dibuka | `booking_source`, `booking_purpose`, `booking_showroom`, `booking_locale` |
| `booking_success` | submit sukses (= "thank you page") | `booking_source`, `booking_purpose`, `booking_showroom`, `booking_date`, `booking_locale`, `booking_calendar`, `page_path` (`/{locale}/booking/thank-you/`), `page_title` |
| `booking_error` | submit gagal | `booking_reason` |

## Setup Google Calendar (sekali)

1. Google Cloud Console -> project -> **APIs & Services > Enable** "Google Calendar API".
2. **IAM & Admin > Service Accounts > Create** (mis. `wedison-booking`) -> buat key **JSON**, unduh.
3. Google Calendar "Booking Showroom" -> **Settings > Share with specific people** -> tambahkan email service account dengan akses **Make changes to events**.
4. Isi `server/.env` (lihat `server/.env.example`):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `client_email`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` = `private_key` (satu baris, newline sebagai `\n`), **atau** `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` = `base64 -i service-account.json`
   - `GOOGLE_CALENDAR_ID` (sudah diisi ID kalender "Booking Showroom"); opsional per cabang `GOOGLE_CALENDAR_ID_JAKARTA|BEKASI|BANDUNG|BALI`.
5. Restart backend (`npm run dev:api` / `pm2 restart wedison-api`). Booking lama yang belum masuk kalender bisa disinkronkan lewat tombol "Sync to calendar" di admin.

Catatan: service account tidak bisa menambahkan *attendee* tanpa domain-wide delegation, jadi data customer dicatat di deskripsi event (nama, HP, email, catatan, link wa.me, link admin).

## Migrasi database

Migrasi `server/prisma/migrations/20260928100000_leads_bookings_contacts` (enum `BookingPurpose`, `BookingStatus`, `CalendarSyncStatus`; tabel `Booking`, `ContactSubmission`). Di VPS diterapkan otomatis oleh workflow (`prisma migrate deploy`). Lokal: `npm run db:migrate` (atau `npx prisma migrate deploy` di `server/`).

## Uji cepat

```bash
# booking (tanpa Google -> calendar: "skipped", tetap tersimpan & tampil di admin)
curl -s -X POST http://localhost:3000/api/v1/public/leads/bookings/ -H 'Content-Type: application/json' \
  -d '{"showroom":"bekasi","purpose":"testRide","name":"Tes Booking","phone":"081234567890","date":"2026-10-06","time":"10:00","source":"navbar","locale":"id"}'
# pesan kontak
curl -s -X POST http://localhost:3000/api/v1/public/leads/contacts/ -H 'Content-Type: application/json' \
  -d '{"name":"Ani","email":"ani@example.com","phone":"081211112222","topic":"Test Ride","message":"Halo"}'
```

## File terkait

- Client: `src/lib/booking/{showrooms,schema,slots,whatsapp,analytics}.ts`, `src/components/booking/*`, `src/components/contact3.tsx`
- Backend: `server/src/modules/leads/{booking-rules,google-calendar,leads.routes}.ts`, `server/prisma/schema.prisma`
- Admin: `src/app/admin/(dashboard)/leads/**`, `src/components/admin/charts.tsx`, `src/lib/admin/{types,calendar}.ts`, `src/components/admin/nav-config.ts`
- Pemasangan tombol: `src/app/[locale]/layout.tsx`, `src/components/navbar.tsx`, `src/components/nav/nav-sheet.tsx`, `src/app/_home/landing.tsx`, `src/app/[locale]/showroom/components/structure.tsx`
