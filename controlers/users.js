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
      if (user === null) {
        return res
          .status(404)
          .send({ message: `Нет пользователя с id ${req.params.id}` });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (!err.messageFormat) {
        return res
          .status(404)
          .send({ message: `Нет карточки с id ${req.params.cardId}` });
      }
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
// create users
const postUsers = (req, res) => {
  const { name, about, avatar } = req.body;

  Users.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
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
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
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
