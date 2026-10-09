import {
  LayoutDashboard, Newspaper, FileText, Share2, Tags, Images, MapPin, Users, ScrollText, Settings, Gauge,
  ChartColumnBig, CalendarCheck, MessageSquareText, CalendarDays, Briefcase, Building2, Contact, LayoutGrid, type LucideIcon,
} from "lucide-react";
import type { Module } from "@/lib/admin/permissions";

/** `module`: the item is shown only to roles with access to it (see lib/admin/permissions.ts). */
export type NavItem = { title: string; href: string; icon: LucideIcon; module?: Module; badge?: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard, module: "dashboard" }],
  },
  {
    label: "CMS · Media Center",
    items: [
      { title: "Articles", href: "/admin/cms/articles", icon: FileText, module: "cms" },
      { title: "Press Coverage", href: "/admin/cms/press", icon: Newspaper, module: "cms" },
      { title: "Social Media", href: "/admin/cms/social", icon: Share2, module: "cms" },
      { title: "Topics & Tags", href: "/admin/cms/topics", icon: Tags, module: "cms" },
      { title: "Media Library", href: "/admin/cms/media", icon: Images, module: "cms" },
      { title: "SEO & AI Readiness", href: "/admin/seo", icon: Gauge, module: "cms" },
    ],
  },
  {
    label: "SuperCharge",
    items: [{ title: "Stations", href: "/admin/supercharge/stations", icon: MapPin, module: "supercharge" }],
  },
  {
    label: "Leads",
    items: [
      { title: "Overview", href: "/admin/leads", icon: ChartColumnBig, module: "leads" },
      { title: "Bookings", href: "/admin/leads/bookings", icon: CalendarCheck, module: "leads" },
      { title: "Contact Messages", href: "/admin/leads/contacts", icon: MessageSquareText, module: "leads" },
      { title: "Calendar", href: "/admin/leads/calendar", icon: CalendarDays, module: "leads" },
    ],
  },
  {
    label: "HR · Careers",
    items: [
      { title: "Overview", href: "/admin/hr", icon: LayoutGrid, module: "hr" },
      { title: "Job Openings", href: "/admin/hr/jobs", icon: Briefcase, module: "hr" },
      { title: "Divisions & Locations", href: "/admin/hr/structure", icon: Building2, module: "hr" },
      { title: "HR Contact & Settings", href: "/admin/hr/settings", icon: Contact, module: "hr" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Users & Roles", href: "/admin/users", icon: Users, module: "users" },
      { title: "Activity Log", href: "/admin/activity", icon: ScrollText, module: "activity" },
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
  seo: "SEO & AI Readiness",
  supercharge: "SuperCharge",
  stations: "Stations",
  leads: "Leads",
  bookings: "Bookings",
  contacts: "Contact Messages",
  calendar: "Calendar",
  users: "Users & Roles",
  roles: "Roles",
  activity: "Activity Log",
  settings: "My Account",
  hr: "HR",
  jobs: "Job Openings",
  structure: "Divisions & Locations",
};
