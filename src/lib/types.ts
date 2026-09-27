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

export type SiteInfo = {
  logo: string;
  footerLogo: string; // '' = reuse `logo` in the footer, same as before this field existed
  favicon: string;
  ogImage: string;
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  whatsappQrImage: string; // '' = auto-generate from `whatsapp` instead of a custom upload
  address: string;
  businessHours: string;
  mapEmbedUrl: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
};

export type SisterConcernStats = {
  founded: string;
  headOffice: string;
  customersServed: string;
  leadershipExperience: string;
  coverage: string;
  industry: string;
};

export type SisterConcern = {
  logo: string;
  coverImage: string; // optional background photo for the homepage tile; falls back to a gradient when unset
  name: string;
  tagline: string;
  description: string; // shown as the "Overview" paragraph on /company
  whatWeDo: string[];
  whoWeServe: string;
  howStructured: string;
  stats: SisterConcernStats;
  profileNote: string; // shown in the "Company Profile" box on /company
  websiteUrl: string; // optional - shown as "Visit Official Website" on /company
};

export type SisterConcernsContent = {
  heading: string;
  subheading: string;
  items: SisterConcern[];
};

// SEO Tools: robots.txt content and tracking/verification codes injected
// site-wide. Kept as one JSON blob (global.seoTools) rather than several
// site_settings keys, matching the global.siteInfo precedent - one admin
// screen, one save.
export type SeoToolsContent = {
  robotsTxt: string;
  googleAnalyticsId: string; // GA4 Measurement ID, e.g. G-XXXXXXX - '' disables
  googleTagManagerId: string; // GTM Container ID, e.g. GTM-XXXXXXX - '' disables
  googleSearchConsoleVerification: string; // the content="..." value from GSC's HTML tag method - '' disables
  customHeadCode: string; // raw HTML/script injected just before </head> - anything not covered above
};

// Phase 14: content for the four previously-100%-hardcoded pages. Each
// page's headings/paragraphs/list-item text is admin-editable; page layout,
// decorative structure, and which icons appear where stay in code (see
// phases.md Phase 14 for the reasoning).
export type IconItem = { name: string; icon: string };
export type TitledIconItem = { icon: string; title: string; desc: string };

export type AboutContent = {
  hero: { title: string; subtitle: string };
  whoWeAre: { heading: string; paragraphs: string[] };
  divisionsSection: { heading: string; description: string; items: IconItem[] };
  competitiveAdvantage: { heading: string; paragraphs: string[] };
  ourVision: { heading: string; paragraphs: string[] };
};

export type CeoMessageContent = {
  hero: { eyebrow: string; title: string; quote: string };
  photo: string;
  name: string;
  title: string;
  sections: { heading: string; paragraphs: string[] }[];
  emphasisHeading: string;
  emphasisItems: string[];
  closingQuote: string;
};

export type VisionMissionContent = {
  hero: { title: string; subtitle: string };
  vision: { heading: string; text: string };
  mission: { heading: string; intro: string; commitmentHeading: string; commitments: string[] };
  coreValues: { heading: string; items: TitledIconItem[] };
  whyChooseUs: { heading: string; items: { title: string; desc: string }[] };
  industries: { heading: string; items: IconItem[] };
};

export type GlobalSourcingContent = {
  hero: { title: string; subtitle: string };
  intro: {
    eyebrow: string;
    heading: string;
    description: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    mapCalloutHeading: string;
    mapCalloutText: string;
  };
  countries: { heading: string; subheading: string; items: { flag: string; name: string; items: string }[] };
  businessModels: { heading: string; items: TitledIconItem[] };
  commitment: { heading: string; items: string[] };
  cta: { heading: string; text: string };
};

export type OurStoryContent = {
  hero: { eyebrow: string; title: string; subtitle: string };
  paragraphs: string[];
  pullQuote: string;
  // `label` is free text (a year, "15+ Years", "Ongoing"...) rather than a
  // strict year field - not every milestone has a precise date worth
  // pinning down, and forcing one would mean fabricating one.
  milestones: { label: string; title: string; description: string }[];
};

export type SiteSettings = {
  'home.hero'?: { slides: HeroSlide[] };
  'home.stats'?: { items: StatItem[] };
  'home.whyChooseUs'?: { heading: string; subheading: string; reasons: WhyChooseReason[] };
  'home.suppliers'?: { heading: string; subheading: string; description: string };
  'home.sisterConcerns'?: SisterConcernsContent;
  'global.siteInfo'?: SiteInfo;
  'global.seoTools'?: SeoToolsContent;
  'page.about'?: AboutContent;
  'page.ceoMessage'?: CeoMessageContent;
  'page.visionMission'?: VisionMissionContent;
  'page.globalSourcing'?: GlobalSourcingContent;
  'page.ourStory'?: OurStoryContent;
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

export type DashboardSummary = {
  counts: {
    divisions: number;
    newsPosts: { total: number; published: number; draft: number };
    photoGallery: number;
    videoGallery: number;
    suppliers: number;
    contactMessages: { total: number; unread: number };
    careerApplications: { total: number; new: number };
  };
  recent: {
    contactMessages: { id: number; name: string; subject: string | null; status: string; createdAt: string }[];
    careerApplications: { id: number; fullName: string; position: string | null; status: string; createdAt: string }[];
    newsPosts: { id: number; title: string; slug: string; isPublished: boolean; updatedAt: string }[];
    divisions: { id: number; name: string; slug: string; updatedAt: string }[];
  };
};
