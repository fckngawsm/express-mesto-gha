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
// delete card by id
const deleteCards = (req, res) => {
  Cards.findByIdAndRemove(req.params.id)
    .then((card) => {
      return res
        .status(200)
        .send({ message: `Карточка с id ${req.params.id} удалена` });
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
// like card
const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not found"))
    .then((card) => {
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if ((err.message = "Not found")) {
        return res
          .status(400)
          .send({ message: "Карточка с таким id не найдена", err });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};
// dislike card
const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not found"))
    .then((card) => {
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if ((err.message = "Not found")) {
        return res
          .status(404)
          .send({ message: "карточка с таким id не найдена", err });
      }
      return res.status(500).send({ message: "На сервере произошла ошибка" });
    });
};
module.exports = {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
