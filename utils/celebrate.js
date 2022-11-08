/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');
// cards
const celebrateCreateCards = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(/^(http|https):\/\/(www\.)?([A-Za-z0-9\.\-]+)(((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/i).required(),
  }),
});
// cards id
const celebrateValidateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});
// login
const celebrateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
// create
const celebrateSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http|https):\/\/(www\.)?([A-Za-z0-9\.\-]+)(((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/i),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
// get user by id
// const celebrateGetUsersByID = celebrate({
//   params: Joi.object().keys({
//     id: Joi.string().length(24).hex(),
//   }),
// });
// update users avater
const celebrateUsersAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(http|https):\/\/(www\.)?([A-Za-z0-9\.\-]+)(((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/i),
  }),
});
// update users
const celebrateUpdateUsers = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http|https):\/\/(www\.)?([A-Za-z0-9\.\-]+)(((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/i),
  }),
});

module.exports = {
  celebrateSignin,
  celebrateSignup,
  // celebrateGetUsersByID,
  celebrateUsersAvatar,
  celebrateUpdateUsers,
  celebrateCreateCards,
  celebrateValidateId,
};
