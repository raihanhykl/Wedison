// Snapshot harga statis = jaring pengaman saat API tidak terjangkau. Bentuk sama dengan
// GET /api/v1/public/pricing. DIBUAT OTOMATIS oleh server/prisma/pricing-sync.mjs --fallback dari
// server/prisma/seed-data/pricing.json. Jangan diedit manual; ubah harga lewat /admin/pricing.
import type { PublicPricing } from "@/lib/pricing/types";

export const PRICING_FALLBACK: PublicPricing = {
  "regions": [
    {
      "slug": "jabodetabek",
      "name": {
        "id": "Jabodetabek",
        "en": "Greater Jakarta"
      },
      "priceLabel": {
        "id": "Harga OTR Jabodetabek",
        "en": "OTR price, Greater Jakarta"
      },
      "coverage": {
        "id": "Jakarta, Bekasi, Bogor, Depok, Tangerang, Tangerang Selatan",
        "en": "Jakarta, Bekasi, Bogor, Depok, Tangerang, South Tangerang"
      },
      "salesWhatsapp": "6285286126550",
      "isDefault": true,
      "sortOrder": 0
    },
    {
      "slug": "bali",
      "name": {
        "id": "Bali",
        "en": "Bali"
      },
      "priceLabel": {
        "id": "Harga OTR Bali",
        "en": "OTR price, Bali"
      },
      "coverage": {
        "id": "Seluruh Pulau Bali",
        "en": "The whole island of Bali"
      },
      "salesWhatsapp": "6285801011969",
      "isDefault": false,
      "sortOrder": 1
    },
    {
      "slug": "bandung",
      "name": {
        "id": "Bandung Raya",
        "en": "Greater Bandung"
      },
      "priceLabel": {
        "id": "Harga OTR Bandung Raya",
        "en": "OTR price, Greater Bandung"
      },
      "coverage": {
        "id": "Kota Bandung, Kabupaten Bandung, Bandung Barat, Cimahi",
        "en": "Bandung City, Bandung Regency, West Bandung, Cimahi"
      },
      "salesWhatsapp": "6285286126558",
      "isDefault": false,
      "sortOrder": 2
    }
  ],
  "schemes": [
    {
      "slug": "purchase",
      "kind": "purchase",
      "name": {
        "id": "Cash",
        "en": "Cash"
      },
      "tagline": {
        "id": "Motor langsung menjadi milik Anda",
        "en": "The motorcycle is yours from day one"
      },
      "description": {
        "id": "Harga net berlaku sama untuk pembelian cash, kredit, maupun financing. Sudah termasuk STNK, BPKB, dan plat nomor.",
        "en": "The net price applies equally to cash, credit, and financing purchases. Includes STNK, BPKB, and number plate."
      },
      "audience": "all",
      "sortOrder": 0
    },
    {
      "slug": "rent-to-own",
      "kind": "rent_to_own",
      "name": {
        "id": "Rent To Own",
        "en": "Rent To Own"
      },
      "tagline": {
        "id": "Bayar harian, motor jadi milik Anda di akhir kontrak",
        "en": "Pay daily, own the motorcycle at the end of the contract"
      },
      "description": {
        "id": "Khusus mitra pengemudi ojol. Kontrak 42 bulan (Bees 40 bulan). Biaya harian adalah murni biaya sewa, tanpa komponen tabungan.",
        "en": "For ride-hailing (ojol) drivers only. A 42-month contract (40 months for Bees). The daily fee is purely a rental fee, with no savings component."
      },
      "audience": "ojol",
      "sortOrder": 1
    },
    {
      "slug": "rental",
      "kind": "rental",
      "name": {
        "id": "Rental",
        "en": "Rental"
      },
      "tagline": {
        "id": "Bayar harian, motor dikembalikan di akhir kontrak",
        "en": "Pay daily, return the motorcycle at the end of the contract"
      },
      "description": {
        "id": "Kontrak 36 bulan. Unit tetap milik PT Wedison Nusantara Energi dan dikembalikan setelah kontrak selesai.",
        "en": "A 36-month contract. The unit remains the property of PT Wedison Nusantara Energi and is returned when the contract ends."
      },
      "audience": "all",
      "sortOrder": 2
    },
    {
      "slug": "baas",
      "kind": "baas",
      "name": {
        "id": "Battery as a Service",
        "en": "Battery as a Service"
      },
      "tagline": {
        "id": "Beli motornya, langganan baterainya",
        "en": "Buy the bike, subscribe to the battery"
      },
      "description": {
        "id": "Harga unit tanpa baterai ditambah langganan baterai bulanan. Garansi baterai seumur hidup selama berlangganan.",
        "en": "Unit price without the battery, plus a monthly battery subscription. Lifetime battery warranty while subscribed."
      },
      "audience": "all",
      "sortOrder": 3
    }
  ],
  "entries": [
    {
      "region": "jabodetabek",
      "scheme": "purchase",
      "model": "bees",
      "variant": "single",
      "otrPrice": 21900000,
      "discount": 2400000,
      "netPrice": 19500000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "purchase",
      "model": "athena",
      "variant": "regular",
      "otrPrice": 36900000,
      "discount": 3300000,
      "netPrice": 33600000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "purchase",
      "model": "athena",
      "variant": "extended",
      "otrPrice": 39900000,
      "discount": 3400000,
      "netPrice": 36500000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "purchase",
      "model": "victory",
      "variant": "regular",
      "otrPrice": 34900000,
      "discount": 3200000,
      "netPrice": 31700000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "purchase",
      "model": "victory",
      "variant": "extended",
      "otrPrice": 37900000,
      "discount": 3400000,
      "netPrice": 34500000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "purchase",
      "model": "edpower",
      "variant": "single",
      "otrPrice": 56900000,
      "discount": 4300000,
      "netPrice": 52600000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "purchase",
      "model": "bees",
      "variant": "single",
      "otrPrice": 21900000,
      "discount": 1095000,
      "netPrice": 20805000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "purchase",
      "model": "athena",
      "variant": "regular",
      "otrPrice": 36900000,
      "discount": 1845000,
      "netPrice": 35055000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "purchase",
      "model": "athena",
      "variant": "extended",
      "otrPrice": 39900000,
      "discount": 1995000,
      "netPrice": 37905000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "purchase",
      "model": "victory",
      "variant": "regular",
      "otrPrice": 34900000,
      "discount": 1745000,
      "netPrice": 33155000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "purchase",
      "model": "victory",
      "variant": "extended",
      "otrPrice": 37900000,
      "discount": 1895000,
      "netPrice": 36005000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "purchase",
      "model": "edpower",
      "variant": "single",
      "otrPrice": 56900000,
      "discount": 2845000,
      "netPrice": 54055000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rent-to-own",
      "model": "bees",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 35000,
      "downPayment": 100000,
      "termMonths": 40,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rent-to-own",
      "model": "athena",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 58000,
      "downPayment": 550000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rent-to-own",
      "model": "athena",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 63000,
      "downPayment": 600000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rent-to-own",
      "model": "victory",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 58000,
      "downPayment": 550000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rent-to-own",
      "model": "victory",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 63000,
      "downPayment": 600000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rent-to-own",
      "model": "edpower",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 83000,
      "downPayment": 800000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "rent-to-own",
      "model": "bees",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 35000,
      "downPayment": 350000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "rent-to-own",
      "model": "athena",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 70000,
      "downPayment": 700000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "rent-to-own",
      "model": "athena",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 80000,
      "downPayment": 800000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "rent-to-own",
      "model": "victory",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 60000,
      "downPayment": 600000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "rent-to-own",
      "model": "victory",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 70000,
      "downPayment": 700000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bali",
      "scheme": "rent-to-own",
      "model": "edpower",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 100000,
      "downPayment": 1000000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rental",
      "model": "athena",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 50000,
      "downPayment": 500000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rental",
      "model": "athena",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 55000,
      "downPayment": 550000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rental",
      "model": "victory",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 50000,
      "downPayment": 500000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rental",
      "model": "victory",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 55000,
      "downPayment": 550000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "rental",
      "model": "edpower",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 75000,
      "downPayment": 750000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "baas",
      "model": "victory",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 22000000,
      "monthlyFee": 390000,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "baas",
      "model": "victory",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 22000000,
      "monthlyFee": 490000,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "baas",
      "model": "athena",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 24000000,
      "monthlyFee": 390000,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "baas",
      "model": "edpower",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 33000000,
      "monthlyFee": 750000,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "purchase",
      "model": "bees",
      "variant": "single",
      "otrPrice": 21900000,
      "discount": 2400000,
      "netPrice": 19500000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "purchase",
      "model": "athena",
      "variant": "regular",
      "otrPrice": 36900000,
      "discount": 3300000,
      "netPrice": 33600000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "purchase",
      "model": "athena",
      "variant": "extended",
      "otrPrice": 39900000,
      "discount": 3400000,
      "netPrice": 36500000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "purchase",
      "model": "victory",
      "variant": "regular",
      "otrPrice": 34900000,
      "discount": 3200000,
      "netPrice": 31700000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "purchase",
      "model": "victory",
      "variant": "extended",
      "otrPrice": 37900000,
      "discount": 3400000,
      "netPrice": 34500000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "purchase",
      "model": "edpower",
      "variant": "single",
      "otrPrice": 56900000,
      "discount": 4300000,
      "netPrice": 52600000,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rent-to-own",
      "model": "bees",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 35000,
      "downPayment": 100000,
      "termMonths": 40,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rent-to-own",
      "model": "athena",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 58000,
      "downPayment": 550000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rent-to-own",
      "model": "athena",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 63000,
      "downPayment": 600000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rent-to-own",
      "model": "victory",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 58000,
      "downPayment": 550000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rent-to-own",
      "model": "victory",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 63000,
      "downPayment": 600000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rent-to-own",
      "model": "edpower",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 83000,
      "downPayment": 800000,
      "termMonths": 42,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rental",
      "model": "athena",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 50000,
      "downPayment": 500000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rental",
      "model": "athena",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 55000,
      "downPayment": 550000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rental",
      "model": "victory",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 50000,
      "downPayment": 500000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rental",
      "model": "victory",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 55000,
      "downPayment": 550000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "rental",
      "model": "edpower",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": 75000,
      "downPayment": 750000,
      "termMonths": 36,
      "installment24": null,
      "installment36": null,
      "unitPrice": null,
      "monthlyFee": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "baas",
      "model": "victory",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 22000000,
      "monthlyFee": 390000,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "baas",
      "model": "victory",
      "variant": "extended",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 22000000,
      "monthlyFee": 490000,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "baas",
      "model": "athena",
      "variant": "regular",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 24000000,
      "monthlyFee": 390000,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "baas",
      "model": "edpower",
      "variant": "single",
      "otrPrice": null,
      "discount": null,
      "netPrice": null,
      "dailyFee": null,
      "downPayment": null,
      "termMonths": null,
      "installment24": null,
      "installment36": null,
      "unitPrice": 33000000,
      "monthlyFee": 750000,
      "note": null
    }
  ],
  "terms": [
    {
      "region": "jabodetabek",
      "scheme": "purchase",
      "included": {
        "id": [
          "1x Adapter charging reguler (senilai Rp 1.700.000)",
          "1x Ganti ban depan dan belakang (senilai Rp 385.000)",
          "1x Ganti kampas rem (1 set depan dan belakang)",
          "1x Servis reguler",
          "2x Kunci mekanik",
          "Voucher charging Rp 3.000.000 untuk Athena, Victory, dan EdPower (tidak berlaku untuk Bees)",
          "Garansi baterai, motor, dan rangka 3 tahun atau 100.000 km"
        ],
        "en": [
          "1x Regular charging adapter (worth Rp 1,700,000)",
          "1x Front and rear tire replacement (worth Rp 385,000)",
          "1x Brake pad replacement (1 set, front and rear)",
          "1x Regular service",
          "2x Mechanical keys",
          "Rp 3,000,000 charging voucher for Athena, Victory, and EdPower (not valid for Bees)",
          "Battery, motor, and frame warranty of 3 years or 100,000 km"
        ]
      },
      "terms": {
        "id": [
          "Harga net berlaku untuk pembelian cash, kredit, dan financing.",
          "Harga adalah OTR Jakarta dan berlaku untuk seluruh Jabodetabek. Wilayah lain memiliki harga tersendiri.",
          "Voucher charging Rp 3.000.000 berlaku untuk pembelian langsung, kredit, dan financing pada Athena, Victory, dan EdPower. Tidak berlaku untuk Bees, Rental, maupun Rent To Own.",
          "Voucher charging tidak bisa diuangkan atau ditukar.",
          "Diskon memotong harga OTR, sehingga DP dan angsuran ikut menjadi lebih ringan.",
          "Promo bersifat terbatas waktu dan terbatas kuota."
        ],
        "en": [
          "The net price applies to cash, credit, and financing purchases.",
          "Prices are OTR Jakarta and apply across Greater Jakarta. Other regions have their own pricing.",
          "The Rp 3,000,000 charging voucher applies to outright, credit, and financing purchases of Athena, Victory, and EdPower. Not valid for Bees, Rental, or Rent To Own.",
          "The charging voucher cannot be exchanged for cash or other items.",
          "The discount reduces the OTR price, so down payments and installments become lighter too.",
          "Promotions are limited by time and quota."
        ]
      },
      "partners": [
        "Kredivo (personal)",
        "WOM Finance (personal)",
        "AEON Credit (B2B)",
        "Mandiri (B2B)"
      ],
      "validFrom": "2026-09-25T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Pricelist 25 September 2026. Partner leasing hanya berlaku di Jabodetabek.",
        "en": "Price list of 25 September 2026. Leasing partners are available in Greater Jakarta only."
      }
    },
    {
      "region": "bali",
      "scheme": "purchase",
      "included": {
        "id": [
          "2x Kunci mekanik",
          "1x Voucher charging senilai Rp 3.000.000 (tidak berlaku untuk Bees)",
          "1x Adapter charging reguler (senilai hingga Rp 1.700.000)",
          "1x Ganti ban 1 set, depan dan belakang (senilai Rp 385.000)",
          "1x Ganti kampas rem 1 set, depan dan belakang",
          "1x Servis dasar senilai hingga Rp 500.000",
          "Garansi baterai dan motor 36 bulan atau 100.000 km"
        ],
        "en": [
          "2x Mechanical keys",
          "1x Charging voucher worth Rp 3,000,000 (not valid for Bees)",
          "1x Regular charging adapter (worth up to Rp 1,700,000)",
          "1x Tire replacement, front and rear (worth Rp 385,000)",
          "1x Brake pad replacement, front and rear",
          "1x Basic servicing worth up to Rp 500,000",
          "Battery and motor warranty of 36 months or 100,000 km"
        ]
      },
      "terms": {
        "id": [
          "Harga dan diskon hanya berlaku untuk wilayah Bali.",
          "Harga on-the-road sudah termasuk STNK, BPKB, plat nomor standar (TNKB), dan pajak kendaraan daerah tahun pertama. Belum termasuk pajak progresif (jika berlaku) dan asuransi kendaraan sukarela.",
          "Diskon berlaku untuk pembelian cash, kredit, dan financing.",
          "Diskon dan voucher charging tidak bisa diuangkan atau ditukar.",
          "Promo bersifat terbatas waktu dan terbatas kuota, dan dapat berubah sewaktu-waktu sesuai kebijakan perusahaan.",
          "Semua harga sudah termasuk PPN 11%."
        ],
        "en": [
          "Prices and discounts apply to Bali only.",
          "The on-the-road price includes STNK, BPKB, a standard number plate (TNKB), and first-year regional vehicle tax. It excludes progressive tax (where applicable) and voluntary vehicle insurance.",
          "The discount applies to cash, credit, and financing purchases.",
          "Discounts and charging vouchers cannot be exchanged for cash or other items.",
          "Promotions are limited by time and quota and may change at any time in line with company policy.",
          "All prices include 11% VAT."
        ]
      },
      "partners": [],
      "validFrom": "2026-08-01T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Showroom Bali belum memiliki stasiun SuperCharge.",
        "en": "The Bali showroom does not have a SuperCharge station yet."
      }
    },
    {
      "region": "jabodetabek",
      "scheme": "rent-to-own",
      "included": {
        "id": [
          "Adapter pengisian daya reguler gratis (senilai Rp 1.000.000)",
          "Gratis 1x penggantian ban depan dan belakang (senilai Rp 385.000)",
          "Gratis 1x penggantian kampas rem depan dan belakang (1 set)",
          "Gratis servis rutin",
          "1x Kunci mekanik",
          "Pengurusan BPKB ditanggung Wedison",
          "Garansi baterai, motor, dan rangka 3 tahun atau 100.000 km; komponen elektrikal lain 2 tahun atau 20.000 km"
        ],
        "en": [
          "Free regular charging adapter (worth Rp 1,000,000)",
          "Free 1x front and rear tire replacement (worth Rp 385,000)",
          "Free 1x front and rear brake pad replacement (1 set)",
          "Free routine servicing",
          "1x Mechanical key",
          "BPKB processing covered by Wedison",
          "Battery, motor, and frame warranty of 3 years or 100,000 km; other electrical components 2 years or 20,000 km"
        ]
      },
      "terms": {
        "id": [
          "Masa kontrak 42 bulan untuk Athena, Victory, dan EdPower. 40 bulan untuk Bees.",
          "Khusus driver ojol, termasuk komunitas ojol.",
          "Motor menjadi hak milik Anda setelah kontrak selesai.",
          "Biaya harian adalah murni biaya sewa, tidak ada komponen tabungan.",
          "Uang muka bersifat non-refundable (tidak dapat dikembalikan).",
          "Denda tilang menjadi tanggung jawab Anda.",
          "Kerusakan akibat kelalaian atau penyalahgunaan menjadi tanggung jawab Anda.",
          "Wajib lolos proses skrining Wedison.",
          "Warna motor ditentukan secara acak sesuai ketersediaan stok.",
          "Garansi berlaku hanya untuk kerusakan karena kesalahan pabrik, bukan human error, dan hangus jika terjadi kecelakaan akibat kelalaian sendiri."
        ],
        "en": [
          "Contract term of 42 months for Athena, Victory, and EdPower. 40 months for Bees.",
          "For ojol drivers only, including ojol communities.",
          "The motorcycle becomes yours once the contract ends.",
          "The daily fee is purely a rental fee; there is no savings component.",
          "The down payment is non-refundable.",
          "Traffic fines are your responsibility.",
          "Damage caused by negligence or misuse is your responsibility.",
          "You must pass Wedison's screening process.",
          "Motorcycle color is assigned at random based on stock availability.",
          "The warranty covers factory defects only, not human error, and is void after an accident caused by your own negligence."
        ]
      },
      "partners": [],
      "validFrom": "2026-08-01T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Pricelist Rent To Own Agustus 2026.",
        "en": "Rent To Own price list, August 2026."
      }
    },
    {
      "region": "bali",
      "scheme": "rent-to-own",
      "included": {
        "id": [
          "1x Kunci mekanik",
          "1x Charging credit senilai Rp 500.000 (tidak berlaku untuk Bees, tidak bisa diuangkan)",
          "1x Adapter charging reguler (senilai hingga Rp 1.700.000)",
          "1x Ganti ban 1 set, depan dan belakang (senilai Rp 385.000)",
          "1x Ganti kampas rem 1 set, depan dan belakang",
          "Garansi baterai dan motor 42 bulan atau 100.000 km"
        ],
        "en": [
          "1x Mechanical key",
          "1x Charging credit worth Rp 500,000 (not valid for Bees, non-cashable)",
          "1x Regular charging adapter (worth up to Rp 1,700,000)",
          "1x Tire replacement, front and rear (worth Rp 385,000)",
          "1x Brake pad replacement, front and rear",
          "Battery and motor warranty of 42 months or 100,000 km"
        ]
      },
      "terms": {
        "id": [
          "Masa kontrak 42 bulan (3 tahun 6 bulan). Khusus driver ojol.",
          "Anda hanya membayar sewa untuk tanggal 1 sampai 28 setiap bulan kalender.",
          "Sewa dibayar di muka untuk pemakaian hari berikutnya, paling lambat pukul 23.59. Jika telat, daya motor otomatis dimatikan dan dipulihkan maksimal 2 jam setelah pembayaran dikonfirmasi.",
          "Motor wajib diambil maksimal 3 hari kerja setelah pengajuan disetujui.",
          "Warna motor ditentukan oleh Wedison. Preferensi warna boleh dicatat tetapi tidak dijamin.",
          "Kepemilikan dialihkan maksimal 30 hari setelah kontrak selesai, jika semua biaya sewa, tagihan, dan denda tilang sudah lunas.",
          "Uang muka bisa dicicil. Proses pengajuan dimulai setelah uang muka lunas dan tidak dapat dikembalikan, kecuali pengajuan ditolak oleh Wedison.",
          "Wajib melengkapi data diri dan dokumen pendukung untuk skrining. Wedison berhak menolak pengajuan.",
          "Semua denda tilang dan pelanggaran lalu lintas menjadi tanggung jawab Anda.",
          "Dilarang memodifikasi motor tanpa persetujuan tertulis Wedison. Semua servis wajib di bengkel resmi Wedison.",
          "Semua harga sudah termasuk PPN 11%."
        ],
        "en": [
          "Contract term of 42 months (3 years 6 months). For ojol drivers only.",
          "You only pay rent for the 1st to the 28th of each calendar month.",
          "Rent is paid in advance for the following day, by 23:59 at the latest. If late, the motorcycle's power is switched off automatically and restored within 2 hours of payment confirmation.",
          "The motorcycle must be collected within 3 working days of approval.",
          "Motorcycle color is decided by Wedison. Color preferences may be noted but are not guaranteed.",
          "Ownership transfers within 30 days of the contract ending, provided all rent, bills, and traffic fines are settled.",
          "The down payment can be paid in installments. Processing starts once the down payment is settled and it is non-refundable, unless Wedison rejects the application.",
          "Personal data and supporting documents are required for screening. Wedison reserves the right to reject applications.",
          "All traffic fines and violations are your responsibility.",
          "No modifications without Wedison's written approval. All servicing must be done at an official Wedison workshop.",
          "All prices include 11% VAT."
        ]
      },
      "partners": [],
      "validFrom": "2026-08-01T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Di materi resmi Bali skema ini disebut \"Rental Ojol\". Skemanya sama dengan Rent To Own.",
        "en": "Bali's official materials call this scheme \"Rental Ojol\". It is the same scheme as Rent To Own."
      }
    },
    {
      "region": "jabodetabek",
      "scheme": "rental",
      "included": {
        "id": [
          "Adapter pengisian daya reguler gratis (senilai Rp 1.000.000)",
          "Gratis 1x penggantian ban depan dan belakang (senilai Rp 385.000)",
          "Gratis 1x penggantian kampas rem depan dan belakang (1 set)",
          "Gratis servis rutin",
          "1x Kunci mekanik",
          "Garansi baterai, motor, dan rangka 3 tahun atau 100.000 km; komponen elektrikal lain 2 tahun atau 20.000 km"
        ],
        "en": [
          "Free regular charging adapter (worth Rp 1,000,000)",
          "Free 1x front and rear tire replacement (worth Rp 385,000)",
          "Free 1x front and rear brake pad replacement (1 set)",
          "Free routine servicing",
          "1x Mechanical key",
          "Battery, motor, and frame warranty of 3 years or 100,000 km; other electrical components 2 years or 20,000 km"
        ]
      },
      "terms": {
        "id": [
          "Masa kontrak 36 bulan.",
          "Unit tetap menjadi milik PT Wedison Nusantara Energi. STNK atas nama PT Wedison Nusantara Energi.",
          "Motor dikembalikan ke Wedison di akhir kontrak.",
          "Anda mendapat 2 hari libur bayar per bulan, maksimal 24 hari per tahun.",
          "Uang muka bersifat non-refundable (tidak dapat dikembalikan).",
          "Denda tilang menjadi tanggung jawab Anda.",
          "Kerusakan akibat kelalaian atau penyalahgunaan menjadi tanggung jawab Anda.",
          "Wajib lolos proses skrining Wedison.",
          "Warna motor ditentukan secara acak sesuai ketersediaan stok.",
          "Bees tidak tersedia untuk skema Rental."
        ],
        "en": [
          "Contract term of 36 months.",
          "The unit remains the property of PT Wedison Nusantara Energi. The STNK is registered to PT Wedison Nusantara Energi.",
          "The motorcycle is returned to Wedison at the end of the contract.",
          "You get 2 payment-free days per month, up to 24 days per year.",
          "The down payment is non-refundable.",
          "Traffic fines are your responsibility.",
          "Damage caused by negligence or misuse is your responsibility.",
          "You must pass Wedison's screening process.",
          "Motorcycle color is assigned at random based on stock availability.",
          "Bees is not available for the Rental scheme."
        ]
      },
      "partners": [],
      "validFrom": null,
      "validUntil": null,
      "note": null
    },
    {
      "region": "jabodetabek",
      "scheme": "baas",
      "included": {
        "id": [
          "Garansi baterai seumur hidup selama berlangganan",
          "Insentif pengisian daya Rp 2.000.000",
          "Adapter pengisian gratis (senilai Rp 1.700.000)",
          "Garansi kendaraan 3 tahun atau 100.000 km",
          "2x Kunci mekanik"
        ],
        "en": [
          "Lifetime battery warranty while subscribed",
          "Rp 2,000,000 charging incentive",
          "Free charging adapter (worth Rp 1,700,000)",
          "Vehicle warranty of 3 years or 100,000 km",
          "2x Mechanical keys"
        ]
      },
      "terms": {
        "id": [
          "Harga unit tidak termasuk baterai. Baterai disediakan melalui langganan bulanan.",
          "Bees tidak termasuk dalam skema Battery as a Service.",
          "Pembayaran unit bisa cash, kredit, atau financing melalui Kredivo dan WOM Finance (personal) serta Mandiri (bisnis).",
          "Program terbatas waktu dan kuota. Harga dapat berbeda per wilayah. Penawaran tertulis diberikan di showroom."
        ],
        "en": [
          "The unit price excludes the battery. The battery is provided through a monthly subscription.",
          "Bees is not part of the Battery as a Service scheme.",
          "The unit can be paid in cash, by credit, or through financing via Kredivo and WOM Finance (personal) and Mandiri (business).",
          "The programme is limited by time and quota. Prices may differ by region. Written offers are provided at the showroom."
        ]
      },
      "partners": [
        "Kredivo (personal)",
        "WOM Finance (personal)",
        "Mandiri (B2B)"
      ],
      "validFrom": "2026-09-01T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Kampanye BaaS September 2026.",
        "en": "BaaS campaign, September 2026."
      }
    },
    {
      "region": "bandung",
      "scheme": "purchase",
      "included": {
        "id": [
          "1x Adapter charging reguler (senilai Rp 1.700.000)",
          "1x Ganti ban depan dan belakang (senilai Rp 385.000)",
          "1x Ganti kampas rem (1 set depan dan belakang)",
          "1x Servis reguler",
          "2x Kunci mekanik",
          "Voucher charging Rp 3.000.000 untuk Athena, Victory, dan EdPower (tidak berlaku untuk Bees)",
          "Garansi baterai, motor, dan rangka 3 tahun atau 100.000 km"
        ],
        "en": [
          "1x Regular charging adapter (worth Rp 1,700,000)",
          "1x Front and rear tire replacement (worth Rp 385,000)",
          "1x Brake pad replacement (1 set, front and rear)",
          "1x Regular service",
          "2x Mechanical keys",
          "Rp 3,000,000 charging voucher for Athena, Victory, and EdPower (not valid for Bees)",
          "Battery, motor, and frame warranty of 3 years or 100,000 km"
        ]
      },
      "terms": {
        "id": [
          "Harga net berlaku untuk pembelian cash, kredit, dan financing.",
          "Harga adalah OTR Bandung Raya (Kota Bandung, Kabupaten Bandung, Bandung Barat, Cimahi). Wilayah lain memiliki harga tersendiri.",
          "Voucher charging Rp 3.000.000 berlaku untuk pembelian langsung, kredit, dan financing pada Athena, Victory, dan EdPower. Tidak berlaku untuk Bees, Rental, maupun Rent To Own.",
          "Voucher charging tidak bisa diuangkan atau ditukar.",
          "Diskon memotong harga OTR, sehingga DP dan angsuran ikut menjadi lebih ringan.",
          "Promo bersifat terbatas waktu dan terbatas kuota."
        ],
        "en": [
          "The net price applies to cash, credit, and financing purchases.",
          "Prices are OTR Greater Bandung (Bandung City, Bandung Regency, West Bandung, Cimahi). Other regions have their own pricing.",
          "The Rp 3,000,000 charging voucher applies to outright, credit, and financing purchases of Athena, Victory, and EdPower. Not valid for Bees, Rental, or Rent To Own.",
          "The charging voucher cannot be exchanged for cash or other items.",
          "The discount reduces the OTR price, so down payments and installments become lighter too.",
          "Promotions are limited by time and quota."
        ]
      },
      "partners": [
        "Kredivo (personal)",
        "WOM Finance (personal)",
        "AEON Credit (B2B)",
        "Mandiri (B2B)"
      ],
      "validFrom": "2026-09-25T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Pricelist 25 September 2026.",
        "en": "Price list of 25 September 2026."
      }
    },
    {
      "region": "bandung",
      "scheme": "rent-to-own",
      "included": {
        "id": [
          "Adapter pengisian daya reguler gratis (senilai Rp 1.000.000)",
          "Gratis 1x penggantian ban depan dan belakang (senilai Rp 385.000)",
          "Gratis 1x penggantian kampas rem depan dan belakang (1 set)",
          "Gratis servis rutin",
          "1x Kunci mekanik",
          "Pengurusan BPKB ditanggung Wedison",
          "Garansi baterai, motor, dan rangka 3 tahun atau 100.000 km; komponen elektrikal lain 2 tahun atau 20.000 km"
        ],
        "en": [
          "Free regular charging adapter (worth Rp 1,000,000)",
          "Free 1x front and rear tire replacement (worth Rp 385,000)",
          "Free 1x front and rear brake pad replacement (1 set)",
          "Free routine servicing",
          "1x Mechanical key",
          "BPKB processing covered by Wedison",
          "Battery, motor, and frame warranty of 3 years or 100,000 km; other electrical components 2 years or 20,000 km"
        ]
      },
      "terms": {
        "id": [
          "Masa kontrak 42 bulan untuk Athena, Victory, dan EdPower. 40 bulan untuk Bees.",
          "Khusus driver ojol, termasuk komunitas ojol.",
          "Motor menjadi hak milik Anda setelah kontrak selesai.",
          "Biaya harian adalah murni biaya sewa, tidak ada komponen tabungan.",
          "Uang muka bersifat non-refundable (tidak dapat dikembalikan).",
          "Denda tilang menjadi tanggung jawab Anda.",
          "Kerusakan akibat kelalaian atau penyalahgunaan menjadi tanggung jawab Anda.",
          "Wajib lolos proses skrining Wedison.",
          "Warna motor ditentukan secara acak sesuai ketersediaan stok.",
          "Garansi berlaku hanya untuk kerusakan karena kesalahan pabrik, bukan human error, dan hangus jika terjadi kecelakaan akibat kelalaian sendiri."
        ],
        "en": [
          "Contract term of 42 months for Athena, Victory, and EdPower. 40 months for Bees.",
          "For ojol drivers only, including ojol communities.",
          "The motorcycle becomes yours once the contract ends.",
          "The daily fee is purely a rental fee; there is no savings component.",
          "The down payment is non-refundable.",
          "Traffic fines are your responsibility.",
          "Damage caused by negligence or misuse is your responsibility.",
          "You must pass Wedison's screening process.",
          "Motorcycle color is assigned at random based on stock availability.",
          "The warranty covers factory defects only, not human error, and is void after an accident caused by your own negligence."
        ]
      },
      "partners": [],
      "validFrom": "2026-08-01T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Pricelist Rent To Own Agustus 2026.",
        "en": "Rent To Own price list, August 2026."
      }
    },
    {
      "region": "bandung",
      "scheme": "rental",
      "included": {
        "id": [
          "Adapter pengisian daya reguler gratis (senilai Rp 1.000.000)",
          "Gratis 1x penggantian ban depan dan belakang (senilai Rp 385.000)",
          "Gratis 1x penggantian kampas rem depan dan belakang (1 set)",
          "Gratis servis rutin",
          "1x Kunci mekanik",
          "Garansi baterai, motor, dan rangka 3 tahun atau 100.000 km; komponen elektrikal lain 2 tahun atau 20.000 km"
        ],
        "en": [
          "Free regular charging adapter (worth Rp 1,000,000)",
          "Free 1x front and rear tire replacement (worth Rp 385,000)",
          "Free 1x front and rear brake pad replacement (1 set)",
          "Free routine servicing",
          "1x Mechanical key",
          "Battery, motor, and frame warranty of 3 years or 100,000 km; other electrical components 2 years or 20,000 km"
        ]
      },
      "terms": {
        "id": [
          "Masa kontrak 36 bulan.",
          "Unit tetap menjadi milik PT Wedison Nusantara Energi. STNK atas nama PT Wedison Nusantara Energi.",
          "Motor dikembalikan ke Wedison di akhir kontrak.",
          "Anda mendapat 2 hari libur bayar per bulan, maksimal 24 hari per tahun.",
          "Uang muka bersifat non-refundable (tidak dapat dikembalikan).",
          "Denda tilang menjadi tanggung jawab Anda.",
          "Kerusakan akibat kelalaian atau penyalahgunaan menjadi tanggung jawab Anda.",
          "Wajib lolos proses skrining Wedison.",
          "Warna motor ditentukan secara acak sesuai ketersediaan stok.",
          "Bees tidak tersedia untuk skema Rental."
        ],
        "en": [
          "Contract term of 36 months.",
          "The unit remains the property of PT Wedison Nusantara Energi. The STNK is registered to PT Wedison Nusantara Energi.",
          "The motorcycle is returned to Wedison at the end of the contract.",
          "You get 2 payment-free days per month, up to 24 days per year.",
          "The down payment is non-refundable.",
          "Traffic fines are your responsibility.",
          "Damage caused by negligence or misuse is your responsibility.",
          "You must pass Wedison's screening process.",
          "Motorcycle color is assigned at random based on stock availability.",
          "Bees is not available for the Rental scheme."
        ]
      },
      "partners": [],
      "validFrom": null,
      "validUntil": null,
      "note": null
    },
    {
      "region": "bandung",
      "scheme": "baas",
      "included": {
        "id": [
          "Garansi baterai seumur hidup selama berlangganan",
          "Insentif pengisian daya Rp 2.000.000",
          "Adapter pengisian gratis (senilai Rp 1.700.000)",
          "Garansi kendaraan 3 tahun atau 100.000 km",
          "2x Kunci mekanik"
        ],
        "en": [
          "Lifetime battery warranty while subscribed",
          "Rp 2,000,000 charging incentive",
          "Free charging adapter (worth Rp 1,700,000)",
          "Vehicle warranty of 3 years or 100,000 km",
          "2x Mechanical keys"
        ]
      },
      "terms": {
        "id": [
          "Harga unit tidak termasuk baterai. Baterai disediakan melalui langganan bulanan.",
          "Bees tidak termasuk dalam skema Battery as a Service.",
          "Pembayaran unit bisa cash, kredit, atau financing melalui Kredivo dan WOM Finance (personal) serta Mandiri (bisnis).",
          "Program terbatas waktu dan kuota. Harga dapat berbeda per wilayah. Penawaran tertulis diberikan di showroom."
        ],
        "en": [
          "The unit price excludes the battery. The battery is provided through a monthly subscription.",
          "Bees is not part of the Battery as a Service scheme.",
          "The unit can be paid in cash, by credit, or through financing via Kredivo and WOM Finance (personal) and Mandiri (business).",
          "The programme is limited by time and quota. Prices may differ by region. Written offers are provided at the showroom."
        ]
      },
      "partners": [
        "Kredivo (personal)",
        "WOM Finance (personal)",
        "Mandiri (B2B)"
      ],
      "validFrom": "2026-09-01T00:00:00.000Z",
      "validUntil": null,
      "note": {
        "id": "Kampanye BaaS September 2026.",
        "en": "BaaS campaign, September 2026."
      }
    }
  ],
  "settings": {
    "disclaimerId": "Harga dan promo dapat berubah sewaktu-waktu, terbatas waktu dan kuota. Penawaran tertulis diberikan di showroom.",
    "disclaimerEn": "Prices and promotions may change at any time and are limited by time and quota. Written offers are provided at the showroom.",
    "supercharge": {
      "enabled": true,
      "unitId": "per sekali charge",
      "unitEn": "per charging session",
      "tariff": {
        "bees": null,
        "athena": 16500,
        "victory": 16500,
        "edpower": 27000
      },
      "noteId": "±15 menit dari 15% ke 95%. Tarif sama di semua stasiun SuperCharge.",
      "noteEn": "About 15 minutes from 15% to 95%. The same tariff applies at every SuperCharge station."
    },
    "referral": {
      "enabled": true,
      "amount": 300000,
      "regionSlugs": [
        "jabodetabek"
      ],
      "titleId": "Program Referral",
      "titleEn": "Referral Programme",
      "descriptionId": "Bonus Rp 300.000 untuk setiap orang yang Anda referensikan dan memenuhi syarat. Siapa saja boleh ikut, tidak harus pengguna Wedison. Dicairkan maksimal 2 minggu setelah serah terima unit.",
      "descriptionEn": "A Rp 300,000 bonus for every person you refer who qualifies. Anyone can take part, not only Wedison owners. Paid out within 2 weeks of unit handover."
    }
  },
  "updatedAt": "2026-10-21T00:00:00.000Z"
};

export default PRICING_FALLBACK;
