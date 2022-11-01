const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
  getCurrentUser,
} = require("../controlers/users");

router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(8),
    }),
  }),
  updateUsersAvatar
);
router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().required().min(8),
    }),
  }),
  updateUsers
);
router.get("/me",  celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUsersByID);
router.get("/", getUsers);
router.get("/me", getCurrentUser);
// router.post('/', postUsers);


// сделать с помощью регулярного выражения pattern для ссылки
module.exports = router;
