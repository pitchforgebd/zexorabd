import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs } from '../lib/useBreadcrumbs';

// Renders the same trail declared in this page's (invisible) BreadcrumbList
// JSON-LD - both come from the one server-side resolution (seoResolver.js
// via /api/page-meta), so the visible trail and the structured data can
// never disagree about what this page's position in the site is.
export default function Breadcrumbs({ variant = 'light', center = false }: { variant?: 'light' | 'dark'; center?: boolean }) {
  const breadcrumbs = useBreadcrumbs();

  // Nothing to show on the homepage, or before the fetch resolves - never
  // renders a skeleton/placeholder crumb trail.
  if (!breadcrumbs || breadcrumbs.length <= 1) return null;

  const isDark = variant === 'dark';

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-xs font-medium ${center ? 'justify-center' : ''} ${isDark ? 'text-white/60' : 'text-gray-400'}`}
      >
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          // The URL is absolute (built server-side for JSON-LD); React
          // Router's Link needs a path relative to this app's own origin.
          const path = crumb.url.replace(/^https?:\/\/[^/]+/, '') || '/';
          return (
            <Fragment key={crumb.url}>
              {idx > 0 && <ChevronRight className="w-3 h-3 shrink-0" />}
              {isLast ? (
                <span className={isDark ? 'text-white' : 'text-primary-dark'} aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link to={path} className={isDark ? 'hover:text-white transition-colors' : 'hover:text-primary-blue transition-colors'}>
                  {crumb.name}
                </Link>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
