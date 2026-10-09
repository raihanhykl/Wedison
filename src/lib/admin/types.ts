// Types returned by the backend (server/prisma/schema.prisma). Kept in sync manually.
// "Topics" in the UI map to the Category model in the database.
/** Badge colors a role may use (mirrors server/src/lib/roles.ts). */
export type RoleColor = "emerald" | "blue" | "violet" | "pink" | "amber" | "teal" | "cyan" | "rose" | "orange" | "indigo" | "lime" | "slate";
export type RoleRef = { id: string; key: string; name: string; color: RoleColor | null; isSystem: boolean };
export type Role = RoleRef & {
  description: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  _count: { users: number };
};
export type PermissionDef = { key: string; label: string; description: string; implies?: string[] };
export type PermissionModule = { key: string; label: string; description: string; permissions: PermissionDef[] };
export type PermissionCatalog = { modules: PermissionModule[]; colors: RoleColor[] };
export type ContentStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type Locale = "id" | "en";
export type SocialPlatform = "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "X" | "FACEBOOK" | "LINKEDIN";
export type StationStatus = "OPERATIONAL" | "COMING_SOON" | "MAINTENANCE" | "CLOSED";
export type StationTier = "HUB" | "SHOWROOM" | "MITRA";

/** Signed-in user: role reference + effective permission keys ("*" = everything). */
export type AuthUser = { id: string; email: string; name: string; avatarUrl: string | null; role: RoleRef; permissions: string[] };

