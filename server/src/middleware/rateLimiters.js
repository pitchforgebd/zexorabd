const rateLimit = require('express-rate-limit');
const { fail } = require('../utils/response');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => fail(res, 'Too many login attempts. Please try again later.', 429, 'RATE_LIMITED'),
});

// Public contact/career forms — generous enough for a real visitor retrying
// a typo, tight enough to blunt basic spam bots. Full abuse hardening is
// Phase 11's job; this is a reasonable default in the meantime.
const formSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => fail(res, 'Too many submissions. Please try again later.', 429, 'RATE_LIMITED'),
});

// Broad defense-in-depth backstop across all /api routes, sitting behind the
// tighter per-route limiters above (login, form submissions). Generous
// enough not to bother a real admin or a browsing visitor, tight enough to
// blunt scraping/brute-force scripts that ignore the narrower limiters.
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => fail(res, 'Too many requests. Please slow down.', 429, 'RATE_LIMITED'),
});

module.exports = { loginLimiter, formSubmitLimiter, apiLimiter };
