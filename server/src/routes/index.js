const { Router } = require('express');
const health = require('./health');

const router = Router();

router.use('/health', health);

// Phase 4+: divisions, products, suppliers
// Phase 5: news, photo-gallery, video-gallery
// Phase 6: site-settings
// Phase 7: pages/:pageKey/sections
// Phase 8: contact, career
// Phase 9: seo-meta, sitemap

module.exports = router;
