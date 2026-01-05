"use client";

import React, { useState } from "react";
import { HeroSlide } from "@/components/hero";
import type {
  ContentPosition,
  TextAlign,
  ContentWidth,
  OverlayVariant,
  AnimationDirection,
} from "@/components/hero";

// Sample background image - replace with actual images
const SAMPLE_BG = "/super-charge/supercharge-hero-1.webp";

// ============================================================================
// LABEL OVERLAY COMPONENT
// ============================================================================

interface LabelOverlayProps {
  label: string;
  sublabel?: string;
}

const LabelOverlay: React.FC<LabelOverlayProps> = ({ label, sublabel }) => (
  <div className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg max-w-xs sm:max-w-sm">
    <p className="font-mono text-sm sm:text-base font-semibold">{label}</p>
    {sublabel && (
      <p className="text-xs sm:text-sm text-gray-300 mt-1">{sublabel}</p>
    )}
  </div>
);

// ============================================================================
// SECTION DIVIDER COMPONENT
// ============================================================================

interface SectionDividerProps {
  title: string;
  description: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  title,
  description,
}) => (
  <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
    <div className="text-center max-w-2xl">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
        {title}
      </h2>
      <p className="text-lg sm:text-xl text-gray-400">{description}</p>
    </div>
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function HeroLayoutsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: "variants", label: "Content Variants" },
    { id: "positions", label: "Positions" },
    { id: "overlays", label: "Overlays" },
    { id: "animations", label: "Animations" },
    { id: "themes", label: "Themes" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md rounded-full px-2 py-2">
        <div className="flex gap-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? "bg-[var(--primary)] text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Header */}
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            HeroSlide
            <span className="bg-gradient-to-r from-[var(--primary-light)] to-teal-300 bg-clip-text text-transparent">
              {" "}
              Showcase
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-8">
            Referensi visual untuk semua variant layout Hero section. Scroll ke
            bawah untuk melihat setiap layout dalam ukuran full-width dan
            full-viewport.
          </p>
          <button
            onClick={() => scrollToSection("variants")}
            className="px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-full font-medium transition-colors"
          >
            Mulai Eksplorasi
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CONTENT VARIANTS SECTION */}
      {/* ================================================================ */}
      <div id="variants">
        <SectionDivider
          title="Content Variants"
          description="Berbagai jenis konten yang dapat ditampilkan di Hero slide berdasarkan kebutuhan design."
        />

        {/* text-and-cta */}
        <div className="relative w-full">
          <LabelOverlay
            label='variant="text-and-cta"'
            sublabel="Full content: tag, title, description, buttons"
          />
          <HeroSlide
            variant="text-and-cta"
            position="center-left"
            backgroundImage={SAMPLE_BG}
            overlay="gradient-left"
            overlayOpacity={70}
            tag="New Release"
            title="Experience the Future of"
            titleHighlight="Electric Mobility"
            description="Discover our latest innovation in sustainable transportation with cutting-edge technology."
            primaryCTA={{ label: "Order Now", icon: "arrow" }}
            secondaryCTA={{ label: "Learn More", icon: "download" }}
            height="90vh"
            animated={false}
          />
        </div>

        {/* text-only */}
        <div className="relative w-full">
          <LabelOverlay
            label='variant="text-only"'
            sublabel="Only text elements: tag, title, description"
          />
          <HeroSlide
            variant="text-only"
            position="center-left"
            backgroundImage={SAMPLE_BG}
            overlay="gradient-left"
            overlayOpacity={70}
            tag="Featured"
            title="Innovation Meets"
            titleHighlight="Design"
            description="A perfect blend of form and function, crafted for the modern rider."
            height="screen"
            animated={false}
          />
        </div>

        {/* cta-only */}
        <div className="relative w-full">
          <LabelOverlay
            label='variant="cta-only"'
            sublabel="Only CTA buttons (text included in design)"
          />
          <HeroSlide
            variant="cta-only"
            position="bottom-center"
            textAlign="center"
            backgroundImage={SAMPLE_BG}
            overlay="gradient-bottom"
            overlayOpacity={80}
            primaryCTA={{ label: "Shop Now", icon: "arrow" }}
            secondaryCTA={{ label: "View Collection" }}
            height="screen"
            animated={false}
          />
        </div>

        {/* title-only */}
        <div className="relative w-full">
          <LabelOverlay
            label='variant="title-only"'
            sublabel="Only title (minimal design)"
          />
          <HeroSlide
            variant="title-only"
            position="center"
            textAlign="center"
            contentWidth="wide"
            backgroundImage={SAMPLE_BG}
            overlay="dark"
            overlayOpacity={50}
            title="Simply"
            titleHighlight="Beautiful"
            height="screen"
            animated={false}
          />
        </div>

        {/* empty */}
        <div className="relative w-full">
          <LabelOverlay
            label='variant="empty"'
            sublabel="No overlay content (design includes everything)"
          />
          <HeroSlide
            variant="empty"
            backgroundImage={SAMPLE_BG}
            overlay="none"
            height="screen"
            animated={false}
          >
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                Custom Content Here
              </p>
              <p className="text-xs text-gray-600">
                Use children for custom layouts
              </p>
            </div>
          </HeroSlide>
        </div>
      </div>

      {/* ================================================================ */}
      {/* POSITIONS SECTION */}
      {/* ================================================================ */}
      <div id="positions">
        <SectionDivider
          title="Content Positions"
          description="9 posisi berbeda untuk menempatkan konten di Hero slide menggunakan sistem grid."
        />

        {(
          [
            "top-left",
            "top-center",
            "top-right",
            "center-left",
            "center",
            "center-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
          ] as ContentPosition[]
        ).map((pos) => (
          <div key={pos} className="relative w-full">
            <LabelOverlay label={`position="${pos}"`} />
            <HeroSlide
              variant="text-only"
              position={pos}
              textAlign={
                pos.includes("left")
                  ? "left"
                  : pos.includes("right")
                  ? "right"
                  : "center"
              }
              contentWidth="narrow"
              backgroundImage={SAMPLE_BG}
              overlay="dark"
              overlayOpacity={40}
              title="Content"
              titleHighlight="Here"
              description="Position demonstration"
              height="screen"
              animated={false}
            />
          </div>
        ))}

        {/* Text Alignment Sub-section */}
        <div className="w-full min-h-[50vh] flex items-center justify-center bg-gray-800 text-white px-4">
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Text Alignment
            </h3>
            <p className="text-gray-400">
              Pengaturan alignment teks dalam area konten.
            </p>
          </div>
        </div>

        {(["left", "center", "right"] as TextAlign[]).map((align) => (
          <div key={align} className="relative w-full">
            <LabelOverlay label={`textAlign="${align}"`} />
            <HeroSlide
              variant="text-and-cta"
              position="center"
              textAlign={align}
              contentWidth="medium"
              backgroundImage={SAMPLE_BG}
              overlay="dark"
              overlayOpacity={50}
              tag="Alignment"
              title="Text Aligned"
              titleHighlight={align.charAt(0).toUpperCase() + align.slice(1)}
              description="This text demonstrates the alignment option."
              primaryCTA={{ label: "Action", icon: "arrow" }}
              height="screen"
              animated={false}
            />
          </div>
        ))}

        {/* Content Width Sub-section */}
        <div className="w-full min-h-[50vh] flex items-center justify-center bg-gray-800 text-white px-4">
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Content Width
            </h3>
            <p className="text-gray-400">Lebar maksimum area konten.</p>
          </div>
        </div>

        {(["narrow", "medium", "wide", "full"] as ContentWidth[]).map(
          (width) => (
            <div key={width} className="relative w-full">
              <LabelOverlay label={`contentWidth="${width}"`} />
              <HeroSlide
                variant="text-only"
                position="center-left"
                contentWidth={width}
                backgroundImage={SAMPLE_BG}
                overlay="gradient-left"
                overlayOpacity={70}
                title="Content Width"
                titleHighlight={width.charAt(0).toUpperCase() + width.slice(1)}
                description="This demonstrates how the content width affects the layout and text wrapping behavior in the hero section."
                height="screen"
                animated={false}
              />
            </div>
          )
        )}
      </div>

      {/* ================================================================ */}
      {/* OVERLAYS SECTION */}
      {/* ================================================================ */}
      <div id="overlays">
        <SectionDivider
          title="Overlay Variants"
          description="Berbagai jenis overlay untuk meningkatkan readability teks di atas background image."
        />

        {(
          [
            "none",
            "dark",
            "light",
            "gradient-left",
            "gradient-right",
            "gradient-top",
            "gradient-bottom",
            "gradient-center",
          ] as OverlayVariant[]
        ).map((overlayType) => (
          <div key={overlayType} className="relative w-full">
            <LabelOverlay
              label={`overlay="${overlayType}"`}
              sublabel="overlayOpacity={50}"
            />
            <HeroSlide
              variant="text-only"
              position={
                overlayType === "gradient-left"
                  ? "center-left"
                  : overlayType === "gradient-right"
                  ? "center-right"
                  : overlayType === "gradient-bottom"
                  ? "bottom-center"
                  : overlayType === "gradient-top"
                  ? "top-center"
                  : "center"
              }
              textAlign={
                overlayType === "gradient-left"
                  ? "left"
                  : overlayType === "gradient-right"
                  ? "right"
                  : "center"
              }
              contentWidth="narrow"
              backgroundImage={SAMPLE_BG}
              overlay={overlayType}
              overlayOpacity={overlayType === "none" ? 0 : 50}
              theme={overlayType === "light" ? "light" : "dark"}
              title="Overlay"
              titleHighlight="Demo"
              description="See how the overlay affects readability"
              height="screen"
              animated={false}
            />
          </div>
        ))}

        {/* Opacity Comparison Sub-section */}
        <div className="w-full min-h-[50vh] flex items-center justify-center bg-gray-800 text-white px-4">
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Overlay Opacity Levels
            </h3>
            <p className="text-gray-400">
              Perbandingan opacity overlay dari 20% hingga 80%.
            </p>
          </div>
        </div>

        {[20, 40, 60, 80].map((opacity) => (
          <div key={opacity} className="relative w-full">
            <LabelOverlay label={`overlayOpacity={${opacity}}`} />
            <HeroSlide
              variant="title-only"
              position="center"
              textAlign="center"
              backgroundImage={SAMPLE_BG}
              overlay="dark"
              overlayOpacity={opacity}
              title={`${opacity}%`}
              titleHighlight="Opacity"
              height="screen"
              animated={false}
            />
          </div>
        ))}
      </div>

      {/* ================================================================ */}
      {/* ANIMATIONS SECTION */}
      {/* ================================================================ */}
      <div id="animations">
        <SectionDivider
          title="Animation Directions"
          description="Berbagai arah animasi masuk untuk konten Hero slide. Animasi akan trigger saat scroll."
        />

        <AnimationShowcase />
      </div>

      {/* ================================================================ */}
      {/* THEMES SECTION */}
      {/* ================================================================ */}
      <div id="themes">
        <SectionDivider
          title="Color Themes"
          description="Tema warna untuk menyesuaikan dengan background image."
        />

        {/* Dark Theme */}
        <div className="relative w-full">
          <LabelOverlay
            label='theme="dark"'
            sublabel="Teks terang untuk background gelap"
          />
          <HeroSlide
            variant="text-and-cta"
            position="center-left"
            backgroundImage={SAMPLE_BG}
            overlay="gradient-left"
            overlayOpacity={70}
            theme="dark"
            tag="Dark Theme"
            title="Light Text on"
            titleHighlight="Dark Background"
            description="Use this theme when your background image is dark or has a dark overlay."
            primaryCTA={{ label: "Primary Action", icon: "arrow" }}
            secondaryCTA={{ label: "Secondary" }}
            height="screen"
            animated={false}
          />
        </div>

        {/* Light Theme */}
        <div className="relative w-full">
          <LabelOverlay
            label='theme="light"'
            sublabel="Teks gelap untuk background terang"
          />
          <HeroSlide
            variant="text-and-cta"
            position="center-left"
            backgroundImage={SAMPLE_BG}
            overlay="light"
            overlayOpacity={70}
            theme="light"
            tag="Light Theme"
            title="Dark Text on"
            titleHighlight="Light Background"
            description="Use this theme when your background image is light or has a light overlay."
            primaryCTA={{ label: "Primary Action", icon: "arrow" }}
            secondaryCTA={{ label: "Secondary" }}
            height="screen"
            animated={false}
          />
        </div>

        {/* Real-World Examples Sub-section */}
        <div className="w-full min-h-[50vh] flex items-center justify-center bg-gray-800 text-white px-4">
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4">
              Real-World Examples
            </h3>
            <p className="text-gray-400">
              Contoh kombinasi theme dan overlay untuk berbagai skenario.
            </p>
          </div>
        </div>

        {/* Product Launch Hero */}
        <div className="relative w-full">
          <LabelOverlay
            label="Product Launch Hero"
            sublabel="Dark theme + gradient-left overlay"
          />
          <HeroSlide
            variant="text-and-cta"
            position="center-left"
            backgroundImage={SAMPLE_BG}
            overlay="gradient-left"
            overlayOpacity={75}
            theme="dark"
            tag="Launching Soon"
            title="Introducing the All-New"
            titleHighlight="EDMAX Pro"
            description="Revolutionary performance meets sustainable design. Pre-order now and be among the first to experience the future."
            primaryCTA={{ label: "Pre-Order", icon: "arrow" }}
            secondaryCTA={{ label: "Download Specs", icon: "download" }}
            height="screen"
            animated={false}
          />
        </div>

        {/* Promo Banner Hero */}
        <div className="relative w-full">
          <LabelOverlay
            label="Promo Banner Hero"
            sublabel="Dark theme + gradient-bottom overlay"
          />
          <HeroSlide
            variant="cta-only"
            position="bottom-center"
            textAlign="center"
            backgroundImage={SAMPLE_BG}
            overlay="gradient-bottom"
            overlayOpacity={85}
            theme="dark"
            primaryCTA={{ label: "Claim Offer", icon: "arrow" }}
            secondaryCTA={{ label: "Learn More" }}
            height="screen"
            animated={false}
          />
        </div>

        {/* Minimal Brand Hero */}
        <div className="relative w-full">
          <LabelOverlay
            label="Minimal Brand Hero"
            sublabel="Dark theme + center position"
          />
          <HeroSlide
            variant="title-only"
            position="center"
            textAlign="center"
            contentWidth="wide"
            backgroundImage={SAMPLE_BG}
            overlay="dark"
            overlayOpacity={45}
            theme="dark"
            title="Ride The"
            titleHighlight="Future"
            height="screen"
            animated={false}
          />
        </div>

        {/* Feature Highlight Hero */}
        <div className="relative w-full">
          <LabelOverlay
            label="Feature Highlight Hero"
            sublabel="Dark theme + right position"
          />
          <HeroSlide
            variant="text-only"
            position="center-right"
            textAlign="right"
            backgroundImage={SAMPLE_BG}
            overlay="gradient-right"
            overlayOpacity={80}
            theme="dark"
            tag="Technology"
            title="SuperCharge"
            titleHighlight="Technology"
            description="0-80% in just 15 minutes. Our proprietary charging technology delivers unmatched convenience."
            height="screen"
            animated={false}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Documentation</h3>
          <p className="text-gray-400 mb-6">
            Lihat dokumentasi lengkap di{" "}
            <code className="bg-gray-800 px-2 py-1 rounded text-sm text-[var(--primary-light)]">
              src/components/hero/README.md
            </code>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors"
          >
            Kembali ke Atas
          </button>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// ANIMATION SHOWCASE COMPONENT
