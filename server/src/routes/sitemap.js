const { Router } = require('express');
const config = require('../config');
const pool = require('../db/pool');
const newsService = require('../services/news');

const router = Router();

const STATIC_URLS = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/ceo-message', changefreq: 'monthly', priority: '0.5' },
  { path: '/vision-mission', changefreq: 'monthly', priority: '0.7' },
  { path: '/divisions', changefreq: 'monthly', priority: '0.8' },
  { path: '/global-sourcing', changefreq: 'monthly', priority: '0.8' },
  { path: '/our-story', changefreq: 'monthly', priority: '0.6' },
  { path: '/company', changefreq: 'monthly', priority: '0.6' },
  { path: '/career', changefreq: 'monthly', priority: '0.6' },
  { path: '/media-centre', changefreq: 'weekly', priority: '0.5' },
  { path: '/media-centre/news', changefreq: 'weekly', priority: '0.6' },
  { path: '/media-centre/photo-gallery', changefreq: 'monthly', priority: '0.4' },
  { path: '/media-centre/video-gallery', changefreq: 'monthly', priority: '0.4' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
];

// MySQL DATETIME values arrive as "YYYY-MM-DD HH:MM:SS" (space, no "T") -
// Node's Date parser generally accepts that, but normalizing to a proper
// ISO string first avoids relying on that non-standard parsing behavior.
function toLastmod(date) {
  if (!date) return null;
  const raw = date instanceof Date ? date : new Date(String(date).replace(' ', 'T'));
  return Number.isNaN(raw.getTime()) ? null : raw.toISOString().slice(0, 10);
}

function urlEntry(loc, changefreq, priority, lastmod) {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// Regenerated fresh on every request rather than written to a static file -
// content changes (a new division, a new published news post) show up
// immediately with no cache-invalidation step to remember.
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [divisionRows, news] = await Promise.all([
      // A lightweight query of its own (slug + updated_at only) rather than
      // reusing divisionsService.listDivisions, which doesn't select
      // updated_at - keeps that shared, app-wide function's return shape
      // untouched instead of growing it for this one sitemap-only need.
      pool.query('SELECT slug, updated_at FROM divisions WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'),
      newsService.listAll(),
    ]);
    const divisions = divisionRows[0];

    const entries = [
      ...STATIC_URLS.map((u) => urlEntry(`${config.siteUrl}${u.path}`, u.changefreq, u.priority)),
      ...divisions.map((d) =>
        urlEntry(`${config.siteUrl}/divisions/${d.slug}`, 'monthly', '0.6', toLastmod(d.updated_at))
      ),
      ...news
        .filter((n) => n.isPublished)
        .map((n) =>
          urlEntry(`${config.siteUrl}/media-centre/news/${n.slug}`, 'monthly', '0.5', toLastmod(n.updatedAt))
        ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

    res.set('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