export type Paginated<T> = {
  ok: true;
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type User = Omit<AuthUser, "permissions"> & {
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { articles: number };
};

export type Category = {
  id: string;
  slug: string;
  nameId: string;
  nameEn: string | null;
  description: string | null;
  color: string | null;
  sortOrder: number;
  _count?: { articles: number };
};

export type Tag = { id: string; slug: string; name: string; _count?: { articles: number } };

export type Media = {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  url: string;
  alt: string | null;
  caption: string | null;
  folder: string;
  createdAt: string;
  uploadedBy?: { id: string; name: string } | null;
};

export type ArticleTranslation = {
  id?: string;
  locale: Locale;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  readingTime?: number;
  contentScore?: ContentScore | null;
};

// ─── Content health (SEO / AEO / GEO) — mirrors server/src/lib/content-score.ts ───
export type Pillar = "seo" | "aeo" | "geo";
export type CheckStatus = "pass" | "warn" | "fail" | "info";
export type HealthCheck = { id: string; pillar: Pillar; label: string; status: CheckStatus; weight: number; note?: string; value?: string; pages?: string[] };
export type PillarScore = { score: number; grade: "good" | "fair" | "poor"; passed: number; total: number; checks: HealthCheck[] };
export type ContentScore = {
  version: 1;
  analyzedAt: string;
  overall: number;
  seo: PillarScore;
  aeo: PillarScore;
  geo: PillarScore;
  stats: {
    words: number; sentences: number; paragraphs: number;
    headings: { h1: number; h2: number; h3: number; h4: number };
    questionHeadings: number; images: number; imagesMissingAlt: number; internalLinks: number; externalLinks: number;
    externalDomains: number; lists: number; tables: number; blockquotes: number; numericFacts: number; readingMinutes: number;
  };
  faq: { question: string; answer: string }[];
};

export type SitePage = {
  path: string; status: number; title: string; titleLength: number; description: string; descriptionLength: number; canonical: string;
  hreflang: number; robots: string; h1: number; h2: number; questionHeadings: number; jsonLdTypes: string[]; images: number;
  imagesMissingAlt: number; ogImage: string; words: number; hasMain: boolean; internalLinkIssues: number; metadataInHead: boolean; issues: string[];
};
export type SiteAudit = {
  version: 1; ranAt: string; durationMs: number; baseUrl: string; publicOrigin: string; pagesCrawled: number; overall: number;
  seo: PillarScore; aeo: PillarScore; geo: PillarScore; pages?: SitePage[];
  files: { robots: boolean; sitemap: boolean; llms: boolean; manifest: boolean; robotsAllowsAi: boolean; sitemapUrls: number };
};
export type SeoOverview = {
  site: SiteAudit | null;
  articles: { published: number; publishedLast90d: number; withAuthor: number; avgSeo: number | null; avgAeo: number | null; avgGeo: number | null };
  attention: { id: string; status: ContentStatus; title: string; seo: number; aeo: number; geo: number; overall: number; updatedAt: string }[];
  running: boolean;
};

export const PILLAR_LABEL: Record<Pillar, string> = { seo: "SEO", aeo: "AEO", geo: "GEO" };
export const PILLAR_DESCRIPTION: Record<Pillar, string> = {
  seo: "Search Engine Optimization — how well Google can find, understand and rank the page.",
  aeo: "Answer Engine Optimization — whether the content can be lifted as a direct answer (featured snippets, voice, AI overviews).",
  geo: "Generative Engine Optimization — how likely ChatGPT, Gemini, Perplexity and similar cite this content.",
};

export type Article = {
  id: string;
  status: ContentStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  scheduledAt: string | null;
  viewCount: number;
  coverImageId: string | null;
  coverImage: Media | null;
  ogImageId: string | null;
  ogImage: Media | null;
  noIndex: boolean;
  categoryId: string | null;
  category: Category | null;
  author: { id: string; name: string; email: string; avatarUrl: string | null } | null;
  tags: Tag[];
  translations: ArticleTranslation[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Press = {
  id: string;
  slug: string;
  url: string;
  title: string;
  excerpt: string | null;
  description: string | null;
  imageUrl: string | null;
  siteName: string | null;
  author: string | null;
  publishedAt: string | null;
  status: ContentStatus;
  sortOrder: number;
  fetchedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SocialPost = {
  id: string;
  platform: SocialPlatform;
  url: string;
  externalId: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  publishedAt: string | null;
  fetchedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Station = {
  id: string;
  slug: string;
  name: string;
  status: StationStatus;
  tier: StationTier;
  address: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  pilesTotal: number;
  powerKw: number;
  hours: string;
  amenities: string[];
  photoUrl: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ActivityLog = {
  id: string;
  userId: string | null;
  user: { id: string; name: string; email: string; avatarUrl: string | null } | null;
  action: string;
  entity: string;
  entityId: string | null;
  summary: string | null;
  meta: unknown;
  ip: string | null;
  createdAt: string;
};

export type DashboardStats = {
  counts: {
    articles: number;
    articlesByStatus: Partial<Record<ContentStatus, number>>;
    publishedLast30Days: number;
    totalViews: number;
    press: number;
    social: number;
    media: number;
    stations: number;
    stationsByStatus: Partial<Record<StationStatus, number>>;
    bookings: number;
    bookingsNew: number;
    bookingsUpcoming7d: number;
    contactsUnhandled: number;
  };
  recentArticles: (Pick<Article, "id" | "status" | "updatedAt" | "publishedAt"> & {
    translations: { locale: Locale; title: string; slug: string }[];
    author: { name: string } | null;
  })[];
  recentActivity: (ActivityLog & { user: { name: string; avatarUrl: string | null } | null })[];
  cache: { size: number; tags: string[] };
  generatedAt: string;
};

export const STATUS_LABEL: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

/** Tailwind classes per role color (badge + swatch). Keys mirror RoleColor. */
export const ROLE_COLOR_CLASS: Record<RoleColor, { badge: string; dot: string }> = {
  emerald: { badge: "bg-emerald-500/12 text-emerald-700 border-emerald-500/30 dark:text-emerald-300", dot: "bg-emerald-500" },
  blue: { badge: "bg-blue-500/12 text-blue-700 border-blue-500/30 dark:text-blue-300", dot: "bg-blue-500" },
  violet: { badge: "bg-violet-500/12 text-violet-700 border-violet-500/30 dark:text-violet-300", dot: "bg-violet-500" },
  pink: { badge: "bg-pink-500/12 text-pink-700 border-pink-500/30 dark:text-pink-300", dot: "bg-pink-500" },
  amber: { badge: "bg-amber-500/15 text-amber-800 border-amber-500/30 dark:text-amber-300", dot: "bg-amber-500" },
  teal: { badge: "bg-teal-500/12 text-teal-700 border-teal-500/30 dark:text-teal-300", dot: "bg-teal-500" },
  cyan: { badge: "bg-cyan-500/12 text-cyan-700 border-cyan-500/30 dark:text-cyan-300", dot: "bg-cyan-500" },
  rose: { badge: "bg-rose-500/12 text-rose-700 border-rose-500/30 dark:text-rose-300", dot: "bg-rose-500" },
  orange: { badge: "bg-orange-500/12 text-orange-700 border-orange-500/30 dark:text-orange-300", dot: "bg-orange-500" },
  indigo: { badge: "bg-indigo-500/12 text-indigo-700 border-indigo-500/30 dark:text-indigo-300", dot: "bg-indigo-500" },
  lime: { badge: "bg-lime-500/15 text-lime-800 border-lime-500/30 dark:text-lime-300", dot: "bg-lime-500" },
  slate: { badge: "bg-slate-500/12 text-slate-700 border-slate-500/30 dark:text-slate-300", dot: "bg-slate-500" },
};

// ─── HR ───
export type JobStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
export type WorkplaceType = "ONSITE" | "HYBRID" | "REMOTE";
export type ExperienceLevel = "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "MANAGER";
export type JobDepartment = { id: string; slug: string; nameId: string; nameEn: string | null; sortOrder: number; isActive: boolean; _count?: { jobs: number } };
export type JobLocation = { id: string; slug: string; city: string; province: string | null; country: string; countryCode: string; sortOrder: number; isActive: boolean; _count?: { jobs: number } };
export type JobTranslation = { id?: string; locale: Locale; title: string; summary: string; responsibilities: string[]; qualifications: string[]; niceToHave: string[]; benefits: string[] };
export type Job = {
  id: string; slug: string; status: JobStatus; departmentId: string | null; department: JobDepartment | null; locations: JobLocation[];
  employmentType: EmploymentType; workplaceType: WorkplaceType; experienceLevel: ExperienceLevel | null; openings: number;
  salaryMin: number | null; salaryMax: number | null; salaryCurrency: string; showSalary: boolean; isUrgent: boolean;
  applyEmail: string | null; portals: { name: string; url: string }[]; sortOrder: number;
  publishedAt: string | null; closesAt: string | null; closedAt: string | null; viewCount: number; reviewNote: string | null;
  translations: JobTranslation[]; createdAt: string; updatedAt: string; _count?: { applyClicks: number };
};
export type HrPermissions = { role: string; write: boolean; publish: boolean; delete: boolean; settings: boolean; taxonomy: boolean };
export type HrSettings = {
  contactName: string; contactEmail: string; ccEmail?: string | null; phone?: string | null; whatsapp?: string | null;
  emailSubjectId: string; emailSubjectEn: string; applicationNoteId?: string | null; applicationNoteEn?: string | null;
  openApplicationEnabled: boolean; companyPortals: { name: string; url: string; enabled: boolean }[];
};
export type HrOverview = {
  counts: Partial<Record<JobStatus, number>>; openPositions: number; totalViews: number; applyClicks30d: number;
  clicksByChannel30d: { channel: string; count: number }[]; byDepartment: { name: string; count: number }[];
  closingSoon: { id: string; title: string; closesAt: string }[]; pendingReview: { id: string; title: string; updatedAt: string }[];
  topJobs: { id: string; title: string; views: number; applyClicks: number }[];
};
export const JOB_STATUS_LABEL: Record<JobStatus, string> = { DRAFT: "Draft", PENDING_REVIEW: "Pending review", PUBLISHED: "Published", CLOSED: "Closed", ARCHIVED: "Archived" };
export const EMPLOYMENT_LABEL: Record<EmploymentType, string> = { FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract", INTERNSHIP: "Internship", FREELANCE: "Freelance" };
export const WORKPLACE_LABEL: Record<WorkplaceType, string> = { ONSITE: "On-site", HYBRID: "Hybrid", REMOTE: "Remote" };
export const LEVEL_LABEL: Record<ExperienceLevel, string> = { ENTRY: "Entry level", JUNIOR: "Junior", MID: "Mid level", SENIOR: "Senior", LEAD: "Lead", MANAGER: "Manager" };

export const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  X: "X (Twitter)",
  FACEBOOK: "Facebook",
  LINKEDIN: "LinkedIn",
};

export const STATION_STATUS_LABEL: Record<StationStatus, string> = {
  OPERATIONAL: "Operational",
  COMING_SOON: "Coming soon",
  MAINTENANCE: "Maintenance",
  CLOSED: "Closed",
};

export const STATION_TIER_LABEL: Record<StationTier, string> = { HUB: "Hub", SHOWROOM: "Showroom", MITRA: "Partner" };

/** Kunci fasilitas = kunci kamus publik `supercharge.locator.amenity.<key>` (jangan diubah sembarangan). */
export const STATION_AMENITIES: { key: string; label: string }[] = [
  { key: "parkir", label: "Parking" },
  { key: "toilet", label: "Toilet" },
  { key: "musala", label: "Prayer room" },
  { key: "kafe", label: "Café" },
  { key: "minimarket", label: "Minimarket" },
  { key: "wifi", label: "Wi-Fi" },
];

export type StationsMeta = {
  provinces: string[];
  cities: { city: string; province: string }[];
  byStatus: Partial<Record<StationStatus, number>>;
  total: number;
  inactive: number;
};

// ───────────────────────── Leads (booking showroom & pesan kontak) ─────────────────────────
export type ShowroomId = "jakarta" | "bekasi" | "bandung" | "bali";
export type BookingPurpose = "TEST_RIDE" | "CONSULTATION" | "FINANCING" | "SERVICE" | "OTHER";
export type BookingStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type CalendarSyncStatus = "PENDING" | "SAVED" | "FAILED" | "SKIPPED";

export type Booking = {
  id: string;
  showroom: ShowroomId;
  purpose: BookingPurpose;
  name: string;
  phone: string;
  email: string | null;
  date: string; // YYYY-MM-DD (showroom time zone)
  time: string; // HH:mm
  startAt: string;
  note: string | null;
  source: string | null;
  locale: Locale | null;
  status: BookingStatus;
  calendarStatus: CalendarSyncStatus;
  calendarEventId: string | null;
  calendarLink: string | null;
  calendarError: string | null;
  adminNote: string | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  locale: Locale | null;
  isHandled: boolean;
  handledAt: string | null;
  adminNote: string | null;
  ip: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadsStats = {
  range: { from: string; to: string };
  totals: {
    bookingsAll: number;
    bookingsInRange: number;
    bookingsNew: number;
    upcoming7d: number;
    contactsAll: number;
    contactsInRange: number;
    contactsUnhandled: number;
  };
  byPurpose: Partial<Record<BookingPurpose, number>>;
  byShowroom: Partial<Record<ShowroomId, number>>;
  bySource: Record<string, number>;
  byStatus: Partial<Record<BookingStatus, number>>;
  byTopic: { topic: string; count: number }[];
  perDay: { day: string; bookings: number; contacts: number }[];
  recentBookings: Booking[];
  upcomingBookings: Booking[];
  recentContacts: ContactSubmission[];
  calendarConfigured: boolean;
  generatedAt: string;
};

export const SHOWROOM_LABEL: Record<ShowroomId, string> = { jakarta: "Wedison Jakarta", bekasi: "Wedison Bekasi", bandung: "Wedison Bandung", bali: "Wedison Bali" };
export const SHOWROOM_TZ: Record<ShowroomId, string> = { jakarta: "WIB", bekasi: "WIB", bandung: "WIB", bali: "WITA" };
export const BOOKING_PURPOSE_LABEL: Record<BookingPurpose, string> = {
  TEST_RIDE: "Test Ride",
  CONSULTATION: "Product consultation",
  FINANCING: "Financing simulation",
  SERVICE: "Service",
  OTHER: "Other visit",
};
export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
};
export const CALENDAR_STATUS_LABEL: Record<CalendarSyncStatus, string> = {
  PENDING: "Pending",
  SAVED: "In Google Calendar",
  FAILED: "Sync failed",
  SKIPPED: "Not synced",
};
export const BOOKING_SOURCE_LABEL: Record<string, string> = {
  navbar: "Navbar button",
  "nav-sheet": "Mobile menu",
  "landing-hero": "Landing hero",
  "showroom-card": "Showroom card",
  "product-hero": "Product page hero",
  "product-subnav": "Product page sticky bar",
  "showroom-hero": "Showroom page hero",
  "showroom-steps": "Showroom page visit steps",
  "showroom-cta": "Showroom page closing CTA",
  "contact-page": "Contact page",
  other: "Other",
  unknown: "Unknown",
};

/** Nomor WhatsApp internasional dari nomor kanonik 08xx. */
export const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "62")}`;
