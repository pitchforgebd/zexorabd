const rateLimit = require('express-rate-limit');
const { fail } = require('../utils/response');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => fail(res, 'Too many login attempts. Please try again later.', 429, 'RATE_LIMITED'),
});

module.exports = { loginLimiter };
