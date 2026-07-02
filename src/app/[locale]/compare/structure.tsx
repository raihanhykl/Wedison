"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Plus, X, MessageCircle, MapPin } from "lucide-react";
import { useLanguage } from "@/app/lib/language-context";
import {
  createSpecifications,
  getSpecificationValue,
} from "@/service/specifications";
import { Reveal } from "@/components/motion/reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ALL_BIKES = ["bees", "athena", "victory", "edpower"] as const;
type Bike = (typeof ALL_BIKES)[number];
const BIKE_NAME: Record<Bike, string> = {
  bees: "Bees",
  athena: "Athena",
  victory: "Victory",
  edpower: "EdPower",
};
const MIN_COLS = 2;
const MAX_COLS = 4;
const WHATSAPP = "https://wa.me/6282124657804";

export default function CompareStructure({
  initialColumns,
  embedded = false,
}: {
  /** Kolom awal (mis. [motorType] dari halaman produk). Otomatis di-pad ke min 2. */
  initialColumns?: string[];
  /** true = menyatu di halaman produk: heading h2, tanpa hero band & help CTA. */
  embedded?: boolean;
} = {}) {
  const { t, language } = useLanguage();
  const categories = useMemo(() => createSpecifications(t), [t]);
  const [columns, setColumns] = useState<Bike[]>(() => {
    const seed = [
      ...new Set(
        (initialColumns ?? ["bees", "athena"]).filter((b): b is Bike =>
          (ALL_BIKES as readonly string[]).includes(b),
        ),
      ),
    ];
    // Pastikan minimal 2 kolom: pad dengan model lain yang belum terpilih.
    for (const b of ALL_BIKES) {
      if (seed.length >= MIN_COLS) break;
      if (!seed.includes(b)) seed.push(b);
    }
    return seed.slice(0, MAX_COLS);
  });
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const Heading = embedded ? "h2" : "h1";

  const canAdd =
    columns.length < MAX_COLS && ALL_BIKES.some((b) => !columns.includes(b));

  // Cegah motor sama di dua kolom: opsi = motor kolom ini + yang belum dipilih.
  const optionsFor = (current: Bike) =>
    ALL_BIKES.filter((b) => b === current || !columns.includes(b));

  const setColumn = (index: number, bike: Bike) =>
    setColumns((cols) => cols.map((c, i) => (i === index ? bike : c)));

  const addColumn = () => {
    const next = ALL_BIKES.find((b) => !columns.includes(b));
    if (next) setColumns((c) => [...c, next]);
  };

  const removeColumn = (index: number) =>
    setColumns((c) =>
      c.length > MIN_COLS ? c.filter((_, i) => i !== index) : c,
    );

  const toggleCategory = (key: string) =>
    setCollapsed((s) => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const allCollapsed = collapsed.size === categories.length;
  const toggleAll = () =>
    setCollapsed(
      allCollapsed ? new Set() : new Set(categories.map((c) => c.key)),
    );

  // Mobile: maksimal 2 model, tanpa scroll samping (ala Ather).
  const mobileColumns = columns.slice(0, 2);
  // Desktop: grid sejajar; minmax(0,1fr) -> kolom menyusut mengikuti lebar (tak pernah overflow).
  const desktopGrid = {
    gridTemplateColumns: `minmax(120px,210px) repeat(${columns.length}, minmax(0,1fr))`,
  };

  const valueClass = (allEqual: boolean) =>
    cn(
      "font-mono text-xs sm:text-sm",
      allEqual ? "text-muted-foreground" : "font-semibold text-foreground",
    );

  // Kartu picker dipakai ulang di mobile & desktop (dipanggil sebagai fungsi,
  // bukan komponen, agar Select tidak remount tiap render).
  const renderCard = (
    bike: Bike,
    index: number,
    opts: { showRemove: boolean; compact?: boolean },
  ) => (
    <div className="relative flex flex-col items-center rounded-xl border border-border bg-card p-3 text-center">
      {opts.showRemove && (
        <button
          onClick={() => removeColumn(index)}
          aria-label={`${t("compare.page.remove")} ${BIKE_NAME[bike]}`}
          className="absolute right-1.5 top-1.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <div
        className={cn(
          "relative aspect-[5/3] w-full",
          opts.compact ? "max-w-[96px]" : "max-w-[120px]",
        )}
      >
        <Image
          src={`/navbar-product/${bike}.webp`}
          alt={BIKE_NAME[bike]}
          fill
          sizes="120px"
          className="object-contain"
        />
      </div>
      <Select value={bike} onValueChange={(v) => setColumn(index, v as Bike)}>
        <SelectTrigger
          aria-label={t("compare.select.bike")}
          className="mt-2 h-8 w-full justify-center gap-1 border-border px-2 font-display text-sm font-semibold [&>svg]:shrink-0"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {optionsFor(bike).map((b) => (
            <SelectItem key={b} value={b}>
              {BIKE_NAME[b]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!opts.compact && (
        <Link
          href={`/${language}/${bike}/`}
          className="mt-1.5 text-xs font-medium text-primary hover:underline"
        >
          {t("compare.viewDetails")}
        </Link>
      )}
    </div>
  );

  const CategoryToggle = ({
    title,
    open,
    onClick,
  }: {
    title: string;
    open: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      aria-expanded={open}
      className="flex w-full items-center justify-between py-4 text-left"
    >
      <span className="font-display text-base font-semibold text-foreground sm:text-lg">
        {title}
      </span>
      <ChevronDown
        className={cn(
          "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
          open && "rotate-180",
        )}
      />
    </button>
  );

  return (
    <div>
      {/* ===================== HEADER ===================== */}
      <section className={cn(!embedded && "border-b border-border bg-muted/40")}>
        <div
          className={cn(
            "main-container text-center",
            embedded ? "pt-16 sm:pt-24" : "py-14 sm:py-20",
          )}
        >
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t("compare.page.kicker")}
            </p>
            <Heading
              className={cn(
                "mt-3 font-display font-bold tracking-tight text-foreground",
                embedded ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
              )}
            >
              {t("compare.title")}
            </Heading>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("compare.subtitle")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===================== PICKER + TABLE ===================== */}
      <section
        className={cn(
          "main-container",
          embedded ? "pb-16 pt-8 sm:pb-24" : "py-8 sm:py-12",
        )}
      >
        {/* toolbar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            onClick={toggleAll}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {allCollapsed ? t("compare.expandAll") : t("compare.collapseAll")}
          </button>
          {canAdd && (
            <button
              onClick={addColumn}
              className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              {t("compare.page.addBike")}
            </button>
          )}
        </div>

        {/* ---------- MOBILE VIEW (max 2, tanpa scroll samping) ---------- */}
        <div className="sm:hidden">
          <div
            className={cn(
              "z-30 grid grid-cols-2 gap-3 border-b border-border bg-background/95 py-3 backdrop-blur-sm",
              !embedded && "sticky top-16",
            )}
          >
            {mobileColumns.map((bike, i) => (
              <div key={i}>{renderCard(bike, i, { showRemove: false, compact: true })}</div>
            ))}
          </div>

          {categories.map((category) => {
            const open = !collapsed.has(category.key);
            return (
              <div key={category.key} className="border-b border-border">
                <CategoryToggle
                  title={category.title}
                  open={open}
                  onClick={() => toggleCategory(category.key)}
                />
                {open && (
                  <div className="pb-2">
                    {category.specs.map((spec) => {
                      const values = mobileColumns.map((b) =>
                        getSpecificationValue(b, category.key, spec.key, t),
                      );
                      const allEqual = values.every((v) => v === values[0]);
                      return (
                        <div
                          key={spec.key}
                          className="border-t border-border/60 py-3 first:border-t-0"
                        >
                          <div className="mb-1.5 text-center text-xs font-medium text-muted-foreground">
                            {spec.label}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {values.map((val, vi) => (
                              <div
                                key={vi}
                                className={cn(
                                  "rounded-md bg-muted/50 px-2 py-1.5 text-center",
                                  valueClass(allEqual),
                                )}
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ---------- DESKTOP VIEW (grid sejajar, sampai 4) ---------- */}
        <div className="hidden sm:block">
          <div
            className={cn(
              "z-30 grid gap-4 border-b border-border bg-background/95 py-4 backdrop-blur-sm",
              !embedded && "sm:sticky sm:top-16",
            )}
            style={desktopGrid}
          >
            <div aria-hidden />
            {columns.map((bike, i) => (
              <div key={i}>
                {renderCard(bike, i, { showRemove: columns.length > MIN_COLS })}
              </div>
            ))}
          </div>

          {categories.map((category) => {
            const open = !collapsed.has(category.key);
            return (
              <div key={category.key} className="border-b border-border">
                <CategoryToggle
                  title={category.title}
                  open={open}
                  onClick={() => toggleCategory(category.key)}
                />
                {open && (
                  <div className="pb-3">
                    {category.specs.map((spec, si) => {
                      const values = columns.map((b) =>
                        getSpecificationValue(b, category.key, spec.key, t),
                      );
                      const allEqual = values.every((v) => v === values[0]);
                      return (
                        <div
                          key={spec.key}
                          className={cn(
                            "grid items-center gap-4 rounded-lg py-3",
                            si % 2 === 1 && "bg-muted/40",
                          )}
                          style={desktopGrid}
                        >
                          <span className="pl-2 text-sm font-medium text-muted-foreground">
                            {spec.label}
                          </span>
                          {values.map((val, vi) => (
                            <span
                              key={vi}
                              className={cn("px-2 text-center", valueClass(allEqual))}
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ HELP CHOOSING CTA (hanya versi halaman /compare) ============ */}
      {!embedded && (
        <section className="bg-forest-deep text-forest-foreground">
        <div className="main-container py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t("compare.help.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-forest-muted">
              {t("compare.help.subtitle")}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-on-forest-accent px-6 py-3 font-semibold text-forest-deep transition-transform duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                {t("compare.help.whatsapp")}
              </Link>
              <Link
                href={`/${language}/showroom/`}
                className="inline-flex items-center gap-2 rounded-full border border-forest-foreground/30 px-6 py-3 font-semibold text-forest-foreground transition-colors duration-200 hover:bg-forest-foreground/10"
              >
                <MapPin className="h-5 w-5" />
                {t("compare.help.showroom")}
              </Link>
            </div>
          </Reveal>
        </div>
        </section>
      )}
    </div>
  );
}
