const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const allowedFiles = ['jpg', 'jpeg', 'png'];

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let subDir = file.fieldname;
      let pathDir = path.join('public', 'uploads', subDir);
      fs.mkdirSync(pathDir, { recursive: true });
      cb(null, pathDir);
    },
    filename: function (req, file, cb) {
      let fileName = uuidv4();
      let ext = path.extname(file.originalname);
      cb(null, fileName + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (allowedFiles.includes(file.mimetype.split('/')[1])) cb(null, true);
    else cb(null, false);
  },
});

module.exports = upload;
