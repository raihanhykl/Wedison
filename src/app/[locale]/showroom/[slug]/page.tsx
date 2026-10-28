import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { getSEOMetadata } from "@/app/lib/seo1";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, eventSchema, faqSchema } from "@/lib/seo/schema";
import { getTeaser, getTeaserList, getTeaserPreview } from "@/lib/cms/api";
import { resolveImages, teaserCopy, teaserFacts, type PublicTeaser } from "@/lib/teasers/teaser";
import type { Locale } from "@/app/lib/locale";
import TeaserHero from "./hero";
import TeaserEvent from "./event";
import TeaserExperience from "./experience";
import TeaserPromo from "./promo";
import TeaserModels from "./models";
import TeaserInquiry from "./inquiry";
import TeaserFaq, { faqItems } from "./faq";
import type { TeaserView } from "./view";

// Landing teaser pembukaan showroom, dikelola dari admin (/admin/teasers). Desain tetap di
// sini; wording, jadwal, gambar, dan titik kontak datang dari API.
//   - PUBLISHED  -> tampil (ISR, disegarkan webhook revalidate tag "teasers")
//   - DRAFT      -> 404 publik; admin melihatnya lewat draft mode (/api/preview/teaser)
//   - ARCHIVED   -> 308 ke /showroom/ agar tautan lama tetap berguna

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  return (await getTeaserList()).map((t) => ({ slug: t.slug }));
}

/** Data teaser untuk request ini: draft mode = versi admin (status apa pun). */
async function load(slug: string): Promise<{ teaser: PublicTeaser; preview: boolean } | "archived" | null> {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    const teaser = await getTeaserPreview(slug);
    if (teaser) return { teaser, preview: true };
  }
  const res = await getTeaser(slug);
  if (!res) return null;
  if (res.kind === "archived") return "archived";
  return { teaser: res.teaser, preview: false };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const data = await load(slug);
  if (!data || data === "archived") return {};
  const { teaser, preview } = data;
  const c = teaserCopy(teaser, loc);
  const images = resolveImages(teaser.images);
  return getSEOMetadata({
    locale: loc,
    path: `/showroom/${teaser.slug}`,
    title: c.seo.title,
    description: c.seo.description,
    keywords: c.seo.keywords,
    image: images.og,
    noIndex: preview || teaser.noIndex || teaser.status !== "PUBLISHED",
  });
}

export default async function TeaserPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const loc = (locale === "en" ? "en" : "id") as Locale;
  const data = await load(slug);
  if (data === "archived") permanentRedirect(`/${loc}/showroom/`);
  if (!data) notFound();

  const { teaser, preview } = data;
  const v: TeaserView = {
    locale: loc,
    teaser,
    c: teaserCopy(teaser, loc),
    facts: teaserFacts(teaser, loc),
    images: resolveImages(teaser.images),
    preview,
  };
  const path = `/showroom/${teaser.slug}`;

  return (
    // Bukan <main>: landmark <main> tunggal disediakan layout locale (#konten).
    // Alur: kabar & hitung mundur -> kapan/di mana -> apa yang bisa dilakukan -> promo ->
    // model -> tanya tim (form inquiry, masuk admin Leads) -> FAQ.
    <article id="teaser-page" aria-labelledby="teaser-hero-title" data-teaser={teaser.slug} className="bg-background">
      <JsonLd
        data={[
          breadcrumbSchema(loc, [
            { name: loc === "en" ? "Home" : "Beranda", path: "/" },
            { name: "Showroom", path: "/showroom" },
            { name: teaser.city, path },
          ]),
          eventSchema({
            locale: loc,
            name: v.c.event.calendarTitle || teaser.showroomName,
            description: v.c.seo.description,
            path,
            startDate: teaser.startAt,
            endDate: teaser.endAt,
            image: v.images.og,
            place: {
              name: teaser.showroomName,
              address: Object.fromEntries(Object.entries({ ...teaser.address, addressCountry: "ID" }).filter(([, val]) => val)),
            },
          }),
          faqSchema(faqItems(v.c).map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />
      <TeaserHero v={v} />
      <TeaserEvent v={v} />
      <TeaserExperience v={v} />
      <TeaserPromo v={v} />
      <TeaserModels v={v} />
      <TeaserInquiry v={v} />
      <TeaserFaq v={v} />
      {preview && <PreviewBar status={teaser.status} slug={teaser.slug} />}
    </article>
  );
}

function PreviewBar({ status, slug }: { status: PublicTeaser["status"]; slug: string }) {
  const label = { DRAFT: "Draft", PUBLISHED: "Published", ARCHIVED: "Archived" }[status];
  return (
    <div
      id="teaser-preview-bar"
      role="status"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-forest-deep/95 text-white backdrop-blur"
    >
      <div className="main-container flex flex-wrap items-center gap-x-4 gap-y-2 py-3 text-sm">
        <span className="rounded-full bg-on-forest-accent px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider text-forest-deep">
          Preview · {label}
        </span>
        <span className="text-white/80">You are seeing the admin preview. Visitors {status === "PUBLISHED" ? "see the saved version." : "cannot see this page yet."} The form does not send anything.</span>
        <span className="ml-auto flex gap-4 font-semibold">
          <Link href="/admin/teasers/" className="underline-offset-4 hover:underline">Back to admin</Link>
          <a href={`/api/preview/exit/?redirect=${encodeURIComponent(`/showroom/${slug}/`)}`} className="underline-offset-4 hover:underline">
            Exit preview
          </a>
        </span>
      </div>
    </div>
  );
}
