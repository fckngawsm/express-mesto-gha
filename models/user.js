const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Жак-Ив Кусто",
      required: false,
    },
    about: {
      type: String,
      minlength: 2,
      name : "Исследователь",
      maxlength: 30,
      required: false,
    },
    avatar: {
      type: String,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      // validator?
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
