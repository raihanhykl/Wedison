import {
  LayoutDashboard, Newspaper, FileText, Share2, Tags, Images, MapPin, Users, ScrollText, Settings, type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/lib/admin/types";

export type NavItem = { title: string; href: string; icon: LucideIcon; roles?: UserRole[]; badge?: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "CMS · Media Center",
    items: [
      { title: "Articles", href: "/admin/cms/articles", icon: FileText },
      { title: "Press Coverage", href: "/admin/cms/press", icon: Newspaper },
      { title: "Social Media", href: "/admin/cms/social", icon: Share2 },
      { title: "Topics & Tags", href: "/admin/cms/topics", icon: Tags },
      { title: "Media Library", href: "/admin/cms/media", icon: Images },
    ],
  },
  {
    label: "SuperCharge",
    items: [{ title: "Stations", href: "/admin/supercharge/stations", icon: MapPin }],
  },
  {
    label: "System",
    items: [
      { title: "Users", href: "/admin/users", icon: Users, roles: ["SUPER_ADMIN"] },
      { title: "Activity Log", href: "/admin/activity", icon: ScrollText, roles: ["SUPER_ADMIN", "ADMIN"] },
      { title: "My Account", href: "/admin/settings", icon: Settings },
    ],
  },
];

/** Breadcrumb label per path segment. */
export const SEGMENT_LABEL: Record<string, string> = {
  admin: "Admin",
  cms: "CMS",
  articles: "Articles",
  new: "New",
  press: "Press Coverage",
  social: "Social Media",
  topics: "Topics & Tags",
  media: "Media Library",
  supercharge: "SuperCharge",
  stations: "Stations",
  users: "Users",
  activity: "Activity Log",
  settings: "My Account",
};
