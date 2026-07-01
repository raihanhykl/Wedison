"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Content variant determines what content elements are displayed
 */
export type ContentVariant =
  | "text-and-cta" // Full content: tag, title, description, buttons
  | "text-only" // Only text elements: tag, title, description
  | "cta-only" // Only CTA buttons
  | "title-only" // Only title (useful when text is in background image)
  | "empty"; // No content overlay (design includes everything)

/**
 * Horizontal position for content
 */
export type HorizontalPosition = "left" | "center" | "right";

/**
 * Vertical position for content
 */
export type VerticalPosition = "top" | "center" | "bottom";

/**
 * Combined position using grid-based positioning
 */
export type ContentPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Text alignment within content area
 */
export type TextAlign = "left" | "center" | "right";

/**
 * Theme for text colors
 */
export type Theme = "dark" | "light" | "auto";

/**
 * Content width options
 */
export type ContentWidth = "narrow" | "medium" | "wide" | "wider" | "full";

/**
 * Background overlay options
 */
export type OverlayVariant =
  | "none"
  | "dark"
  | "light"
  | "gradient-left"
  | "gradient-right"
  | "gradient-top"
  | "gradient-bottom"
  | "gradient-center";

/**
 * Animation entrance direction
 */
export type AnimationDirection =
  | "none"
  | "up"
  | "down"
  | "left"
  | "right"
  | "fade";

/**
 * CTA button configuration
 */
export interface CTAButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  icon?: "arrow" | "download" | "none";
  className?: string;
}

/**
 * Responsive position configuration
 */
export interface ResponsivePosition {
  mobile?: ContentPosition;
  tablet?: ContentPosition;
  desktop?: ContentPosition;
}

/**
 * Responsive text alignment configuration
 */
export interface ResponsiveTextAlign {
  mobile?: TextAlign;
  tablet?: TextAlign;
  desktop?: TextAlign;
}

/**
 * Main props for HeroSlide component
 */
export interface HeroSlideProps {
  // === Content Variant ===
  variant?: ContentVariant;

  // === Positioning ===
  /** Single position for all breakpoints */
  position?: ContentPosition;
  /** Responsive position - overrides position prop if provided */
  responsivePosition?: ResponsivePosition;
  /** Single text alignment for all breakpoints */
  textAlign?: TextAlign;
  /** Responsive text alignment - overrides textAlign prop if provided */
  responsiveTextAlign?: ResponsiveTextAlign;
  contentWidth?: ContentWidth;

  // === Background ===
  backgroundImage?: string;
  backgroundImageTablet?: string;
  backgroundImageMobile?: string;
  backgroundAlt?: string;
  backgroundStyle?: string;
  overlay?: OverlayVariant;
  overlayOpacity?: number; // 0-100

  // === Text Content ===
  tag?: string;
  tagClassName?: string;
  title?: string;
  titleClassName?: string;
  titleHighlight?: string;
  titleHighlightClassName?: string;
  description?: string;
  descriptionClassName?: string;

  // === CTA ===
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  ctaContainerClassName?: string;

  // === Styling ===
  theme?: Theme;
  className?: string;
  contentClassName?: string;

  // === Animation ===
  animated?: boolean;
  animationDirection?: AnimationDirection;
  animationDelay?: number;

  // === Custom Content ===
  children?: React.ReactNode;

  // === Height ===
  height?: "screen" | "90vh" | "80vh" | "70vh" | "auto";
}

// ============================================================================
// STYLE MAPPINGS
// ============================================================================

const positionStyles: Record<ContentPosition, string> = {
  "top-left": "items-start justify-start",
  "top-center": "items-start justify-center",
  "top-right": "items-start justify-end ",
  "center-left": "items-center justify-start",
  center: "items-center justify-center",
  "center-right": "items-center justify-end",
  "bottom-left": "items-end justify-start",
  "bottom-center": "items-end justify-center",
  "bottom-right": "items-end justify-end",
};

