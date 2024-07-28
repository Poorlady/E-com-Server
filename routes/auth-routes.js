const express = require('express');
const {
  handleLogin,
  handleRegister,
  handleLogout,
  handleRefreshToken,
} = require('../controllers/auth-controller');
const router = express.Router();

router.post('/auth-register', handleRegister);

router.post('/auth-login', handleLogin);

router.post('/auth-logout', handleLogout);

router.post('/auth-refresh', handleRefreshToken);

module.exports = router;
