"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import MapComponent from "@/app/[locale]/showroom/components/map-component";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import Image from "next/image";
import Contact from "@/components/contact3";

export default function ContactPage() {
  const { t } = useLanguage();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Contact information
  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: t("contact.headquarters"),
      content: t("showroom.address"),
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: t("contact.phone"),
      content: "(+62) 821-2465-7804",
      subContent: t("contact.phoneHours"),
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: t("contact.emailLabel"),
      content: "support@wedison.co",
      subContent: t("contact.emailResponse"),
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: t("contact.page.hours"),
      content: t("contact.page.business.hours"),
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
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-16 2xl:pt-24 bg-gradient-to-b from-muted to-background">
        <div className="main-container py-0 2xl:py-20">
          <Reveal className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 mb-4 border border-border rounded-full bg-secondary text-primary">
              <span className="text-sm font-medium">{t("contact.tag")}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
              {t("contact.title")}{" "}
              <span className="text-primary relative">
                {t("contact.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/40"></span>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              {t("contact.page.description")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="main-container">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {contactInfo.map((item, index) => (
              <StaggerItem key={index}>
                <div className="h-full bg-card border border-border rounded-xl p-6 shadow-sm transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(.16,1,.3,1)] hover:shadow-lg hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">{item.content}</p>
                      {item.subContent && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {item.subContent}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Social Media Links */}
          <Reveal delay={0.1} className="mt-10 text-center">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground mb-4">
              {t("contact.followUs")}
            </h3>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61562726390879"
                target="_blank" rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-secondary text-muted-foreground hover:text-primary transition-colors duration-300"
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
                target="_blank" rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-secondary text-muted-foreground hover:text-primary transition-colors duration-300"
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
              <a href="https://www.tiktok.com/@wedison.id" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/logo-tiktok-svgrepo-com.svg"
                  alt="tiktok"
                  width={80}
                  height={80}
                  className="h-10 w-10 p-2.5 flex items-center justify-center rounded-full bg-muted hover:bg-secondary text-muted-foreground hover:text-primary transition-colors duration-300"
                />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Form and Map Section */}
      <section id="contact" className="py-12 md:py-16 bg-muted">
        <div className="main-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <Contact />

            {/* Map */}
            <Reveal delay={0.1}>
              <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-6">
                  {t("contact.page.findUs")}
                </h2>
                <div className="h-[400px] md:h-[450px]">
                  <MapComponent
                    latitude={-6.2484}
                    longitude={106.781}
                    zoom={15}
                  />
                </div>
                <div className="mt-4 flex items-center text-muted-foreground">
                  <ExternalLink className="h-5 w-5 text-primary mr-2" />
                  <a
                    href="https://www.google.com/maps/place/Wedison+Showroom/@-6.248464,106.7806209,19z/data=!4m10!1m2!2m1!1swedison+showroom!3m6!1s0x2e69f10019a26049:0xa59abd5e111a8a10!8m2!3d-6.248447!4d106.7810459!15sChB3ZWRpc29uIHNob3dyb29tWhIiEHdlZGlzb24gc2hvd3Jvb22SARplbGVjdHJpY19tb3RvcmN5Y2xlX2RlYWxlcqoBOBABMh4QASIa377C9bwSIpBp7hHS_qeMc_QbuBNmgIsWHu0yFBACIhB3ZWRpc29uIHNob3dyb29t4AEA!16s%2Fg%2F11x1nqm1sg!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDQyMi4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t("contact.page.openInMaps")}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="main-container">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 text-foreground">
                {t("contact.page.faqTitle")}
              </h2>
            </Reveal>

            <Stagger className="space-y-6">
              {faqItems.map((item, index) => (
                <StaggerItem key={index}>
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground mb-2">
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </main>
  );
}
