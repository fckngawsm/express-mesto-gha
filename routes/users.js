const router = require("express").Router();
const {
  celebrateGetUsersByID,
  celebrateUsersAvatar ,
  celebrateUpdateUsers
} = require("../utils/celebrate")
const {
  getUsers,
  getUsersByID,
  updateUsers,
  updateUsersAvatar,
  getCurrentUser,
} = require("../controlers/users");
router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get(
  "/:id",
  celebrateGetUsersByID,
  getUsersByID
);
router.patch(
  "/me/avatar",
  celebrateUsersAvatar,
  updateUsersAvatar
);
router.patch(
  "/me",
  celebrateUpdateUsers,
  updateUsers
);
module.exports = router;
