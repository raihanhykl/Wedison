"use client";

import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { BookingTrigger } from "@/components/booking/booking-trigger";

/** Alur kunjungan — urutan nyata (pilih jadwal -> datang -> test ride), jadi nomor bermakna. */
export default function VisitSteps() {
  const { t } = useLanguage();
  const steps = [1, 2, 3];

  return (
    <section className="bg-forest py-16 text-forest-foreground sm:py-24">
      <div className="main-container">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-[18ch] text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {t("showroomPage.steps.title")}
          </h2>
          <BookingTrigger asChild purpose="testRide" source="showroom-steps">
            <Button
              size="lg"
              className="w-fit bg-on-forest-accent text-forest-deep hover:bg-white"
            >
              {t("showroomPage.hero.ctaPrimary")}
            </Button>
          </BookingTrigger>
        </Reveal>

        <Stagger className="mt-12 grid gap-10 sm:mt-16 md:grid-cols-3 md:gap-8">
          {steps.map((n) => (
            <StaggerItem key={n} className="border-t border-white/20 pt-6">
              <span className="font-mono text-sm text-on-forest-accent">
                {String(n).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                {t(`showroomPage.steps.${n}.title`)}
              </h3>
              <p className="mt-3 max-w-[38ch] text-pretty leading-relaxed text-forest-foreground/80">
                {t(`showroomPage.steps.${n}.desc`)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
