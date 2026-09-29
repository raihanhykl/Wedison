# Rencana: Halaman SuperCharge Locator (Peta Interaktif + Card Detail)

> Status: **PLANNING** (belum coding). Hasil riset 4-lensa (workflow multi-agent) + sintesis.
> Konteks: halaman locator jaringan pengisian "SuperCharge" — peta interaktif + pin + card detail per lokasi (alamat, jumlah charging piles, fasilitas, jam operasional, dll). Menyambung ke future **admin backend** (CRUD site). Data harus dinamis (DB-backed) nantinya.

---

## 1. Ringkasan Eksekutif (TL;DR)

| Keputusan | Rekomendasi | Alasan |
|---|---|---|
| **Library peta** | **MapLibre GL JS** via `react-map-gl/maplibre` | Open-source, nol biaya/token, cakupan Indonesia (OSM) bagus, styling brand penuh (Sage+Ink), API = Mapbox |
| **Sumber tile** | OpenFreeMap (MVP) → **Protomaps PMTiles self-host di VPS** (produksi) | Biaya ~nol, kontrol style light/dark penuh, selaras filosofi self-host Wedison |
| **Clustering** | MapLibre built-in `cluster:true` (→ supercluster bila butuh marker React custom) | Skala Wedison (puluhan–ratusan titik) cukup dengan bawaan |
| **Layout** | Split **map + list ter-sinkron** (desktop) · **bottom-sheet** nonmodal (mobile, ala Gojek) | Pola locator terbukti + familiar untuk user Indonesia |
| **Data** | GeoJSON statis → Route Handler → **Postgres + PostGIS** | UI selalu fetch endpoint yang sama → admin CRUD "colok saja" |
| **Routing** | `/id/supercharge/lokasi` (+ opsional per-kota `/lokasi/[kota]` utk SEO) | SSR + i18n Wedison; SEO lokal (pola Ola) |

**Peluang diferensiasi utama:** kompetitor terdekat (Ather, Gogoro, NIO, Hyundai, bahkan Electrify America) **menyembunyikan penemuan lokasi di balik app atau menyerahkannya ke Google Maps**. Ather bahkan pakai **PDF statis**. Wedison bisa **menang telak** dengan **web locator publik yang cantik, tenang, cepat, ber-brand** — bisa dijelajah tamu tanpa login/app.

---

## 2. Katalog Referensi (semua URL terverifikasi saat riset)

### 2.1 Brand kendaraan EV — PALING relevan (Wedison = brand kendaraan, bukan utilitas)
| Brand | URL | Yang layak dicuri | Catatan |
|---|---|---|---|
| **Ather Grid** ⭐ (motor listrik, India) | atherenergy.com/charging | Skema **4-status** eksplisit (Tersedia/Terpakai/Maintenance/Tutup) + refresh 1-tap; angka coverage percaya diri ("5.900+ titik, 100+ kota") | **Anti-pattern:** web miskin, dipaksa ke app + **PDF statis** → peluang Wedison |
| **Ola Hypercharger** ⭐ (motor listrik, India) | olaelectric.com/hypercharger-network + `/[kota]` | **URL per-kota** untuk SEO lokal; list+map berdampingan; **CTA brand di card** ("Test Ride"); badge "BUKA SEKARANG" | **Anti-pattern:** tak ada real-time (hanya jam); over-marketing |
| **VinFast** ⭐ (situs **.id**, bilingual) | vinfastauto.id/find-us | Field **jumlah+jenis charging port**; jam; **biaya parkir**; deep-link **Apple Maps + Waze**; gabung **Showroom + Charging** dalam 1 peta; toggle bahasa menyatu | Peta HERE (estetika generik) → Wedison unggul dgn MapLibre bergaya |
| NIO Power | nio.com/nio-power | Layer ganda (charge + swap); storytelling coverage per wilayah | App-first; web locator minim |
| Rivian Adventure Network | rivian.com/experience/charging | **Juara storytelling**: framing emosional (titik = destinasi, bukan colokan); angka coverage sbg hero | Minim data utilitas per lokasi |
| Tesla Find Us | tesla.com/findus | Amenities sbg baris **ikon** tap-able; filter tipe lokasi; prediksi ketersediaan; site-map 3D per-stall (fase lanjut) | Peta kustom mahal; nada murni utilitas |
| Polestar Charging Map | polestar.com/../charging-map | — | **Pelajaran negatif:** agregator jaringan orang lain → jangan tiru (Wedison punya jaringan sendiri) |
| Zero / BYD / Hyundai-Kia / Lucid | (app/pihak-ketiga) | — | Locator = app; motor listrik pun sering absen web locator → celah Wedison |

