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

router.put(
  '/account',
  requireAuth,
  loginLimiter,
  validate([
    body('currentPassword').isString().isLength({ min: 1 }).withMessage('Current password is required'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('newPassword')
      .optional({ checkFalsy: true })
      .isString()
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ]),
  async (req, res, next) => {
    try {
      const { currentPassword, email, newPassword } = req.body;
      if (!email && !newPassword) {
        return fail(res, 'Provide a new email and/or a new password', 422, 'VALIDATION_ERROR');
      }

      const [rows] = await pool.query(
        'SELECT id, name, email, password_hash, role FROM admin_users WHERE id = :id LIMIT 1',
        { id: req.session.userId }
      );
      const user = rows[0];
      if (!user) {
        req.session.destroy(() => {});
        return fail(res, 'Session is no longer valid', 401, 'UNAUTHENTICATED');
      }

      const matches = await bcrypt.compare(currentPassword, user.password_hash);
      if (!matches) return fail(res, 'Current password is incorrect', 401, 'INVALID_CREDENTIALS');

      const updates = {};
      if (email && email !== user.email) {
        const [existing] = await pool.query(
          'SELECT id FROM admin_users WHERE email = :email AND id != :id LIMIT 1',
          { email, id: user.id }
        );
        if (existing[0]) return fail(res, 'That email is already in use by another account', 409, 'EMAIL_TAKEN');
        updates.email = email;
      }
      if (newPassword) {
        updates.password_hash = await bcrypt.hash(newPassword, 12);
      }

      if (Object.keys(updates).length > 0) {
        const setClause = Object.keys(updates)
          .map((key) => `${key} = :${key}`)
          .join(', ');
        await pool.query(`UPDATE admin_users SET ${setClause} WHERE id = :id`, { ...updates, id: user.id });
      }

      const [updatedRows] = await pool.query(
        'SELECT id, name, email, role FROM admin_users WHERE id = :id LIMIT 1',
        { id: user.id }
      );
      return ok(res, toPublicUser(updatedRows[0]));
    } catch (err) {
      return next(err);
    }
  }
);

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
