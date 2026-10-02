"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SHOWROOMS } from "@/lib/booking/showrooms";
import { SHOWROOM_FAQ_COUNT } from "./faq-data";

export default function ShowroomFaq() {
  const { t, language } = useLanguage();
  const items = Array.from({ length: SHOWROOM_FAQ_COUNT }, (_, i) => i + 1);

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="main-container grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="max-w-[14ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("showroomPage.faq.title")}
          </h2>
          <p className="mt-4 max-w-[40ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("showroomPage.faq.desc")}
          </p>
          <Button asChild variant="outline" size="lg" className="mt-6">
            <a
              // Nomor cabang Jakarta = kontak utama Wedison.
              href={`https://wa.me/${SHOWROOMS.jakarta.whatsapp}?text=${encodeURIComponent(
                language === "id"
                  ? "Halo Wedison, saya ingin bertanya tentang kunjungan ke showroom."
                  : "Hi Wedison, I have a question about visiting a showroom.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {t("showroomPage.faq.whatsapp")}
            </a>
          </Button>
        </Reveal>

        <Accordion type="single" collapsible defaultValue="q1" className="border-t border-border">
          {items.map((n) => (
            <AccordionItem key={n} value={`q${n}`} className="border-border">
              <AccordionTrigger className="cursor-pointer py-6 font-display text-lg font-semibold tracking-tight text-foreground hover:no-underline sm:text-xl [&>svg]:size-5">
                {t(`showroomPage.faq.q${n}`)}
              </AccordionTrigger>
              <AccordionContent className="max-w-[62ch] pb-6 text-base leading-relaxed text-muted-foreground">
                {t(`showroomPage.faq.a${n}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
