const config = require('../config');
const seoMetaService = require('./seoMeta');
const divisionsService = require('./divisions');
const newsService = require('./news');

const SITE_NAME = 'Zexora Corporation';
const DEFAULT_TITLE = 'Zexora Corporation | Diversified Multi-Sector Business Group Bangladesh';
const DEFAULT_DESCRIPTION =
  'Zexora Corporation is a leading diversified business group in Bangladesh offering industrial chemicals, printing solutions, global sourcing, logistics, garments, power solutions and more.';
const DEFAULT_OG_IMAGE = `${config.siteUrl}/logo.png`;

// Static routes -> the seo_meta.page_key that holds their editable content.
const STATIC_PAGE_KEYS = {
  '/': 'home',
  '/about': 'about',
  '/ceo-message': 'ceo-message',
  '/vision-mission': 'vision-mission',
  '/divisions': 'divisions-list',
  '/global-sourcing': 'global-sourcing',
  '/career': 'career',
  '/media-centre': 'media-centre-news',
  '/media-centre/news': 'media-centre-news',
  '/media-centre/photo-gallery': 'media-centre-photos',
  '/media-centre/video-gallery': 'media-centre-videos',
  '/contact': 'contact',
};

function absoluteUrl(pathname) {
  return `${config.siteUrl}${pathname}`;
}

function truncate(text, max = 160) {
  if (!text) return null;
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

// OG images must be absolute URLs for social-media link previews to
// resolve them - coverImage/ogImage fields are often a relative /uploads
// path (uploaded via the admin) rather than a full URL.
function resolveImageUrl(image) {
  if (!image) return null;
  return image.startsWith('/') ? absoluteUrl(image) : image;
}

function buildResult({ pathname, title, description, ogImage, canonicalUrl, breadcrumbs, notFound }) {
  return {
    title: title || DEFAULT_TITLE,
    description: truncate(description) || DEFAULT_DESCRIPTION,
    ogImage: resolveImageUrl(ogImage) || DEFAULT_OG_IMAGE,
    canonicalUrl: canonicalUrl || absoluteUrl(pathname),
    breadcrumbs: breadcrumbs || null,
    notFound: !!notFound,
  };
}

/**
 * Resolve SEO meta for a request path. Content-backed pages (divisions,
 * news) get sensible defaults derived from their own data, which an
 * optional seo_meta row (keyed "division:<slug>" / "news:<slug>") can
 * override. Static pages are entirely admin-editable via seo_meta.
 */
async function resolveForPath(pathname) {
  // /divisions/:slug
  const divisionMatch = pathname.match(/^\/divisions\/([a-z0-9-]+)\/?$/);
  if (divisionMatch) {
    const slug = divisionMatch[1];
    const division = await divisionsService.getDivision({ slug, includeInactive: false });
    if (division) {
      const override = await seoMetaService.get(`division:${slug}`);
      return buildResult({
        pathname,
        title: override?.title || `${division.name} | ${SITE_NAME}`,
        description: override?.metaDescription || division.tagline || division.overview,
        ogImage: override?.ogImage || division.coverImage,
        canonicalUrl: override?.canonicalUrl,
        breadcrumbs: [
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Divisions', url: absoluteUrl('/divisions') },
          { name: division.name, url: absoluteUrl(pathname) },
        ],
      });
    }
  }

  // /media-centre/news/:slug
  const newsMatch = pathname.match(/^\/media-centre\/news\/([a-z0-9-]+)\/?$/);
  if (newsMatch) {
    const slug = newsMatch[1];
    const post = await newsService.getBySlug(slug);
    if (post) {
      const override = await seoMetaService.get(`news:${slug}`);
      return buildResult({
        pathname,
        title: override?.title || `${post.title} | News | ${SITE_NAME}`,
        description: override?.metaDescription || post.excerpt,
        ogImage: override?.ogImage || post.coverImage,
        canonicalUrl: override?.canonicalUrl,
        breadcrumbs: [
          { name: 'Home', url: absoluteUrl('/') },
          { name: 'Media Centre', url: absoluteUrl('/media-centre/news') },
          { name: 'News', url: absoluteUrl('/media-centre/news') },
          { name: post.title, url: absoluteUrl(pathname) },
        ],
      });
    }
  }

  // Static pages
  const pageKey = STATIC_PAGE_KEYS[pathname];
  if (pageKey) {
    const entry = await seoMetaService.get(pageKey);
    return buildResult({
      pathname,
      title: entry?.title,
      description: entry?.metaDescription,
      ogImage: entry?.ogImage,
      canonicalUrl: entry?.canonicalUrl,
    });
  }

  // Real routes with placeholder content pending from the client (see
  // phases.md Phase 12) - valid pages (200), just not in STATIC_PAGE_KEYS
  // since there's no seo_meta entry to manage yet, and deliberately left
  // out of sitemap.xml so they aren't submitted for indexing while the
  // content is still a placeholder.
  if (pathname === '/privacy-policy' || pathname === '/terms-of-service') {
    return buildResult({ pathname });
  }

  // Anything unrecognized (a division/news slug that doesn't exist, a typo'd
  // route, etc.) gets the site default plus notFound so the server responds
  // with a real 404 status - React Router renders the actual 404 UI.
  return buildResult({ pathname, notFound: true });
}

module.exports = { resolveForPath, SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE };
