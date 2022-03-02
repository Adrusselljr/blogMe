const express = require('express');
const router = express.Router();
const { createUser, userLogin, updateUser } = require('./controller/userController')
const { checkIsEmpty, validateCreateUser, validateLoginUser, validateUpdateUser, jwtMiddleware } = require('../lib/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from usersRouter!')
})

router.post('/create-user', checkIsEmpty, validateCreateUser, createUser)
router.post('/login', checkIsEmpty, validateLoginUser, userLogin)
router.put('/update-profile', jwtMiddleware, checkIsEmpty, validateUpdateUser, updateUser)

module.exports = router