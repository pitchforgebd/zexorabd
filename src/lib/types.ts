export type ProductItem = { id: number; text: string };

export type ProductSubcategory = {
  id: number;
  subName: string | null;
  description: string | null;
  items: ProductItem[];
};

export type ProductCategory = {
  id: number;
  category: string;
  description: string | null;
  subcategories: ProductSubcategory[];
};

export type GalleryImage = { id: number; url: string; caption: string | null };

export type DivisionSummary = {
  id: number;
  slug: string;
  name: string;
  industry: string | null;
  tagline: string | null;
  icon: string | null;
  coverImage: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type DivisionDetail = DivisionSummary & {
  overview: string | null;
  brandPositioning: string | null;
  philosophy: { intro: string; beliefs: string[]; closing: string } | null;
  industries: string[];
  reasons: string[];
  commitment: string[];
  strengths: string[];
  markets: string[];
  sourcingSteps: { title: string; description: string }[];
  products: ProductCategory[];
  galleryImages: GalleryImage[];
};

export type NewsPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsListResult = { items: NewsPost[]; total: number; page: number; limit: number };

export type PhotoGalleryImage = {
  id: number;
  url: string;
  caption: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type VideoGalleryItem = {
  id: number;
  title: string;
  videoUrl: string;
  thumbnail: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type Supplier = {
  id: number;
  url: string;
  altText: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type HeroSlide = { image: string; title: string; subtitle: string; description: string };
export type StatItem = { value: string; label: string };
export type WhyChooseReason = { title: string; desc: string };

export type SiteSettings = {
  'home.hero'?: { slides: HeroSlide[] };
  'home.stats'?: { items: StatItem[] };
  'home.whyChooseUs'?: { heading: string; subheading: string; reasons: WhyChooseReason[] };
  'home.suppliers'?: { heading: string; subheading: string; description: string };
};

export type PageSection = {
  sectionKey: string;
  isVisible: boolean;
  sortOrder: number;
  layoutVariant: string;
  config: Record<string, unknown>;
};

export type ContactMessage = {
  id: number;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
};

export type CareerApplication = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  position: string | null;
  education: string | null;
  experienceYears: string | null;
  coverLetter: string | null;
  message: string | null;
  cvFilePath: string;
  consent: boolean;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
};

export type SeoMetaEntry = {
  pageKey: string;
  title: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  updatedAt: string;
};
