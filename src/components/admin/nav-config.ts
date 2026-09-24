import {
  LayoutDashboard, Newspaper, FileText, Share2, Tags, Images, MapPin, Users, ScrollText, Settings, type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/admin/types";

export type NavItem = { title: string; href: string; icon: LucideIcon; roles?: UserRole[]; badge?: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    label: "Ringkasan",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "CMS · Media Center",
    items: [
      { title: "Artikel", href: "/admin/cms/articles", icon: FileText },
      { title: "Liputan Pers", href: "/admin/cms/press", icon: Newspaper },
      { title: "Sosial Media", href: "/admin/cms/social", icon: Share2 },
      { title: "Kategori & Tag", href: "/admin/cms/taxonomy", icon: Tags },
      { title: "Media Library", href: "/admin/cms/media", icon: Images },
    ],
  },
  {
    label: "SuperCharge",
    items: [{ title: "Lokasi", href: "/admin/supercharge/stations", icon: MapPin }],
  },
  {
    label: "Sistem",
    items: [
      { title: "Pengguna", href: "/admin/users", icon: Users, roles: ["SUPER_ADMIN"] },
      { title: "Log Aktivitas", href: "/admin/activity", icon: ScrollText, roles: ["SUPER_ADMIN", "ADMIN"] },
      { title: "Akun Saya", href: "/admin/settings", icon: Settings },
    ],
  },
];

/** Label breadcrumb per segmen path. */
export const SEGMENT_LABEL: Record<string, string> = {
  admin: "Admin",
  cms: "CMS",
  articles: "Artikel",
  new: "Baru",
  press: "Liputan Pers",
  social: "Sosial Media",
  taxonomy: "Kategori & Tag",
  media: "Media Library",
  supercharge: "SuperCharge",
  stations: "Lokasi",
  users: "Pengguna",
  activity: "Log Aktivitas",
  settings: "Akun Saya",
};