### 2.2 Jaringan pengisian EV (utilitas) — best-practice card & filter
| Network | URL | Yang layak dicuri | Peta |
|---|---|---|---|
| **BP Pulse** ⭐⭐ (card TERLENGKAP) | uk-chargers.bppulse.com/en | Blueprint card: **X/Y available real-time**, konektor+maxkW, jam, telepon, foto, rating; **"Search this Area"**; filter konektor + kecepatan bucket + amenities | **Mapbox + OSM (verified)** |
| **Electrify America** ⭐ | electrifyamerica.com/locate-charger | **Split map+list**; **edukasi konektor inline** (untuk pasar awam EV); ketersediaan **per kelas kW** ("2/4 @150kW") | push real-time ke Google Maps |
| **Ionna** ⭐ (filter terbaik) | ionna.com/rechargeries/find-a-rechargery | **Taksonomi tipe lokasi** (flagship/relay/co-brand) + **filter amenities granular berikon** + status Open/Opening Soon | — |
| PlugShare (pola split kanonik) | plugshare.com | Detail di **panel kiri**; chip konektor; **badge skor berwarna** per baris | Google Maps |
| IONITY | ionity.eu/network | Layer **"Coming Soon/under construction"** (narasi ekspansi); route planner SoC+cuaca | — |
| Gridserve | electrichighway.gridserve.com | Jumlah charger + **live status** + facilities (destination charging) | — |
| ChargePoint | na.chargepoint.com/charge_point | Konsep **Waitlist** (antre saat penuh) | — |
| Fastned | fastnedcharging.com/en/locations | **Kekuatan brand** (identitas kuning ikonik) | Google Maps — **anti-pattern: cookie wall blokir peta** |
| Shell Recharge / EVgo | shellrecharge.com · evgo.com | filter rapid/ultra-rapid; harga transparan | **Anti-pattern:** IA multi-URL locator |
| Gogoro Network (swap skuter) | network.gogoro.com/../coverage | Framing **coverage/kepadatan** sbg narasi | — |

### 2.3 Konteks Indonesia (familiaritas lokal)
| Ref | URL | Yang layak dicuri |
|---|---|---|
| **petaspklu.id** ⭐ (peta SPKLU RI) | petaspklu.id | Hierarki wilayah **Pulau→Provinsi→Kota**; klasifikasi kW jelas (Standard<7 / Medium 7–22 / Fast 22–55 / Ultrafast>50) |
| **Gojek/Grab** (mental model peta) | (app) | **Bottom-sheet** di atas peta full-screen + FAB "lokasi saya" — pola yang dikenali jutaan user Indonesia |
| BCA Lokasi | bca.co.id/id/lokasi-bca | Tab pemisah tipe (ATM/Cabang); center default cerdas saat izin ditolak | **Anti-pattern:** tanpa peta interaktif, empty state buntu, pagination kaku |

### 2.4 Pola interaksi lintas industri
| Ref | URL | Yang layak dicuri |
|---|---|---|
| **Airbnb** ⭐ (kiblat sync) | airbnb.com · medium.com/airbnb-engineering/improving-search-ranking-for-maps-13b03f2c2cca | **Two-way sync** (hover card↔pin, klik pin↔scroll card); **"Search as I move the map"** toggle; marker bawa data (harga→status); state "sudah dilihat"; bottom-sheet detent |
| Baymard (94 contoh) | baymard.com/ecommerce-design-examples/store-locator | Empty state **konstruktif** (auto-perlebar radius + saran); lazy-load; default radius |
| Starbucks / IKEA | starbucks.com/store-locator · ikea.com/us/en/stores | Marker beda per tipe (drive-thru→AC/DC); filter atribut dipertahankan; near-me |
| Map UI Patterns | mapuipatterns.com/store-locator | Katalog pola locator |

### 2.5 Kelas premium / Awwwards (untuk "wow moment" tenang — TERPISAH dari tool)
| Ref | URL | Yang layak dicuri |
|---|---|---|
| BONHOMME scroll-locator | awwwards.com/inspiration/scroll-triggered-studio-locator-map (jybh.fr) | Lokasi di-reveal seiring scroll (untuk section **cerita jaringan**, bukan tool) |
| **Codrops GSAP SVG map** | tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap | `DrawSVGPlugin` (koridor jaringan menggambar diri), `MotionPathPlugin` (marker menyusuri jalur), `quickTo`, `ScrollTrigger` — **tanpa map API, ringan, full Sage+Ink** |
| NN/g Bottom Sheets | nngroup.com/articles/bottom-sheet | Sheet **nonmodal** (tetap bisa pan peta), drag-handle, detent peek/half/full |

---

## 3. Rekomendasi Stack Teknis

