"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, ChevronDown, Check } from "lucide-react";
import { ComparisonTableProps } from "../types/bike";
import { useLanguage } from "../lib/language-context";
import {
  createSpecifications,
  getSpecificationValue,
} from "@/service/specifications";
import Image from "next/image";
import Link from "next/link";

export default function ComparisonTable({
  primaryBikeId,
  mode = "overview",
}: ComparisonTableProps) {
  const bikes = ["mini", "athena", "victory", "edpower"];
  const { t } = useLanguage();
  const [comparisonBikeId, setComparisonBikeId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["engine", "battery"])
  );
  const [selectedBikes, setSelectedBikes] = useState<Set<string>>(
    new Set(bikes)
  );

  const primaryBike = primaryBikeId;
  const comparisonBike = comparisonBikeId ? comparisonBikeId : null;

  const displayedBikes =
    mode === "overview"
      ? bikes.filter((bike) => selectedBikes.has(bike))
      : [primaryBike, comparisonBike].filter(Boolean);

  const availableForComparison = bikes.filter((bike) => bike !== primaryBikeId);

  const specCategories = createSpecifications(t);

  const handleComparisonSelect = (bikeId: string) => {
    setComparisonBikeId(bikeId === comparisonBikeId ? null : bikeId);
  };

  const clearComparison = () => {
    setComparisonBikeId(null);
  };

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleBikeSelection = (bike: string) => {
    const newSelected = new Set(selectedBikes);
    if (newSelected.has(bike)) {
      if (newSelected.size > 1) {
        newSelected.delete(bike);
      }
    } else {
      newSelected.add(bike);
    }
    setSelectedBikes(newSelected);
  };

  const expandAll = () => {
    setExpandedCategories(new Set(specCategories.map((c) => c.key)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
          {t("compare.title") || "Compare Our Models"}
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          {t("compare.subtitle") ||
            "Find the perfect electric motorcycle that suits your lifestyle"}
        </p>
      </div>

      {/* Comparison Controls (Comparison Mode Only) */}
      {mode === "comparison" && (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              {t("compare.model")}
            </h3>
            <div className="flex items-center gap-2 md:gap-3">
              <Select
                value={comparisonBikeId || ""}
                onValueChange={handleComparisonSelect}
              >
                <SelectTrigger className="w-full sm:w-[160px] md:w-[200px]">
                  <SelectValue placeholder={t("compare.select.bike")} />
                </SelectTrigger>
                <SelectContent>
                  {availableForComparison.map((bike) => (
                    <SelectItem key={bike} value={bike}>
                      <span className="capitalize">{bike}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {comparisonBikeId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearComparison}
                  className="px-2 md:px-3"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden md:inline ml-1">Clear</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bike Selection Pills (Overview Mode) */}
      {mode === "overview" && (
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 mb-6 md:mb-8 lg:mb-10 px-2">
          {bikes.map((bike) => (
            <button
              key={bike}
              onClick={() => toggleBikeSelection(bike)}
              className={`
                px-3 sm:px-5 md:px-6 lg:px-8 py-1.5 sm:py-2 md:py-2.5 lg:py-3
                rounded-full text-xs sm:text-sm md:text-base font-medium
                transition-all duration-200
                ${
                  selectedBikes.has(bike)
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              <span className="flex items-center gap-1.5 md:gap-2">
                {selectedBikes.has(bike) && (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                )}
                <span className="capitalize">{bike}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mobile View - Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto">
          <div className="min-w-fit">
            {/* Product Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
              <div className="flex">
                <div className="w-[100px] flex-shrink-0" />
                <div className="flex">
                  {displayedBikes.map((bike) => (
                    <div
                      key={bike}
                      className="w-[100px] flex-shrink-0 p-2 flex flex-col items-center"
                    >
                      <div className="relative w-full aspect-[4/3] mb-1">
                        <Image
                          src={`/navbar-product/${bike}.webp`}
                          alt={bike!}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h3 className="font-bold text-xs uppercase tracking-wide text-gray-900 text-center">
                        {bike}
                      </h3>
                      <Link
                        href={`/${bike}`}
                        className="mt-1 text-[10px] text-[var(--primary)] hover:underline font-medium"
                      >
                        Details →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Expand/Collapse */}
            <div className="flex justify-center gap-3 py-2 bg-white border-b border-gray-100">
              <button
                onClick={expandAll}
                className="text-[10px] text-gray-500 hover:text-gray-700 font-medium px-2 py-1"
              >
                Expand All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-[10px] text-gray-500 hover:text-gray-700 font-medium px-2 py-1"
              >
                Collapse All
              </button>
            </div>

            {/* Mobile Specifications */}
            {specCategories.map((category, categoryIndex) => (
              <div
                key={category.key}
                className={categoryIndex !== 0 ? "border-t border-gray-200" : ""}
              >
                <button
                  onClick={() => toggleCategory(category.key)}
                  className="w-full flex items-center justify-between px-3 py-3 bg-gray-50 hover:bg-gray-100"
                >
                  <h3 className="text-sm font-bold text-gray-900">
                    {category.title}
                  </h3>
                  <div
                    className={`p-1 rounded-full bg-white border border-gray-200 transition-transform duration-300 ${
                      expandedCategories.has(category.key) ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-3 h-3 text-gray-600" />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedCategories.has(category.key) ? "max-h-[1500px]" : "max-h-0"
                  }`}
                >
                  {category.specs.map((spec, specIndex) => (
                    <div
                      key={spec.key}
                      className={`flex items-stretch ${
                        specIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      } ${specIndex !== category.specs.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <div className="w-[100px] flex-shrink-0 px-2 py-2 flex items-center">
                        <span className="text-[10px] text-gray-600 font-medium leading-tight">
                          {spec.label}
                        </span>
                      </div>
                      <div className="flex">
                        {displayedBikes.map((bike) => (
                          <div
                            key={bike}
                            className="w-[100px] flex-shrink-0 px-1 py-2 flex items-center justify-center border-l border-gray-100"
                          >
                            <span
                              className={`text-[10px] font-medium text-center leading-tight ${
                                bike === primaryBikeId ? "text-[var(--primary)]" : "text-gray-700"
                              }`}
                            >
                              {getSpecificationValue(bike!, category.key, spec.key, t)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet View - Full Width Grid */}
        <div className="hidden md:block">
          {/* Product Header */}
          <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 p-6 lg:p-8">
            <div
              className="grid gap-4 lg:gap-6"
              style={{
                gridTemplateColumns: `minmax(180px, 250px) repeat(${displayedBikes.length}, 1fr)`,
              }}
            >
              <div /> {/* Empty cell for label column */}
              {displayedBikes.map((bike) => (
                <div key={bike} className="flex flex-col items-center group">
                  <div className="relative w-full max-w-[200px] lg:max-w-[240px] aspect-[4/3] mb-3 lg:mb-4 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={`/navbar-product/${bike}.webp`}
                      alt={bike!}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg lg:text-xl xl:text-2xl uppercase tracking-widest text-gray-900 text-center">
                    {bike}
                  </h3>
                  <Link
                    href={`/${bike}`}
                    className="mt-2 lg:mt-3 text-sm lg:text-base text-[var(--primary)] hover:underline font-medium transition-colors"
                  >
                    {t("btn.learn.more") || "Learn More"} →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Expand/Collapse */}
          <div className="flex justify-center gap-4 lg:gap-6 py-4 lg:py-5 bg-white border-b border-gray-100">
            <button
              onClick={expandAll}
              className="text-sm lg:text-base text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("compare.expandAll") || "Expand All"}
            </button>
            <span className="text-gray-300 self-center">|</span>
            <button
              onClick={collapseAll}
              className="text-sm lg:text-base text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("compare.collapseAll") || "Collapse All"}
            </button>
          </div>

          {/* Desktop Specifications */}
          {specCategories.map((category, categoryIndex) => (
            <div
              key={category.key}
              className={categoryIndex !== 0 ? "border-t border-gray-200" : ""}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.key)}
                className="w-full flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">
                  {category.title}
                </h3>
                <div
                  className={`
                    p-2 lg:p-2.5 rounded-full bg-white shadow-sm border border-gray-200
                    transition-transform duration-300
                    ${expandedCategories.has(category.key) ? "rotate-180" : ""}
                  `}
                >
                  <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600" />
                </div>
              </button>

              {/* Category Content */}
              <div
                className={`
                  overflow-hidden transition-all duration-500 ease-in-out
                  ${expandedCategories.has(category.key) ? "max-h-[2000px]" : "max-h-0"}
                `}
              >
                <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                  {category.specs.map((spec, specIndex) => (
                    <div
                      key={spec.key}
                      className={`
                        grid items-center gap-4 lg:gap-6 py-4 lg:py-5
                        ${specIndex % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                        ${specIndex !== category.specs.length - 1 ? "border-b border-gray-100" : ""}
                        rounded-lg px-4 lg:px-6 -mx-2 lg:-mx-4
                      `}
                      style={{
                        gridTemplateColumns: `minmax(180px, 250px) repeat(${displayedBikes.length}, 1fr)`,
                      }}
                    >
                      {/* Spec Label */}
                      <div className="flex items-center">
                        <span className="text-sm lg:text-base xl:text-lg text-gray-600 font-medium">
                          {spec.label}
                        </span>
                      </div>

                      {/* Spec Values */}
                      {displayedBikes.map((bike) => (
                        <div key={bike} className="flex items-center justify-center">
                          <div
                            className={`
                              w-full max-w-[200px] text-center px-4 lg:px-6 py-3 lg:py-4
                              rounded-xl lg:rounded-2xl
                              text-sm lg:text-base xl:text-lg font-semibold
                              ${
                                bike === primaryBikeId
                                  ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                                  : "bg-gray-100 text-gray-800"
                              }
                            `}
                          >
                            {getSpecificationValue(bike!, category.key, spec.key, t)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Hint for Mobile */}
      {displayedBikes.length > 2 && (
        <div className="flex md:hidden justify-center mt-3">
          <p className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <span>←</span>
            <span>{t("compare.swipeHint") || "Swipe to see more"}</span>
            <span>→</span>
          </p>
        </div>
      )}
    </div>
  );
}
