"use client";

import ShowroomHero from "./hero";
import ShowroomLocations from "./locations";
import ShowroomActivities from "./activities";
import VisitSteps from "./visit-steps";
import ShowroomFaq from "./faq";
import ShowroomClosingCta from "./closing-cta";

/**
 * Experience Center / Showroom. Urutan mengikuti pertanyaan pengunjung:
 * di mana & kapan buka (lokasi) -> apa yang bisa dilakukan -> bagaimana alurnya -> keraguan
 * terakhir (FAQ) -> ajakan penutup.
 */
export default function ShowroomPageStructure() {
  return (
    // Bukan <main>: landmark <main> tunggal disediakan layout locale (#konten).
    <div className="bg-background">
      <ShowroomHero />
      <ShowroomLocations />
      <ShowroomActivities />
      <VisitSteps />
      <ShowroomFaq />
      <ShowroomClosingCta />
    </div>
  );
}