// ============================================================================

function AnimationShowcase() {
  const [keys, setKeys] = useState<Record<AnimationDirection, number>>({
    none: 0,
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    fade: 0,
  });

  const replay = (direction: AnimationDirection) => {
    setKeys((prev) => ({ ...prev, [direction]: prev[direction] + 1 }));
  };

  return (
    <>
      {(
        ["none", "up", "down", "left", "right", "fade"] as AnimationDirection[]
      ).map((direction) => (
        <div key={direction} className="relative w-full">
          <div className="absolute top-4 left-4 z-30 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-4">
            <div>
              <p className="font-mono text-sm sm:text-base font-semibold">
                animationDirection=&quot;{direction}&quot;
              </p>
            </div>
            {direction !== "none" && (
              <button
                onClick={() => replay(direction)}
                className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                Replay
              </button>
            )}
          </div>
          <HeroSlide
            key={keys[direction]}
            variant="text-only"
            position="center"
            textAlign="center"
            contentWidth="narrow"
            backgroundImage={SAMPLE_BG}
            overlay="dark"
            overlayOpacity={50}
            title="Animation"
            titleHighlight={
              direction.charAt(0).toUpperCase() + direction.slice(1)
            }
            description="Watch the entrance animation"
            animated={direction !== "none"}
            animationDirection={direction}
            animationDelay={300}
            height="screen"
          />
        </div>
      ))}
    </>
  );
}
