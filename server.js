const express = require('express');
const server = express();
const authRoutes = require('./routes/auth-routes');
const { Connect } = require('./config/ConnectDB');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { logger } = require('./helper/logger');

require('dotenv').config();

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(logger);
server.use('/api', [authRoutes]);

server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: 'Oops!, something went wrong' });
});

Connect(() =>
  server.listen(3500, () => {
    console.log('App is up and running!');
  })
);
