const express = require('express');
const router = express.Router();
const { createUser, userLogin, updateUser } = require('./controller/userController')
const { checkIsEmpty, validateCreate, validateLogin, validateUpdate, jwtMiddleware } = require('../lib/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from usersRouter!')
})

router.post('/create-user', checkIsEmpty, validateCreate, createUser)
router.post('/login', checkIsEmpty, validateLogin, userLogin)
router.put('/update-profile', jwtMiddleware, checkIsEmpty, validateUpdate, updateUser)

module.exports = router