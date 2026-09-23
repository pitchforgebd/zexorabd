const { Router } = require('express');
const divisionsService = require('../services/divisions');
const { ok, fail } = require('../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const divisions = await divisionsService.listDivisions({ includeInactive: false });
    return ok(res, divisions);
  } catch (err) {
    return next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const division = await divisionsService.getDivision({ slug: req.params.slug, includeInactive: false });
    if (!division) return fail(res, 'Division not found', 404, 'NOT_FOUND');
    return ok(res, division);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
