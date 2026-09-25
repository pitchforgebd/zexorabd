const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { body, param } = require('express-validator');
const videoGalleryService = require('../../services/videoGallery');
const { ok, created, fail, ApiError } = require('../../utils/response');
const validate = require('../../middleware/validate');
const { createImageUpload, publicPathFor, optimizeImage } = require('../../middleware/imageUpload');
const config = require('../../config');

const router = Router();
const thumbnailUpload = createImageUpload('video-gallery');

function deleteLocalUploadFile(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const filePath = path.join(config.uploadsDir, publicPath.replace(/^\/uploads\//, ''));
  fs.unlink(filePath, () => {});
}

async function loadVideoOr404(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, 'Invalid video id', 400, 'BAD_REQUEST');
  const video = await videoGalleryService.getById(id);
  if (!video) return fail(res, 'Video not found', 404, 'NOT_FOUND');
  req.video = video;
  return next();
}

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await videoGalleryService.listAll());
  } catch (err) {
    return next(err);
  }
});

// Registered before PATCH /:id-style routes below — avoids Express matching
// "reorder" as an :id.
router.patch('/reorder', validate([body('order').isArray({ min: 1 })]), async (req, res, next) => {
  try {
    await videoGalleryService.reorder(req.body.order);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

router.post(
  '/',
  validate([
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('videoUrl').isURL().withMessage('A valid video URL is required'),
  ]),
  async (req, res, next) => {
    try {
      const sortOrder = await videoGalleryService.nextSortOrder();
      const id = await videoGalleryService.create({ ...req.body, sortOrder });
      return created(res, await videoGalleryService.getById(id));
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  '/:id',
  validate([
    param('id').isInt(),
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('videoUrl').isURL().withMessage('A valid video URL is required'),
  ]),
  loadVideoOr404,
  async (req, res, next) => {
    try {
      await videoGalleryService.update(req.video.id, req.body);
      return ok(res, await videoGalleryService.getById(req.video.id));
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', param('id').isInt(), validate([]), loadVideoOr404, async (req, res, next) => {
  try {
    deleteLocalUploadFile(req.video.thumbnail);
    await videoGalleryService.remove(req.video.id);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

router.post('/:id/thumbnail', param('id').isInt(), validate([]), loadVideoOr404, (req, res, next) => {
  thumbnailUpload.single('image')(req, res, async (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.file) return fail(res, 'No image file provided', 400, 'BAD_REQUEST');
    try {
      await optimizeImage(req.file.path);
      const publicPath = publicPathFor('video-gallery', req.file.filename);
      deleteLocalUploadFile(req.video.thumbnail);
      await videoGalleryService.updateThumbnail(req.video.id, publicPath);
      return ok(res, { thumbnail: publicPath });
    } catch (dbErr) {
      return next(dbErr);
    }
  });
});

module.exports = router;
