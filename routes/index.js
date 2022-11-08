const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const cardRouter = require('./cards');

router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardRouter);

module.exports = router;
