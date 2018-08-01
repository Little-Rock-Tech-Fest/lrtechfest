var express = require('express');
var router = express.Router();

//topics route
var fs = require('fs');
var Q = require('q');

//create a promise-compatible readfile method
var fs_readFile = Q.denodeify(fs.readFile);

var slugs = require('slugs');
var _ = require('lodash');

router.get('/', function(req, res){
	var sponsors = require('../sponsors.json');
	var photos = require('../gallery.json')
	res.render('index', {title: 'Little Rock Tech Fest', sponsors:sponsors, photos:photos});
});

router.get('/resources', function(req, res){
	res.render('resources');
});

router.get("/programs/:year", function (req, res) {
	res.download("public/programs/program-" + req.params.year + ".pdf", function (err) {
		if (err) {
			res.status(404).render('404');
		}
	});
});

module.exports = router;
