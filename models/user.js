/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// err
const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
      required: false,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
      required: false,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      required: false,
      validate: {
        validator: (link) => /^(http|https):\/\/(www\.)?([A-Za-z0-9\.\-]+)(((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g.test(link),
        message: 'Невалидная ссылка',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'Невалидный email',
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);
userSchema.statics.findUserByCredentials = (email, password) => this.findOne({ email }).select('+password')
  .then((user) => {
    if (!user) {
      return Promise.reject(new UnauthorizedError('Неправильные email или пароль'));
    }
    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Неправильные email или пароль'));
        }
        return user;
      });
  });
module.exports = mongoose.model('user', userSchema);
