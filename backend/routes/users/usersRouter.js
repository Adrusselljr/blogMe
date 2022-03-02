const express = require('express');
const router = express.Router();
const { createUser } = require('./controller/userController')
const { checkIsEmpty, validateCreate } = require('../lib/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from usersRouter!')
})

router.post('/create-user', checkIsEmpty, validateCreate, createUser)

module.exports = router