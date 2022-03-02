const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello World from commentsRouter!')
})

module.exports = router