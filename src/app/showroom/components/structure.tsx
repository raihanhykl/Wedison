"use client";

import { useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

export default function ShowroomPageStructure() {
  const { t } = useLanguage();

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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
              {t("showroom.location")}
            </span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
            {locations.map((location) => (
              <div
                key={location.nameKey}
                className="bg-white rounded-xl shadow-soft overflow-hidden flex flex-col"
              >
                <div className="p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    {t(location.nameKey)}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)] border border-[var(--primary-lighter)]">
                      {t("showroom.facility.showroom")}
                    </span>
                    <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)] border border-[var(--primary-lighter)]">
                      {t("showroom.facility.service")}
                    </span>
                  </div>

                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {t("showroom.findUs")}
                      </h4>
                      <p className="text-gray-600">
                        {t(location.addressKey)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start mb-6">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center">
                        <Clock className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {t("showroom.hours")}
                      </h4>
                      <p className="text-gray-600">
                        {t("showroom.weekdays")}
                      </p>
                      <p className="text-gray-600">{t("showroom.weekend")}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href={"/corporate/contact/#contact"}>
                      <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white group transition-all duration-300 hover:-translate-y-1">
                        {t("showroom.bookVisit")}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link href={location.mapsUrl} target="_blank">
                      <Button
                        variant="outline"
                        className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--secondary-light)] transition-all duration-300 hover:-translate-y-1"
                      >
                        {t("showroom.viewOnMaps")}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <MapComponent
                    latitude={location.lat}
                    longitude={location.lng}
                    zoom={15}
                  />
                </div>
              </div>
            ))}
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
