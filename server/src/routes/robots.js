const { Router } = require('express');
const siteSettingsService = require('../services/siteSettings');
const config = require('../config');

const router = Router();

function defaultRobotsTxt() {
  return `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`;
}

// Served dynamically (registered ahead of the static dist/ middleware in
// createApp.js, same as sitemap.js) so an admin-edited robots.txt takes
// priority over the static file that ships in the build. The admin owns
// the full raw content, including the Sitemap: line, once they've saved
// anything - falls back to the same default the static file always had.
router.get('/robots.txt', async (req, res, next) => {
  try {
    const settings = await siteSettingsService.getAll();
    const body = settings['global.seoTools']?.robotsTxt || defaultRobotsTxt();
    res.set('Content-Type', 'text/plain');
    return res.send(body);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
