const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
/* eslint linebreak-style: ["error", "windows"] */
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
