const express = require('express');
const server = express();
const authRoutes = require('./routes/auth-routes');
const { Connect } = require('./config/ConnectDB');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use('/api', [authRoutes]);

Connect(() =>
  server.listen(3500, () => {
    console.log('App is up and running!');
  })
);
