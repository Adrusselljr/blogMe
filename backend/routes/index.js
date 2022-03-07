var express = require('express');
var router = express.Router();

const array = [1, 2, 3, 4, 5]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'BlogMe', data: array });
});

module.exports = router;
