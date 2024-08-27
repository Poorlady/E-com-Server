const fs = require('fs');
const path = require('path');

exports.pathCreator = (path) => {
  return path
    .split('/')
    .filter((path) => path !== 'public')
    .join('/');
};

exports.handleDeleteDir = async (dir) => {
  await fs.rm(
    path.join('public', 'uploads', dir),
    { recursive: true, force: true },
    (err) => {
      if (err) throw new Error(err);
    }
  );
};
