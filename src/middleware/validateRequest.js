const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map(err => ({
    field: err.param,
    message: err.msg,
    code: `${String(err.param).toUpperCase()}_INVALID`,
  }));

  const payload = {
    status: 'error',
    statusCode: 400,
    requestId: req.requestId || null,
    timestamp: new Date().toISOString(),
    errors: formatted,
  };

  return res.status(400).json(payload);
};
