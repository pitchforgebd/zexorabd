const { fail } = require('../utils/response');

module.exports = function notFound(req, res) {
  fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND');
};
