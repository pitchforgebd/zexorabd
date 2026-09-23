const { Router } = require('express');
const siteSettingsService = require('../services/siteSettings');
const { ok } = require('../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await siteSettingsService.getAll());
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
