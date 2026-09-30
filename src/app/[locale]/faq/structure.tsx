"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DropdownFAQ from "./dropdownFAQ";
import { FAQ_CATEGORIES, type FaqCategory } from "./questions";
import { useLanguage } from "@/app/lib/language-context";
import UserManualSection from "@/components/user-manual-section";
import { Reveal } from "@/components/motion/reveal";

/**
 * Halaman FAQ. Semua kategori & tanya-jawab dirender ke HTML (kategori non-aktif diberi
 * `hidden`, bukan dilepas dari DOM) supaya mesin pencari / asisten AI membaca seluruh
 * jawaban — cocok dengan FAQPage JSON-LD di page.tsx. Tab = pola WAI-ARIA tabs.
 */
export default function FaqStructure() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<FaqCategory>(FAQ_CATEGORIES[0]);

  return (
    <div>
      {/* banner */}
      <div className="relative h-[50vh] w-full bg-black/10">
        <Image
          src="/faq-banner.webp"
          fill
          sizes="100vw"
          priority
          alt=""
          className="object-cover object-[60%_100%]"
        />
        <div className="absolute inset-0 z-20 bg-black/50">
          <div className="mr-auto flex h-full w-full flex-col items-center justify-center text-white md:w-[50%]">
            <div className="flex flex-col items-center px-4 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/80">
                {t("faq.page.kicker")}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,4rem)] font-bold leading-tight tracking-tight text-white">
                {t("faq.page.title")}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {/* header */}
        <Reveal as="div" className="my-10 mb-6">
          <p className="my-4 max-w-3xl text-xl text-muted-foreground md:my-16">
            {t("faq.page.intro")}{" "}
            <Link
              href={`/${language}/corporate/contact/`}
              className="text-primary underline underline-offset-4"
            >
              {t("faq.page.contactLink")}
            </Link>
          </p>
        </Reveal>
      </div>

      {/* User Manual hub */}
      <UserManualSection variant="grid" />

      <div className="main-container">
        {/* tabs */}
        <div className="my-10 mb-6 flex w-full justify-between border-b border-border">
          <div
            role="tablist"
            aria-label={t("faq.page.tablist")}
            className="-mb-px flex space-x-8 overflow-x-auto"
          >
            {FAQ_CATEGORIES.map((cat) => {
              const active = activeTab === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  id={`faq-tab-${cat}`}
                  aria-selected={active}
                  aria-controls={`faq-panel-${cat}`}
                  onClick={() => setActiveTab(cat)}
                  className={`whitespace-nowrap border-b-2 px-1 py-4 font-display text-lg font-bold tracking-tight transition-colors ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-foreground hover:border-border hover:text-primary"
                  }`}
                >
                  {t(`faq.category.${cat}`)}
                </button>
              );
            })}
          </div>
        </div>

        {FAQ_CATEGORIES.map((cat) => (
          <section
            key={cat}
            id={`faq-panel-${cat}`}
            role="tabpanel"
            aria-labelledby={`faq-tab-${cat}`}
            hidden={activeTab !== cat}
          >
            <h2 className="sr-only">{t(`faq.category.${cat}`)}</h2>
            <DropdownFAQ title={cat} />
          </section>
        ))}
      </div>
    </div>
  );
}
