const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, deletePost, updatePost } = require('./controller/postController')
const { jwtMiddleware, checkIsEmpty } = require('../lib/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from postsRouter!')
})

router.post('/create-post', checkIsEmpty, jwtMiddleware, createPost)
router.get('/get-all-posts', getAllPosts)
router.delete('/delete-post/:id', jwtMiddleware, deletePost)
router.put('/update-post', checkIsEmpty, jwtMiddleware, updatePost)

module.exports = router