import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiFetch } from './api';

type PageMeta = { title: string };

/**
 * Keeps the browser tab title correct on every route change, including
 * client-side SPA navigation (not just the first server-rendered load).
 * Uses the same server-side resolution logic (seoResolver.js) that injects
 * meta tags into the initial HTML - GET /api/page-meta - so there's exactly
 * one source of truth for "what's the title of this URL" instead of a
 * separate hardcoded copy living in the frontend.
 */
export function usePageTitleSync() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;
    apiFetch<PageMeta>(`/api/page-meta?path=${encodeURIComponent(pathname)}`)
      .then((meta) => {
        if (!cancelled) document.title = meta.title;
      })
      .catch(() => {}); // keep the previous title rather than clearing it on a failed fetch
    return () => {
      cancelled = true;
    };
  }, [pathname]);
}
