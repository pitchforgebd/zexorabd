const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { body, param } = require('express-validator');
const photoGalleryService = require('../../services/photoGallery');
const { ok, fail, ApiError } = require('../../utils/response');
const validate = require('../../middleware/validate');
const { createImageUpload, publicPathFor, optimizeImage } = require('../../middleware/imageUpload');
const config = require('../../config');

const router = Router();
const upload = createImageUpload('photo-gallery');

function deleteLocalUploadFile(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const filePath = path.join(config.uploadsDir, publicPath.replace(/^\/uploads\//, ''));
  fs.unlink(filePath, () => {});
}

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await photoGalleryService.listAll());
  } catch (err) {
    return next(err);
  }
});

router.post('/upload', (req, res, next) => {
  upload.array('images', 30)(req, res, async (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.files || req.files.length === 0) return fail(res, 'No image files provided', 400, 'BAD_REQUEST');
    try {
      let order = await photoGalleryService.nextSortOrder();
      for (const file of req.files) {
        await optimizeImage(file.path);
        await photoGalleryService.insert({
          imagePath: publicPathFor('photo-gallery', file.filename),
          sortOrder: order++,
        });
      }
      return ok(res, await photoGalleryService.listAll());
    } catch (dbErr) {
      return next(dbErr);
    }
  });
});

// Registered before PATCH /:id — otherwise Express would match "reorder" as an :id.
router.patch('/reorder', validate([body('order').isArray({ min: 1 })]), async (req, res, next) => {
  try {
    await photoGalleryService.reorder(req.body.order);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

router.patch(
  '/:id',
  validate([param('id').isInt(), body('isPublished').optional().isBoolean()]),
  async (req, res, next) => {
    try {
      const image = await photoGalleryService.getById(req.params.id);
      if (!image) return fail(res, 'Image not found', 404, 'NOT_FOUND');
      await photoGalleryService.updateMeta(req.params.id, {
        caption: req.body.caption ?? image.caption,
        isPublished: req.body.isPublished ?? image.isPublished,
      });
      return ok(res, await photoGalleryService.getById(req.params.id));
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', param('id').isInt(), validate([]), async (req, res, next) => {
  try {
    const image = await photoGalleryService.getById(req.params.id);
    if (!image) return fail(res, 'Image not found', 404, 'NOT_FOUND');
    await photoGalleryService.remove(req.params.id);
    deleteLocalUploadFile(image.url);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