// Responsive position classes for each breakpoint
const responsivePositionClasses: Record<
  "mobile" | "tablet" | "desktop",
  Record<ContentPosition, string>
> = {
  mobile: {
    "top-left": "items-start justify-start mt-16",
    "top-center": "items-start justify-center mt-16",
    "top-right": "items-start justify-end mt-16",
    "center-left": "items-center justify-start",
    center: "items-center justify-center",
    "center-right": "items-center justify-end",
    "bottom-left": "items-end justify-start",
    "bottom-center": "items-end justify-center",
    "bottom-right": "items-end justify-end",
  },
  tablet: {
    "top-left": "md:items-start md:justify-start md:mt-16",
    "top-center": "md:items-start md:justify-center md:mt-16",
    "top-right": "md:items-start md:justify-end md:mt-16",
    "center-left": "md:items-center md:justify-start md:mt-0",
    center: "md:items-center md:justify-center md:mt-0",
    "center-right": "md:items-center md:justify-end md:mt-0",
    "bottom-left": "md:items-end md:justify-start md:mt-0",
    "bottom-center": "md:items-end md:justify-center md:mt-0",
    "bottom-right": "md:items-end md:justify-end md:mt-0",
  },
  desktop: {
    "top-left": "lg:items-start lg:justify-start lg:mt-16",
    "top-center": "lg:items-start lg:justify-center lg:mt-16",
    "top-right": "lg:items-start lg:justify-end lg:mt-16",
    "center-left": "lg:items-center lg:justify-start lg:mt-0",
    center: "lg:items-center lg:justify-center lg:mt-0",
    "center-right": "lg:items-center lg:justify-end lg:mt-0",
    "bottom-left": "lg:items-end lg:justify-start lg:mt-0",
    "bottom-center": "lg:items-end lg:justify-center lg:mt-0",
    "bottom-right": "lg:items-end lg:justify-end lg:mt-0",
  },
};

const textAlignStyles: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// Responsive text align classes
const responsiveTextAlignClasses: Record<
  "mobile" | "tablet" | "desktop",
  Record<TextAlign, string>
> = {
  mobile: {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  },
  tablet: {
    left: "md:text-left",
    center: "md:text-center",
    right: "md:text-right",
  },
  desktop: {
    left: "lg:text-left",
    center: "lg:text-center",
    right: "lg:text-right",
  },
};

// Responsive CTA alignment classes
const responsiveCTAAlignClasses: Record<
  "mobile" | "tablet" | "desktop",
  Record<TextAlign, string>
> = {
  mobile: {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  },
  tablet: {
    left: "md:justify-start",
    center: "md:justify-center",
    right: "md:justify-end",
  },
  desktop: {
    left: "lg:justify-start",
    center: "lg:justify-center",
    right: "lg:justify-end",
  },
};

const contentWidthStyles: Record<ContentWidth, string> = {
  narrow: "max-w-sm",
  medium: "max-w-lg",
  wide: "max-w-2xl",
  wider: "max-w-4xl",
  full: "max-w-full w-full",
};

const overlayStyles: Record<OverlayVariant, string> = {
  none: "",
  dark: "bg-black",
  light: "bg-white",
  "gradient-left": "bg-gradient-to-r from-black via-black/50 to-transparent",
  "gradient-right": "bg-gradient-to-l from-black via-black/50 to-transparent",
  "gradient-top": "bg-gradient-to-b from-black via-black/50 to-transparent",
  "gradient-bottom": "bg-gradient-to-t from-black via-black/50 to-transparent",
  "gradient-center": "bg-radial from-transparent to-black/60",
};

const heightStyles: Record<string, string> = {
  screen: "min-h-screen",
  "90vh": "min-h-[90vh]",
  "80vh": "min-h-[80vh]",
  "70vh": "min-h-[70vh]",
  auto: "min-h-auto",
};

