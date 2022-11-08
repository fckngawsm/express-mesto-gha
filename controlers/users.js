const { mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
// err
const BadRequestError = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-err');
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
        throw new NotFound('Нет пользователя с таким id');
      }
      return res.send({ data: user });
    })
    .catch(next);
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
    .then((user) => res.send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Ошибка валидации'));
      }
      if (err.name === 'MongoError' || err.code === 11000) {
        return next(new ConflictError('Почта уже зарегестрирована'));
      }
      return next(err);
    });
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
        return next(new BadRequestError('Ошибка валидации'));
      }
      return next(err);
    });
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
        return next(BadRequestError('Ошибка валидации'));
      }
      return next(err);
    });
};
// login user
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      if (user || email) {
        const token = jwt.sign({ _id: user._id }, 'secret-key', {
          expiresIn: '7d',
        });
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          })
          .send({ message: 'Авторизация прошла успешно!' });
      }
      throw new UnauthorizedError('Такого логина или пароля не существует!');
    })
    .catch(next);
};
// log current users
const getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорретный Id'));
      }
      return next(err);
    });
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
