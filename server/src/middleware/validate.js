const { validationResult } = require('express-validator');
const { fail } = require('../utils/response');

/**
 * Wrap an array of express-validator chains. Runs them, then rejects with a
 * 422 in the standard envelope if any failed. Usage:
 *   router.post('/thing', validate([body('name').notEmpty()]), handler)
 */
function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const result = validationResult(req);
      if (result.isEmpty()) return next();
      const first = result.array()[0];
      return fail(res, first.msg, 422, 'VALIDATION_ERROR');
    },
  ];
}

module.exports = validate;
