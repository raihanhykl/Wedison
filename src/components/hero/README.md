# HeroSlide Component Documentation

Komponen `HeroSlide` adalah base layout yang reusable untuk Hero section carousel. Komponen ini dirancang agar mudah digunakan, mudah dibaca, dan mudah di-debug.

## Quick Start

```tsx
import { HeroSlide } from "@/components/hero";

// Basic usage
<HeroSlide
  variant="text-and-cta"
  position="center-left"
  backgroundImage="/images/hero-bg.jpg"
  title="Your Title Here"
  titleHighlight="Highlighted"
  description="Your description text goes here."
  primaryCTA={{ label: "Get Started", icon: "arrow" }}
/>
```

---

## Props Reference

### Content Variant (`variant`)

Menentukan elemen konten apa saja yang ditampilkan.

| Value | Description | Displays |
|-------|-------------|----------|
| `"text-and-cta"` | Full content (default) | Tag, Title, Description, Buttons |
| `"text-only"` | Hanya teks | Tag, Title, Description |
| `"cta-only"` | Hanya tombol CTA | Buttons only |
| `"title-only"` | Hanya judul | Title only |
| `"empty"` | Tanpa overlay content | Children only |

---

### Position (`position`)

Posisi konten dalam slide menggunakan sistem grid 3x3.

```
┌─────────────┬─────────────┬─────────────┐
│  top-left   │ top-center  │  top-right  │
├─────────────┼─────────────┼─────────────┤
│ center-left │   center    │center-right │
├─────────────┼─────────────┼─────────────┤
│ bottom-left │bottom-center│bottom-right │
└─────────────┴─────────────┴─────────────┘
```

| Value | Description |
|-------|-------------|
| `"top-left"` | Kiri atas |
| `"top-center"` | Tengah atas |
| `"top-right"` | Kanan atas |
| `"center-left"` | Kiri tengah (default) |
| `"center"` | Tengah |
| `"center-right"` | Kanan tengah |
| `"bottom-left"` | Kiri bawah |
| `"bottom-center"` | Tengah bawah |
| `"bottom-right"` | Kanan bawah |

---

### Responsive Position (`responsivePosition`) - NEW

Posisi konten yang berbeda untuk setiap breakpoint. Overrides `position` prop jika disediakan.

```tsx
interface ResponsivePosition {
  mobile?: ContentPosition;   // < 768px
  tablet?: ContentPosition;   // 768px - 1023px
  desktop?: ContentPosition;  // >= 1024px
}
```

**Example:**
```tsx
<HeroSlide
  responsivePosition={{
    mobile: "top-center",
    tablet: "center-right",
    desktop: "center-left"
  }}
  // ...
/>
```

---

### Text Alignment (`textAlign`)

| Value | Description |
|-------|-------------|
| `"left"` | Rata kiri (default) |
| `"center"` | Rata tengah |
| `"right"` | Rata kanan |

---

### Responsive Text Alignment (`responsiveTextAlign`) - NEW

Text alignment yang berbeda untuk setiap breakpoint. Overrides `textAlign` prop jika disediakan.

```tsx
interface ResponsiveTextAlign {
  mobile?: TextAlign;   // < 768px
  tablet?: TextAlign;   // 768px - 1023px
  desktop?: TextAlign;  // >= 1024px
}
```

**Example:**
```tsx
<HeroSlide
  responsiveTextAlign={{
    mobile: "center",
    tablet: "left",
    desktop: "left"
  }}
  // ...
/>
```

---

### Content Width (`contentWidth`)

Lebar maksimum area konten.

| Value | Class | Use Case |
|-------|-------|----------|
| `"narrow"` | `max-w-sm` | Headlines singkat |
| `"medium"` | `max-w-lg` (default) | Standard hero content |
| `"wide"` | `max-w-2xl` | Deskripsi panjang |
| `"wider"` | `max-w-4xl` | Konten yang sangat lebar |
| `"full"` | `max-w-full` | Full-width content |

---

### Background Options

#### `backgroundImage`
Path ke background image (desktop).

```tsx
backgroundImage="/images/hero-desktop.jpg"
```

#### `backgroundImageTablet` - NEW
Path ke background image khusus tablet (opsional). Jika tidak disediakan, akan menggunakan `backgroundImage`.

```tsx
backgroundImageTablet="/images/hero-tablet.jpg"
```

#### `backgroundImageMobile`
Path ke background image khusus mobile (opsional).

```tsx
backgroundImageMobile="/images/hero-mobile.jpg"
```

**Fallback Logic:**
- Mobile: `backgroundImageMobile` → `backgroundImage`
- Tablet: `backgroundImageTablet` → `backgroundImage`
- Desktop: `backgroundImage`

#### `backgroundAlt`
Alt text untuk background image.

