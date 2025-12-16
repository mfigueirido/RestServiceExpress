module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;

  const payload = {
    status: 'error',
    statusCode: status,
    requestId: req.requestId || null,
    timestamp: new Date().toISOString(),
    errors: [
      {
        message: err.message || 'Server Error',
        code: err.code || null,
      },
    ],
  };

  res.status(status).json(payload);
};
