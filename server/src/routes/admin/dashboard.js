const { Router } = require('express');
const dashboardService = require('../../services/dashboard');
const { ok } = require('../../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await dashboardService.getSummary());
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
