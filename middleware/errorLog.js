const { logger } = require('../helper/logger');

exports.handleErrLog = async (err, req, res, next) => {
  const message = `${err.name} - ${err.message}`;
  logger(message, 'error-log.txt');
  next();
};
