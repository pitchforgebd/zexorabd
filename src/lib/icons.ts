import {
  LayoutGrid,
  FlaskConical,
  Cog,
  Zap,
  Shirt,
  Printer,
  ShoppingBag,
  Beaker,
  Globe,
  Truck,
  Plane,
  Target,
  ShieldCheck,
  Heart,
  TrendingUp,
  Award,
  Package,
  Pill,
  Layers,
  PaintRoller,
  Droplet,
  Factory,
  Ship,
  Handshake,
  Box,
  type LucideIcon,
} from 'lucide-react';

/**
 * Deliberately a small, explicitly-imported map rather than lucide-react's
 * `icons` registry object — importing that pulls in every icon in the
 * library (~700KB extra in the production bundle, confirmed by comparing
 * build output) because it can't be tree-shaken. Add new entries here as
 * new icons are needed (division icons, and Phase 14's static-page item
 * grids - divisions/core values/industries/business models all use this
 * same admin-selectable icon-name-string pattern).
 */
const ICON_MAP: Record<string, LucideIcon> = {
  FlaskConical,
  Cog,
  Zap,
  Shirt,
  Printer,
  ShoppingBag,
  Beaker,
  Globe,
  Truck,
  Plane,
  Target,
  ShieldCheck,
  Heart,
  TrendingUp,
  Award,
  Package,
  Pill,
  Layers,
  PaintRoller,
  Droplet,
  Factory,
  Ship,
  Handshake,
  Box,
};

/** All icon names in the shared map, for building an admin <select> of choices. */
export const ICON_NAMES = Object.keys(ICON_MAP);

/** Look up a lucide-react icon component by its export name (as stored in the DB), falling back to a generic grid icon. */
export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return LayoutGrid;
  return ICON_MAP[name] || LayoutGrid;
}
