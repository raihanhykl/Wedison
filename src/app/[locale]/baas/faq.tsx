"use client";

import Link from "next/link";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/app/lib/language-context";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

/** Jumlah pasangan tanya-jawab di kamus (baas.faq.N.q / .a). Dipakai page.tsx untuk FAQPage schema. */
export const FAQ_COUNT = 6;

/**
 * FAQ BaaS — jawaban selalu ada di DOM (forceMount + hidden via CSS) supaya terbaca crawler
 * tanpa JS, pola sama dengan halaman /faq.
 */
export default function BaasFaq() {
  const { t, language } = useLanguage();

  return (
    <section className="bg-muted py-16 sm:py-24">
      <div className="main-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
              {t("baas.faq.kicker")}
            </p>
            <h2 className="mt-4 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("baas.faq.title")}
            </h2>
            <p className="mt-6 text-sm text-muted-foreground">{t("baas.faq.more")}</p>
            <Link
              href={`/${language}/faq/`}
              className="group mt-1 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-primary"
            >
              {t("baas.faq.moreCta")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Accordion type="single" collapsible defaultValue="item-1" className="rounded-2xl border border-border bg-card px-5 shadow-[var(--shadow-sm)] sm:px-7">
            <Stagger>
              {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => (
                <StaggerItem key={n}>
                  <AccordionItem value={`item-${n}`} className="border-b border-border last:border-b-0">
                    <AccordionTrigger className="py-5 font-display text-base font-semibold tracking-tight text-foreground hover:no-underline sm:text-lg">
                      <h3 className="text-left">{t(`baas.faq.${n}.q`)}</h3>
                    </AccordionTrigger>
                    <AccordionPrimitive.Content
                      forceMount
                      className="overflow-hidden text-base leading-relaxed text-muted-foreground data-[state=closed]:hidden data-[state=open]:animate-accordion-down"
                    >
                      <div className="max-w-[60ch] pb-5">{t(`baas.faq.${n}.a`)}</div>
                    </AccordionPrimitive.Content>
                  </AccordionItem>
                </StaggerItem>
              ))}
            </Stagger>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
