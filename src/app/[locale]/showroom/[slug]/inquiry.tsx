import { Mail, MessageCircle } from "lucide-react";
import Contact from "@/components/contact3";
import { Reveal } from "@/components/motion/reveal";
import type { FormTopic } from "@/lib/contact-schema";
import type { TeaserView } from "./view";

// Topik yang relevan untuk calon pembeli sebelum showroom buka.
const TOPICS: readonly FormTopic[] = ["productInfo", "testRide", "paymentOptions", "other"];

export default function TeaserInquiry({ v }: { v: TeaserView }) {
  const { c, teaser, preview } = v;
  const q = c.inquiry;
  const wa = `https://wa.me/${teaser.whatsapp}${q.whatsappText ? `?text=${encodeURIComponent(q.whatsappText)}` : ""}`;

  return (
    <section id="teaser-inquiry" aria-labelledby="teaser-inquiry-title" className="scroll-mt-24 bg-muted py-16 sm:py-24">
      <div id="teaser-inquiry-container" className="main-container grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
        <div id="teaser-inquiry-main">
          <Reveal id="teaser-inquiry-heading">
            <h2 id="teaser-inquiry-title" className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {q.title}
            </h2>
            {q.desc && (
              <p id="teaser-inquiry-desc" className="mt-4 max-w-[54ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {q.desc}
              </p>
            )}
          </Reveal>
          <div id="teaser-inquiry-form-wrapper" className="mt-8">
            {/* Pesan masuk ke admin Leads > Contact Messages dengan Source "Teaser: <kota>". */}
            <Contact
              idPrefix="teaser-inquiry-form"
              source={teaser.source}
              topics={TOPICS}
              emailTopicPrefix={`[Teaser ${teaser.city}] `}
              dryRun={preview}
            />
          </div>
        </div>

        <aside id="teaser-inquiry-direct" aria-labelledby="teaser-inquiry-direct-title" className="lg:pt-24">
          <h3 id="teaser-inquiry-direct-title" className="font-display text-2xl font-bold tracking-tight text-foreground">
            {q.directTitle}
          </h3>
          {q.directDesc && (
            <p id="teaser-inquiry-direct-desc" className="mt-3 max-w-[40ch] text-pretty text-base leading-relaxed text-muted-foreground">
              {q.directDesc}
            </p>
          )}
          <ul id="teaser-inquiry-direct-list" className="mt-6 border-t border-border">
            <li id="teaser-inquiry-direct-whatsapp" className="border-b border-border py-4">
              <a
                id="teaser-inquiry-whatsapp-link"
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                <MessageCircle id="teaser-inquiry-whatsapp-icon" aria-hidden className="h-5 w-5 text-primary" />
                {q.whatsappLabel || "WhatsApp"}
              </a>
            </li>
            <li id="teaser-inquiry-direct-email" className="border-b border-border py-4">
              <a
                id="teaser-inquiry-email-link"
                href={`mailto:${teaser.email}`}
                className="inline-flex items-center gap-3 font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                <Mail id="teaser-inquiry-email-icon" aria-hidden className="h-5 w-5 text-primary" />
                <span id="teaser-inquiry-email-text">
                  <span id="teaser-inquiry-email-label" className="sr-only">{q.emailLabel || "Email"}: </span>
                  {teaser.email}
                </span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
