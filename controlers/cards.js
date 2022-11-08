const { mongoose } = require('mongoose');
const Cards = require('../models/card');
// err
const BadRequestError = require('../errors/bad-request-err');
const NotFound = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
// log all cards
const getCards = (req, res, next) => {
  Cards.find({})
    .then((card) => res.send(card))
    .catch(next);
};
// create card
const postCards = (req, res, next) => {
  const { name, link } = req.body;

  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка валидации'));
      }
      return next(err);
    })
    .catch(next);
};
// delete card by id
const deleteCards = (req, res, next) => {
  Cards.findById(req.params.id)
    .orFail()
    .catch(() => {
      throw new NotFound('Нет карточки с таким id');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для выполнения операции');
      }
      Cards.findByIdAndDelete(req.params.id)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
    })
    .catch(next);
};
// like card
const likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'Not found') {
        throw new NotFound(`Нет карточки с id ${req.params.id}`);
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFound(`Нет карточки с id ${req.params.id}`);
      }
      return next(err);
    });
};
// dislike card
const dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not found'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'Not found') {
        next(new NotFound(`Нет карточки с id ${req.params.id}`));
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new NotFound(`Некорректно указан id ${req.params.id}`);
      }
      return next(err);
    });
};
module.exports = {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
