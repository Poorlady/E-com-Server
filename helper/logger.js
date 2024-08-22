const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// check if the  dir exist
// if not then create one
// write log to file using morgan

exports.logger = (message, filename) => {
  const formatedMessage = `${format(
    new Date(),
    'EEEEE, dd/MM/yyyy\tHH:mm:ss'
  )} | ${message}`;
  try {
    const logFolder = path.join(__dirname, '..', 'log');
    if (!fs.existsSync(path.join(__dirname, '..', 'log', filename))) {
      fs.mkdir(logFolder, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
    // const message = `[${req.hostname}] : ${req.method} - ${req.path}`;
    fs.writeFileSync(
      path.join(__dirname, '..', 'log', filename),
      formatedMessage
    );
  } catch (err) {
    console.log(err);
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
