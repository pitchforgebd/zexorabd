const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { body, param } = require('express-validator');
const suppliersService = require('../../services/suppliers');
const { ok, fail, ApiError } = require('../../utils/response');
const validate = require('../../middleware/validate');
const { createImageUpload, publicPathFor } = require('../../middleware/imageUpload');
const config = require('../../config');

const router = Router();
const upload = createImageUpload('suppliers');

function deleteLocalUploadFile(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const filePath = path.join(config.uploadsDir, publicPath.replace(/^\/uploads\//, ''));
  fs.unlink(filePath, () => {});
}

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await suppliersService.listAll());
  } catch (err) {
    return next(err);
  }
});

router.post('/upload', (req, res, next) => {
  upload.array('images', 30)(req, res, async (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.files || req.files.length === 0) return fail(res, 'No image files provided', 400, 'BAD_REQUEST');
    try {
      let order = await suppliersService.nextSortOrder();
      for (const file of req.files) {
        await suppliersService.insert({ imagePath: publicPathFor('suppliers', file.filename), sortOrder: order++ });
      }
      return ok(res, await suppliersService.listAll());
    } catch (dbErr) {
      return next(dbErr);
    }
  });
});

// Registered before PATCH /:id — otherwise Express would match "reorder" as an :id.
router.patch('/reorder', validate([body('order').isArray({ min: 1 })]), async (req, res, next) => {
  try {
    await suppliersService.reorder(req.body.order);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

router.patch(
  '/:id',
  validate([param('id').isInt(), body('isActive').optional().isBoolean()]),
  async (req, res, next) => {
    try {
      const supplier = await suppliersService.getById(req.params.id);
      if (!supplier) return fail(res, 'Supplier not found', 404, 'NOT_FOUND');
      await suppliersService.updateMeta(req.params.id, {
        altText: req.body.altText ?? supplier.altText,
        isActive: req.body.isActive ?? supplier.isActive,
      });
      return ok(res, await suppliersService.getById(req.params.id));
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', param('id').isInt(), validate([]), async (req, res, next) => {
  try {
    const supplier = await suppliersService.getById(req.params.id);
    if (!supplier) return fail(res, 'Supplier not found', 404, 'NOT_FOUND');
    await suppliersService.remove(req.params.id);
    deleteLocalUploadFile(supplier.url);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
