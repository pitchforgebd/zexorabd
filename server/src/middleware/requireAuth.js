const { fail } = require('../utils/response');

module.exports = function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return fail(res, 'Authentication required', 401, 'UNAUTHENTICATED');
  }
  return next();
};