- **Engine:** MapLibre GL JS via `react-map-gl/maplibre` (v8.1). `npm i react-map-gl maplibre-gl`; `import Map from 'react-map-gl/maplibre'` + CSS. WebGL vector, client-only.
- **Tiles:** OpenFreeMap (gratis, tanpa key) untuk MVP → **Protomaps PMTiles** (1 file, self-host di VPS/R2, byte-range HTTP) untuk produksi. Style JSON dicat **Sage+Ink** (deep green #1E5B40, Snow/Ink) — buat varian light & dark.
- **Clustering:** MapLibre source `cluster:true` (cukup untuk skala Wedison); upgrade ke `supercluster` bila ingin marker React custom bergaya brand.
- **Search/geocoding (opsional):** hybrid — MapLibre untuk peta + Google Geocoding/Places HANYA bila butuh autocomplete alamat (bayar per-request). MVP cukup search kota dari data sendiri + "near me" (`navigator.geolocation`).
- **Hindari:** Google Maps sebagai basemap (mahal per-mapload sejak kredit $200 dihapus Mar 2025; keunggulan POI mubazir untuk titik milik sendiri) & cookie wall (Fastned).

## 4. Skema Data Lokasi (= skema DB untuk admin CRUD nanti)

GeoJSON `FeatureCollection`, properti per site:
```jsonc
{
  "type": "Feature",
  "geometry": { "type": "Point", "coordinates": [106.8272, -6.1751] }, // [lng, lat]
  "properties": {
    "id": "sc-jkt-001", "slug": "supercharge-scbd",
    "name": "Wedison SuperCharge SCBD",
    "status": "operational",            // operational | coming_soon | maintenance | closed
    "address": "Jl. Jend. Sudirman ...", "city": "Jakarta Selatan", "province": "DKI Jakarta",
    "piles_total": 8, "piles_available": 5,   // available = opsional real-time
    "power_kw": 60, "charger_class": "fast",  // standard | medium | fast | ultrafast
    "connectors": ["CCS2","Type2"],
    "hours": "24 jam", "price_per_kwh": 2500,
    "amenities": ["toilet","kafe","musala","parkir","wifi"],
    "photo": "/img/sites/scbd.jpg",
    "type_tier": "hub",                 // hub | standard | mitra  (à la Ionna)
    "updated_at": "2026-07-01T00:00:00Z"
  }
}
```
**Evolusi:** `data/sites.geojson` statis → `app/api/sites/route.ts` (baca file → nanti DB, dukung `?bbox=&status=&connector=`) → **Postgres+PostGIS** (`geography(Point)` untuk "near me" via `ST_DWithin`) + `POST/PUT/DELETE /api/admin/sites`. **UI selalu fetch endpoint yang sama** → sumber (file→DB) transparan.

## 5. Skema Card Detail Lokasi (best-of BP Pulse + EA + Ather + VinFast)
- Nama + badge **status 4-state** (Tersedia/Terpakai/Maintenance/Tutup — warna **berbeda** dari deep-green brand agar tak tertukar) + badge "Buka Sekarang" (berbasis jam)
- Alamat + landmark · **jumlah piles total & available** · **konektor (chip) + max kW** · kelas kecepatan
- Jam operasional · harga per-kWh · **baris ikon amenities** (toilet, kafe, **musala**, parkir, wifi)
- Foto lokasi · tipe/tier (Hub/Standard/Mitra) · tombol **"Rute" → Google Maps + Waze** (Waze wajib utk Indonesia) · 1 CTA brand halus (Test Ride)

## 6. Pola UI/UX (7 wajib)
1. **Two-way map↔list sync** (inti): hover card→pin menyala; klik pin→card ter-scroll+highlight; state "sudah dilihat".
2. **"Cari di area ini"** (tombol manual/toggle) — **bukan** auto-refetch tiap gerakan (jitter).
3. **Near me + fallback center cerdas** (izin ditolak → center kota/kantor terdekat) + default radius.
4. **Bottom-sheet nonmodal mobile** (ala Gojek/Apple Maps): peta full + sheet drag-handle detent peek/half/full, tetap bisa pan.
5. **Empty state + skeleton konstruktif** (kosong → auto-perlebar radius + saran "titik terdekat di kota X"; loading → skeleton card, bukan spinner).
6. **Filter atribut + marker beda tipe** (chip AC/DC, kW, status, 24 jam; ikon marker per tipe; **clustering** saat zoom-out).
7. **Custom brand marker + motion halus** (deep-green, reveal stagger, `flyTo` easing tenang). Section naratif SVG scroll-driven (opsional, terpisah dari tool).

## 7. Arsitektur Komponen (Next.js 15 App Router)
> **GOTCHA:** `next/dynamic` `ssr:false` **dilarang di Server Component** → bungkus di Client wrapper.
```
app/[locale]/supercharge/lokasi/
  page.tsx              # Server: fetch GeoJSON, render <LocatorShell/>, metadata SEO
  LocatorShell.tsx      # 'use client' — layout split, state terpilih/filter, sync map↔list
  MapClient.tsx         # 'use client' — dynamic(()=>import('./SuperChargeMap'),{ssr:false})
  SuperChargeMap.tsx    # 'use client' — <Map> maplibre, source+cluster, marker, popup
  StationList.tsx       # daftar card (SSR-friendly → LCP & fallback tanpa-JS)
  StationCard.tsx / StationDetailPanel.tsx / Filters.tsx / SearchNearMe.tsx
  useSites.ts · map-style-sage.ts · map-style-ink.ts
app/api/sites/route.ts  # GET GeoJSON (file→DB), ?bbox=&status=&connector=
data/sites.geojson
```
Opsional SEO lokal (pola Ola): `app/[locale]/supercharge/lokasi/[kota]/page.tsx`.

## 8. Aksesibilitas & Performa
- **Peta jangan blok LCP:** `dynamic ssr:false` + skeleton. **List di-SSR** = konten LCP + fallback tanpa-JS/WebGL.
- Peta canvas tak keyboard-accessible → **list jadi jalur akses utama**; `aria-label` pada marker/popup; focus management panel; kontras badge status ≥ WCAG AA.
- Code-split MapLibre (jangan di root layout); `prefers-reduced-motion` → matikan `flyTo`/motion.

## 9. Rencana Bertahap
- **Fase A — MVP (tanpa backend):** MapLibre + OpenFreeMap style Sage+Ink; `data/sites.geojson` statis (diisi data real Anda); split map+list sync + bottom-sheet mobile; filter; near-me; card detail; deep-link Rute (GMaps+Waze). List SSR. → halaman locator publik penuh, siap pakai.
- **Fase B — Dinamis:** pindah sumber ke `app/api/sites` (file→Postgres+PostGIS); viewport/bbox fetch; per-kota SEO routes; tiles self-host PMTiles.
- **Fase C — Real-time & Admin:** field `piles_available` di-feed real-time (badge 4-state + refresh); **admin backend CRUD** (tambah/edit/hapus site) — nyambung langsung karena UI sudah fetch endpoint.

## 10. Keputusan yang perlu diambil (sebelum build)
1. **Map stack:** MapLibre+OpenFreeMap (rekomendasi) vs Google Maps (familiar, berbayar) vs Mapbox?
2. **Ruang lingkup MVP:** bangun Fase A sekarang dengan **GeoJSON statis** (Anda isi data) — atau tunggu keputusan DB/admin dulu?
3. **Real-time availability:** sediakan slot `piles_available` tapi MVP pakai status statis (operational/coming-soon) — atau Anda sudah punya feed real-time?
4. **Per-kota SEO routes** `/lokasi/[kota]` (pola Ola): ya sekarang / nanti?
5. **Search:** cukup "near me" + filter kota dari data sendiri (gratis) — atau perlu Google Places autocomplete (berbayar)?

## 11. Sumber (URL terverifikasi)
Brand EV: atherenergy.com/charging · olaelectric.com/hypercharger-network · vinfastauto.id/find-us · nio.com/nio-power · rivian.com/experience/charging · tesla.com/findus · polestar.com/us/charging/charging-map · zeromotorcycles.com/ride-electric/charging-and-range · lucidmotors.com/charging · hyundaiusa.com/us/en/electrified/charging
Jaringan: uk-chargers.bppulse.com/en · electrifyamerica.com/locate-charger · ionna.com/rechargeries/find-a-rechargery · plugshare.com · ionity.eu/network · electrichighway.gridserve.com · na.chargepoint.com/charge_point · fastnedcharging.com/en/locations · shellrecharge.com · evgo.com/find-a-charger · network.gogoro.com/tw/en/coverage
Indonesia: petaspklu.id · bca.co.id/id/lokasi-bca
Interaksi/premium: airbnb.com · medium.com/airbnb-engineering/improving-search-ranking-for-maps-13b03f2c2cca · baymard.com/ecommerce-design-examples/store-locator · starbucks.com/store-locator · ikea.com/us/en/stores · mapuipatterns.com/store-locator · awwwards.com/inspiration/scroll-triggered-studio-locator-map · tympanus.net/codrops/2026/05/21/creating-scroll-driven-svg-map-animations-with-gsap · nngroup.com/articles/bottom-sheet
Docs: visgl.github.io/react-map-gl/docs/get-started · maplibre.org/maplibre-gl-js/docs · openfreemap.org · docs.protomaps.com/pmtiles/maplibre · github.com/mapbox/supercluster · nextjs.org/docs/app/guides/lazy-loading
