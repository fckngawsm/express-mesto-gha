const jwt = require('jsonwebtoken');
const { HTTPResponSestatusCodes } = require("../utils/constants");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(HTTPResponSestatusCodes.NOT_FOUND)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(HTTPResponSestatusCodes.NOT_FOUND)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

