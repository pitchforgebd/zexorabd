const { Router } = require('express');
const config = require('../config');
const divisionsService = require('../services/divisions');
const newsService = require('../services/news');

const router = Router();

const STATIC_URLS = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/ceo-message', changefreq: 'monthly', priority: '0.5' },
  { path: '/vision-mission', changefreq: 'monthly', priority: '0.7' },
  { path: '/divisions', changefreq: 'monthly', priority: '0.8' },
  { path: '/global-sourcing', changefreq: 'monthly', priority: '0.8' },
  { path: '/career', changefreq: 'monthly', priority: '0.6' },
  { path: '/media-centre/news', changefreq: 'weekly', priority: '0.6' },
  { path: '/media-centre/photo-gallery', changefreq: 'monthly', priority: '0.4' },
  { path: '/media-centre/video-gallery', changefreq: 'monthly', priority: '0.4' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
];

function urlEntry(loc, changefreq, priority) {
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

// Regenerated fresh on every request rather than written to a static file -
// content changes (a new division, a new published news post) show up
// immediately with no cache-invalidation step to remember.
router.get('/sitemap.xml', async (req, res, next) => {
  try {
    const [divisions, news] = await Promise.all([
      divisionsService.listDivisions({ includeInactive: false }),
      newsService.listAll(),
    ]);

    const entries = [
      ...STATIC_URLS.map((u) => urlEntry(`${config.siteUrl}${u.path}`, u.changefreq, u.priority)),
      ...divisions.map((d) => urlEntry(`${config.siteUrl}/divisions/${d.slug}`, 'monthly', '0.6')),
      ...news
        .filter((n) => n.isPublished)
        .map((n) => urlEntry(`${config.siteUrl}/media-centre/news/${n.slug}`, 'monthly', '0.5')),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

    res.set('Content-Type', 'application/xml');
    return res.send(xml);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
