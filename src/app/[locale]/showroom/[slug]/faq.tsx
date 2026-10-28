import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import type { TeaserContent } from "@/lib/teasers/teaser";
import type { TeaserView } from "./view";

/** Item FAQ yang tampil — dipakai juga oleh page.tsx untuk JSON-LD FAQPage (teks identik). */
export function faqItems(c: TeaserContent) {
  return c.faq.items.filter((f) => f.q && f.a);
}

export default function TeaserFaq({ v }: { v: TeaserView }) {
  const items = faqItems(v.c);
  if (!items.length) return null;

  return (
    <section id="teaser-faq" aria-labelledby="teaser-faq-title" className="py-16 sm:py-24">
      <div id="teaser-faq-container" className="main-container grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal id="teaser-faq-heading">
          <h2 id="teaser-faq-title" className="max-w-[14ch] text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {v.c.faq.title}
          </h2>
        </Reveal>
        <Accordion id="teaser-faq-list" type="single" collapsible className="border-t border-border">
          {items.map((it, i) => (
            <AccordionItem key={i} id={`teaser-faq-item-${i + 1}`} value={`q${i + 1}`} className="border-border">
              {/* ID GTM dipasang di <span>/<p> di dalamnya: id trigger & konten dikelola Radix
                  (aria-controls / aria-labelledby), jangan ditimpa. */}
              <AccordionTrigger className="cursor-pointer py-6 font-display text-lg font-semibold tracking-tight text-foreground hover:no-underline sm:text-xl [&>svg]:size-5">
                <span id={`teaser-faq-question-${i + 1}`}>{it.q}</span>
              </AccordionTrigger>
              {/* forceMount: jawaban tetap ada di HTML untuk crawler & FAQPage; saat tertutup
                  disembunyikan lewat state Radix (forceMount tidak memasang atribut hidden). */}
              <AccordionContent
                forceMount
                className="max-w-[62ch] pb-6 text-base leading-relaxed text-muted-foreground in-data-[state=closed]:hidden"
              >
                <p id={`teaser-faq-answer-${i + 1}`}>{it.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
