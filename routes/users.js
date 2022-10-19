const router = require('express').Router();

const Users = require('../models/user.js');

const getUsers = require('../controlers/users.js')

router.get('/users' , getUsers )

module.exports = router

