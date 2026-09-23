const { Router } = require('express');
const { body, param } = require('express-validator');
const contactService = require('../../services/contactMessages');
const { ok, fail } = require('../../utils/response');
const validate = require('../../middleware/validate');

const router = Router();
const VALID_STATUSES = ['unread', 'read', 'archived'];

router.get('/', async (req, res, next) => {
  try {
    return ok(res, await contactService.listAll());
  } catch (err) {
    return next(err);
  }
});

router.patch(
  '/:id',
  validate([param('id').isInt(), body('status').isIn(VALID_STATUSES)]),
  async (req, res, next) => {
    try {
      const message = await contactService.getById(req.params.id);
      if (!message) return fail(res, 'Message not found', 404, 'NOT_FOUND');
      await contactService.updateStatus(req.params.id, req.body.status);
      return ok(res, await contactService.getById(req.params.id));
    } catch (err) {
      return next(err);
    }
  }
);

router.delete('/:id', param('id').isInt(), validate([]), async (req, res, next) => {
  try {
    const message = await contactService.getById(req.params.id);
    if (!message) return fail(res, 'Message not found', 404, 'NOT_FOUND');
    await contactService.remove(req.params.id);
    return ok(res, null);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
