const { Router } = require('express');
const health = require('./health');
const auth = require('./auth');
const divisions = require('./divisions');
const adminDivisions = require('./admin/divisions');
const requireAuth = require('../middleware/requireAuth');

const router = Router();

router.use('/health', health);
router.use('/auth', auth);

// Public
router.use('/divisions', divisions);

// Admin (session-authenticated)
router.use('/admin/divisions', requireAuth, adminDivisions);

// Phase 5: news, photo-gallery, video-gallery
// Phase 6: site-settings
// Phase 7: pages/:pageKey/sections
// Phase 8: contact, career
// Phase 9: seo-meta, sitemap

module.exports = router;
