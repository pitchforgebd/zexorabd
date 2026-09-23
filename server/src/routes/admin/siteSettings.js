const { Router } = require('express');
const { body, param } = require('express-validator');
const siteSettingsService = require('../../services/siteSettings');
const { ok, fail, ApiError } = require('../../utils/response');
const validate = require('../../middleware/validate');
const { createImageUpload, publicPathFor } = require('../../middleware/imageUpload');

const router = Router();
const upload = createImageUpload('homepage');

// Generic image upload for homepage settings content (e.g. hero slide
// images) that isn't tied to a specific existing record the way division
// cover images or news cover images are.
router.post('/upload-image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return next(new ApiError(err.message, 400, 'UPLOAD_ERROR'));
    if (!req.file) return fail(res, 'No image file provided', 400, 'BAD_REQUEST');
    return ok(res, { url: publicPathFor('homepage', req.file.filename) });
  });
});

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await siteSettingsService.getAll());
  } catch (err) {
    return next(err);
  }
});

router.put(
  '/:key',
  validate([param('key').isString().trim().notEmpty(), body('value').exists()]),
  async (req, res, next) => {
    try {
      await siteSettingsService.set(req.params.key, req.body.value);
      return ok(res, await siteSettingsService.getAll());
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
