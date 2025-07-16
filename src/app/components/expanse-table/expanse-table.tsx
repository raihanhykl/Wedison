"use client";

import { useLanguage } from "@/app/lib/language-context";
import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Fuel } from "lucide-react";

export default function ExpenseComparisonTable() {
  const primaryColor = "oklch(0.6731 0.1424 158.78)";
  const { t } = useLanguage();

  const dailyData = [
    {
      category: "Electricity/Fuel (100km)",
      wedison: "15.000",
      honda: "50.000",
      savings: "35.000",
    },
    { category: "Maintenance", wedison: "0", honda: "5.000", savings: "5000" },
    {
      category: "Total",
      wedison: "15.000",
      honda: "55.000",
      savings: "40.000",
      isTotal: true,
    },
  ];

  const monthlyData = [
    {
      category: "Electricity/Fuel (100km)",
      wedison: "450.000",
      honda: "1.500.000",
      savings: "1.050.000",
    },
    {
      category: "Maintenance",
      wedison: "-",
      honda: "150.000",
      savings: "150.000",
    },
    {
      category: "Total",
      wedison: "450.000",
      honda: "1.650.000",
      savings: "1.200.000",
      isTotal: true,
    },
  ];

  const yearlyData = [
    {
      category: "Electricity/Fuel (100km)",
      wedison: "5.400.000",
      honda: "18.000.000",
      savings: "12.600.000",
    },
    {
      category: "Maintenance",
      wedison: "-",
      honda: "1.800.000",
      savings: "1.800.000",
    },
    {
      category: "Total",
      wedison: "5.400.000",
      honda: "19.800.000",
      savings: "14.400.000",
      isTotal: true,
    },
  ];

  const periods = [
    { title: "Daily", data: dailyData, icon: <Zap className="w-5 h-5" /> },
    {
      title: "Monthly",
      data: monthlyData,
      icon: <TrendingUp className="w-5 h-5" />,
    },
    { title: "Yearly", data: yearlyData, icon: <Fuel className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8"> */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-thin text-white mb-4 tracking-wide">
            Vehicle Cost Analysis
          </h1>
          <div
            className="w-24 h-1 mx-auto rounded-full"
            style={{ backgroundColor: primaryColor }}
          ></div>
        </div> */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-block px-4 py-1 mb-4 border border-[var(--primary-lighter)] rounded-full bg-[var(--secondary-light)] text-[var(--primary-dark)]">
              <span className="text-sm font-medium">
                {t("calculator.page.tag")}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              {t("calculator.page.title")}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent relative">
                {t("calculator.page.titleHighlight")}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]"></span>
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {t("calculator.page.description")}
            </p>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-8 lg:gap-12">
          {periods.map((period, periodIndex) => (
            <Card
              key={periodIndex}
              className="bg-white backdrop-blur-xl border-white/10 overflow-hidden"
            >
              {/* Period Header */}
              <div className="relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, transparent)`,
                  }}
                ></div>
                <div className="relative px-6 py-4 flex items-center gap-3">
                  <div className="text-gray-900/80">{period.icon}</div>
                  <h2 className="text-2xl font-light text-gray-900 tracking-wide">
                    {period.title} Expenses
                  </h2>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block p-6">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
                    Category
                  </div>
                  <div className="text-gray-600 text-sm font-medium uppercase tracking-wider text-center">
                    Wedison
                  </div>
                  <div className="text-gray-600 text-sm font-medium uppercase tracking-wider text-center">
                    Gasoline Bike
                  </div>
                  <div className="text-gray-600 text-sm font-medium uppercase tracking-wider text-center">
                    Savings
                  </div>
                </div>

                {period.data.map((row, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-4 gap-4 py-4 border-b border-gray-300 transition-all duration-300 hover:bg-white/5 ${
                      row.isTotal
                        ? "bg-gray-100/50 rounded-lg px-4 border-l-4 mt-4"
                        : ""
                    }`}
                    style={row.isTotal ? { borderLeftColor: primaryColor } : {}}
                  >
                    <div
                      className={`text-gray-600 ${
                        row.isTotal ? "font-medium" : "font-light"
                      }`}
                    >
                      {row.category}
                    </div>
                    <div
                      className={`text-center ${
                        row.isTotal
                          ? "text-gray-600 font-medium"
                          : "text-gray-600/80"
                      }`}
                    >
                      {row.wedison}
                    </div>
                    <div
                      className={`text-center ${
                        row.isTotal
                          ? "text-gray-600 font-medium"
                          : "text-gray-600/80"
                      }`}
                    >
                      {row.honda}
                    </div>
                    <div
                      className={`text-center font-semibold ${
                        row.isTotal ? "text-xl" : ""
                      }`}
                      style={{ color: primaryColor }}
                    >
                      {row.savings}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile/Tablet Cards */}
              <div className="lg:hidden p-6 space-y-4">
                {period.data.map((row, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                      row.isTotal
                        ? "bg-gradient-to-r from-gray-200/20 to-white/10 border-l-4"
                        : "bg-gray-100/20 backdrop-blur-sm"
                    }`}
                    style={row.isTotal ? { borderLeftColor: primaryColor } : {}}
                  >
                    <div className="p-4">
                      <h3
                        className={`text-gray-600 mb-3 ${
                          row.isTotal ? "font-medium text-lg" : "font-light"
                        }`}
                      >
                        {row.category}
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-gray-600/60 text-xs uppercase tracking-wider">
                            Wedison
                          </div>
                          <div className="text-gray-600 font-mono">
                            {row.wedison}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-gray-600/60 text-xs uppercase tracking-wider">
                            Gasoline Bike
                          </div>
                          <div className="text-gray-600 font-mono">
                            {row.honda}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-xs uppercase tracking-wider">
                            Savings
                          </span>
                          <span
                            className={`font-bold font-mono ${
                              row.isTotal ? "text-xl" : "text-lg"
                            }`}
                            style={{ color: primaryColor }}
                          >
                            {row.savings}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Note Section */}
        <Card className="mt-12 bg-white backdrop-blur-xl border-white/10 overflow-hidden">
          <div className="relative">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, transparent)`,
              }}
            ></div>
            <div className="relative p-6 md:p-8">
              <h3 className="text-xl font-light text-grey-600 mb-6 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                Analysis Notes
              </h3>

              <div className="space-y-4 text-grey-600 leading-relaxed">
                <p className="text-sm md:text-base">
                  Electric motorcycles are engineered for efficiency — not just
                  on the road, but in the workshop too.
                </p>
                <p className="text-sm md:text-base">
                  With fewer moving parts and no need for oil changes, spark
                  plugs, or complex transmissions, maintenance is minimal and
                  hassle-free.
                </p>
                <p className="text-sm md:text-base">
                  In contrast, gasoline motorcycles rely on multiple consumables
                  and intricate mechanical systems that require regular
                  servicing and frequent part replacements.
                </p>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/60 italic">
                    This data is based on an estimated fuel cost of IDR 50,000
                    per 100 km. Actual mileage and fuel consumption may vary
                    depending on riding habits, road conditions, and vehicle
                    maintenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
