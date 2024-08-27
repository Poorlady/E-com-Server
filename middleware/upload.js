const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const allowedFiles = ['jpg', 'jpeg', 'png'];

const upload = multer({
  limits: 800000,
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let pathDir = path.join('public', 'uploads', req.dir.join('/'));
      fs.mkdirSync(pathDir, { recursive: true });
      cb(null, pathDir);
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname);
      cb(null, req.fileName + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (allowedFiles.includes(file.mimetype.split('/')[1])) cb(null, true);
    else cb(null, false);
  },
});

module.exports = upload;
