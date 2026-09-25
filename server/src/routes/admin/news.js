const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { body, param } = require('express-validator');
const newsService = require('../../services/news');
const { ok, created, fail, ApiError } = require('../../utils/response');
const validate = require('../../middleware/validate');
const { createImageUpload, publicPathFor, optimizeImage } = require('../../middleware/imageUpload');
const config = require('../../config');

const router = Router();
const coverUpload = createImageUpload('news');
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function deleteLocalUploadFile(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const filePath = path.join(config.uploadsDir, publicPath.replace(/^\/uploads\//, ''));
  fs.unlink(filePath, () => {});
}

async function loadPostOr404(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, 'Invalid post id', 400, 'BAD_REQUEST');
  const post = await newsService.getById(id);
  if (!post) return fail(res, 'News post not found', 404, 'NOT_FOUND');
  req.post = post;
  return next();
}

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await newsService.listAll());
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', param('id').isInt(), validate([]), loadPostOr404, (req, res) => ok(res, req.post));

router.post(
  '/',
  validate([
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('slug').isString().trim().matches(SLUG_RE).withMessage('Slug must be lowercase letters, numbers, and hyphens only'),
  ]),
  async (req, res, next) => {
    try {
      if (await newsService.slugExists(req.body.slug)) {
        return fail(res, 'A post with this slug already exists', 409, 'SLUG_TAKEN');
      }
      const id = await newsService.create(req.body);
      return created(res, await newsService.getById(id));
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
    body('slug').isString().trim().matches(SLUG_RE).withMessage('Slug must be lowercase letters, numbers, and hyphens only'),
  ]),
  loadPostOr404,
  async (req, res, next) => {
    try {
      if (await newsService.slugExists(req.body.slug, req.post.id)) {
        return fail(res, 'A post with this slug already exists', 409, 'SLUG_TAKEN');
      }
      // Auto-set publishedAt the first time a post is published (the create
      // endpoint does this too); preserve it on later edits/unpublishing
      // rather than requiring the admin UI to manage a date field.
      const publishedAt = req.body.isPublished ? req.post.publishedAt || new Date() : req.post.publishedAt;
      await newsService.update(req.post.id, { ...req.body, publishedAt });
      return ok(res, await newsService.getById(req.post.id));
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', param('id').isInt(), validate([]), loadPostOr404, async (req, res, next) => {
  try {
    deleteLocalUploadFile(req.post.coverImage);
    await newsService.remove(req.post.id);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

router.post('/:id/cover-image', param('id').isInt(), validate([]), loadPostOr404, (req, res, next) => {
  coverUpload.single('image')(req, res, async (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.file) return fail(res, 'No image file provided', 400, 'BAD_REQUEST');
    try {
      await optimizeImage(req.file.path);
      const publicPath = publicPathFor('news', req.file.filename);
      deleteLocalUploadFile(req.post.coverImage);
      await newsService.updateCoverImage(req.post.id, publicPath);
      return ok(res, { coverImage: publicPath });
    } catch (dbErr) {
      return next(dbErr);
    }
  });
});

module.exports = router;
