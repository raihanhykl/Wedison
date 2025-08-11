"use client";

import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ComparisonTableProps } from "../types/bike";
import { useLanguage } from "../lib/language-context";
import {
  createSpecifications,
  getSpecificationValue,
} from "@/service/specifications";
import Image from "next/image";

function useSyncedHScroll() {
  const nodesRef = useRef<Set<HTMLDivElement>>(new Set());
  const isSyncingRef = useRef(false);

  // Pastikan tipe tepat
  const register: React.RefCallback<HTMLDivElement> = useCallback((el) => {
    if (!el) return;

    nodesRef.current.add(el);

    // Penting: wrap delete agar return-nya void (bukan boolean)
    return () => {
      nodesRef.current.delete(el);
      // tidak return apa-apa => void
    };
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    const target = e.currentTarget as HTMLDivElement; // pastikan tipe tepat
    const { scrollLeft } = target;

    nodesRef.current.forEach((node) => {
      if (node !== target) {
        node.scrollLeft = scrollLeft;
      }
    });

    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  }, []);

  return { register, onScroll };
}

export default function ComparisonTable({
  //   bikes,
  primaryBikeId,
  mode = "overview",
}: ComparisonTableProps) {
  const bikes = ["mini", "athena", "victory", "edpower"];
  const { t } = useLanguage();
  const [comparisonBikeId, setComparisonBikeId] = useState<string | null>(null);
  //   const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  //   const headerScrollRef = useRef<HTMLDivElement>(null);
  //   const rowScrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { register, onScroll } = useSyncedHScroll();

  const primaryBike = primaryBikeId;
  //   const primaryBike = bikes.find((bike) => bike.id === primaryBikeId);
  const comparisonBike = comparisonBikeId ? comparisonBikeId : null;

  const displayedBikes =
    mode === "overview" ? bikes : [primaryBike, comparisonBike].filter(Boolean);
  //   const displayedBikes =
  //     mode === "overview"
  //       ? bikes
  //       : ([primaryBike, comparisonBike].filter(Boolean) as BikeSpecs[]);

  const availableForComparison = bikes.filter((bike) => bike !== primaryBikeId);

  // Use helper function to get specifications
  const specCategories = createSpecifications(t);

  const handleComparisonSelect = (bikeId: string) => {
    setComparisonBikeId(bikeId === comparisonBikeId ? null : bikeId);
  };

  const clearComparison = () => {
    setComparisonBikeId(null);
  };

  //   const handleScroll = (scrollLeft: number, excludeIndex?: number) => {

  //     if (headerScrollRef.current) {
  //       headerScrollRef.current.scrollLeft = scrollLeft;
  //     }

  //     rowScrollRefs.current.forEach((ref, index) => {
  //       if (ref && index !== excludeIndex) {
  //         ref.scrollLeft = scrollLeft;
  //       }
  //     });
  //   };

  return (
    <div className="w-full space-y-6">
      {/* Comparison Controls (Comparison Mode Only) */}
      {mode === "comparison" && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Compare Models</h3>
              {/* <h3 className="text-lg font-semibold">{t("comparison.title")}</h3> */}
              {/* <p className="text-sm text-muted-foreground"> */}
              {/* {t(`comparison.description`, { bikeName: primaryBike?.name })} */}
              {/* Select to compare */}
              {/* </p> */}
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={comparisonBikeId || ""}
                onValueChange={handleComparisonSelect}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={"Select a bike to compare"} />
                </SelectTrigger>
                <SelectContent>
                  {availableForComparison.map((bike) => (
                    <SelectItem key={bike} value={bike}>
                      {bike}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {comparisonBikeId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearComparison}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div
              className="grid gap-4 mb-0 sticky top-0 bg-background z-10 pb-4"
              style={{
                gridTemplateColumns: `minmax(200px, 300px) repeat(${displayedBikes.length}, 1fr)`,
              }}
            >
              <div className="font-bold text-lg">
                {/* {t("comparison.specifications")} */}
              </div>
              {displayedBikes.map((bike) => (
                <div
                  key={bike}
                  className={`text-center transition-all duration-300`}
                  // hoveredColumn === bike ? "transform scale-100" : ""

                  //   onMouseEnter={() => setHoveredColumn(bike)}
                  //   onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div className=" border-none outline-none flex flex-col items-start w-fit">
                    <Image
                      src={`/navbar-product/${bike}.webp`}
                      alt={bike!}
                      width={200}
                      height={200}
                      className=" "
                    />
                    <div className="flex items-center justify-center gap--2 w-full">
                      <h3 className="font-[500] tracking-widest text-2xl uppercase">
                        {bike}
                      </h3>
                      {/* {bike === primaryBikeId && (
                        <Badge variant="default" className="text-xs">
                          {t("comparison.primary")}
                        </Badge>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              {specCategories.map((category) => (
                <div key={category.title} className="space-y-0">
                  <h2 className="text-xl font-bold text-primary mb-4 border-b border-border pb-0 sticky left-0 bg-background">
                    {category.title}
                  </h2>

                  {category.specs.map((spec) => (
                    <div
                      key={spec.key}
                      className="grid gap-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors"
                      style={{
                        gridTemplateColumns: `minmax(200px, 300px) repeat(${displayedBikes.length}, 1fr)`,
                      }}
                    >
                      <div className="font-medium text-sm lg:text-base text-muted-foreground sticky left-0 bg-inherit pr-4">
                        {spec.label}
                      </div>
                      {displayedBikes.map((bike) => (
                        <div
                          key={bike}
                          className={`text-sm lg:text-base transition-all duration-200 px-2 py-1 rounded 
                          ${bike === primaryBikeId ? "font-semibold" : ""}`}
                        >
                          {getSpecificationValue(
                            bike!,
                            category.key,
                            spec.key,
                            t
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile View - Stacked by Category */}
      {/* <div className="md:hidden space-y-6">
        {specCategories.map((category) => (
          <Card key={category.title} className="p-4">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border pb-2">
              {category.title}
            </h2>

            <div className="space-y-4">
              {category.specs.map((spec) => (
                <div key={spec.key} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {spec.label}
                  </h4>
                  <div className="grid gap-3">
                    {displayedBikes.map((bike) => (
                      <div
                        key={bike}
                        className={`flex justify-between items-center p-3 rounded-lg border ${
                          bike === primaryBikeId
                            ? "border-primary bg-primary/5"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{bike}</span>
                          {bike === primaryBikeId && (
                            <Badge variant="default" className="text-xs">
                              {t("comparison.primary")}
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {getSpecificationValue(
                            bike!,
                            category.key,
                            spec.key,
                            t
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          buatkan job desription di linkedin pada section tambah pengalaman kerja
          - full rebuild website lama (wordpress) ke website baru menggunakan react + next js
          - menggunakan berbagai tools AI untuk mengoptimasi website, membuat asset image, dan kebutuhan lainnya
          - melakukan IT support untuk kebutuhan kantor
          

        ))}
      </div> */}
      <div className="md:hidden space-y-6">
        {specCategories.map((category) => (
          <Card key={category.title} className="p-4">
            <h2 className="text-lg font-bold text-primary mb-4 border-b border-border pb-2">
              {category.title}
            </h2>

            {/* Header */}
            <div className="mb-4">
              <div className="flex">
                <div className="w-32 flex-shrink-0 pr-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Specification
                  </div>
                </div>

                <div
                  ref={register}
                  className="flex-1 overflow-x-auto scrollbar-hide"
                  onScroll={onScroll}
                >
                  <div className="flex gap-2 min-w-max">
                    {displayedBikes.map((bike) => (
                      <div
                        key={bike}
                        className={`w-28 flex-shrink-0 text-center p-2 rounded-t border-b-2 ${
                          bike === primaryBikeId
                            ? "border-primary bg-primary/5"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium text-xs">{bike}</span>
                          {bike === primaryBikeId && (
                            <Badge
                              variant="default"
                              className="text-xs scale-75"
                            >
                              P
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {category.specs.map((spec) => (
                <div key={spec.key} className="flex border-b border-border/30">
                  <div className="w-32 flex-shrink-0 pr-2 py-2">
                    <div className="text-xs font-medium text-muted-foreground leading-tight">
                      {spec.label}
                    </div>
                  </div>

                  <div
                    ref={register}
                    className="flex-1 overflow-x-auto scrollbar-hide"
                    onScroll={onScroll}
                  >
                    <div className="flex gap-2 min-w-max">
                      {displayedBikes.map((bike) => (
                        <div
                          key={bike}
                          className={`w-28 flex-shrink-0 p-2 text-center border-l border-border/30 ${
                            bike === primaryBikeId
                              ? "bg-primary/5"
                              : "bg-muted/10"
                          }`}
                        >
                          <div className="text-xs font-medium break-words">
                            {getSpecificationValue(
                              bike!,
                              category.key,
                              spec.key,
                              t
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {/* No Comparison Selected Message */}
      {mode === "comparison" && !comparisonBike && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">
            {t("comparison.noSelection.title")}
          </h3>
          <p className="text-muted-foreground">
            {/* {t("comparison.noSelection.description", {
              bikeName: primaryBike?.name,
            })} */}
            No comparison selected
          </p>
        </Card>
      )}
    </div>
  );
}
