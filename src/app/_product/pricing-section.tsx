"use client";

import { useMemo, useState } from "react";
import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { Check, Gift, MessageCircle, Zap } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookingTrigger } from "@/components/booking/booking-trigger";
import { Reveal } from "@/components/motion/reveal";
import { EASE_OUT_EXPO } from "@/components/motion/config";
import { whatsappUrl } from "@/lib/seo/site";
import { cn } from "@/lib/utils";
import type { PriceEntry, PricingRegion, PricingScheme, ProductId, PublicPricing } from "@/lib/pricing/types";
import {
  PRODUCT_NAMES, defaultRegion, entriesFor, formatValidDate, pick, pickList, rupiah, rupiahShort,
  schemesFor, sortedRegions, startingPrice, superchargeTariff, termsFor, variantLabel,
} from "@/lib/pricing/select";

type Props = { model: ProductId; pricing: PublicPricing };

const fill = (s: string, vars: Record<string, string>) => Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{${k}}`, v), s);
const panelMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.28, ease: EASE_OUT_EXPO },
};

/**
 * Section "Harga & Skema" di halaman produk. Data: snapshot modul Pricing (server -> prop),
 * jadi angka sudah ada di HTML SSR. Interaksi: pilih wilayah (segmented) + skema (tab).
 * Wilayah tanpa baris harga -> panel "hubungi sales". Ringkasan semua wilayah ada di <details>
 * (tetap terbaca crawler, tidak menumpuk UI).
 */
export function PricingSection({ model, pricing }: Props) {
  const { t, language } = useLanguage();
  const locale = language === "en" ? "en" : "id";
  const name = PRODUCT_NAMES[model];
  const regions = useMemo(() => sortedRegions(pricing), [pricing]);
  const [regionSlug, setRegionSlug] = useState(() => defaultRegion(pricing)?.slug ?? regions[0]?.slug ?? "");
  const region = regions.find((r) => r.slug === regionSlug) ?? regions[0] ?? null;
  const schemes = useMemo(() => (region ? schemesFor(pricing, region.slug, model) : []), [pricing, region, model]);
  const [schemeSlug, setSchemeSlug] = useState<string | null>(null);
  const scheme = schemes.find((s) => s.slug === schemeSlug) ?? schemes[0] ?? null;
  const start = startingPrice(pricing, model);
  const tariff = superchargeTariff(pricing, model);
  const sc = pricing.settings.supercharge;
  const referral = pricing.settings.referral;
  const showReferral = referral.enabled && region ? referral.regionSlugs.includes(region.slug) : false;

  if (regions.length === 0) return null;

  const entries = region && scheme ? entriesFor(pricing, region.slug, scheme.slug, model) : [];
  const terms = region && scheme ? termsFor(pricing, region.slug, scheme.slug) : null;
  const included = pickList(terms?.included, locale);
  const tnc = pickList(terms?.terms, locale);
  const waNumber = region?.salesWhatsapp;
  const waText = fill(t("pricing.whatsappMessage"), { model: name, scheme: scheme ? pick(scheme.name, locale) : "-", region: region ? pick(region.name, locale) : "-" });
  const waHref = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}` : whatsappUrl(waText);

  return (
    <section id="harga" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 sm:py-24" aria-labelledby="pricing-heading">
      <div className="main-container">
        <Reveal className="max-w-3xl">
          <h2 id="pricing-heading" className="text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            {fill(t("pricing.title"), { model: name })}
          </h2>
          {start ? (
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("pricing.startingFrom")}{" "}
              <span className="font-mono text-lg font-semibold text-foreground tabular-nums sm:text-xl">{rupiah(start.net, locale)}</span>{" "}
              <span className="text-sm">({pick(start.region.priceLabel, locale) || fill(t("pricing.otrRegion"), { region: pick(start.region.name, locale) })})</span>
              {" · "}
              {t("pricing.subtitle")}
            </p>
          ) : (
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">{t("pricing.subtitle")}</p>
          )}
        </Reveal>

        {/* ── Pilih wilayah ─────────────────────────────────────────── */}
        <Reveal y={20} className="mt-10 sm:mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <span className="text-sm font-semibold text-foreground">{t("pricing.region")}</span>
            <div role="radiogroup" aria-label={t("pricing.region")} className="inline-flex w-fit max-w-full flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
              {regions.map((r) => {
                const active = region?.slug === r.slug;
                return (
                  <button
                    key={r.slug}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setRegionSlug(r.slug)}
                    className={cn(
                      "relative min-h-10 cursor-pointer rounded-lg px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      active ? "text-primary-foreground" : "text-foreground hover:bg-accent",
                    )}
                  >
                    {active && (
                      <m.span layoutId={`pricing-region-${model}`} className="absolute inset-0 rounded-lg bg-primary" transition={{ duration: 0.35, ease: EASE_OUT_EXPO }} aria-hidden />
                    )}
                    <span className="relative z-10">{pick(r.name, locale)}</span>
                  </button>
                );
              })}
            </div>
            {region?.coverage && <span className="text-xs text-muted-foreground">{pick(region.coverage, locale)}</span>}
          </div>
        </Reveal>

        {/* ── Konten per wilayah ────────────────────────────────────── */}
        <div className="mt-6 sm:mt-8">
          {region && schemes.length > 0 && scheme ? (
            <>
              {/* Tab skema */}
              <div role="tablist" aria-label={t("pricing.scheme")} className="flex gap-1 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {schemes.map((s) => {
                  const active = s.slug === scheme.slug;
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`pricing-panel-${model}`}
                      onClick={() => setSchemeSlug(s.slug)}
                      className={cn(
                        "relative shrink-0 cursor-pointer px-4 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-base",
                        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {pick(s.name, locale)}
                      {active && (
                        <m.span layoutId={`pricing-tab-${model}`} className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" transition={{ duration: 0.35, ease: EASE_OUT_EXPO }} aria-hidden />
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <m.div key={`${region.slug}-${scheme.slug}`} id={`pricing-panel-${model}`} role="tabpanel" {...panelMotion} className="mt-6 sm:mt-8">
                  <SchemeHeader scheme={scheme} locale={locale} t={t} />

                  {entries.length > 0 ? (
                    <div className={cn("mt-5 grid gap-4", entries.length > 1 ? "sm:grid-cols-2" : "sm:max-w-md")}>
                      {entries.map((e) => (
                        <PriceCard key={e.variant} entry={e} scheme={scheme} region={region} locale={locale} t={t} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-muted-foreground">{fill(t("pricing.notOffered"), { model: name, region: pick(region.name, locale) })}</p>
                  )}

                  {/* Tarif SuperCharge + referral: strip kecil, bukan kartu bertumpuk */}
                  {(tariff != null || showReferral) && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {tariff != null && (
                        <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
                          <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">{t("pricing.supercharge.label")}</span>{" "}
                            <span className="font-mono tabular-nums">{rupiah(tariff, locale)}</span>{" "}
                            <span className="text-muted-foreground">{locale === "en" ? sc.unitEn : sc.unitId}</span>
                            {(locale === "en" ? sc.noteEn : sc.noteId) && <span className="block text-xs text-muted-foreground">{locale === "en" ? sc.noteEn : sc.noteId}</span>}
                          </p>
                        </div>
                      )}
                      {showReferral && (
                        <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3">
                          <Gift className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                          <p className="text-sm text-foreground">
                            <span className="font-semibold">{locale === "en" ? referral.titleEn : referral.titleId}</span>{" "}
                            <span className="font-mono tabular-nums">{rupiah(referral.amount, locale)}</span>
                            <span className="block text-xs text-muted-foreground">{locale === "en" ? referral.descriptionEn : referral.descriptionId}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bonus per unit + mitra + S&K */}
                  {(included.length > 0 || tnc.length > 0 || (terms?.partners.length ?? 0) > 0) && (
                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
                      <div>
                        {included.length > 0 && (
                          <>
                            <h3 className="font-display text-lg font-semibold text-foreground">{t("pricing.included")}</h3>
                            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                              {included.map((item) => (
                                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                        {terms && terms.partners.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-sm font-semibold text-foreground">{t("pricing.partners")}</h3>
                            <ul className="mt-2 flex flex-wrap gap-2">
                              {terms.partners.map((p) => (
                                <li key={p} className="rounded-md border border-border bg-card px-2.5 py-1 text-xs text-foreground">{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div>
                        {tnc.length > 0 && (
                          <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
                            <AccordionItem value="terms" className="border-0">
                              <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">{t("pricing.terms")}</AccordionTrigger>
                              <AccordionContent>
                                <ol className="list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
                                  {tnc.map((item) => <li key={item}>{item}</li>)}
                                </ol>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                        <ValidityNote terms={terms} locale={locale} t={t} />
                      </div>
                    </div>
                  )}

                  <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                    {locale === "en" ? pricing.settings.disclaimerEn : pricing.settings.disclaimerId}
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <BookingTrigger asChild purpose="testRide" source="product-pricing">
                      <Button size="lg">{t("pricing.cta.testRide")}</Button>
                    </BookingTrigger>
                    <Button asChild size="lg" variant="outline">
                      <a href={waHref} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-5 w-5" aria-hidden />
                        {t("pricing.cta.whatsapp")}
                      </a>
                    </Button>
                  </div>
                </m.div>
              </AnimatePresence>
            </>
          ) : region ? (
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={region.slug} {...panelMotion} className="max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{fill(t("pricing.contactSales.title"), { region: pick(region.name, locale) })}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{fill(t("pricing.contactSales.desc"), { region: pick(region.name, locale) })}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <a href={waHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-5 w-5" aria-hidden />
                      {fill(t("pricing.contactSales.cta"), { region: pick(region.name, locale) })}
                    </a>
                  </Button>
                  <BookingTrigger asChild purpose="testRide" source="product-pricing">
                    <Button size="lg" variant="outline">{t("pricing.cta.testRide")}</Button>
                  </BookingTrigger>
                </div>
              </m.div>
            </AnimatePresence>
          ) : null}
        </div>

        <SummaryTable model={model} pricing={pricing} locale={locale} t={t} />
      </div>
    </section>
  );
}

type T = (key: string) => string;
type Loc = "id" | "en";

function SchemeHeader({ scheme, locale, t }: { scheme: PricingScheme; locale: Loc; t: T }) {
  const audience = scheme.audience === "ojol" ? t("pricing.audience.ojol") : scheme.audience === "b2b" ? t("pricing.audience.b2b") : null;
  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center gap-2">
        {scheme.tagline && <p className="text-base font-medium text-foreground">{pick(scheme.tagline, locale)}</p>}
        {audience && <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-primary">{audience}</span>}
      </div>
      {scheme.description && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pick(scheme.description, locale)}</p>}
    </div>
  );
}

function PriceCard({ entry, scheme, region, locale, t }: { entry: PriceEntry; scheme: PricingScheme; region: PricingRegion; locale: Loc; t: T }) {
  const label = variantLabel(entry.variant, locale);
  const kind = scheme.kind;
  const Big = ({ value, suffix }: { value: number; suffix?: string }) => (
    <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums sm:text-4xl">
      {rupiah(value, locale)}
      {suffix && <span className="ml-1 font-sans text-base font-medium text-muted-foreground">{suffix}</span>}
    </p>
  );
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div className="flex items-baseline justify-between gap-4 border-t border-border py-2 text-sm">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-mono font-medium text-foreground tabular-nums">{v}</dd>
    </div>
  );

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{entry.variant === "single" ? PRODUCT_NAMES[entry.model] : label}</p>

      {kind === "purchase" && entry.netPrice != null && (
        <>
          <Big value={entry.netPrice} />
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {entry.otrPrice != null && entry.otrPrice !== entry.netPrice && (
              <s className="font-mono text-muted-foreground tabular-nums">{rupiah(entry.otrPrice, locale)}</s>
            )}
            {entry.discount != null && entry.discount > 0 && (
              <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-primary">{fill(t("pricing.save"), { amount: rupiahShort(entry.discount, locale) })}</span>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{pick(region.priceLabel, locale) || fill(t("pricing.otrRegion"), { region: pick(region.name, locale) })}</p>
        </>
      )}

      {(kind === "rent_to_own" || kind === "rental") && entry.dailyFee != null && (
        <>
          <Big value={entry.dailyFee} suffix={t("pricing.perDay")} />
          <dl className="mt-4">
            {entry.downPayment != null && <Row k={t("pricing.downPayment")} v={rupiah(entry.downPayment, locale)} />}
            {entry.termMonths != null && <Row k={t("pricing.term")} v={fill(t("pricing.months"), { n: String(entry.termMonths) })} />}
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">{t(`pricing.ownership.${kind}`)}</p>
        </>
      )}

      {kind === "b2b_credit" && (
        <>
          {entry.installment36 != null && <Big value={entry.installment36} suffix={t("pricing.perMonth")} />}
          <dl className="mt-4">
            {entry.installment24 != null && <Row k={t("pricing.installment24")} v={`${rupiah(entry.installment24, locale)}${t("pricing.perMonth")}`} />}
            {entry.installment36 != null && <Row k={t("pricing.installment36")} v={`${rupiah(entry.installment36, locale)}${t("pricing.perMonth")}`} />}
            {entry.otrPrice != null && <Row k={t("pricing.otr")} v={rupiah(entry.otrPrice, locale)} />}
          </dl>
        </>
      )}

      {kind === "baas" && entry.unitPrice != null && (
        <>
          <Big value={entry.unitPrice} />
          <p className="mt-1 text-xs text-muted-foreground">{t("pricing.unitPrice")}</p>
          <dl className="mt-4">
            {entry.monthlyFee != null && <Row k={t("pricing.monthlyFee")} v={`${rupiah(entry.monthlyFee, locale)}${t("pricing.perMonth")}`} />}
          </dl>
        </>
      )}

      {entry.note && <p className="mt-3 text-xs text-muted-foreground">{pick(entry.note, locale)}</p>}
    </article>
  );
}

function ValidityNote({ terms, locale, t }: { terms: ReturnType<typeof termsFor>; locale: Loc; t: T }) {
  if (!terms) return null;
  const parts: string[] = [];
  if (terms.validFrom) parts.push(fill(t("pricing.validFrom"), { date: formatValidDate(terms.validFrom, locale) }));
  if (terms.validUntil) parts.push(fill(t("pricing.validUntil"), { date: formatValidDate(terms.validUntil, locale) }));
  const note = pick(terms.note, locale);
  if (parts.length === 0 && !note) return null;
  return (
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
      {parts.join(" ")}
      {parts.length > 0 && note ? " · " : ""}
      {note}
    </p>
  );
}

/** Tabel ringkas semua wilayah × skema × varian untuk model ini (AEO/GEO, tetap di HTML). */
function SummaryTable({ model, pricing, locale, t }: { model: ProductId; pricing: PublicPricing; locale: Loc; t: T }) {
  const rows = sortedRegions(pricing).flatMap((r) =>
    schemesFor(pricing, r.slug, model).flatMap((s) =>
      entriesFor(pricing, r.slug, s.slug, model).map((e) => {
        const price =
          s.kind === "purchase" && e.netPrice != null ? rupiah(e.netPrice, locale)
          : (s.kind === "rent_to_own" || s.kind === "rental") && e.dailyFee != null ? `${rupiah(e.dailyFee, locale)}${t("pricing.perDay")}`
          : s.kind === "b2b_credit" && e.installment36 != null ? `${rupiah(e.installment36, locale)}${t("pricing.perMonth")}`
          : s.kind === "baas" && e.unitPrice != null ? `${rupiah(e.unitPrice, locale)} + ${e.monthlyFee != null ? rupiah(e.monthlyFee, locale) : "-"}${t("pricing.perMonth")}`
          : "-";
        return { key: `${r.slug}-${s.slug}-${e.variant}`, region: pick(r.name, locale), scheme: pick(s.name, locale), variant: variantLabel(e.variant, locale), price };
      }),
    ),
  );
  if (rows.length === 0) return null;
  return (
    <details className="group mt-10 rounded-xl border border-border bg-card">
      <summary className="cursor-pointer list-none px-5 py-3 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block transition-transform duration-200 group-open:rotate-90" aria-hidden>›</span>
        {fill(t("pricing.summary.title"), { model: PRODUCT_NAMES[model] })}
      </summary>
      <div className="overflow-x-auto border-t border-border px-5 pb-4">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">{t("pricing.summary.region")}</th>
              <th className="py-2 pr-4 font-medium">{t("pricing.summary.scheme")}</th>
              <th className="py-2 pr-4 font-medium">{t("pricing.summary.variant")}</th>
              <th className="py-2 font-medium">{t("pricing.summary.price")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-border">
                <td className="py-2 pr-4 text-foreground">{r.region}</td>
                <td className="py-2 pr-4 text-foreground">{r.scheme}</td>
                <td className="py-2 pr-4 text-muted-foreground">{r.variant}</td>
                <td className="py-2 font-mono text-foreground tabular-nums">{r.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">{t("pricing.summary.note")}</p>
      </div>
    </details>
  );
}
