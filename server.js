const express = require('express');
const server = express();
const authRoutes = require('./routes/auth-routes');
const { Connect } = require('./config/ConnectDB');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const { logger } = require('./helper/logger');
const cors = require('cors');
const { corsOptions } = require('./config/cors');
const { handleRequestLog } = require('./middleware/requestLog');
const { handleErrLog } = require('./middleware/errorLog');

require('dotenv').config();

server.use(cors(corsOptions));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.use(handleRequestLog);
server.use('/api', [authRoutes]);

server.use(handleErrLog);
server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: 'Oops!, something went wrong' });
});

Connect(() =>
  server.listen(3500, () => {
    console.log('App is up and running!');
  })
);
