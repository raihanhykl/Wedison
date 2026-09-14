"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/lib/language-context";
import ShowroomCarousel from "@/app/showroom/components/showroom-carousel";
import MapComponent from "@/app/showroom/components/map-component";
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

  // Active Experience Center locations (showroom + service center per location)
  const locations = [
    {
      nameKey: "showroom.jakarta.name",
      addressKey: "showroom.jakarta.address",
      mapsUrl:
        "https://www.google.com/maps/place/Wedison+Showroom/@-6.248464,106.7806209,19z/data=!4m10!1m2!2m1!1swedison+showroom!3m6!1s0x2e69f10019a26049:0xa59abd5e111a8a10!8m2!3d-6.248447!4d106.7810459!15sChB3ZWRpc29uIHNob3dyb29tWhIiEHdlZGlzb24gc2hvd3Jvb22SARplbGVjdHJpY19tb3RvcmN5Y2xlX2RlYWxlcqoBOBABMh4QASIa377C9bwSIpBp7hHS_qeMc_QbuBNmgIsWHu0yFBACIhB3ZWRpc29uIHNob3dyb29t4AEA!16s%2Fg%2F11x1nqm1sg!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D",
      lat: -6.2484,
      lng: 106.781,
    },
    {
      nameKey: "showroom.bekasi.name",
      addressKey: "showroom.bekasi.address",
      mapsUrl: "https://maps.app.goo.gl/DXB6csamG8R78XoP9",
      lat: -6.2597989,
      lng: 107.0199037,
    },
    {
      nameKey: "showroom.bandung.name",
      addressKey: "showroom.bandung.address",
      mapsUrl: "https://maps.app.goo.gl/T86DfRuAkHFBmhMs8",
      lat: -6.86542,
      lng: 107.514505,
    },
    {
      nameKey: "showroom.bali.name",
      addressKey: "showroom.bali.address",
      mapsUrl: "https://maps.app.goo.gl/og4ovnG2FgCAQAWt8",
      lat: -8.6359263,
      lng: 115.2213254,
    },
  ];

  const activeLocation = locations[activeIndex];

  // What you can do items
  const activities = [
    {
      icon: <Car className="h-6 w-6 text-[var(--primary)]" />,
      title: t("showroom.testRide.title"),
      description: t("showroom.testRide.description"),
    },
    {
      icon: <Users className="h-6 w-6 text-[var(--primary)]" />,
      title: t("showroom.consultation.title"),
      description: t("showroom.consultation.description"),
    },
    {
      icon: <CreditCard className="h-6 w-6 text-[var(--primary)]" />,
      title: t("showroom.financing.title"),
      description: t("showroom.financing.description"),
    },
    {
      icon: <Wrench className="h-6 w-6 text-[var(--primary)]" />,
      title: t("showroom.service.title"),
      description: t("showroom.service.description"),
    },
  ];

  return (
    <main className="min-h-[70%] bg-white">
      {/* Hero Section with Carousel */}
      <section className="mt-20 md:mt-30">
        <div className="main-container">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block px-4 py-1 mb-4 border border-[var(--primary-lighter)] rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)]">
              <span className="text-sm font-medium">{t("showroom.tag")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("showroom.title")}{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
                {t("showroom.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("showroom.description")}
            </p>
          </div>

          <ShowroomCarousel images={showroomImages} />
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="main-container">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                {t("showroom.location")}
              </span>
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              {t("showroom.locationDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-8 items-start">
            {/* Showroom list */}
            <ul className="flex flex-col gap-4">
              {locations.map((location, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={location.nameKey}
                    className={cn(
                      "bg-white rounded-xl border transition-all duration-300",
                      isActive
                        ? "border-[var(--primary)] shadow-soft-lg"
                        : "border-transparent shadow-soft hover:border-[var(--primary-lighter)]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                      className="w-full text-left p-5 sm:p-6 pb-4 sm:pb-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {t(location.nameKey)}
                        </h3>
                        <span
                          className={cn(
                            "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-300",
                            isActive
                              ? "bg-[var(--primary)] text-white"
                              : "bg-[var(--secondary-light)] text-[var(--primary)]"
                          )}
                        >
                          <MapPin className="h-5 w-5" />
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)] border border-[var(--primary-lighter)]">
                          {t("showroom.facility.showroom")}
                        </span>
                        <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)] border border-[var(--primary-lighter)]">
                          {t("showroom.facility.service")}
                        </span>
                      </div>

                      <p className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary)]" />
                        <span>{t(location.addressKey)}</span>
                      </p>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--primary)]" />
                        <div>
                          <p>{t("showroom.weekdays")}</p>
                          <p>{t("showroom.weekend")}</p>
                        </div>
                      </div>
                    </button>

                    {/* Mobile: map appears inside the selected card */}
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
                      <Link href={"/corporate/contact/#contact"}>
                        <Button
                          size="sm"
                          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300"
                        >
                          {t("showroom.bookVisit")}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                      </Link>
                      <Link
                        href={location.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary-light)] transition-all duration-300"
                        >
                          {t("showroom.viewOnMaps")}
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Desktop: single sticky map following the selected showroom */}
            <div className="hidden lg:block sticky top-28">
              <div className="bg-white rounded-xl shadow-soft p-3">
                <MapComponent
                  latitude={activeLocation.lat}
                  longitude={activeLocation.lng}
                  title={t(activeLocation.nameKey)}
                  className="h-[600px] md:h-[600px] shadow-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section className="py-16 md:py-20">
        <div className="main-container">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
              {t("showroom.whatYouCanDo")}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center mb-2">
                      <Check className="h-5 w-5 text-[var(--primary)] mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {activity.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{activity.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
