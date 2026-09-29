"use client";
import React, { useState } from "react";
import DropdownFAQ from "./dropdownFAQ";
// import { questions } from "./questions";
import Link from "next/link";
import Image from "next/image";
import GetQuestions from "./questions";
import { useLanguage } from "@/app/lib/language-context";
import UserManualSection from "@/components/user-manual-section";
import { Reveal } from "@/components/motion/reveal";

export default function FaqStructure() {
  const { t } = useLanguage();
  const sections = [
    {
      title: "Battery",
      description: t("faq.category.Battery"),
    },
    {
      title: "Charging",
      description: t("faq.category.Charging"),
    },
    {
      title: "Performance",
      description: t("faq.category.Performance"),
    },
    {
      title: "Safety",
      description: t("faq.category.Safety"),
    },
    {
      title: "Servicing",
      description: t("faq.category.Servicing"),
    },
    {
      title: "SmartFeatures",
      description: t("faq.category.SmartFeatures"),
    },
    {
      title: "Tires",
      description: t("faq.category.Tires"),
    },
  ];

  const [activeTab, setActiveTab] = useState(sections[0].title);
  return (
    <div>
      {/* banner */}
      <div className="relative h-[50vh] w-full bg-black/10">
        <Image
          src={"/faq-banner.webp"}
          height={400}
          width={1400}
          alt=""
          className=" h-full w-full object-cover object-[60%_100%] absolute inset-0 z-10"
        />
        <div className=" w-full h-full bg-black/50 absolute inset-0 z-20">
          <div className=" h-full w-full md:w-[50%] mr-auto text-white flex-col flex items-center justify-center">
            <div className=" flex flex-col items-center">
              <h1 className="font-display font-bold tracking-tight text-white px-4 text-center text-[clamp(2.4rem,7vw,4.5rem)]">
                FAQ
              </h1>
              {/* <p className="my-2 text-xl text-white">
                Find answers to the most common questions about our services,
                products, and general information. If you don&apos;t see the
                answer you&apos;re looking for, feel free to{" "}
                <Link
                  href="/corporate/contact"
                  className=" text-primary underline"
                >
                  reach out to our team.
                </Link>
              </p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {/* header */}
        <Reveal as="div" className="mb-6 my-10">
          <p className="my-4 md:my-16 text-xl text-muted-foreground max-w-3xl">
            Find answers to the most common questions about our services,
            products, and general information. If you don&apos;t see the answer
            you&apos;re looking for, feel free to{" "}
            <Link href="/corporate/contact" className=" text-primary underline">
              reach out to our team.
            </Link>
          </p>
        </Reveal>
      </div>

      {/* User Manual hub */}
      <UserManualSection variant="grid" />

      <div className="main-container">
        {/* tabs */}
        <div className="flex justify-between border-b border-border mb-6 w-full my-10">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {sections.map((section, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(section.title)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-display font-bold tracking-tight text-lg transition-colors ${
                  activeTab === section.title
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground hover:text-primary hover:border-border"
                }`}
              >
                {section.description}
              </button>
            ))}
          </nav>
        </div>
        <DropdownFAQ
          title={activeTab as keyof ReturnType<typeof GetQuestions>}
        />
      </div>
    </div>
  );
}
