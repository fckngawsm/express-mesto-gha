const { mongoose } = require("mongoose");
const Cards = require("../models/card");
// log all cards
const getCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch(next);
};
// create card
const postCards = (req, res , next) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Cards.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Ошибка валидации"));
      }
      send({ message: "На сервере произошла ошибка" });
    })
    .catch(next);
};
// delete card by id
const deleteCards = (req, res , next) => {
  Cards.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new BadRequestError("Недостаточно прав для выполнения операции");
      }
      if (card === null) {
        throw new NotFound(`Нет карточки с id ${req.params.id}`);
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFound(`Некорректно указан id ${req.params.id}`);
      }
    })
    .catch(next);
};
// like card
const likeCard = (req, res , next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not found"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === "Not found") {
        throw new NotFound(`Нет карточки с id ${req.params.id}`);
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFound(`Нет карточки с id ${req.params.id}`);
      }
    })
    .catch(next);
};
// dislike card
const dislikeCard = (req, res , next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error("Not found"))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === "Not found") {
        next(new NotFound(`Нет карточки с id ${req.params.id}`));
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFound(`Некорректно указан id ${req.params.id}`);
      }
    })
    .catch(next);
};
module.exports = {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
