const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const pool = require('../db/pool');
const { ok, fail } = require('../utils/response');
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');
const { loginLimiter } = require('../middleware/rateLimiters');

const router = Router();

function toPublicUser(row) {
  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

router.post(
  '/login',
  loginLimiter,
  validate([
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').isString().isLength({ min: 1 }).withMessage('Password is required'),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const [rows] = await pool.query(
        'SELECT id, name, email, password_hash, role, is_active FROM admin_users WHERE email = :email LIMIT 1',
        { email }
      );
      const user = rows[0];

      // Constant-shape response whether the email exists or not, to avoid
      // leaking which emails are registered.
      const invalidMsg = 'Invalid email or password';
      if (!user || !user.is_active) return fail(res, invalidMsg, 401, 'INVALID_CREDENTIALS');

      const matches = await bcrypt.compare(password, user.password_hash);
      if (!matches) return fail(res, invalidMsg, 401, 'INVALID_CREDENTIALS');

      await new Promise((resolve, reject) => {
        req.session.regenerate((err) => (err ? reject(err) : resolve()));
      });

      req.session.userId = user.id;
      req.session.role = user.role;

      await pool.query('UPDATE admin_users SET last_login_at = NOW() WHERE id = :id', { id: user.id });

      return ok(res, toPublicUser(user));
    } catch (err) {
      return next(err);
    }
  }
);

router.post('/logout', (req, res, next) => {
  if (!req.session) return ok(res, null);
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('zexora_sid');
    return ok(res, null);
  });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, is_active FROM admin_users WHERE id = :id LIMIT 1',
      { id: req.session.userId }
    );
    const user = rows[0];
    if (!user || !user.is_active) {
      req.session.destroy(() => {});
      return fail(res, 'Session is no longer valid', 401, 'UNAUTHENTICATED');
    }
    return ok(res, toPublicUser(user));
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
