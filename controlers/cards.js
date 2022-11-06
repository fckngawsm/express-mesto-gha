const { mongoose } = require("mongoose");
const Cards = require("../models/card");
// err
const BadRequestError = require("../errors/bad-request-err");
const NotFound = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const card = require("../models/card");
// log all cards
const getCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch(next);
};
// create card
const postCards = (req, res, next) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Cards.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Ошибка валидации"));
      }
    })
    .catch(next);
};
// delete card by id
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Cards.findById(cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Cards.findByIdAndRemove(cardId).then(() => res.status(200).send(card));
      } else {
        throw new ForbiddenError('Это чужая карточка!');
      }
    })
    .catch(next);
};
// like card
const likeCard = (req, res, next) => {
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
const dislikeCard = (req, res, next) => {
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
