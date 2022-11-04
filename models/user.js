const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// err
const UnauthorizedError = require('../errors/unauthorized-err')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: 2,
      default : "Исследователь",
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      required: false,
      validate : {
        validator(url){
          return validator.isURL(url) === true;
        },
        message : 'Укажите валидную ссылку!'
      }
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate : {
        validator(email){
          return validator.isEmail(email) === true;
        },
        message : 'Укажите верную почту!'
      }
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
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные email или пароль' ));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError( 'Неправильные email или пароль' ));
          }
          return user;
        });
    });
};
module.exports = mongoose.model('user', userSchema);
