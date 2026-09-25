const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { body, param } = require('express-validator');
const pool = require('../../db/pool');
const { withTransaction } = require('../../db/transaction');
const divisionsService = require('../../services/divisions');
const { ok, created, fail, ApiError } = require('../../utils/response');
const validate = require('../../middleware/validate');
const { createImageUpload, publicPathFor, optimizeImage } = require('../../middleware/imageUpload');
const config = require('../../config');

const router = Router();
const coverUpload = createImageUpload('divisions');
const galleryUpload = createImageUpload('divisions/gallery');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function deleteLocalUploadFile(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return; // external/legacy URL, nothing to unlink
  const filePath = path.join(config.uploadsDir, publicPath.replace(/^\/uploads\//, ''));
  fs.unlink(filePath, () => {}); // best-effort; ignore if already gone
}

async function loadDivisionOr404(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return fail(res, 'Invalid division id', 400, 'BAD_REQUEST');
  const division = await divisionsService.getDivision({ id, includeInactive: true });
  if (!division) return fail(res, 'Division not found', 404, 'NOT_FOUND');
  req.division = division;
  return next();
}

router.get('/', async (req, res, next) => {
  try {
    const divisions = await divisionsService.listDivisions({ includeInactive: true });
    return ok(res, divisions);
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', param('id').isInt(), validate([]), loadDivisionOr404, (req, res) => ok(res, req.division));

router.post(
  '/',
  validate([
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('slug').isString().trim().matches(SLUG_RE).withMessage('Slug must be lowercase letters, numbers, and hyphens only'),
  ]),
  async (req, res, next) => {
    try {
      const { name, slug } = req.body;
      if (await divisionsService.slugExists(slug)) {
        return fail(res, 'A division with this slug already exists', 409, 'SLUG_TAKEN');
      }
      const id = await divisionsService.createDivision({ name, slug });
      const division = await divisionsService.getDivision({ id, includeInactive: true });
      return created(res, division);
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  '/:id',
  validate([
    param('id').isInt(),
    body('name').isString().trim().notEmpty().withMessage('Name is required'),
    body('slug').isString().trim().matches(SLUG_RE).withMessage('Slug must be lowercase letters, numbers, and hyphens only'),
    body('products').optional().isArray(),
  ]),
  loadDivisionOr404,
  async (req, res, next) => {
    try {
      const id = req.division.id;
      if (await divisionsService.slugExists(req.body.slug, id)) {
        return fail(res, 'A division with this slug already exists', 409, 'SLUG_TAKEN');
      }

      await withTransaction(async (conn) => {
        await divisionsService.updateDivisionFields(conn, id, req.body);
        await divisionsService.replaceProductTree(conn, id, req.body.products || []);
      });

      const division = await divisionsService.getDivision({ id, includeInactive: true });
      return ok(res, division);
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', param('id').isInt(), validate([]), loadDivisionOr404, async (req, res, next) => {
  try {
    deleteLocalUploadFile(req.division.coverImage);
    for (const img of req.division.galleryImages) {
      deleteLocalUploadFile(img.url);
    }
    await divisionsService.deleteDivision(req.division.id);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

router.patch(
  '/reorder',
  validate([body('order').isArray({ min: 1 })]),
  async (req, res, next) => {
    try {
      await divisionsService.reorderDivisions(req.body.order);
      return ok(res, null);
    } catch (err) {
      return next(err);
    }
  }
);

router.post('/:id/cover-image', param('id').isInt(), validate([]), loadDivisionOr404, (req, res, next) => {
  coverUpload.single('image')(req, res, async (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.file) return fail(res, 'No image file provided', 400, 'BAD_REQUEST');
    try {
      await optimizeImage(req.file.path);
      const publicPath = publicPathFor('divisions', req.file.filename);
      await pool.query('UPDATE divisions SET cover_image = :coverImage WHERE id = :id', {
        coverImage: publicPath,
        id: req.division.id,
      });
      return ok(res, { coverImage: publicPath });
    } catch (dbErr) {
      return next(dbErr);
    }
  });
});

router.post('/:id/gallery-images', param('id').isInt(), validate([]), loadDivisionOr404, (req, res, next) => {
  galleryUpload.array('images', 20)(req, res, async (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.files || req.files.length === 0) return fail(res, 'No image files provided', 400, 'BAD_REQUEST');
    try {
      const [[{ maxOrder }]] = await pool.query(
        'SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM division_gallery_images WHERE division_id = :id',
        { id: req.division.id }
      );
      let order = maxOrder + 1;
      for (const file of req.files) {
        await optimizeImage(file.path);
        const publicPath = publicPathFor('divisions/gallery', file.filename);
        await pool.query(
          'INSERT INTO division_gallery_images (division_id, image_path, sort_order) VALUES (:id, :imagePath, :sortOrder)',
          { id: req.division.id, imagePath: publicPath, sortOrder: order++ }
        );
      }
      const division = await divisionsService.getDivision({ id: req.division.id, includeInactive: true });
      return ok(res, division.galleryImages);
    } catch (dbErr) {
      return next(dbErr);
    }
  });
});

router.delete(
  '/:id/gallery-images/:imageId',
  param('id').isInt(),
  param('imageId').isInt(),
  validate([]),
  loadDivisionOr404,
  async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        'SELECT image_path FROM division_gallery_images WHERE id = :imageId AND division_id = :id',
        { imageId: req.params.imageId, id: req.division.id }
      );
      const image = rows[0];
      if (!image) return fail(res, 'Gallery image not found', 404, 'NOT_FOUND');

      await pool.query('DELETE FROM division_gallery_images WHERE id = :imageId', { imageId: req.params.imageId });
      deleteLocalUploadFile(image.image_path);

      return ok(res, null);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
