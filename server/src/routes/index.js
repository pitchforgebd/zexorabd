const { Router } = require('express');
const health = require('./health');
const auth = require('./auth');
const divisions = require('./divisions');
const news = require('./news');
const photoGallery = require('./photoGallery');
const videoGallery = require('./videoGallery');
const adminDivisions = require('./admin/divisions');
const adminNews = require('./admin/news');
const adminPhotoGallery = require('./admin/photoGallery');
const adminVideoGallery = require('./admin/videoGallery');
const requireAuth = require('../middleware/requireAuth');

const router = Router();

router.use('/health', health);
router.use('/auth', auth);

// Public
router.use('/divisions', divisions);
router.use('/news', news);
router.use('/photo-gallery', photoGallery);
router.use('/video-gallery', videoGallery);

// Admin (session-authenticated)
router.use('/admin/divisions', requireAuth, adminDivisions);
router.use('/admin/news', requireAuth, adminNews);
router.use('/admin/photo-gallery', requireAuth, adminPhotoGallery);
router.use('/admin/video-gallery', requireAuth, adminVideoGallery);

// Phase 6: site-settings
// Phase 7: pages/:pageKey/sections
// Phase 8: contact, career
// Phase 9: seo-meta, sitemap

module.exports = router;
