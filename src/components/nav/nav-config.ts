// Struktur informasi navbar — SATU sumber kebenaran untuk desktop megamenu
// maupun mobile sheet. Perubahan IA cukup dilakukan di sini.
//
// Prinsip pengelompokan:
//  · Motor       -> apa yang dibeli (4 model + pintu masuk ke halaman bandingkan)
//  · SuperCharge -> apa yang membuat motornya masuk akal (jaringan + peta lokasi)
//  · Layanan     -> apa yang didapat setelah/menjelang beli (showroom, ojol, bantuan)
//  · Perusahaan  -> siapa di balik semuanya (tentang, media, karier, kontak)
//
// Grup "Jelajahi" yang lama dibubarkan karena isinya campur aduk (showroom +
// berita + FAQ + program sewa). Halaman /compare dan /super-charge/lokasi yang
// sebelumnya tidak pernah muncul di navbar sekarang punya tempat.

export type NavLink = {
  href: string;
  title: string;
  desc: string;
};

export type NavModel = {
  name: string;
  href: string;
  image: string;
  tagline: string;
};

export type NavFeature = {
  image: string;
  alt: string;
  caption: string;
  metric?: string;
};

type Base = {
  key: string;
  label: string;
  /** Prefix path (tanpa locale) yang dianggap "sedang aktif" untuk item ini. */
  match: string[];
};

export type NavItem =
  | (Base & {
      kind: "models";
      models: NavModel[];
      hint: string;
      compare: { href: string; label: string };
    })
  | (Base & { kind: "links"; links: NavLink[]; feature: NavFeature });

export type Translate = (key: string) => string;

export function buildNav(t: Translate): NavItem[] {
  return [
    {
      key: "models",
      kind: "models",
      label: t("nav.menu.models"),
      match: ["/bees/", "/athena/", "/victory/", "/edpower/", "/compare/"],
      hint: t("nav.models.hint"),
      compare: { href: "/compare/", label: t("nav.models.compare") },
      models: [
        {
          name: "Bees",
          href: "/bees/",
          image: "/navbar-product/bees.webp",
          tagline: t("nav.model.bees.tagline"),
        },
        {
          name: "Athena",
          href: "/athena/",
          image: "/navbar-product/athena.webp",
          tagline: t("nav.model.athena.tagline"),
        },
        {
          name: "Victory",
          href: "/victory/",
          image: "/navbar-product/victory.webp",
          tagline: t("nav.model.victory.tagline"),
        },
        {
          name: "EdPower",
          href: "/edpower/",
          image: "/navbar-product/edpower.webp",
          tagline: t("nav.model.edpower.tagline"),
        },
      ],
    },
    {
      key: "supercharge",
      kind: "links",
      label: t("nav.superCharge"),
      match: ["/super-charge/"],
      links: [
        {
          href: "/super-charge/",
          title: t("nav.superCharge.network"),
          desc: t("nav.superCharge.network.description"),
        },
        {
          href: "/super-charge/lokasi/",
          title: t("nav.superCharge.map"),
          desc: t("nav.superCharge.map.description"),
        },
      ],
      feature: {
        image: "/super-charge/supercharge-hero-1.webp",
        alt: t("nav.feature.superCharge.alt"),
        caption: t("nav.feature.superCharge.caption"),
        metric: "85",
      },
    },
    {
      key: "services",
      kind: "links",
      label: t("nav.menu.services"),
      match: ["/showroom/", "/ojol/", "/faq/"],
      links: [
        {
          href: "/showroom/",
          title: "Experience Center",
          desc: t("nav.experienceCenter.description"),
        },
        {
          href: "/ojol/",
          title: "Wedison Ojol",
          desc: t("nav.ojol.description"),
        },
        {
          href: "/faq/",
          title: "FAQ",
          desc: t("nav.faq.description"),
        },
      ],
      feature: {
        image: "/ShowRoom-Receptionist.webp",
        alt: t("nav.feature.services.alt"),
        caption: t("nav.feature.services.caption"),
      },
    },
    {
      key: "company",
      kind: "links",
      label: t("nav.menu.company"),
      match: ["/corporate/", "/media-center/", "/career/"],
      links: [
        {
          href: "/corporate/about/",
          title: t("nav.aboutUs"),
          desc: t("nav.aboutUs.description"),
        },
        {
          href: "/media-center/",
          title: "Media Center",
          desc: t("nav.mediaCenter.description"),
        },
        {
          href: "/career/",
          title: t("nav.careers"),
          desc: t("nav.careers.description"),
        },
        {
          href: "/corporate/contact/",
          title: t("nav.contactUs"),
          desc: t("nav.contactUs.description"),
        },
      ],
      feature: {
        image: "/wedison-factory.webp",
        alt: t("nav.feature.company.alt"),
        caption: t("nav.feature.company.caption"),
      },
    },
  ];
}

/** Item mana yang mewakili halaman yang sedang dibuka (path sudah tanpa locale). */
export function activeNavKey(items: NavItem[], path: string): string | null {
  for (const item of items) {
    if (item.match.some((prefix) => path.startsWith(prefix))) return item.key;
  }
  return null;
}
