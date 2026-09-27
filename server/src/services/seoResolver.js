const config = require('../config');
const seoMetaService = require('./seoMeta');
const divisionsService = require('./divisions');
const newsService = require('./news');
const siteSettingsService = require('./siteSettings');

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
  '/our-story': 'our-story',
  '/company': 'company',
  '/career': 'career',
  '/media-centre': 'media-centre-news',
  '/media-centre/news': 'media-centre-news',
  '/media-centre/photo-gallery': 'media-centre-photos',
  '/media-centre/video-gallery': 'media-centre-videos',
  '/contact': 'contact',
};

// Breadcrumb trail per static route (Home is implicit/first for all of
// these, so it isn't repeated in the map) - lets Google understand and
// display the site's structure (e.g. as breadcrumb-style sitelinks under
// the main search result) on every page, not just division/news detail
// pages. The homepage itself has no breadcrumbs - a single "Home" crumb on
// "/" would be redundant.
const STATIC_BREADCRUMBS = {
  '/about': [{ name: 'About Us' }],
  '/ceo-message': [{ name: 'About Us', url: '/about' }, { name: "CEO's Message" }],
  '/vision-mission': [{ name: 'About Us', url: '/about' }, { name: 'Vision & Mission' }],
  '/divisions': [{ name: 'Our Divisions' }],
  '/global-sourcing': [{ name: 'Global Sourcing' }],
  '/our-story': [{ name: 'Our Story' }],
  '/company': [{ name: 'Company' }],
  '/career': [{ name: 'Career' }],
  '/media-centre': [{ name: 'Media Centre' }],
  '/media-centre/news': [{ name: 'Media Centre', url: '/media-centre' }, { name: 'News' }],
  '/media-centre/photo-gallery': [{ name: 'Media Centre', url: '/media-centre' }, { name: 'Photo Gallery' }],
  '/media-centre/video-gallery': [{ name: 'Media Centre', url: '/media-centre' }, { name: 'Video Gallery' }],
  '/contact': [{ name: 'Contact' }],
};

function absoluteUrl(pathname) {
  return `${config.siteUrl}${pathname}`;
}

// Mirrors src/lib/slugify.ts exactly - home.sisterConcerns has no stored
// slug/id (it's a plain settings array), so both the frontend link and this
// server-side route match derive the same slug from the company name.
function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Prefixes "Home" and resolves each crumb's (optional, relative) url to an
// absolute one - the trail's own current page is intentionally left
// without a url in STATIC_BREADCRUMBS/callers, filled in here from pathname.
function buildBreadcrumbs(pathname, trail) {
  const crumbs = [{ name: 'Home', url: '/' }, ...trail];
  return crumbs.map((crumb, index) => ({
    name: crumb.name,
    url: absoluteUrl(crumb.url || (index === crumbs.length - 1 ? pathname : '/')),
  }));
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

function buildResult({ pathname, title, description, ogImage, canonicalUrl, breadcrumbs, notFound, article, noIndex }) {
  return {
    title: title || DEFAULT_TITLE,
    description: truncate(description) || DEFAULT_DESCRIPTION,
    // No hardcoded fallback here - the wrapper (resolveForPath) fills in
    // siteInfo.ogImage first, only reaching DEFAULT_OG_IMAGE if that's
    // unset too, since siteInfo isn't available until after this returns.
    ogImage: resolveImageUrl(ogImage),
    canonicalUrl: canonicalUrl || absoluteUrl(pathname),
    breadcrumbs: breadcrumbs || null,
    article: article || null,
    notFound: !!notFound,
    // A 404 is never worth indexing; explicit noIndex covers anything else
    // that shouldn't be (there's currently nothing else, but the hook is
    // here so a future draft/private page type doesn't need new plumbing).
    noIndex: !!(noIndex || notFound),
  };
}

/**
 * Resolve SEO meta for a request path. Content-backed pages (divisions,
 * news) get sensible defaults derived from their own data, which an
 * optional seo_meta row (keyed "division:<slug>" / "news:<slug>") can
 * override. Static pages are entirely admin-editable via seo_meta.
 */
async function resolveForPath(pathname) {
  const [settings, result] = await Promise.all([siteSettingsService.getAll(), resolveCore(pathname)]);
  const siteInfo = settings['global.siteInfo'];
  const seoTools = settings['global.seoTools'];
  // Fallback chain: this page's own og:image -> the site-wide default set
  // in Website Settings -> the hardcoded logo, so every page has always
  // had *something* correct to show even before Phase 13/16.5 existed.
  const ogImage = result.ogImage || resolveImageUrl(siteInfo?.ogImage) || DEFAULT_OG_IMAGE;
  return { ...result, ogImage, siteInfo, seoTools };
}

// Does the actual route matching/lookup; siteInfo is merged in by the
// wrapper above so every return site here doesn't need to thread it through.
async function resolveCore(pathname) {
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
        breadcrumbs: buildBreadcrumbs(pathname, [{ name: 'Divisions', url: '/divisions' }, { name: division.name }]),
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
        breadcrumbs: buildBreadcrumbs(pathname, [
          { name: 'Media Centre', url: '/media-centre' },
          { name: 'News', url: '/media-centre/news' },
          { name: post.title },
        ]),
        article: {
          title: post.title,
          image: resolveImageUrl(post.coverImage),
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.updatedAt,
          url: absoluteUrl(pathname),
        },
      });
    }
  }

  // /subsidiaries/:slug - home.sisterConcerns is a plain settings array (no
  // DB table/id), so the slug is derived from the company name on the fly.
  const subsidiaryMatch = pathname.match(/^\/subsidiaries\/([a-z0-9-]+)\/?$/);
  if (subsidiaryMatch) {
    const slug = subsidiaryMatch[1];
    const settings = await siteSettingsService.getAll();
    const concern = (settings['home.sisterConcerns']?.items || []).find((item) => slugify(item.name) === slug);
    if (concern) {
      return buildResult({
        pathname,
        title: `${concern.name} | ${SITE_NAME}`,
        description: concern.tagline || concern.description,
        ogImage: concern.coverImage || concern.logo,
        // No breadcrumb parent for "Subsidiaries" - it's a homepage section,
        // not a listing page of its own, so a fake middle crumb pointing at
        // "/" and calling it something other than "Home" would be wrong.
        breadcrumbs: buildBreadcrumbs(pathname, [{ name: concern.name }]),
      });
    }
  }

  // Static pages
  const pageKey = STATIC_PAGE_KEYS[pathname];
  if (pageKey) {
    const entry = await seoMetaService.get(pageKey);
    const trail = STATIC_BREADCRUMBS[pathname];
    return buildResult({
      pathname,
      title: entry?.title,
      description: entry?.metaDescription,
      ogImage: entry?.ogImage,
      canonicalUrl: entry?.canonicalUrl,
      breadcrumbs: trail ? buildBreadcrumbs(pathname, trail) : null,
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
