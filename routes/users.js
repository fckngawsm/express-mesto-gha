const router = require('express').Router();
const {
  getUsers,
  // createUser,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
  getCurrentUser
  // loginUser,
} = require('../controlers/users');

router.patch('/me/avatar', updateUsersAvatar);
router.patch('/me', updateUsers);
router.get('/', getUsers);
router.get('/me' , getCurrentUser)
// router.post('/', postUsers);


module.exports = router;
