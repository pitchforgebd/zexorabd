/**
 * Standard API response envelope used across every endpoint:
 *   success -> { success: true, data }
 *   error   -> { success: false, error: { message, code } }
 */

function ok(res, data = null, status = 200) {
  return res.status(status).json({ success: true, data });
}

function created(res, data = null) {
  return ok(res, data, 201);
}

function fail(res, message, status = 400, code = 'BAD_REQUEST') {
  return res.status(status).json({ success: false, error: { message, code } });
}

class ApiError extends Error {
  constructor(message, status = 400, code = 'BAD_REQUEST') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

module.exports = { ok, created, fail, ApiError };
