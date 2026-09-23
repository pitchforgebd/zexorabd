const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { body, param } = require('express-validator');
const careerService = require('../../services/careerApplications');
const { ok, fail } = require('../../utils/response');
const validate = require('../../middleware/validate');
const config = require('../../config');

const router = Router();
const VALID_STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await careerService.listAll());
  } catch (err) {
    return next(err);
  }
});

router.patch(
  '/:id',
  validate([param('id').isInt(), body('status').isIn(VALID_STATUSES)]),
  async (req, res, next) => {
    try {
      const application = await careerService.getById(req.params.id);
      if (!application) return fail(res, 'Application not found', 404, 'NOT_FOUND');
      await careerService.updateStatus(req.params.id, req.body.status);
      return ok(res, await careerService.getById(req.params.id));
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', param('id').isInt(), validate([]), async (req, res, next) => {
  try {
    const application = await careerService.getById(req.params.id);
    if (!application) return fail(res, 'Application not found', 404, 'NOT_FOUND');
    await careerService.remove(req.params.id);
    if (application.cvFilePath && application.cvFilePath.startsWith('/uploads/')) {
      const filePath = path.join(config.uploadsDir, application.cvFilePath.replace(/^\/uploads\//, ''));
      fs.unlink(filePath, () => {});
    }
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
