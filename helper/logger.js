const fs = require('fs');
const path = require('path');

// check if the  dir exist
// if not then create one
// write log to file using morgan

exports.logger = async (req, res, next) => {
  console.log(req);
  try {
    const logFolder = path.join(__dirname, '..', 'log');
    if (!fs.existsSync()) {
      await fs.mkdir(logFolder, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
    const message = `[${req.hostname}] : ${req.method} - ${req.path}`;
    fs.writeFileSync(path.join(__dirname, '..', 'log', 'app-log.txt'), message);
    next();
  } catch (err) {
    next(err);
  }
};

// exports.streamFile = () => {
//   return fs.createWriteStream(
//     path.join(__dirname, '..', 'log', 'app-log.txt'),
//     {
//       flags: 'a+',
//     }
//   );
// };
