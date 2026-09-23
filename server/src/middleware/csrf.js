const crypto = require('crypto');
const config = require('../config');
const { fail } = require('../utils/response');

const COOKIE_NAME = 'csrf_token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Double-submit-cookie CSRF protection. A non-httpOnly cookie carries a
 * random token; the SPA must echo it back in the X-CSRF-Token header on any
 * state-changing request. A cross-site page can trigger the request (cookie
 * auto-attaches) but can't read the cookie to produce a matching header.
 */
module.exports = function csrf(req, res, next) {
  let token = req.cookies[COOKIE_NAME];
  if (!token) {
    token = crypto.randomBytes(24).toString('hex');
    res.cookie(COOKIE_NAME, token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: config.isProduction,
      path: '/',
    });
  }
  req.csrfToken = token;

  if (SAFE_METHODS.has(req.method)) return next();

  const header = req.headers['x-csrf-token'];
  if (!header || header !== token) {
    return fail(res, 'Invalid or missing CSRF token', 403, 'CSRF_INVALID');
  }
  return next();
};
