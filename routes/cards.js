const router = require("express").Router();
// переделать в {get,post,del} = req.....
const { getCards } = require("../controlers/cards.js");
const { postCards } = require("../controlers/cards.js");
const { deleteCards } = require("../controlers/cards.js");

router.get("/", getCards);
router.post("/", postCards);
router.delete("/:id", deleteCards);

module.exports = router;
