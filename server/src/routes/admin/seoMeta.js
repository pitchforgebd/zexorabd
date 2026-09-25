const { Router } = require('express');
const { body, param } = require('express-validator');
const seoMetaService = require('../../services/seoMeta');
const { ok } = require('../../utils/response');
const validate = require('../../middleware/validate');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await seoMetaService.getAll());
  } catch (err) {
    return next(err);
  }
});

router.put(
  '/:pageKey',
  validate([
    param('pageKey').isString().trim().notEmpty(),
    body('title').optional({ nullable: true }).isString(),
    body('metaDescription').optional({ nullable: true }).isString(),
    body('ogImage').optional({ nullable: true }).isString(),
    body('canonicalUrl').optional({ nullable: true }).isString(),
  ]),
  async (req, res, next) => {
    try {
      const updated = await seoMetaService.set(req.params.pageKey, req.body);
      return ok(res, updated);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
