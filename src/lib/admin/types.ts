// Tipe data yang dikembalikan backend (server/prisma/schema.prisma). Dijaga sinkron manual.
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";
export type ContentStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type Locale = "id" | "en";
export type SocialPlatform = "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "X" | "FACEBOOK" | "LINKEDIN";
export type StationStatus = "OPERATIONAL" | "COMING_SOON" | "MAINTENANCE" | "CLOSED";
export type StationTier = "HUB" | "SHOWROOM" | "MITRA";

export type AuthUser = { id: string; email: string; name: string; role: UserRole; avatarUrl: string | null };

export type Paginated<T> = {
  ok: true;
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type User = AuthUser & {
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
  readingTime?: number;
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
  DRAFT: "Draf",
  SCHEDULED: "Terjadwal",
  PUBLISHED: "Tayang",
  ARCHIVED: "Arsip",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};

export const PLATFORM_LABEL: Record<SocialPlatform, string> = {
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  X: "X (Twitter)",
  FACEBOOK: "Facebook",
  LINKEDIN: "LinkedIn",
};

export const STATION_STATUS_LABEL: Record<StationStatus, string> = {
  OPERATIONAL: "Beroperasi",
  COMING_SOON: "Segera",
  MAINTENANCE: "Perawatan",
  CLOSED: "Tutup",
};

export const STATION_TIER_LABEL: Record<StationTier, string> = { HUB: "Hub", SHOWROOM: "Showroom", MITRA: "Mitra" };
