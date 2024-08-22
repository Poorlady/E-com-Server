const { logger } = require('../helper/logger');

exports.handleRequestLog = async (req, res, next) => {
  const message = `[${req.method}] : ${req.path} - ${req.headers.origin}`;
  logger(message, 'request-log.txt');
  next();
};
