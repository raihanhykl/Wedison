"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarX, MessageCircle } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { BookingTrigger } from "@/components/booking/booking-trigger";
import {
  DEFAULT_PHOTO, addressLine, closureRange, dayName, dayRange, dotTime, hoursRows, nowIn,
  type PublicShowroom,
} from "@/lib/showrooms/showroom";
import { cn } from "@/lib/utils";
import { useOpenStatus } from "./use-open-status";

export const CARD_WIDTH = "w-[84vw] max-w-[360px] sm:w-[340px]";

type Props = {
  location: PublicShowroom;
  selected: boolean;
  onSelect: () => void;
};

/** Tanggal tutup khusus terdekat (≤ 45 hari ke depan) untuk diumumkan di kartu. */
function upcomingClosure(s: PublicShowroom) {
  const today = nowIn(s.timeZone).ymd;
  const limit = new Date(`${today}T00:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() + 45);
  const max = limit.toISOString().slice(0, 10);
  return [...s.closures].sort((a, b) => a.from.localeCompare(b.from)).find((c) => c.to >= today && c.from <= max) ?? null;
}

export function ShowroomCard({ location: s, selected, onSelect }: Props) {
  const { t, language } = useLanguage();
  const status = useOpenStatus(s);
  const name = s.name;
  const waText =
    language === "id"
      ? `Halo Wedison ${s.city}, saya ingin bertanya tentang kunjungan ke showroom.`
      : `Hi Wedison ${s.city}, I have a question about visiting the showroom.`;
  const facilities = ["Showroom", s.hasWorkshop && t("showroomPage.card.service"), s.hasSupercharge && "SuperCharge"].filter(Boolean).join(" · ");
  const closure = upcomingClosure(s);
  const time = (hhmm: string) => (language === "en" ? hhmm : dotTime(hhmm));

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
            src={s.photoUrl || DEFAULT_PHOTO}
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
          <p className="mt-1 text-sm text-muted-foreground">{facilities}</p>
        </div>
      </button>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <p className="mt-4 text-sm leading-relaxed text-foreground">{addressLine(s)}</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
          {hoursRows(s).map((r) => (
            <div key={r.days.join()} className="contents">
              <dt>{dayRange(r.days, language)}</dt>
              <dd className="tabular-nums">
                {r.hours ? `${time(r.hours.open)}–${time(r.hours.close)} ${s.tzLabel}` : t("showroomPage.card.closedDay")}
              </dd>
            </div>
          ))}
          {s.hours.holiday && (
            <>
              <dt>{t("showroomPage.card.holiday")}</dt>
              <dd className="tabular-nums">{time(s.hours.holiday.open)}–{time(s.hours.holiday.close)} {s.tzLabel}</dd>
            </>
          )}
        </dl>
        {closure && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
            <CalendarX className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span>
              {t("showroomPage.card.closure").replace("{date}", closureRange(closure, language))}
              {closure.note && <span className="text-muted-foreground"> · {closure.note}</span>}
            </span>
          </p>
        )}

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          {s.bookable ? (
            <BookingTrigger asChild showroom={s.id} source="showroom-card">
              <Button className="col-span-2">{t("showroom.bookVisit")}</Button>
            </BookingTrigger>
          ) : (
            <Button className="col-span-2" disabled>
              {t("showroomPage.card.bookingUnavailable")}
            </Button>
          )}
          {s.mapsUrl && (
            <Button asChild size="sm" variant="outline">
              <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer">
                {t("showroomPage.card.directions")}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          )}
          <Button asChild size="sm" variant="outline" className={cn(!s.mapsUrl && "col-span-2")}>
            <a
              href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(waText)}`}
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
  const { t, language } = useLanguage();
  // Saat SSR/sebelum mount tidak dirender: overlay di atas foto, jadi tanpa layout shift.
  if (!status) return null;
  const time = (hhmm: string) => (language === "en" ? hhmm : dotTime(hhmm));
  const open = status.kind === "open";
  const label =
    status.kind === "open"
      ? t("showroomPage.card.openUntil").replace("{time}", time(status.until))
      : status.kind === "closed"
        ? status.nextDay === "today"
          ? t("showroomPage.card.closedUntil").replace("{time}", time(status.at))
          : status.nextDay === "tomorrow"
            ? t("showroomPage.card.closedTomorrow").replace("{time}", time(status.at))
            : t("showroomPage.card.closedUntilDay").replace("{day}", dayName(status.nextDay, language, true)).replace("{time}", time(status.at))
        : status.kind === "closedToday"
          ? t("showroomPage.card.closedToday")
          : t("showroomPage.card.temporarilyClosed");
  return (
    <span
      className={cn(
        "absolute left-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-full bg-card/95 px-3 text-xs font-medium shadow-[var(--shadow-sm)]",
        open ? "text-primary" : "text-muted-foreground",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", open ? "bg-primary" : "bg-muted-foreground")} aria-hidden />
      {label}
    </span>
  );
}

/** Teaser cabang yang segera buka: hanya nama kota, tanpa alamat/kontak/aksi. */
export function UpcomingCard({ upcoming }: { upcoming: PublicShowroom }) {
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
