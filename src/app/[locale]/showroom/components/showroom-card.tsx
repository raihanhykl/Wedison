"use client";

import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { BookingTrigger } from "@/components/booking/booking-trigger";
import { SHOWROOMS, type OpeningHours } from "@/lib/booking/showrooms";
import { minutesToTime } from "@/lib/booking/slots";
import type { ShowroomLocation, UpcomingShowroom } from "@/lib/seo/showrooms";
import { cn } from "@/lib/utils";
import { useOpenStatus } from "./use-open-status";

/**
 * Foto per cabang. SEMENTARA memakai foto yang ada di repo — ganti dengan aset final dari
 * tim GD (brief: ASET-S02 "Foto cabang", 3:2, satu per cabang).
 */
const BRANCH_PHOTO: Record<string, string> = {
  jakarta: "/ShowRoom-Receptionist.webp",
  bekasi: "/showroom-waitingroom.webp",
  bandung: "/super-charge/supercharge-charging.webp",
  bali: "/new-looks/test image.webp",
};

const dot = (min: number) => minutesToTime(min).replace(":", ".");
const range = (h: OpeningHours) => `${dot(h.open)}–${dot(h.close)}`;

export const CARD_WIDTH = "w-[84vw] max-w-[360px] sm:w-[340px]";

type Props = {
  location: ShowroomLocation;
  selected: boolean;
  onSelect: () => void;
};

export function ShowroomCard({ location, selected, onSelect }: Props) {
  const { t, language } = useLanguage();
  const status = useOpenStatus(location.id);
  const branch = SHOWROOMS[location.id];
  const name = t(branch.nameKey);
  const city = name.replace(/^Wedison\s+/, "");
  const waText =
    language === "id"
      ? `Halo Wedison ${city}, saya ingin bertanya tentang kunjungan ke showroom.`
      : `Hi Wedison ${city}, I have a question about visiting the showroom.`;

  return (
    <article
      className={cn(
        CARD_WIDTH,
        "flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-card shadow-[var(--shadow-md)] transition-[border-color,box-shadow] duration-300",
        selected ? "border-primary shadow-[var(--shadow-lg)]" : "border-border",
      )}
    >
      {/* Area pilih: foto + nama. Memilih = peta terbang ke cabang ini. */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={t("showroomPage.card.showOnMap").replace("{name}", name)}
        className="group block cursor-pointer text-left"
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <Image
            src={BRANCH_PHOTO[location.id] ?? "/ShowRoom-Receptionist.webp"}
            alt={name}
            fill
            sizes="(max-width: 640px) 84vw, 340px"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
          />
          <StatusPill status={status} />
        </div>
        <div className="px-5 pt-5">
          <h4 className="font-display text-xl font-bold tracking-tight text-foreground">
            {name}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("showroomPage.card.facilities")}
          </p>
        </div>
      </button>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="mt-4 text-sm leading-relaxed text-foreground">{t(branch.addressKey)}</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
          <dt>{t("showroomPage.card.weekdays")}</dt>
          <dd className="tabular-nums">{range(branch.hours.weekday)} {branch.tzLabel}</dd>
          <dt>{t("showroomPage.card.weekend")}</dt>
          <dd className="tabular-nums">{range(branch.hours.weekend)} {branch.tzLabel}</dd>
        </dl>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <BookingTrigger asChild showroom={location.id} source="showroom-card">
            <Button className="col-span-2">{t("showroom.bookVisit")}</Button>
          </BookingTrigger>
          <Button asChild size="sm" variant="outline">
            <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
              {t("showroomPage.card.directions")}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a
              href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${name}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

function StatusPill({ status }: { status: ReturnType<typeof useOpenStatus> }) {
  const { t } = useLanguage();
  // Saat SSR/sebelum mount tidak dirender: overlay di atas foto, jadi tanpa layout shift.
  if (!status) return null;
  return (
    <span
      className={cn(
        "absolute left-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full bg-card/95 px-3 text-xs font-medium shadow-[var(--shadow-sm)]",
        status.open ? "text-primary" : "text-muted-foreground",
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", status.open ? "bg-primary" : "bg-muted-foreground")}
        aria-hidden
      />
      {status.open
        ? t("showroomPage.card.openUntil").replace("{time}", status.time)
        : t("showroomPage.card.closedUntil").replace("{time}", status.time)}
    </span>
  );
}

/** Teaser cabang yang segera buka: hanya nama kota, tanpa alamat/kontak/aksi. */
export function UpcomingCard({ upcoming }: { upcoming: UpcomingShowroom }) {
  const { t } = useLanguage();
  return (
    <article
      className={cn(
        CARD_WIDTH,
        "relative flex shrink-0 snap-start flex-col justify-between overflow-hidden rounded-2xl bg-forest-deep p-6 text-forest-foreground shadow-[var(--shadow-md)]",
      )}
    >
      {/* Kontur halus sebagai tekstur — sampai aset teaser kota (ASET-S03) tersedia. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 text-on-forest-accent/15"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
      >
        {[30, 50, 70, 90].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} strokeWidth="1" />
        ))}
      </svg>
      <span className="relative inline-flex w-fit items-center gap-2 rounded-full border border-on-forest-accent/40 px-3 py-1 text-xs font-medium text-on-forest-accent">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-on-forest-accent motion-reduce:animate-none" aria-hidden />
        {t("showroomPage.upcoming.label")}
      </span>
      <div className="relative mt-24">
        <h4 className="font-display text-4xl font-bold tracking-tight text-white">
          {upcoming.city}
        </h4>
        <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-forest-foreground/80">
          {t("showroomPage.upcoming.desc")}
        </p>
      </div>
    </article>
  );
}
