const config = require('../config');
const { ApiError } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  const isApiError = err instanceof ApiError;
  const status = isApiError ? err.status : err.status || 500;
  const code = isApiError ? err.code : err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Unexpected error';

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    success: false,
    error: {
      message: status >= 500 && config.isProduction ? 'Something went wrong. Please try again later.' : message,
      code,
    },
  });
};
