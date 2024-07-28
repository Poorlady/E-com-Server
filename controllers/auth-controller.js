const jwt = require('jsonwebtoken');
const UserModel = require('../models/Users');
const bcrypt = require('bcrypt');

exports.handleRegister = async (req, res, next) => {
  // 1. get email and password
  const { email, password } = req.body;
  // 2. if not all return error required
  if (!email || !password)
    res.status(400).json({ message: 'Email and Password is required!' });
  // 3. find email
  const userFound = await UserModel.findOne({ email }).exec();
  // 4. if existed than return error email used
  if (userFound) res.status(400).json({ message: 'User exist' });
  // 5. create refresh token and access token
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = {
    email,
    password: hashedPassword,
  };

  try {
    const result = await UserModel.create(newUser);
    // return user
    res.status(200).json({
      message: 'User successfuly created!',
      userData: { email: result.email, roles: result.roles },
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.handleLogin = async (req, res, next) => {
  // 1. get the email and password
  const { email, password } = req.body;
  //   console.log(email, password);
  // 2. check if the email and password there
  // if not return 400
  if (!email || !password)
    res.status(400).json({ message: 'Email and Password is required!' });
  // 3. find user with email
  const foundUser = await UserModel.findOne({ email });
  // 4. check if no found
  // return 401 if not same
  if (!foundUser) res.status(400).json({ message: 'User not found' });
  // 5. compare the found password
  // return 401 if not same
  const isSame = await bcrypt.compare(password, foundUser.password);
  if (!isSame)
    res.status(401).message({ message: 'email or password is wrong!' });
  // 6. create refresh and access token
  const refreshToken = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '1d',
  });
  const accessToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '900',
  });
  // 7. update user with refresh token
  try {
    await UserModel.updateOne({ email: foundUser.email }, { refreshToken });
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // 8. return user data with access token
    res
      .status(200)
      .json({ email: foundUser.email, roles: foundUser.roles, accessToken });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.handleLogout = async (req, res, next) => {
  // 1. get the jwt cookie
  const cookies = req.cookies;
  // 2. find the user with the cookie
  const foundUser = await UserModel.findOne({ refreshToken: cookies.jwt });
  // 3. check if the user exist
  // if not then return 401
  if (!foundUser) res.status(401).json({ message: 'User not found!' });
  // 4. clear cookies from http
  res.clearCookie('jwt');
  // 5. clear jwt from db
  try {
    await UserModel.updateOne(
      { refreshToken: cookies.jwt },
      { refreshToken: '' }
    );
    res.sendStatus(205);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
};

exports.handleRefreshToken = async (req, res, next) => {
  // 1. get the jwt toke
  const cookies = req.cookies;
  //   console.log(cookies);
  try {
    // 2. find user with jwt
    const foundUser = await UserModel.findOne({ refreshToken: cookies.jwt });
    // console.log(foundUser, 'user');
    // 3. check if user exist
    if (!foundUser) res.status(401).json({ message: 'User not found!' });
    // 4. verify the jwt with user
    jwt.verify(
      cookies.jwt,
      //   foundUser.refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        // if error return 401
        // console.log(decoded, 'decoded');
        if (err || decoded.email !== foundUser.email) {
          res.status(401).json({ message: 'User not authorized!' });
        }

        // 5. gen new refresh token
        const accessToken = jwt.sign(
          { email: foundUser.email },
          process.env.JWT_ACCESS_SECRET
        );

        // 6. send new access token to user
        res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
