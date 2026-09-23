const { Router } = require('express');
const photoGalleryService = require('../services/photoGallery');
const { ok } = require('../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const images = await photoGalleryService.listPublished();
    return ok(res, images);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
