const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  if (mongoose.connection.readyState === 1)
    return next();

  res.status(503).json({ message: 'Database not ready yet. Please try again shortly.' });
};
