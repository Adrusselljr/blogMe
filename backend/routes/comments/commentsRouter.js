const express = require('express');
const router = express.Router();
const { createComment, getAllComments, deleteComment, updateComment } = require('./controller/commentController')
const { jwtMiddleware, checkIsEmpty } = require('../lib/index')

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from commentsRouter!')
})

router.post('/create-comment/:id', checkIsEmpty, jwtMiddleware, createComment)
router.get('/get-all-comments', jwtMiddleware, getAllComments)
router.delete('/delete-comment/:id', jwtMiddleware, deleteComment)
router.put('/update-comment', checkIsEmpty, jwtMiddleware, updateComment)

module.exports = router