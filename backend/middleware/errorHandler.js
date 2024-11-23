// middleware/errorHandler.js
const logger = require('../util/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error details
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (err.stack) {
    logger.error(err.stack);
  }

  // Respond to the client with a consistent error format
  res.status(err.statusCode || 500).json({
    message: 'Something went wrong!'
  });
};

module.exports = errorHandler;
