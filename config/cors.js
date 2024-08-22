const whiteList = require('../data/whitelist');

exports.corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true); // reflect (enable) the requested origin in the CORS response
    } else {
      callback(new Error('not allowed by CORS')); // disable CORS for this request
    }
  },
  optionsSuccessStatus: 200,
};
