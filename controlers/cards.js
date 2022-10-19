const { mongoose } = require("mongoose");
const Cards = require("../models/card.js");
// сделать нормальную обработку ошибок + доделать в целом задание
const getCards = (req, res) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "На сервере случилас ошибка ", err });
    });
};

const postCards = (req, res) => {
  Cards.create(req.body)
    .then((card) => {
      res.status(201).send(card);
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
// проверить работает ли
const deleteCards = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId).then((card) => {
    return res
      .status(200)
      .send({ message: `Карточка с id ${req.params.cardId} удалена` });
  });
};

module.exports = {
  getCards,
  postCards,
  deleteCards,
};
