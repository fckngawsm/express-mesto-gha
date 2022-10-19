const { mongoose } = require("mongoose");
const Users = require("../models/user.js");

const getUsers = (req, res) => {
  Users.find({})
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере случилас ошибка ", err });
    });
};
const getUsersByID = (req, res) => {
  Users.findById(req.params.id)
    .orFail(new Error("Not found"))
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      if ((err.message = "Not found")) {
        return res
          .status(400)
          .send({ message: "Друг с таким id не найден", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере случилас ошибка ", err });
    });
};

const postUsers = (req, res) => {
  Users.create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере случилас ошибка ", err });
    });
};

module.exports = {
  getUsers,
  postUsers,
  getUsersByID,
};
