"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { useIdleVisible } from "@/hooks/use-idle-visible";
import { showroomNetwork, type CountryNetwork } from "@/lib/seo/showrooms";
import { useShowrooms } from "@/components/showrooms/showrooms-context";
import { locationsDesc } from "./faq-data";
import { ShowroomCard, UpcomingCard } from "./showroom-card";
import { ShowroomCarousel, type CarouselHandle, type CarouselSlide } from "./showroom-carousel";

const ShowroomMap = dynamic(() => import("./showroom-map"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  return <div className="h-full w-full animate-pulse bg-secondary/60" aria-hidden />;
}


/**
 * Section lokasi: satu blok per negara (hanya negara `published`). Tiap blok = peta + carousel
 * kartu melingkar; kartu aktif dan pin peta saling tersinkron dua arah.
 */
export default function ShowroomLocations() {
  const { t, language } = useLanguage();
  const showrooms = useShowrooms();
  const network = showroomNetwork(showrooms);

  return (
    <section id="lokasi" className="scroll-mt-20 bg-muted py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("showroomPage.locations.title")}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {/* Fasilitas & kota SuperCharge dari data admin (bukan teks statis) */}
            {locationsDesc(showrooms, language)}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 space-y-20 sm:mt-16 sm:space-y-24">
        {network.map((n) => (
          <CountryBlock key={n.country.code} network={n} />
        ))}
      </div>
    </section>
  );
}

function CountryBlock({ network }: { network: CountryNetwork }) {
  const { t, language } = useLanguage();
  const { country, open, upcoming } = network;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const carouselRef = useRef<CarouselHandle>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const mapReady = useIdleVisible(mapBoxRef);
  const countryName = country.name[language === "en" ? "en" : "id"];

  const pins = open
    .filter((s) => s.lat != null && s.lng != null)
    .map((s) => ({ id: s.id, name: s.name, lat: s.lat!, lng: s.lng! }));

  // Kartu aktif = cabang yang disorot peta; kartu "segera hadir" tak punya pin -> peta tampil semua.
  const onActiveChange = useCallback(
    (id: string) => setSelectedId(pins.some((p) => p.id === id) ? id : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open],
  );

  const selectFromMap = (id: string) => {
    setSelectedId(id);
    carouselRef.current?.goTo(id);
  };

  const slides: CarouselSlide[] = [
    ...open.map((s) => ({
      id: s.id,
      label: s.name,
      render: () => (
        <ShowroomCard
          location={s}
          selected={selectedId === s.id}
          onSelect={() => setSelectedId(selectedId === s.id ? null : s.id)}
        />
      ),
    })),
    ...upcoming.map((u) => ({ id: u.id, label: u.city, render: () => <UpcomingCard upcoming={u} /> })),
  ];

  const countLine = [
    t("showroomPage.locations.countOpen").replace("{n}", String(open.length)),
    upcoming.length > 0
      ? t("showroomPage.locations.countUpcoming").replace("{n}", String(upcoming.length))
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div>
      {/* Judul negara */}
      <div className="main-container">
        <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {countryName}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{countLine}</p>
      </div>

      {/* Peta */}
      <div className="main-container mt-6">
        <div
          ref={mapBoxRef}
          className="relative h-[300px] overflow-hidden rounded-2xl border border-border bg-secondary/50 sm:h-[400px]"
        >
          {mapReady ? (
            <ShowroomMap
              pins={pins}
              selectedId={selectedId}
              onSelect={selectFromMap}
            />
          ) : (
            <MapPlaceholder />
          )}
          {selectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="absolute left-3 top-3 z-10 inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-border bg-card/95 px-4 text-sm font-medium text-foreground shadow-[var(--shadow-sm)] transition-colors hover:border-primary/50"
            >
              <Maximize2 className="h-4 w-4" aria-hidden />
              {t("showroomPage.locations.showAll")}
            </button>
          )}
        </div>
      </div>

      {/* Deretan kartu melingkar di bawah peta (tidak menumpang) */}
      <div className="mt-6 sm:mt-8">
        <ShowroomCarousel
          ref={carouselRef}
          slides={slides}
          label={t("showroomPage.locations.listLabel").replace("{country}", countryName)}
          onActiveChange={onActiveChange}
        />
      </div>
    </div>
  );
}