#### `backgroundStyle`
Custom Tailwind classes untuk image styling.

```tsx
backgroundStyle="object-[center_70%]"
```

---

### Overlay (`overlay`)

Overlay di atas background image untuk meningkatkan readability teks.

| Value | Description |
|-------|-------------|
| `"none"` | Tanpa overlay |
| `"dark"` | Overlay hitam solid (default) |
| `"light"` | Overlay putih solid |
| `"gradient-left"` | Gradient dari kiri ke kanan |
| `"gradient-right"` | Gradient dari kanan ke kiri |
| `"gradient-top"` | Gradient dari atas ke bawah |
| `"gradient-bottom"` | Gradient dari bawah ke atas |
| `"gradient-center"` | Radial gradient ke tengah |

#### `overlayOpacity`
Opacity overlay (0-100). Default: `30`

---

### Text Content & Custom Styling - UPDATED

| Prop | Type | Description |
|------|------|-------------|
| `tag` | `string` | Label/tag di atas title |
| `tagClassName` | `string` | Custom class untuk tag |
| `title` | `string` | Judul utama |
| `titleClassName` | `string` | Custom class untuk title |
| `titleHighlight` | `string` | Bagian title dengan gradient highlight |
| `titleHighlightClassName` | `string` | Custom class untuk title highlight |
| `description` | `string` | Deskripsi di bawah title |
| `descriptionClassName` | `string` | Custom class untuk description |

**Example - Custom Styling:**
```tsx
<HeroSlide
  title="Welcome to"
  titleClassName="text-4xl md:text-6xl tracking-tight"
  titleHighlight="Innovation"
  titleHighlightClassName="from-blue-400 to-purple-500"
  description="Building the future together"
  descriptionClassName="text-lg md:text-2xl font-light max-w-xl"
  // ...
/>
```

---

### CTA Buttons - UPDATED

#### `primaryCTA` & `secondaryCTA`

```tsx
interface CTAButton {
  label: string;           // Text tombol
  href?: string;           // Link URL (opsional)
  onClick?: () => void;    // Click handler (opsional)
  variant?: "primary" | "outline" | "ghost";
  icon?: "arrow" | "download" | "none";
  className?: string;      // Custom class untuk button - NEW
}
```

#### `ctaContainerClassName` - NEW
Custom class untuk container CTA buttons.

**Example:**
```tsx
primaryCTA={{
  label: "Order Now",
  href: "/order",
  icon: "arrow",
  className: "bg-blue-600 hover:bg-blue-700"
}}
secondaryCTA={{
  label: "Download Brochure",
  onClick: () => handleDownload(),
  icon: "download",
  className: "border-blue-500 text-blue-400"
}}
ctaContainerClassName="mt-8 gap-6"
```

---

### Theme (`theme`)

| Value | Description |
|-------|-------------|
| `"dark"` | Teks terang untuk background gelap (default) |
| `"light"` | Teks gelap untuk background terang |
| `"auto"` | Auto-detect (fallback to dark) |

---

### Animation

#### `animated`
Enable/disable entrance animation. Default: `true`

#### `animationDirection`
Arah animasi masuk.

| Value | Description |
|-------|-------------|
| `"none"` | Tanpa animasi |
| `"up"` | Slide dari bawah (default) |
| `"down"` | Slide dari atas |
| `"left"` | Slide dari kanan |
| `"right"` | Slide dari kiri |
| `"fade"` | Fade in |

#### `animationDelay`
Delay animasi dalam milliseconds. Default: `0`

---

### Height (`height`)

| Value | Description |
|-------|-------------|
| `"screen"` | Full viewport height (default) |
| `"90vh"` | 90% viewport height |
| `"80vh"` | 80% viewport height |
| `"70vh"` | 70% viewport height |
| `"auto"` | Auto height based on content |

---

### Custom Styling

| Prop | Description |
|------|-------------|
| `className` | Custom classes untuk container utama |
| `contentClassName` | Custom classes untuk content wrapper |

---

### Children

Gunakan `children` untuk custom content atau extend layout.

```tsx
<HeroSlide variant="empty">
  <CustomHeroContent />
</HeroSlide>
```

---

## Usage Examples

### 1. Standard Hero dengan Full Content

```tsx
<HeroSlide
  variant="text-and-cta"
  position="center-left"
  backgroundImage="/hero/product-hero.jpg"
  overlay="gradient-left"
  overlayOpacity={60}
  tag="New Release"
  title="Experience the Future of"
  titleHighlight="Electric Mobility"
  description="Discover our latest innovation in sustainable transportation."
  primaryCTA={{ label: "Order Now", icon: "arrow" }}
  secondaryCTA={{ label: "Learn More", icon: "download" }}
  theme="dark"
/>
```

### 2. Responsive Hero dengan Position Berbeda per Breakpoint

