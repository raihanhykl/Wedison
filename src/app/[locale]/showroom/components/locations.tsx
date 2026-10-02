"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { useIdleVisible } from "@/hooks/use-idle-visible";
import { showroomNetwork, type CountryNetwork } from "@/lib/seo/showrooms";
import { SHOWROOMS } from "@/lib/booking/showrooms";
import { cn } from "@/lib/utils";
import { ShowroomCard, UpcomingCard } from "./showroom-card";

const ShowroomMap = dynamic(() => import("./showroom-map"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  return <div className="h-full w-full animate-pulse bg-secondary/60" aria-hidden />;
}


/**
 * Section lokasi: satu blok per negara (hanya negara `published`). Tiap blok = peta + deretan
 * kartu yang bisa digeser ke samping, saling tersinkron dua arah.
 */
export default function ShowroomLocations() {
  const { t } = useLanguage();
  const network = showroomNetwork();

  return (
    <section id="lokasi" className="scroll-mt-20 bg-muted py-16 sm:py-24">
      <div className="main-container">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("showroomPage.locations.title")}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("showroomPage.locations.desc")}
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const mapReady = useIdleVisible(mapBoxRef);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  /** Geser deretan kartu sampai kartu `id` berada di awal area (tanpa menggulir halaman). */
  const revealCard = useCallback((id: string) => {
    const el = scrollerRef.current;
    const card = el?.querySelector<HTMLElement>(`[data-card="${id}"]`);
    if (!el || !card) return;
    const padStart = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - padStart, behavior: reduced ? "auto" : "smooth" });
  }, []);

  const page = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 320), behavior: "smooth" });
  };

  const selectFromMap = (id: string) => {
    setSelectedId(id);
    revealCard(id);
  };

  const pins = open.map((s) => ({
    id: s.id,
    name: t(SHOWROOMS[s.id].nameKey),
    lat: s.geo.latitude,
    lng: s.geo.longitude,
  }));

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
      {/* Judul negara + navigasi deretan kartu */}
      <div className="main-container flex items-end justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {country.name[language === "en" ? "en" : "id"]}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{countLine}</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="hidden h-10 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50 sm:inline-flex"
            >
              <Maximize2 className="h-4 w-4" aria-hidden />
              {t("showroomPage.locations.showAll")}
            </button>
          )}
          <ScrollButton
            label={t("showroomPage.locations.prev")}
            disabled={edges.start}
            onClick={() => page(-1)}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </ScrollButton>
          <ScrollButton
            label={t("showroomPage.locations.next")}
            disabled={edges.end}
            onClick={() => page(1)}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </ScrollButton>
        </div>
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
        </div>
      </div>

      {/* Deretan kartu di bawah peta (tidak menumpang), bisa digeser, menjorok sampai tepi layar */}
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        role="region"
        aria-label={t("showroomPage.locations.listLabel").replace(
          "{country}",
          country.name[language === "en" ? "en" : "id"],
        )}
        tabIndex={0}
        className={cn(
          "mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 outline-none sm:mt-6 sm:gap-5",
          // Rata kiri dengan tepi peta/.main-container (max 1280px, padding 5/8/12), menjorok ke kanan.
          "scroll-px-5 px-5 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(3rem,calc((100vw-1280px)/2+3rem))] lg:px-[max(3rem,calc((100vw-1280px)/2+3rem))]",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "focus-visible:ring-2 focus-visible:ring-ring/50",
        )}
      >
        {open.map((s) => (
          <div key={s.id} data-card={s.id} className="flex">
            <ShowroomCard
              location={s}
              selected={selectedId === s.id}
              onSelect={() => {
                const next = selectedId === s.id ? null : s.id;
                setSelectedId(next);
                if (next) revealCard(next);
              }}
            />
          </div>
        ))}
        {upcoming.map((u) => (
          <div key={u.id} className="flex">
            <UpcomingCard upcoming={u} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScrollButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/50 disabled:cursor-default disabled:opacity-40"
    >
      {children}
    </button>
  );
}
