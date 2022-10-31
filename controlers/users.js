const { mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const { HTTPResponSestatusCodes } = require("../utils/constants");
// log all users
const getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch(() =>
      res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: "На сервере случилас ошибка " })
    );
};
// log current users
const getUsersByID = (req, res) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        return res
          .status(HTTPResponSestatusCodes.NOT_FOUND)
          .send({ message: `Нет пользователя с id ${req.params.id}` });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: "Передан некорректный id" });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: "На сервере случилас ошибка " });
    });
};
// curr
// log current users
const getCurrentUser = (req, res) => {
  Users.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(HTTPResponSestatusCodes.NOT_FOUND)
          .send({ message: `Нет пользователя с id ${req.params.id}` });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: "Передан некорректный id" });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: "На сервере случилась ошибка " });
    });
};
// create users
const createUser = (req, res) => {
  const { name, about, avatar, password, email } = req.body;
  console.log('u create user')
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      Users.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: "Ошибка валидации" });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: "На сервере произошла ошибка" });
    });
};
// update profile
const updateUsers = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  Users.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: "Ошибка валидации" });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: "На сервере произошла ошибка" });
    });
};
// update avatar
const updateUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  Users.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: "Ошибка валидации" });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: "На сервере произошла ошибка" });
    });
};
// login user
const loginUser = (req, res) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: "635056510deb5bf198ecb622" },
        "some-secret-key",
        { expiresIn: "7d" }
      );
      res.send({ token });
    })
    .catch((err) => {
      res.status(HTTPResponSestatusCodes.NOT_FOUND).send({ message: err.message });
    });
};
module.exports = {
  getUsers,
  createUser,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
  loginUser,
  getCurrentUser
};
