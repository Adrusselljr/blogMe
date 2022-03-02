const express = require('express');
const router = express.Router();
const { createPost } = require('./controller/postController')
const { jwtMiddleware, checkIsEmpty } = require('../lib/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from postsRouter!')
})

router.post('/create-post', checkIsEmpty, jwtMiddleware, createPost)

module.exports = router