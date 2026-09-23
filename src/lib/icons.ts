import {
  LayoutGrid,
  FlaskConical,
  Cog,
  Zap,
  Shirt,
  Printer,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

/**
 * Deliberately a small, explicitly-imported map rather than lucide-react's
 * `icons` registry object — importing that pulls in every icon in the
 * library (~700KB extra in the production bundle, confirmed by comparing
 * build output) because it can't be tree-shaken. Add new entries here as
 * new division icons are needed.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  FlaskConical,
  Cog,
  Zap,
  Shirt,
  Printer,
  ShoppingBag,
};

/** Look up a lucide-react icon component by its export name (as stored in the DB), falling back to a generic grid icon. */
export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return LayoutGrid;
  return ICON_MAP[name] || LayoutGrid;
}