```tsx
<HeroSlide
  variant="text-and-cta"
  responsivePosition={{
    mobile: "bottom-center",
    tablet: "center-left",
    desktop: "center-left"
  }}
  responsiveTextAlign={{
    mobile: "center",
    tablet: "left",
    desktop: "left"
  }}
  backgroundImage="/hero/desktop.jpg"
  backgroundImageTablet="/hero/tablet.jpg"
  backgroundImageMobile="/hero/mobile.jpg"
  overlay="gradient-bottom"
  overlayOpacity={70}
  tag="Featured"
  title="Ride The"
  titleHighlight="Future"
  description="Experience next-level mobility."
  primaryCTA={{ label: "Get Started", icon: "arrow" }}
/>
```

### 3. Custom Styled Hero

```tsx
<HeroSlide
  variant="text-and-cta"
  position="center"
  textAlign="center"
  backgroundImage="/hero/custom.jpg"
  overlay="dark"
  overlayOpacity={50}
  tag="Limited Edition"
  tagClassName="bg-red-500/20 border-red-400 text-red-300"
  title="Something"
  titleClassName="text-5xl md:text-7xl font-black tracking-tighter"
  titleHighlight="Amazing"
  titleHighlightClassName="from-yellow-400 to-orange-500"
  description="Crafted with precision and passion."
  descriptionClassName="text-xl md:text-2xl font-light opacity-90"
  primaryCTA={{
    label: "Pre-Order Now",
    icon: "arrow",
    className: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
  }}
  ctaContainerClassName="mt-10"
/>
```

### 4. CTA Only dengan Responsive Layout

```tsx
<HeroSlide
  variant="cta-only"
  responsivePosition={{
    mobile: "bottom-center",
    tablet: "bottom-right",
    desktop: "bottom-right"
  }}
  responsiveTextAlign={{
    mobile: "center",
    tablet: "right",
    desktop: "right"
  }}
  backgroundImage="/hero/promo.jpg"
  overlay="gradient-bottom"
  overlayOpacity={80}
  primaryCTA={{
    label: "Shop Now",
    icon: "arrow",
    className: "text-lg px-10 py-6"
  }}
  secondaryCTA={{
    label: "View Collection",
    className: "text-lg px-10 py-6"
  }}
/>
```

### 5. Minimal Title Only dengan Custom Styling

```tsx
<HeroSlide
  variant="title-only"
  position="center"
  textAlign="center"
  contentWidth="wide"
  backgroundImage="/hero/minimal.jpg"
  overlay="dark"
  overlayOpacity={40}
  title="Simply"
  titleClassName="text-6xl md:text-8xl font-thin tracking-widest uppercase"
  titleHighlight="Beautiful"
  titleHighlightClassName="font-bold tracking-normal"
/>
```

---

## Responsive Behavior

Komponen ini fully responsive dengan breakpoints:

- **Mobile (<768px)**: Menggunakan `responsivePosition.mobile`, `responsiveTextAlign.mobile`, `backgroundImageMobile`
- **Tablet (768px-1023px)**: Menggunakan `responsivePosition.tablet`, `responsiveTextAlign.tablet`, `backgroundImageTablet`
- **Desktop (≥1024px)**: Menggunakan `responsivePosition.desktop`, `responsiveTextAlign.desktop`, `backgroundImage`

Typography scales:
- Title: `text-3xl` → `text-4xl` → `text-5xl` → `text-6xl`
- Description: `text-base` → `text-lg` → `text-xl`
- Buttons: `px-5 py-4` → `px-6 py-5` → `px-8 py-6`

---

## Best Practices

1. **Selalu gunakan overlay** untuk memastikan teks terbaca di atas gambar
2. **Pilih position yang sesuai** dengan komposisi gambar background
3. **Gunakan responsivePosition** untuk layout yang berbeda di mobile vs desktop
4. **Gunakan titleHighlight** untuk emphasis pada keyword penting
5. **Test di berbagai ukuran layar** untuk memastikan responsivitas
6. **Gunakan className props** untuk fine-tune styling tanpa mengubah komponen
7. **Gunakan backgroundImageTablet** jika komposisi gambar berbeda untuk tablet

---

## File Structure

```
src/components/hero/
├── HeroSlide.tsx      # Main component
├── index.ts           # Exports
└── README.md          # This documentation
```

---

## TypeScript Types

```tsx
import type {
  HeroSlideProps,
  ContentVariant,
  ContentPosition,
  TextAlign,
  Theme,
  ContentWidth,
  OverlayVariant,
  AnimationDirection,
  CTAButton,
  ResponsivePosition,
  ResponsiveTextAlign,
} from "@/components/hero";
```

---

## Demo Page

Lihat semua variant di: `/hero-layouts`
