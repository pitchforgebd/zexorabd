const { Router } = require('express');
const seoResolver = require('../services/seoResolver');
const { ok, fail } = require('../utils/response');

const router = Router();

// Lets the SPA keep the browser tab title in sync with the real SEO data on
// client-side route changes (no full page reload), using the exact same
// resolution logic the server uses to inject meta on first load - see
// seoResolver.js. Only title/description are actually consumed client-side
// today (see src/lib/usePageMeta.ts); the rest is returned for parity.
router.get('/', async (req, res, next) => {
  const path = req.query.path;
  if (typeof path !== 'string' || !path.startsWith('/')) {
    return fail(res, 'A "path" query parameter starting with / is required', 400, 'BAD_REQUEST');
  }
  try {
    const meta = await seoResolver.resolveForPath(path);
    return ok(res, meta);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
