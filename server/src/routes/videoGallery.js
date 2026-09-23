const { Router } = require('express');
const videoGalleryService = require('../services/videoGallery');
const { ok } = require('../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const videos = await videoGalleryService.listPublished();
    return ok(res, videos);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
