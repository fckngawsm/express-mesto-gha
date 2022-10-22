const router = require('express').Router();

const {
  getUsers,
  postUsers,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
} = require('../controlers/users');

router.patch('/me/avatar', updateUsersAvatar);
router.patch('/me', updateUsers);
router.get('/', getUsers);
router.get('/:id', getUsersByID);
router.post('/', postUsers);

module.exports = router;
