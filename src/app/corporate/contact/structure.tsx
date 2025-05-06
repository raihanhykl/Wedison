"use client";

import { useEffect } from "react";
import { useLanguage } from "@/app/lib/language-context";
import { useInView } from "react-intersection-observer";
import ContactForm from "@/app/components/contact3";
import MapComponent from "@/app/showroom/components/map-component";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

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

  const { ref: formRef, inView: formInView } = useInView({
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
      icon: <MapPin className="h-6 w-6 text-teal-500" />,
      title: t("contact.headquarters"),
      content: t("showroom.address"),
    },
    {
      icon: <Phone className="h-6 w-6 text-teal-500" />,
      title: t("contact.phone"),
      content: "(+62) 821-2465-7804",
      subContent: t("contact.phoneHours"),
    },
    {
      icon: <Mail className="h-6 w-6 text-teal-500" />,
      title: t("contact.emailLabel"),
      content: "support@wedison.co",
      subContent: t("contact.emailResponse"),
    },
    {
      icon: <Clock className="h-6 w-6 text-teal-500" />,
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
      <section className="pt-8 2xl:pt-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-0 2xl:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 mb-4 border border-teal-200 rounded-full bg-teal-50 text-teal-600">
              <span className="text-sm font-medium">{t("contact.tag")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("contact.title")}{" "}
              <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent relative">
                {t("contact.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400"></span>
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
                    <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center">
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
                href="#"
                className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-500 transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg
                  className="h-6 w-6"
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
              <a
                href="#"
                className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-500 transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.123-.06h.08c2.643 0 2.987.012 4.043.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.123-.06h.08c2.643 0 2.987.012 4.043.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.067-.06-1.407-.06-4.123v-.08c0-2.643.012-2.987.06-4.043.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.123-.06h.08zm0 1.802h-.08c-2.643 0-2.987.012-4.043.06-1.064.049-1.791.218-2.427.465a4.902 4.902 0 00-1.772 1.153 4.902 4.902 0 00-1.153 1.772c-.247.636-.416 1.363-.465 2.427-.048 1.067-.06 1.407-.06 4.123v.08c0 2.643.012 2.987.06 4.043.049 1.064.218 1.791.465 2.427a4.902 4.902 0 001.153 1.772 4.902 4.902 0 001.772 1.153c.636.247 1.363.416 2.427.465 1.067.048 1.407.06 4.123.06h.08c2.643 0 2.987-.012 4.043-.06 1.064-.049 1.791-.218 2.427-.465a4.902 4.902 0 001.772-1.153 4.902 4.902 0 001.153-1.772c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123v-.08c0-2.643-.012-2.987-.06-4.043-.049-1.064-.218-1.791-.465-2.427a4.902 4.902 0 00-1.153-1.772 4.902 4.902 0 00-1.772-1.153c-.636-.247-1.363-.416-2.427-.465-1.067-.048-1.407-.06-4.123-.06zm0 3.063a4.955 4.955 0 110 9.91 4.955 4.955 0 010-9.91zm0 8.108a3.153 3.153 0 100-6.306 3.153 3.153 0 000 6.306zm6.784-8.322a1.158 1.158 0 11-2.316 0 1.158 1.158 0 012.316 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-500 transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-teal-50 text-gray-600 hover:text-teal-500 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form and Map Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div
              ref={formRef}
              className={cn(
                "transition-all duration-1000 transform",
                formInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              )}
            >
              <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent">
                    {t("contact.sendMessage")}
                  </span>
                </h2>
                <ContactForm />
              </div>
            </div>

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
                  <span className="bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent">
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
                  <ExternalLink className="h-5 w-5 text-teal-500 mr-2" />
                  <a
                    href="https://maps.google.com/?q=123+Electric+Avenue,+Innovation+District,+San+Francisco,+CA+94102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-500 hover:underline"
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-teal-500 to-teal-400 bg-clip-text text-transparent">
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
