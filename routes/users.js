const router = require("express").Router();

const { getUsers } = require("../controlers/users.js");
const { postUsers } = require("../controlers/users.js");
const { getUsersByID } = require("../controlers/users.js");

router.get("/", getUsers);
router.get("/:id", getUsersByID);
router.post("/", postUsers);

module.exports = router;
