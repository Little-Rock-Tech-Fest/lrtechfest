var express = require('express');
var router = express.Router();

var years = ["2018", "2017", "2016", "2015", "2014"];

/* GET event pages */
router.get('/', function (req, res) {
	res.render('pastyearlist', { years: years });
});

router.get("/:year", function (req, res) {
	var year = req.params.year;
	var speakers = require('../archive/'+year+'/speakers.json');
	var sponsors = require('../archive/'+year+'/sponsors.json');
	res.render('pastyear', {speakers: speakers, sponsors: sponsors, year: year});
});

module.exports = router;