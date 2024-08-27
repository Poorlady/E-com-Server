const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// check if the  dir exist
// if not then create one
// write log to file using morgan

exports.logger = async (message, filename) => {
  const formatedMessage = `${format(
    new Date(),
    'EEEEE, dd/MM/yyyy\tHH:mm:ss'
  )} | ${message} \n`;
  try {
    const logFolder = path.join(__dirname, '..', 'log');
    if (!fs.existsSync(path.join(__dirname, '..', 'log', filename))) {
      fs.mkdir(logFolder, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
    // const message = `[${req.hostname}] : ${req.method} - ${req.path}`;
    fs.appendFile(
      path.join(__dirname, '..', 'log', filename),
      formatedMessage,
      (err) => {
        if (err) throw err;
      }
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
