const { mongoose } = require("mongoose");
const user = require("../models/user.js");
const Users = require("../models/user.js");
// log all users
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
// log users by id
const getUsersByID = (req, res) => {
  Users.findById(req.params.id)
    .orFail(new Error("Not found"))
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      if ((err.message = "Not found")) {
        return res
          .status(404)
          .send({ message: "Друг с таким id не найден", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере случилас ошибка ", err });
    });
};
// create users
const postUsers = (req, res) => {
  Users.create(req.body)
  .then((card) => {
    return res.status(201).send(card);
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: "Ошибка валидации", err });
    }
    return res
      .status(500)
      .send({ message: "На сервере случилась ошибка ", err });
  });
};
// update profile
const updateUsers = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  Users.findByIdAndUpdate(id, { name, about }, { new: true })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере случилась ошибка ", err });
    });
};
// update avatar
const updateUsersAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;
  Users.findByIdAndUpdate(id, { avatar }, { new: true })
    .then((user) => {
      return res.statuw(200).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};
module.exports = {
  getUsers,
  postUsers,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
};
