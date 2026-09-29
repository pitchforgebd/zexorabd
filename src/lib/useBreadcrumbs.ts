import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiFetch } from './api';

export type Breadcrumb = { name: string; url: string };
type PageMeta = { breadcrumbs: Breadcrumb[] | null };

/**
 * Same server-side resolution (seoResolver.js) that builds the invisible
 * BreadcrumbList JSON-LD in <head> - GET /api/page-meta - reused here so the
 * visible breadcrumb trail a visitor sees can never drift out of sync with
 * what's declared in structured data for the same page.
 */
export function useBreadcrumbs(): Breadcrumb[] | null {
  const { pathname } = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<PageMeta>(`/api/page-meta?path=${encodeURIComponent(pathname)}`)
      .then((meta) => {
        if (!cancelled) setBreadcrumbs(meta.breadcrumbs);
      })
      .catch(() => {
        if (!cancelled) setBreadcrumbs(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return breadcrumbs;
}
