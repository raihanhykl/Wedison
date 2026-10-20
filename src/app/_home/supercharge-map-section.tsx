"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import type { LngLatBoundsLike } from "maplibre-gl";
import { LocateFixed, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocaleLink } from "@/components/locale-link";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { useIdleVisible } from "@/hooks/use-idle-visible";
import { useLanguage } from "@/app/lib/language-context";
import { cn } from "@/lib/utils";
import {
  STATUS_META,
  haversineKm,
  siteLatLng,
} from "@/app/[locale]/super-charge/locations/lib";
import type {
  LatLng,
  Site,
  SiteProperties,
  SiteStatus,
} from "@/app/[locale]/super-charge/locations/types";

const HomeMap = dynamic(() => import("./home-map"), {
  ssr: false,
  loading: () => <MapPlaceholder />,
});

function MapPlaceholder() {
  return (
    <div
      className="grid h-full w-full animate-pulse place-items-center bg-secondary/60"
      aria-hidden
    >
      <MapPin className="h-8 w-8 text-primary/40" />
    </div>
  );
}

/** Maks. baris stasiun di daftar ringkas; selebihnya diarahkan ke halaman lokasi. */
const LIST_LIMIT = 5;

/**
 * Area kurasi untuk chip filter. Dicocokkan dari kota/provinsi tiap stasiun; area tanpa
 * stasiun otomatis tidak ditampilkan, stasiun di luar semua area tetap muncul di "Semua".
 */
type AreaId =
  "all" | "jakarta" | "bekasi" | "tangerang" | "bogor" | "bandung" | "bali";
const AREAS: {
  id: Exclude<AreaId, "all">;
  label: string;
  match: (p: SiteProperties) => boolean;
}[] = [
  { id: "jakarta", label: "Jakarta", match: (p) => /jakarta/i.test(p.city) },
  { id: "bekasi", label: "Bekasi", match: (p) => /bekasi/i.test(p.city) },
  {
    id: "tangerang",
    label: "Tangerang",
    match: (p) => /tangerang/i.test(p.city),
  },
  {
    id: "bogor",
    label: "Depok & Bogor",
    match: (p) => /depok|bogor/i.test(p.city),
  },
  { id: "bandung", label: "Bandung", match: (p) => /bandung/i.test(p.city) },
  { id: "bali", label: "Bali", match: (p) => /bali/i.test(p.province) },
];

/** Bingkai Jawa bagian barat–Bali untuk tampilan "Semua" (tidak sampai seluruh Indonesia). */
const JAVA_BALI_BOUNDS: LngLatBoundsLike = [
  [105.6, -8.9],
  [115.8, -5.9],
];

const STATUS_ORDER: Record<SiteStatus, number> = {
  operational: 0,
  maintenance: 1,
  coming_soon: 2,
  closed: 3,
};

