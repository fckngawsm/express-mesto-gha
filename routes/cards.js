const router = require('express').Router();

const {
  getCards,
  postCards,
  deleteCards,
  likeCard,
  dislikeCard,
} = require('../controlers/cards');

router.delete('/:id/likes', dislikeCard);
router.put('/:id/likes', likeCard);
router.get('/', getCards);
router.post('/', postCards);
router.delete('/:id', deleteCards);

module.exports = router;
