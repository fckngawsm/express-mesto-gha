const { mongoose } = require("mongoose");
const Cards = require("../models/card.js");
// log all cards
const getCards = (req, res) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: "Ошибка валидации", err });
      }
      return res
        .status(500)
        .send({ message: "На сервере случилась ошибка ", err });
    });
};
// create card
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
        .send({ message: "На сервере случилась ошибка ", err });
    });
};
// delete card by id
const deleteCards = (req, res) => {
  Cards.findByIdAndRemove(req.params.id)
  .then((card) => {
    return res
      .status(200)
      .send({ message: `Карточка с id ${(req.params.id)} удалена` });
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: "Некорректно указан id", err });
    }
    return res
      .status(500)
      .send({ message: "На сервере случилас ошибка ", err });
  });
};

module.exports = {
  getCards,
  postCards,
  deleteCards,
};
