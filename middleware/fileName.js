const { v4: uuidv4 } = require('uuid');

const handleDirname = (req, res, next) => {
  console.log(req.files);
  let fileName = uuidv4();
  req.fileName = fileName;
  req.dir = fileName.split('-');
  next();
};

module.exports = handleDirname;
