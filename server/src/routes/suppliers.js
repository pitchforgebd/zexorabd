const { Router } = require('express');
const suppliersService = require('../services/suppliers');
const { ok } = require('../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await suppliersService.listActive());
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
