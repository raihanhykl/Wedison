"use client";

import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { NumberTicker } from "@/components/ui/number-ticker";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";

/* ------------------------------------------------------------------ *
 * TODO(data-real): ganti angka & daftar kota dengan DATA JARINGAN ASLI.
 * Placeholder saat ini diturunkan dari copy lama ("100+ titik").
 * ------------------------------------------------------------------ */
const STATIONS = 100; // TODO: jumlah titik SuperCharge sebenarnya
const CITIES = 25; // TODO: jumlah kota tercakup sebenarnya

// Marker kota cakupan (lat, lng). Placeholder kota-kota besar — ganti dgn lokasi stasiun asli.
// pulse:true hanya untuk hub utama agar peta tetap tenang (tidak semua berkedip).
const CITY_MARKERS: Marker[] = [
  { lat: 5.55, lng: 95.32, size: 0.5 }, // Banda Aceh
  { lat: 3.59, lng: 98.67, size: 0.7 }, // Medan
  { lat: -0.95, lng: 100.35, size: 0.5 }, // Padang
  { lat: 0.51, lng: 101.44, size: 0.5 }, // Pekanbaru
  { lat: -2.98, lng: 104.76, size: 0.6 }, // Palembang
  { lat: -6.21, lng: 106.85, size: 0.95, pulse: true }, // Jakarta
  { lat: -6.91, lng: 107.61, size: 0.7 }, // Bandung
  { lat: -6.97, lng: 110.42, size: 0.6 }, // Semarang
  { lat: -7.8, lng: 110.36, size: 0.6 }, // Yogyakarta
  { lat: -7.25, lng: 112.75, size: 0.85, pulse: true }, // Surabaya
  { lat: -8.65, lng: 115.22, size: 0.7, pulse: true }, // Denpasar
  { lat: -0.03, lng: 109.33, size: 0.5 }, // Pontianak
  { lat: -1.24, lng: 116.85, size: 0.55 }, // Balikpapan
  { lat: -5.13, lng: 119.41, size: 0.7, pulse: true }, // Makassar
  { lat: 1.47, lng: 124.84, size: 0.5 }, // Manado
];

const INDONESIA = { lat: { min: -11, max: 7 }, lng: { min: 94, max: 142 } };

/**
 * Living Network — signature #1. Section forest (drenched) dengan peta dotted Indonesia
 * bermarker berdenyut + counter (NumberTicker). Menegaskan skala & jangkauan jaringan.
 */
export default function SuperChargeNetwork() {
  const { t } = useLanguage();

  return (
    <section
      id="jaringan"
      className="scroll-mt-16 bg-forest py-16 text-forest-foreground sm:py-24"
    >
      <div className="main-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Teks + counter */}
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-on-forest-accent">
              {t("supercharge.network.kicker")}
            </p>
            <h2 className="mt-4 max-w-[16ch] font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {t("supercharge.network.title")}
            </h2>
            <p className="mt-5 max-w-[46ch] text-forest-foreground/80 sm:text-lg">
              {t("supercharge.network.description")}
            </p>

            <div className="mt-10 flex flex-wrap gap-10 sm:gap-14">
              <div>
                <div className="font-mono text-4xl font-bold tracking-tight text-on-forest-accent sm:text-5xl">
                  <NumberTicker
                    value={STATIONS}
                    className="text-on-forest-accent"
                  />
                  +
                </div>
                <p className="mt-1.5 text-sm text-forest-muted">
                  {t("supercharge.network.stationsLabel")}
                </p>
              </div>
              <div>
                <div className="font-mono text-4xl font-bold tracking-tight text-on-forest-accent sm:text-5xl">
                  <NumberTicker
                    value={CITIES}
                    className="text-on-forest-accent"
                  />
                  +
                </div>
                <p className="mt-1.5 text-sm text-forest-muted">
                  {t("supercharge.network.citiesLabel")}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Peta */}
          <Reveal delay={0.1} y={20}>
            <div className="relative w-full text-white/15 [aspect-ratio:8/3]">
              <DottedMap
                width={160}
                height={60}
                mapSamples={6500}
                region={INDONESIA}
                markers={CITY_MARKERS}
                dotColor="currentColor"
                markerColor="#9FE3B9" /* = --on-forest-accent */
                dotRadius={0.22}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
