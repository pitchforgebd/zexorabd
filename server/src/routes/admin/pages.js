const { Router } = require('express');
const { body, param } = require('express-validator');
const pageSectionsService = require('../../services/pageSections');
const { ok } = require('../../utils/response');
const validate = require('../../middleware/validate');

const router = Router();

router.get('/:pageKey/sections', param('pageKey').isString(), validate([]), async (req, res, next) => {
  try {
    const sections = await pageSectionsService.listForPage(req.params.pageKey, { includeHidden: true });
    return ok(res, sections);
  } catch (err) {
    return next(err);
  }
});

router.put(
  '/:pageKey/sections',
  validate([param('pageKey').isString(), body('sections').isArray({ min: 1 })]),
  async (req, res, next) => {
    try {
      await pageSectionsService.replaceForPage(req.params.pageKey, req.body.sections);
      return ok(res, await pageSectionsService.listForPage(req.params.pageKey, { includeHidden: true }));
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
