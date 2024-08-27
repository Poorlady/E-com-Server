const express = require('express');
const server = express();
const authRoutes = require('./routes/auth-routes');
const productRoutes = require('./routes/product-routes');
const { Connect } = require('./config/ConnectDB');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { corsOptions } = require('./config/cors');
const { handleRequestLog } = require('./middleware/requestLog');
const { handleErrLog } = require('./middleware/errorLog');

require('dotenv').config();

server.use(cors(corsOptions));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static('public'));

server.use(handleRequestLog);
server.use('/api', [authRoutes, productRoutes]);

server.use(handleErrLog);
server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: 'Oops!, something went wrong' });
});

Connect(() =>
  server.listen(process.env.SERVER_PORT, () => {
    console.log('App is up and running!');
  })
);