const themeStyles = {
  dark: {
    title: "text-white",
    description: "text-gray-200",
    tag: "border-border bg-primary/50 text-[var(--primary-light)]",
  },
  light: {
    title: "text-gray-900",
    description: "text-gray-700",
    tag: "border-[var(--primary-lighter)] bg-[var(--secondary-light)] text-[var(--primary-dark)]",
  },
};

const animationBaseStyles: Record<
  AnimationDirection,
  { hidden: string; visible: string }
> = {
  none: { hidden: "", visible: "" },
  up: {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  down: {
    hidden: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  left: {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  right: {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  fade: { hidden: "opacity-0", visible: "opacity-100" },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ children, className }) => (
  <div
    className={cn(
      "inline-block px-4 py-1 mb-4 md:mb-6 border rounded-full text-sm font-medium",
      className
    )}
  >
    {children}
  </div>
);

interface TitleProps {
  children: React.ReactNode;
  highlight?: string;
  className?: string;
  highlightClassName?: string;
}

const Title: React.FC<TitleProps> = ({
  children,
  highlight,
  className,
  highlightClassName,
}) => (
  <h1
    className={cn(
      "text-3xl sm:text-4xl md:text-5xl lg:text-5xl 2xl:text-6xl font-bold leading-tight mb-4 md:mb-6",
      className
    )}
  >
    {children}
    {highlight && (
      <>
        {" "}
        <span
          className={cn(
            "text-white relative",
            highlightClassName
          )}
        >
          {highlight}
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary-light)]" />
        </span>
      </>
    )}
  </h1>
);

interface DescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const Description: React.FC<DescriptionProps> = ({ children, className }) => (
  <p className={cn("text-base sm:text-lg md:text-xl mb-6 md:mb-8", className)}>
    {children}
  </p>
);

interface CTAGroupProps {
  primary?: CTAButton;
  secondary?: CTAButton;
  align?: TextAlign;
  responsiveAlign?: ResponsiveTextAlign;
  containerClassName?: string;
}

const CTAGroup: React.FC<CTAGroupProps> = ({
  primary,
  secondary,
  align = "left",
  responsiveAlign,
  containerClassName,
}) => {
  // Build alignment classes
  let alignmentClasses: string;

  if (responsiveAlign) {
    const classes: string[] = [];
    if (responsiveAlign.mobile) {
      classes.push(responsiveCTAAlignClasses.mobile[responsiveAlign.mobile]);
    }
    if (responsiveAlign.tablet) {
      classes.push(responsiveCTAAlignClasses.tablet[responsiveAlign.tablet]);
    }
    if (responsiveAlign.desktop) {
      classes.push(responsiveCTAAlignClasses.desktop[responsiveAlign.desktop]);
    }
    alignmentClasses = classes.join(" ");
  } else {
    alignmentClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    }[align];
  }

  const renderIcon = (icon?: CTAButton["icon"]) => {
    switch (icon) {
      case "arrow":
        return (
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        );
      case "download":
        return <Download className="mr-2 h-5 w-5" />;
      default:
        return null;
    }
  };

  const renderButton = (button: CTAButton, isPrimary: boolean) => {
    const baseClasses =
      "px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 rounded-md text-base sm:text-lg transition-all duration-300 hover:-translate-y-1";

    if (isPrimary || button.variant === "primary") {
      return (
        <Button
          className={cn(
            baseClasses,
            "bg-primary hover:bg-[var(--primary-dark)] text-white shadow-teal group",
            button.className
          )}
          onClick={button.onClick}
          asChild={!!button.href}
        >
          {button.href ? (
            <a href={button.href}>
              {button.icon === "download" && renderIcon(button.icon)}
              {button.label}
              {button.icon === "arrow" && renderIcon(button.icon)}
            </a>
          ) : (
            <>
              {button.icon === "download" && renderIcon(button.icon)}
              {button.label}
              {button.icon === "arrow" && renderIcon(button.icon)}
            </>
          )}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        className={cn(
          baseClasses,
          "border-primary text-[var(--primary-light)] hover:bg-primary/50",
          button.className
        )}
        onClick={button.onClick}
        asChild={!!button.href}
      >
        {button.href ? (
          <a href={button.href}>
            {button.icon === "download" && renderIcon(button.icon)}
            {button.label}
            {button.icon === "arrow" && renderIcon(button.icon)}
          </a>
        ) : (
          <>
            {button.icon === "download" && renderIcon(button.icon)}
            {button.label}
            {button.icon === "arrow" && renderIcon(button.icon)}
          </>
        )}
      </Button>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-3 sm:gap-4",
        alignmentClasses,
        containerClassName
      )}
    >
      {primary && renderButton(primary, true)}
      {secondary && renderButton(secondary, false)}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const HeroSlide = React.forwardRef<HTMLDivElement, HeroSlideProps>(
  (
    {
      // Content Variant
      variant = "text-and-cta",

      // Positioning
      position = "center-left",
      responsivePosition,
      textAlign = "left",
      responsiveTextAlign,
      contentWidth = "medium",

      // Background
      backgroundImage,
      backgroundImageTablet,
      backgroundImageMobile,
      backgroundAlt = "Hero background",
      backgroundStyle,
      overlay = "dark",
      overlayOpacity = 30,

      // Text Content
      tag,
      tagClassName,
      title,
      titleClassName,
      titleHighlight,
      titleHighlightClassName,
      description,
      descriptionClassName,

      // CTA
      primaryCTA,
      secondaryCTA,
      ctaContainerClassName,

      // Styling
      theme = "dark",
      className,
      contentClassName,

      // Animation
      animated = true,
      animationDirection = "up",
      animationDelay = 0,

      // Custom Content
      children,

      // Height
      height = "screen",
    },
    ref
  ) => {
    // SSR-safe: konten hero tampil sejak render awal (tidak digerbang JS/hydration).
    // Transisi antar-slide carousel tetap menyediakan gerak; entrance fade-up dilepas demi
    // memastikan judul/CTA above-the-fold tidak pernah tak terlihat bila JS gagal/lambat.
    const [isVisible, setIsVisible] = React.useState(true);
    const [screenSize, setScreenSize] = React.useState<
      "mobile" | "tablet" | "desktop"
    >("desktop");

    // Determine actual theme
    const actualTheme = theme === "auto" ? "dark" : theme;
    const currentThemeStyles = themeStyles[actualTheme];

    // Handle responsive detection
    React.useEffect(() => {
      const updateScreenSize = () => {
        const width = window.innerWidth;
        if (width < 768) {
          setScreenSize("mobile");
        } else if (width < 1024) {
          setScreenSize("tablet");
        } else {
          setScreenSize("desktop");
        }
      };

      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);

      return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    // Handle entrance animation
    React.useEffect(() => {
      if (animated) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, animationDelay);

        return () => clearTimeout(timer);
      }
    }, [animated, animationDelay]);

    // Get animation classes
    const animationClasses = animated
      ? cn(
          "transition-all duration-1000",
          isVisible
            ? animationBaseStyles[animationDirection].visible
            : animationBaseStyles[animationDirection].hidden
        )
      : "";

    // Determine current background image based on screen size
    const getCurrentBackgroundImage = () => {
      if (screenSize === "mobile" && backgroundImageMobile) {
        return backgroundImageMobile;
      }
      if (screenSize === "tablet") {
        // Use tablet image if available, otherwise fall back to desktop
        return backgroundImageTablet || backgroundImage;
      }
      return backgroundImage;
    };

    const currentBgImage = getCurrentBackgroundImage();

    // Build position classes
    const getPositionClasses = () => {
      if (responsivePosition) {
        const classes: string[] = [];

        // Mobile position (base)
        if (responsivePosition.mobile) {
          classes.push(
            responsivePositionClasses.mobile[responsivePosition.mobile]
          );
        } else if (position) {
          classes.push(positionStyles[position]);
        }

        // Tablet position
        if (responsivePosition.tablet) {
          classes.push(
            responsivePositionClasses.tablet[responsivePosition.tablet]
          );
        }

        // Desktop position
        if (responsivePosition.desktop) {
          classes.push(
            responsivePositionClasses.desktop[responsivePosition.desktop]
          );
        }

        return classes.join(" ");
      }

      return positionStyles[position];
    };

    // Build text align classes
    const getTextAlignClasses = () => {
      if (responsiveTextAlign) {
        const classes: string[] = [];

        // Mobile alignment (base)
        if (responsiveTextAlign.mobile) {
          classes.push(
            responsiveTextAlignClasses.mobile[responsiveTextAlign.mobile]
          );
        } else if (textAlign) {
          classes.push(textAlignStyles[textAlign]);
        }

        // Tablet alignment
        if (responsiveTextAlign.tablet) {
          classes.push(
            responsiveTextAlignClasses.tablet[responsiveTextAlign.tablet]
          );
        }

        // Desktop alignment
        if (responsiveTextAlign.desktop) {
          classes.push(
            responsiveTextAlignClasses.desktop[responsiveTextAlign.desktop]
          );
        }

        return classes.join(" ");
      }

      return textAlignStyles[textAlign];
    };

    // Content rendering based on variant
    const renderContent = () => {
      if (variant === "empty") {
        return children;
      }

      const showTag = variant === "text-and-cta" || variant === "text-only";
      const showTitle =
        variant === "text-and-cta" ||
        variant === "text-only" ||
        variant === "title-only";
      const showDescription =
        variant === "text-and-cta" || variant === "text-only";
      const showCTA = variant === "text-and-cta" || variant === "cta-only";

      return (
        <div
          className={cn(
            contentWidthStyles[contentWidth],
            getTextAlignClasses(),
            animationClasses,
            contentClassName
          )}
        >
          {/* Tag */}
          {showTag && tag && (
            <Tag className={cn(currentThemeStyles.tag, tagClassName)}>
              {tag}
            </Tag>
          )}

          {/* Title */}
          {showTitle && title && (
            <Title
              className={cn(currentThemeStyles.title, titleClassName)}
              highlight={titleHighlight}
              highlightClassName={titleHighlightClassName}
            >
              {title}
            </Title>
          )}

          {/* Description */}
          {showDescription && description && (
            <Description
              className={cn(
                currentThemeStyles.description,
                descriptionClassName
              )}
            >
              {description}
            </Description>
          )}

          {/* CTA Buttons */}
          {showCTA && (primaryCTA || secondaryCTA) && (
            <CTAGroup
              primary={primaryCTA}
              secondary={secondaryCTA}
              align={textAlign}
              responsiveAlign={responsiveTextAlign}
              containerClassName={ctaContainerClassName}
            />
          )}

          {/* Custom children */}
          {children}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full flex overflow-hidden",
          heightStyles[height],
          className
        )}
      >
        {/* Background Image */}
        {currentBgImage && (
          <Image
            src={currentBgImage}
            alt={backgroundAlt}
            fill
            priority
            sizes="100vw"
            className={cn("object-cover", backgroundStyle)}
          />
        )}

        {/* Overlay */}
        {overlay !== "none" && (
          <div
            className={cn("absolute inset-0 z-10", overlayStyles[overlay])}
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}

        {/* Content Container */}
        <div
          className={cn(
            "container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 flex w-full",
            "py-16 md:py-20 lg:py-24",
            getPositionClasses()
          )}
        >
          {renderContent()}
        </div>
      </div>
    );
  }
);

HeroSlide.displayName = "HeroSlide";

// ============================================================================
// EXPORTS
// ============================================================================

export default HeroSlide;
