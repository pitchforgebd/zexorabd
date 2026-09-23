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
