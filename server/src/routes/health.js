const { Router } = require('express');
const pool = require('../db/pool');
const { ok, fail } = require('../utils/response');

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'unreachable';
    return fail(res, 'Database unreachable', 503, 'DB_UNAVAILABLE');
  }

  return ok(res, {
    status: 'ok',
    db: dbStatus,
    time: new Date().toISOString(),
  });
});

module.exports = router;
