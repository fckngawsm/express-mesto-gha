const router = require('express').Router();
const {
  celebrateValidateId,
  celebrateUsersAvatar,
  celebrateUpdateUsers,
} = require('../utils/celebrate');
const {
  getUsers,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
  getCurrentUser,
} = require('../controlers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get(
  '/:id',
  celebrateValidateId,
  getUsersByID,
);
router.patch(
  '/me/avatar',
  celebrateUsersAvatar,
  updateUsersAvatar,
);
router.patch(
  '/me',
  celebrateUpdateUsers,
  updateUsers,
);
module.exports = router;
