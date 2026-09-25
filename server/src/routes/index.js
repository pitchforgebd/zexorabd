const { Router } = require('express');
const health = require('./health');
const auth = require('./auth');
const divisions = require('./divisions');
const news = require('./news');
const photoGallery = require('./photoGallery');
const videoGallery = require('./videoGallery');
const siteSettings = require('./siteSettings');
const suppliers = require('./suppliers');
const pages = require('./pages');
const pageMeta = require('./pageMeta');
const contact = require('./contact');
const career = require('./career');
const adminDivisions = require('./admin/divisions');
const adminNews = require('./admin/news');
const adminPhotoGallery = require('./admin/photoGallery');
const adminVideoGallery = require('./admin/videoGallery');
const adminSiteSettings = require('./admin/siteSettings');
const adminSuppliers = require('./admin/suppliers');
const adminPages = require('./admin/pages');
const adminContactMessages = require('./admin/contactMessages');
const adminCareerApplications = require('./admin/careerApplications');
const adminSeoMeta = require('./admin/seoMeta');
const requireAuth = require('../middleware/requireAuth');

const router = Router();

router.use('/health', health);
router.use('/auth', auth);

// Public
router.use('/divisions', divisions);
router.use('/news', news);
router.use('/photo-gallery', photoGallery);
router.use('/video-gallery', videoGallery);
router.use('/site-settings', siteSettings);
router.use('/suppliers', suppliers);
router.use('/pages', pages);
router.use('/page-meta', pageMeta);
router.use('/contact', contact);
router.use('/career', career);

// Admin (session-authenticated)
router.use('/admin/divisions', requireAuth, adminDivisions);
router.use('/admin/news', requireAuth, adminNews);
router.use('/admin/photo-gallery', requireAuth, adminPhotoGallery);
router.use('/admin/video-gallery', requireAuth, adminVideoGallery);
router.use('/admin/site-settings', requireAuth, adminSiteSettings);
router.use('/admin/suppliers', requireAuth, adminSuppliers);
router.use('/admin/pages', requireAuth, adminPages);
router.use('/admin/contact-messages', requireAuth, adminContactMessages);
router.use('/admin/career-applications', requireAuth, adminCareerApplications);
router.use('/admin/seo-meta', requireAuth, adminSeoMeta);

module.exports = router;
