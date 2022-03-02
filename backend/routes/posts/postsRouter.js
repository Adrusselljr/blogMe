const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, deletePost } = require('./controller/postController')
const { jwtMiddleware, checkIsEmpty } = require('../lib/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from postsRouter!')
})

router.post('/create-post', checkIsEmpty, jwtMiddleware, createPost)
router.get('/get-all-posts', jwtMiddleware, getAllPosts)
router.delete('/delete-post/:id', jwtMiddleware, deletePost)

module.exports = router