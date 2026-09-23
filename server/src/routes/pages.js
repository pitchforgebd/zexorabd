const { Router } = require('express');
const pageSectionsService = require('../services/pageSections');
const { ok } = require('../utils/response');

const router = Router();

router.get('/:pageKey/sections', async (req, res, next) => {
  try {
    const sections = await pageSectionsService.listForPage(req.params.pageKey, { includeHidden: false });
    return ok(res, sections);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