function boundsOf(sites: Site[], extra?: LatLng | null): LngLatBoundsLike {
  const lngs = sites.map((s) => s.geometry.coordinates[0]);
  const lats = sites.map((s) => s.geometry.coordinates[1]);
  if (extra) {
    lngs.push(extra.lng);
    lats.push(extra.lat);
  }
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

type GeoState = "idle" | "locating" | "ok" | "denied" | "error";

export default function SuperChargeMapSection({ sites }: { sites: Site[] }) {
  const { t, language } = useLanguage();
  const [area, setArea] = useState<AreaId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userLoc, setUserLoc] = useState<LatLng | null>(null);
  const [geo, setGeo] = useState<GeoState>("idle");
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const mapReady = useIdleVisible(mapBoxRef);

  // Stasiun tutup tidak relevan untuk beranda.
  const visible = useMemo(
    () => sites.filter((s) => s.properties.status !== "closed"),
    [sites],
  );
  const counts = useMemo(
    () => ({
      operational: visible.filter((s) => s.properties.status === "operational")
        .length,
      comingSoon: visible.filter((s) => s.properties.status === "coming_soon")
        .length,
    }),
    [visible],
  );
  const areas = useMemo(
    () => AREAS.filter((a) => visible.some((s) => a.match(s.properties))),
    [visible],
  );

  /** Stasiun area aktif, urut status (beroperasi dulu) atau jarak bila lokasi diketahui. */
  const inArea = useMemo(() => {
    const def = AREAS.find((a) => a.id === area);
    const list = def ? visible.filter((s) => def.match(s.properties)) : visible;
    return [...list].sort((a, b) => {
      if (userLoc) {
        return (
          haversineKm(userLoc, siteLatLng(a)) -
          haversineKm(userLoc, siteLatLng(b))
        );
      }
      const d =
        STATUS_ORDER[a.properties.status] - STATUS_ORDER[b.properties.status];
      return d !== 0 ? d : a.properties.name.localeCompare(b.properties.name);
    });
  }, [visible, area, userLoc]);

  const listed = useMemo(() => {
    const top = inArea.slice(0, LIST_LIMIT);
    const sel =
      selectedId && visible.find((s) => s.properties.id === selectedId);
    // Pin yang diklik di luar 5 teratas tetap ditampilkan sebagai baris tambahan.
    return sel && !top.includes(sel) ? [...top, sel] : top;
  }, [inArea, selectedId, visible]);
  const hiddenCount = Math.max(0, inArea.length - LIST_LIMIT);

  const bounds = useMemo<LngLatBoundsLike>(() => {
    if (userLoc) return boundsOf(inArea.slice(0, LIST_LIMIT), userLoc);
    if (area === "all" || inArea.length === 0) return JAVA_BALI_BOUNDS;
    return boundsOf(inArea);
  }, [area, inArea, userLoc]);

  const pickArea = (next: AreaId) => {
    setArea(next);
    setSelectedId(null);
  };
  const toggleSite = useCallback(
    (id: string) => setSelectedId((cur) => (cur === id ? null : id)),
    [],
  );

  const locate = () => {
    if (userLoc) {
      setUserLoc(null);
      setGeo("idle");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeo("error");
      return;
    }
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setArea("all");
        setSelectedId(null);
        setGeo("ok");
      },
      (err) => setGeo(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
    );
  };

  const fmtKm = (km: number) =>
    t("home.map.distance").replace(
      "{km}",
      km.toLocaleString(language === "en" ? "en-US" : "id-ID", {
        maximumFractionDigits: km < 10 ? 1 : 0,
      }),
    );
  const geoMessage =
    geo === "locating"
      ? t("home.map.locating")
      : geo === "ok"
        ? t("home.map.nearMeDone")
        : geo === "denied"
          ? t("home.map.geoDenied")
          : geo === "error"
            ? t("home.map.geoError")
            : "";

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="main-container grid grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
        {/* Judul + statistik */}
        <Reveal className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <h2 className="max-w-[16ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("home.map.title")}
          </h2>
          <p className="mt-4 max-w-[48ch] text-pretty text-muted-foreground sm:text-lg">
            {t("home.map.desc")}
          </p>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-primary tabular-nums">
            {t("home.map.stats")
              .replace("{n}", String(counts.operational))
              .replace("{m}", String(counts.comingSoon))}
          </p>
        </Reveal>

        {/* Peta: tampil lebih dulu di mobile, kolom kanan penuh tinggi di desktop */}
        <div
          ref={mapBoxRef}
          role="region"
          aria-label={t("home.map.mapLabel")}
          className="relative h-[300px] overflow-hidden rounded-2xl border border-border bg-secondary/50 sm:h-[420px] lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:h-full lg:min-h-[520px]"
        >
          {mapReady ? (
            <HomeMap
              sites={visible}
              bounds={bounds}
              selectedId={selectedId}
              hoveredId={hoveredId}
              userLoc={userLoc}
              onSelect={toggleSite}
              onHover={setHoveredId}
            />
          ) : (
            <MapPlaceholder />
          )}
        </div>

        {/* Chip area + daftar + aksi */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2 flex flex-col">
          <div
            role="group"
            aria-label={t("home.map.areaLabel")}
            className="flex flex-wrap gap-2"
          >
            {[{ id: "all" as const, label: t("home.map.all") }, ...areas].map(
              (a) => {
                const active = a.id === area;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => pickArea(a.id)}
                    className={cn(
                      "h-9 cursor-pointer rounded-full border px-3.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent",
                    )}
                  >
                    {a.label}
                  </button>
                );
              },
            )}
          </div>

          <h3 className="sr-only">{t("home.map.listLabel")}</h3>
          <Stagger
            key={`${area}-${userLoc ? "near" : "status"}`}
            className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card"
          >
            {listed.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground">
                {t("home.map.empty")}
              </p>
            )}
            {listed.map((s) => {
              const p = s.properties;
              const selected = selectedId === p.id;
              const hovered = hoveredId === p.id;
              const meta = STATUS_META[p.status];
              return (
                <StaggerItem key={p.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleSite(p.id)}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(p.id)}
                    onBlur={() => setHoveredId(null)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                      selected
                        ? "bg-accent"
                        : hovered
                          ? "bg-muted/60"
                          : "hover:bg-muted/60",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-full",
                        meta.dot,
                      )}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {p.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {p.city}
                        <span className="sr-only">, {t(meta.labelKey)}</span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 font-mono text-xs tabular-nums">
                      {userLoc && (
                        <span className="text-muted-foreground">
                          {fmtKm(haversineKm(userLoc, siteLatLng(s)))}
                        </span>
                      )}
                      {p.status === "operational" ? (
                        <span className="inline-flex items-center gap-1 text-primary">
                          <Zap
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            aria-hidden
                          />
                          <span aria-hidden>{p.charger_available}</span>
                          <span className="sr-only">
                            {t("home.map.chargers").replace(
                              "{n}",
                              String(p.charger_available),
                            )}
                          </span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {p.status === "coming_soon"
                            ? t("home.map.comingSoon")
                            : t(meta.labelKey)}
                        </span>
                      )}
                    </span>
                  </button>
                </StaggerItem>
              );
            })}
            {hiddenCount > 0 && (
              <LocaleLink
                href="/super-charge/locations"
                className="block px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {t("home.map.more").replace("{n}", String(hiddenCount))}
              </LocaleLink>
            )}
          </Stagger>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <LocaleLink href="/super-charge/locations">
                {t("home.map.viewAll")}
              </LocaleLink>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={locate}
              disabled={geo === "locating"}
              aria-pressed={Boolean(userLoc)}
            >
              <LocateFixed className="h-4 w-4" aria-hidden />
              {userLoc ? t("home.map.nearMeActive") : t("home.map.nearMe")}
            </Button>
          </div>
          <p
            aria-live="polite"
            className={cn(
              "mt-2 min-h-5 text-xs",
              geo === "denied" || geo === "error"
                ? "text-destructive"
                : "text-muted-foreground",
            )}
          >
            {geoMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
