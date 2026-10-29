// Snapshot showroom untuk saat backend tidak terjangkau (build CI tanpa API, gangguan). Sumber
// kebenaran tetap tabel Showroom (admin › Showrooms › Locations). Diambil dari data migrasi
// 20261028080000_showrooms; perbarui bila cabang berubah agar fallback tidak basi.
import type { PublicShowroom } from "@/lib/showrooms/showroom";

export const SHOWROOMS_FALLBACK: PublicShowroom[] = [
  {
    "id": "jakarta",
    "name": "Wedison Jakarta",
    "city": "Jakarta",
    "status": "OPEN",
    "bookable": true,
    "country": "ID",
    "address": {
      "streetAddress": "Jl. Sultan Iskandar Muda No. 30 A-C, Kebayoran Lama",
      "addressLocality": "Jakarta Selatan",
      "addressRegion": "DKI Jakarta",
      "postalCode": "12240"
    },
    "lat": -6.2484,
    "lng": 106.781,
    "mapsUrl": "https://www.google.com/maps/place/Wedison+Showroom/@-6.248464,106.7806209,19z/data=!4m10!1m2!2m1!1swedison+showroom!3m6!1s0x2e69f10019a26049:0xa59abd5e111a8a10!8m2!3d-6.248447!4d106.7810459!15sChB3ZWRpc29uIHNob3dyb29tWhIiEHdlZGlzb24gc2hvd3Jvb22SARplbGVjdHJpY19tb3RvcmN5Y2xlX2RlYWxlcqoBOBABMh4QASIa377C9bwSIpBp7hHS_qeMc_QbuBNmgIsWHu0yFBACIhB3ZWRpc29uIHNob3dyb29t4AEA!16s%2Fg%2F11x1nqm1sg!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D",
    "whatsapp": "6285286126550",
    "phone": null,
    "email": null,
    "timeZone": "Asia/Jakarta",
    "tzLabel": "WIB",
    "hours": {
      "fri": {
        "open": "10:00",
        "close": "19:00"
      },
      "mon": {
        "open": "10:00",
        "close": "19:00"
      },
      "sat": {
        "open": "10:00",
        "close": "17:00"
      },
      "sun": {
        "open": "10:00",
        "close": "17:00"
      },
      "thu": {
        "open": "10:00",
        "close": "19:00"
      },
      "tue": {
        "open": "10:00",
        "close": "19:00"
      },
      "wed": {
        "open": "10:00",
        "close": "19:00"
      },
      "holiday": {
        "open": "10:00",
        "close": "16:00"
      }
    },
    "closures": [],
    "hasWorkshop": true,
    "hasSupercharge": true,
    "photoUrl": "/ShowRoom-Receptionist.webp",
    "updatedAt": "2026-10-28T00:00:00.000Z"
  },
  {
    "id": "bekasi",
    "name": "Wedison Bekasi",
    "city": "Bekasi",
    "status": "OPEN",
    "bookable": true,
    "country": "ID",
    "address": {
      "streetAddress": "Jl. HM. Joyo Martono, RT.003/RW.021, Margahayu, Bekasi Timur",
      "addressLocality": "Kota Bekasi",
      "addressRegion": "Jawa Barat",
      "postalCode": "17113"
    },
    "lat": -6.2597989,
    "lng": 107.0199037,
    "mapsUrl": "https://maps.app.goo.gl/DXB6csamG8R78XoP9",
    "whatsapp": "6285286126550",
    "phone": null,
    "email": null,
    "timeZone": "Asia/Jakarta",
    "tzLabel": "WIB",
    "hours": {
      "fri": {
        "open": "10:00",
        "close": "19:00"
      },
      "mon": {
        "open": "10:00",
        "close": "19:00"
      },
      "sat": {
        "open": "10:00",
        "close": "17:00"
      },
      "sun": {
        "open": "10:00",
        "close": "17:00"
      },
      "thu": {
        "open": "10:00",
        "close": "19:00"
      },
      "tue": {
        "open": "10:00",
        "close": "19:00"
      },
      "wed": {
        "open": "10:00",
        "close": "19:00"
      },
      "holiday": {
        "open": "10:00",
        "close": "16:00"
      }
    },
    "closures": [],
    "hasWorkshop": true,
    "hasSupercharge": true,
    "photoUrl": "/showroom-waitingroom.webp",
    "updatedAt": "2026-10-28T00:00:00.000Z"
  },
  {
    "id": "bandung",
    "name": "Wedison Bandung",
    "city": "Bandung",
    "status": "OPEN",
    "bookable": true,
    "country": "ID",
    "address": {
      "streetAddress": "Jl. Raya Gadobangkong No. 154, Gadobangkong, Ngamprah",
      "addressLocality": "Kabupaten Bandung Barat",
      "addressRegion": "Jawa Barat",
      "postalCode": "40552"
    },
    "lat": -6.86542,
    "lng": 107.514505,
    "mapsUrl": "https://maps.app.goo.gl/T86DfRuAkHFBmhMs8",
    "whatsapp": "6285286126558",
    "phone": null,
    "email": null,
    "timeZone": "Asia/Jakarta",
    "tzLabel": "WIB",
    "hours": {
      "fri": {
        "open": "10:00",
        "close": "19:00"
      },
      "mon": {
        "open": "10:00",
        "close": "19:00"
      },
      "sat": {
        "open": "10:00",
        "close": "17:00"
      },
      "sun": {
        "open": "10:00",
        "close": "17:00"
      },
      "thu": {
        "open": "10:00",
        "close": "19:00"
      },
      "tue": {
        "open": "10:00",
        "close": "19:00"
      },
      "wed": {
        "open": "10:00",
        "close": "19:00"
      },
      "holiday": {
        "open": "10:00",
        "close": "16:00"
      }
    },
    "closures": [],
    "hasWorkshop": true,
    "hasSupercharge": true,
    "photoUrl": "/super-charge/supercharge-charging.webp",
    "updatedAt": "2026-10-28T00:00:00.000Z"
  },
  {
    "id": "bali",
    "name": "Wedison Bali",
    "city": "Bali",
    "status": "OPEN",
    "bookable": true,
    "country": "ID",
    "address": {
      "streetAddress": "Jl. Gatot Subroto Tengah No. 93, Dangin Puri Kaja, Denpasar Utara",
      "addressLocality": "Kota Denpasar",
      "addressRegion": "Bali",
      "postalCode": "80118"
    },
    "lat": -8.6359263,
    "lng": 115.2213254,
    "mapsUrl": "https://maps.app.goo.gl/og4ovnG2FgCAQAWt8",
    "whatsapp": "6285801011969",
    "phone": null,
    "email": null,
    "timeZone": "Asia/Makassar",
    "tzLabel": "WITA",
    "hours": {
      "fri": {
        "open": "10:00",
        "close": "19:00"
      },
      "mon": {
        "open": "10:00",
        "close": "19:00"
      },
      "sat": {
        "open": "10:00",
        "close": "17:00"
      },
      "sun": {
        "open": "10:00",
        "close": "17:00"
      },
      "thu": {
        "open": "10:00",
        "close": "19:00"
      },
      "tue": {
        "open": "10:00",
        "close": "19:00"
      },
      "wed": {
        "open": "10:00",
        "close": "19:00"
      },
      "holiday": {
        "open": "10:00",
        "close": "16:00"
      }
    },
    "closures": [],
    "hasWorkshop": true,
    "hasSupercharge": false,
    "photoUrl": "/new-looks/test image.webp",
    "updatedAt": "2026-10-28T00:00:00.000Z"
  }
];
