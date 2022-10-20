const router = require("express").Router();

const { getCards, postCards, deleteCards } = require("../controlers/cards.js");

router.get("/", getCards);
router.post("/", postCards);
router.delete("/:id", deleteCards);

module.exports = router;
