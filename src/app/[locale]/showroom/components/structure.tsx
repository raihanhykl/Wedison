"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/lib/language-context";
import ShowroomCarousel from "@/app/[locale]/showroom/components/showroom-carousel";
import MapComponent from "@/app/[locale]/showroom/components/map-component";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  MapPin,
  Car,
  Users,
  CreditCard,
  Wrench,
  Check,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { BookingTrigger } from "@/components/booking/booking-trigger";
import { SHOWROOM_LOCATIONS } from "@/lib/seo/showrooms";

export default function ShowroomPageStructure() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Showroom images
  const showroomImages = [
    {
      src: "/ShowRoom-Receptionist.webp",
      alt: "Wedison Motors Showroom Receptionist",
    },
    {
      src: "/showroom-waitingroom.webp",
      alt: "Wedison Motors Showroom Waiting Room",
    },
    // {
    //   src: "/placeholder.svg?height=600&width=1200",
    //   alt: "Wedison Motors Test Ride Area",
    // },
  ];

  // Active Experience Center locations (showroom + service center per location).
  // Koordinat & tautan peta dari satu sumber (src/lib/seo/showrooms.ts) yang juga
  // dipakai JSON-LD MotorcycleDealer di page.tsx — supaya data peta dan schema selalu sama.
  const locations = SHOWROOM_LOCATIONS.map((s) => ({
    id: s.id,
    nameKey: `showroom.${s.id}.name`,
    addressKey: `showroom.${s.id}.address`,
    mapsUrl: s.mapsUrl,
    lat: s.geo.latitude,
    lng: s.geo.longitude,
  }));

  const activeLocation = locations[activeIndex];

  // What you can do items
  const activities = [
    {
      icon: <Car className="h-6 w-6 text-primary" />,
      title: t("showroom.testRide.title"),
      description: t("showroom.testRide.description"),
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: t("showroom.consultation.title"),
      description: t("showroom.consultation.description"),
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: t("showroom.financing.title"),
      description: t("showroom.financing.description"),
    },
    {
      icon: <Wrench className="h-6 w-6 text-primary" />,
      title: t("showroom.service.title"),
      description: t("showroom.service.description"),
    },
  ];

  return (
    // Bukan <main>: landmark <main> tunggal disediakan layout locale (#konten).
    <div className="min-h-[70%] bg-background">
      {/* Hero Section with Carousel */}
      <section className="mt-20 md:mt-30">
        <div className="main-container">
          <Reveal className="text-center mb-8 md:mb-12">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-secondary font-mono text-xs uppercase tracking-wider text-primary">
              <span>{t("showroom.tag")}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {t("showroom.title")}{" "}
              <span className="text-primary relative">
                {t("showroom.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/40"></span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("showroom.description")}
            </p>
          </Reveal>

          <Reveal y={0}>
            <ShowroomCarousel images={showroomImages} />
          </Reveal>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="main-container">
          <Reveal>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                {t("showroom.location")}
              </h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                {t("showroom.locationDescription")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-8 items-start">
            {/* Daftar showroom */}
            <Stagger className="flex flex-col gap-4">
              {locations.map((location, index) => {
                const isActive = index === activeIndex;
                return (
                  <StaggerItem
                    key={location.nameKey}
                    className={cn(
                      "bg-card rounded-xl border shadow-sm transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)]",
                      isActive
                        ? "border-primary shadow-lg"
                        : "border-border hover:border-primary/40"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                      className="w-full text-left p-5 sm:p-6 pb-4 sm:pb-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                          {t(location.nameKey)}
                        </h3>
                        <span
                          className={cn(
                            "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-primary"
                          )}
                        >
                          <MapPin className="h-5 w-5" />
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-secondary text-primary border border-border">
                          {t("showroom.facility.showroom")}
                        </span>
                        <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-secondary text-primary border border-border">
                          {t("showroom.facility.service")}
                        </span>
                      </div>

                      <p className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span>{t(location.addressKey)}</span>
                      </p>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <div>
                          <p>{t("showroom.weekdays")}</p>
                          <p>{t("showroom.weekend")}</p>
                        </div>
                      </div>
                    </button>

                    {/* Mobile: peta tampil di dalam kartu yang aktif */}
                    {isActive && (
                      <div className="px-5 sm:px-6 lg:hidden">
                        <MapComponent
                          latitude={location.lat}
                          longitude={location.lng}
                          title={t(location.nameKey)}
                          className="h-[280px] md:h-[360px]"
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 px-5 sm:px-6 pb-5 sm:pb-6 pt-4">
                      {/* Showroom ikut terisi otomatis; tujuan dipilih sendiri oleh user */}
                      <BookingTrigger asChild showroom={location.id} source="showroom-card">
                        <Button size="sm" className="group">
                          {t("showroom.bookVisit")}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </BookingTrigger>
                      <Link
                        href={location.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          {t("showroom.viewOnMaps")}
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            {/* Desktop: satu peta sticky yang mengikuti showroom terpilih */}
            <div className="hidden lg:block sticky top-28">
              <Reveal y={0}>
                <div className="bg-card rounded-xl border border-border shadow-sm p-3">
                  <MapComponent
                    latitude={activeLocation.lat}
                    longitude={activeLocation.lng}
                    title={t(activeLocation.nameKey)}
                    className="h-[600px] md:h-[600px] shadow-none"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section className="py-16 md:py-20">
        <div className="main-container">
          <Reveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-8 text-center">
              {t("showroom.whatYouCanDo")}
            </h2>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {activities.map((activity, index) => (
              <StaggerItem
                key={index}
                className="bg-muted rounded-xl p-6 border border-border shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-2">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                        {activity.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
