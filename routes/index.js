var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { chatURL: 'window.location.hostname + \':8080\'' });
});

module.exports = router;
