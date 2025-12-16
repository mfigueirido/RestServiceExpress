const { randomUUID } = require('crypto');

module.exports = (req, res, next) => {
  try {
    req.requestId = req.headers['x-request-id'] || randomUUID();
  } catch (e) {
    req.requestId = `${Date.now()}`;
  }
  res.setHeader('X-Request-Id', req.requestId);
  next();
};
