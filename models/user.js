const mongoose = require('mongoose');
const validator = require('validator');

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
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
