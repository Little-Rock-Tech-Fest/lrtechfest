var express = require('express');
var router = express.Router();

/* GET sponsors pages */
router.get('/', function(req, res, next) {
	res.render('sponsors');
});
router.get('/yes-i-want-to-sponsor-2018', function(req, res){
	res.render('sponsors-yes-for-2018');
});
router.get('/remove-me', function(req, res){
	res.render('sponsors-no-thanks');
});

module.exports = router;
