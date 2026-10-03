"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import MapComponent from "@/app/[locale]/showroom/components/map-component";
import { Reveal } from "@/components/motion/reveal";
import { BookingTrigger } from "@/components/booking/booking-trigger";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Contact from "@/components/contact3";
import { CONTACT, SOCIAL_PROFILES } from "@/lib/seo/site";
import { PUBLISHED_SHOWROOM_LOCATIONS } from "@/lib/seo/showrooms";
import { SHOWROOMS } from "@/lib/booking/showrooms";
import type { FormTopic } from "@/lib/contact-schema";

/** SEMENTARA: foto area resepsionis. Ganti dengan ASET-K01 (meja layanan/CS, 4:5). */
const HERO_IMAGE = "/ShowRoom-Receptionist.webp";

const SOCIAL_LABEL: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
};

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [topic, setTopic] = useState<FormTopic | null>(null);
  const href = (path: string) => `/${language}${path}`;
  const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    language === "id"
      ? "Halo Wedison, saya ingin bertanya tentang motor listrik Wedison."
      : "Hi Wedison, I have a question about Wedison electric motorcycles.",
  )}`;

  const goToForm = (next: FormTopic) => {
    setTopic(next);
    document.getElementById("contact")?.scrollIntoView({ block: "start" });
  };

  const rowClass =
    "group grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-6 border-b border-border py-6 text-left transition-colors sm:py-7";

  const routes: { key: string; node: (children: ReactNode) => ReactNode }[] = [
    {
      key: "testRide",
      node: (c) => (
        <BookingTrigger purpose="testRide" source="contact-page" className={rowClass}>
          {c}
        </BookingTrigger>
      ),
    },
    {
      key: "product",
      node: (c) => (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={rowClass}>
          {c}
        </a>
      ),
    },
    {
      key: "service",
      node: (c) => (
        <Link href={href("/showroom/#lokasi")} className={rowClass}>
          {c}
        </Link>
      ),
    },
    {
      key: "partnership",
      node: (c) => (
        <button type="button" onClick={() => goToForm("partnership")} className={rowClass}>
          {c}
        </button>
      ),
    },
    {
      key: "career",
      node: (c) => (
        <Link href={href("/career/")} className={rowClass}>
          {c}
        </Link>
      ),
    },
  ];

  const faq = [1, 2, 3, 4];

  return (
    // Bukan <main>: landmark <main> tunggal disediakan layout locale (#konten).
    <div className="bg-background">
      {/* ============ HERO + ARAHKAN SESUAI KEBUTUHAN ============ */}
      <section className="pb-16 pt-28 sm:pb-24 sm:pt-36">
        <div className="main-container grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
                {t("contact.tag")}
              </p>
              <h1 className="mt-4 max-w-[16ch] text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
                {t("contactPage.hero.title")}
              </h1>
              <p className="mt-5 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("contactPage.hero.desc")}
              </p>
            </Reveal>

            <nav aria-label={t("contactPage.routes.label")} className="mt-10 border-t border-border">
              {routes.map((r) => (
                <div key={r.key}>
                  {r.node(
                    <>
                      <span>
                        <span className="block font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                          {t(`contactPage.routes.${r.key}.title`)}
                        </span>
                        <span className="mt-1.5 block max-w-[56ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {t(`contactPage.routes.${r.key}.desc`).replace("{email}", CONTACT.hrEmail)}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary">
                        <span className="hidden sm:inline">{t(`contactPage.routes.${r.key}.action`)}</span>
                        {r.key === "product" ? (
                          <ArrowUpRight className="h-5 w-5" aria-hidden />
                        ) : (
                          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
                        )}
                      </span>
                    </>,
                  )}
                </div>
              ))}
            </nav>
          </div>

          <Reveal y={0} className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl bg-muted lg:block lg:sticky lg:top-28 lg:self-start">
            <Image
              src={HERO_IMAGE}
              alt={t("contactPage.hero.imageAlt")}
              fill
              priority
              sizes="35vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* ============ FORM + KONTAK LANGSUNG ============ */}
      <section id="contact" className="scroll-mt-24 bg-muted py-16 sm:py-24">
        <div className="main-container grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("contact.sendMessage")}
              </h2>
              <p className="mt-3 text-muted-foreground">{t("contact.emailResponse")}.</p>
            </Reveal>
            <div className="mt-8">
              <Contact topic={topic} />
            </div>
          </div>

          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("contactPage.direct.title")}
              </h2>
            </Reveal>
            <dl className="mt-8 border-t border-border">
              <ContactRow label={t("contactPage.direct.phone")}>
                <a href={`tel:${CONTACT.phoneE164}`} className="hover:text-primary hover:underline underline-offset-4">
                  {CONTACT.phoneDisplay}
                </a>
                <span className="text-muted-foreground"> · </span>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline underline-offset-4">
                  WhatsApp
                </a>
              </ContactRow>
              <ContactRow label={t("contact.emailLabel")}>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-primary hover:underline underline-offset-4">
                  {CONTACT.email}
                </a>
              </ContactRow>
              <ContactRow label={t("contactPage.direct.hours")}>
                {t("contact.page.business.hours")}
              </ContactRow>
              <ContactRow label={t("contact.headquarters")}>{t("showroom.address")}</ContactRow>
              <ContactRow label={t("contact.followUs")}>
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  {SOCIAL_PROFILES.map((url) => {
                    const key = Object.keys(SOCIAL_LABEL).find((k) => url.includes(k));
                    return (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline underline-offset-4">
                        {key ? SOCIAL_LABEL[key] : url}
                      </a>
                    );
                  })}
                </span>
              </ContactRow>
            </dl>
            <Reveal y={0} className="mt-8 overflow-hidden rounded-2xl border border-border">
              <div className="h-[260px]">
                <MapComponent latitude={-6.2484} longitude={106.781} zoom={15} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ KONTAK PER CABANG ============ */}
      <section className="py-16 sm:py-24">
        <div className="main-container">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("contactPage.branches.title")}
              </h2>
              <p className="mt-3 max-w-[52ch] text-muted-foreground">{t("contactPage.branches.desc")}</p>
            </div>
            <Link href={href("/showroom/")} className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline">
              {t("contactPage.branches.all")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
          <ul className="mt-10 grid grid-cols-1 border-t border-border sm:grid-cols-2">
            {PUBLISHED_SHOWROOM_LOCATIONS.map((s) => {
              const b = SHOWROOMS[s.id];
              return (
                <li key={s.id} className="border-b border-border py-6 sm:odd:pr-8 sm:even:border-l sm:even:pl-8">
                  <p className="font-display text-xl font-bold tracking-tight text-foreground">{t(b.nameKey)}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t(b.addressKey)}</p>
                  <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-primary">
                    <a href={`https://wa.me/${b.whatsapp}`} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      WhatsApp
                    </a>
                    <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                      {t("showroomPage.card.directions")}
                    </a>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="main-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <h2 className="max-w-[14ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("contact.page.faqTitle")}
            </h2>
            <Link href={href("/faq/")} className="mt-5 inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline">
              {t("contactPage.faq.all")}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
          <Accordion type="single" collapsible className="border-t border-border">
            {faq.map((n) => (
              <AccordionItem key={n} value={`q${n}`} className="border-border">
                <AccordionTrigger className="cursor-pointer py-6 font-display text-lg font-semibold tracking-tight text-foreground hover:no-underline sm:text-xl [&>svg]:size-5">
                  {t(`contact.page.faq.q${n}`)}
                </AccordionTrigger>
                <AccordionContent className="max-w-[62ch] pb-6 text-base leading-relaxed text-muted-foreground">
                  {t(`contact.page.faq.a${n}`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}
