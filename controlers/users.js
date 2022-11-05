const { mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
// err
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const InternalServer = require('../errors/internal-server-err');
const ConflictError  = require('../errors/conflict-error');
// log all users
const getUsers = (req, res, next) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(next);
};
// log current users
const getUsersByID = (req, res, next) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        throw new NotFound(`Нет пользователя с id ${req.params.id}`);
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFound(`Нет пользователя с id ${req.params.id}`);
      }
      return next(err);
    });
};
// create users
const createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      }
      if (err.code === 11000) {
        return next(new ConflictError('Почта уже зарегестрирована'));
      }
    })
    .catch(next);
};
// update profile
const updateUsers = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  Users.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequest('Ошибка валидации');
      }
    })
    .catch(next);
};
// update avatar
const updateUsersAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;
  Users.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequest('Ошибка валидации');
      }
    })
    .catch(next);
};
// login user
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Авторизация прошла успешно!' });
    })
    .catch(() => next(new BadRequestError('Неправильный email или пароль')));
};
// log current users
const getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail()
    .then((currentUser) => res.send({ currentUser }))
    .catch(() => {
      throw new NotFound('Пользователь с таким id не найден');
    })
    .catch(next);
};
module.exports = {
  getUsers,
  createUser,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
  loginUser,
  getCurrentUser,
};
