const router = require("express").Router();
const {
  celebrateCreateCards,
  celebrateValidateId,
} = require("../utils/celebrate");
const {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require("../controlers/cards");
router.get("/", getCards);
router.post("/", celebrateCreateCards, postCards);
router.delete("/:id",celebrateValidateId, deleteCards);
router.delete("/:id/likes",celebrateValidateId, dislikeCard);
router.put("/:id/likes",celebrateValidateId, likeCard);

module.exports = router;
