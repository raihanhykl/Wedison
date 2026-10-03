"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";

export type NetworkStats = {
  /** stasiun berstatus operational */
  stations: number;
  /** kota unik dari stasiun operational */
  cities: number;
  /** stasiun yang segera hadir */
  upcoming: number;
  /** titik untuk peta dotted: [lat, lng, beroperasi?] */
  points: [number, number, boolean][];
};

const INDONESIA = { lat: { min: -11, max: 7 }, lng: { min: 94, max: 142 } };

/**
 * Jaringan — section forest dengan peta dotted Indonesia. Angka & titik dihitung di server
 * dari data stasiun yang sama dengan halaman Lokasi (admin > SuperCharge), jadi selalu
 * sinkron. Menggabungkan "Jaringan yang Terus Bertambah" (dulu section terpisah).
 */
export default function SuperChargeNetwork({ stats }: { stats: NetworkStats }) {
  const { t, language } = useLanguage();
  // Beroperasi: titik besar berdenyut; segera hadir: titik kecil diam.
  const markers: Marker[] = stats.points.map(([lat, lng, live]) => ({
    lat,
    lng,
    size: live ? 0.85 : 0.4,
    pulse: live,
  }));

  const figures = [
    { value: stats.stations, label: t("supercharge.network.stationsLabel") },
    { value: stats.cities, label: t("supercharge.network.citiesLabel") },
    ...(stats.upcoming > 0
      ? [{ value: stats.upcoming, label: t("supercharge.network.upcomingLabel") }]
      : []),
  ];

  return (
    <section
      id="jaringan"
      className="scroll-mt-16 bg-forest py-16 text-forest-foreground sm:py-24"
    >
      <div className="main-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[16ch] text-balance font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {t("supercharge.network.title")}
            </h2>
            <p className="mt-5 max-w-[46ch] text-pretty text-forest-foreground/85 sm:text-lg">
              {t("supercharge.feature2.description")}
            </p>

            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
              {figures.map((f) => (
                // dt harus mendahului dd di DOM; angka tetap tampil di atas lewat flex-col-reverse.
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 text-sm text-forest-foreground/75">{f.label}</dt>
                  <dd className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-on-forest-accent sm:text-5xl">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button
                asChild
                size="lg"
                className="bg-on-forest-accent text-forest-deep hover:bg-white"
              >
                <Link href={`/${language}/super-charge/locations/`}>
                  <MapPin className="h-5 w-5" />
                  {t("supercharge.locator.viewAll")}
                </Link>
              </Button>
              <span className="text-sm text-forest-foreground/75">
                {t("supercharge.feature2.subtitle")}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={20}>
            <div className="relative w-full text-white/15 [aspect-ratio:8/3]">
              <DottedMap
                width={160}
                height={60}
                mapSamples={6500}
                region={INDONESIA}
                markers={markers}
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
