"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { useInView } from "react-intersection-observer";
import MapComponent from "@/app/showroom/components/map-component";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import Image from "next/image";
import Contact from "@/app/components/contact4";

export default function ContactPage() {
  const { t } = useLanguage();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // InView hooks for animations
  const { ref: infoRef, inView: infoInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const { ref: mapRef, inView: mapInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const { ref: faqRef, inView: faqInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Contact information
  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-[var(--primary)]" />,
      title: t("contact.headquarters"),
      content: t("showroom.address"),
    },
    {
      icon: <Phone className="h-6 w-6 text-[var(--primary)]" />,
      title: t("contact.phone"),
      content: "(+62) 821-2465-7804",
      subContent: t("contact.phoneHours"),
    },
    {
      icon: <Mail className="h-6 w-6 text-[var(--primary)]" />,
      title: t("contact.emailLabel"),
      content: "support@wedison.co",
      subContent: t("contact.emailResponse"),
    },
    {
      icon: <Clock className="h-6 w-6 text-[var(--primary)]" />,
      title: t("contact.page.hours"),
      content: t("showroom.weekdays"),
      //   subContent: t("showroom.weekend"),
    },
  ];

  // FAQ items
  const faqItems = [
    {
      question: t("contact.page.faq.q1"),
      answer: t("contact.page.faq.a1"),
    },
    {
      question: t("contact.page.faq.q2"),
      answer: t("contact.page.faq.a2"),
    },
    {
      question: t("contact.page.faq.q3"),
      answer: t("contact.page.faq.a3"),
    },
    {
      question: t("contact.page.faq.q4"),
      answer: t("contact.page.faq.a4"),
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-16 2xl:pt-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 2xl:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 mb-4 border border-[var(--primary-lighter)] rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)]">
              <span className="text-sm font-medium">{t("contact.tag")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("contact.title")}{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
                {t("contact.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              {t("contact.page.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section ref={infoRef} className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "bg-gray-50 rounded-xl p-6 shadow-soft transition-all duration-700 transform hover:shadow-soft-lg hover:-translate-y-1",
                  infoInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-lg bg-[var(--secondary-light)] flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-700">{item.content}</p>
                    {item.subContent && (
                      <p className="text-gray-500 text-sm mt-1">
                        {item.subContent}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Media Links */}
          <div
            className={cn(
              "mt-10 text-center transition-all duration-1000 transform",
              infoInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            )}
            style={{ transitionDelay: "500ms" }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {t("contact.followUs")}
            </h3>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61562726390879"
                target="_blank"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[var(--secondary-light)] text-gray-600 hover:text-[var(--primary)] transition-colors duration-300"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/wedison.id/"
                target="_blank"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[var(--secondary-light)] text-gray-600 hover:text-[var(--primary)] transition-colors duration-300"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.25-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@wedison.id" target="_blank">
                <Image
                  src="/logo-tiktok-svgrepo-com.svg"
                  alt="tiktok"
                  width={80}
                  height={80}
                  className="h-10 w-10 p-2.5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-[var(--secondary-light)] text-gray-600 hover:text-[var(--primary)] transition-colors duration-300"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form and Map Section */}
      <section id="contact" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <Contact />

            {/* Map */}
            <div
              ref={mapRef}
              className={cn(
                "transition-all duration-1000 transform",
                mapInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                    {t("contact.page.findUs")}
                  </span>
                </h2>
                <div className="h-[400px] md:h-[450px]">
                  <MapComponent
                    latitude={-6.2484}
                    longitude={106.781}
                    zoom={15}
                  />
                </div>
                <div className="mt-4 flex items-center text-gray-700">
                  <ExternalLink className="h-5 w-5 text-[var(--primary)] mr-2" />
                  <a
                    href="https://maps.google.com/?q=123+Electric+Avenue,+Innovation+District,+San+Francisco,+CA+94102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:underline"
                  >
                    {t("contact.page.openInMaps")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
              {t("contact.page.faqTitle")}
            </h2>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "bg-gray-50 rounded-xl p-6 shadow-soft transition-all duration-700 transform",
                    faqInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
