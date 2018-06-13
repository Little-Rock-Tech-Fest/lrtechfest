var express = require('express');
var router = express.Router();

var MobileDetect = require('mobile-detect');

router.get("/", function (req, res) {

	var mobileDetect = new MobileDetect(req.headers['user-agent']);

	if (mobileDetect.os() === 'iOS') {
		res.redirect('https://itunes.apple.com/us/app/beaconsage/id1028104284?mt=8');
	}
	else if (mobileDetect.os() === 'AndroidOS') {
		res.redirect('https://play.google.com/store/apps/details?id=beaconsage.net.aristotle&hl=en');
	}
	else {
		res.render('app');
	}

});

module.exports = router;
