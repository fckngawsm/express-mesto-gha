const { mongoose } = require('mongoose');
const BadRequestError = require('../errors/bad-request-err');
const Cards = require('../models/card');
const { HTTPResponSestatusCodes } = require('../utils/constants');
// log all cards
const getCards = (req, res) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch(() => res
      .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
      .send({ message: 'На сервере случилась ошибка ' }));
};
// create card
const postCards = (req, res) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Cards.create({ name, link, owner: id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: 'Ошибка валидации' });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
// delete card by id
const deleteCards = (req, res) => {
  Cards.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new BadRequestError('Недостаточно прав для выполнения операции');
      }
      if (card === null) {
        return res
          .status(HTTPResponSestatusCodes.NOT_FOUND)
          .send({ message: `Нет карточки с id ${req.params.cardId}` });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: 'Некорректно указан id' });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: 'На сервере случилас ошибка ' });
    });
};
// like card
const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'Not found') {
        return res
          .status(HTTPResponSestatusCodes.NOT_FOUND)
          .send({ message: `Нет карточки с id ${req.params.id}` });
      }
      if (err.name === 'CastError') {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: 'Некорректно указан id' });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
// dislike card
const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'Not found') {
        return res
          .status(HTTPResponSestatusCodes.NOT_FOUND)
          .send({ message: `Нет карточки с id ${req.params.id}` });
      }
      if (err.name === 'CastError') {
        return res
          .status(HTTPResponSestatusCodes.BAD_REQUEST)
          .send({ message: 'Некорректно указан id' });
      }
      return res
        .status(HTTPResponSestatusCodes.INTERNAL_SERVER)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
module.exports = {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
